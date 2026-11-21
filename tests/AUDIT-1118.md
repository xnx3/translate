# 11 月 18 日审查回归用例

从仓库根目录执行以下命令。用例由现有 Playwright 配置发现，每个标题中的方括号编号对应审查报告的一项。断言失败会保留编号并使命令返回非零退出码。

```shell
npm --prefix tests run test:audit
npm --prefix tests run test:source -- --grep C15
```

2026-11-18，使用本地 Chromium 内核和固定的 `translate.js`（SHA-256 `f20dadf9316c8fda9c38bdd69dc42e6335945886163b578122ef8975e86f8da3`）执行。全组 201 个用例，按最终用例重新核对得到 196 个失败、5 个通过、0 个跳过。失败分布在 182 个编号；A09、A41、F19 的 5 个断言验证的是已存在的行为。原始整组执行后，G02 修正了等待 iframe 就绪的时序，E22 改为由浏览器直接解析单行函数样本；上述计数纳入了这两条在同一份源码上的重跑。

## 覆盖边界

- **A02** 2026-11-19 按维护者确认的接口约定调整：不再要求直接导入配置时禁止跨文档 DOM。`element.iframe.use({url, setConfig})` 提供配置传递前的同步钩子，由调用者选择是否删除 `config.documents`。当前两个 A02 场景分别验证显式钩子下的首次自动注入与无 src 子页重新同步；未配置钩子时保留原有传递行为。上方及表格的固定源码计数保留历史实测。
- **A09** 验证显式来源名单中允许及拒绝来源的判断。默认信任策略、实际发送窗口身份仍需结合对外兼容约定复核。
- **A10** 2026-11-21 按维护者要求删除 iframe PING/PONG 心跳功能及对应场景，不再作为待修复项；固定源码的历史实测结果保留。
- **A41** 固定无目标语言及显式指定其他语言时的现有返回值。文档应如何表述由维护者确认。
- **F19** 验证 reset 会清空会话历史。长期运行期间是否需要容量上限、上限是多少，尚无产品约定，这个通过结果不能判断长期内存增长。
- **C09、A38、B19、B20、F22** 检查可定位的多余操作、引用或相对增长。C09 使用作用域分析检查循环内只写不读的数组。真实页面的响应时间和内存峰值仍需在代表性设备上测量。
- **D23** 检查未回应的 XHR 是否有有限期限；SSE 的空闲超时及对长流的适用规则尚未覆盖。**E21** 检查对象自有字段与继承字段的边界；循环对象如何返回错误或保留引用仍需明确。**E23** 检查带其他业务字段的 `jsObject`，不判定只有一个同名键的歧义输入。
- **B28** 已根据真实执行校正，只检查包含 null 和有效元素的集合。**E13** 使用普通损坏 JSON 和拦截的求值函数，对代码输入不执行求值。**D28** 直接检查源码示例里的 API 名。**G07** 以独立 Node 进程检查导入时机。
- 索引各行列出该编号的具体断言。多分支问题有的仅覆盖其中一个可重复场景。网络结果取自本地模拟服务或受控回调，线上服务、压缩发布文件以及 Firefox、WebKit 未纳入这次执行。

## 配置、语言切换和监听

