# translate.whole 行内上下文翻译优化计划

## 背景

GitHub issue #103 提到：当一句话被 HTML 标签、链接、行内代码等拆成多个 TextNode 时，当前逐节点翻译会丢失上下文，导致翻译质量下降。

当前 `translate.js` 已经有 `translate.whole` 能力，语义上是“整体翻译某个元素”，但从现有执行链路看，命中 `whole` 后仍然主要以单个 TextNode 为单位入队和翻译，并没有真正跨 TextNode 保持上下文。

本次优化只让新能力在 `translate.whole` 命中的范围内生效，不改变默认逐节点翻译行为。

## 最新决策：接口层支持 segment-aware 翻译

经过进一步分析，单纯依赖前端 marker 拼接字符串并通过现有 `translate.json` 普通文本接口翻译，只能做到“尽量尝试，失败回退”，不能稳定支持跨 TextNode 上下文翻译。

原因是现有接口只返回一段完整译文，前端无法可靠判断译文中的哪些词应回填到哪个原始 TextNode。即使使用 marker，翻译服务也可能删除、改写、移动 marker，导致拆分结果不可靠。

因此最新方案调整为：

1. `translate.json` 不新增独立 `segments` 参数，而是在现有 `text` 参数中兼容 segment-aware 翻译能力。
2. `text` 仍然是一个数组；数组中的普通字符串继续表示一条普通翻译文本，字符串数组则表示一个需要整体上下文翻译、但返回时仍要按片段拆回的 segment group。
3. 前端负责收集命中 `translate.whole` 的连续 inline TextNode，并把它们作为 `text` 数组中的一个字符串数组条目发送给接口。
4. 接口内部负责在完整上下文中翻译，并在响应 `text` 的相同下标返回与输入片段一一对应的译文数组。
5. 前端不再把 marker 解析作为主路径，只校验接口返回的条目类型和 segment 数量是否与输入一致。
6. 现有只传字符串数组的 `text` 参数和旧翻译流程必须保持兼容。

这使问题从“前端猜测译文如何拆分”转为“接口通过原有 `text` 结构明确返回每个 segment 的译文”，是更根源、更稳定且兼容旧调用的方案。

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

## translate.json text 混合分段接口设计

### 核心约定

`/translate.json` 继续使用现有 `text` 参数，不新增独立的 `segments` 参数。

`text` 参数仍然通过 JSON 序列化后传入，原有调用方式保持不变：

```text
from=english
to=chinese_simplified
text=encodeURIComponent(JSON.stringify(["hello", "world"]))
```

在兼容旧格式的基础上，`text` 数组的每一项允许有两种类型：

```ts
type TranslateTextItem = string | string[];
type TranslateTextPayload = TranslateTextItem[];
```

含义如下：

- `string`：普通单句、单节点或单段文本，沿用当前逐条翻译逻辑。
- `string[]`：一个上下文翻译单元，数组内每个字符串是同一个上下文中的一个片段，通常对应一个原始 TextNode。

也就是说，`text` 表示“这批要翻译的内容”，而不是单纯表示“每一项都必须是独立句子”。当某一项是数组时，它表示这一项内部的多个片段需要共享上下文翻译，但响应时仍要按片段返回。

### 请求示例

普通旧请求仍然合法：

```json
{
  "from": "english",
  "to": "chinese_simplified",
  "text": ["Hello", "World"]
}
```

新增混合请求也合法：

```json
{
  "from": "english",
  "to": "chinese_simplified",
  "text": [
    "Hello",
    "World",
    ["Please read ", "the docs", " before use."]
  ]
}
```

如果走现有 query/form 方式，则 `text` 仍按原方式 URL 编码：

```text
from=english
to=chinese_simplified
text=encodeURIComponent(JSON.stringify([
  "Hello",
  "World",
  ["Please read ", "the docs", " before use."]
]))
```

### 响应示例

响应中的 `text` 必须保持与请求 `text` 相同的外层顺序和结构类型：

```json
{
  "result": 1,
  "info": "SUCCESS",
  "from": "english",
  "to": "chinese_simplified",
  "text": [
    "你好",
    "世界",
    ["请阅读 ", "文档", " 后再使用。"]
  ]
}
```

结构对应关系：

- 请求 `text[0]` 是字符串，所以响应 `text[0]` 必须是字符串。
- 请求 `text[1]` 是字符串，所以响应 `text[1]` 必须是字符串。
- 请求 `text[2]` 是字符串数组，所以响应 `text[2]` 必须是字符串数组。
- 请求 `text[2].length === 3`，所以响应 `text[2].length` 也必须是 `3`。

前端拿到响应后，不需要猜测译文边界，只需要按同一个下标把 `text[2][0]`、`text[2][1]`、`text[2][2]` 分别回填到原来的三个 TextNode。

### 入参与出参校验规则

