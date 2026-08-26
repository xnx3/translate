#!/usr/bin/env node
'use strict';

// 内置模块：download_translatejs 工具需要按顺序从官方源下载 translate.js 源码到用户的项目静态目录
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

/*
 * translatejsconnector
 * ----------------------------------------------------------------------------
 * 一个零依赖的 WorkBuddy / MCP 连接器，用于把 zvo.cn 的 translate.js 多语言
 * 切换插件快速接入到用户自己的网站或系统中。
 *
 * 它不调用任何远程接口，所有"接入代码"都是根据用户的参数在本地拼装生成的，
 * 因此可以离线运行、无需 API Key、可直接分发给最终用户安装使用。
 *
 * 使用方式（在 WorkBuddy 的 ~/.workbuddy/mcp.json 中追加）：
 *   {
 *     "mcpServers": {
 *       "translatejs": {
 *         "command": "node",
 *         "args": ["/绝对路径/translatejsconnector/index.js"]
 *       }
 *     }
 *   }
 *
 * 官方文档：https://translate.zvo.cn/  微调指令：https://translate.zvo.cn/zhiling.html
 * ----------------------------------------------------------------------------
 */

// ---------------------------------------------------------------------------
// 内置常用语种表（id -> 中文名）。
// 说明：client.edge 免费通道约支持 73 种；默认开源通道支持 133 种；niutrans 支持 385 种。
// 以下为最常用的、在各通道普遍受支持的一部分。
// ---------------------------------------------------------------------------
const LANGUAGES = {
  chinese_simplified: '简体中文',
  chinese_traditional: '繁体中文',
  english: '英语',
  japanese: '日语',
  korean: '韩语',
  french: '法语',
  deutsch: '德语',
  spanish: '西班牙语',
  portuguese: '葡萄牙语',
  russian: '俄语',
  italian: '意大利语',
  arabic: '阿拉伯语',
  thai: '泰语',
  vietnamese: '越南语',
  indonesian: '印尼语',
  malay: '马来语',
  turkish: '土耳其语',
  dutch: '荷兰语',
  polish: '波兰语',
  ukrainian: '乌克兰语',
  greek: '希腊语',
  hebrew: '希伯来语',
  hindi: '印地语',
  bengali: '孟加拉语',
  persian: '波斯语',
  filipino: '菲律宾语',
  romanian: '罗马尼亚语',
  czech: '捷克语',
  swedish: '瑞典语',
  norwegian: '挪威语',
  danish: '丹麦语',
  finnish: '芬兰语',
  hungarian: '匈牙利语',
  bulgarian: '保加利亚语',
  croatian: '克罗地亚语',
  serbian: '塞尔维亚语',
  slovak: '斯洛伐克语',
  slovene: '斯洛文尼亚语',
  lithuanian: '立陶宛语',
  latvian: '拉脱维亚语',
  estonian: '爱沙尼亚语',
  catalan: '加泰罗尼亚语',
  khmer: '高棉语',
  lao: '老挝语',
  burmese: '缅甸语',
  tamil: '泰米尔语',
  telugu: '泰卢固语',
  urdu: '乌尔都语',
  swahili: '斯瓦希里语',
  amharic: '阿姆哈拉语',
  azerbaijani: '阿塞拜疆语',
  kazakh: '哈萨克语',
  georgian: '格鲁吉亚语',
  icelandic: '冰岛语',
  irish: '爱尔兰语',
  welsh: '威尔士语',
  maltese: '马耳他语',
  esperanto: '世界语',
  cantonese: '粤语',
  mongolian: '蒙古语'
};

