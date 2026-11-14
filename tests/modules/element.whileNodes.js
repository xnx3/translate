// 每种节点形态和 title 状态独立登记；生成函数自包含，使用真实扫描和入队方法。
const htmlTitleCases = ['父节点', '叶子节点'].flatMap(function (shape) {
  return [
    { remark: '非空 title 保留原文和 Attr 目标', value: ' 标题文字 ', collected: true },
    { remark: '没有 title Attr 时不新增标题任务', value: null, collected: false },
    { remark: '空 title Attr 不新增标题任务', value: '', collected: false },
    { remark: '空白 title Attr 不新增标题任务', value: ' \t\n ', collected: false }
  ].map(function (item) {
    return { remark: 'HTML ' + shape + ' 的' + item.remark, test: new Function(`
      translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
      var root = document.createElement('div');
      if (${JSON.stringify(item.value)} !== null) root.setAttribute('title', ${JSON.stringify(item.value)});
      ${shape === '父节点' ? "root.textContent = '正文文字';" : ''}
      document.body.append(root);
      var title = root.getAttributeNode('title'), text = root.firstChild;
      translate.element.whileNodes('batch', root);
      var record = translate.node.get(title);
      var entries = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {});
      var targets = entries.flatMap(function (entry) { return entry.nodes; });
      var titleTargets = targets.filter(function (item) { return item.node === title; });
      var titleValid = ${JSON.stringify(item.collected)} ? record && record.originalText === ${JSON.stringify(item.value)} &&
        titleTargets.length === 1 && titleTargets[0].attribute === '' && title.nodeValue === ${JSON.stringify(item.value)} :
        record == null && titleTargets.length === 0;
      return titleValid === true && root.getAttributeNode('title') === title && translate.node.get(root) == null &&
        ${shape === '父节点' ? "text === root.firstChild && translate.node.get(text).originalText === '正文文字' && targets.some(function (item) { return item.node === text && item.attribute === ''; })" : "root.firstChild === null && targets.length === " + (item.collected ? '1' : '0')};
    `) };
  });
});

// 本轮顶部扫描也不再依赖 .title，抛错 getter 必须能完整通过 execute 缓存渲染及 reset。
const titleGetterCases = [
  { remark: '返回不同字符串', body: "return '属性外文字';" },
  { remark: '返回空字符串', body: "return '';" },
  { remark: '返回对象', body: "return { text: '属性外文字' };" },
  { remark: '直接抛错', body: "throw new Error('完整执行链不应读取 title getter');" }
].map(function (item) {
  return { remark: 'HTML 父节点 .title getter ' + item.remark + '，真实 Attr 和正文仍完成缓存翻译及还原', test: new Function(`
    translate.selectLanguageTag.show = false;
    translate.language.setLocal('chinese_simplified'); translate.to = 'english';
    translate.storage.set('hash_english_' + translate.util.hash('标题'), 'Title');
    translate.storage.set('hash_english_' + translate.util.hash('你好世界'), 'Hello world');
    var root = document.createElement('div'); root.setAttribute('title', '标题'); root.textContent = '你好世界'; document.body.append(root);
    var title = root.getAttributeNode('title'), text = root.firstChild, reads = 0, networkCalls = 0;
    Object.defineProperty(root, 'title', { get: function () { reads++; ${item.body} } });
    translate.lifecycle.execute.translateNetworkBefore.push(function () { networkCalls++; });
    translate.execute(root);
    var titleRecord = translate.node.get(title), textRecord = translate.node.get(text);
    var rendered = reads === 0 && title.nodeValue === 'Title' && text.nodeValue === 'Hello world' &&
      titleRecord && titleRecord.originalText === '标题' && titleRecord.resultText === 'Title' &&
      textRecord && textRecord.originalText === '你好世界' && textRecord.resultText === 'Hello world' &&
      root.getAttributeNode('title') === title && root.firstChild === text && networkCalls === 0 && translate.state === 0;
    translate.reset({ selectLanguageRefreshRender: false });
    return rendered === true && reads === 0 && title.nodeValue === '标题' && text.nodeValue === '你好世界' &&
      root.getAttributeNode('title') === title && root.firstChild === text && document.body.contains(root) && translate.node.data.size === 0;
  `) };
});