| 编号 | 测试契约与文件 | 固定源码实测 |
| --- | --- | --- |
| A01 | [配置回导后仍可追加忽略类](modules/config.set.js) | 1 失败 |
| A02 | [显式配置钩子下的自动注入与重新同步范围](scenarios/audit-config.spec.js) | 旧用例 1 失败，现按接口约定调整，见覆盖边界 |
| A03 | [编辑配置快照不应改动当前忽略词](modules/config.get.js) | 1 失败 |
| A04 | [导入空语种范围清除旧筛选](modules/config.set.js)<br>[导入 false 关闭自动识别](modules/config.set.js) | 2 失败 |
| A05 | [禁用 URL 控制时恢复自定义参数名且不消费 URL](modules/config.set.js) | 1 失败 |
| A06 | [服务变化只使用当前服务的语种数据](modules/selectLanguageTag.customLanguagesHandle.js)<br>[逗号后的空白不改变所选语种](modules/selectLanguageTag.customLanguagesHandle.js) | 2 失败 |
| A07 | [语言接口失败后可在下一次正常渲染重试](modules/selectLanguageTag.render.js) | 1 失败 |
| A08 | [有待处理的列表请求时刷新只保留一个选择框](scenarios/audit-config.spec.js) | 1 失败 |
| A09 | [配置非空名单后允许精确匹配的来源](modules/postMessage.isOriginAllowed.js)<br>[配置非空名单后拒绝其他外部来源](modules/postMessage.isOriginAllowed.js) | 2 通过 |
| A10 | iframe 心跳功能及对应测试已删除，见覆盖边界 | 历史 1 失败，现已移除 |
| A11 | [无宿主的文本和属性均能判为未忽略](modules/ignore.isIgnore.js) | 1 失败 |
| A12 | [检查普通文本后保留宿主自定义属性](modules/ignore.isIgnore.js) | 1 失败 |
| A13 | [挂在 body 上的忽略类对后代生效](modules/ignore.isIgnore.js)<br>[深层 DOM 仍遵循祖先忽略规则](modules/ignore.isIgnore.js) | 2 失败 |
| A14 | [祖先 class 中由制表符和换行分隔的标准 HTML 类名也能忽略子节点](modules/ignore.isIgnore.js) | 1 失败 |
| A15 | [内层条件返回 false 时继续检查外层忽略规则](modules/ignore.isIgnore.js) | 1 失败 |
| A16 | [length 可作普通术语且不影响后一词条](modules/nomenclature.append.js) | 1 失败 |
| A17 | [重叠的术语一次只消费一个完整命中](modules/nomenclature.replace.js) | 1 失败 |
| A18 | [导出并重新导入含等号的正常文案](scenarios/audit-config.spec.js) | 1 失败 |
| A19 | [导出的普通 Windows 路径在字符串字面量中保持原值](scenarios/audit-config.spec.js) | 1 失败 |
| A20 | [初次导出且无缓存时能显示空结果提示](scenarios/audit-config.spec.js) | 1 失败 |
| A21 | [并发保存两个目标语种后均可读回](modules/offline.fullExtract.set.js) | 1 失败 |
| A22 | [新设置的单一节点替换整组旧范围](modules/setDocuments.js) | 1 失败 |
| A23 | [监听 input 时区域外的脚本改值不加入翻译](scenarios/audit-config.spec.js) | 1 失败 |
| A24 | [一次包含重复节点和新兄弟的 DOM 通知也翻译新兄弟](scenarios/audit-config.spec.js) | 1 失败 |
| A25 | [更换范围后的 DOM 监听转移到新容器](scenarios/audit-config.spec.js) | 1 失败 |
| A26 | [单个节点两个片段各执行一次写回](scenarios/audit-config.spec.js) | 1 失败 |
| A27 | [整页请求与后续局部请求按顺序出队](scenarios/audit-config.spec.js) | 1 失败 |
| A28 | [旧入口注册的函数一次只收到一个目标语种字符串](modules/lifecycle.changeLanguage.push.js) | 1 失败 |
| A29 | [保留旧四参数入口的源语种目标语种和文本列表](modules/lifecycle.execute.translateNetworkBefore_Trigger.js) | 1 失败 |
| A30 | [语言列表加载后导出的配置让新实例继续使用同一服务语种](scenarios/audit-config.spec.js) | 1 失败 |
| A31 | [自定义语言选择器不参与正文翻译](scenarios/audit-config.spec.js) | 1 失败 |
| A32 | [打开离线面板后定时回收仍能保留可导出的旧条目](scenarios/audit-config.spec.js) | 1 失败 |
| A33 | [读取 Windows 换行不在译文尾部留下回车](modules/offline.append.js) | 1 失败 |
| A34 | [分段渲染后外部立即写入不同文本时应重新翻译](modules/listener.nodeValueChangeNeedTranslate.js) | 1 失败 |
| A35 | [第一次翻译之后启用监听仍会跟踪后续 DOM](scenarios/audit-config.spec.js) | 1 失败 |
| A36 | [业务清空已翻译文本后 reset 保持空文本](scenarios/audit-config.spec.js) | 1 失败 |
| A37 | [节点在相同父级重排后分组保留新顺序或回退](scenarios/audit-config.spec.js) | 1 失败 |
| A38 | [互不重叠的扫描范围增长时避免逐对枚举](scenarios/audit-config.spec.js) | 1 失败 |
| A39 | [省略可选条件时不产生异常诊断](modules/ignore.class.push.js) | 1 失败 |
| A40 | [显式关闭监听后区域变更不再触发翻译](scenarios/audit-config.spec.js) | 1 失败 |
| A41 | [没有目标语种且省略参数](modules/isTranslateExecute.js)<br>[显式检查另一语种](modules/isTranslateExecute.js) | 2 通过 |

