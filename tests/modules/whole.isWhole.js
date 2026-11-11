require('../helpers/module')(__filename, [
  { remark: '默认未配置时普通元素不启用整体翻译', test: function () {
    return translate.whole.isWhole(document.createElement('p')) === false;
  } },
  { remark: '标签配置可命中当前元素及其后代文本节点', test: function () {
    translate.whole.tag = ['p'];
    var p = document.createElement('p'), span = document.createElement('span'); span.textContent = '文本'; p.append(span); document.body.append(p);
    return translate.whole.isWhole(p) === true && translate.whole.isWhole(span) === true && translate.whole.isWhole(span.firstChild) === true;
  } },
  { remark: 'class 和 id 可沿父级命中，旁边不相关的元素不受影响', test: function () {
    translate.whole.class = ['article']; translate.whole.id = ['whole-id'];
    var root = document.createElement('div'), child = document.createElement('span'), other = document.createElement('div'); root.className = 'x article y'; root.append(child); document.body.append(root, other);
    var byClass = translate.whole.isWhole(child); root.className = ''; root.id = 'whole-id'; var byId = translate.whole.isWhole(child);
    return byClass === true && byId === true && translate.whole.isWhole(other) === false;
  } },
  { remark: 'class 和 id 采用完整名称，不接受部分匹配', test: function () {
    translate.whole.class = ['article']; translate.whole.id = ['main'];
    var root = document.createElement('div'); root.className = 'article-more'; root.id = 'main-more'; document.body.append(root);
    return translate.whole.isWhole(root) === false;
  } },
  { remark: 'html 和 document 不接受整体翻译配置，body 是有效的最大范围', test: function () {
    translate.whole.tag = ['html']; var htmlRejected = translate.whole.isWhole(document.body) === false;
    translate.whole.tag = ['body'];
    return htmlRejected && translate.whole.isWhole(document.body) === true && translate.whole.isWhole(document) === false;
  } },
  { remark: '存在配置但传入空元素时安全返回 false', test: function () {
    translate.whole.tag = ['p'];
    return translate.whole.isWhole(null) === false && translate.whole.isWhole(undefined) === false;
  } },
  { remark: 'enableAll 覆盖选择器限制，未匹配元素也采用整体翻译', test: function () {
    translate.whole.tag = ['p']; translate.whole.enableAll();
    return translate.whole.isWhole(document.createElement('div')) === true;
  } },
  { remark: '未匹配的深层结构或循环 parentElement 不无限遍历', test: function () {
    translate.whole.tag = ['p'];
    var cyclic = { nodeName: 'SPAN', className: '', id: '' }; cyclic.parentElement = cyclic;
    return translate.whole.isWhole(cyclic) === false;
  } },
  { remark: 'HTML class 使用制表符和换行分隔时仍按完整类名命中', test: function () {
    translate.whole.class = ['article'];
    var root = document.createElement('div'), child = document.createElement('span'); root.className = 'other\tarticle\nlast'; root.append(child); document.body.append(root);
    return root.classList.contains('article') && translate.whole.isWhole(root) === true && translate.whole.isWhole(child) === true;
  } }
]);
