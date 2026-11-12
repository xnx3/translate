# 方法测试覆盖及验证记录

最近更新：2026-11-12（北京时间）。每次实际验证与历史分批基线分别记录，后续代码或用例变化后需要重新运行并更新结果。

## 网络规则的正则匹配位置按请求归零（4.1.13.20261112）

仅在 network.getRuleMatch 执行 URL 正则 test 前将 lastIndex 设为零，注释说明每次请求独立匹配。避免 g／y 标志的正则沿用上次匹配位置，保持方法大小写判断、首条规则优先及粘连正则从 URL 开头匹配的约束；不复制正则或调整 XHR、fetch 调用方。

getRuleMatch 保留原八条用例，新增不同有效地址连续请求、不匹配后恢复、请求方法切换、两规则共享正则、连续命中优先级、粘连正则重复及起始位置七条独立回归，共十五条。当前登记 275 个方法模块、2,860 条用例（888 条普通调用、1,972 条自定义判断），两份发布文件共 5,720 项方法检查；登记数量不代表本轮全量执行。

通过 BAT 分两批验证：首轮发现的是原八条规则用例，与 network.hookOpen、network.hookSend、network.fetch.hookFetch 共 58 项双版本检查；新增用例完成后再运行最终十五条规则用例，共 30 项双版本检查。按方法、备注与发布文件保留最新结果并去重后，每份文件各 36 项：源码全部通过，原 getRuleMatch 第八条失败修复，七条新增回归全部通过，其余已有 28 项保持通过；与上次完整源码报告比较未发现新增失败。

最终 getRuleMatch 为源码 15 / 0、压缩版 9 / 6（通过 / 失败），其余三个模块两份文件各 21 项全部通过，压缩版合计 30 项通过、6 项失败。压缩文件本次未更新，没有跳过或已知失败豁免，BAT 因压缩版真实失败返回非零退出码。本轮未重跑全部方法或原场景；源码与测试模块分别提交、推送。

本次验证对应发布文件 SHA-256：

```text
translate.js      95e6bafaab6d6bbcca29e2bbcf366d52be0959a9d31cd01c1f0718ddcd5b23db
translate.min.js  3fcfce8873ba6f67c32b2a46b7948fda7b8909523ccbf0751af58618cb0f8198
```

## 对象输出时保留具名函数的语法分隔（4.1.12.20261112）

仅在 js.objToString 重建函数表达式的模板中为 function 与名称补一个空格，完善原有注释，避免生成 functionplus 等无效语法。保留现有多行普通函数处理和 functionBodyHandle 行为；单行或箭头函数的既有处理范围不在本次扩展。

js.objToString 保留原九条用例，独立增加真正匿名的多行函数、下划线名称、多参数及同对象多个函数四条回归，共十三条，检查调用、名称、参数顺序及原函数保持。当前登记 275 个方法模块、2,853 条用例（888 条普通调用、1,965 条自定义判断），两份发布文件共 5,706 项方法检查；登记数量不代表本轮全量执行。

通过 BAT 对 js.find、js.objToString、js.setValueByPath、js.transObject、js.transString 五个模块运行两份实际发布文件，共 92 项检查。源码分别为 11 / 1、13 / 0、8 / 0、6 / 1、6 / 0（通过 / 失败），合计 44 项通过、2 项失败。与上次完整源码报告按方法和备注逐项比较，原 objToString 第八、九条失败恢复通过，四条新增回归全部通过，其余已有用例结果不变，未发现新增源码失败。

源码剩余两项仍为原有真实失败：js.find 漏记数组内函数路径，js.transObject 写回根数组路径时异常。这两项未在本轮顺带修改，没有新增豁免。

压缩文件本次未更新，objToString 为 8 项通过、5 项失败，其余四个模块的通过／失败数量与源码相同；压缩版合计 39 项通过、7 项失败。两份均无跳过或已知失败豁免，BAT 因真实失败返回非零退出码。本轮未重跑全部方法或原场景；源码与测试模块分别提交、推送。

本次验证对应发布文件 SHA-256：

```text
translate.js      05217858c0d1d0a9c3315c3267545d0bf6da9f9cb9b66abdd10f22664e1cf0b1
translate.min.js  3fcfce8873ba6f67c32b2a46b7948fda7b8909523ccbf0751af58618cb0f8198
```

## 配置导入补齐翻译接口地址（4.1.11.20261112）

仅在 config.set 中补齐 request.api.translate 的字符串赋值，与 config.data 中的接口结构及 config.get 的导出字段保持一致。沿用相邻接口配置的类型判断，未传入或非字符串保留原值，空字符串仍可按现有约定禁用翻译接口请求；无需调整 iframe 配置同步调用方。

config.set 保留原 98 条用例，新增空字符串、省略字段、显式 undefined、null、数值零、false、数组、函数及完整配置导出恢复九条独立回归，共 107 条。当前登记 275 个方法模块、2,849 条用例（888 条普通调用、1,961 条自定义判断），两份发布文件共 5,698 项方法检查；登记数量不代表本轮全量执行。

通过 BAT 对 config.set、config.get、config.data、element.iframe.execute 四个模块运行两份实际发布文件，共 338 项检查。源码分别为 107、46、9、7 项全部通过，共 169 项；与上次完整源码报告按方法和备注逐项比较，原 config.set 第八条自定义翻译接口配置失败恢复通过，九条新增回归全部通过，其余已有 159 项保持通过，未发现新增源码失败。

压缩文件本次未更新，config.set 为 104 项通过、3 项失败，失败对应自定义路径、空字符串及配置导出恢复；iframe 执行为 5 项通过、2 项原有失败，配置导出及默认配置共 55 项全部通过。压缩版合计 164 项通过、5 项失败。两份均无跳过或已知失败豁免，BAT 因压缩版真实失败返回非零退出码。本轮未重跑全部方法或原场景；源码与测试模块分别提交、推送。

本次验证对应发布文件 SHA-256：

```text
translate.js      9fa9fabfd87a698f7068b4beb587f374fae5b5af55ca8c7d0348a3bc88aba59a
translate.min.js  3fcfce8873ba6f67c32b2a46b7948fda7b8909523ccbf0751af58618cb0f8198
```

## 特殊字符识别补回英文冒号（4.1.10.20261112）

仅将 language.specialCharacter 正则中重复的分号编码 U+003B 改为上方注释已列出的冒号 U+003A，沿用既有识别流程和注释，不增加分支。language.getCharLanguage 对冒号的分类由空字符串变为 specialCharacter；connector 原本已经包含冒号，前期内存验证中八种含冒号文本的分段结果保持一致。

specialCharacter 保留原 63 条用例，独立增加冒号位于开头、中间、末尾及连续出现四种输入，共 67 条；getCharLanguage 保留原 22 条，新增冒号分类一条，共 23 条。当前登记 275 个方法模块、2,840 条用例（888 条普通调用、1,952 条自定义判断），两份发布文件共 5,680 项方法检查；登记数量不代表本轮全量执行。

通过 BAT 对 specialCharacter、getCharLanguage、connector、get、analyse、recognition 六个语言模块运行两份实际发布文件，共 352 项检查。源码分别为 67、23、63、9、6、8 项全部通过，共 176 项。与上次完整源码报告按方法和备注逐项比较，原 specialCharacter 第 63 条冒号失败恢复通过，五条新增用例全部通过，其余已有 170 条保持通过，未发现新增源码失败。

压缩文件本次未更新，specialCharacter 为 62 项通过、5 项冒号检查失败，getCharLanguage 为 22 项通过、1 项冒号分类失败，其余四个模块两份文件各 86 项全部通过；压缩版合计 170 项通过、6 项失败。两份均无跳过或已知失败豁免，BAT 因压缩版真实失败返回非零退出码。本轮未重跑全部方法或原场景；源码及两个测试模块分别提交、推送。

本次验证对应发布文件 SHA-256：

```text
translate.js      a983ede1a78106f876130849e54354502245804ae679f6e3ff4a79481a945420
translate.min.js  3fcfce8873ba6f67c32b2a46b7948fda7b8909523ccbf0751af58618cb0f8198
```

## 指定翻译范围时完整移除相邻空项（4.1.9.20261112）

仅在 setDocuments 的 splice 删除之后回退循环下标，并注释说明后续元素前移、下一轮需要重新检查当前位置。保留原数组引用、有效节点顺序、单元素及集合输入处理、空数组行为与清空翻译队列流程。

setDocuments 保留原十一条用例，新增混合 null／undefined 位于开头、中间、末尾、连续四项及全部为空五种独立回归，核对数组引用、节点顺序、队列清空及已有空范围约定。当前登记 275 个方法模块、2,835 条用例（883 条普通调用、1,952 条自定义判断），两份发布文件共 5,670 项方法检查；登记数量不代表本轮全量执行。