const svgTitleCases = [
  { remark: '父节点带正文时补收真实 title Attr', attribute: true },
  { remark: '只有 .title expando 时跳过标题并继续扫描正文', attribute: false }
].map(function (item) {
  return { remark: 'SVG ' + item.remark, test: new Function(`
    translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
    var root = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ${item.attribute ? "root.setAttribute('title', '图形标题');" : "Object.defineProperty(root, 'title', { value: '属性外文字' });"}
    var child = document.createElementNS('http://www.w3.org/2000/svg', 'text'); child.textContent = '图形正文'; root.append(child); document.body.append(root);
    var title = root.getAttributeNode('title'), text = child.firstChild;
    translate.element.whileNodes('batch', root);
    var record = translate.node.get(title), entries = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {});
    var targets = entries.flatMap(function (entry) { return entry.nodes; });
    var titleValid = ${JSON.stringify(item.attribute)} ? record && record.originalText === '图形标题' &&
      targets.some(function (item) { return item.node === title && item.attribute === ''; }) : record == null && targets.length === 1;
    return titleValid === true && translate.node.get(root) == null && root.getAttributeNode('title') === title &&
      translate.node.get(text).originalText === '图形正文' && targets.some(function (item) { return item.node === text; }) &&
      child.firstChild === text && text.nodeValue === '图形正文';
  `) };
});

const titleIgnoreCases = ['HTML', 'SVG'].map(function (kind) {
  return { remark: kind + ' 父节点的 title 编程忽略规则不影响正文真实入队', test: new Function(`
    translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
    var wrapper = document.createElement('div'); wrapper.className = 'skip-parent-title';
    var root = ${kind === 'HTML' ? "document.createElement('div')" : "document.createElementNS('http://www.w3.org/2000/svg', 'svg')"};
    root.setAttribute('title', '标题文字'); root.textContent = '正文文字'; wrapper.append(root); document.body.append(wrapper);
    var title = root.getAttributeNode('title'), text = root.firstChild, checked = false;
    translate.ignore.class.push('skip-parent-title', function (element, data) {
      if (data.attribute === 'title') { checked = element === root && data.node === title; return true; }
      return false;
    });
    translate.element.whileNodes('batch', root);
    var entries = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {});
    var targets = entries.flatMap(function (entry) { return entry.nodes; });
    return checked && translate.node.get(title) == null && translate.node.get(text).originalText === '正文文字' &&
      targets.length === 1 && targets[0].node === text && targets[0].attribute === '' &&
      root.getAttributeNode('title') === title && title.nodeValue === '标题文字' && root.firstChild === text;
  `) };
});

const iframeTitleCases = ['HTML', 'SVG'].map(function (kind) {
  return { remark: '同源 iframe 的独立 ' + kind + ' 根节点扫描保留跨 realm title Attr 和正文目标', test: new Function(`
    translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
    var frame = document.createElement('iframe'); document.body.append(frame);
    var root = ${kind === 'HTML' ? "frame.contentDocument.createElement('div')" : "frame.contentDocument.createElementNS('http://www.w3.org/2000/svg', 'svg')"};
    // 根节点保留未挂载状态，验证顶部 Attr 收集不依赖 findNode 的父节点检查。
    root.setAttribute('title', '跨窗口标题'); root.textContent = '跨窗口正文';
    var title = root.getAttributeNode('title'), text = root.firstChild;
    translate.element.whileNodes('batch', root);
    var entries = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {});
    var targets = entries.flatMap(function (entry) { return entry.nodes; });
    return root.parentNode === null && !(root instanceof Element) && !(title instanceof Attr) && title instanceof frame.contentWindow.Attr &&
      translate.node.get(title).originalText === '跨窗口标题' && translate.node.get(text).originalText === '跨窗口正文' &&
      targets.length === 2 && targets.some(function (item) { return item.node === title && item.attribute === ''; }) &&
      targets.some(function (item) { return item.node === text && item.attribute === ''; }) &&
      title.ownerElement === root && root.firstChild === text && root.ownerDocument === frame.contentDocument;
  `) };
});

const titleRenderResetCases = ['HTML', 'SVG'].map(function (kind) {
  return { remark: kind + ' 父节点真实 title 和正文经 execute 缓存渲染再 reset，保留 Attr 及 Text 身份', test: new Function(`
    translate.selectLanguageTag.show = false;
    translate.language.setLocal('chinese_simplified'); translate.to = 'english';
    translate.storage.set('hash_english_' + translate.util.hash('标题'), 'Title');
    translate.storage.set('hash_english_' + translate.util.hash('你好世界'), 'Hello world');
    var root = ${kind === 'HTML' ? "document.createElement('div')" : "document.createElementNS('http://www.w3.org/2000/svg', 'svg')"};
    root.setAttribute('title', '标题'); root.textContent = '你好世界'; document.body.append(root);
    var title = root.getAttributeNode('title'), text = root.firstChild, networkCalls = 0;
    translate.lifecycle.execute.translateNetworkBefore.push(function () { networkCalls++; });
    translate.execute(root);
    var titleRecord = translate.node.get(title), textRecord = translate.node.get(text);
    var rendered = title.nodeValue === 'Title' && text.nodeValue === 'Hello world' &&
      titleRecord && titleRecord.originalText === '标题' && titleRecord.resultText === 'Title' &&
      textRecord && textRecord.originalText === '你好世界' && textRecord.resultText === 'Hello world' &&
      root.getAttributeNode('title') === title && root.firstChild === text && translate.node.get(root) == null &&
      networkCalls === 0 && translate.state === 0;
    translate.reset({ selectLanguageRefreshRender: false });
    return rendered === true && title.nodeValue === '标题' && text.nodeValue === '你好世界' &&
      root.getAttributeNode('title') === title && root.firstChild === text && document.body.contains(root) &&
      translate.node.data.size === 0 && translate.state === 0;
  `) };
});

