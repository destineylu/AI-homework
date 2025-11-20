import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * 用户反馈数据结构
 */
export interface AnswerFeedback {
  id: string;
  problemId: string; // 题目ID
  problemText: string; // 题目文本
  originalAnswer: string; // 原始答案
  originalExplanation: string; // 原始解析
  correctedAnswer?: string; // 用户纠正后的答案
  correctedExplanation?: string; // 用户纠正后的解析
  userComment: string; // 用户评论
  rating: number; // 评分 1-5
  feedbackType: "correct" | "incorrect" | "incomplete" | "other"; // 反馈类型
  timestamp: number; // 时间戳
  aiSourceId?: string; // AI源ID
}

/**
 * 错误模式分析结果
 */
export interface ErrorPattern {
  type: string; // 错误类型
  description: string; // 错误描述
  count: number; // 出现次数
  examples: string[]; // 示例
}

/**
 * 反馈统计
 */
export interface FeedbackStats {
  totalFeedbacks: number;
  correctCount: number;
  incorrectCount: number;
  incompleteCount: number;
  averageRating: number;
  errorPatterns: ErrorPattern[];
}

interface FeedbackState {
  feedbacks: AnswerFeedback[];
  
  // 添加反馈
  addFeedback: (feedback: Omit<AnswerFeedback, "id" | "timestamp">) => void;
  
  // 获取所有反馈
  getAllFeedbacks: () => AnswerFeedback[];
  
  // 获取特定题目的反馈
  getFeedbackByProblem: (problemId: string) => AnswerFeedback[];
  
  // 删除反馈
  deleteFeedback: (id: string) => void;
  
  // 清空所有反馈
  clearAllFeedbacks: () => void;
  
  // 获取统计信息
  getStats: () => FeedbackStats;
  
  // 导出反馈数据
  exportFeedbacks: () => string;
  
  // 导入反馈数据
  importFeedbacks: (data: string) => boolean;
}

/**
 * 反馈收集 Store
 */
export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      feedbacks: [],

      addFeedback: (feedback) => {
        const newFeedback: AnswerFeedback = {
          ...feedback,
          id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        };

        set((state) => ({
          feedbacks: [...state.feedbacks, newFeedback],
        }));
      },

      getAllFeedbacks: () => {
        return get().feedbacks;
      },

      getFeedbackByProblem: (problemId) => {
        return get().feedbacks.filter((f) => f.problemId === problemId);
      },

      deleteFeedback: (id) => {
        set((state) => ({
          feedbacks: state.feedbacks.filter((f) => f.id !== id),
        }));
      },

      clearAllFeedbacks: () => {
        set({ feedbacks: [] });
      },

      getStats: () => {
        const feedbacks = get().feedbacks;
        const total = feedbacks.length;

        if (total === 0) {
          return {
            totalFeedbacks: 0,
            correctCount: 0,
            incorrectCount: 0,
            incompleteCount: 0,
            averageRating: 0,
            errorPatterns: [],
          };
        }

        const correctCount = feedbacks.filter(
          (f) => f.feedbackType === "correct"
        ).length;
        const incorrectCount = feedbacks.filter(
          (f) => f.feedbackType === "incorrect"
        ).length;
        const incompleteCount = feedbacks.filter(
          (f) => f.feedbackType === "incomplete"
        ).length;

        const totalRating = feedbacks.reduce((sum, f) => sum + f.rating, 0);
        const averageRating = totalRating / total;

        // 分析错误模式
        const errorPatterns = analyzeErrorPatterns(feedbacks);

        return {
          totalFeedbacks: total,
          correctCount,
          incorrectCount,
          incompleteCount,
          averageRating,
          errorPatterns,
        };
      },

      exportFeedbacks: () => {
        const feedbacks = get().feedbacks;
        return JSON.stringify(feedbacks, null, 2);
      },

      importFeedbacks: (data) => {
        try {
          const importedFeedbacks = JSON.parse(data) as AnswerFeedback[];
          set({ feedbacks: importedFeedbacks });
          return true;
        } catch (error) {
          console.error("导入反馈数据失败:", error);
          return false;
        }
      },
    }),
    {
      name: "feedback-storage",
    }
  )
);

/**
 * 分析错误模式
 */
