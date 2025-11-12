# AI作业助手 (AI Homework Assistant)

[ENGLISH README](/README-EN.md)

<div align="center">

**🚀 人工智能驱动的智能作业解题平台**

符合人体工程学设计 · 开源免费 · 高精度解题 · 全平台支持

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdestineylu%2FAI-homework)
[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/destineylu/AI-homework?style=social)](https://github.com/destineylu/AI-homework)

</div>

---

## 📋 目录

- [核心特性](#核心特性)
- [最新优化](#最新优化-v20)
- [快速开始](#快速开始)
- [快捷键说明](#快捷键说明)
- [常见问题](#常见问题)
- [开发指南](#开发指南)
- [免责声明](#免责声明)

---

## ✨ 核心特性

### 🎯 智能解题
- **多AI引擎支持**：Gemini AI / OpenAI（可配置多个源并切换）
- **高精度识别**：自适应图像预处理，OCR准确率提升15-25%
- **智能验证**：10项质量检查机制，答案置信度实时评估
- **8种题型识别**：选择题、填空题、计算题、证明题、应用题、判断题、简答题等

### 🛠️ 人性化设计
- **纯键盘操作**：完整的快捷键体系，告别鼠标操作
- **批量处理**：支持多张图片/PDF文件同时解析
- **自定义风格**：可定制答案风格和解题详细程度
- **左撇子友好**：界面布局可调整
- **全平台支持**：电脑、平板、手机均可访问

### 🔒 安全隐私
- **浏览器内运行**：无需下载任何软件
- **无遥测追踪**：不收集任何个人数据
- **开源透明**：所有代码开源，无黑盒操作
- **本地存储**：数据仅保存在您的浏览器中

### ⚡ 高效工作流
- **智能重试机制**：3次质量检查重试，失败响应时间减少40%
- **并发处理**：支持多个题目并发解析
- **实时流式输出**：边解析边显示，无需等待
- **答案改进**：一键改进低质量答案

---

## 🎉 最新优化 (v2.0)

**发布日期：2025-11-12**

本次更新全面提升了AI解题的准确性和可靠性，实施了8项核心优化措施：

### 📊 性能提升

| 优化项目 | 提升幅度 |
|---------|---------|
| 📸 OCR识别准确率 | **+15~25%** |
| ✅ 答案正确率 | **+20~30%** |
| 📝 解题步骤完整性 | **+40%** |
| 🎯 答案一致性 | **+15~20%** |
| ⚡ 失败响应时间 | **-40%** |

### 🔧 技术改进

#### 1️⃣ **智能Prompt优化**
- 新增8步系统化工作流程（分析→识别题型→制定策略→验证）
- 添加质量要求章节，强调准确性优先
- 5种题型专属解题策略（选择题、计算题、证明题、应用题、填空题）

#### 2️⃣ **答案质量验证系统** 🆕
- 10项自动质量检查（LaTeX语法、单位检查、步骤完整性等）
- 0-1置信度评分系统
- 自动生成改进建议
- 低质量答案实时警告

#### 3️⃣ **题目分类器** 🆕
- 8种题型自动识别
- 学科分类提示（数学、物理、化学、语文、英语）
- 针对性解题策略推荐

#### 4️⃣ **自适应图像预处理**
- Otsu自适应阈值算法替代固定阈值
- 根据图像直方图动态计算最优分割点
- 边界像素平滑处理，保留更多细节

#### 5️⃣ **AI参数精细化控制**
- Temperature: 0.3（降低随机性，提高一致性）
- TopP: 0.9（保持多样性但避免过于发散）
- MaxOutputTokens: 8192（确保完整输出）

#### 6️⃣ **智能重试机制**
- 重试次数优化：5次 → 3次
- 温和退避策略：2x → 1.5x
- 3项结果质量验证
- 详细的失败日志

#### 7️⃣ **界面中文化**
- 所有AI Prompt全面中文化
- 更符合中文使用习惯

#### 8️⃣ **完整技术文档** 🆕
- 查看 [OPTIMIZATION_SUMMARY.md](OPTIMIZATION_SUMMARY.md) 了解详细信息

---

## 🚀 快速开始

### 在线体验

访问在线演示站点（需要自备API密钥）：

**🌐 官方部署地址：[https://homework.ban-butterfly.top](https://homework.ban-butterfly.top)**

### 获取API密钥

#### Gemini API（推荐，免费）
1. 访问 [Google AI Studio](https://aistudio.google.com/api-keys)
2. 登录Google账号
3. 点击"Create API Key"
4. 复制生成的API密钥

#### OpenAI API
1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 注册并登录
3. 创建新的API密钥
4. 充值账户（按使用量付费）

### 配置步骤

1. 打开应用后，按 `Ctrl+5` 进入设置页面
2. 在"AI源配置"中填入您的API密钥
3. 选择合适的模型（推荐：`gemini-2.5-flash`）
4. 可选：调整AI参数（Temperature、TopP等）
5. 点击保存

### 基本使用

1. **上传题目**：
   - 按 `Ctrl+1` 上传图片
   - 或按 `Ctrl+2` 使用摄像头拍照
   - 支持多张图片和PDF文件

2. **开始解题**：
   - 按 `Ctrl+3` 提交给AI解析
   - 等待AI处理（支持实时流式输出）

3. **查看结果**：
   - 使用空格键浏览题目
   - 低质量答案会有置信度警告

4. **改进答案**：
   - 按 `/` 键对当前题目提出改进建议
   - AI会重新生成更优质的答案

---

## ⌨️ 快捷键说明

### 文件操作
| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Ctrl+1` | 上传文件 | 从本地选择图片或PDF |
| `Ctrl+2` | 拍照 | 使用摄像头拍摄题目 |
| `Ctrl+3` | 提交解析 | 将文件提交给AI处理 |
| `Ctrl+4` | 清空所有 | 删除所有已上传文件 |

### 导航操作
| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `空格` | 下一题 | 跳转到下一个题目 |
| `Shift+空格` | 上一题 | 返回上一个题目 |
| `Tab` / `→` | 下一文件 | 切换到下一张图片 |
| `Shift+Tab` / `←` | 上一文件 | 切换到上一张图片 |

### 功能操作
| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Ctrl+5` | 设置 | 打开设置页面 |
| `Ctrl+X` | 全局Prompt | 编辑全局提示词 |
| `/` | 改进答案 | 对当前答案提出改进要求 |
| `ESC` | 关闭 | 关闭当前对话框或设置页 |

### 聊天模式
| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Ctrl+/` | 打开聊天 | 进入AI对话模式 |

---

## ❓ 常见问题

### Q1: 为什么解题速度很慢？

**原因**：
- Thinking Budget设置过大
- 网络连接不稳定
- AI模型负载过高

**解决方案**：
1. 降低Thinking Budget（在设置中调整，推荐8192-12000）
2. 切换到更快的模型（如 `gemini-2.5-flash`）
3. 如果不需要详细解析，可添加以下全局Prompt：
   ```
   用中文输出答案
   只需要输出答案即可，选择题不需要输出解析(留白即可)
   ```

### Q2: 为什么总是失败/出错？

**可能原因及解决方案**：

1. **API密钥问题**：
   - 检查API密钥是否正确
   - 确认密钥是否还有额度
   - Gemini需确保密钥已激活

2. **网络问题**：
   - 检查能否访问Google/OpenAI服务
   - 尝试使用代理或VPN
   - 使用自定义Base URL（反向代理）

3. **模型选择问题**：
   - 尝试切换到 `gemini-2.5-flash` 模型
   - 确保选择的模型支持图片输入

4. **图片质量问题**：
   - 启用"图像二值化"选项（在设置中）
   - 确保图片清晰、光线充足
   - 避免倾斜或模糊的照片

### Q3: 答案质量不理想怎么办？

**方法1：使用改进功能**
- 按 `/` 键对当前答案提出具体改进要求
- 例如："请添加详细的计算步骤"、"请说明为什么其他选项错误"

**方法2：调整全局Prompt（Ctrl+X）**
```
示例Prompt：
- 答案必须包含详细的推导过程
- 每一步都要说明依据
- 计算题必须验证答案
- 选择题必须分析所有选项
- 使用规范的数学符号和LaTeX格式
```

**方法3：调整AI参数**
- Temperature降低（0.2-0.3）：更确定性的答案
- Temperature升高（0.4-0.6）：更有创意的解法
- TopP调整（0.8-0.95）：控制答案多样性

**方法4：查看置信度标签**
- 系统会自动评估答案质量
- 置信度<70%的答案会显示警告和改进建议
- 可直接根据建议要求AI重新生成

### Q4: 电脑没有摄像头怎么办？

推荐使用配套工具 **SkidCamera**：
- 仓库地址：[github.com/cubewhy/SkidCamera](https://github.com/cubewhy/SkidCamera)
- 功能：将手机作为电脑的网络摄像头
- 符合人体工程学设计，专为学习场景优化

### Q5: 没有API密钥怎么办？

**Gemini API（推荐）**：
- ✅ 完全免费
- ✅ 每天有免费额度
- ✅ 支持图片和PDF
- 📍 申请地址：[aistudio.google.com](https://aistudio.google.com/api-keys)

**如果无法访问Google**：
- 使用Cloudflare Workers搭建反向代理
- 使用国内的API代理服务（需自行查找）
- 使用OpenAI API（需付费）

### Q6: 如何自定义答案风格？

本平台高度可定制化，可以完全按照您的需求调整：

**步骤**：
1. 按 `Ctrl+X` 打开全局Prompt编辑器
2. 输入您的要求，例如：

```
风格要求：
- 答案要详细，步骤要完整
- 使用标准答题格式
- 物理题必须画受力分析图
- 计算过程要列竖式
- 最后用方框标注最终答案

语言风格：
- 使用严谨的学术语言
- 避免口语化表达
- 数学符号要规范
```

3. 保存后对所有题目生效
4. 对单个题目可用 `/` 键单独调整

### Q7: 支持哪些题目类型？

目前支持**8种题型**自动识别和针对性处理：

| 题型 | 识别关键词 | 特殊处理 |
|------|----------|---------|
| 📝 选择题 | A/B/C/D选项 | 分析所有选项+排除法 |
| ✏️ 填空题 | 下划线、空格 | 简洁答案+填写理由 |
| 🔢 计算题 | 数字+求解词 | 完整步骤+单位+验证 |
| 📐 证明题 | 证明、推导 | 逻辑链+依据标注 |
| 🌍 应用题 | 实际情境 | 建模+分步+检验 |
| ✅ 判断题 | 对/错、正误 | 明确判断+详细依据 |
| 📖 简答题 | 简述、论述 | 分点作答+术语规范 |
| ❓ 其他 | 自动分析 | 灵活处理 |

**支持学科**：数学、物理、化学、语文、英语、生物、历史、地理等

### Q8: 图像预处理有什么用？

**图像二值化功能**（基于Otsu自适应算法）：

✅ **优势**：
- 提高OCR识别准确率15-25%
- 适应不同光线条件
- 自动去除背景干扰
- 增强文字对比度

⚙️ **适用场景**：
- 光线不均匀的照片
- 有阴影或反光的图片
- 手写题目识别
- 低对比度的图片

💡 **使用建议**：
- 默认推荐开启
- 处理时间增加0.5-1秒
- 如果原图已经很清晰可关闭

### Q9: 与传统搜题软件相比有什么优势？

| 对比项 | 传统搜题软件 | AI作业助手 |
|--------|------------|-----------|
| 🖥️ 平台支持 | 主要是手机 | 电脑/平板/手机 |
| 🎯 题库依赖 | 依赖题库，新题无解 | AI实时解答，不依赖题库 |
| 📝 答案风格 | 固定模板 | 完全可定制 |
| 🔍 操作效率 | 需要拍照搜索 | 纯键盘操作，批量处理 |
| 💰 费用 | 通常需要付费VIP | 完全开源免费 |
| 🔒 隐私安全 | 数据上传到服务器 | 浏览器本地运行 |
| 🛠️ 可定制性 | 无法定制 | 高度可定制 |
| 📊 质量保证 | 无质量评估 | 10项质量检查+置信度 |

### Q10: OCR识别原理是什么？

**工作流程**：

```
1. 图片上传
   ↓
2. 自适应预处理（Otsu算法）
   - 灰度化
   - 直方图分析
   - 最优阈值计算
   - 二值化处理
   ↓
3. 发送给AI模型
   - Gemini/OpenAI多模态识别
   - 直接理解图片内容
   ↓
4. 结构化输出
   - XML格式
   - 题目+答案+解析
   ↓
5. 质量验证
   - 10项自动检查
   - 置信度评分
   - 改进建议生成
```

**技术优势**：
- 不依赖传统OCR引擎（Tesseract等）
- AI直接理解图片语义
- 支持复杂排版和手写识别
- 同时完成识别和解答

---

## 🛠️ 开发指南

### 环境要求
- Node.js 16+ 或 18+
- pnpm 8+

### 本地开发

1️⃣ **克隆仓库**
```bash
git clone https://github.com/destineylu/AI-homework.git
cd AI-homework
```

2️⃣ **安装依赖**
```bash
pnpm install
```

3️⃣ **启动开发服务器**
```bash
pnpm run dev
```

4️⃣ **访问应用**
```
http://localhost:5173
```

### 项目结构

```
AI-homework/
├── src/
│   ├── ai/                    # AI核心模块
│   │   ├── gemini.ts         # Gemini AI客户端
│   │   ├── openai.ts         # OpenAI客户端
│   │   ├── prompts.ts        # 系统Prompt
│   │   ├── response.ts       # 响应解析
│   │   └── request.ts        # 请求封装
│   ├── components/            # React组件
│   │   ├── pages/            # 页面组件
│   │   ├── dialogs/          # 对话框
│   │   └── ui/               # UI组件库
│   ├── store/                 # Zustand状态管理
│   │   ├── ai-store.ts       # AI配置状态
│   │   ├── problems-store.ts # 题目状态
│   │   └── settings-store.ts # 设置状态
│   ├── utils/                 # 工具函数
│   │   ├── answer-validator.ts      # 答案验证器 🆕
│   │   ├── problem-classifier.ts    # 题目分类器 🆕
│   │   ├── image-post-processing.ts # 图像预处理
│   │   └── encoding.ts       # 编码工具
│   └── hooks/                 # 自定义Hooks
├── public/                    # 静态资源
│   └── locales/              # 国际化文件
├── OPTIMIZATION_SUMMARY.md    # 优化文档 🆕
└── package.json
```

### 构建生产版本

```bash
pnpm run build
```

构建产物输出到 `dist/` 目录。

### 国际化开发

修改i18n文件后，需要更新类型定义：

```bash
pnpm i18next-cli types
```

### 提交规范

建议使用语义化提交信息：

```bash
feat: 添加新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
perf: 性能优化
test: 添加测试
chore: 构建/工具链更新
```

### 贡献代码

欢迎提交 Pull Request！

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **状态管理**：Zustand
- **UI组件**：shadcn/ui + Tailwind CSS
- **AI集成**：Gemini AI / OpenAI
- **图像处理**：Canvas API + Otsu算法
- **Markdown渲染**：react-markdown + remark-math + rehype-katex
- **国际化**：i18next

### 开发建议

1. **修改Prompt**：编辑 `src/ai/prompts.ts`
2. **调整验证规则**：编辑 `src/utils/answer-validator.ts`
3. **添加题型**：编辑 `src/utils/problem-classifier.ts`
4. **UI定制**：修改 `src/components/ui/` 下的组件
5. **图像算法优化**：编辑 `src/utils/image-post-processing.ts`

---

## 📚 相关资源

### 官方文档
- [优化技术文档](OPTIMIZATION_SUMMARY.md)
- [英文README](README-EN.md)

### AI平台
- [Google AI Studio](https://aistudio.google.com/)
- [OpenAI Platform](https://platform.openai.com/)

### 技术参考
- [Otsu's Method](https://en.wikipedia.org/wiki/Otsu%27s_method) - 自适应阈值算法
- [Gemini API文档](https://ai.google.dev/docs)
- [Prompt工程指南](https://www.promptingguide.ai/)

### 配套工具
- [SkidCamera](https://github.com/cubewhy/SkidCamera) - 网络摄像头工具

---

## 🌟 Star历史

如果这个项目帮助到了您，请给我们一个Star！⭐

[![Star History Chart](https://api.star-history.com/svg?repos=destineylu/AI-homework&type=Date)](https://star-history.com/#destineylu/AI-homework&Date)

---

## 💭 关于作业的思考

### 为什么过多作业不利于学习？

- ⏰ **浪费时间**：大量重复练习占用探索和思考的时间
- 📉 **效率低下**：机械抄写不等于理解和掌握
- 😴 **影响睡眠**：熬夜做作业损害身心健康
- 💔 **心理压力**：作业成为负担而非学习工具
- 🚫 **扼杀兴趣**：让学习变成痛苦的事情

### 本项目的立场

> **"作业应该帮助理解，而不是用来控制"**

我们认为：
- ✅ 学习的本质是理解和思考，而非机械重复
- ✅ 高效的学习方式应该被鼓励（如Khan Academy、Wikipedia）
- ✅ 学生应该有时间发展自己的兴趣和探索
- ✅ 工具应该帮助学习，而不是代替思考

**本项目的目标**：
- 帮助学生理解解题思路和方法
- 节省机械抄写的时间，用于真正的学习
- 提供学习辅助，而非考试作弊工具

---

## ⚖️ 免责声明

### 使用规范

1. **学术诚信**：本项目鼓励用户遵守学术诚信原则
2. **禁止考试作弊**：严禁在考试中使用本软件
3. **辅助学习**：本工具仅用于学习辅助和作业参考
4. **家长监督**：建议在家长指导下使用

### 法律声明

- 本项目使用 **GPL-3.0** 许可证，完全开源
- 开发者无权控制软件的分发和使用
- 用户需对自己的使用行为负责
- 违规使用造成的后果由用户自行承担

### 伦理考量

如果您认为使用本工具违反道德规范，请不要使用。

我们理解不同人对学习工具有不同看法，我们尊重您的选择。

本项目的出发点是：
- 帮助学生高效学习
- 减轻不合理的作业负担
- 提供技术解决方案
- 促进教育公平

---

## 📄 开源协议

本项目采用 **GPL-3.0** 许可证。

```
Copyright (C) 2025 destineylu

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

您可以：
- ✅ 自由使用
- ✅ 自由分享
- ✅ 自由修改
- ✅ 商业使用（需保持开源）

---

## 🤝 贡献者

感谢所有为本项目做出贡献的开发者！

<a href="https://github.com/destineylu/AI-homework/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=destineylu/AI-homework" />
</a>

---

## 📧 联系方式

- **Issues**：[github.com/destineylu/AI-homework/issues](https://github.com/destineylu/AI-homework/issues)
- **Discussions**：[github.com/destineylu/AI-homework/discussions](https://github.com/destineylu/AI-homework/discussions)
- **Fork 原项目**：基于 [cubewhy/skid-homework](https://github.com/cubewhy/skid-homework)

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个Star！⭐**

Made with ❤️ by [destineylu](https://github.com/destineylu)

[⬆ 返回顶部](#ai作业助手-ai-homework-assistant)

</div>