通过 BAT 对 setDocuments、getDocuments、execute、config.set 四个模块运行两份实际发布文件，共 308 项检查。源码 setDocuments 为 16 项全部通过，getDocuments 为 8 项全部通过，execute 为 29 项通过、3 项失败，config.set 为 97 项通过、1 项失败；合计 150 项通过、4 项失败。与上次完整源码报告按方法和备注逐项比较，原 setDocuments 第九、十条失败恢复通过，五条新增回归全部通过，其余已有用例的结果不变，未发现新增源码失败。

源码剩余四项仍是真实失败：config.set 未应用 request.api.translate；execute 忙碌时单元素与 NodeList 参数报错，以及空范围配合源语种过滤访问未建立批次。这些问题未在本轮顺带修改，也未增加豁免。

压缩文件本次未更新，setDocuments 为 9 项通过、7 项失败，getDocuments 为 8 项全部通过，execute 与 config.set 的通过／失败数量与源码相同；压缩版合计 143 项通过、11 项失败。两份均无跳过或已知失败豁免，BAT 因真实失败返回非零退出码。本轮未重跑全部方法或原场景；源码、测试模块分别提交、推送。

本次验证对应发布文件 SHA-256：

```text
translate.js      e9a53f6447c45a52ddc037e53b7145a42e956243e9358a3ce59e0f2f382f0bf8
translate.min.js  3fcfce8873ba6f67c32b2a46b7948fda7b8909523ccbf0751af58618cb0f8198
```

## 回收时保留负过期时间的常驻队列（4.1.8.20261112）

仅在 recycle 的节点队列过期条件前增加 expireTime >= 0，并注释说明负值表示常驻内存。非负过期时间的原有 +120 与严格小于边界不变，节点刷新和执行时间记录回收不变；重置或重新指定翻译范围仍可以主动清空队列。

recycle 保留原八条用例，新增负整数 -2、负小数 -0.5 的常驻检查及零值过期回收检查，各参数组合独立登记。当前登记 275 个方法模块、2,830 条用例（883 条普通调用、1,947 条自定义判断），两份发布文件共 5,660 项方法检查；登记数量不代表本轮全量执行。

通过 BAT 对 recycle、node.refresh、time.execute.start 三个模块测试两份实际发布文件，共 50 项检查。源码分别为 11、8、6 项全部通过，共 25 项；与上次完整源码报告按方法和备注比较，原 recycle 第一条常驻队列失败恢复通过，三条新增用例通过，其余已存在的 21 项保持通过。

压缩文件本次未更新，recycle 为 8 项通过、3 项失败，失败分别对应 -1、-2、-0.5 的常驻保留；其他两个模块共 14 项全部通过，压缩版合计 22 项通过、3 项失败。没有跳过或已知失败豁免，BAT 因压缩版真实失败返回非零退出码。本轮未重跑全部方法或原场景，不能据此宣称当前全量结果。源码与测试模块分别提交、推送。

本次验证对应发布文件 SHA-256：

```text
translate.js      1224bf284eb4592b481dbb86232cb97dbeb48a89e86639b9f2dc1560d7614704
translate.min.js  3fcfce8873ba6f67c32b2a46b7948fda7b8909523ccbf0751af58618cb0f8198
```

## 设置主机时按新参数判断类型（4.1.7.20261112）

仅将 request.setHost 的字符串判断对象由旧配置 api.host 改为本次传入的 hosts，补充原因注释。主机数组保留顺序及原引用，主机字符串包装为单元素数组；服务切换、测速、缓存清理及延迟初始化不变。

request.setHost 保留原五条用例，明确旧配置为数组的准备条件，新增两条字符串输入用例，独立覆盖旧数组／旧字符串与新数组／新字符串的四种组合。当前登记 275 个方法模块、2,827 条用例（883 条普通调用、1,944 条自定义判断），两份发布文件共 5,654 项方法检查；这些登记数量不代表本轮全量执行。

通过 BAT 分两批验证：先运行原五条主机用例、六个测速控制方法及 getUrl，共 72 项双版本检查；补齐后再独立运行 setHost 七条用例的双版本检查，共 14 项。按方法、备注和发布文件保留最新结果并去重后，八个模块每份文件各 38 项：源码全部通过，原 setHost 第五条数组嵌套失败修复，两条新增字符串用例通过；压缩版 36 项通过、2 项失败。setHost 最终为源码 7 / 0、压缩版 5 / 2，其余七个方法两份文件各 31 项全部通过。

压缩文件本次未更新，没有跳过或已知失败豁免，BAT 因压缩版真实失败返回非零退出码。本轮没有重新执行全部方法或原场景。源码修复与测试模块分别提交。

本次验证对应发布文件 SHA-256：

```text
translate.js      d0955cc5f72226a00a1e7afec96611e4efb39b2275a6c4f514b264362895e9f2
translate.min.js  3fcfce8873ba6f67c32b2a46b7948fda7b8909523ccbf0751af58618cb0f8198
```

## 渲染任务的尾空格判断（4.1.6.20261112）

仅将 renderTask.add 尾空格分支的检查位置由译文首字符改为末字符，并补充说明注释。复用原有 17 条入队用例，不增加重复测试；空译文与原文边缘空格的既有处理仍需另行审查。

通过 BAT 对 renderTask.add 与 renderTask.execute 两个模块分别运行两份实际发布文件，共 74 项检查。源码为 17 + 20 项全部通过：与前次源码报告按方法和备注逐项比较，仅 add 的第 15、16、17 条失败恢复通过，分别对应重复补尾空格、两端应保留时漏补尾空格、把前空格误当成尾空格。其余源码用例结果保持通过，execute 的两版结果均与前次报告一致。

压缩文件本次未更新，add 为 14 项通过、3 项失败，execute 为 14 项通过、6 项失败；共 28 项通过、9 项真实失败。没有跳过或已知失败豁免，BAT 因压缩版失败返回非零退出码。本轮只执行这两个相关模块，没有重新执行全部方法或原场景。

本次测试前后发布文件 SHA-256 一致：

```text
translate.js      456ef6efff7cddcb8f9c3abe419e873e046c1a3747ddebf4989f0b0837af6583
translate.min.js  3fcfce8873ba6f67c32b2a46b7948fda7b8909523ccbf0751af58618cb0f8198
```

## 指定位置未匹配时保留原文（4.1.5.20261112）

仅将 util.replaceFromIndex 未匹配分支的 `text: before` 改为 `text: text`，并补充说明注释。成功匹配的代码和未匹配时的 `replaceEndIndex: 0` 均未改变；复用现有 11 条用例，不增加重复测试或豁免。

通过 BAT 对 util.replaceFromIndex、util.textReplace、util.textReplace_service、renderTask.execute 四个模块分别运行两份实际发布文件，共 294 项检查。源码 147 项全部通过，其中 replaceFromIndex 11 项全过；与上次完整源码报告逐项比较，仅原第 9、10 条未匹配截断失败恢复通过，其余 145 项结果保持通过。

压缩文件本次未更新，四模块共 101 项通过、46 项失败，其中 replaceFromIndex 为 9 项通过、2 项失败；另外三个模块的压缩版结果与上次子集报告逐项一致。没有跳过或已知失败豁免，BAT 因压缩版真实失败返回非零退出码。此轮只执行上述四个模块，没有重新执行全部方法或原场景，不能把上次全量的 42 项失败直接改称本轮全量 40 项失败。

本次测试前后发布文件 SHA-256 一致：

```text
translate.js      95ffd06ea5e3d8e25e064c03f441e3d5f91f0ae943858f555851b1c2ea0f7a19
translate.min.js  3fcfce8873ba6f67c32b2a46b7948fda7b8909523ccbf0751af58618cb0f8198
```

## 上次登记与空译文验证（4.1.4.20261111）

当前从源码语法树识别出 275 个具名入口，对应 275 个非空模块，共 2,825 条独立用例（883 条普通调用、1,942 条自定义判断）。双项目实际发现 5,746 项检查：方法登记 5,650 项，原场景 96 项。发现数量不代表两份发布文件均已完成全量执行。

本轮源码版本为 4.1.4.20261111。空字符串译文已确认用于删除匹配原文：修复 util.textReplace_service 的两处条件，使空译文沿用已有替换流程，不补词间空格、不改写相邻标点，并继续保护分词和保留节点。上游 renderTask.add 对原文首尾空格的处理另行审查，本轮未改。

对当前源码完整运行全部 275 个方法模块，2,825 项中 2,783 项通过、42 项失败，无跳过或已知失败豁免。按“方法 + remark”逐项与历史 42 项源码失败比较，失败集合完全一致，26 个失败方法的数量也一致，没有新增或消失的失败；这些 42 项仍是真实失败，会使命令返回非零退出码。

三个相关模块分别对源码和当前压缩文件运行，结果如下。共新增 60 条独立用例：service 36 条、textReplace 16 条、renderTask.execute 8 条。

