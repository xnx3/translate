// 每种不能入队的输入单独报告；表达式写入函数体，避免浏览器侧依赖闭包。
const detachedCases = [
  ['null 节点', 'null'],
  ['undefined 节点', 'undefined'],
  ['没有父节点的文本', "document.createTextNode('独立')"],
  ['失去所有者的属性', "document.createAttribute('title')"]
].map(function (item) {
  return { remark: item[0] + ' 不加入翻译队列', test: new Function(`
    var calls = 0; translate.addNodeToQueue = function () { calls++; };
    translate.element.findNode('unit', ${item[1]});
    return calls === 0;
  `) };
});

require('../helpers/module')(__filename, [
  { remark: '附着的文本节点加入翻译队列，保留 UUID 和节点身份', test: function () {
    var parent = document.createElement('p'); parent.textContent = '正文'; document.body.append(parent); var args;
    translate.addNodeToQueue = function () { args = Array.from(arguments); };
    translate.element.findNode('unit', parent.firstChild);
    return args[0] === 'unit' && args[1] === parent.firstChild && args[2] === '正文' && args[3] === '';
  } },
  ...detachedCases,
  { remark: '元素上的多种可翻译属性分别以实际 Attr 节点入队', test: function () {
    var image = document.createElement('img'), calls = []; image.alt = '说明'; image.title = '标题'; document.body.append(image);
    translate.addNodeToQueue = function (uuid, node, text, attribute) { calls.push({ node: node, text: text, attribute: attribute }); };
    translate.element.findNode('unit', image);
    return calls.length === 2 && calls[0].node === image.getAttributeNode('alt') && calls[0].text === '说明' && calls[1].node === image.getAttributeNode('title') && calls[1].text === '标题' && calls.every(function (item) { return item.attribute === ''; });
  } },
  { remark: '继承的忽略 class 和逐属性编程过滤均生效', test: function () {
    var image = document.createElement('img'), parent = document.createElement('div'), calls = []; image.alt = '说明'; image.title = '标题'; parent.append(image); document.body.append(parent);
    translate.addNodeToQueue = function (uuid, node, text) { calls.push(text); };
    translate.ignore.class.push('excluded'); parent.className = 'excluded'; translate.element.findNode('unit', image);
    if (calls.length !== 0) return false;
    parent.className = ''; var original = translate.ignore.isIgnore;
    translate.ignore.isIgnore = function (node, info) { return info.attribute === 'alt' || original(node, info); };
    translate.element.findNode('unit', image);
    return JSON.stringify(calls) === '["标题"]';
  } },
  { remark: '空白文本与无可翻译属性的空元素不产生队列项', test: function () {
    var parent = document.createElement('div'); parent.append(document.createTextNode(' \n '), document.createElement('span')); document.body.append(parent); var calls = 0;
    translate.addNodeToQueue = function () { calls++; };
    translate.element.findNode('unit', parent.firstChild); translate.element.findNode('unit', parent.lastChild);
    return calls === 0;
  } },
  {
    remark: '收集器返回 input 实时 value 时保留属性参数，旧 value Attr 不入队也不改写',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const input = document.createElement('input');
      input.setAttribute('value', 'default'); input.value = 'Hello'; document.body.append(input);
      const oldValue = input.getAttributeNode('value');
      // 只模拟统一收集器的返回约定；findNode 和 addNodeToQueue 使用真实实现，启用规则由收集器的测试验证。
      translate.element.nodeAnalyse.gets = function () { return [{ node: input, text: input.value, attribute: 'value' }]; };
      translate.element.findNode('batch', input);
      const record = translate.node.get(input);
      const item = Object.values(translate.nodeQueue.batch.list.english)[0];
      return record.originalText === 'Hello' && record.attribute === 'value' && translate.node.get(oldValue) == null &&
        item.original === 'Hello' && item.nodes.length === 1 && item.nodes[0].node === input && item.nodes[0].attribute === 'value' &&
        input.value === 'Hello' && input.defaultValue === 'default' && input.getAttributeNode('value') === oldValue;
    }
  },
  {
    remark: '收集器返回 textarea 实时 value 时保留属性参数和原默认文本',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const textarea = document.createElement('textarea');
      textarea.textContent = 'default'; textarea.value = 'Hello'; document.body.append(textarea);
      const defaultText = textarea.firstChild;
      // 只模拟收集结果，不替换入队方法；实时值应绑定 textarea 本身，默认 Text 不应被当作本次目标。
      translate.element.nodeAnalyse.gets = function () { return [{ node: textarea, text: textarea.value, attribute: 'value' }]; };
      translate.element.findNode('batch', textarea);
      const record = translate.node.get(textarea);
      const item = Object.values(translate.nodeQueue.batch.list.english)[0];
      return record.originalText === 'Hello' && record.attribute === 'value' && translate.node.get(defaultText) == null &&
        item.original === 'Hello' && item.nodes.length === 1 && item.nodes[0].node === textarea && item.nodes[0].attribute === 'value' &&
        textarea.value === 'Hello' && textarea.defaultValue === 'default' && textarea.firstChild === defaultText;
    }
  }
]);
