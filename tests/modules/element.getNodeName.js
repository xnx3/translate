require('../helpers/module')(__filename, [
  { remark: 'null 节点返回空字符串', args: [null], expected: '' },
  { remark: '省略节点返回空字符串', args: [], expected: '' },
  { remark: '缺少 nodeName 的对象返回空字符串', args: [{}], expected: '' },
  { remark: 'nodeName 为 null 的对象返回空字符串', args: [{ nodeName: null }], expected: '' },
  { remark: '真实元素、文本、属性和文档返回各自原始节点名', test: function () {
    var element = document.createElement('div'); element.title = '标题';
    return translate.element.getNodeName(element) === 'DIV' && translate.element.getNodeName(document.createTextNode('文本')) === '#text' && translate.element.getNodeName(element.getAttributeNode('title')) === 'title' && translate.element.getNodeName(document) === '#document';
  } },
  { remark: '保留字符串的大小写和空字符串，不自动改写名称', args: [{ nodeName: 'custom-Tag' }], expected: 'custom-Tag' },
  { remark: 'nodeName 被同名属性遮蔽但 tagName 有效时使用 tagName', args: [{ nodeName: {}, tagName: 'FORM' }], expected: 'FORM' },
  { remark: '节点名与标签名都无效时记录日志并返回空字符串', test: function () {
    var logs = 0; translate.log = function () { logs++; };
    return translate.element.getNodeName({ nodeName: 123, tagName: null }) === '' && logs === 2;
  } }
]);
