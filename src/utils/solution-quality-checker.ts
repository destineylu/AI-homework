import type { ProblemSolution } from "@/store/problems-store";

/**
 * 答案质量评估结果
 */
export interface QualityValidation {
  isValid: boolean;
  confidence: number; // 0-1 置信度分数
  issues: QualityIssue[];
  suggestions: string[];
}

export interface QualityIssue {
  type: "latex" | "length" | "structure" | "verification" | "unit";
  severity: "error" | "warning";
  message: string;
  location?: string;
}

/**
 * 答案质量检查器
 * 用于验证和改进 AI 生成的解题答案
 */
export class SolutionQualityChecker {
  /**
   * 验证单个题目的解答质量
   */
  static validate(problem: ProblemSolution): QualityValidation {
    const issues: QualityIssue[] = [];
    let confidence = 1.0;

    // 1. 检查基本长度
    if (!problem.answer || problem.answer.trim().length < 1) {
      issues.push({
        type: "length",
        severity: "error",
        message: "答案为空",
      });
      confidence = 0;
    }

    if (!problem.explanation || problem.explanation.trim().length < 20) {
      issues.push({
        type: "length",
        severity: "warning",
        message: "解析过短，可能不够详细",
      });
      confidence -= 0.2;
    }

    // 2. 检查 LaTeX 语法
    const latexIssues = this.validateLatexSyntax(
      problem.answer + " " + problem.explanation
    );
    issues.push(...latexIssues);
    confidence -= latexIssues.length * 0.1;

    // 3. 检查是否包含验证步骤（对于计算题）
    if (this.isCalculationProblem(problem.problem)) {
      if (!this.hasVerificationStep(problem.explanation)) {
        issues.push({
          type: "verification",
          severity: "warning",
          message: "计算题缺少答案验证步骤",
        });
        confidence -= 0.15;
      }
    }

    // 4. 检查单位一致性（对于物理题）
    if (this.isPhysicsProblem(problem.problem)) {
      const unitIssues = this.checkUnitConsistency(problem.explanation);
      issues.push(...unitIssues);
      confidence -= unitIssues.length * 0.1;
    }

    // 5. 检查结构完整性
    if (!this.hasStructuredExplanation(problem.explanation)) {
      issues.push({
        type: "structure",
        severity: "warning",
        message: "解析缺少结构化步骤（建议包含：分析、求解、验证）",
      });
      confidence -= 0.1;
    }

    const isValid = !issues.some((i) => i.severity === "error");
    const suggestions = this.generateSuggestions(issues);

    return {
      isValid,
      confidence: Math.max(0, Math.min(1, confidence)),
      issues,
      suggestions,
    };
  }

