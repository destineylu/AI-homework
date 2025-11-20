/**
 * 学科知识库 (Knowledge Base)
 * 为特定学科提供常用公式、定理和概念
 */

export const MATH_FORMULAS = `
#### 数学常用公式参考

**代数**
- 一元二次方程求根公式：$$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$
- 完全平方公式：$$ (a \\pm b)^2 = a^2 \\pm 2ab + b^2 $$
- 平方差公式：$$ a^2 - b^2 = (a+b)(a-b) $$
- 立方和公式：$$ a^3 + b^3 = (a+b)(a^2 - ab + b^2) $$
- 立方差公式：$$ a^3 - b^3 = (a-b)(a^2 + ab + b^2) $$

**几何**
- 勾股定理：$$ a^2 + b^2 = c^2 $$
- 圆的面积：$$ S = \\pi r^2 $$
- 圆的周长：$$ C = 2\\pi r $$
- 三角形面积：$$ S = \\frac{1}{2}bh $$ 或 $$ S = \\sqrt{s(s-a)(s-b)(s-c)} $$（海伦公式）
- 球的体积：$$ V = \\frac{4}{3}\\pi r^3 $$
- 球的表面积：$$ S = 4\\pi r^2 $$

**三角函数**
- 正弦定理：$$ \\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R $$
- 余弦定理：$$ c^2 = a^2 + b^2 - 2ab\\cos C $$
- 基本关系：$$ \\sin^2\\theta + \\cos^2\\theta = 1 $$
- 和差公式：$$ \\sin(\\alpha \\pm \\beta) = \\sin\\alpha\\cos\\beta \\pm \\cos\\alpha\\sin\\beta $$
- 二倍角公式：$$ \\sin 2\\theta = 2\\sin\\theta\\cos\\theta $$

**导数与积分**
- 幂函数导数：$$ (x^n)' = nx^{n-1} $$
- 指数函数导数：$$ (e^x)' = e^x $$
- 对数函数导数：$$ (\\ln x)' = \\frac{1}{x} $$
- 基本积分：$$ \\int x^n dx = \\frac{x^{n+1}}{n+1} + C $$（n ≠ -1）
`;

export const PHYSICS_FORMULAS = `
#### 物理常用公式参考

**力学**
- 牛顿第二定律：$$ F = ma $$
- 动能：$$ E_k = \\frac{1}{2}mv^2 $$
- 重力势能：$$ E_p = mgh $$
- 功：$$ W = Fs\\cos\\theta $$
- 功率：$$ P = \\frac{W}{t} $$ 或 $$ P = Fv $$
- 动量：$$ p = mv $$
- 冲量：$$ I = Ft $$
- 动量定理：$$ Ft = \\Delta p = m\\Delta v $$

**运动学**
- 匀速直线运动：$$ v = \\frac{s}{t} $$
- 匀变速直线运动：
  - $$ v = v_0 + at $$
  - $$ s = v_0t + \\frac{1}{2}at^2 $$
  - $$ v^2 - v_0^2 = 2as $$
  - $$ \\bar{v} = \\frac{v_0 + v}{2} $$
- 自由落体：$$ h = \\frac{1}{2}gt^2 $$（初速度为0）

**电学**
- 欧姆定律：$$ U = IR $$
- 电功率：$$ P = UI = I^2R = \\frac{U^2}{R} $$
- 电功：$$ W = UIt = Pt $$
- 串联电路：$$ R_{总} = R_1 + R_2 + ... + R_n $$
- 并联电路：$$ \\frac{1}{R_{总}} = \\frac{1}{R_1} + \\frac{1}{R_2} + ... + \\frac{1}{R_n} $$
- 焦耳定律：$$ Q = I^2Rt $$

**热学**
- 热量：$$ Q = cm\\Delta t $$
- 热平衡方程：$$ Q_{吸} = Q_{放} $$

**光学**
- 光速：$$ c = 3 \\times 10^8 \\text{ m/s} $$
- 折射定律：$$ \\frac{\\sin i}{\\sin r} = n $$
- 凸透镜成像：$$ \\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v} $$

**常用物理常数**
- 重力加速度：$$ g \\approx 9.8 \\text{ m/s}^2 $$ 或 $$ 10 \\text{ m/s}^2 $$
- 光速：$$ c = 3 \\times 10^8 \\text{ m/s} $$
`;

export const CHEMISTRY_FORMULAS = `
#### 化学常用知识参考

**化学方程式基础**
- 燃烧反应：$$ \\text{C} + \\text{O}_2 \\rightarrow \\text{CO}_2 $$
- 中和反应：$$ \\text{HCl} + \\text{NaOH} \\rightarrow \\text{NaCl} + \\text{H}_2\\text{O} $$
- 置换反应：$$ \\text{Fe} + \\text{CuSO}_4 \\rightarrow \\text{FeSO}_4 + \\text{Cu} $$

**化学计算**
- 物质的量：$$ n = \\frac{m}{M} $$（n：物质的量(mol)，m：质量(g)，M：摩尔质量(g/mol)）
- 浓度计算：$$ c = \\frac{n}{V} $$（c：浓度(mol/L)，n：物质的量(mol)，V：体积(L)）
- 质量分数：$$ w = \\frac{m_{溶质}}{m_{溶液}} \\times 100\\% $$
- 气体体积：$$ V = nV_m $$（标准状况下，$$ V_m = 22.4 \\text{ L/mol} $$）

**常见元素符号**
- H(氢)、C(碳)、N(氮)、O(氧)、S(硫)、Cl(氯)
- Na(钠)、Mg(镁)、Al(铝)、Fe(铁)、Cu(铜)、Zn(锌)

**化合价规则**
- 金属正价，非金属负价
- 氢+1，氧-2
- 化合物中正负化合价代数和为0
`;

