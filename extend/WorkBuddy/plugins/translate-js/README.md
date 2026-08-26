# translate-js-connector

一个**零依赖**的 WorkBuddy / MCP 连接器，用来把 [translate.zvo.cn](https://translate.zvo.cn/) 的
**translate.js** 多语言切换插件，快速接入到用户自己的网站或系统中。

用户在 WorkBuddy 里选择这个连接器后，只需说明一下自己的网站技术栈和想支持的语言，
连接器就会生成一段可直接复制使用的 `<script>` 接入代码（含 CDN 引入、翻译通道、本地语种、
目标语种、切换栏、忽略元素、自定义术语等微调配置），而不用自己去读文档、拼参数。

- 纯前端 MIT 开源插件，基础用法无需 API Key。
- 连接器本身**不调用任何远程接口**，所有代码都在本地拼装，可离线运行。
- 单文件、零 npm 依赖，`node index.js` 即可启动。

> 微调指令完整文档：https://translate.zvo.cn/zhiling.html

---

## 一、给用户（安装方式）

把整个 `translate-js-connector` 文件夹发给用户，让用户在 WorkBuddy 的配置文件
`~/.workbuddy/mcp.json` 中追加一段（如文件不存在则新建）：

```json
{
  "mcpServers": {
    "translate-js": {
      "command": "node",
      "args": ["/这里换成绝对路径/translate-js-connector/index.js"]
    }
  }
}
```

保存后，重启 WorkBuddy 并在连接器管理里**信任/启用** `translate-js`，即可在对话中调用。

> Windows 用户：`args` 里的路径用正斜杠或双反斜杠，例如
> `C:/Users/用户名/translate-js-connector/index.js`。

---

## 二、连接器提供的工具

| 工具 | 作用 |
| --- | --- |
| `generate_translatejs_code` | 核心工具。按技术栈与需求生成 translate.js 接入代码。参数见下表。 |
| `list_languages` | 返回常用语种 id ↔ 中文名对照表，以及各翻译通道支持的语种数量。 |
| `get_setup_guide` | 按技术栈（HTML / Vue3 / React / UniApp / Nuxt / Next.js）返回接入步骤与常见坑。 |
| `check_integration` | 接入前检测：当前项目是否已接入过 translate.js（搜索哪些特征即可判定），并给出「已接入应询问用户诉求」的提醒文案。 |
| `list_advanced_tweaks` | 返回 translate.js 全部微调指令索引（共 50 项），逐项标注「已覆盖 / 部分覆盖 / 说明 / 未覆盖」与官方文档链接，便于查阅进阶能力。 |
| `download_translatejs` | 按顺序从官方源（gitee → github → res.zvo.cn）下载最新版 translate.js 源码到用户项目的静态资源目录，是「本地引入」模式的前提。需传 `target_dir`（绝对路径）。 |
| `verify_integration` | **接入后必做**：用真实无头浏览器（Playwright）加载页面，确认 translate.js 已加载、切换栏已渲染，并捕获浏览器控制台的 `console.error` / `pageerror`，报告是否有 translate.js 相关的 JS 报错。未装 Playwright 时退化为静态检查并给安装指引。需传 `html_path`（绝对路径）。 |

### `generate_translatejs_code` 参数

| 参数 | 说明 | 默认 |
| --- | --- | --- |
| `tech_stack` | 网站技术栈：`plain_html` / `vue3` / `react` / `uniapp` / `nuxt` / `nextjs` / `other` | `plain_html` |
| `local_language` | 本地语种（原文语种）id，如 `chinese_simplified` | `chinese_simplified` |
| `target_languages` | 目标语种 id 数组，如 `["english","japanese"]` | `["english"]` |
| `show_selector` | 是否显示语言切换下拉框 | `true` |
| `selector_container_id` | 指定切换栏渲染到的容器 id（可选） | 空（自动创建） |
| `default_language` | 首次访问默认显示语种（可选） | 空（用本地语种） |
| `auto_discriminate` | 是否按访问者浏览器语言自动切换 | `false` |
| `listen_dynamic` | 是否监控动态渲染内容（Vue/React/ajax） | `true` |
| `ignore_classes` / `ignore_ids` / `ignore_tags` | 不翻译的 class / id / 标签 | `[]` |
| `custom_terms` | 自定义术语，每行 `原文=译文` | 空 |
| `service_channel` | 翻译通道：`client_edge`（微软免费，推荐零配置）/ `translate_service`（官方免费通道，有日字符上限）/ `giteeAI`（大模型通道，需开通配置 API Key） | `client_edge` |
| `cdn_version` | translate.js 的 CDN 版本。默认 `latest`（始终从官方 master 分支拉最新版，本连接器多久不更新都不会变旧）；填具体版本号（如 `3.18.66`）则改用 staticfile 固定版本（仅 `intro_mode=cdn` 生效） | `latest` |
| `intro_mode` | 引入方式：`cdn`（在线引入，默认，简单但有高峰期加载慢风险）/ `local`（下载源码到自有服务器后本地引入，推荐更稳定） | `cdn` |
| `local_path` | `intro_mode=local` 时本地引入路径，如 `/translate/translate.js` | `/translate/translate.js` |
| `selector_css` | 切换栏美化 CSS（控制 `.translateSelectLanguage` 的位置/样式），不含 `<style>` 标签 | 空 |
| `image_translations` | 图片翻译映射，每行 `原图URL=目标图URL`，目标可用 `{language}` 占位符表示当前语种 | 空 |
| `manual_switch` | 是否额外生成一组手动切换按钮（`<a href="javascript:translate.changeLanguage('english')">英语</a>`） | `false` |
| `self_test` | 是否在接入代码末尾追加「自检」脚本：页面加载后在浏览器控制台（F12）打印绿色/红色横幅，提示是否成功加载、切换栏是否渲染，方便第一时间发现 JS 报错。上线稳定后可删除该段 | `true` |

---

## 三、生成示例

调用（伪代码）：

```
generate_translatejs_code({
  tech_stack: "plain_html",
  local_language: "chinese_simplified",
  target_languages: ["english", "japanese"],
  custom_terms: "网市场云建站系统=wangmarket CMS\n国际化=GuoJiHua"
})
```

会生成类似：

```html
<!-- 默认 latest：始终从官方 master 分支拉取最新版，不会因本连接器长期不更新而变旧 -->
<script src="https://cdn.jsdelivr.net/gh/xnx3/translate@master/translate.js/translate.js"></script>
<script>
  translate.language.setLocal('chinese_simplified'); // 当前网页本地语种（原文语种）
  translate.service.use('client.edge'); // 微软 Edge 免费翻译通道（推荐，约73种语言）
  translate.selectLanguageTag.languages = 'chinese_simplified,english,japanese'; // 切换栏可选项（含本地语种）
  translate.selectLanguageTag.show = true;
  translate.nomenclature.append('chinese_simplified', 'english', [
    '网市场云建站系统=wangmarket CMS',
    '国际化=GuoJiHua'
  ].join('\n')); // 自定义术语（仅词/短语，不对整句）
  translate.listener.start(); // 监控动态渲染内容（Vue/React/ajax）
  translate.execute(); // 所有配置必须写在这一行之前
</script>
```

把这段代码放到页面 `</body>` 之前即可。

---

## 四、分发说明（给你自己）

- 这个连接器是**通用接入助手**，不绑定任何账号，可直接发给你的客户 / 用户安装。
- 如果你希望连接器还能**调用 translate.service 的后端翻译 API**（用于用户系统里直接做文本翻译、
  需要先开通并配置 API Key），可以在此基础上扩展一个 `translate_text` 工具，封装
  `https://api.zvo.cn/translate/service/.../translate.json` 接口。
- 版本升级：translate.js 的 CDN 版本号会更新，留意 https://translate.zvo.cn/ 首页示例里的版本。

---

## 五、本地自测

```bash
# 列出工具
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node index.js

# 生成接入代码
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"generate_translatejs_code","arguments":{"target_languages":["english","japanese"]}}}' | node index.js
```

---

## 六、接入后必做：测试与控制台检查

> **不能只改代码就完事。** 生成并注入接入代码后，必须验证它在真实浏览器里确实跑通、且**没有 JS 报错**。这是本连接器的一等公民能力，不是可选项。

### 方式一：生成的代码自带「自检」横幅（零依赖，人人可用）
`generate_translatejs_code` 默认 `self_test=true`，会在接入代码末尾追加一段脚本：页面加载后于浏览器控制台（F12 → Console）打印
- 绿色：`[translate.js] 自检通过：已加载，语言切换栏已渲染 ✅`
- 红色：`[translate.js] 自检失败：未加载或切换栏未渲染 ❌（请检查脚本路径 / 网络 / 控制台报错）`

打开 F12 看一眼即可确认是否成功；上线稳定运行后可整段删除。

### 方式二：verify_integration 工具做真实浏览器验证（推荐）
调用 `verify_integration`，传入接入后的 HTML 文件路径：

```
verify_integration({
  html_path: "C:/site/index.html",      // 接入后的 HTML 绝对路径
  serve_dir: "C:/site",                 // 可选：页面依赖相对路径静态资源(如 /assets/js/translate.js)时填根目录
  target_language: "english"            // 可选：指定切换到的语种 id，顺便验证切换是否报错
})
```

工具会用 Playwright 无头浏览器加载页面，输出一份**接入验证报告**，包含：
- `translate` 全局对象是否已加载
- 语言切换栏（`.translateSelectLanguage`）是否渲染、有哪些选项
- 指定语种切换是否成功
- **浏览器控制台报错统计**：`console.error` / `pageerror` 各几条（逐条列出原文），`console.warning` 各几条

若环境未安装 Playwright，工具会退化为静态检查（只确认代码「写了」），并提示安装：
`npm install playwright && npx playwright install chromium`。

> 真实浏览器验证是判断「有没有 JS 报错」的唯一可靠方式；静态检查只能确认代码存在，不能确认跑通。

---

## 七、行为准则（对接入者的建议）

基于 translate.js 官方最佳实践与接入经验，使用本连接器时请遵循以下原则：

> **【核心原则】本连接器不内置任何 translate.js 文件。** 无论在线引入（CDN 默认 `latest`，始终从官方 master 分支拉取最新版）还是本地引入（`download_translatejs` 每次都从官方源实时下载 master 分支最新源码），用户拿到的永远是当时最新的 translate.js，**不会因为本连接器长期不更新而变旧**。请勿把某个旧版本的 translate.js 拷贝进本连接器目录再分发——那才是会变旧的做法。

1. **绝不修改 translate.js 源文件本身**。所有调整都通过官方 API（`translate.*`）在你的业务代码里完成。否则一旦 translate.js 升级，你的改动会被覆盖掉。本连接器生成的所有代码都只调用官方 API。
2. **优先本地引入，而非裸用在线 CDN**。建议把源码下载到自己的服务器静态目录（见 `intro_mode=local`），避免高峰期在线 CDN 加载慢/失败导致翻译异常。
   - Gitee：https://gitee.com/mail_osc/translate/raw/master/translate.js/translate.js
   - GitHub：https://raw.githubusercontent.com/xnx3/translate/refs/heads/master/translate.js/translate.js
   - res.zvo.cn：http://res.zvo.cn/translate/translate.js
3. **接入前先检测是否已接入**（用 `check_integration` 工具）。若用户已接入过，应提醒「您已经接入过 translate.js 了，请问您是想让我帮您做什么呢？」，等用户说明诉求再动手，不要替用户做决定。
4. **改动要从根源下手、尽量改动最少**，避免硬堆造成臃肿；注释要写全面，方便他人阅读。
5. **每次改动细化提交**：每完成一个明确的小改动就提交一次 commit（中文、写详细），并推送，便于追溯。

## 八、微调指令索引

translate.js 有非常丰富的微调指令（完整列表见 https://translate.zvo.cn/zhiling.html）。
本连接器已将其中高频且 API 明确的能力做成生成参数（如切换栏、忽略元素、自定义术语、图片翻译、
手动切换、动态监控等）。其余进阶能力（如 URL 控制语种、iframe 翻译、鼠标划词、遮罩层、SSE 等）
可通过 `list_advanced_tweaks` 工具查看官方文档链接，按需自行调用官方 API 实现。

> 注意：无论是否覆盖，本连接器都不会修改 translate.js 源文件，所有能力均通过官方 API 配置。

## 九、本地引入完整流程（推荐）

「本地引入」比裸用在线 CDN 更稳定（避免高峰期加载慢/失败），也是官方推荐做法。完整三步：

1. **下载源码到自己的服务器**（用 `download_translatejs` 工具，按顺序尝试 gitee → github → res.zvo.cn）：
   - 参数 `target_dir`：你项目里存放 js 静态资源的目录（绝对路径），如下载到 `/var/www/html/assets/js` 或 `C:/site/assets/js`。
   - 下载得到 `translate.js`（**请勿修改该文件本身**，否则后续升级会被覆盖）。
2. **生成接入代码**（用 `generate_translatejs_code`，设 `intro_mode=local`、`local_path` 指向第 1 步放置的路径，如 `/assets/js/translate.js`）。
3. **把生成的 `<script>` 代码放到页面 `</body>` 之前**。

> 若运行环境无外网，`download_translatejs` 会列出三个官方源，你可手动下载后放到 `target_dir`。

---

## 十、作为插件市场发布（让其他 WorkBuddy 用户直接可选）

本目录已按 WorkBuddy 的**插件市场**格式组织好（根目录 `marketplace.json` + `plugins/translate-js/`），
其结构与官方市场里的 `github`、`context7` 等 MCP 连接器一致。其他用户安装市场里的 `translate-js` 插件后，
WorkBuddy 会自动读取 `.mcp.json` 把它注册成一个连接器，用户在连接器列表里**信任/启用**即可使用——也就是你想要的「别人直接选就能用」。

### 目录结构（已是标准市场布局，可直接发布）

```
translate-js-connector/            ← 这就是一个「市场」
├─ marketplace.json                ← 市场清单，列出本市场提供的插件
└─ plugins/
   └─ translate-js/                ← 单个插件
      ├─ .mcp.json                 ← MCP 服务端配置（用 ${CODEBUDDY_PLUGIN_ROOT} 变量指向 index.js）
      ├─ .codebuddy-plugin/
      │  └─ plugin.json            ← 插件元数据（名称/描述/作者/许可证）
      ├─ index.js                  ← 连接器主程序（MCP over stdio）
      ├─ package.json
      ├─ README.md
      └─ demo-site/
```

### 路线 A：提交到官方市场（覆盖最广，需走审核）

官方市场仓库：**https://github.com/masx200/codebuddy-plugins-official**
（README 明确"欢迎提交 PR 贡献新的插件"。合入后所有用户可
`/plugin install translate-js@codebuddy-plugins-official` 一键安装。）

我已经把**可直接提 PR** 的提交包做好了，放在仓库根目录的
`codebuddy-plugins-official-submission/`（与 `translate-js-connector/` 同级）：

```
codebuddy-plugins-official-submission/
├─ external_plugins/translate-js/   # 整个目录复制到官方仓库根
├─ marketplace-entry.json           # 追加到官方仓库 .codebuddy-plugin/marketplace.json 的 plugins 数组
├─ PR_DESCRIPTION.md                # PR 标题与正文，直接复制
└─ SUBMIT.md                        # 分步提交指南
```

提交三步（详见 `codebuddy-plugins-official-submission/SUBMIT.md`）：

1. Fork 官方仓库 → 把 `external_plugins/translate-js/` 复制到 fork 根目录；
2. 在 fork 的 `.codebuddy-plugin/marketplace.json` 的 `plugins` 数组里追加 `marketplace-entry.json` 内容
   （把 `<你的 GitHub 用户名>` 替换为真实用户名，plugin.json 与 entry 两处都要改）；
3. 推送并发起 PR（标题/正文见 `PR_DESCRIPTION.md`），通过基础安全审查即合入。

> 注意：社区贡献统一放在官方仓库的 `external_plugins/` 层（对应 `strict: false`），
> 与官方内置的 `plugins/`（github、context7 等）分层一致。

### 路线 B：自建市场（立即可用，你完全掌控）

1. 把 `translate-js-connector` 整个目录推送到一个公开 Git 仓库（GitHub / Gitee / CNB 均可）。
2. 其他用户在 WorkBuddy 的**连接器市场**里「添加市场源」，指向该仓库（目录型市场）。
3. 他们在市场里找到 `translate-js` 插件 → 安装。WorkBuddy 会自动把 `.mcp.json` 里的
   `translate-js` 连接器注册好，用户只需在连接器列表点击**信任/启用**，即可在对话中调用。

### 注意事项

- 运行依赖：连接器是纯 Node.js 标准库实现、零 npm 依赖，`.mcp.json` 里用 `command: "node"`，
  **要求用户机器上 `node` 在 PATH 中**（Node.js ≥ 18）。与官方 `context7`/`serena` 等插件的约定一致。
- 路径变量：`${CODEBUDDY_PLUGIN_ROOT}` 是 WorkBuddy 在插件安装时注入的插件根目录绝对路径，
  因此发布版无需写死任何机器路径，换机器也能用。
- 本地开发时可直接在 `~/.workbuddy/mcp.json` 里指向 `plugins/translate-js/index.js`
  （本机已按此方式配置好，重启 WorkBuddy 后即可使用）。