require('../helpers/module')(__filename, [
  { remark: '递归遍历真实嵌套节点，按 DOM 顺序收集叶子文本并创建带过期时间的队列', test: function () {
    var root = document.createElement('div'); root.innerHTML = '甲<span>乙<b>丙</b></span>丁'; document.body.append(root);
    var calls = []; Date.now = function () { return 10000; };
    translate.addNodeToQueue = function (uuid, node, text) { calls.push([uuid, text]); };
    translate.element.whileNodes('unit', root);
    return JSON.stringify(calls) === '[["unit","甲"],["unit","乙"],["unit","丙"],["unit","丁"]]' && translate.nodeQueue.unit.expireTime === 130000 && typeof translate.nodeQueue.unit.list === 'object';
  } },
  { remark: '空节点不创建任务，已存在队列不重置有效期和其他状态', test: function () {
    translate.element.whileNodes('missing', null); translate.element.whileNodes('missing', undefined);
    var root = document.createElement('div'), queue = { expireTime: 123, list: {}, custom: 'keep' }; translate.nodeQueue.unit = queue;
    translate.element.whileNodes('unit', root);
    return typeof translate.nodeQueue.missing === 'undefined' && translate.nodeQueue.unit === queue && queue.expireTime === 123 && queue.custom === 'keep';
  } },
  { remark: '容器 title 单独入队，忽略 title 的规则不影响正文扫描', test: function () {
    var root = document.createElement('div'); root.title = '标题'; root.textContent = '正文'; document.body.append(root); var calls = [];
    translate.addNodeToQueue = function (uuid, node, text) { calls.push(text); };
    translate.ignore.isIgnore = function (node, info) { return info && info.attribute === 'title'; };
    translate.element.whileNodes('unit', root);
    return JSON.stringify(calls) === '["正文"]';
  } },
  { remark: '自定义 input value 使用实时值且绑定元素本身，不使用过期的 HTML Attr', test: function () {
    var root = document.createElement('div'), input = document.createElement('input'); input.setAttribute('value', '旧值'); input.value = '当前值'; root.append(input); document.body.append(root);
    translate.element.tagAttribute.input = { attribute: ['value'], condition: function () { return true; } }; var calls = [];
    translate.addNodeToQueue = function () { calls.push(Array.from(arguments)); };
    translate.element.whileNodes('unit', root);
    return calls.length === 1 && calls[0][1] === input && calls[0][2] === '当前值' && calls[0][3] === 'value';
  } },
  { remark: '自定义属性 condition 不通过或属性不存在时不加入队列', test: function () {
    var root = document.createElement('div'), a = document.createElement('span'), b = document.createElement('span'); a.setAttribute('data-label', '不允许'); root.append(a, b); document.body.append(root);
    translate.element.tagAttribute.span = { attribute: ['data-label'], condition: function (node) { return node === b; } }; var calls = 0;
    translate.addNodeToQueue = function () { calls++; };
    translate.element.whileNodes('unit', root);
    return calls === 0;
  } },
  { remark: '首次扫描会把页面现存的带 src iframe 交给原 iframe 执行入口', test: function () {
    var root = document.createElement('div'), iframe = document.createElement('iframe'); iframe.src = 'about:blank'; root.append(iframe); document.body.append(root); var calls = [];
    translate.element.iframe.execute = function (node) { calls.push(node); };
    translate.element.whileNodes('unit', root);
    return calls.length === 1 && calls[0] === iframe;
  } },
  { remark: '叶子输入框通过 nodeAnalyse 收集 placeholder，忽略节点不入队', test: function () {
    var root = document.createElement('div'); root.innerHTML = '<input placeholder="提示"><span class="excluded">忽略</span>'; document.body.append(root); translate.ignore.class.push('excluded'); var texts = [];
    translate.addNodeToQueue = function (uuid, node, text) { texts.push(text); };
    translate.element.whileNodes('unit', root);
    return JSON.stringify(texts) === '["提示"]';
  } },
  ...htmlTitleCases,
  ...titleGetterCases,
  ...svgTitleCases,
  ...titleIgnoreCases,
  ...iframeTitleCases,
  ...titleRenderResetCases
]);
