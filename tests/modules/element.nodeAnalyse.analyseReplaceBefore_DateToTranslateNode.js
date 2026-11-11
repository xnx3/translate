// input 和 textarea 的 value 路径分别报告，并将标签直接写入浏览器函数。
const valueCases = ['input', 'textarea'].map(function (tag) {
  return { remark: tag + ' 的实时 value 挂在元素记录上，不要求 value Attr', test: new Function(`
    translate.node.data = new Map();
    var element = document.createElement(${JSON.stringify(tag)}); element.value = '用户输入'; translate.node.set(element, {});
    translate.element.nodeAnalyse.analyseReplaceBefore_DateToTranslateNode(element, 'value', 'Input');
    return translate.node.get(element).resultText === 'Input' && element.value === '用户输入';
  `) };
});

require('../helpers/module')(__filename, [
  { remark: '已登记文本节点在渲染前更新 resultText，保留历次完整译文集合', test: function () {
    var node = document.createTextNode('原文'); translate.node.data = new Map(); translate.node.set(node, {});
    translate.element.nodeAnalyse.analyseReplaceBefore_DateToTranslateNode(node, '', 'A');
    translate.element.nodeAnalyse.analyseReplaceBefore_DateToTranslateNode(node, '', 'B');
    var record = translate.node.get(node);
    return record.resultText === 'B' && record.translateResults.A === 1 && record.translateResults.B === 1 && node.nodeValue === '原文';
  } },
  { remark: '元素属性的记录写到真实 Attr 节点，不写到元素本身', test: function () {
    var element = document.createElement('span'); element.title = '原文'; var attr = element.getAttributeNode('title'); translate.node.data = new Map(); translate.node.set(attr, {});
    translate.element.nodeAnalyse.analyseReplaceBefore_DateToTranslateNode(element, 'title', 'Title');
    return translate.node.get(attr).resultText === 'Title' && element.title === '原文' && translate.node.find(element) === false;
  } },
  ...valueCases,
  { remark: '未登记或翻译过程中消失的节点不创建记录，也不改写 DOM', test: function () {
    var node = document.createTextNode('原文'); translate.node.data = new Map();
    translate.element.nodeAnalyse.analyseReplaceBefore_DateToTranslateNode(node, '', '译文');
    return translate.node.find(node) === false && node.nodeValue === '原文';
  } }
]);
