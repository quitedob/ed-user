# OJ 编辑器布局调试指南

## 问题诊断：为什么代码编辑器区域是空的？

根据你提供的图一（布局坍塌）和图二（正常显示），问题的核心是 **Flex 布局链条断裂**。

## 关键的 CSS 布局链条

要让 OJ 编辑器正常显示，必须确保以下 CSS 链条完整：

### 1. 顶层容器（.homework-body）
```scss
.homework-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  
  &.oj-layout {
    // OJ 模式下的特殊样式
  }
}
```
**检查点**：确保 `homework-body` 有 `oj-layout` 类名

### 2. 中间答题区（.answer-area）
```scss
.answer-area {
  flex: 1;
  min-height: 0; // 关键！防止 flex 子元素溢出
  
  .oj-layout & {
    background: #1e1e1e;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}
```
**检查点**：
- 在 OJ 模式下，`answer-area` 必须有 `display: flex` 和 `flex-direction: column`
- 背景色应该是 `#1e1e1e`（深色）

### 3. 题目详情容器（.question-detail）
```scss
.question-detail {
  .oj-layout & {
    max-width: none;
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
```
**检查点**：在 OJ 模式下必须有 `height: 100%` 和 `display: flex`

### 4. 题目内容区（.question-content）
```scss
.question-content {
  &.oj-content {
    height: 100%;
    padding: 0;
    margin: 0;
    background: transparent;
  }
}
```
**检查点**：OJ 题目的 `question-content` 必须有 `oj-content` 类名

### 5. OJ 题目容器（.question-oj）
```scss
.question-oj {
  height: 100%;
  display: flex;
  flex-direction: column;
}
```
**检查点**：必须有 `height: 100%` 和 `display: flex`

### 6. 编辑器面板（.oj-editor-panel）⭐ 最关键
```scss
.oj-editor-panel {
  height: 100%;
  min-height: 500px; // 防止坍塌
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  flex: 1;
}
```
**检查点**：
- 必须有 `display: flex` 和 `flex-direction: column`
- 必须有 `height: 100%` 或 `flex: 1`
- 必须有 `min-height` 作为保底

### 7. 代码文本域（.code-textarea）⭐ 核心问题所在
```scss
.code-textarea {
  flex: 1; // 这是关键！让文本域占满剩余空间
  display: flex;
  
  :deep(.el-textarea) {
    height: 100%;
    display: flex;
  }
  
  :deep(.el-textarea__inner) {
    height: 100% !important;
    background: #1e1e1e;
    color: #d4d4d4;
    resize: none;
  }
}
```
**检查点**：
- `.code-textarea` 必须有 `flex: 1`
- `.el-textarea__inner` 必须有 `height: 100%`
- 如果还是不行，加 `!important`

## 常见问题排查

### 问题 1：只看到黑色背景，没有任何内容
**原因**：`.oj-editor-panel` 没有被渲染，或者高度为 0

**解决方案**：
1. 检查 `v-if="currentQuestion?.type === 'oj'"` 条件是否生效
2. 检查 `currentQuestion` 是否有值
3. 在浏览器开发者工具中检查 `.oj-editor-panel` 元素是否存在

### 问题 2：看到头部和底部，但中间是空的
**原因**：`.code-textarea` 的 `flex: 1` 没有生效，或者 `el-textarea__inner` 的高度为 0

**解决方案**：
1. 确保 `.code-textarea` 有 `flex: 1`
2. 确保 `.el-textarea__inner` 有 `height: 100%`
3. 添加 `min-height: 300px` 作为保底

### 问题 3：语言选择框孤立显示
**原因**：`.editor-header` 渲染了，但 `.code-textarea` 和 `.editor-footer` 没有渲染

**解决方案**：
1. 检查 `v-if="!isCompleted"` 条件
2. 检查 `currentQuestion.userAnswer` 是否初始化
3. 检查 `el-input` 组件是否正确导入

## 调试步骤

### 步骤 1：检查 HTML 结构
在浏览器开发者工具中，检查以下结构是否完整：
```
.homework-body.oj-layout
  └─ .oj-description-panel (左侧)
  └─ .answer-area
      └─ .question-detail
          └─ .question-content.oj-content
              └─ .question-oj
                  └─ .oj-editor-panel
                      ├─ .editor-header
                      ├─ .code-textarea
                      │   └─ el-input
                      │       └─ .el-textarea__inner
                      └─ .editor-footer
  └─ .answer-card (右侧)
```

### 步骤 2：检查 CSS 样式
在开发者工具中，逐个检查以下元素的计算样式：
1. `.oj-editor-panel` 的 `height` 是否 > 0
2. `.code-textarea` 的 `flex` 是否为 1
3. `.el-textarea__inner` 的 `height` 是否 > 0

### 步骤 3：检查 Vue 数据
在 Vue DevTools 中，检查：
1. `currentQuestion.type` 是否为 `'oj'`
2. `currentQuestion.userAnswer` 是否已初始化（可以是空字符串）
3. `isCompleted` 的值

## 快速修复方案

如果以上都检查过了还是不行，可以尝试以下强制修复：

### 方案 1：添加内联样式
```vue
<el-input
  v-model="currentQuestion.userAnswer"
  type="textarea"
  :rows="25"
  placeholder="请在此处编写代码..."
  class="code-textarea"
  style="flex: 1; display: flex;"
/>
```

### 方案 2：使用固定高度
```scss
.code-textarea {
  height: calc(100vh - 200px); // 固定高度
  
  :deep(.el-textarea__inner) {
    height: 100% !important;
  }
}
```

### 方案 3：使用 Grid 布局
```scss
.oj-editor-panel {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  
  .editor-header { grid-row: 1; }
  .code-textarea { grid-row: 2; }
  .editor-footer { grid-row: 3; }
}
```

## 验证成功的标志

当布局正确时，你应该看到：
1. ✅ 左侧白色面板显示题目描述
2. ✅ 中间深色区域（#1e1e1e）显示代码编辑器
3. ✅ 代码编辑器有明确的头部（标题 + 语言选择）
4. ✅ 代码编辑器有可输入的文本域（占据大部分空间）
5. ✅ 代码编辑器有底部操作栏（运行 + 提交按钮）
6. ✅ 右侧显示答题卡

## 最终检查清单

- [ ] `homework-body` 有 `oj-layout` 类名
- [ ] `answer-area` 在 OJ 模式下有 `display: flex`
- [ ] `question-detail` 在 OJ 模式下有 `height: 100%`
- [ ] `question-content` 有 `oj-content` 类名
- [ ] `question-oj` 有 `height: 100%`
- [ ] `oj-editor-panel` 有 `display: flex` 和 `flex-direction: column`
- [ ] `code-textarea` 有 `flex: 1`
- [ ] `el-textarea__inner` 有 `height: 100%`
- [ ] `currentQuestion.type === 'oj'`
- [ ] `currentQuestion.userAnswer` 已初始化

如果以上所有检查都通过，布局应该就能正常显示了！
