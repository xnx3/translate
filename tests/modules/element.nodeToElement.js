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
  } },
  { remark: '模板内容中的直接文本没有父元素，跳过且保持模板原文', test: function () {
    var template = document.createElement('template'); template.innerHTML = '模板原文';
    var text = template.content.firstChild;
    var result = translate.element.nodeToElement([text]);
    return result.length === 0 && text.parentNode === template.content && text.nodeValue === '模板原文';
  } },
  { remark: 'ShadowRoot 中的直接文本被跳过，不擅自返回宿主元素', test: function () {
    // 宿主不是文本的直接父元素，返回宿主会扩大进度遮罩作用范围。
    var host = document.createElement('div'); document.body.append(host);
    var root = host.attachShadow({ mode: 'open' }), text = document.createTextNode('影子原文'); root.append(text);
    var result = translate.element.nodeToElement([text]);
    return result.length === 0 && text.parentNode === root && text.nodeValue === '影子原文' && root.host === host;
  } },
  { remark: 'ShadowRoot 内普通元素中的文本仍返回直接父元素', test: function () {
    var host = document.createElement('div'); document.body.append(host);
    var root = host.attachShadow({ mode: 'open' }), element = document.createElement('span');
    element.textContent = '影子元素原文'; root.append(element);
    var text = element.firstChild, result = translate.element.nodeToElement([text]);
    return result.length === 1 && result[0] === element && text.parentNode === element && element.parentNode === root;
  } },
  { remark: '未挂载元素中的文本仍返回父元素，不要求连接到文档', test: function () {
    var element = document.createElement('p'); element.textContent = '未挂载原文';
    var text = element.firstChild, result = translate.element.nodeToElement([text]);
    return result.length === 1 && result[0] === element && !element.isConnected && text.nodeValue === '未挂载原文';
  } },
  { remark: 'SVG 文本仍返回 SVG 父元素，保持节点身份和原文', test: function () {
    var element = document.createElementNS('http://www.w3.org/2000/svg', 'text'); element.textContent = 'SVG 原文';
    var text = element.firstChild, result = translate.element.nodeToElement([text]);
    return result.length === 1 && result[0] === element && result[0].nodeType === Node.ELEMENT_NODE &&
      text.parentNode === element && text.nodeValue === 'SVG 原文';
  } },
  { remark: '混合列表跳过片段直接文本后保留后续有效元素的顺序和重复', test: function () {
    var fragment = document.createDocumentFragment(), text = document.createTextNode('片段原文'); fragment.append(text);
    var first = document.createElement('p'), second = document.createElement('span');
    first.textContent = '正常原文'; second.title = '属性原文';
    var result = translate.element.nodeToElement([text, first.firstChild, second.getAttributeNode('title'), first, second]);
    return result.length === 4 && result[0] === first && result[1] === second && result[2] === first && result[3] === second &&
      text.parentNode === fragment && text.nodeValue === '片段原文' && first.textContent === '正常原文' && second.title === '属性原文';
  } }
]);
