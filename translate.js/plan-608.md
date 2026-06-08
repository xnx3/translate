# translate.whole 行内上下文翻译优化计划

## 背景

GitHub issue #103 提到：当一句话被 HTML 标签、链接、行内代码等拆成多个 TextNode 时，当前逐节点翻译会丢失上下文，导致翻译质量下降。

当前 `translate.js` 已经有 `translate.whole` 能力，语义上是“整体翻译某个元素”，但从现有执行链路看，命中 `whole` 后仍然主要以单个 TextNode 为单位入队和翻译，并没有真正跨 TextNode 保持上下文。

本次优化只让新能力在 `translate.whole` 命中的范围内生效，不改变默认逐节点翻译行为。

## 最新决策：接口层支持 segment-aware 翻译

经过进一步分析，单纯依赖前端 marker 拼接字符串并通过现有 `translate.json` 普通文本接口翻译，只能做到“尽量尝试，失败回退”，不能稳定支持跨 TextNode 上下文翻译。

原因是现有接口只返回一段完整译文，前端无法可靠判断译文中的哪些词应回填到哪个原始 TextNode。即使使用 marker，翻译服务也可能删除、改写、移动 marker，导致拆分结果不可靠。

因此最新方案调整为：

1. `translate.json` 增加 segment-aware 翻译能力。
2. 前端负责收集命中 `translate.whole` 的连续 inline TextNode，并把它们作为一个 segment group 发送给接口。
3. 接口内部负责在完整上下文中翻译，并返回与输入 segments 一一对应的译文数组。
4. 前端不再把 marker 解析作为主路径，只校验接口返回的 segment 数量是否与输入一致。
5. 现有 `text` 参数和旧翻译流程必须保持兼容。

这使问题从“前端猜测译文如何拆分”转为“接口明确返回每个 segment 的译文”，是更根源、更稳定的方案。

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
- 用结构化 segment 或 marker 将多个 TextNode 组合成一个翻译单元。
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
- `translate.waitingExecute`：segment 返回异常时，回退旧逻辑可通过现有执行队列排队。

## 目标

1. 在 `translate.whole` 命中的元素范围内，将连续 inline 文本流作为一个上下文整体翻译。
2. 保持默认行为不变：未开启或未命中 `translate.whole` 时，仍走原逐节点翻译。
3. `translate.json` 支持 segment-aware 请求和响应。
4. 前端不提前修改真实 DOM。
5. 不新增前端公开 API，仍以 `translate.whole` 作为启用入口。
6. 接口返回 segment 数量异常时不强行写 DOM，回退旧的逐 TextNode 翻译。
7. 尽量少改主流程，避免引入平行翻译系统。

## 非目标

本次不做以下事项：

- 不让所有普通段落默认自动上下文翻译。
- 不新增全局 `translate.context` 公开配置。
- 不破坏 `translate.json` 现有 `text` 参数和旧响应格式。
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

- 第一版将 inline `code` 作为上下文切断边界，不跨 code 合并。
- 这样可以避免译文语序调整后，代码位置与原 DOM 中 `<code>` 位置对不上的问题。
- 如果后续接口支持 protected placeholder，再考虑把 inline code 作为受保护片段传入接口。

## translate.json segment 接口设计

现有接口继续保留：

```text
from=english
to=chinese_simplified
text=encodeURIComponent(JSON.stringify(["hello", "world"]))
```

新增 segment-aware 请求参数，建议为 `segments`：

```text
from=english
to=chinese_simplified
segments=encodeURIComponent(JSON.stringify([
  ["Please read ", "the docs", " before use."],
  ["Open ", "settings", " first."]
]))
```

其中：

- 第一维是一个上下文翻译单元。
- 第二维是这个上下文内按 DOM 顺序排列的 TextNode 文本。
- 每个上下文翻译单元必须整体参与翻译。
- 返回结果中的每个 segment 必须与输入 segment 下标一一对应。

建议响应：