| 方法模块 | 当前用例数 | 源码通过 / 失败 | 压缩版通过 / 失败 |
| --- | ---: | ---: | ---: |
| [util.textReplace_service](modules/util.textReplace_service.js) | 51 | 51 / 0 | 25 / 26 |
| [util.textReplace](modules/util.textReplace.js) | 65 | 65 / 0 | 53 / 12 |
| [renderTask.execute](modules/renderTask.execute.js) | 20 | 20 / 0 | 14 / 6 |
| 合计 | 136 | 136 / 0 | 92 / 44 |

本轮未修改 translate.min.js，它尚未包含本轮空译文修复；压缩版仅完成上述三个方法模块的子集验证，44 项失败原样保留，不能据此或下方历史表宣称当前压缩版全量通过。源码完整回归也覆盖此前新增的三个 group 模块：[group.addElements](modules/group.addElements.js) 11 项、[group.analyze](modules/group.analyze.js) 24 项、[group.inGroup](modules/group.inGroup.js) 24 项，均通过。

原场景及包装层旧用例另行复测 194 项，其中每份文件的 49 项旧 util.textReplace 用例与上述方法检查重叠，不能重复计入总数。只统计原有 48 个场景时，源码为 43 项正常通过、4 项已知失败、1 项跳过，压缩版为 34 项正常通过、13 项已知失败、1 项跳过，两份均无意外失败，与原场景基线一致；已知失败仍未修复。

本轮验证前后的发布文件 SHA-256 一致：

```text
translate.js      ff97c705f53829a5f07bbba7c2c02100a0e5d61309050f788bb600331ebe0d79
translate.min.js  3fcfce8873ba6f67c32b2a46b7948fda7b8909523ccbf0751af58618cb0f8198
```

## 历史分批基线（272 个模块）

以下保留此前 272 个具名入口、272 个非空模块的历史记录，共 2,706 条独立用例（824 条普通调用、1,882 条自定义判断），两份发布文件共 5,412 项方法检查。这些结果及旧哈希对应当时的运行库和用例，不是当前版本的双项目全量结果。

入口包括普通方法、动态创建的 listener.callback、三个构造器及实例方法，以及同一发布文件中的两个 nodeuuid 全局方法；不把局部函数或回调重复计入入口。

以下历史结果来自分批实际运行：按当时模块文件的 SHA-256 匹配验证快照，发生内容变化的文件重新运行，再选取每个方法最新匹配的结果。不是一次不加筛选的全量运行。最后两批通过 BAT 复测新增和修正过的模块，原场景另以一个 worker 复测。仅移除文件末尾多余空行的规范化保留原执行证据。

上述基线后，维护者确认 compareStringsIgnoringNumbers 的原 verify 第 24 条应为 true，现已补回模块，并仅更正源码示例注释。该模块 22 条用例通过 BAT 分别对两份发布文件复测，共 44 项全部通过，无跳过或已知失败。

随后维护者确认保持 execute 的现有 Text 支持状态：直接传单个 Text 不翻译，传 [Text] 则支持翻译，不修改运行库或新增参数支持。新增两项独立回归后，该模块 32 条用例通过 BAT 分别对两份发布文件复测，共 64 项检查，58 项通过、6 项原有失败；每份文件均为 29 项通过、3 项原有失败，新增 4 项检查全部通过。旧 verify 页删除后，另对迁移的原 27 条分别运行两份发布文件，共 54 项全部通过，无跳过或已知失败。

维护者确认 storage.IndexedDB.list 保留当前默认参数和正则规则：省略参数、显式 `undefined` 或空字符串只匹配空键；`*` 转为 `.*`，其他正则字符保留原语义，构造后的非法正则以 `SyntaxError` 拒绝查询。仅补充源码注释和 19 条回归，该模块 31 条用例通过 BAT 分别对两份发布文件复测，共 62 项全部通过，无跳过或已知失败。其余方法及原场景沿用此前分批验证结果，没有重新全量执行。

当时在 Windows 使用 Playwright 与本机可运行的 Chromium 缓存 chromium-1234；接口使用本地模拟服务。上述更新后进行双项目发现检查，登记 5,508 项检查（方法 5,412 + 原场景 96）。浏览器执行结果与语法树/格式核对分别记录，不以发现数量代替执行通过。

## 历史分批执行结果

| 发布文件 | 方法检查通过 | 方法检查失败 | 原场景正常通过 | 原场景已知失败 | 原场景跳过 | 原场景意外失败 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| translate.js | 2664 | 42 | 43 | 4 | 1 | 0 |
| translate.min.js | 2659 | 47 | 34 | 13 | 1 | 0 |

方法检查合计 5,323 项通过、89 项失败，涉及 28 个方法模块。失败数量按“用例 × 发布文件”统计，不等于 89 个不同缺陷。方法模块不使用跳过或已知失败豁免，失败会使默认 BAT 返回非零退出码。

原有场景合计 77 项正常通过、17 项已知失败、2 项跳过，与原基线一致。已知失败不代表功能正常，严格模式会取消该类豁免。两类结果不要混为“全部通过”。

在该历史阶段，源码仅按上述确认将字符串比较示例注释由 false 更正为 true，并补充 IndexedDB.list 的现有规则注释，函数实现、压缩文件及版本号未变。去除注释和位置元数据后，当时源码可执行语法树与原基线一致；此前分批基线的源码 SHA-256 为 14fa001ac1e90ea4ac1be393af7795c96d8d867bcb0332c50db52fa4300bd089。该历史阶段发布文件 SHA-256：

```text
translate.js      84f8b22dfbf02329813d948d4c522e6312187f9fa2978661c04ed30bc88f95c1
translate.min.js  f027e461c331e21c60634725db8f13c01d72788faf87dc815882a7c0572e96e4
```

## 历史失败根因及源码回归对照

下表保留历史两份文件的失败计数；4.1.4.20261111 完整源码回归的 42 项与其中源码失败逐项一致，压缩版计数仍属于历史基线。util.replaceFromIndex 的两项源码失败已在 4.1.5.20261112 中修复，renderTask.add 的三项源码失败已在 4.1.6.20261112 中修复，request.setHost 的一项源码失败已在 4.1.7.20261112 中修复，结果见上文；不回写历史计数。其余问题的修复方案应另行审查。历史测试设置错误已经更正并复测，包括默认语种/标点规则、离线导出换行的源码与运行时转义层次、纯空白的可译文本，以及静态 value Attr 的记录位置。