接口侧必须校验以下规则：

1. `text` 最外层必须是数组。
2. `text` 的每一项只能是字符串或字符串数组。
3. 字符串数组内部只能包含字符串，不支持更深层嵌套。
4. 普通字符串输入必须返回普通字符串。
5. 字符串数组输入必须返回字符串数组。
6. 返回字符串数组的长度必须与输入字符串数组长度一致。
7. 外层 `text.length` 必须与请求外层 `text.length` 一致。
8. 如果某个字符串数组为空，应作为非法参数处理，避免产生没有 DOM 回填目标的上下文组。
9. 如果某个片段为空字符串，建议第一版先保留其位置并原样返回空字符串；这样可以保证下标稳定，不会让后续片段错位。
10. 如果接口无法稳定拆分某个上下文组，应返回失败或明确错误信息，不能返回结构不匹配的成功结果。

### 翻译处理原则

接口内部处理字符串数组时，需要把整个数组视为一个上下文翻译单元，而不是分别独立翻译每个片段。

例如：

```json
["Please read ", "the docs", " before use."]
```

接口内部可以临时把它理解为同一句话中的三个片段，翻译时利用完整上下文，返回时再拆成三个译文片段：

```json
["请阅读 ", "文档", " 后再使用。"]
```

接口内部可以使用 marker、HTML 翻译能力、模型结构化输出或其他方式实现拆分，但这些实现细节不能暴露给前端。前端只依赖 `text` 响应结构，不依赖 marker 文本。

### 兼容性要求

旧调用保持不变：

```json
["hello", "world"]
```

旧响应也保持不变：

```json
["你好", "世界"]
```

只有当请求里出现字符串数组项时，接口才启用 segment-aware 处理。这样普通用户的大多数逐句翻译仍走原有路径，只有 `translate.whole` 收集到跨 TextNode 上下文时才使用新能力。

### 错误处理要求

如果请求格式非法，建议返回失败结果，并在 `info` 或等价字段中说明原因。例如：

- `text` 不是数组。
- `text[i]` 既不是字符串也不是字符串数组。
- `text[i]` 是空数组。
- `text[i][j]` 不是字符串。
- 翻译后无法得到与输入片段数量一致的结果。

接口不应在结构不匹配时返回 `result: 1`，因为前端会按结构下标回填 DOM；一旦结构错位，就可能把译文写入错误节点。

### 与前端缓存和映射的关系

前端仍按外层 `text` 下标记录请求项与 nodeQueue item 的关系。

普通字符串项继续映射到一个普通 TextNode 或属性。

字符串数组项映射到一个 `wholeContext`，其中保存每个片段对应的原始 TextNode。响应返回后：

1. 校验响应 `text[i]` 是数组。
2. 校验响应 `text[i].length` 与原始片段数量一致。
3. 逐个把 `text[i][j]` 回填到 `wholeContext.segments[j].node`。
4. 如果校验失败，不写 DOM，回退旧的逐 TextNode 翻译。

缓存 key 需要区分普通字符串和分段上下文组。分段上下文组建议基于整个字符串数组序列生成 hash，避免与某个单独 TextNode 的旧缓存混用。

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

1. 使用 `segments.map(segment => segment.originalText)` 生成 `text` 外层数组中的一个字符串数组项。
2. 语言识别按整段上下文合并文本处理。
3. 使用现有 `nodeQueue` 记录 group 与原始 TextNode 的映射。
4. hash 基于整个字符串数组项生成，避免与旧单 TextNode 缓存混用。

### 3. 请求阶段

通过 `translate.json` 现有 `text` 参数提交翻译请求。

普通文本仍作为 `text` 外层数组中的字符串项提交；whole 上下文文本作为 `text` 外层数组中的字符串数组项提交。这样同一批请求可以同时包含普通翻译项和上下文分段翻译项，接口按外层下标返回同构结果。

### 4. 渲染阶段

渲染时判断 nodeQueue item 是否包含 `wholeContext`：

1. 普通 item 继续走现有 `task.add(...)`。
2. wholeContext item 读取接口返回的 `text[groupIndex]`。
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

### 提交二：实现 translate.json text 混合分段接口

范围：

- 为 `translate.json` 的现有 `text` 参数增加字符串数组项支持。
- 保持现有纯字符串数组 `text` 请求完全兼容。
- 返回与请求 `text` 同构的 `text` 字段。
- 返回数量异常时明确失败。

commit 信息：

```text
支持 translate.json text 混合分段翻译
```

提交后 push。

### 提交三：接入 whole 上下文翻译回填

范围：

- 在前端请求阶段识别 wholeContext group。
- 调用支持 text 混合分段的接口。
- 按接口返回的 `text` 同构数组回填原 TextNode。
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
- whole 上下文使用完整字符串数组项的 hash，避免和旧 TextNode hash 混用。

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