## 队列、扫描和渲染

| 编号 | 测试契约与文件 | 固定源码实测 |
| --- | --- | --- |
| B01 | [业务失败后的同一节点可再次请求并显示译文](scenarios/audit-engine.spec.js) | 1 失败 |
| B02 | [回收与活动请求交错后可以继续处理页面](scenarios/audit-engine.spec.js) | 1 失败 |
| B03 | [回收完成批次后释放已移出页面的请求节点](scenarios/audit-engine.spec.js) | 1 失败 |
| B04 | [自动判断目标语种结束前不会发出无目标的翻译](scenarios/audit-engine.spec.js) | 1 失败 |
| B05 | [忽略规则的可选捕获组没有命中时仍提交其余原文](scenarios/audit-engine.spec.js) | 1 失败 |
| B06 | [切换目标后上个请求的失败不能破坏当前批次](scenarios/audit-engine.spec.js) | 1 失败 |
| B07 | [保留包含完整原文的有效译文](scenarios/audit-engine.spec.js) | 1 失败 |
| B08 | [不同原文具有相同哈希值时仍各自回填](scenarios/audit-engine.spec.js) | 1 失败 |
| B09 | [局部执行会扫描开放 ShadowRoot 内的实际显示文本](scenarios/audit-engine.spec.js) | 1 失败 |
| B10 | [同时完成的两个源语言请求只触发一次整批完成](scenarios/audit-engine.spec.js) | 1 失败 |
| B11 | [对象形式和兼容签名的网络前置回调都获得源语种](scenarios/audit-engine.spec.js) | 1 失败 |
| B12 | [直接传入单个 Text 节点仅翻译该文本](scenarios/audit-engine.spec.js) | 1 失败 |
| B13 | [长集合的最后一个有效根也会被扫描](scenarios/audit-engine.spec.js) | 1 失败 |
| B14 | [初次扫描包含无 src 的同源子窗口](scenarios/audit-engine.spec.js) | 1 失败 |
| B15 | [启用子窗口翻译时已经就绪的同源文档也会被处理](scenarios/audit-engine.spec.js) | 1 失败 |
| B16 | [浏览器不允许访问 iframe 文档而返回 null 时安全跳过，不造成页面异常](modules/element.iframe.iframeJsInjector.injectJs.js) | 1 失败 |
| B17 | [响应缺少一项时允许只重试未完成的节点](scenarios/audit-engine.spec.js) | 1 失败 |
| B18 | [后端提供语种别名不会把批次留在运行状态](scenarios/audit-engine.spec.js) | 1 失败 |
| B19 | [缓存命中时按节点身份所做的比较应是线性的](scenarios/audit-engine.spec.js) | 1 失败 |
| B20 | [相同按钮入队可保留全部目标且身份比较线性增长](scenarios/audit-engine.spec.js) | 1 失败 |
| B21 | [显式读写 data 属性保留真实 Attr 节点](scenarios/audit-engine.spec.js) | 1 失败 |
| B22 | [显式配置的字符串 DOM 属性可收集并回写](scenarios/audit-engine.spec.js) | 1 失败 |
| B23 | [title 内带标签外观的文本仍然是可翻译文案](scenarios/audit-engine.spec.js) | 1 失败 |
| B24 | [自定义整体翻译 class 对同一元素的 Attr 和文本一致](scenarios/audit-engine.spec.js) | 1 失败 |
| B25 | [用户条件回调异常后可启动下一轮扫描](scenarios/audit-engine.spec.js) | 1 失败 |
| B26 | [空范围任务不会留下无法回收的批次](scenarios/audit-engine.spec.js) | 1 失败 |
| B27 | [自定义 input value 使用实时值且绑定元素本身，不使用过期的 HTML Attr](modules/element.whileNodes.js) | 1 失败 |
| B28 | [混合列表中的空值不影响后续有效节点的转换](scenarios/audit-engine.spec.js) | 1 失败 |
| B29 | [未登记分组的普通批次完成后释放扫描快照中的正文引用](scenarios/audit-engine.spec.js) | 1 失败 |
| B30 | [无 src 子窗口脚本处于加载中时重复扫描只注入一次](scenarios/audit-engine.spec.js) | 1 失败 |
| B31 | [来自同源子文档的真实 iframe 也能识别其来源](scenarios/audit-engine.spec.js) | 1 失败 |
| B32 | [行内标签之间可见的空格保留在分组上下文](scenarios/audit-engine.spec.js) | 1 失败 |
| B33 | [属性忽略回调获得真实 Attr 后才决定入队](scenarios/audit-engine.spec.js) | 1 失败 |