// ---------------------------------------------------------------------------
// 微调指令索引：完整收录 translate.js 官方微调文档（来自用户提供的清单）。
// 用于 list_advanced_tweaks 工具，逐项标注哪些已被本连接器覆盖、哪些需看文档。
// 说明：本连接器只通过官方 API 配置，绝不修改 translate.js 源文件本身。
// ---------------------------------------------------------------------------
const TWEAKS = [
  ['切换语言select选择框的自定义设置', 'https://translate.zvo.cn/4056.html', '部分覆盖：documentId/languages/show/selector_css 已支持；customUI 整体重写请看文档'],
  ['只翻译指定的元素', 'https://translate.zvo.cn/4063.html', '未覆盖（见文档）'],
  ['主动进行语言切换', 'https://translate.zvo.cn/4064.html', '已覆盖：manual_switch 生成按钮，或调用 translate.changeLanguage()'],
  ['设置本地语种（当前网页的语种）', 'https://translate.zvo.cn/4066.html', '已覆盖：local_language'],
  ['手动调用接口进行翻译操作', 'https://translate.zvo.cn/4077.html', '说明：translate.execute() / changeLanguage()'],
  ['对网页中图片进行翻译', 'https://translate.zvo.cn/4055.html', '已覆盖：image_translations'],
  ['设置默认翻译为的语种', 'https://translate.zvo.cn/4071.html', '已覆盖：default_language'],
  ['自定义翻译术语', 'https://translate.zvo.cn/4070.html', '已覆盖：custom_terms'],
  ['翻译完后自动触发执行', 'https://translate.zvo.cn/4069.html', '已覆盖：translate.execute()'],
  ['指定翻译服务接口域名', 'https://translate.zvo.cn/4068.html', '未覆盖（见文档）'],
  ['监控页面动态渲染的文本进行自动翻译', 'https://translate.zvo.cn/4067.html', '已覆盖：listen_dynamic'],
  ['自动切换为用户所使用的语种', 'https://translate.zvo.cn/4065.html', '已覆盖：auto_discriminate'],
  ['翻译时忽略指定的文字不翻译', 'https://translate.zvo.cn/283381.html', '未覆盖（见文档）'],
  ['翻译时忽略指定的id', 'https://translate.zvo.cn/4062.html', '已覆盖：ignore_ids'],
  ['翻译时忽略指定的class属性', 'https://translate.zvo.cn/4061.html', '已覆盖：ignore_classes'],
  ['翻译时忽略指定的tag标签', 'https://translate.zvo.cn/4060.html', '已覆盖：ignore_tags'],
  ['设置只对指定语种进行翻译', 'https://translate.zvo.cn/4085.html', '未覆盖（见文档）'],
  ['识别字符串语种及分析', 'https://translate.zvo.cn/4083.html', '未覆盖（见文档）'],
  ['重写一级缓存·浏览器缓存', 'https://translate.zvo.cn/4082.html', '未覆盖（见文档）'],
  ['设置使用的翻译服务 translate.service.use', 'https://translate.zvo.cn/4081.html', '已覆盖：service_channel'],
  ['清除历史翻译语种的缓存', 'https://translate.zvo.cn/4080.html', '未覆盖（见文档）'],
  ['翻译接口响应捕获处理', 'https://translate.zvo.cn/4079.html', '未覆盖（见文档）'],
  ['元素的内容整体翻译能力配置', 'https://translate.zvo.cn/4078.html', '未覆盖（见文档）'],
  ['离线翻译及自动生成配置', 'https://translate.zvo.cn/4076.html', '未覆盖（见文档）'],
  ['根据URL传参控制以何种语种显示', 'https://translate.zvo.cn/4075.html', '未覆盖（见文档）'],
  ['获取当前显示的是什么语种', 'https://translate.zvo.cn/4074.html', '说明：translate.language.getLanguage()'],
  ['获取本地语种', 'https://translate.zvo.cn/4073.html', '说明：translate.language.getLocal()'],
  ['鼠标划词翻译', 'https://translate.zvo.cn/4072.html', '未覆盖（见文档）'],
  ['翻译后再手动对某些元素节点翻译', 'https://translate.zvo.cn/4088.html', '未覆盖（见文档）'],
  ['网页ajax请求触发自动翻译', 'https://translate.zvo.cn/4086.html', '已覆盖：listen_dynamic 已含 request.listener'],
  ['增加对指定标签的属性进行翻译', 'https://translate.zvo.cn/231504.html', '未覆盖（见文档）'],
  ['本地语种也进行强制翻译', 'https://translate.zvo.cn/289574.html', '未覆盖（见文档）'],
  ['自定义通过翻译API进行时的监听事件', 'https://translate.zvo.cn/379207.html', '未覆盖（见文档）'],
  ['对某个句子中的某个单词进行翻译替换-文本处理', 'https://translate.zvo.cn/396191.html', '未覆盖（见文档）'],
  ['启用翻译中的遮罩层', 'https://translate.zvo.cn/407105.html', '未覆盖（见文档）'],
  ['对JS对象及代码进行翻译', 'https://translate.zvo.cn/452991.html', '未覆盖（见文档）'],
  ['网络请求自定义附加参数', 'https://translate.zvo.cn/471711.html', '未覆盖（见文档）'],
  ['网络请求数据拦截并翻译', 'https://translate.zvo.cn/479724.html', '未覆盖（见文档）'],
  ['翻译排队执行', 'https://translate.zvo.cn/479742.html', '未覆盖（见文档）'],
  ['获取翻译区域显示的原始文本', 'https://translate.zvo.cn/513197.html', '未覆盖（见文档）'],
  ['重写语种识别策略', 'https://translate.zvo.cn/513538.html', '未覆盖（见文档）'],
  ['默认网络请求的自定义控制', 'https://translate.zvo.cn/521713.html', '未覆盖（见文档）'],
  ['进行翻译的生命周期监控及触发', 'https://translate.zvo.cn/540189.html', '未覆盖（见文档）'],
  ['网页打开时自动隐藏文字，翻译完成后显示译文', 'https://translate.zvo.cn/549731.html', '说明：已在接入注意事项中提示'],
  ['将翻译后的页面进行还原回翻译前的', 'https://translate.zvo.cn/549732.html', '未覆盖（见文档）'],
  ['启用翻译性能监控', 'https://translate.zvo.cn/549733.html', '未覆盖（见文档）'],
  ['对iframe中的页面自动翻译', 'https://translate.zvo.cn/549764.html', '未覆盖（见文档）'],
  ['私有部署翻译服务后调试自检', 'https://translate.zvo.cn/549786.html', '说明：私有部署场景参考'],
  ['当前是否已进行了翻译处理', 'https://translate.zvo.cn/549790.html', '说明：translate.language.getLanguage()!=null 可判断'],
  ['对翻译服务接口启用 SSE 能力', 'https://translate.zvo.cn/549861.html', '未覆盖（见文档）']
];

