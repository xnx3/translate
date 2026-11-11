require('../helpers/module')(__filename, [
  { remark: '读取文本节点时保留原始空格并返回相同节点', test: function () {
    var node = document.createTextNode(' 你好 世界 '), result = translate.element.nodeAnalyse.get(node);
    return result.text === ' 你好 世界 ' && result.node === node && node.nodeValue === ' 你好 世界 ';
  } },
  { remark: '空白节点和没有直接文本的容器返回空文本，不递归偷取后代', test: function () {
    var element = document.createElement('div'); element.innerHTML = '<span>内容</span>';
    return translate.element.nodeAnalyse.get(document.createTextNode(' \n\t ')).text === '' && translate.element.nodeAnalyse.get(element).text === '';
  } },
  { remark: '明确传入属性时读取 title、placeholder 和实时输入 value', test: function () {
    var input = document.createElement('input'); input.title = '标题'; input.placeholder = '提示'; input.setAttribute('value', '旧内容'); input.value = '用户新内容';
    return translate.element.nodeAnalyse.get(input, 'title').text === '标题' && translate.element.nodeAnalyse.get(input, 'placeholder').text === '提示' && translate.element.nodeAnalyse.get(input, 'value').text === '用户新内容';
  } },
  { remark: '输入按钮优先读取 value，普通输入框读取 placeholder', test: function () {
    var button = document.createElement('input'), text = document.createElement('input'); button.type = 'submit'; button.setAttribute('value', '提交'); button.placeholder = '按钮提示'; text.placeholder = '输入姓名';
    var first = translate.element.nodeAnalyse.get(button), second = translate.element.nodeAnalyse.get(text);
    return first.text === '提交' && first.node === button.getAttributeNode('value') && second.text === '输入姓名' && second.node === text.getAttributeNode('placeholder');
  } },
  { remark: '读取图片 alt 和可翻译 meta content，不读 charset 等无关内容', test: function () {
    var image = document.createElement('img'), description = document.createElement('meta'), charset = document.createElement('meta'); image.alt = '图片说明'; description.name = 'description'; description.content = '网页介绍'; charset.name = 'viewport'; charset.content = 'width=device-width';
    return translate.element.nodeAnalyse.get(image).text === '图片说明' && translate.element.nodeAnalyse.get(description).text === '网页介绍' && translate.element.nodeAnalyse.get(charset).text === '';
  } }
]);
