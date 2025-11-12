import type { ProblemSolution } from "@/store/problems-store";

export interface ValidationResult {
  isValid: boolean;
  confidence: number; // 0-1
  issues: string[];
  suggestions: string[];
}

export class AnswerValidator {
  /**
   * 验证答案的完整性和合理性
   */
  static validateSolution(problem: ProblemSolution): ValidationResult {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let confidence = 1.0;

    // 1. 检查答案是否为空
    if (!problem.answer || problem.answer.trim().length === 0) {
      issues.push("答案为空");
      confidence -= 0.5;
    }

    // 2. 检查解析是否为空
    if (!problem.explanation || problem.explanation.trim().length === 0) {
      issues.push("解析为空");
      confidence -= 0.3;
    }

    // 3. 检查LaTeX语法是否平衡
    const latexMatches = problem.answer.match(/\$\$/g) || [];
    const explanationLatexMatches = problem.explanation.match(/\$\$/g) || [];
    const totalLatexMarkers = latexMatches.length + explanationLatexMatches.length;
    
    if (totalLatexMarkers % 2 !== 0) {
      issues.push("LaTeX公式未正确闭合");
      confidence -= 0.2;
    }

    // 4. 检查是否包含占位符或错误标记
    const placeholderPatterns = [
      /\[待补充\]/,
      /\[未完成\]/,
      /\.\.\.(?!\])/,  // ... but not ...]]>
      /TODO/i,
      /FIXME/i,
      /\[ERROR\]/i,
    ];
    
    for (const pattern of placeholderPatterns) {
      if (pattern.test(problem.answer) || pattern.test(problem.explanation)) {
        issues.push("答案包含占位符或未完成标记");
        confidence -= 0.3;
        break;
      }
    }

    // 5. 检查数学题是否包含计算步骤
    if (this.isMathProblem(problem.problem)) {
      const hasCalculation = 
        problem.explanation.includes("=") || 
        problem.explanation.includes("\\frac") ||
        problem.explanation.includes("计算") ||
        problem.explanation.includes("求解");
      
      if (!hasCalculation) {
        suggestions.push("数学题建议包含详细计算步骤");
        confidence -= 0.1;
      }
    }

    // 6. 检查单位一致性（针对物理题）
    if (this.isPhysicsProblem(problem.problem)) {
      const hasUnitInProblem = /\d+\s*(m|kg|s|N|J|W|A|V|Ω|Pa|Hz|°C|K)/i.test(problem.problem);
      const hasUnitInAnswer = /\d+\s*(m|kg|s|N|J|W|A|V|Ω|Pa|Hz|°C|K)/i.test(problem.answer);
      
      if (hasUnitInProblem && !hasUnitInAnswer) {
        suggestions.push("物理题答案建议包含单位");
        confidence -= 0.15;
      }
    }

    // 7. 检查答案长度合理性
    if (problem.answer.length > 1000) {
      suggestions.push("答案过长，可能包含多余内容");
      confidence -= 0.05;
    }

    if (problem.explanation.length < 50 && problem.explanation.length > 0) {
      suggestions.push("解析过短，可能不够详细");
      confidence -= 0.15;
    }

    // 8. 检查是否包含验证步骤（针对计算题）
    if (this.isCalculationProblem(problem.problem)) {
      const hasVerification = 
        problem.explanation.includes("验证") ||
        problem.explanation.includes("代入") ||
        problem.explanation.includes("检查") ||
        problem.explanation.includes("✓") ||
        /将.*代入/i.test(problem.explanation);
      
      if (!hasVerification) {
        suggestions.push("计算题建议添加验证步骤");
        confidence -= 0.1;
      }
    }

    // 9. 检查选择题是否说明理由
    if (this.isMultipleChoice(problem.problem)) {
      const hasReasoning = 
        problem.explanation.includes("因为") ||
        problem.explanation.includes("所以") ||
        problem.explanation.includes("理由") ||
        problem.explanation.includes("选项") ||
        /[ABCD][\s\.:：]/.test(problem.explanation);
      
      if (!hasReasoning && problem.explanation.length < 100) {
        suggestions.push("选择题建议说明选择理由");
        confidence -= 0.1;
      }
    }

    // 10. 检查公式完整性
    const hasBrokenFormula = 
      /\$\$\s*\$\$/.test(problem.answer) || 
      /\$\$\s*\$\$/.test(problem.explanation);
    
    if (hasBrokenFormula) {
      issues.push("存在空的LaTeX公式块");
      confidence -= 0.15;
    }

    return {
      isValid: confidence > 0.5,
      confidence: Math.max(0, Math.min(1, confidence)),
      issues,
      suggestions,
    };
  }

  /**
   * 判断是否为数学题
   */
  private static isMathProblem(problem: string): boolean {
    const mathKeywords = [
      "计算", "求解", "方程", "函数", "导数", "积分",
      "解方程", "化简", "证明", "求值", "solve", "calculate",
      "x", "y", "f(x)", "=", "+", "-", "×", "÷"
    ];
    return mathKeywords.some(keyword => problem.includes(keyword));
  }

  /**
   * 判断是否为物理题
   */
  private static isPhysicsProblem(problem: string): boolean {
    const physicsKeywords = [
      "速度", "加速度", "力", "质量", "能量", "功率",
      "电流", "电压", "电阻", "压强", "密度", "温度",
      "摩擦", "重力", "动能", "势能", "功", "热量",
      "m/s", "kg", "N", "J", "W", "A", "V", "Ω"
    ];
    return physicsKeywords.some(keyword => problem.includes(keyword));
  }

  /**
   * 判断是否为计算题
   */
  private static isCalculationProblem(problem: string): boolean {
    const calcKeywords = [
      "计算", "求", "解", "化简", "求值",
      "等于", "多少", "几", "值为"
    ];
    const hasNumber = /\d+/.test(problem);
    return hasNumber && calcKeywords.some(keyword => problem.includes(keyword));
  }

  /**
   * 判断是否为选择题
   */
  private static isMultipleChoice(problem: string): boolean {
    return (
      /[ABCD][\.\)、]/.test(problem) || 
      /选择题/.test(problem) ||
      /单选|多选/.test(problem)
    );
  }

  /**
   * 对低置信度的答案生成改进建议
   */
  static generateImprovementPrompt(validation: ValidationResult): string {
    if (validation.confidence > 0.8) {
      return "";
    }

    let prompt = "请改进以下问题：\n\n";
    
    if (validation.issues.length > 0) {
      prompt += "**发现的问题：**\n";
      validation.issues.forEach(issue => {
        prompt += `- ${issue}\n`;
      });
      prompt += "\n";
    }

    if (validation.suggestions.length > 0) {
      prompt += "**改进建议：**\n";
      validation.suggestions.forEach(suggestion => {
        prompt += `- ${suggestion}\n`;
      });
      prompt += "\n";
    }

    prompt += "请重新生成答案，确保：\n";
    prompt += "1. 步骤完整，逻辑清晰\n";
    prompt += "2. 包含必要的验证过程\n";
    prompt += "3. 公式格式正确\n";
    prompt += "4. 答案准确且格式规范\n";

    return prompt;
  }

  /**
   * 生成置信度标签用于UI显示
   */
  static getConfidenceBadge(confidence: number): {
    level: "high" | "medium" | "low";
    label: string;
    color: string;
  } {
    if (confidence >= 0.8) {
      return { level: "high", label: "高质量", color: "green" };
    } else if (confidence >= 0.6) {
      return { level: "medium", label: "中等质量", color: "yellow" };
    } else {
      return { level: "low", label: "需要改进", color: "red" };
    }
  }
}