// ---------------------------------------------------------------------------
// 工具定义（MCP tools/list 返回的内容）
// ---------------------------------------------------------------------------
const TOOLS = [
  {
    name: 'generate_translatejs_code',
    description:
      '根据用户的网站技术栈与多语言需求，生成可直接使用的 translate.js 接入代码。' +
      '代码包含：引入方式（在线 CDN 或下载到自有服务器）、翻译通道设置、本地语种、目标语种（切换栏选项）、' +
      '是否显示切换栏、切换栏容器与美化样式、忽略指定元素、自定义术语、图片翻译、手动切换按钮、' +
      '动态内容监听等微调配置。所有配置都会正确排在 translate.execute() 之前。' +
      '注意：本工具绝不修改 translate.js 源文件本身，全部仅通过官方 API 进行配置，以保证后续可正常升级。',
    inputSchema: {
      type: 'object',
      properties: {
        tech_stack: {
          type: 'string',
          description: '网站技术栈，用于生成对应的放置位置说明。',
          enum: ['plain_html', 'vue3', 'react', 'uniapp', 'nuxt', 'nextjs', 'other'],
          default: 'plain_html'
        },
        local_language: {
          type: 'string',
          description: "当前网页的本地语种（原文语种）id，如 chinese_simplified、english。默认 chinese_simplified。",
          default: 'chinese_simplified'
        },
        target_languages: {
          type: 'array',
          items: { type: 'string' },
          description: "希望支持切换到的目标语种 id 列表，如 ['english','japanese']。默认 ['english']。",
          default: ['english']
        },
        show_selector: {
          type: 'boolean',
          description: '是否在页面显示语言切换下拉框。false 时可用自定义按钮调用 translate.changeLanguage() 切换。默认 true。',
          default: true
        },
        selector_container_id: {
          type: 'string',
          description: "可选。指定语言切换栏渲染到的容器 id（页面需有 <div id=\"xxx\"></div>）。不填则自动创建。",
          default: ''
        },
        default_language: {
          type: 'string',
          description: '可选。首次访问时默认显示的语种 id（在用户手动选择前）。不填则用本地语种。',
          default: ''
        },
        auto_discriminate: {
          type: 'boolean',
          description: '是否自动按访问者浏览器语言切换。默认 false。',
          default: false
        },
        listen_dynamic: {
          type: 'boolean',
          description: '是否监控动态渲染内容（Vue/React/ajax 产生的文本也会翻译）。默认 true。',
          default: true
        },
        ignore_classes: {
          type: 'array',
          items: { type: 'string' },
          description: "不翻译的 CSS class 列表，如 ['price','brand']。",
          default: []
        },
        ignore_ids: {
          type: 'array',
          items: { type: 'string' },
          description: '不翻译的元素 id 列表。',
          default: []
        },
        ignore_tags: {
          type: 'array',
          items: { type: 'string' },
          description: "不翻译的 HTML 标签列表，如 ['code','script']。",
          default: []
        },
        custom_terms: {
          type: 'string',
          description: "自定义术语，每行一条，格式为 原文=译文。例如：\n网市场云建站系统=wangmarket CMS\n国际化=GuoJiHua",
          default: ''
        },
        service_channel: {
          type: 'string',
          description: "翻译服务通道。client_edge=微软免费通道(推荐,约73种)；translate_service=官方通道(免费版有每日字符上限)；giteeAI=大模型通道(需开通并配置 API Key)。注意：传给本参数的值与生成的代码字符串一致（如 giteeAI 大写）。",
          enum: ['client_edge', 'translate_service', 'giteeAI'],
          default: 'client_edge'
        },
        cdn_version: {
          type: 'string',
          description: "translate.js 的 CDN 版本。默认 'latest'（即始终从官方 master 分支拉取最新版，不会因为本连接器长期不更新而变旧）；" +
            "若出于可复现/锁定需求想固定某个版本，可填具体版本号（如 3.18.66），此时改用 staticfile 固定版本 CDN。仅当 intro_mode=cdn 时生效。",
          default: 'latest'
        },
        intro_mode: {
          type: 'string',
          description: "translate.js 的引入方式。cdn=在线引入（默认，简单但有高峰期加载慢风险）；local=下载源码到自有服务器静态目录后本地引入（推荐，稳定可控，且便于后续升级）。",
          enum: ['cdn', 'local'],
          default: 'cdn'
        },
        local_path: {
          type: 'string',
          description: "intro_mode=local 时，translate.js 在你服务器上的访问路径，如 /translate/translate.js。默认 /translate/translate.js。需先把源码下载到该路径（下载地址会在生成结果中给出）。",
          default: '/translate/translate.js'
        },
        selector_css: {
          type: 'string',
          description: "可选。自定义切换语言选择框的 CSS 美化代码（不含 <style> 标签），用于控制 .translateSelectLanguage 的位置/样式。例如 'position:fixed;top:20px;right:20px;'。不填则不输出美化样式。",
          default: ''
        },
        image_translations: {
          type: 'string',
          description: "可选。图片翻译映射，每行一条，格式为 原图URL=目标图URL。目标图URL 中可用 {language} 占位符表示当前语种（如 https://x.com/logo_{language}.jpg）。例：\n/uploads/logo.jpg=https://x.com/logo_{language}.jpg",
          default: ''
        },
        manual_switch: {
          type: 'boolean',
          description: '是否额外生成一组手动语言切换按钮（<a href="javascript:translate.changeLanguage(\'english\')">英语</a> 形式）。适合不想显示默认下拉框、想用自己的按钮触发切换的场景。默认 false。',
          default: false
        },
        self_test: {
          type: 'boolean',
          description: '是否在生成的接入代码末尾追加一段“自检”脚本：页面加载后于浏览器控制台打印 [translate.js] 自检通过/失败 横幅（绿色/红色），方便你打开 F12 直接确认是否加载成功、是否有报错。上线稳定运行后可删除该段。默认 true。',
          default: true
        }
      }
    }
  },
  {
    name: 'list_languages',
    description:
      '返回 translate.js 内置常用语种 id 与中文名对照表，供生成代码时选择 target_languages / local_language。' +
      '并说明不同翻译通道支持的语种数量差异。',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'get_setup_guide',
    description: '根据技术栈返回 translate.js 的接入步骤与常见注意事项（放在哪里、框架里怎么写、常见坑）。',
    inputSchema: {
      type: 'object',
      properties: {
        tech_stack: {
          type: 'string',
          description: '网站技术栈。',
          enum: ['plain_html', 'vue3', 'react', 'uniapp', 'nuxt', 'nextjs', 'other'],
          default: 'plain_html'
        }
      }
    }
  },
  {
    name: 'check_integration',
    description:
      '在帮用户接入或调整 translate.js 之前，先检测用户当前项目是否已经接入过 translate.js。' +
      '返回检测方法（搜索哪些特征即可判定）以及一条提醒文案：若已接入应询问用户具体诉求，而非替用户做决定。' +
      '同时也强调：无论是否接入，都不要修改 translate.js 源文件本身。',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'list_advanced_tweaks',
    description:
      '返回 translate.js 的全部微调指令索引（来自官方微调文档，共 ' + TWEAKS.length + ' 项）。' +
      '每项标注「已覆盖 / 部分覆盖 / 说明 / 未覆盖」以及官方文档链接，便于按需查阅进阶能力（如图片翻译、iframe、划词、URL 控制语种等）。',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'download_translatejs',
    description:
      '按顺序从官方源下载最新版 translate.js 源码到用户项目的静态资源目录（gitee → github → res.zvo.cn，任一成功即停止）。' +
      '这是「本地引入」模式的前提：先把源码落到自己的服务器，接入代码才能稳定加载并正常升级。' +
      'target_dir 必填，填你项目里存放 js 静态资源的目录（绝对路径）。',
    inputSchema: {
      type: 'object',
      properties: {
        target_dir: {
          type: 'string',
          description: '用户项目里存放 JavaScript 静态资源的目录（绝对路径），如 /var/www/html/assets/js 或 C:/site/assets/js。下载的文件会放在这个目录下。'
        },
        filename: {
          type: 'string',
          description: '保存的文件名，默认 translate.js。',
          default: 'translate.js'
        }
      },
      required: ['target_dir']
    }
  },
  {
    name: 'verify_integration',
    description:
      '接入代码后必做的验证：用真实无头浏览器（Playwright）加载页面，确认 translate.js 已加载、语言切换栏已渲染，' +
      '并捕获浏览器控制台的 console.error / pageerror，报告是否存在 translate.js 相关的 JS 报错（这正是“不能只改代码就完事”的关键一环）。' +
      '若环境未安装 Playwright，则退化为静态检查并给出安装指引。' +
      'html_path 必填（要验证的 HTML 文件绝对路径）；serve_dir 可选（页面依赖相对路径静态资源时填根目录）；target_language 可选（指定要切换到的语种 id 以验证切换是否报错）。',
    inputSchema: {
      type: 'object',
      properties: {
        html_path: {
          type: 'string',
          description: '要验证的 HTML 文件绝对路径，例如 C:/site/index.html 或 /var/www/html/index.html。'
        },
        serve_dir: {
          type: 'string',
          description: '可选。页面依赖相对路径静态资源（如 /assets/js/translate.js）时，填这些资源所在的根目录绝对路径，工具会起临时 HTTP 服务正确解析。不填则直接用 file:// 打开。',
          default: ''
        },
        target_language: {
          type: 'string',
          description: '可选。指定要切换到的语种 id（如 english），工具会触发一次切换并检测是否报错。不填则只验证加载与渲染。',
          default: ''
        }
      },
      required: ['html_path']
    }
  }
];