function analyzeErrorPatterns(feedbacks: AnswerFeedback[]): ErrorPattern[] {
  const patterns: Map<string, ErrorPattern> = new Map();

  // 筛选出错误的反馈
  const errorFeedbacks = feedbacks.filter(
    (f) => f.feedbackType === "incorrect" || f.feedbackType === "incomplete"
  );

  for (const feedback of errorFeedbacks) {
    // 基于用户评论分析错误类型
    const errorType = detectErrorType(feedback.userComment);

    if (patterns.has(errorType)) {
      const pattern = patterns.get(errorType)!;
      pattern.count++;
      if (pattern.examples.length < 3) {
        pattern.examples.push(feedback.userComment);
      }
    } else {
      patterns.set(errorType, {
        type: errorType,
        description: getErrorDescription(errorType),
        count: 1,
        examples: [feedback.userComment],
      });
    }
  }

  // 按出现次数排序
  return Array.from(patterns.values()).sort((a, b) => b.count - a.count);
}

/**
 * 检测错误类型
 */
function detectErrorType(comment: string): string {
  const lower = comment.toLowerCase();

  if (
    lower.includes("计算") ||
    lower.includes("算错") ||
    lower.includes("数值")
  ) {
    return "calculation_error";
  }

  if (
    lower.includes("公式") ||
    lower.includes("方法") ||
    lower.includes("思路")
  ) {
    return "formula_error";
  }

  if (
    lower.includes("单位") ||
    lower.includes("换算") ||
    lower.includes("量纲")
  ) {
    return "unit_error";
  }

  if (
    lower.includes("步骤") ||
    lower.includes("跳") ||
    lower.includes("缺少")
  ) {
    return "missing_steps";
  }

  if (
    lower.includes("验证") ||
    lower.includes("检查") ||
    lower.includes("确认")
  ) {
    return "verification_error";
  }

  if (lower.includes("理解") || lower.includes("题意") || lower.includes("误")) {
    return "misunderstanding";
  }

  if (lower.includes("latex") || lower.includes("公式格式")) {
    return "latex_error";
  }

  return "other";
}

/**
 * 获取错误类型描述
 */
function getErrorDescription(errorType: string): string {
  const descriptions: Record<string, string> = {
    calculation_error: "计算错误：数值计算失误",
    formula_error: "公式错误：使用了错误或不适用的公式",
    unit_error: "单位错误：单位缺失、错误或换算有误",
    missing_steps: "步骤缺失：解题步骤不完整或跳步",
    verification_error: "验证缺失：没有验证答案正确性",
    misunderstanding: "理解错误：误解了题意或条件",
    latex_error: "LaTeX错误：公式格式或语法错误",
    other: "其他错误",
  };

  return descriptions[errorType] || "未知错误类型";
}

/**
 * 生成改进提示词（基于反馈数据）
 */
export function generateImprovedPromptFromFeedback(): string {
  const feedbackStore = useFeedbackStore.getState();
  const stats = feedbackStore.getStats();

  if (stats.errorPatterns.length === 0) {
    return "";
  }

  let promptAddition = "\n\n#### 常见错误提醒（请务必避免）\n";
  promptAddition +=
    "根据用户反馈，以下是历史上常出现的错误，请特别注意：\n\n";

  for (const pattern of stats.errorPatterns.slice(0, 5)) {
    // 只取前5个最常见的
    promptAddition += `- **${pattern.description}**（出现${pattern.count}次）\n`;
    if (pattern.examples.length > 0) {
      promptAddition += `  示例：${pattern.examples[0]}\n`;
    }
  }

  promptAddition += "\n请在解题时特别注意以上问题，确保不会重复这些错误。\n";

  return promptAddition;
}

/**
 * 获取反馈驱动的质量改进建议
 */
export function getFeedbackBasedSuggestions(): string[] {
  const feedbackStore = useFeedbackStore.getState();
  const stats = feedbackStore.getStats();

  const suggestions: string[] = [];

  for (const pattern of stats.errorPatterns.slice(0, 3)) {
    switch (pattern.type) {
      case "calculation_error":
        suggestions.push("建议增加计算步骤的详细展示，每步都要验证");
        break;
      case "formula_error":
        suggestions.push("建议在使用公式前明确说明为什么选择该公式");
        break;
      case "unit_error":
        suggestions.push("建议为所有物理量标注单位，并检查单位换算");
        break;
      case "missing_steps":
        suggestions.push("建议完整展示所有推理步骤，避免跳步");
        break;
      case "verification_error":
        suggestions.push("建议在答案末尾添加验证步骤");
        break;
    }
  }

  return suggestions;
}