## 识别与文本工具

| 编号 | 测试契约与文件 | 固定源码实测 |
| --- | --- | --- |
| C01 | [接口语言标识可直接查到书写体系](modules/language.generateLanguageNameObject.js) | 1 失败 |
| C02 | [跳过无效默认语种后仍可正常初始化目标](modules/language.setDefaultTo.js) | 1 失败 |
| C03 | [采样仅保留范围中可见且未忽略的正文](modules/language.getTranslateAreaText.js) | 1 失败 |
| C04 | [采样支持直接指定的 Text 根](modules/language.getTranslateAreaText.js) | 1 失败 |
| C05 | [纯数字页保留有效的默认源语种](modules/language.autoRecognitionLocalLanguage.js)<br>[空区域采样不覆盖手动设置的源语种](modules/language.getTranslateAreaText.js) | 2 失败 |
| C06 | [带重音的希腊字母仍属于希腊语](modules/language.getCharLanguage.js)<br>[增补平面汉字经过完整分词仍识别为中文](modules/language.recognition.js) | 2 失败 |
| C07 | [同一重音字母大小写的语言分类一致](modules/language.getCharLanguage.js)<br>[没有任何语言特征时返回未识别](modules/language.romanceSentenceAnaly.js) | 2 失败 |
| C08 | [英文混排只有繁体字时保留实际中文类型](modules/language.recognition.js) | 1 失败 |
| C09 | [逐字符识别不维护只写入而从不读取的局部数组](scenarios/audit-language.spec.js) | 1 失败 |
| C10 | [305 个独立命中保留全部位置](modules/util.findParticiple.js) | 1 失败 |
| C11 | [单字符分词命中后应返回有限的位置结果，不得陷入死循环](modules/util.participleIndexFind.js) | 1 失败 |
| C12 | [分段插入的美元和与号保持字面译文](modules/util.textReplace.js) | 1 失败 |
| C13 | [转义后的句点只匹配字面句点](modules/util.regExp.pattern.js) | 1 失败 |
| C14 | [字面参数名与 UTF-8 查询值一起解码](modules/util.getUrlParam.js) | 1 失败 |
| C15 | [拆分包含双引号的文本时保留原始内容](modules/util.split.js)<br>[拆分包含反斜杠和换行的文本时保留原始内容](modules/util.split.js)<br>[单个字符串比序列化上限多一个字符时无损分组](modules/util.split.js) | 3 失败 |
| C16 | [Edge 分片翻译一条长文本后仍返回同一条完整译文](scenarios/audit-language.spec.js) | 1 失败 |
| C17 | [浏览器语言 fr-FR 映射为 french](modules/util.browserDefaultLanguage.js)<br>[浏览器语言 si 映射为 sinhala](modules/util.browserDefaultLanguage.js) | 2 失败 |
| C18 | [提示组件依赖首次加载不使用同步网络请求](scenarios/audit-language.spec.js) | 1 失败 |

## 服务、请求和存储