// ---------------------------------------------------------------------------
// 生成逻辑
// ---------------------------------------------------------------------------
const TECH_LABELS = {
  plain_html: '纯 HTML 静态页',
  vue3: 'Vue3',
  react: 'React',
  uniapp: 'UniApp',
  nuxt: 'Nuxt',
  nextjs: 'Next.js',
  other: '其他 / 自定义'
};

function setupGuide(stack) {
  stack = stack || 'plain_html';
  const label = TECH_LABELS[stack] || TECH_LABELS.other;
  const lines = [];
  lines.push('技术栈：' + label);
  lines.push('');
  if (stack === 'plain_html') {
    lines.push('1. 把生成的 <script> 代码块放到页面 </body> 标签之前（页面最底部）。');
    lines.push('2. 刷新页面，右下角/指定位置会出现语言切换下拉框。');
  } else if (stack === 'vue3') {
    lines.push('方式 A（推荐）：放到 public/index.html 的 </body> 之前，与纯 HTML 一致。');
    lines.push('方式 B：在 App.vue 的 onMounted 中只执行 JS 配置（先确保已全局引入 translate.js）：');
    lines.push('    onMounted(() => {');
    lines.push("      translate.language.setLocal('chinese_simplified');");
    lines.push("      translate.service.use('client.edge');");
    lines.push('      translate.listener.start();');
    lines.push('      translate.execute();');
    lines.push('    });');
    lines.push('3. 若用 Vite，可在 index.html 中用 <script> 引入 CDN，避免打包问题。');
    lines.push('参考：https://gitee.com/mail_osc/translate/tree/master/extend/vue/vue3');
  } else if (stack === 'react') {
    lines.push('方式 A（推荐）：放到 public/index.html 的 </body> 之前。');
    lines.push('方式 B：在 App 的 useEffect 中只执行 JS 配置（先确保已全局引入 translate.js）：');
    lines.push('    useEffect(() => {');
    lines.push("      translate.language.setLocal('chinese_simplified');");
    lines.push("      translate.service.use('client.edge');");
    lines.push('      translate.listener.start();');
    lines.push('      translate.execute();');
    lines.push('    }, []);');
  } else if (stack === 'uniapp') {
    lines.push('UniApp 有官方适配示例，建议直接参考：');
    lines.push('https://gitee.com/mail_osc/translate/tree/master/extend/uniapp');
    lines.push('核心同样是引入 translate.js 后在 onReady/onMounted 中执行配置。');
  } else if (stack === 'nuxt' || stack === 'nextjs') {
    lines.push('SSR 框架注意：translate.js 是纯前端插件，不要在服务端执行。');
    lines.push('放在客户端入口（Nuxt 的 app.vue / Next 的 layout 或 <Script> 组件中，且策略设为客户端）。');
    lines.push('或者在页面的 onMounted / useEffect（仅在浏览器）中执行配置。');
  } else {
    lines.push('把生成的 <script> 代码块放到你的页面模板最底部（</body> 之前）即可。');
  }
  lines.push('');
  lines.push('常见注意事项：');
  lines.push('- 所有 translate.* 配置必须写在 translate.execute() 之前才会生效。');
  lines.push('- 页面打开瞬间会先显示原文、再显示译文；如需消除闪烁，参考 https://translate.zvo.cn/549731.html（网页加载时先隐藏文字）。');
  lines.push('- 隐藏某些内容不翻译：给元素加 class="ignore"，或在配置里用 translate.ignore.*。');
  lines.push('- 正式上线建议更换更快/更稳的翻译通道（giteeAI 大模型私有通道），参考 https://translate.zvo.cn/545867.html。');
  return lines.join('\n');
}

function listLanguages() {
  const lines = [];
  lines.push('translate.js 内置常用语种对照表（id = 中文名）：');
  lines.push('');
  const entries = Object.keys(LANGUAGES);
  entries.forEach(function (id) {
    lines.push('  ' + id + ' = ' + LANGUAGES[id]);
  });
  lines.push('');
  lines.push('通道支持说明：');
  lines.push('- client.edge（微软免费通道，推荐）：约 73 种语言');
  lines.push('- 默认开源 translate.service 通道：133 种语言（免费版有每日字符上限）');
  lines.push('- niutrans 通道：385 种语言');
  lines.push('完整语种表见：https://translate.zvo.cn/support_language.html');
  return lines.join('\n');
}

