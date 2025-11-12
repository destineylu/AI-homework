/**
 * Problem Classifier
 * Identifies problem types and generates type-specific solving strategies
 */

export enum ProblemType {
  MULTIPLE_CHOICE = "multiple_choice",
  FILL_IN_BLANK = "fill_in_blank",
  CALCULATION = "calculation",
  PROOF = "proof",
  APPLICATION = "application",
  ESSAY = "essay",
  TRUE_FALSE = "true_false",
  UNKNOWN = "unknown",
}

export interface ClassificationResult {
  type: ProblemType;
  confidence: number; // 0-1
  indicators: string[]; // What led to this classification
  strategy: string; // Recommended solving strategy
}

export class ProblemClassifier {
  /**
   * Classify a problem based on its text content
   */
  static classify(problemText: string): ClassificationResult {
    const text = problemText.toLowerCase();
    
    // Check each problem type in order of specificity
    
    // 1. Multiple Choice
    if (this.isMultipleChoice(text)) {
      return {
        type: ProblemType.MULTIPLE_CHOICE,
        confidence: 0.95,
        indicators: ["Contains option markers (A/B/C/D)", "Multiple choice keywords"],
        strategy: this.getTypeSpecificPrompt(ProblemType.MULTIPLE_CHOICE),
      };
    }

    // 2. True/False
    if (this.isTrueFalse(text)) {
      return {
        type: ProblemType.TRUE_FALSE,
        confidence: 0.9,
        indicators: ["True/false question", "判断题"],
        strategy: this.getTypeSpecificPrompt(ProblemType.TRUE_FALSE),
      };
    }

    // 3. Fill in the blank
    if (this.isFillInBlank(text)) {
      return {
        type: ProblemType.FILL_IN_BLANK,
        confidence: 0.85,
        indicators: ["Contains blanks", "填空 keywords"],
        strategy: this.getTypeSpecificPrompt(ProblemType.FILL_IN_BLANK),
      };
    }

    // 4. Proof
    if (this.isProof(text)) {
      return {
        type: ProblemType.PROOF,
        confidence: 0.9,
        indicators: ["Proof keywords", "证明 keywords"],
        strategy: this.getTypeSpecificPrompt(ProblemType.PROOF),
      };
    }

    // 5. Calculation
    if (this.isCalculation(text)) {
      return {
        type: ProblemType.CALCULATION,
        confidence: 0.8,
        indicators: ["Contains numbers", "Calculation keywords"],
        strategy: this.getTypeSpecificPrompt(ProblemType.CALCULATION),
      };
    }

    // 6. Application
    if (this.isApplication(text)) {
      return {
        type: ProblemType.APPLICATION,
        confidence: 0.75,
        indicators: ["Real-world context", "Application keywords"],
        strategy: this.getTypeSpecificPrompt(ProblemType.APPLICATION),
      };
    }

    // 7. Essay
    if (this.isEssay(text)) {
      return {
        type: ProblemType.ESSAY,
        confidence: 0.8,
        indicators: ["Essay keywords", "Requires detailed explanation"],
        strategy: this.getTypeSpecificPrompt(ProblemType.ESSAY),
      };
    }

    // Default: Unknown
    return {
      type: ProblemType.UNKNOWN,
      confidence: 0.5,
      indicators: ["Cannot determine type clearly"],
      strategy: "Analyze the problem carefully and choose appropriate method.",
    };
  }

