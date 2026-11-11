require('../helpers/module')(__filename, [
  { remark: '元素保持自身，文本和属性转换为所属元素，保留输入顺序', test: function () {
    var div = document.createElement('div'), span = document.createElement('span'); div.textContent = '文本'; span.title = '标题'; document.body.append(div, span);
    var result = translate.element.nodeToElement([span, div.firstChild, span.getAttributeNode('title')]);
    return result.length === 3 && result[0] === span && result[1] === div && result[2] === span;
  } },
  { remark: '空列表返回空数组', args: [[]], expected: [] },
  { remark: '独立文本、失去所有者的属性和 undefined 项被跳过', test: function () {
    var attribute = document.createAttribute('title'); attribute.value = '标题';
    return translate.element.nodeToElement([document.createTextNode('独立'), attribute, undefined]).length === 0;
  } },
  { remark: '同一元素关联多个节点时保持每个输入项，不在此方法擅自去重', test: function () {
    var element = document.createElement('p'); element.textContent = '文本'; element.title = '标题';
    var result = translate.element.nodeToElement([element, element.firstChild, element.getAttributeNode('title')]);
    return result.length === 3 && result.every(function (item) { return item === element; });
  } },
  { remark: '不支持的注释和文档节点记录诊断信息，不混入输出元素', test: function () {
    var logs = 0; translate.log = function () { logs++; };
    var result = translate.element.nodeToElement([document.createComment('注释'), document]);
    return result.length === 0 && logs === 4;
  } },
  { remark: '文本挂在 DocumentFragment 中时不能把非元素父节点作为 Element 返回', test: function () {
    var fragment = document.createDocumentFragment(), text = document.createTextNode('待插入文本'); fragment.append(text);
    var result = translate.element.nodeToElement([text]);
    return result.length === 0 && result.every(function (node) { return node.nodeType === Node.ELEMENT_NODE; }) && text.parentNode === fragment;
  } }
]);