function generateCode(args) {
  args = args || {};
  const cdn = args.cdn_version || 'latest';
  const local = args.local_language || 'chinese_simplified';
  const targets = Array.isArray(args.target_languages) && args.target_languages.length
    ? args.target_languages
    : ['english'];
  const show = args.show_selector !== false;
  const channel = args.service_channel || 'client_edge';
  const auto = !!args.auto_discriminate;
  const listen = args.listen_dynamic !== false;
  const selId = args.selector_container_id;

  // 切换栏语种列表：本地语种 + 目标语种（去重，本地语种放最前）
  const langSet = [];
  if (langSet.indexOf(local) < 0) langSet.push(local);
  targets.forEach(function (t) {
    if (langSet.indexOf(t) < 0) langSet.push(t);
  });
  const langStr = langSet.join(',');

  const cfg = [];
  cfg.push("translate.language.setLocal('" + local + "'); // 当前网页本地语种（原文语种）");
  if (args.default_language) {
    cfg.push("translate.language.setDefaultTo('" + args.default_language + "'); // 首次访问默认显示语种");
  }
  if (channel === 'client_edge') {
    cfg.push("translate.service.use('client.edge'); // 微软 Edge 免费翻译通道（推荐，约73种语言）");
  } else if (channel === 'translate_service') {
    cfg.push("translate.service.use('translate.service'); // 官方通道（免费版有每日字符上限）");
  } else if (channel === 'giteeAI') {
    cfg.push("// 需先在 translate.zvo.cn 开通 GiteeAI 通道并配置 API Key");
    cfg.push("translate.service.use('giteeAI');");
  }
  cfg.push("translate.selectLanguageTag.languages = '" + langStr + "'; // 切换栏可选项（含本地语种）");
  cfg.push('translate.selectLanguageTag.show = ' + show + ';');
  if (selId) {
    cfg.push("// 将切换栏渲染到页面中的 <div id=\"" + selId + "\"></div>");
    cfg.push("translate.selectLanguageTag.documentId = '" + selId + "';");
  }
  (args.ignore_classes || []).forEach(function (c) {
    cfg.push("translate.ignore.class.push('" + c + "');");
  });
  (args.ignore_ids || []).forEach(function (i) {
    cfg.push("translate.ignore.id.push('" + i + "');");
  });
  (args.ignore_tags || []).forEach(function (t) {
    cfg.push("translate.ignore.tag.push('" + t + "');");
  });
  const terms = String(args.custom_terms || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
  if (terms.length) {
    cfg.push("translate.nomenclature.append('" + local + "', '" + (targets[0] || 'english') + "', [");
    terms.forEach(function (t, i) {
      var comma = (i < terms.length - 1) ? ',' : '';
      cfg.push("  '" + String(t).replace(/'/g, "\\'") + "'" + comma);
    });
    cfg.push("].join('\\n')); // 自定义术语（仅词/短语，不对整句）");
  }
  if (auto) {
    cfg.push('translate.setAutoDiscriminateLocalLanguage(); // 自动按访问者浏览器语言切换');
  }
  if (listen) {
    cfg.push('translate.listener.start(); // 监控 DOM 动态渲染内容（Vue/React 等框架渲染的文本）（4067）');
    cfg.push("translate.request.listener.start(); // 监控 ajax 请求返回的文本并自动翻译（4086）");
  }
  // 图片翻译：切换语种时自动将网页中的图片替换为对应语种版本的图片
  const imgLines = String(args.image_translations || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
  if (imgLines.length) {
    const pairs = [];
    imgLines.forEach(function (line) {
      const idx = line.indexOf('=');
      if (idx < 0) return;
      const from = line.slice(0, idx).trim();
      const to = line.slice(idx + 1).trim();
      if (from && to) pairs.push("  '" + from.replace(/'/g, "\\'") + "': '" + to.replace(/'/g, "\\'") + "'");
    });
    if (pairs.length) {
      cfg.push('translate.images.add({');
      cfg.push(pairs.join(',\n'));
      cfg.push('}); // 图片翻译：{language} 占位符表示当前语种，如 logo_{language}.jpg');
    }
  }
  cfg.push('translate.execute(); // 所有配置必须写在这一行之前');

  // 自检脚本：打开浏览器控制台（F12）即可看到 PASS/FAIL 横幅，便于第一时间确认是否加载成功、有无 JS 报错。
  // 原理：window.load 后延迟 800ms 检测 translate 全局是否存在、切换栏是否渲染。上线稳定运行后可整段删除。
  if (args.self_test !== false) {
    cfg.push('');
    cfg.push('// === translate.js 自检（打开浏览器控制台可见；确认无误后此段可删除）===');
    cfg.push('window.addEventListener("load", function () {');
    cfg.push('  setTimeout(function () {');
    cfg.push('    var ok = (typeof translate !== "undefined");');
    cfg.push('    var sel = document.querySelector(".translateSelectLanguage");');
    cfg.push('    if (ok && sel) {');
    cfg.push('      console.log("%c[translate.js] 自检通过：已加载，语言切换栏已渲染 ✅", "color:#2e7d32;font-weight:bold");');
    cfg.push('    } else {');
    cfg.push('      console.error("[translate.js] 自检失败：未加载或切换栏未渲染 ❌（请检查脚本路径 / 网络 / 控制台报错）");');
    cfg.push('    }');
    cfg.push('  }, 800);');
    cfg.push('});');
  }

  const scriptBody = cfg.join('\n');

  // 引入方式：cdn=在线引入（简单但有高峰期加载慢风险）；local=下载到自有服务器后本地引入（推荐）
  const introMode = args.intro_mode === 'local' ? 'local' : 'cdn';
  const localPath = args.local_path || '/translate/translate.js';
  const srcUrl = introMode === 'local'
    ? localPath
    : (cdn === 'latest'
        // 默认 latest：始终从官方 master 分支拉取最新版，连接器本身多久不更新都不会导致 translate.js 变旧
        ? 'https://cdn.jsdelivr.net/gh/xnx3/translate@master/translate.js/translate.js'
        // 显式指定版本号时，改用 staticfile 固定版本 CDN（可复现、锁定版本）
        : 'https://cdn.staticfile.net/translate.js/' + cdn + '/translate.js');
  const html =
    '<script src="' + srcUrl + '"></script>\n' +
    '<script>\n' + scriptBody + '\n</script>';

  const stack = args.tech_stack || 'plain_html';
  const label = TECH_LABELS[stack] || TECH_LABELS.other;

  // 可选：切换栏美化样式（控制 .translateSelectLanguage 的位置/样式）
  let styleBlock = '';
  if (args.selector_css) {
    styleBlock = '<style>.translateSelectLanguage{' + String(args.selector_css).replace(/<\/?style>/g, '') + '}</style>\n';
  }

  // 可选：手动语言切换按钮（适合用自己的按钮触发 translate.changeLanguage）
  let switchBlock = '';
  if (args.manual_switch) {
    const switchLangs = langSet.filter(function (l) { return l !== local; });
    // class="ignore"：避免按钮文字（如“英语”）本身被 translate.js 翻译（参见官方文档 4064）
    switchBlock = '\n' + switchLangs.map(function (l) {
      return '<a href="javascript:translate.changeLanguage(\'' + l + '\');" class="ignore">' + (LANGUAGES[l] || l) + '</a>';
    }).join(' ');
  }

  let out = '';
  out += '【translate.js 接入代码】\n';
  if (introMode === 'local') {
    out += '（本地引入模式）请先将 translate.js 源码下载到你的服务器静态目录 ' + localPath + ' ：\n';
    out += '  Gitee : https://gitee.com/mail_osc/translate/raw/master/translate.js/translate.js\n';
    out += '  GitHub: https://raw.githubusercontent.com/xnx3/translate/refs/heads/master/translate.js/translate.js\n';
    out += '  res.zvo.cn: http://res.zvo.cn/translate/translate.js\n';
    out += '（下载到本地可避免在线 CDN 高峰期加载慢/失败，并保证后续可正常升级。请勿修改该源码文件本身。）\n';
    out += '（也可直接调用本连接器的 download_translatejs 工具，传入你的静态资源目录绝对路径，自动按顺序从官方源下载最新版。）\n';
    out += '（本地引入后若想升级版本，重新运行 download_translatejs 覆盖即可，连接器本身长期不更新也不会让 translate.js 变旧。）\n\n';
    out += '然后将下方代码复制到你的网站页面 </body> 之前：\n\n';
  } else {
    out += '将下方代码复制到你的网站页面 </body> 之前（页面最底部）：\n\n';
  }
  out += styleBlock + html + switchBlock + '\n\n';
  out += '（以上代码适用于任何支持 DOM 与 JavaScript 的网页，与技术栈无关；下方仅针对「' + label + '」给出放置位置建议。）\n\n';
  out += '【' + label + ' 使用说明】\n';
  out += setupGuide(stack) + '\n';

  const unknown = langSet.filter(function (l) { return !LANGUAGES[l]; });
  if (unknown.length) {
    out += '\n提示：以下语种 id 不在内置常用列表中（' + unknown.join(', ') +
      '），请确认拼写正确（完整列表见 https://translate.zvo.cn/support_language.html）。\n';
  }
  out += '\n官方微调指令文档：https://translate.zvo.cn/zhiling.html';
  return out;
}

// ---------------------------------------------------------------------------
// 接入前检测：当前项目是否已经接入过 translate.js
// ---------------------------------------------------------------------------
function checkIntegration() {
  const lines = [];
  lines.push('【检测当前项目是否已接入 translate.js】');
  lines.push('');
  lines.push('在直接帮用户生成/修改接入代码之前，应先确认用户项目里是否已经接入过。');
  lines.push('请在你将要改动的代码目录中，搜索以下任一特征（命中即代表已接入）：');
  lines.push('');
  lines.push('  1) 引入标签：<script ... src=".../translate.js"> 或 src 中含有 translate.js');
  lines.push('  2) 触发代码：translate.execute()');
  lines.push('  3) 配置代码：translate.language.setLocal(  或  translate.service.use(');
  lines.push('  4) 切换栏容器：包含 <div id="translate"></div> 或 id="translate" 的元素');
  lines.push('');
  lines.push('可用的搜索方式（任选其一）：');
  lines.push('  - 编辑器全局搜索关键词：translate.js / translate.execute / setLocal');
  lines.push('  - 命令行：grep -rl "translate.execute" 你的项目目录');
  lines.push('  - 命令行：grep -rl "translate.js" 你的项目目录');
  lines.push('');
  lines.push('⚠️ 若已接入，请勿替用户做决定，应提醒用户：');
  lines.push('  “您已经接入过 translate.js 了，请问您是想让我帮您做什么呢？”');
  lines.push('  然后等用户说明具体诉求（如新增语种、调整切换栏、改忽略规则等）再动手。');
  lines.push('');
  lines.push('⚠️ 无论是否已接入，都请勿修改 translate.js 源文件本身（否则后续无法升级）。');
  lines.push('   所有调整都应通过官方 API（translate.*）在你的业务代码里完成。');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 微调指令索引输出
// ---------------------------------------------------------------------------
function listAdvancedTweaks() {
  const lines = [];
  lines.push('translate.js 微调指令索引（共 ' + TWEAKS.length + ' 项，来自官方微调文档）');
  lines.push('');
  lines.push('标注说明：[已覆盖] 本连接器已通过参数直接生成；[部分覆盖] 基础能力已支持、高级用法请看文档；[说明] 提供官方 API 说明；[未覆盖] 暂未做成参数，请点链接看官方文档按需自行调用官方 API。');
  lines.push('');
  TWEAKS.forEach(function (t, i) {
    lines.push((i + 1) + '. ' + t[0] + '\n   ' + t[2] + '\n   ' + t[1]);
  });
  lines.push('');
  lines.push('原则：无论是否覆盖，本连接器都不会修改 translate.js 源文件，所有能力均通过官方 API 在业务代码里配置，以保证后续可正常升级。');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 按顺序从官方源下载 translate.js 源码到用户项目的静态资源目录
// 三个源严格按用户指定的顺序尝试（gitee → github → res.zvo.cn），任一成功即停止。
// 原则：只下载、绝不修改源码本身；后续升级只需重新下载覆盖。
// ---------------------------------------------------------------------------
const TRANSLATE_JS_SOURCES = [
  'https://gitee.com/mail_osc/translate/raw/master/translate.js/translate.js',
  'https://raw.githubusercontent.com/xnx3/translate/refs/heads/master/translate.js/translate.js',
  'http://res.zvo.cn/translate/translate.js'
];

// 从单个 URL 下载文件到 dest，跟随一次重定向；返回 Promise（成功后 resolve 实际使用的 URL）
function fetchSource(url, dest) {
  return new Promise(function (resolve, reject) {
    const lib = url.indexOf('https:') === 0 ? https : http;
    const req = lib.get(url, function (res) {
      // 跟随重定向（GitHub raw 等偶尔会 301/302）
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchSource(res.headers.location, dest));
      }
      if (res.statusCode !== 200) {
        return reject(new Error('HTTP 状态码 ' + res.statusCode));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      res.on('error', reject);
      // 关键：WriteStream 自身也可能报错（如文件被占用 EPERM），必须捕获并 reject，
      // 否则会成为未处理的 'error' 事件导致整个连接器进程崩溃。
      file.on('error', reject);
      file.on('finish', function () { file.close(function () { resolve(url); }); });
    });
    req.on('error', reject);
    req.setTimeout(15000, function () { req.destroy(new Error('请求超时')); });
  });
}

// 按顺序尝试下载；targetDir 为用户项目里存放 js 静态资源的目录（绝对路径）
async function downloadTranslateJs(targetDir, filename) {
  const name = filename || 'translate.js';
  const dest = path.join(targetDir, name);
  if (!fs.existsSync(targetDir)) {
    return '⚠️ 目标目录不存在：' + targetDir + '\n' +
      '请确认你的项目里存放 JavaScript 静态资源的目录路径（请传绝对路径）。';
  }
  const lines = [];
  for (let i = 0; i < TRANSLATE_JS_SOURCES.length; i++) {
    const url = TRANSLATE_JS_SOURCES[i];
    try {
      await fetchSource(url, dest);
      const stat = fs.statSync(dest);
      lines.push('✅ 已按顺序从官方源下载 translate.js 成功');
      lines.push('   实际来源：' + url);
      lines.push('   保存路径：' + dest);
      lines.push('   文件大小：' + stat.size + ' 字节');
      lines.push('');
      lines.push('⚠️ 请勿修改此文件本身；后续升级只需重新下载覆盖即可。');
      lines.push('下一步：在 generate_translatejs_code 中将 intro_mode 设为 local、');
      lines.push('local_path 指向此文件（如 /translate/translate.js 或你放置的相对路径），');
      lines.push('再把生成的接入代码放到页面 </body> 之前。');
      return lines.join('\n');
    } catch (e) {
      lines.push('· 尝试失败：' + url + ' （' + e.message + '）');
    }
  }
  lines.push('');
  lines.push('❌ 三个官方源都下载失败，请检查网络或手动下载：');
  TRANSLATE_JS_SOURCES.forEach(function (u) { lines.push('   ' + u); });
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// 接入后验证：用真实无头浏览器加载页面，捕获浏览器控制台报错（这是“不能只改代码就完事”的关键一环）。
// 若环境没有 Playwright，则退化为静态检查（仅确认代码“写了”，无法确认“跑通且无报错”）。
// ---------------------------------------------------------------------------

// 静态回退：无 Playwright 时使用，仅做代码层面的存在性检查
function staticVerify(htmlPath) {
  let html;
  try { html = fs.readFileSync(htmlPath, 'utf8'); } catch (e) { return '⚠️ 无法读取文件：' + e.message; }
  const lines = [];
  lines.push('【静态检查（未检测到 Playwright，已退化为代码层面分析）】');
  lines.push('');
  lines.push('1) 是否引入了 translate.js：' + (html.includes('translate.js') ? '是' : '否 ❌ 请先引入'));
  lines.push('2) 是否调用了 translate.execute()：' + (html.includes('translate.execute') ? '是' : '否 ❌ 缺少执行'));
  lines.push('3) 是否设置了本地语种：' + (html.includes('translate.language.setLocal') ? '是' : '否'));
  lines.push('4) 切换栏可选项是否设置：' + (html.includes('selectLanguageTag.languages') ? '是' : '否'));
  lines.push('');
  lines.push('⚠️ 静态检查只能确认代码“写了”，无法确认“在浏览器里真的跑通、无报错”。');
  lines.push('强烈建议安装 Playwright 后再次调用本工具做真实浏览器验证：');
  lines.push('   npm install playwright  &&  npx playwright install chromium');
  lines.push('本工具会自动用无头浏览器加载页面、捕获 console.error / pageerror，');
  lines.push('并报告是否存在 translate.js 相关的 JS 报错——这才是真正有效的测试。');
  return lines.join('\n');
}

// 真实浏览器验证：加载页面 -> 等初始化 -> 检查全局与切换栏 -> （可选）切换语种 -> 收集控制台报错
async function verifyIntegration(args) {
  const htmlPath = args.html_path;
  if (!htmlPath) {
    return '⚠️ 请提供 html_path（要验证的 HTML 文件绝对路径）。\n可选 serve_dir（页面依赖相对路径静态资源时填其根目录绝对路径）；可选 target_language（指定要切换到的语种 id 以验证切换是否报错）。';
  }
  if (!fs.existsSync(htmlPath)) {
    return '⚠️ 文件不存在：' + htmlPath;
  }

  // 尝试加载 Playwright（用户环境不一定装了，捕获异常后走静态回退）
  let chromium = null;
  try {
    const pw = require('playwright');
    chromium = pw.chromium;
  } catch (e) { /* 未安装，下面走静态回退 */ }

  if (!chromium) {
    return staticVerify(htmlPath);
  }

  const targetLang = args.target_language || null;
  const lines = [];
  let browser;
  try {
    browser = await chromium.launch({ args: ['--no-sandbox'] });
  } catch (e) {
    lines.push('⚠️ 无法启动无头浏览器（可能缺少系统依赖）：' + e.message);
    lines.push('已退化为静态检查：\n');
    return lines.join('\n') + staticVerify(htmlPath);
  }

  const page = await browser.newPage();
  const consoleErrors = [];
  const consoleWarnings = [];
  const pageErrors = [];
  page.on('console', function (msg) {
    const t = msg.type();
    if (t === 'error') consoleErrors.push(msg.text());
    else if (t === 'warning') consoleWarnings.push(msg.text());
  });
  page.on('pageerror', function (err) { pageErrors.push(err.message); });

  // 用临时 HTTP 服务（优先，能正确解析相对路径静态资源）或 file://
  let url;
  let server = null;
  if (args.serve_dir) {
    server = http.createServer(function (req, res) {
      let p = decodeURIComponent(String(req.url).split('?')[0]);
      if (p === '/') p = '/' + path.basename(htmlPath);
      const fp = path.join(args.serve_dir, p);
      fs.readFile(fp, function (err, data) {
        if (err) { res.writeHead(404); return res.end('not found'); }
        const ext = path.extname(fp);
        const mime = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : ext === '.html' ? 'text/html' : 'text/plain';
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
      });
    });
    await new Promise(function (r) { server.listen(0, '127.0.0.1', r); });
    const port = server.address().port;
    url = 'http://127.0.0.1:' + port + '/' + path.basename(htmlPath);
  } else {
    url = 'file://' + htmlPath;
  }

  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 }).catch(function () {});
    await page.waitForTimeout(2500); // 等 translate.js 初始化与首次翻译完成
    const state = await page.evaluate(function () {
      return {
        hasGlobal: (typeof translate !== 'undefined'),
        hasSelector: !!document.querySelector('.translateSelectLanguage'),
        selectorOptions: (function () {
          const s = document.querySelector('.translateSelectLanguage');
          return s ? Array.prototype.map.call(s.options, function (o) { return o.value; }) : [];
        })()
      };
    });
    let switchResult = null;
    if (targetLang) {
      switchResult = await page.evaluate(function (lang) {
        try { translate.changeLanguage(lang); return 'ok'; } catch (e) { return 'err:' + e.message; }
      }, targetLang);
      await page.waitForTimeout(2500);
    }
    lines.push('【translate.js 接入验证报告】');
    lines.push('');
    lines.push('页面地址：' + url);
    lines.push('✅ translate 全局对象已加载：' + (state.hasGlobal ? '是' : '否 ❌'));
    lines.push('✅ 语言切换栏已渲染（.translateSelectLanguage）：' +
      (state.hasSelector ? '是（选项：' + state.selectorOptions.join(', ') + '）' : '否 ❌'));
    if (switchResult) {
      lines.push('语言切换到 "' + targetLang + '"：' + (switchResult === 'ok' ? '成功，无异常' : '失败（' + switchResult + '）'));
    }
    lines.push('');
    lines.push('🔍 浏览器控制台错误（console.error / pageerror）：共 ' + (consoleErrors.length + pageErrors.length) + ' 条');
    consoleErrors.forEach(function (e, i) { lines.push('   ' + (i + 1) + ') ' + e); });
    pageErrors.forEach(function (e, i) { lines.push('   [pageerror] ' + (i + 1) + ') ' + e); });
    lines.push('🔍 浏览器控制台警告（console.warning）：共 ' + consoleWarnings.length + ' 条');
    consoleWarnings.forEach(function (e, i) { lines.push('   ' + (i + 1) + ') ' + e); });
    lines.push('');
    const ok = state.hasGlobal && state.hasSelector && (consoleErrors.length + pageErrors.length) === 0;
    lines.push(ok
      ? '✅ 验证通过：接入正常，且浏览器控制台无 translate.js 相关 JS 报错。'
      : '⚠️ 验证未完全通过，请按上面明细排查（常见原因：脚本路径不对 / 网络不通 / 配置写错 / 通道需配 Key）。');
  } catch (e) {
    lines.push('验证过程异常：' + e.message);
  } finally {
    await browser.close();
    if (server) server.close();
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// MCP over stdio（JSON-RPC 2.0，换行分隔）
// ---------------------------------------------------------------------------
function send(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

function handleToolCall(msg) {
  const name = msg.params && msg.params.name;
  const args = (msg.params && msg.params.arguments) || {};
  try {
    let result;
    if (name === 'generate_translatejs_code') {
      result = generateCode(args);
    } else if (name === 'list_languages') {
      result = listLanguages(args);
    } else if (name === 'get_setup_guide') {
      result = setupGuide(args.tech_stack);
    } else if (name === 'check_integration') {
      result = checkIntegration();
    } else if (name === 'list_advanced_tweaks') {
      result = listAdvancedTweaks();
    } else if (name === 'download_translatejs') {
      // 下载是网络 IO，异步完成后回写结果；不阻塞其他消息处理
      downloadTranslateJs(args.target_dir, args.filename).then(function (text) {
        send({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text: text }], isError: false } });
      }).catch(function (e) {
        send({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text: '下载出错：' + e.message }], isError: true } });
      });
      return;
    } else if (name === 'verify_integration') {
      // 验证是浏览器 IO（可能较长），异步完成后回写结果
      verifyIntegration(args).then(function (text) {
        send({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text: text }], isError: false } });
      }).catch(function (e) {
        send({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text: '验证出错：' + e.message }], isError: true } });
      });
      return;
    } else {
      send({
        jsonrpc: '2.0',
        id: msg.id,
        error: { code: -32601, message: '未知工具：' + name }
      });
      return;
    }
    send({
      jsonrpc: '2.0',
      id: msg.id,
      result: { content: [{ type: 'text', text: result }], isError: false }
    });
  } catch (e) {
    send({
      jsonrpc: '2.0',
      id: msg.id,
      result: { content: [{ type: 'text', text: '执行出错：' + e.message }], isError: true }
    });
  }
}

function handleMessage(line) {
  let msg;
  try {
    msg = JSON.parse(line);
  } catch (e) {
    return;
  }
  if (!msg || typeof msg !== 'object') return;

  if (msg.method === 'initialize') {
    send({
      jsonrpc: '2.0',
      id: msg.id,
      result: {
        protocolVersion: (msg.params && msg.params.protocolVersion) || '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'translatejsconnector', version: '1.2.0' }
      }
    });
  } else if (msg.method === 'tools/list') {
    send({ jsonrpc: '2.0', id: msg.id, result: { tools: TOOLS } });
  } else if (msg.method === 'tools/call') {
    handleToolCall(msg);
  } else if (typeof msg.method === 'string' && msg.method.indexOf('notifications/') === 0) {
    // 通知类消息无需回复
  } else if (msg.id !== undefined) {
    send({ jsonrpc: '2.0', id: msg.id, error: { code: -32601, message: 'Method not found: ' + msg.method } });
  }
}

let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (chunk) {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (line) handleMessage(line);
  }
});
process.stdin.on('end', function () {
  if (buffer.trim()) handleMessage(buffer.trim());
});