| 编号 | 测试契约与文件 | 固定源码实测 |
| --- | --- | --- |
| D01 | [Edge 分片乱序完成后整批只回调一次并可从缓存重读](scenarios/audit-transport.spec.js) | 1 失败 |
| D02 | [同形异义词按源语种隔离缓存](scenarios/audit-transport.spec.js) | 1 失败 |
| D03 | [不同原文在哈希相同时仍分别保存和读取译文](scenarios/audit-transport.spec.js) | 1 失败 |
| D04 | [切换服务后解析到新服务配置的主机](scenarios/audit-transport.spec.js) | 1 失败 |
| D05 | [CRLF 行结束符恰好分隔在两个网络块之间时仍作为一个换行解析](modules/request.sse.post.js) | 1 失败 |
| D06 | [重复终结事件及其后的 item 不再产生第二次业务完成或增量更新](modules/request.sse.post.js)<br>[done 已交付后底层读取失败不得再调用失败回调或切换 XHR](modules/request.sse.post.js) | 2 失败 |
| D07 | [同步 XHR 在 send 返回前交付已完成的响应](scenarios/audit-transport.spec.js) | 1 失败 |
| D08 | [业务失败结果通过一次终态通知交付调用方](scenarios/audit-transport.spec.js) | 1 失败 |
| D09 | [缺失或非法的 texts 不抛出内部异常也不报告翻译成功](scenarios/audit-transport.spec.js) | 1 失败 |
| D10 | [已载入的主机队列到期后重新测速](scenarios/audit-transport.spec.js) | 1 失败 |
| D11 | [上一代主机测速回调不能改写新一代队列](scenarios/audit-transport.spec.js) | 1 失败 |
| D12 | [部分企业节点仍在测速时不会判定全部失效](scenarios/audit-transport.spec.js) | 1 失败 |
| D13 | [过期损坏的缓存队列回退到当前配置的主机](scenarios/audit-transport.spec.js) | 1 失败 |
| D14 | [附加表单键值中的保留字符往返无损](scenarios/audit-transport.spec.js) | 1 失败 |
| D15 | [默认页面标识剔除仅对页面有意义的查询与片段](scenarios/audit-transport.spec.js) | 1 失败 |
| D16 | [普通失败诊断不打印请求字段的完整值](scenarios/audit-transport.spec.js) | 1 失败 |
| D17 | [写请求成功但事务中止时拒绝写入，重读仍为已提交的旧值](modules/storage.IndexedDB.set.js) | 1 失败 |
| D18 | [错型的 text 响应不能切成字符并缓存为整句译文](scenarios/audit-transport.spec.js) | 1 失败 |
| D19 | [已有查询参数和版本参数分别保留](scenarios/audit-transport.spec.js) | 1 失败 |
| D20 | [GET 的查询数据到达实际请求 URL](scenarios/audit-transport.spec.js) | 1 失败 |
| D21 | [XHR 响应观察器抛错仍交付业务回调](scenarios/audit-transport.spec.js) | 1 失败 |
| D22 | [收到明确限流响应只报告原状态且不重复提交](scenarios/audit-transport.spec.js) | 1 失败 |
| D23 | [未回应的异步 XHR 具有有限的默认超时](scenarios/audit-transport.spec.js) | 1 失败 |
| D24 | [Edge 的内置语言列表不启动网络测速](scenarios/audit-transport.spec.js) | 1 失败 |
| D25 | [同源业务 AJAX 完成会调度翻译](scenarios/audit-transport.spec.js) | 1 失败 |
| D26 | [自建服务专用头只在本服务生效](scenarios/audit-transport.spec.js) | 1 失败 |
| D27 | [Edge 语种菜单不含遗留的 Name 占位符](scenarios/audit-transport.spec.js) | 1 失败 |
| D28 | [IndexedDB 源码示例使用可调用的 API 大小写](scenarios/audit-transport.spec.js) | 1 失败 |
| D29 | [首次并发读写共享 IndexedDB 连接](scenarios/audit-transport.spec.js)<br>[同源其他连接升级数据库时旧连接及时释放](scenarios/audit-transport.spec.js) | 2 失败 |
| D30 | [表单构造不改变同一对象下一次发送的参数](scenarios/audit-transport.spec.js) | 1 失败 |
| D31 | [同批重复原文只提交一次且保留所有输出位置](scenarios/audit-transport.spec.js) | 1 失败 |
| D32 | [有效空译文第二次可从缓存读取](scenarios/audit-transport.spec.js) | 1 失败 |
| D33 | [不同大小写的头按同一个 HTTP 字段覆盖](scenarios/audit-transport.spec.js) | 1 失败 |
| D34 | [无原型的普通参数字典可按自有键编码](scenarios/audit-transport.spec.js) | 1 失败 |
| D35 | [已知失败的业务资源不会误触发翻译调度](scenarios/audit-transport.spec.js) | 1 失败 |

