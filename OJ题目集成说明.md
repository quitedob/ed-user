# OJ 题目集成说明

## 功能概述

已成功在作业详情页面 (`pages/student/course/[id]/homework/[homeworkId].vue`) 中集成 OJ 编程题功能。学生可以在作业中完成编程题目，提交代码并查看测试结果。

## 页面布局

页面采用动态布局，根据题目类型自动调整：

### 普通题目（单选、多选、填空、问答）
- **中间**：题目内容和答题区（全宽）
- **右侧**：答题卡（网格显示，快速跳转）

### OJ 编程题（特殊布局）
- **左侧**：题目描述面板（480px 宽，浅灰背景）
  - 采用卡片式设计，每个部分独立气泡
  - 题目标题卡片（带蓝色左边框）
  - 题目描述卡片（带图标）
  - 输入格式卡片
  - 输出格式卡片
  - 示例卡片（带编号和高亮）
  - 提示卡片
  - 所有卡片带阴影和悬停效果
- **中间**：代码编辑器（深色主题）
  - 语言选择
  - 代码编辑区
  - 运行/提交按钮
- **右侧**：答题卡（网格显示，快速跳转）

当切换到 OJ 题目时，页面自动切换为三栏布局；切换到普通题目时，自动恢复为两栏布局。

## 主要特性

### 1. OJ 题目显示
- ✅ 题目描述（支持 HTML 格式）
- ✅ 输入输出格式说明
- ✅ 示例输入输出（自动解析）
- ✅ 提示信息
- ✅ 时间和内存限制
- ✅ 难度等级显示
- ✅ 题目标签（带颜色）

### 2. 代码编辑
- ✅ 多语言支持（C++, Java, Python, JavaScript）
- ✅ 代码编辑器（textarea，可扩展为 Monaco Editor）
- ✅ 语言选择器

### 3. 提交和评测
- ✅ 代码提交功能
- ✅ 测试用例自动评测（模拟）
- ✅ 显示测试结果（通过/失败）
- ✅ 显示期望输出和实际输出
- ✅ 根据通过率计算得分

### 4. 结果展示
- ✅ 评测状态显示（Accepted, Wrong Answer 等）
- ✅ 得分显示
- ✅ 测试用例详细结果
- ✅ 提交的代码展示

## JSON 数据格式

### OJ 题目数据结构

```json
{
  "id": "1001",
  "problemId": "CF-1001",
  "type": "oj",
  "title": "A. Array Sum",
  "description": "题目描述（支持 HTML）",
  "input": "输入格式说明",
  "output": "输出格式说明",
  "examples": "Input:\n3\n1 2 3\n\nOutput:\n6",
  "hint": "提示信息",
  "timeLimit": 1000,
  "memoryLimit": 128,
  "score": 20,
  "difficulty": 2,
  "order": 5,
  "isRemote": true,
  "source": "CodeForces Round #123",
  "tags": [
    {
      "id": "tag_001",
      "name": "array",
      "color": "#409EFF"
    }
  ],
  "testCases": [
    {
      "id": "case_001",
      "input": "3\n1 2 3",
      "output": "6",
      "sample": true,
      "order": 1
    }
  ],
  "language": "cpp",
  "userAnswer": "",
  "result": null,
  "earnedScore": 0
}
```

## 使用方法

### 添加 OJ 题目到作业

在 `loadHomeworkData()` 函数的 `homeworkTemplates` 中添加 OJ 题目：

```javascript
{
  id: '1001',
  problemId: 'CF-1001',
  type: 'oj',  // 重要：类型必须是 'oj'
  title: 'A. Array Sum',
  description: '题目描述...',
  input: '输入格式...',
  output: '输出格式...',
  examples: 'Input:\n3\n1 2 3\n\nOutput:\n6',
  hint: '提示信息',
  timeLimit: 1000,
  memoryLimit: 128,
  score: 20,
  difficulty: 2,
  tags: [...],
  testCases: [...],
  language: 'cpp',
  userAnswer: '',
  result: null,
  earnedScore: 0
}
```

## 难度等级映射

- 0/1: 简单
- 2: 中等
- 3: 困难
- 4: 非常困难

## 评测状态

- `Accepted` / `AC`: 通过
- `Wrong Answer` / `WA`: 答案错误
- `Time Limit Exceeded` / `TLE`: 超时
- `Memory Limit Exceeded` / `MLE`: 内存超限
- `Runtime Error` / `RE`: 运行错误
- `Compile Error` / `CE`: 编译错误

## 支持的编程语言

- C++ (`cpp`)
- Java (`java`)
- Python (`python`)
- JavaScript (`javascript`)

## 页面路由

访问路径：`/student/course/{courseId}/homework/{homeworkId}`

例如：`http://localhost:3000/student/course/1/homework/1`

## 后续优化建议

1. **代码编辑器升级**
   - 集成 Monaco Editor 或 CodeMirror
   - 添加语法高亮
   - 添加代码自动补全

2. **真实评测系统对接**
   - 连接后端评测服务
   - 实时显示评测进度
   - 支持多个测试点

3. **更多功能**
   - 代码模板
   - 历史提交记录
   - 代码运行调试
   - 题目收藏和笔记

4. **性能优化**
   - 代码本地保存（防止丢失）
   - 懒加载测试用例
   - 优化大文件处理

## 页面交互

1. **题目切换**
   - 点击右侧答题卡中的题号
   - 使用题目详情页底部的"上一题"/"下一题"按钮（普通题目）

2. **答题状态**
   - 未答题：灰色显示
   - 已答题：绿色显示
   - 当前题目：蓝色高亮

3. **OJ 题目操作**
   - 选择编程语言（C++, Java, Python, JavaScript）
   - 编写代码
   - 点击"运行代码"测试（开发中）
   - 点击"提交代码"进行评测

4. **提交作业**
   - 点击右侧答题卡底部的"提交作业"按钮
   - 或在最后一题时点击"提交作业"按钮
   - 提交后自动评测并显示结果

## 示例截图说明

根据提供的图片，OJ 题目的页面布局包含：
- **左侧**：题目描述面板（显示题目详情、输入输出格式、示例）
- **中间**：代码编辑器（深色主题，类似 VS Code）
- **右侧**：答题卡（网格显示所有题号，显示完成状态）

当前实现已完全支持这种布局，并且可以在同一个作业中混合不同类型的题目（单选、多选、填空、问答、OJ 编程题）。切换题目时，布局会自动适配。

## 特色功能

1. **动态布局切换**
   - 普通题目：两栏布局（答题区 + 答题卡）
   - OJ 题目：三栏布局（题目描述 + 代码编辑器 + 答题卡）

2. **代码编辑器**
   - 深色主题（类似 VS Code）
   - 等宽字体
   - 多语言支持
   - 独立的运行和提交按钮

3. **题目描述面板**
   - 卡片式设计，视觉层次清晰
   - 每个部分独立气泡包裹
   - 带图标的标题，增强辨识度
   - 难度等级带颜色标识（绿色简单、橙色中等、红色困难）
   - 示例输入输出对比，带编号和高亮
   - 卡片悬停效果，提升交互体验

4. **答题卡**
   - 网格布局，快速跳转
   - 实时显示答题状态
   - 高亮当前题目
