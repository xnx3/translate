# translate.whole 行内上下文翻译优化计划

## 背景

GitHub issue #103 提到：当一句话被 HTML 标签、链接、行内代码等拆成多个 TextNode 时，当前逐节点翻译会丢失上下文，导致翻译质量下降。

当前 `translate.js` 已经有 `translate.whole` 能力，语义上是“整体翻译某个元素”，但从现有执行链路看，命中 `whole` 后仍然主要以单个 TextNode 为单位入队和翻译，并没有真正跨 TextNode 保持上下文。

本次优化只让新能力在 `translate.whole` 命中的范围内生效，不改变默认逐节点翻译行为。

## 参考仓库结论

参考仓库：<https://github.com/chunibyocola/sc-translator-crx>

它的网页翻译核心思路是：

1. 扫描 DOM 时不直接逐 TextNode 翻译，而是把连续 inline 文本流收集成一个 paragraph。
2. 记录 paragraph 中包含的多个 TextNode 引用。
3. 使用翻译服务能识别和保留的 HTML 标记包裹每个 TextNode 文本。
4. 翻译结果返回后，根据标记拆回多个 TextNode。
5. 对 code 这类不应翻译的内容单独暂存，再在展示时恢复。

可借鉴点：

- 在扫描阶段识别上下文，而不是在翻译后补救。
- 用 TextNode 引用保存原 DOM 位置。
- 用 marker 将多个 TextNode 组合成一个翻译单元。
- 对 code 等内容做保护。
- 对动态内容、ignore、translate="no" 等边界做提前排除。

不应照搬点：

- 不使用 `font` 包裹原 DOM。该方式容易影响动态站点、框架绑定、MutationObserver、CSS 选择器。
- 不直接使用 `<a i=0>`、`<b0>` 这类 HTML marker。当前 `translate.json` 接口不是 Google/Microsoft 的 HTML 翻译接口，无法假设它能稳定保留并翻译这类结构。
- 不复制参考仓库代码。该仓库采用 GPLv3 许可证，当前项目应只借鉴思路并自行实现。

## 当前项目可复用能力

本次不新建一套网页翻译系统，而是复用现有主链路：

- `translate.ignore`：复用已有 tag/class/id 忽略规则。
- `translate.whole`：作为本次能力的唯一启用入口。
- `translate.element.whileNodes`：在 DOM 扫描根源处判断是否进入 whole 上下文收集。
- `translate.nodeQueue`：继续作为待翻译文本、hash、node 映射的统一队列。
- `translate.renderTask`：继续作为 DOM 回写入口。
- `translate.element.nodeAnalyse.get/set`：继续负责普通 TextNode/属性的读取和写回。
- `translate.storage`：继续使用原有 hash 缓存模型。
- `translate.waitingExecute`：marker 解析失败时，回退旧逻辑可通过现有执行队列排队。

## 目标

1. 在 `translate.whole` 命中的元素范围内，将连续 inline 文本流作为一个上下文整体翻译。
2. 保持默认行为不变：未开启或未命中 `translate.whole` 时，仍走原逐节点翻译。
3. 不提前修改真实 DOM。
4. 不新增公开 API。
5. marker 解析失败时不强行写 DOM，回退旧的逐 TextNode 翻译。
6. 尽量少改主流程，避免引入平行翻译系统。

## 非目标

本次不做以下事项：

- 不让所有普通段落默认自动上下文翻译。
- 不新增全局 `translate.context` 公开配置。
- 不改服务端接口协议。
- 不支持跨块级元素上下文合并。
- 不重构现有 nodeQueue、request、renderTask 整体结构。
- 不在默认情况下改变缓存 key 规则。

## 上下文识别规则

只在元素命中 `translate.whole` 时尝试收集上下文。

### 可合并节点

同一个 whole 容器内，连续 inline 文本流可以合并：

- TextNode
- `a`
- `span`
- `b`
- `strong`
- `em`
- `i`
- `small`
- `font`
- 其他 display 为 inline 的元素

### 切断边界

遇到以下情况应结束当前上下文，回到原流程或开始下一个上下文：

- 块级元素，如 `div`、`p`、`section`、`article`、`table`、`ul`、`ol` 等。
- `br`
- `pre`
- 块级 `code`
- `script`
- `style`
- 被 `translate.ignore` 命中的元素。
- `class="notranslate"` 或项目已有 ignore class。
- `translate="no"`。
- `contenteditable`。
- `input`、`textarea` 等表单元素。
- 隐藏元素。

### code 处理

inline `code` 不翻译其内容。

初始策略：

- 将 inline `code` 内容替换为 ASCII code marker。
- 渲染前校验 code marker 是否仍存在。
- 如果 code marker 丢失、数量不一致、位置明显异常，则放弃 whole 上下文渲染，回退旧逻辑。

## marker 策略

不使用 HTML 标签作为 marker。

建议使用 ASCII 文本 marker，降低被翻译接口误处理的概率：

```text
__TRANSLATEJS_SEG_0_START__
__TRANSLATEJS_SEG_0_END__
__TRANSLATEJS_CODE_0__
```

示例：

```text
__TRANSLATEJS_SEG_0_START__Please read __TRANSLATEJS_SEG_0_END__
__TRANSLATEJS_SEG_1_START__the docs__TRANSLATEJS_SEG_1_END__
__TRANSLATEJS_SEG_2_START__ before using __TRANSLATEJS_CODE_0__.__TRANSLATEJS_SEG_2_END__
```

解析规则：

