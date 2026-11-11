require('../helpers/module')(__filename, [
  { remark: '省略替换内容时执行读取，不改动原节点', test: function () {
    var node = document.createTextNode('你好'), result = translate.element.nodeAnalyse.analyse(node);
    return result.text === '你好' && result.node === node && node.nodeValue === '你好' && !Object.hasOwn(result, 'resultText');
  } },
  { remark: '传入完整替换参数时同时返回原节点和最终文本', test: function () {
    // 显式指定不补英文词间空格的目标语种，使本例只验证节点写回和返回值。
    translate.to = 'chinese_simplified';
    var node = document.createTextNode('甲乙甲'), result = translate.element.nodeAnalyse.analyse(node, '甲', 'A', '', []);
    return node.nodeValue === 'A乙A' && result.node === node && result.text === 'A乙A' && result.resultText === 'A乙A';
  } },
  { remark: '读取和替换 textarea value 时使用实时值，保留 placeholder', test: function () {
    var element = document.createElement('textarea'); element.value = '动态输入'; element.placeholder = '提示';
    var read = translate.element.nodeAnalyse.analyse(element, '', '', 'value');
    var write = translate.element.nodeAnalyse.analyse(element, '动态输入', 'Dynamic input', 'value');
    return read.text === '动态输入' && element.value === 'Dynamic input' && element.placeholder === '提示' && write.resultText === 'Dynamic input';
  } },
  { remark: 'meta OpenGraph 属性可读取和替换，而未知 meta 不产生文本', test: function () {
    var meta = document.createElement('meta'); meta.setAttribute('property', 'OG:TITLE'); meta.content = '网页标题';
    var read = translate.element.nodeAnalyse.analyse(meta), write = translate.element.nodeAnalyse.analyse(meta, '网页标题', 'Page title');
    var other = document.createElement('meta'); other.name = 'viewport'; other.content = 'width=device-width';
    return read.text === '网页标题' && meta.content === 'Page title' && write.resultText === 'Page title' && translate.element.nodeAnalyse.analyse(other).text === '';
  } },
  { remark: '空白 TextNode 不生成翻译文本，容器也不会被整段 innerHTML 替换', test: function () {
    var element = document.createElement('div'); element.innerHTML = '<b>甲</b>';
    var html = element.innerHTML, result = translate.element.nodeAnalyse.analyse(element, '甲', 'A');
    return translate.element.nodeAnalyse.analyse(document.createTextNode(' \n ')).text === '' && result.text === '' && element.innerHTML === html;
  } },
  { remark: '直接 Attr 节点按 nodeValue 替换，保留其 ownerElement', test: function () {
    var element = document.createElement('span'); element.title = '原文'; var attr = element.getAttributeNode('title');
    var result = translate.element.nodeAnalyse.analyse(attr, '原文', 'Translated');
    return element.title === 'Translated' && result.node === attr && attr.ownerElement === element && result.resultText === 'Translated';
  } }
]);