## 图片、表单和对象翻译

| 编号 | 测试契约与文件 | 固定源码实测 |
| --- | --- | --- |
| E01 | [同一张图片可连续切换语种并还原](scenarios/audit-object.spec.js) | 1 失败 |
| E02 | [局部 execute 只处理范围内允许翻译的图片](scenarios/audit-object.spec.js) | 1 失败 |
| E03 | [译图只替换命中资源并保留 CSS 背景图层](scenarios/audit-object.spec.js) | 1 失败 |
| E04 | [srcset 的实际候选资源随目标语种切换](scenarios/audit-object.spec.js) | 1 失败 |
| E05 | [reset 保留用户在译文上实际键入的新值](scenarios/audit-object.spec.js) | 1 失败 |
| E06 | [跨节点首尾偏移相同时只发送一次，并保留选区文本](modules/selectionTranslate.callTranslate.js) | 1 失败 |
| E07 | [选择操作保存实例坐标并保留宿主同名状态](scenarios/audit-object.spec.js) | 1 失败 |
| E08 | [旧选区响应不能覆盖新选区或重新打开已关闭提示](scenarios/audit-object.spec.js) | 1 失败 |
| E09 | [body 就绪前开启划词也可在就绪后正常启动](scenarios/audit-object.spec.js) | 1 失败 |
| E10 | [移除进度类保持所有同前缀的宿主样式](scenarios/audit-object.spec.js) | 1 失败 |
| E11 | [启动后启用进度提示会影响下一次请求](scenarios/audit-object.spec.js) | 1 失败 |
| E12 | [同一元素最后一个请求完成后才解除提示](scenarios/audit-object.spec.js) | 1 失败 |
| E13 | [损坏 JSON 只报告解析失败且不会尝试动态求值](scenarios/audit-object.spec.js) | 1 失败 |
| E14 | [点号和数组状字符属于实际键名时仍写回原字段](scenarios/audit-object.spec.js) | 1 失败 |
| E15 | [普通文案 constructor 可作为独立译文索引](scenarios/audit-object.spec.js) | 1 失败 |
| E16 | [C++ 按字面量忽略，纯空白忽略配置不会拆词](scenarios/audit-object.spec.js) | 1 失败 |
| E17 | [整项是忽略文本时，后续字段仍可回填且保持请求与结果下标对应](modules/js.transObject.js) | 1 失败 |
| E18 | [底层传输失败触发对象翻译失败回调并保留输入](scenarios/audit-object.spec.js) | 1 失败 |
| E19 | [根字符串的成功结果为译文本身](scenarios/audit-object.spec.js) | 1 失败 |
| E20 | [在途翻译不会覆盖调用方对同一字段的新编辑](scenarios/audit-object.spec.js) | 1 失败 |
| E21 | [只遍历对象自身的可枚举文案](scenarios/audit-object.spec.js) | 1 失败 |
| E22 | [序列化保留单行函数的可执行类型](scenarios/audit-object.spec.js) | 1 失败 |
| E23 | [普通业务对象中的 jsObject 字段和其他自有键完整输出](scenarios/audit-object.spec.js) | 1 失败 |
| E24 | [普通文案中的换行占位字符串可原样往返](scenarios/audit-object.spec.js) | 1 失败 |
| E25 | [全部节点暂时失效后在可用节点恢复时返回企业服务](scenarios/audit-object.spec.js) | 1 失败 |

## 请求拦截、视觉处理与初始化