  /**
   * 验证 LaTeX 语法
   */
  private static validateLatexSyntax(text: string): QualityIssue[] {
    const issues: QualityIssue[] = [];

    // 检查 $$ 是否配对
    const dollarSigns = text.match(/\$\$/g);
    if (dollarSigns && dollarSigns.length % 2 !== 0) {
      issues.push({
        type: "latex",
        severity: "error",
        message: "LaTeX 公式标记 $$ 未配对",
      });
    }

    // 检查 \frac{}{} 是否完整
    const incompleteFrac = /\\frac\{[^}]*\}(?!\{)|\\frac\{[^}]*$/g;
    if (incompleteFrac.test(text)) {
      issues.push({
        type: "latex",
        severity: "error",
        message: "\\frac 命令不完整，缺少分母",
      });
    }

    // 检查括号配对
    const braces = text.match(/[{}]/g) || [];
    let balance = 0;
    for (const brace of braces) {
      balance += brace === "{" ? 1 : -1;
      if (balance < 0) break;
    }
    if (balance !== 0) {
      issues.push({
        type: "latex",
        severity: "error",
        message: "LaTeX 花括号 {} 未配对",
      });
    }

    // 检查常见错误：sqrt 后缺少花括号
    if (/\\sqrt\s+[^{]/.test(text)) {
      issues.push({
        type: "latex",
        severity: "warning",
        message: "\\sqrt 后应使用花括号，如 \\sqrt{x}",
      });
    }

    return issues;
  }

  /**
   * 修复常见的 LaTeX 错误
   */
  static fixCommonLatexErrors(text: string): string {
    let fixed = text;

    // 修复 $$ 后缺少空格
    fixed = fixed.replace(/\$\$([^\s$])/g, "$$ $1");

    // 修复 sqrt 后缺少花括号（简单情况）
    fixed = fixed.replace(/\\sqrt\s+(\w)/g, "\\sqrt{$1}");

    // 移除多余的空格
    fixed = fixed.replace(/\s+/g, " ").trim();

    return fixed;
  }

  /**
   * 检查是否为计算题
   */
  private static isCalculationProblem(problemText: string): boolean {
    const keywords = [
      "计算",
      "求",
      "解方程",
      "calculate",
      "solve",
      "find",
      "=",
      "方程",
    ];
    return keywords.some((kw) =>
      problemText.toLowerCase().includes(kw.toLowerCase())
    );
  }

  /**
   * 检查是否为物理题
   */
  private static isPhysicsProblem(problemText: string): boolean {
    const keywords = [
      "m/s",
      "kg",
      "N",
      "J",
      "W",
      "力",
      "速度",
      "加速度",
      "质量",
      "energy",
      "force",
      "velocity",
    ];
    return keywords.some((kw) => problemText.includes(kw));
  }

  /**
   * 检查是否包含验证步骤
   */
  private static hasVerificationStep(explanation: string): boolean {
    const verificationKeywords = [
      "验证",
      "检验",
      "代入",
      "verify",
      "check",
      "substitute",
      "✓",
      "✔",
    ];
    return verificationKeywords.some((kw) =>
      explanation.toLowerCase().includes(kw.toLowerCase())
    );
  }

  /**
   * 检查是否有结构化解析
   */
  private static hasStructuredExplanation(explanation: string): boolean {
    // 检查是否包含标题或步骤标记
    const structurePatterns = [
      /\*\*.*\*\*/,
      /#{1,3}\s/,
      /第[一二三四五]步/,
      /\d+\./,
      /步骤\s*\d+/,
    ];
    return structurePatterns.some((pattern) => pattern.test(explanation));
  }

  /**
   * 检查单位一致性
   */
  private static checkUnitConsistency(explanation: string): QualityIssue[] {
    const issues: QualityIssue[] = [];

    // 提取所有数值和单位
    const numberUnitPattern = /(\d+\.?\d*)\s*([a-zA-Z/]+)/g;
    const matches = [...explanation.matchAll(numberUnitPattern)];

    // 简单检查：如果有数字但没有单位
    const numbersPattern = /\d+\.?\d*/g;
    const numbers = explanation.match(numbersPattern);
    if (numbers && numbers.length > 3 && matches.length === 0) {
      issues.push({
        type: "unit",
        severity: "warning",
        message: "物理题中发现多个数值，但可能缺少单位标注",
      });
    }

    return issues;
  }

  /**
   * 生成改进建议
   */
  private static generateSuggestions(issues: QualityIssue[]): string[] {
    const suggestions: string[] = [];

    if (issues.some((i) => i.type === "latex")) {
      suggestions.push("建议检查 LaTeX 公式语法，确保所有标记正确配对");
    }

    if (issues.some((i) => i.type === "verification")) {
      suggestions.push("建议在解析末尾添加答案验证步骤，提高可靠性");
    }

    if (issues.some((i) => i.type === "unit")) {
      suggestions.push("建议为所有物理量标注单位，并检查单位换算");
    }

    if (issues.some((i) => i.type === "structure")) {
      suggestions.push(
        "建议使用结构化格式（如：分析条件→制定方案→分步求解→验证答案）"
      );
    }

    return suggestions;
  }

  /**
   * 生成改进提示词
   */
  static generateImprovementPrompt(validation: QualityValidation): string {
    const { issues, suggestions } = validation;

    let prompt = "请改进以下问题：\n\n";

    if (issues.length > 0) {
      prompt += "**发现的问题**：\n";
      issues.forEach((issue, i) => {
        prompt += `${i + 1}. ${issue.message}\n`;
      });
      prompt += "\n";
    }

    if (suggestions.length > 0) {
      prompt += "**改进建议**：\n";
      suggestions.forEach((suggestion, i) => {
        prompt += `${i + 1}. ${suggestion}\n`;
      });
    }

    return prompt;
  }

  /**
   * 批量验证所有题目
   */
  static validateAll(
    problems: ProblemSolution[]
  ): Map<number, QualityValidation> {
    const results = new Map<number, QualityValidation>();

    for (let i = 0; i < problems.length; i++) {
      const problem = problems[i];
      if (problem.answer && problem.explanation) {
        const validation = this.validate(problem);
        results.set(i, validation);
      }
    }

    return results;
  }

  /**
   * 获取总体质量报告
   */
  static generateQualityReport(
    validations: Map<number, QualityValidation>
  ): {
    averageConfidence: number;
    totalIssues: number;
    issuesByType: Record<string, number>;
    lowQualityCount: number;
  } {
    let totalConfidence = 0;
    let totalIssues = 0;
    const issuesByType: Record<string, number> = {};
    let lowQualityCount = 0;

    for (const validation of validations.values()) {
      totalConfidence += validation.confidence;
      totalIssues += validation.issues.length;

      if (validation.confidence < 0.7) {
        lowQualityCount++;
      }

      for (const issue of validation.issues) {
        issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1;
      }
    }

    return {
      averageConfidence:
        validations.size > 0 ? totalConfidence / validations.size : 0,
      totalIssues,
      issuesByType,
      lowQualityCount,
    };
  }
}