| 方法模块 | 源码失败数 | 压缩版失败数 | 根因 |
| --- | ---: | ---: | --- |
| [addNodeToQueue](modules/addNodeToQueue.js) | 1 | 1 | 元素与 placeholder 参数进入术语直译分支后，元素转换为 Attr 却仍传递属性名，读取 Attr.placeholder 得到 undefined，译文未写入。 |
| [config.set](modules/config.set.js) | 1 | 1 | 配置导出及数据结构包含 request.api.translate，但 set 未应用此字段。 |
| [element.iframe.execute](modules/element.iframe.execute.js) | 0 | 2 | 当时压缩文件缺少源码中已有的运行时复用与 load 阶段受限文档检查，造成重复注入或跨域访问异常。 |
| [element.iframe.iframeJsInjector.injectJs](modules/element.iframe.iframeJsInjector.injectJs.js) | 1 | 1 | typeof null 等于 object；文档不可访问返回 null 时仍读取 readyState，导致异常。 |
| [element.nodeToElement](modules/element.nodeToElement.js) | 1 | 1 | 源码约定返回 Element，但把文本的 parentNode 直接入输出数组，未过滤类型为 11 的 DocumentFragment。 |
| [element.whileNodes](modules/element.whileNodes.js) | 1 | 2 | 自定义 input.value 先入队实时属性值，后续 gets 又扫描旧 HTML value Attr，产生过期数据；压缩版还缺少首次扫描带 src iframe 的现有修复。 |
| [execute](modules/execute.js) | 3 | 3 | 忙碌排队分支仅为日志调用原参数的 slice，单个元素和 NodeList 入队前抛错；空范围配合源语种过滤时，在补建队列前读取不存在批次的 list。 |
| [js.find](modules/js.find.js) | 1 | 1 | 数组分支递归到函数时没有记录函数路径，导致数组内函数映射丢失。 |
| [js.objToString](modules/js.objToString.js) | 2 | 2 | 具名函数重建时 function 关键字与名称之间缺少空格，产生无法解析的 functionplus 形式。 |
| [js.transObject](modules/js.transObject.js) | 1 | 1 | 根数组路径 [0] 转换后产生空的首段，写回时访问 obj[空字符串] 导致异常。 |
| [language.specialCharacter](modules/language.specialCharacter.js) | 1 | 1 | 注释明确包含ASCII冒号，但字符集合漏掉冒号，识别结果不符约定。 |
| [listener.callback](modules/listener.callback.js) | 1 | 1 | MutationObserver 同批去重使用内层 break，遇到重复节点时漏掉后续尚未处理的新节点。 |
| [network.getRuleMatch](modules/network.getRuleMatch.js) | 1 | 1 | 对共享全局正则直接调用 test，lastIndex 残留导致相同请求连续匹配时交替失败。 |
| [network.RequestHandler.handleForm](modules/network.RequestHandler.handleForm.js) | 4 | 4 | 展开 URLSearchParams 没有保留表单字段，且把整份翻译响应对象写入参数值。 |
| [network.RequestHandler.handleJson](modules/network.RequestHandler.handleJson.js) | 2 | 2 | 把整份翻译响应对象写回所选字符串字段，未取对应翻译文本。 |
| [offline.export](modules/offline.export.js) | 3 | 3 | 导出脚本使用模板字符串却未转义合法文本中的反斜杠、反引号和 ${...}，执行导入时文本被改写或脚本语法错误。 |
| [offline.fullExtract.export](modules/offline.fullExtract.export.js) | 3 | 3 | 导出脚本使用模板字符串却未转义合法文本中的反斜杠、反引号和 ${...}，执行导入时文本被改写或脚本语法错误。 |
| [recycle](modules/recycle.js) | 1 | 1 | 队列注释明确约定 expireTime=-1 表示常驻，但回收时直接按过期时间删除，未保留常驻记录。 |
| [renderTask.add](modules/renderTask.add.js) | 3 | 3 | 保留尾空格的判断读取译文首字符，导致尾部重复补空格或缺失空格。 |
| [request.setHost](modules/request.setHost.js) | 1 | 1 | 判断旧 api.host 的类型而非新参数类型，把合法的新主机数组再次包装，形成嵌套数组。 |
| [request.sse.post](modules/request.sse.post.js) | 1 | 1 | CRLF 恰好跨网络块时，前块尾部 CR 被提前转为 LF，后块起始 LF 拼入后误成空行，拆散事件并丢失 done。 |
| [selectLanguageTag.customLanguagesHandle](modules/selectLanguageTag.customLanguagesHandle.js) | 1 | 1 | 支持语种列表更新后继续复用旧 supportLanguageMap，无法移除旧语种。 |
| [setDocuments](modules/setDocuments.js) | 2 | 2 | 正向遍历中 splice 删除空区域后继续递增下标，跳过相邻的 null 或 undefined。 |
| [util.participleIndexFind](modules/util.participleIndexFind.js) | 1 | 1 | 单字符命中后搜索起点没有前进，造成无限循环。测试在可终止Worker中加载完整发布文件验证，超时安全终止。 |
| [util.replaceFromIndex](modules/util.replaceFromIndex.js) | 2 | 2 | 从指定位置找不到目标时只返回该位置之前的前缀，丢失原文后半部分；未匹配时应保留全文。 |
| [util.split](modules/util.split.js) | 2 | 2 | 通过 JSON 字符串拼接构造切分结果，未正确转义引号、反斜杠和换行，导致合法文本丢失或内容变化。 |
| [visual.adjustTranslationSpaces](modules/visual.adjustTranslationSpaces.js) | 0 | 2 | 当时源码追加非断行空格 U+00A0，压缩文件仍追加ASCII空格，两份发布文件行为不同。 |
| [whole.isWhole](modules/whole.isWhole.js) | 1 | 1 | 类名仅按普通空格切分，无法识别 HTML 允许的制表符和换行分隔。 |

单字符分词的挂死用例在可终止 Worker 中加载实际发布文件，超时后终止 Worker，使整套测试能够继续；没有复制被测算法。另用完整实际脚本核对加载成功、双字符正常返回而单字符不返回，支持死循环的根因判断。

## 原 verify.html 的逐项去向

原验证页 27 条记录已按原参数、预期、备注和来源编号全部迁移并独立核对，旧 translate.js/verify.html 已删除，删除后原 27 条对两份发布文件共 54 项检查全部通过，原始记录可在 Git 历史中查阅。第 24 条已由维护者确认应为 true，原源码示例注释已更正；重复记录仍分别保留，没有默默去重。

| 模块 | 原记录编号 | 已保留数量 | 模块中用例序号 |
| --- | --- | ---: | --- |
| util.findParticiple.js | 1、14 | 2 | 1、2 |
| util.textReplace.js | 2—13、15、16 | 14 | 1—14 |
| nomenclature.dispose.js | 17—19 | 3 | 1—3 |
| util.compareStringsIgnoringNumbers.js | 20—27 | 8 | 1—8 |

util.textReplace 当前 65 条独立用例，其中前 14 条来自原验证页。原第 12、13、15 条表达式相同，仍分别保留为模块第 11、12、13 条；原第 19 条备注写“字符串数组”而实参是字符串，两者都保留并在注释中说明。

## 待确认的行为与后续边界

此前待确认的 renderTask.execute 空字符串译文已确认支持删除匹配原文，相关修复及回归结果见本轮记录，不再列为待确认。

进一步扩展时还应核对：

- language.romanceSentenceAnaly 无识别特征时，注释要求空字符串，当前实现回退 french；先确认应使用哪个约定。
- language.recognitionAlgorithm 简繁比例阈值的注释为 8%，实现为 3%；冲突区间需要确定预期。
- lifecycle.changeLanguage.push 的注释与新旧回调列表写入行为不一致；需要确认是否应同时触发两套回调。
- listener.nodeValueChangeNeedTranslate 的近期渲染阈值说明存在 30ms 与 100ms 差异；当前只检查明显近期和明显过期。
- waitingExecute.add 的 null、无参数排队及调度链路需要继续补充；这些值可能被调度器视作停止标记。
- 未约定的错误类型、过小拆分长度、负数或非整数数量限制、空字符串分词、回调执行中增删回调，先明确应拒绝、忽略还是支持，再分别登记用例。
- 后续继续补充模块间协作和长期异步副作用；原场景里已经修复的功能还需收紧旧豁免，防止复发被归为已知失败。

当前覆盖 Chromium 的真实 DOM、原生 input setter、MutationObserver、存储及相关浏览器 API。尚未覆盖 Firefox、WebKit、移动设备、真实翻译服务，以及所有 CSP、跨域、断网和后台节流组合。iframe 相关方法和原场景需要结合评估。

有限用例不能穷尽任意字符串、对象、DOM 树和所有组合；275 个入口都有模块也不等于全部分支或全部传参已穷尽。后续逐条添加参数组合时，仍按 README 的两种格式和逐方法提交规则执行。

## 历史 272 个方法的参数与分批结果

下表保留历史基线的用例数和两份文件分批结果，结果列为“通过 / 失败”，没有用当前源码全量结果覆盖旧数据。链接指向当前模块，内容和用例数可能已增加；本轮三个变更模块及新增 group 的结果见上文。无参数方法还通过状态、DOM、回调或重复调用测试行为。