| 编号 | 测试契约与文件 | 固定源码实测 |
| --- | --- | --- |
| F01 | [表单只替换指定参数并保留未选中的参数](modules/network.RequestHandler.handleForm.js)<br>[规则参数不存在时保留其他表单值](modules/network.RequestHandler.handleForm.js)<br>[编码过的中文和空值经过选择性翻译后仍可正确解码](modules/network.RequestHandler.handleForm.js) | 3 失败 |
| F02 | [无需翻译的根数组保留原有 JSON 类型](scenarios/audit-network.spec.js) | 1 失败 |
| F03 | [翻译传输失败后拦截器能结束等待](scenarios/audit-network.spec.js) | 1 失败 |
| F04 | [译文中的百分号保持普通字符串语义](scenarios/audit-network.spec.js) | 1 失败 |
| F05 | [相对业务地址服从页面 base URL](scenarios/audit-network.spec.js) | 1 失败 |
| F06 | [多选查询参数翻译后仍保留每个值及顺序](scenarios/audit-network.spec.js) | 1 失败 |
| F07 | [匹配业务规则的二进制正文按原字节转发](scenarios/audit-network.spec.js) | 1 失败 |
| F08 | [翻译 GET 查询参数后仍响应调用方在请求进行中的取消信号](modules/network.fetch.hookFetch.js)<br>[POST 翻译处理后仍传递调用时已经取消的 Request 信号](modules/network.fetch.hookFetch.js) | 2 失败 |
| F09 | [等待译文时复用 XHR 不会再次发送旧请求](scenarios/audit-network.spec.js) | 1 失败 |
| F10 | [重新打开 XHR 后保留同名请求头的所有值](scenarios/audit-network.spec.js) | 1 失败 |
| F11 | [超过两千字符的文本请求保留对选中字段的翻译](scenarios/audit-network.spec.js) | 1 失败 |
| F12 | [启用 fetch 拦截后仍保留先安装的业务包装器](scenarios/audit-network.spec.js) | 1 失败 |
| F13 | [本库发出的翻译请求不交给业务参数翻译器](scenarios/audit-network.spec.js) | 1 失败 |
| F14 | [重复隐藏后显示可一次清除该标识的样式](scenarios/audit-network.spec.js) | 1 失败 |
| F15 | [显示文字时保留页面自身同名节点](scenarios/audit-network.spec.js) | 1 失败 |
| F16 | [已就绪页面调用 quickUse 会启动首次执行](scenarios/audit-network.spec.js) | 1 失败 |
| F17 | [决定首屏显隐前已使 URL 语言配置生效](scenarios/audit-network.spec.js) | 1 失败 |
| F18 | [初始化历史映射时使用当前语种的术语](scenarios/audit-network.spec.js) | 1 失败 |
| F19 | [清除翻译目标和双向历史记录，保留无关存储与翻译缓存](modules/reset.js) | 1 通过 |
| F20 | [已加载调试模块时每次打开都显示对话框](scenarios/audit-network.spec.js) | 1 失败 |
| F21 | [初始化依赖恢复后可正常重试](scenarios/audit-network.spec.js) | 1 失败 |
| F22 | [逐行提取矩形只需线性读取原始 DOMRectList](scenarios/audit-network.spec.js) | 1 失败 |
| F23 | [同一组矩形的视觉顺序不随输入排列而改变](scenarios/audit-network.spec.js) | 1 失败 |
| F24 | [重叠矩形不会遮掉后面的真实贴边邻居](scenarios/audit-network.spec.js) | 1 失败 |
| F25 | [尚未登记的页面文本不会使间隔调整中断](scenarios/audit-network.spec.js) | 1 失败 |

## 加载和兼容性

| 编号 | 测试契约与文件 | 固定源码实测 |
| --- | --- | --- |
| G01 | [页面已声明 translate 为 null 时仍可载入脚本](scenarios/audit-language.spec.js) | 1 失败 |
| G02 | [子页在译文渲染完成后发送一次语言切换完成通知](scenarios/audit-language.spec.js) | 1 失败 |
| G03 | [已有历史译文也要保留忽略区域中新插入的原文](modules/faultTolerance.documentCreateTextNode.enable.js) | 1 失败 |
| G04 | [普通文本 constructor 可参与正常计数](modules/util.arrayFindMaxNumber.js) | 1 失败 |
| G05 | [保留 cookie 值中的等号](modules/getCookie.js) | 1 失败 |
| G06 | [单项超长时处理余项必须取得进展](modules/util._splitMaxSize.js) | 1 失败 |
| G07 | [Node CommonJS 可在服务端导入浏览器库后再决定是否使用](scenarios/audit-language.spec.js) | 1 失败 |
| G08 | [嵌套函数保留引用且不会执行函数](modules/js.find.js) | 1 失败 |