```json
{
  "result": 1,
  "info": "SUCCESS",
  "from": "english",
  "to": "chinese_simplified",
  "segments": [
    ["请阅读 ", "文档", " 后再使用。"],
    ["请先打开 ", "设置", "。"]
  ],
  "text": [
    "请阅读 文档 后再使用。",
    "请先打开 设置。"
  ]
}
```

响应要求：

1. `segments.length` 必须等于请求上下文数量。
2. `segments[i].length` 必须等于请求 `segments[i].length`。
3. 如果接口无法稳定拆分，应返回失败或明确错误信息，不能返回数量不一致的成功结果。
4. `text` 可作为整段译文保留，便于调试、缓存或兼容，但前端 DOM 回填以 `segments` 为准。

接口内部可以使用 marker、HTML 翻译能力或其他方式实现上下文翻译，但这些实现细节不暴露给前端。前端只依赖结构化 `segments` 响应。

## marker 策略

前端不再把 marker 作为主路径。

marker 可以作为接口内部实现 segment-aware 翻译的一种手段，但它应封装在接口内部。

如果后续为了兼容某些翻译通道，前端必须临时走 marker 文本方案，也只能作为降级方案，且必须保留严格校验和旧逻辑回退。

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
    groupIndex: 0
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

1. 使用 `segments.map(segment => segment.originalText)` 作为 segment group。
2. 语言识别按整段上下文合并文本处理。
3. 使用现有 `nodeQueue` 记录 group 与原始 TextNode 的映射。
4. hash 基于整个 segment group 生成，避免与旧单 TextNode 缓存混用。

### 3. 请求阶段

通过 `translate.json` 新增的 `segments` 参数提交上下文翻译请求。

旧的普通文本仍通过 `text` 参数提交，保持原逻辑。

### 4. 渲染阶段

渲染时判断 nodeQueue item 是否包含 `wholeContext`：

1. 普通 item 继续走现有 `task.add(...)`。
2. wholeContext item 读取接口返回的 `segments[groupIndex]`。
3. 如果返回 segment 数量与原始 segment 数量一致，则逐个调用现有 `task.add(segment.node, segment.originalText, segmentTranslation, segment.attribute)`。
4. 如果返回异常，不写 DOM，进入回退。

### 5. 回退阶段

segment 返回异常时：

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

### 提交二：实现 translate.json segment-aware 接口

范围：

- 为 `translate.json` 增加 `segments` 参数支持。
- 保持现有 `text` 参数兼容。
- 返回与请求 segment group 对齐的 `segments` 字段。
- 返回数量异常时明确失败。

commit 信息：

```text
支持 translate.json 分段上下文翻译
```

提交后 push。

### 提交三：接入 whole 上下文翻译回填

范围：

- 在前端请求阶段识别 wholeContext group。
- 调用 segment-aware 接口。
- 按接口返回的 `segments` 数组回填原 TextNode。
- 接入失败回退。

commit 信息：

```text
接入 whole 分段上下文翻译回填
```

提交后 push。

### 提交四：增加 whole 行内上下文翻译验证页面

范围：

- 新增或更新一个 demo 页面。
- 覆盖：
  - `a/span` 混排。
  - inline `code`。
  - `br` 切断。
  - `pre/code` 忽略。
  - 默认未开启 whole 时行为不变。
  - segment 返回异常不污染 DOM。

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
7. segment 返回数量异常不会写入错误译文。
8. segment 返回异常后不会进入无限 execute 循环。
9. 浏览器缓存命中时仍能正确回填。
10. 不提交 unrelated dirty files。

## 风险与处理

### 风险一：接口返回 segment 数量不一致

处理：

- 前端渲染前校验 segment 数量。
- 接口侧数量不一致时返回失败。
- 失败回退旧逻辑。

### 风险二：上下文识别过宽

处理：

- 只在 `translate.whole` 命中范围内启用。
- 不默认对普通段落启用。
- 遇到块级元素立即切断。

### 风险三：影响已有缓存

处理：

- 普通节点缓存不变。
- whole 上下文使用完整 segment group 的 hash，避免和旧 TextNode hash 混用。

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

为了让这个能力稳定可靠，`translate.json` 需要支持 segment-aware 翻译；前端不应长期依赖 marker 字符串猜测译文拆分。
