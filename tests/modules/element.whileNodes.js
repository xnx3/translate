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
  } }
]);
