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
  } }
]);