| 方法模块 | 形参 | 独立用例数 | 源码 通过 / 失败 | 压缩版 通过 / 失败 |
| --- | --- | ---: | ---: | ---: |
| [addNodeQueueItem](modules/addNodeQueueItem.js) | `uuid, node, word, attribute, lang, beforeText, afterText` | 16 | 16 / 0 | 16 / 0 |
| [addNodeToQueue](modules/addNodeToQueue.js) | `uuid, node, text, attribute` | 22 | 21 / 1 | 21 / 1 |
| [addNodeToQueueAnalysis](modules/addNodeToQueueAnalysis.js) | `uuid, node, text, attribute` | 17 | 17 / 0 | 17 / 0 |
| [addWholeContextToQueue](modules/addWholeContextToQueue.js) | `uuid, group` | 27 | 27 / 0 | 27 / 0 |
| [changeLanguage](modules/changeLanguage.js) | `languageName` | 9 | 9 / 0 | 9 / 0 |
| [check](modules/check.js) | 无参数 | 2 | 2 / 0 | 2 / 0 |
| [config.data](modules/config.data.js) | 无参数 | 9 | 9 / 0 | 9 / 0 |
| [config.get](modules/config.get.js) | 无参数 | 46 | 46 / 0 | 46 / 0 |
| [config.set](modules/config.set.js) | `data` | 98 | 97 / 1 | 97 / 1 |
| [currentLanguage](modules/currentLanguage.js) | 无参数 | 7 | 7 / 0 | 7 / 0 |
| [debug.loadDebugJs](modules/debug.loadDebugJs.js) | `func, debugJsUrl` | 6 | 6 / 0 | 6 / 0 |
| [debug.use](modules/debug.use.js) | `debugJsUrl` | 2 | 2 / 0 | 2 / 0 |
| [element.findNode](modules/element.findNode.js) | `uuid, node` | 8 | 8 / 0 | 8 / 0 |
| [element.getNodeName](modules/element.getNodeName.js) | `node` | 8 | 8 / 0 | 8 / 0 |
| [element.iframe.execute](modules/element.iframe.execute.js) | `iframeTag` | 7 | 7 / 0 | 5 / 2 |
| [element.iframe.iframeJsInjector](modules/element.iframe.iframeJsInjector.js) | `iframe, translateJsUrl` | 4 | 4 / 0 | 4 / 0 |
| [element.iframe.iframeJsInjector.importJsAndTranslateExecute](modules/element.iframe.iframeJsInjector.importJsAndTranslateExecute.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [element.iframe.iframeJsInjector.injectJs](modules/element.iframe.iframeJsInjector.injectJs.js) | 无参数 | 4 | 3 / 1 | 3 / 1 |
| [element.iframe.isIframeSameOrigin](modules/element.iframe.isIframeSameOrigin.js) | `iframe` | 10 | 10 / 0 | 10 / 0 |
| [element.iframe.use](modules/element.iframe.use.js) | `translateJsUrl` | 2 | 2 / 0 | 2 / 0 |
| [element.nodeAnalyse.analyse](modules/element.nodeAnalyse.analyse.js) | `node, originalText, resultText, attribute, participles` | 6 | 6 / 0 | 6 / 0 |
| [element.nodeAnalyse.analyseReplaceBefore_DateToTranslateNode](modules/element.nodeAnalyse.analyseReplaceBefore_DateToTranslateNode.js) | `node, attribute, resultShowText` | 5 | 5 / 0 | 5 / 0 |
| [element.nodeAnalyse.get](modules/element.nodeAnalyse.get.js) | `node, attribute` | 5 | 5 / 0 | 5 / 0 |
| [element.nodeAnalyse.gets](modules/element.nodeAnalyse.gets.js) | `node` | 17 | 17 / 0 | 17 / 0 |
| [element.nodeAnalyse.set](modules/element.nodeAnalyse.set.js) | `node, originalText, resultText, attribute, participles` | 6 | 6 / 0 | 6 / 0 |
| [element.nodeToElement](modules/element.nodeToElement.js) | `nodes` | 6 | 5 / 1 | 5 / 1 |
| [element.whileNodes](modules/element.whileNodes.js) | `uuid, node` | 7 | 6 / 1 | 5 / 2 |
| [enterprise.automaticAdaptationService](modules/enterprise.automaticAdaptationService.js) | 无参数 | 6 | 6 / 0 | 6 / 0 |
| [enterprise.use](modules/enterprise.use.js) | 无参数 | 5 | 5 / 0 | 5 / 0 |
| [execute](modules/execute.js) | `docs` | 32 | 29 / 3 | 29 / 3 |
| [execute_v1](modules/execute_v1.js) | 无参数 | 2 | 2 / 0 | 2 / 0 |
| [executeByLocalLanguage](modules/executeByLocalLanguage.js) | 无参数 | 10 | 10 / 0 | 10 / 0 |
| [faultTolerance.documentCreateTextNode.disable](modules/faultTolerance.documentCreateTextNode.disable.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [faultTolerance.documentCreateTextNode.enable](modules/faultTolerance.documentCreateTextNode.enable.js) | 无参数 | 7 | 7 / 0 | 7 / 0 |
| [faultTolerance.documentCreateTextNode.use](modules/faultTolerance.documentCreateTextNode.use.js) | 无参数 | 3 | 3 / 0 | 3 / 0 |
| [getCookie](modules/getCookie.js) | `name` | 10 | 10 / 0 | 10 / 0 |
| [getDocuments](modules/getDocuments.js) | 无参数 | 8 | 8 / 0 | 8 / 0 |
| [googleTranslateElementInit](modules/googleTranslateElementInit.js) | 无参数 | 3 | 3 / 0 | 3 / 0 |
| [history.translateText.add](modules/history.translateText.add.js) | `original, result` | 10 | 10 / 0 | 10 / 0 |
| [ignore.class.conditionFunction.ignore](modules/ignore.class.conditionFunction.ignore.js) | `element` | 3 | 3 / 0 | 3 / 0 |
| [ignore.class.push](modules/ignore.class.push.js) | `className, conditionFunction` | 8 | 8 / 0 | 8 / 0 |
| [ignore.isIgnore](modules/ignore.isIgnore.js) | `node, data` | 19 | 19 / 0 | 19 / 0 |
| [ignore.setTextRegexs](modules/ignore.setTextRegexs.js) | `arr` | 20 | 20 / 0 | 20 / 0 |
| [images.add](modules/images.add.js) | `queueArray` | 9 | 9 / 0 | 9 / 0 |
| [images.execute](modules/images.execute.js) | 无参数 | 9 | 9 / 0 | 9 / 0 |
| [images.gainCssBackgroundUrl](modules/images.gainCssBackgroundUrl.js) | `str` | 11 | 11 / 0 | 11 / 0 |
| [init](modules/init.js) | 无参数 | 5 | 5 / 0 | 5 / 0 |
| [isTranslate](modules/isTranslate.js) | `to` | 7 | 7 / 0 | 7 / 0 |
| [isTranslateExecute](modules/isTranslateExecute.js) | `to` | 11 | 11 / 0 | 11 / 0 |
| [js.find](modules/js.find.js) | `obj, parentKey = ''` | 12 | 11 / 1 | 11 / 1 |
| [js.objToString](modules/js.objToString.js) | `obj, formatSupplementaryCharLength` | 9 | 7 / 2 | 7 / 2 |
| [js.setValueByPath](modules/js.setValueByPath.js) | `obj, path, value` | 8 | 8 / 0 | 8 / 0 |
| [js.transObject](modules/js.transObject.js) | `jsObject, targetLanguage, successFunction, failureFunction` | 7 | 6 / 1 | 6 / 1 |
| [js.transString](modules/js.transString.js) | `jsString, targetLanguage, successFunction, failureFunction` | 6 | 6 / 0 | 6 / 0 |
| [language.analyse](modules/language.analyse.js) | `language, langStrs, upLangs, upLangsTwo, charstr` | 6 | 6 / 0 | 6 / 0 |
| [language.arabic](modules/language.arabic.js) | `str` | 10 | 10 / 0 | 10 / 0 |
| [language.autoRecognitionLocalLanguage](modules/language.autoRecognitionLocalLanguage.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [language.chinese](modules/language.chinese.js) | `str` | 12 | 12 / 0 | 12 / 0 |
| [language.clearCacheLanguage](modules/language.clearCacheLanguage.js) | 无参数 | 5 | 5 / 0 | 5 / 0 |
| [language.connector](modules/language.connector.js) | `str` | 63 | 63 / 0 | 63 / 0 |
| [language.english](modules/language.english.js) | `str` | 14 | 14 / 0 | 14 / 0 |
| [language.generateLanguageNameObject](modules/language.generateLanguageNameObject.js) | 无参数 | 5 | 5 / 0 | 5 / 0 |
| [language.get](modules/language.get.js) | `str` | 9 | 9 / 0 | 9 / 0 |
| [language.getCharLanguage](modules/language.getCharLanguage.js) | `charstr` | 22 | 22 / 0 | 22 / 0 |
| [language.getCurrent](modules/language.getCurrent.js) | 无参数 | 5 | 5 / 0 | 5 / 0 |
| [language.getLocal](modules/language.getLocal.js) | 无参数 | 5 | 5 / 0 | 5 / 0 |
| [language.getTranslateAreaText](modules/language.getTranslateAreaText.js) | 无参数 | 6 | 6 / 0 | 6 / 0 |
| [language.greek](modules/language.greek.js) | `str` | 10 | 10 / 0 | 10 / 0 |
| [language.hebrew](modules/language.hebrew.js) | `str` | 10 | 10 / 0 | 10 / 0 |
| [language.japanese](modules/language.japanese.js) | `str` | 10 | 10 / 0 | 10 / 0 |
| [language.korean](modules/language.korean.js) | `str` | 10 | 10 / 0 | 10 / 0 |
| [language.map](modules/language.map.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [language.number](modules/language.number.js) | `str` | 12 | 12 / 0 | 12 / 0 |
| [language.recognition](modules/language.recognition.js) | `str` | 8 | 8 / 0 | 8 / 0 |
| [language.recognition_languageName_force](modules/language.recognition_languageName_force.js) | `recognition_result` | 5 | 5 / 0 | 5 / 0 |
| [language.recognitionAlgorithm](modules/language.recognitionAlgorithm.js) | `str, data, languagesSize, allSize` | 13 | 13 / 0 | 13 / 0 |
| [language.romance](modules/language.romance.js) | `str` | 18 | 18 / 0 | 18 / 0 |
| [language.romanceSentenceAnaly](modules/language.romanceSentenceAnaly.js) | `text` | 12 | 12 / 0 | 12 / 0 |
| [language.romanian](modules/language.romanian.js) | `str` | 14 | 14 / 0 | 14 / 0 |
| [language.russian](modules/language.russian.js) | `str` | 12 | 12 / 0 | 12 / 0 |
| [language.setDefaultTo](modules/language.setDefaultTo.js) | `languageName` | 5 | 5 / 0 | 5 / 0 |
| [language.setLocal](modules/language.setLocal.js) | `languageName` | 5 | 5 / 0 | 5 / 0 |
| [language.setUrlParamControl](modules/language.setUrlParamControl.js) | `paramName` | 7 | 7 / 0 | 7 / 0 |
| [language.specialCharacter](modules/language.specialCharacter.js) | `str` | 63 | 62 / 1 | 62 / 1 |
| [language.textTranslateReplace](modules/language.textTranslateReplace.js) | `text, translateOriginal, translateResult, language` | 9 | 9 / 0 | 9 / 0 |
| [language.thai](modules/language.thai.js) | `str` | 10 | 10 / 0 | 10 / 0 |
| [language.wordBlankConnector](modules/language.wordBlankConnector.js) | `language` | 15 | 15 / 0 | 15 / 0 |
| [lifecycle.changeLanguage.push](modules/lifecycle.changeLanguage.push.js) | `func` | 3 | 3 / 0 | 3 / 0 |
| [lifecycle.changeLanguage.resetAfter_Trigger](modules/lifecycle.changeLanguage.resetAfter_Trigger.js) | `data` | 5 | 5 / 0 | 5 / 0 |
| [lifecycle.changeLanguage.trigger_Trigger](modules/lifecycle.changeLanguage.trigger_Trigger.js) | `data` | 7 | 7 / 0 | 7 / 0 |
| [lifecycle.execute.finally_Trigger](modules/lifecycle.execute.finally_Trigger.js) | `data` | 5 | 5 / 0 | 5 / 0 |
| [lifecycle.execute.renderFinish_Trigger](modules/lifecycle.execute.renderFinish_Trigger.js) | `uuid, to` | 6 | 6 / 0 | 6 / 0 |
| [lifecycle.execute.start_Trigger](modules/lifecycle.execute.start_Trigger.js) | `data` | 6 | 6 / 0 | 6 / 0 |
| [lifecycle.execute.startRun](modules/lifecycle.execute.startRun.js) | `uuid, from, to` | 6 | 6 / 0 | 6 / 0 |
| [lifecycle.execute.translateNetworkAfter_Trigger](modules/lifecycle.execute.translateNetworkAfter_Trigger.js) | `data` | 5 | 5 / 0 | 5 / 0 |
| [lifecycle.execute.translateNetworkBefore_Trigger](modules/lifecycle.execute.translateNetworkBefore_Trigger.js) | `data` | 6 | 6 / 0 | 6 / 0 |
| [lifecycle.execute.trigger_Trigger](modules/lifecycle.execute.trigger_Trigger.js) | `data` | 11 | 11 / 0 | 11 / 0 |
| [listener.addListener](modules/listener.addListener.js) | 无参数 | 7 | 7 / 0 | 7 / 0 |
| [listener.callback](modules/listener.callback.js) | `mutationsList, observer` | 22 | 21 / 1 | 21 / 1 |
| [listener.execute.renderFinishByApiRun](modules/listener.execute.renderFinishByApiRun.js) | `uuid, from, to` | 6 | 6 / 0 | 6 / 0 |
| [listener.execute.renderStartByApiRun](modules/listener.execute.renderStartByApiRun.js) | `uuid, from, to` | 6 | 6 / 0 | 6 / 0 |
| [listener.input.reset](modules/listener.input.reset.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [listener.input.start](modules/listener.input.start.js) | 无参数 | 9 | 9 / 0 | 9 / 0 |
| [listener.nodeValueChangeNeedTranslate](modules/listener.nodeValueChangeNeedTranslate.js) | `node` | 15 | 15 / 0 | 15 / 0 |
| [listener.renderTaskFinish](modules/listener.renderTaskFinish.js) | `renderTask` | 1 | 1 / 0 | 1 / 0 |
| [listener.reset](modules/listener.reset.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [listener.start](modules/listener.start.js) | 无参数 | 3 | 3 / 0 | 3 / 0 |
| [log](modules/log.js) | `obj` | 11 | 11 / 0 | 11 / 0 |
| [network._translateText](modules/network._translateText.js) | `text` | 5 | 5 / 0 | 5 / 0 |
| [network.fetch.hookFetch](modules/network.fetch.hookFetch.js) | `input, init` | 9 | 9 / 0 | 9 / 0 |
| [network.fetch.use](modules/network.fetch.use.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [network.getRuleMatch](modules/network.getRuleMatch.js) | `url, method` | 8 | 7 / 1 | 7 / 1 |
| [network.hookOpen](modules/network.hookOpen.js) | `method, url, async, user, password` | 4 | 4 / 0 | 4 / 0 |
| [network.hookSend](modules/network.hookSend.js) | `body` | 8 | 8 / 0 | 8 / 0 |
| [network.RequestHandler.handleForm](modules/network.RequestHandler.handleForm.js) | `body, rule` | 5 | 1 / 4 | 1 / 4 |
| [network.RequestHandler.handleGet](modules/network.RequestHandler.handleGet.js) | `url, rule` | 7 | 7 / 0 | 7 / 0 |
| [network.RequestHandler.handleJson](modules/network.RequestHandler.handleJson.js) | `body, rule` | 6 | 4 / 2 | 4 / 2 |
| [network.setRequestHeader](modules/network.setRequestHeader.js) | `header, value` | 4 | 4 / 0 | 4 / 0 |
| [network.use](modules/network.use.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [node.delete](modules/node.delete.js) | `node` | 5 | 5 / 0 | 5 / 0 |
| [node.find](modules/node.find.js) | `node` | 5 | 5 / 0 | 5 / 0 |
| [node.get](modules/node.get.js) | `node` | 5 | 5 / 0 | 5 / 0 |
| [node.refresh](modules/node.refresh.js) | 无参数 | 8 | 8 / 0 | 8 / 0 |
| [node.set](modules/node.set.js) | `node, value` | 5 | 5 / 0 | 5 / 0 |
| [node.setModified](modules/node.setModified.js) | `node, text` | 6 | 6 / 0 | 6 / 0 |
| [nodeuuid.index](modules/nodeuuid.index.js) | `node` | 6 | 6 / 0 | 6 / 0 |
| [nodeuuid.uuid](modules/nodeuuid.uuid.js) | `node` | 4 | 4 / 0 | 4 / 0 |
| [nomenclature.append](modules/nomenclature.append.js) | `from, to, properties` | 24 | 24 / 0 | 24 / 0 |
| [nomenclature.dispose](modules/nomenclature.dispose.js) | `textArray, nomenclatureKey, nomenclatureValue, nodeObject` | 18 | 18 / 0 | 18 / 0 |
| [nomenclature.get](modules/nomenclature.get.js) | 无参数 | 5 | 5 / 0 | 5 / 0 |
| [nomenclature.replace](modules/nomenclature.replace.js) | `text, nomenclatureKey, nomenclatureValue, nodeObject` | 18 | 18 / 0 | 18 / 0 |
| [nomenclature.set](modules/nomenclature.set.js) | `data` | 3 | 3 / 0 | 3 / 0 |
| [office.append](modules/office.append.js) | `to, properties` | 4 | 4 / 0 | 4 / 0 |
| [office.export](modules/office.export.js) | 无参数 | 2 | 2 / 0 | 2 / 0 |
| [office.showPanel](modules/office.showPanel.js) | 无参数 | 2 | 2 / 0 | 2 / 0 |
| [offline.append](modules/offline.append.js) | `to, properties` | 19 | 19 / 0 | 19 / 0 |
| [offline.export](modules/offline.export.js) | 无参数 | 10 | 7 / 3 | 7 / 3 |
| [offline.fullExtract.export](modules/offline.fullExtract.export.js) | `to` | 17 | 14 / 3 | 14 / 3 |
| [offline.fullExtract.set](modules/offline.fullExtract.set.js) | `hash, originalText, toLanguage, translateText` | 8 | 8 / 0 | 8 / 0 |
| [offline.showPanel](modules/offline.showPanel.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [postMessage.executeChangeLanguage](modules/postMessage.executeChangeLanguage.js) | `language, fromParent` | 6 | 6 / 0 | 6 / 0 |
| [postMessage.getCurrentOrigin](modules/postMessage.getCurrentOrigin.js) | 无参数 | 3 | 3 / 0 | 3 / 0 |
| [postMessage.getIframeOrigin](modules/postMessage.getIframeOrigin.js) | `iframe` | 14 | 14 / 0 | 14 / 0 |
| [postMessage.getOriginFromUrl](modules/postMessage.getOriginFromUrl.js) | `url` | 20 | 20 / 0 | 20 / 0 |
| [postMessage.getParentOrigin](modules/postMessage.getParentOrigin.js) | 无参数 | 5 | 5 / 0 | 5 / 0 |
| [postMessage.handleMessage](modules/postMessage.handleMessage.js) | `event` | 24 | 24 / 0 | 24 / 0 |
| [postMessage.init](modules/postMessage.init.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [postMessage.isOriginAllowed](modules/postMessage.isOriginAllowed.js) | `origin` | 19 | 19 / 0 | 19 / 0 |
| [postMessage.normalizeOrigin](modules/postMessage.normalizeOrigin.js) | `origin` | 20 | 20 / 0 | 20 / 0 |
| [postMessage.notifyChildren](modules/postMessage.notifyChildren.js) | `language` | 7 | 7 / 0 | 7 / 0 |
| [postMessage.notifyParent](modules/postMessage.notifyParent.js) | `language` | 4 | 4 / 0 | 4 / 0 |
| [postMessage.onReceiveChangeLanguage](modules/postMessage.onReceiveChangeLanguage.js) | `language, fromParent` | 6 | 6 / 0 | 6 / 0 |
| [postMessage.ping](modules/postMessage.ping.js) | `iframe, callback` | 7 | 7 / 0 | 7 / 0 |
| [postMessage.reset](modules/postMessage.reset.js) | 无参数 | 5 | 5 / 0 | 5 / 0 |
| [postMessage.resolveTargetOrigin](modules/postMessage.resolveTargetOrigin.js) | `origin` | 15 | 15 / 0 | 15 / 0 |
| [postMessage.send](modules/postMessage.send.js) | `targetWindow, type, payload, targetOrigin` | 12 | 12 / 0 | 12 / 0 |
| [postMessage.shouldNotifyParent](modules/postMessage.shouldNotifyParent.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [progress.api.removeChildClass](modules/progress.api.removeChildClass.js) | `node, level` | 6 | 6 / 0 | 6 / 0 |
| [progress.api.removeUITipByElements](modules/progress.api.removeUITipByElements.js) | `elements` | 9 | 9 / 0 | 9 / 0 |
| [progress.api.setUITip](modules/progress.api.setUITip.js) | `tip` | 4 | 4 / 0 | 4 / 0 |
| [progress.api.startUITip](modules/progress.api.startUITip.js) | `config` | 10 | 10 / 0 | 10 / 0 |
| [quickUse](modules/quickUse.js) | 无参数 | 3 | 3 / 0 | 3 / 0 |
| [recycle](modules/recycle.js) | 无参数 | 8 | 7 / 1 | 7 / 1 |
| [refreshCurrentPage](modules/refreshCurrentPage.js) | 无参数 | 1 | 1 / 0 | 1 / 0 |
| [renderTask](modules/renderTask.js) | 无参数 | 3 | 3 / 0 | 3 / 0 |
| [renderTask.add](modules/renderTask.add.js) | `node, originalText, resultText, attribute, participles` | 17 | 14 / 3 | 14 / 3 |
| [renderTask.execute](modules/renderTask.execute.js) | 无参数 | 12 | 12 / 0 | 12 / 0 |
| [request.buildHeaders](modules/request.buildHeaders.js) | `headers` | 7 | 7 / 0 | 7 / 0 |
| [request.buildPostParams](modules/request.buildPostParams.js) | `data, extraParams` | 11 | 11 / 0 | 11 / 0 |
| [request.getUrl](modules/request.getUrl.js) | `path` | 4 | 4 / 0 | 4 / 0 |
| [request.initRequest](modules/request.initRequest.js) | 无参数 | 5 | 5 / 0 | 5 / 0 |
| [request.listener.addExecute](modules/request.listener.addExecute.js) | 无参数 | 5 | 5 / 0 | 5 / 0 |
| [request.listener.addListener](modules/request.listener.addListener.js) | 无参数 | 8 | 8 / 0 | 8 / 0 |
| [request.listener.reset](modules/request.listener.reset.js) | 无参数 | 3 | 3 / 0 | 3 / 0 |
| [request.listener.start](modules/request.listener.start.js) | 无参数 | 2 | 2 / 0 | 2 / 0 |
| [request.listener.trigger](modules/request.listener.trigger.js) | `url` | 4 | 4 / 0 | 4 / 0 |
| [request.post](modules/request.post.js) | `path, data, func, abnormalFunc, sseCallbacks` | 8 | 8 / 0 | 8 / 0 |
| [request.response](modules/request.response.js) | `xhr` | 3 | 3 / 0 | 3 / 0 |
| [request.send](modules/request.send.js) | `url, data, appendXhrData, func, method, isAsynchronize, headers, abnormalFunc, showErrorLog` | 11 | 11 / 0 | 11 / 0 |
| [request.setHost](modules/request.setHost.js) | `hosts` | 5 | 4 / 1 | 4 / 1 |
| [request.speedDetectionControl.checkResponseSpeed](modules/request.speedDetectionControl.checkResponseSpeed.js) | 无参数 | 5 | 5 / 0 | 5 / 0 |
| [request.speedDetectionControl.checkResponseSpeed_Storage](modules/request.speedDetectionControl.checkResponseSpeed_Storage.js) | `host, time` | 4 | 4 / 0 | 4 / 0 |
| [request.speedDetectionControl.getHost](modules/request.speedDetectionControl.getHost.js) | 无参数 | 5 | 5 / 0 | 5 / 0 |
| [request.speedDetectionControl.getHostQueue](modules/request.speedDetectionControl.getHostQueue.js) | 无参数 | 6 | 6 / 0 | 6 / 0 |
| [request.speedDetectionControl.getHostQueueIndex](modules/request.speedDetectionControl.getHostQueueIndex.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [request.speedDetectionControl.setCurrentHost](modules/request.speedDetectionControl.setCurrentHost.js) | `host` | 3 | 3 / 0 | 3 / 0 |
| [request.sse.collectSafeProgressElements](modules/request.sse.collectSafeProgressElements.js) | `state, data` | 32 | 32 / 0 | 32 / 0 |
| [request.sse.isSupport](modules/request.sse.isSupport.js) | 无参数 | 8 | 8 / 0 | 8 / 0 |
| [request.sse.parseEventBlock](modules/request.sse.parseEventBlock.js) | `block` | 15 | 15 / 0 | 15 / 0 |
| [request.sse.post](modules/request.sse.post.js) | `path, data, func, abnormalFunc, fallbackFunc, sseCallbacks` | 15 | 14 / 1 | 14 / 1 |
| [request.sse.start](modules/request.sse.start.js) | 无参数 | 3 | 3 / 0 | 3 / 0 |
| [request.sse.stop](modules/request.sse.stop.js) | 无参数 | 3 | 3 / 0 | 3 / 0 |
| [request.sse.triggerEvent](modules/request.sse.triggerEvent.js) | `eventName, eventData, requestData, sseCallbacks` | 7 | 7 / 0 | 7 / 0 |
| [request.translateText](modules/request.translateText.js) | `obj, func, abnormalFunc` | 15 | 15 / 0 | 15 / 0 |
| [reset](modules/reset.js) | `config` | 19 | 19 / 0 | 19 / 0 |
| [selectionTranslate.callTranslate](modules/selectionTranslate.callTranslate.js) | `event` | 6 | 6 / 0 | 6 / 0 |
| [selectionTranslate.start](modules/selectionTranslate.start.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [selectLanguageTag.changeLanguageBeforeLoadOfflineFile](modules/selectLanguageTag.changeLanguageBeforeLoadOfflineFile.js) | `path` | 3 | 3 / 0 | 3 / 0 |
| [selectLanguageTag.customLanguagesHandle](modules/selectLanguageTag.customLanguagesHandle.js) | `languageList` | 10 | 9 / 1 | 9 / 1 |
| [selectLanguageTag.customUI](modules/selectLanguageTag.customUI.js) | `languageList` | 6 | 6 / 0 | 6 / 0 |
| [selectLanguageTag.refreshRender](modules/selectLanguageTag.refreshRender.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [selectLanguageTag.render](modules/selectLanguageTag.render.js) | 无参数 | 7 | 7 / 0 | 7 / 0 |
| [selectLanguageTag.selectOnChange](modules/selectLanguageTag.selectOnChange.js) | `event` | 5 | 5 / 0 | 5 / 0 |
| [service.edge.language.getMap](modules/service.edge.language.getMap.js) | 无参数 | 6 | 6 / 0 | 6 / 0 |
| [service.edge.translate](modules/service.edge.translate.js) | `path, data, func, abnormalFunc` | 8 | 8 / 0 | 8 / 0 |
| [service.use](modules/service.use.js) | `serviceName` | 16 | 16 / 0 | 16 / 0 |
| [setAutoDiscriminateLocalLanguage](modules/setAutoDiscriminateLocalLanguage.js) | 无参数 | 3 | 3 / 0 | 3 / 0 |
| [setCookie](modules/setCookie.js) | `name, value` | 13 | 13 / 0 | 13 / 0 |
| [setDocuments](modules/setDocuments.js) | `documents` | 11 | 9 / 2 | 9 / 2 |
| [setUseVersion2](modules/setUseVersion2.js) | 无参数 | 4 | 4 / 0 | 4 / 0 |
| [storage.browser.memory.get](modules/storage.browser.memory.get.js) | `key` | 15 | 15 / 0 | 15 / 0 |
| [storage.browser.memory.remove](modules/storage.browser.memory.remove.js) | `key` | 13 | 13 / 0 | 13 / 0 |
| [storage.browser.memory.set](modules/storage.browser.memory.set.js) | `key, value` | 17 | 17 / 0 | 17 / 0 |
| [storage.browser.storage.get](modules/storage.browser.storage.get.js) | `key` | 19 | 19 / 0 | 19 / 0 |
| [storage.browser.storage.set](modules/storage.browser.storage.set.js) | `key, value` | 18 | 18 / 0 | 18 / 0 |
| [storage.get](modules/storage.get.js) | `key` | 15 | 15 / 0 | 15 / 0 |
| [storage.IndexedDB.get](modules/storage.IndexedDB.get.js) | `key` | 13 | 13 / 0 | 13 / 0 |
| [storage.IndexedDB.initDB](modules/storage.IndexedDB.initDB.js) | 无参数 | 6 | 6 / 0 | 6 / 0 |
| [storage.IndexedDB.list](modules/storage.IndexedDB.list.js) | `key = ''` | 31 | 31 / 0 | 31 / 0 |
| [storage.IndexedDB.set](modules/storage.IndexedDB.set.js) | `key, value` | 16 | 16 / 0 | 16 / 0 |
| [storage.set](modules/storage.set.js) | `key, value` | 15 | 15 / 0 | 15 / 0 |
| [time.execute.start](modules/time.execute.start.js) | 无参数 | 6 | 6 / 0 | 6 / 0 |
| [time.log](modules/time.log.js) | `remark` | 6 | 6 / 0 | 6 / 0 |
| [util._splitMaxSize](modules/util._splitMaxSize.js) | `array, size, maxSize` | 8 | 8 / 0 | 8 / 0 |
| [util.arrayFindMaxNumber](modules/util.arrayFindMaxNumber.js) | `arr` | 9 | 9 / 0 | 9 / 0 |
| [util.browserDefaultLanguage](modules/util.browserDefaultLanguage.js) | 无参数 | 12 | 12 / 0 | 12 / 0 |
| [util.charReplace](modules/util.charReplace.js) | `str` | 15 | 15 / 0 | 15 / 0 |
| [util.compareStringsIgnoringNumbers](modules/util.compareStringsIgnoringNumbers.js) | `a, b` | 22 | 22 / 0 | 22 / 0 |
| [util.findParticiple](modules/util.findParticiple.js) | `text, findText, translateTexts` | 17 | 17 / 0 | 17 / 0 |
| [util.findTag](modules/util.findTag.js) | `str` | 12 | 12 / 0 | 12 / 0 |
| [util.getElementPosition](modules/util.getElementPosition.js) | `node` | 5 | 5 / 0 | 5 / 0 |
| [util.getUrlParam](modules/util.getUrlParam.js) | `name` | 8 | 8 / 0 | 8 / 0 |
| [util.hash](modules/util.hash.js) | `str` | 10 | 10 / 0 | 10 / 0 |
| [util.loadMsgJs](modules/util.loadMsgJs.js) | 无参数 | 3 | 3 / 0 | 3 / 0 |
| [util.objSort](modules/util.objSort.js) | `obj` | 6 | 6 / 0 | 6 / 0 |
| [util.participleIndexFind](modules/util.participleIndexFind.js) | `text, newTranslateTexts` | 11 | 10 / 1 | 10 / 1 |
| [util.regExp.pattern](modules/util.regExp.pattern.js) | `str` | 17 | 17 / 0 | 17 / 0 |
| [util.regExp.resultText](modules/util.regExp.resultText.js) | `str` | 8 | 8 / 0 | 8 / 0 |
| [util.replaceFromIndex](modules/util.replaceFromIndex.js) | `text, index, originalText, replaceText` | 11 | 9 / 2 | 9 / 2 |
| [util.split](modules/util.split.js) | `array, size, maxSize` | 14 | 12 / 2 | 12 / 2 |
| [util.synchronizesLoadJs](modules/util.synchronizesLoadJs.js) | `url` | 9 | 9 / 0 | 9 / 0 |
| [util.text_full_half_width_generate](modules/util.text_full_half_width_generate.js) | `text, language` | 18 | 18 / 0 | 18 / 0 |
| [util.textReplace](modules/util.textReplace.js) | `text, translateOriginal, translateResult, language, participles` | 49 | 49 / 0 | 49 / 0 |
| [util.textReplace_service](modules/util.textReplace_service.js) | `text, translateOriginal, translateResult, language, participles` | 15 | 15 / 0 | 15 / 0 |
| [util.urlSplitByText](modules/util.urlSplitByText.js) | `text` | 12 | 12 / 0 | 12 / 0 |
| [util.uuid](modules/util.uuid.js) | 无参数 | 3 | 3 / 0 | 3 / 0 |
| [util.versionStringToInt](modules/util.versionStringToInt.js) | `versionString` | 9 | 9 / 0 | 9 / 0 |
| [visual.adjustTranslationSpaces](modules/visual.adjustTranslationSpaces.js) | `nodes` | 6 | 6 / 0 | 4 / 2 |
| [visual.adjustTranslationSpacesByNodequeueUuid](modules/visual.adjustTranslationSpacesByNodequeueUuid.js) | `uuid` | 4 | 4 / 0 | 4 / 0 |
| [visual.afterAddSpace](modules/visual.afterAddSpace.js) | `adjacentPairs` | 7 | 7 / 0 | 7 / 0 |
| [visual.afterAdjacent](modules/visual.afterAdjacent.js) | `rects` | 7 | 7 / 0 | 7 / 0 |
| [visual.areHorizontallyAdjacent](modules/visual.areHorizontallyAdjacent.js) | `rect1, rect2` | 8 | 8 / 0 | 8 / 0 |
| [visual.coordinateSort](modules/visual.coordinateSort.js) | `rects` | 7 | 7 / 0 | 7 / 0 |
| [visual.filterRectsByLineInterval](modules/visual.filterRectsByLineInterval.js) | `rects, line` | 9 | 9 / 0 | 9 / 0 |
| [visual.getRects](modules/visual.getRects.js) | `nodes` | 7 | 7 / 0 | 7 / 0 |
| [visual.groupRectsByLine](modules/visual.groupRectsByLine.js) | `rects` | 7 | 7 / 0 | 7 / 0 |
| [visual.hideText.hide](modules/visual.hideText.hide.js) | `id` | 6 | 6 / 0 | 6 / 0 |
| [visual.hideText.show](modules/visual.hideText.show.js) | `id` | 6 | 6 / 0 | 6 / 0 |
| [visual.rectsSpaceEliminateOverlap](modules/visual.rectsSpaceEliminateOverlap.js) | `inputRects` | 11 | 11 / 0 | 11 / 0 |
| [visual.rectsToOneArray](modules/visual.rectsToOneArray.js) | `rects` | 5 | 5 / 0 | 5 / 0 |
| [visual.webPageLoadTranslateBeforeHiddenText](modules/visual.webPageLoadTranslateBeforeHiddenText.js) | `config` | 8 | 8 / 0 | 8 / 0 |
| [waitingExecute.add](modules/waitingExecute.add.js) | `docs` | 7 | 7 / 0 | 7 / 0 |
| [waitingExecute.get](modules/waitingExecute.get.js) | 无参数 | 5 | 5 / 0 | 5 / 0 |
| [waitingExecute.isAllExecuteFinish](modules/waitingExecute.isAllExecuteFinish.js) | `uuid, from, to, result, info` | 7 | 7 / 0 | 7 / 0 |
| [whole.context.collectInlineTextGroups](modules/whole.context.collectInlineTextGroups.js) | `root` | 8 | 8 / 0 | 8 / 0 |
| [whole.context.isBreakElement](modules/whole.context.isBreakElement.js) | `ele` | 64 | 64 / 0 | 64 / 0 |
| [whole.context.isRootElement](modules/whole.context.isRootElement.js) | `ele` | 12 | 12 / 0 | 12 / 0 |
| [whole.context.isUse](modules/whole.context.isUse.js) | 无参数 | 10 | 10 / 0 | 10 / 0 |
| [whole.context.use](modules/whole.context.use.js) | 无参数 | 2 | 2 / 0 | 2 / 0 |
| [whole.enableAll](modules/whole.enableAll.js) | 无参数 | 2 | 2 / 0 | 2 / 0 |
| [whole.executeTip](modules/whole.executeTip.js) | 无参数 | 3 | 3 / 0 | 3 / 0 |
| [whole.isWhole](modules/whole.isWhole.js) | `ele` | 9 | 8 / 1 | 8 / 1 |

## 重新运行

直接双击 tests/test-translate.js.bat，或在仓库根目录执行：

```bat
tests\test-translate.js.bat --no-pause
```

默认自动发现全部方法模块与场景，分别测试两份实际发布文件。新增方法缺少同名模块时，启动阶段会失败；用例字段不符合约定或模块为空时，也会失败。

report/results.json 保存最近一次命令实际选择的测试，部分运行会覆盖上一份报告；不能把一个子集报告当作全量通过。本文分别保存本轮实际验证和历史分批基线，范围和运行库哈希各自独立，后续以重新运行结果为准。