export const ENGLISH_GRAMMAR = `
#### 英语语法参考

**时态**
- 一般现在时：主语 + 动词原形/第三人称单数
- 一般过去时：主语 + 动词过去式
- 现在进行时：主语 + am/is/are + 动词-ing
- 现在完成时：主语 + have/has + 过去分词
- 将来时：主语 + will + 动词原形

**句型结构**
- 主谓宾：Subject + Verb + Object
- 主系表：Subject + Be + Complement
- 被动语态：be + 过去分词 + by

**常见语法点**
- 可数名词复数：加-s/-es
- 比较级：-er/more + 原级
- 最高级：-est/most + 原级
- 冠词：a/an（不定冠词），the（定冠词）
`;

/**
 * 学科检测器
 */
export class SubjectDetector {
  /**
   * 检测题目所属学科
   */
  static detectSubject(problemText: string): string[] {
    const text = problemText.toLowerCase();
    const subjects: string[] = [];

    // 数学关键词
    const mathKeywords = [
      "方程",
      "函数",
      "导数",
      "积分",
      "几何",
      "三角",
      "代数",
      "概率",
      "统计",
      "equation",
      "function",
      "derivative",
      "integral",
      "solve",
      "calculate",
      "√",
      "∫",
      "∑",
      "π",
    ];
    if (mathKeywords.some((kw) => text.includes(kw))) {
      subjects.push("math");
    }

    // 物理关键词
    const physicsKeywords = [
      "m/s",
      "kg",
      "牛顿",
      "力",
      "速度",
      "加速度",
      "能量",
      "功率",
      "电流",
      "电压",
      "电阻",
      "光",
      "波",
      "newton",
      "force",
      "velocity",
      "energy",
      "power",
      "current",
      "voltage",
      "resistance",
    ];
    if (physicsKeywords.some((kw) => text.includes(kw))) {
      subjects.push("physics");
    }

    // 化学关键词
    const chemistryKeywords = [
      "mol",
      "反应",
      "溶液",
      "酸",
      "碱",
      "氧化",
      "还原",
      "化学式",
      "元素",
      "h2o",
      "co2",
      "nacl",
      "reaction",
      "solution",
      "acid",
      "base",
      "oxidation",
      "element",
    ];
    if (chemistryKeywords.some((kw) => text.includes(kw))) {
      subjects.push("chemistry");
    }

    // 英语关键词（文法题）
    const englishKeywords = [
      "grammar",
      "tense",
      "verb",
      "noun",
      "adjective",
      "translate",
      "时态",
      "语法",
      "翻译",
      "单词",
      "句子",
    ];
    if (englishKeywords.some((kw) => text.includes(kw))) {
      subjects.push("english");
    }

    return subjects;
  }

  /**
   * 获取学科对应的知识库
   */
  static getKnowledgeBase(subjects: string[]): string {
    let knowledgeBase = "";

    for (const subject of subjects) {
      switch (subject) {
        case "math":
          knowledgeBase += MATH_FORMULAS + "\n\n";
          break;
        case "physics":
          knowledgeBase += PHYSICS_FORMULAS + "\n\n";
          break;
        case "chemistry":
          knowledgeBase += CHEMISTRY_FORMULAS + "\n\n";
          break;
        case "english":
          knowledgeBase += ENGLISH_GRAMMAR + "\n\n";
          break;
      }
    }

    return knowledgeBase.trim();
  }

  /**
   * 增强提示词（注入知识库）
   */
  static enhancePrompt(basePrompt: string, problemText: string): string {
    const subjects = this.detectSubject(problemText);

    if (subjects.length === 0) {
      return basePrompt; // 无法识别学科，返回原提示词
    }

    const knowledgeBase = this.getKnowledgeBase(subjects);

    if (!knowledgeBase) {
      return basePrompt;
    }

    // 在提示词末尾注入知识库
    return `${basePrompt}

---

#### 相关公式与知识参考
检测到题目可能涉及：**${subjects.join("、")}**

${knowledgeBase}

**注意**：
- 以上公式仅供参考，请根据具体题目选择合适的公式
- 使用公式时必须明确说明理由
- 优先使用题目中给出的条件和公式
`;
  }

  /**
   * 批量增强（处理多个题目）
   */
  static enhancePromptBatch(
    basePrompt: string,
    problemTexts: string[]
  ): string {
    // 检测所有题目的学科
    const allSubjects = new Set<string>();
    for (const text of problemTexts) {
      const subjects = this.detectSubject(text);
      subjects.forEach((s) => allSubjects.add(s));
    }

    if (allSubjects.size === 0) {
      return basePrompt;
    }

    const knowledgeBase = this.getKnowledgeBase(Array.from(allSubjects));

    if (!knowledgeBase) {
      return basePrompt;
    }

    return `${basePrompt}

---

#### 相关公式与知识参考
检测到题目可能涉及：**${Array.from(allSubjects).join("、")}**

${knowledgeBase}

**注意**：
- 以上公式仅供参考，请根据具体题目选择合适的公式
- 使用公式时必须明确说明理由
- 优先使用题目中给出的条件和公式
`;
  }
}