  /**
   * Check if problem is multiple choice
   */
  private static isMultipleChoice(text: string): boolean {
    const patterns = [
      /[ABCD][\.\)、:：]/,
      /选择题/,
      /单选|多选/,
      /下列.*正确|下列.*错误/,
      /以下.*选项/,
    ];
    return patterns.some(pattern => pattern.test(text));
  }

  /**
   * Check if problem is true/false
   */
  private static isTrueFalse(text: string): boolean {
    const patterns = [
      /判断题/,
      /正确.*错误/,
      /对.*错/,
      /true.*false/i,
      /是否正确/,
    ];
    return patterns.some(pattern => pattern.test(text));
  }

  /**
   * Check if problem is fill in the blank
   */
  private static isFillInBlank(text: string): boolean {
    const patterns = [
      /_{2,}/,        // Multiple underscores
      /_+/,           // Underscores
      /填空/,
      /空/,
      /\[　+\]/,     // Full-width spaces in brackets
      /\(　+\)/,
    ];
    return patterns.some(pattern => pattern.test(text));
  }

  /**
   * Check if problem is a proof question
   */
  private static isProof(text: string): boolean {
    const keywords = [
      "证明", "求证", "推导", "证：", "prove", "proof", 
      "demonstrate", "show that", "验证"
    ];
    return keywords.some(keyword => text.includes(keyword));
  }

  /**
   * Check if problem is a calculation question
   */
  private static isCalculation(text: string): boolean {
    const hasNumbers = /\d+/.test(text);
    const calcKeywords = [
      "计算", "求", "解", "化简", "求值", "等于",
      "多少", "几", "值为", "算出", "calculate", "find", "solve"
    ];
    return hasNumbers && calcKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Check if problem is an application question
   */
  private static isApplication(text: string): boolean {
    const contextKeywords = [
      "小明", "小红", "某人", "某公司", "某工厂",
      "实际", "应用", "情境", "背景", "案例",
      "购买", "销售", "利润", "成本"
    ];
    return contextKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Check if problem is an essay question
   */
  private static isEssay(text: string): boolean {
    const keywords = [
      "简答", "论述", "分析", "说明", "阐述", "谈谈",
      "简述", "概述", "叙述", "描述", "解释",
      "discuss", "explain", "describe", "analyze"
    ];
    return keywords.some(keyword => text.includes(keyword));
  }

  /**
   * Get type-specific solving strategy
   */
  static getTypeSpecificPrompt(type: ProblemType): string {
    switch (type) {
      case ProblemType.MULTIPLE_CHOICE:
        return `这是一道选择题。请：
1. 仔细阅读题干，找出关键信息
2. 逐个分析每个选项
3. 使用排除法排除明显错误的选项
4. 确定正确答案并说明理由
5. 解释为什么其他选项是错误的`;

      case ProblemType.TRUE_FALSE:
        return `这是一道判断题。请：
1. 仔细分析题目陈述
2. 找出关键概念和逻辑关系
3. 判断陈述是否完全正确
4. 给出明确的对或错的答案
5. 详细说明判断依据`;

      case ProblemType.FILL_IN_BLANK:
        return `这是一道填空题。请：
1. 理解句子或问题的完整含义
2. 分析空格处应填入的内容类型
3. 给出准确、简洁的答案
4. 简要说明填写理由
5. 注意答案的格式要求`;

      case ProblemType.CALCULATION:
        return `这是一道计算题。请：
1. 列出所有已知条件
2. 明确求解目标
3. 选择合适的公式或方法
4. 展示完整的计算步骤（包括单位）
5. 将答案代入原式验证
6. 检查答案的合理性`;

      case ProblemType.PROOF:
        return `这是一道证明题。请：
1. 明确要证明的结论
2. 列出已知条件和可用定理
3. 设计证明思路和策略
4. 逐步推导，每步都标明依据
5. 确保逻辑链条完整严密
6. 最后总结证明结论`;

      case ProblemType.APPLICATION:
        return `这是一道应用题。请：
1. 仔细阅读，提取关键信息
2. 理解实际情境和问题背景
3. 建立数学模型或物理模型
4. 分步骤求解
5. 检查答案是否符合实际情况
6. 注意单位和有效数字`;

      case ProblemType.ESSAY:
        return `这是一道简答题。请：
1. 明确问题的核心要点
2. 组织清晰的答题结构
3. 分点作答，要点分明
4. 使用准确的专业术语
5. 逻辑清晰，论述完整
6. 适当举例说明`;

      default:
        return "请仔细分析题目类型，选择合适的解题方法。";
    }
  }

  /**
   * Get subject classification hint
   */
  static getSubjectHint(problemText: string): string {
    const text = problemText.toLowerCase();
    
    const subjects = [
      {
        name: "数学",
        keywords: ["方程", "函数", "导数", "积分", "几何", "代数", "x", "y", "=", "∈"],
      },
      {
        name: "物理",
        keywords: ["速度", "力", "质量", "能量", "电流", "电压", "m/s", "kg", "N", "J"],
      },
      {
        name: "化学",
        keywords: ["化学式", "反应", "mol", "溶液", "酸", "碱", "离子", "元素"],
      },
      {
        name: "语文",
        keywords: ["古诗", "文言文", "修辞", "作者", "中心思想", "段落"],
      },
      {
        name: "英语",
        keywords: ["grammar", "vocabulary", "sentence", "translate", "语法"],
      },
    ];

    for (const subject of subjects) {
      if (subject.keywords.some(keyword => text.includes(keyword))) {
        return `(可能属于${subject.name}学科)`;
      }
    }

    return "";
  }
}