1. 翻译结果必须包含所有 segment start/end marker。
2. segment 数量必须与原始 TextNode 数量一致。
3. marker 顺序必须可解析。
4. code marker 数量必须一致。
5. 任一条件失败，则不写 DOM，回退旧逻辑。

## 数据结构设计

不新增独立全局队列，只给现有 nodeQueue 的 node item 增加一个小的上下文字段。

示意：

```js
{
  node: firstTextNode,
  attribute: '',
  beforeText: '',
  afterText: '',
  wholeContext: {
    textNodes: [textNode1, textNode2, textNode3],
    segments: [
      { node: textNode1, originalText: 'Please read ', attribute: '' },
      { node: textNode2, originalText: 'the docs', attribute: '' },
      { node: textNode3, originalText: ' before using ', attribute: '' }
    ],
    codeTexts: ['translate.execute()'],
    markerText: '__TRANSLATEJS_SEG_0_START__...'
  }
}
```

普通节点不包含 `wholeContext`，继续走原逻辑。

## 执行链路

### 1. 扫描阶段

在 `translate.element.whileNodes(uuid, node)` 中，进入普通递归扫描前：

1. 判断当前元素是否命中 `translate.whole`。
2. 判断当前元素是否适合 whole 上下文收集。
3. 成功收集后，将上下文作为一个特殊 nodeQueue item 入队。
4. 将已收集的 TextNode 标记为本轮已处理，避免后续递归重复入队。
5. 如果收集失败，直接回到原逻辑。

### 2. 入队阶段

whole 上下文入队时：

1. 使用 markerText 作为翻译文本。
2. 语言识别按整段上下文处理。
3. 使用现有 `addNodeQueueItem` 或一个很薄的内部包装方法加入 `nodeQueue`。
4. hash 仍基于最终请求文本生成。

### 3. 请求阶段

不改请求协议。

whole 上下文文本作为普通字符串进入现有 `translateTextArray`。

### 4. 渲染阶段

渲染时判断 nodeQueue item 是否包含 `wholeContext`：

1. 普通 item 继续走现有 `task.add(...)`。
2. wholeContext item 先解析 marker。
3. 解析成功：对每个 segment 调用现有 `task.add(segment.node, segment.originalText, segmentTranslation, segment.attribute)`。
4. 解析失败：不写 DOM，进入回退。

### 5. 回退阶段

marker 解析失败时：

1. 标记该 wholeContext 本次失败。
2. 临时禁用这些 TextNode 的 whole 上下文收集。
3. 调用现有 `translate.execute(textNodes)`。
4. 让旧逐节点逻辑通过 `waitingExecute` 排队执行。

这样失败后最多退回旧行为，不会污染 DOM。

## 提交拆分

### 提交一：增强 whole 行内上下文收集能力

范围：

- 只改 `translate.js`。
- 增加内部上下文收集方法。
- 增加已处理 TextNode 标记。
- 不接入渲染。
- 不改变默认行为。

commit 信息：

```text
增强 whole 行内上下文收集能力
```

提交后 push。

### 提交二：接入 whole 上下文翻译回填

范围：

- 在 nodeQueue item 中接入 `wholeContext` 元数据。
- 接入 marker 解析。
- 接入 `renderTask` 回填。
- 接入失败回退。

commit 信息：

```text
接入 whole 上下文翻译回填
```

提交后 push。

### 提交三：增加 whole 行内上下文翻译验证页面

范围：

- 新增或更新一个 demo 页面。
- 覆盖：
  - `a/span` 混排。
  - inline `code`。
  - `br` 切断。
  - `pre/code` 忽略。
  - 默认未开启 whole 时行为不变。
  - marker 解析失败不污染 DOM。

commit 信息：

```text
增加 whole 行内上下文翻译验证页面
```

提交后 push。

## 验证清单

1. 默认未使用 `translate.whole` 时，现有 demo 行为不变。
2. 开启 `translate.whole.tag.push('p')` 后，同一个 `p` 内的多个 inline TextNode 作为上下文翻译。
3. `a/span` 内文本能拆回原节点。
4. inline `code` 不被翻译。
5. `br` 前后不被错误合并。
6. `pre/code` 仍按原 ignore 逻辑处理。
7. marker 解析失败不会写入错误译文。
8. marker 解析失败后不会进入无限 execute 循环。
9. 浏览器缓存命中时仍能正确回填。
10. 不提交 unrelated dirty files。

## 风险与处理

### 风险一：marker 被翻译服务改写

处理：

- 使用 ASCII marker。
- 渲染前校验 marker。
- 失败回退旧逻辑。

### 风险二：上下文识别过宽

处理：

- 只在 `translate.whole` 命中范围内启用。
- 不默认对普通段落启用。
- 遇到块级元素立即切断。

### 风险三：影响已有缓存

处理：

- 普通节点缓存不变。
- whole 上下文使用 markerText 的 hash，避免和旧 TextNode hash 混用。

### 风险四：回退导致重复翻译

处理：

- 给失败上下文增加本轮禁用标记。
- 回退时只让旧逻辑处理相关 TextNode。

### 风险五：改动过大

处理：

- 不重构 request/render 主链路。
- 不新增公开 API。
- 只在现有 `whole` 语义下补齐真实整体翻译能力。

## 最终原则

这次优化的根源不是“新增上下文翻译功能”，而是让已有 `translate.whole` 真正做到跨 TextNode 的整体翻译。

默认行为保持不变，只有用户明确使用 `translate.whole` 时，才启用行内上下文聚合。
