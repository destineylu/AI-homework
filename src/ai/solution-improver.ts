import type { ProblemSolution } from "@/store/problems-store";
import type { AiClient } from "@/store/ai-store";
import { SolutionQualityChecker } from "@/utils/solution-quality-checker";
import { IMPROVE_SYSTEM_PROMPT } from "./prompts";
import { parseImproveResponse } from "./response";

/**
 * 自动重试和改进配置
 */
export interface RetryConfig {
  maxRetries: number; // 最大重试次数
  confidenceThreshold: number; // 置信度阈值（低于此值触发重试）
  enableAutoImprove: boolean; // 是否启用自动改进
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 2,
  confidenceThreshold: 0.6,
  enableAutoImprove: true,
};

/**
 * 答案自动改进器
 * 对低质量答案自动调用 IMPROVE API 进行改进
 */
export class SolutionImprover {
  /**
   * 验证并改进单个答案
   */
  static async validateAndImprove(
    solution: ProblemSolution,
    aiClient: AiClient,
    config: RetryConfig = DEFAULT_RETRY_CONFIG,
    retryCount = 0
  ): Promise<{
    solution: ProblemSolution;
    improved: boolean;
    attempts: number;
  }> {
    // 验证答案质量
    const validation = SolutionQualityChecker.validate(solution);

    // 如果质量足够好或已达最大重试次数，直接返回
    if (
      validation.confidence >= config.confidenceThreshold ||
      retryCount >= config.maxRetries ||
      !config.enableAutoImprove
    ) {
      return {
        solution,
        improved: retryCount > 0,
        attempts: retryCount,
      };
    }

    // 质量不够，尝试改进
    console.log(
      `[SolutionImprover] 答案质量不足 (${(validation.confidence * 100).toFixed(0)}%)，尝试改进 (第${retryCount + 1}次)...`
    );

    try {
      // 生成改进提示词
      const improvementPrompt =
        SolutionQualityChecker.generateImprovementPrompt(validation);

      // 构建改进请求
      const improveRequestXml = `
<improve>
  <problem>
    <![CDATA[${solution.problem}]]>
  </problem>
  <answer>
    <![CDATA[${solution.answer}]]>
  </answer>
  <explanation>
    <![CDATA[${solution.explanation}]]>
  </explanation>
  <user_suggestion>
    <![CDATA[${improvementPrompt}]]>
  </user_suggestion>
</improve>
`;

      // 调用 IMPROVE API
      if (!aiClient.sendChat) {
        throw new Error("AI client does not support chat functionality");
      }
      aiClient.setSystemPrompt(IMPROVE_SYSTEM_PROMPT);
      const improvedText = await aiClient.sendChat([
        { role: "user", content: improveRequestXml }
      ]);

      // 解析改进后的答案
      const improvedResult = parseImproveResponse(improvedText);

      if (improvedResult) {
        const improvedSolution: ProblemSolution = {
          problem: solution.problem, // 保持原问题
          answer: improvedResult.improved_answer,
          explanation: improvedResult.improved_explanation,
        };

        // 递归验证改进后的答案
        return await this.validateAndImprove(
          improvedSolution,
          aiClient,
          config,
          retryCount + 1
        );
      } else {
        console.warn("[SolutionImprover] 改进失败，返回原答案");
        return {
          solution,
          improved: false,
          attempts: retryCount,
        };
      }
    } catch (error) {
      console.error("[SolutionImprover] 改进过程出错:", error);
      return {
        solution,
        improved: false,
        attempts: retryCount,
      };
    }
  }

  /**
   * 批量改进所有低质量答案
   */
  static async batchImprove(
    solutions: ProblemSolution[],
    aiClient: AiClient,
    config: RetryConfig = DEFAULT_RETRY_CONFIG,
    onProgress?: (current: number, total: number) => void
  ): Promise<{
    solutions: ProblemSolution[];
    improvedCount: number;
    totalAttempts: number;
  }> {
    const results: ProblemSolution[] = [];
    let improvedCount = 0;
    let totalAttempts = 0;

    for (let i = 0; i < solutions.length; i++) {
      const solution = solutions[i];

      // 报告进度
      if (onProgress) {
        onProgress(i + 1, solutions.length);
      }

      // 验证并改进
      const result = await this.validateAndImprove(solution, aiClient, config);

      results.push(result.solution);
      if (result.improved) {
        improvedCount++;
      }
      totalAttempts += result.attempts;
    }

    return {
      solutions: results,
      improvedCount,
      totalAttempts,
    };
  }

  /**
   * 检查是否需要改进
   */
  static needsImprovement(
    solution: ProblemSolution,
    threshold: number = 0.6
  ): boolean {
    const validation = SolutionQualityChecker.validate(solution);
    return validation.confidence < threshold;
  }

  /**
   * 获取改进建议（不实际改进）
   */
  static getSuggestions(solution: ProblemSolution): string[] {
    const validation = SolutionQualityChecker.validate(solution);
    return validation.suggestions;
  }

  /**
   * 修复常见错误（快速修复，不调用AI）
   */
  static quickFix(solution: ProblemSolution): ProblemSolution {
    return {
      problem: solution.problem,
      answer: SolutionQualityChecker.fixCommonLatexErrors(solution.answer),
      explanation: SolutionQualityChecker.fixCommonLatexErrors(
        solution.explanation
      ),
    };
  }
}

/**
 * 智能重试策略
 * 根据错误类型选择不同的重试策略
 */
export class SmartRetryStrategy {
  /**
   * 判断是否应该重试
   */
  static shouldRetry(error: Error, attemptCount: number): boolean {
    const maxAttempts = 3;

    if (attemptCount >= maxAttempts) {
      return false;
    }

    // 网络错误：重试
    if (
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("timeout")
    ) {
      return true;
    }

    // API 错误：根据具体错误决定
    if (error.message.includes("API key") || error.message.includes("401")) {
      return false; // 认证错误不重试
    }

    if (error.message.includes("429") || error.message.includes("rate limit")) {
      return true; // 速率限制可以重试
    }

    // 解析错误：可以重试
    if (
      error.message.includes("parsing") ||
      error.message.includes("invalid")
    ) {
      return attemptCount < 2; // 最多重试一次
    }

    return false;
  }

  /**
   * 获取重试延迟（指数退避）
   */
  static getRetryDelay(attemptCount: number): number {
    const baseDelay = 1000; // 1秒
    const maxDelay = 10000; // 最多10秒
    const delay = baseDelay * Math.pow(2, attemptCount);
    return Math.min(delay, maxDelay);
  }

  /**
   * 执行带重试的操作
   */
  static async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string = "操作"
  ): Promise<T> {
    let lastError: Error | null = null;
    let attemptCount = 0;

    while (attemptCount < 3) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        attemptCount++;

        if (!this.shouldRetry(lastError, attemptCount)) {
          throw lastError;
        }

        const delay = this.getRetryDelay(attemptCount);
        console.log(
          `[SmartRetry] ${context}失败，${delay}ms后重试 (${attemptCount}/3)...`
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error(`${context}失败，已达最大重试次数`);
  }
}
