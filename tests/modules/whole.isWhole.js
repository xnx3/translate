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
  } },
  { remark: '单个普通空格分隔的完整类名命中当前元素和后代文本', test: function () {
    translate.whole.class = ['article'];
    var root = document.createElement('div'), child = document.createElement('span');
    root.className = 'other article'; child.textContent = '文本'; root.append(child); document.body.append(root);
    return root.classList.contains('article') && translate.whole.isWhole(root) === true &&
      translate.whole.isWhole(child) === true && translate.whole.isWhole(child.firstChild) === true;
  } },
  { remark: '单个制表符分隔的完整类名命中当前元素和后代文本', test: function () {
    translate.whole.class = ['article'];
    var root = document.createElement('div'), child = document.createElement('span');
    root.className = 'other\tarticle'; child.textContent = '文本'; root.append(child); document.body.append(root);
    return root.classList.contains('article') && translate.whole.isWhole(root) === true &&
      translate.whole.isWhole(child) === true && translate.whole.isWhole(child.firstChild) === true;
  } },
  { remark: '单个换行符分隔的完整类名命中当前元素和后代文本', test: function () {
    translate.whole.class = ['article'];
    var root = document.createElement('div'), child = document.createElement('span');
    root.className = 'other\narticle'; child.textContent = '文本'; root.append(child); document.body.append(root);
    return root.classList.contains('article') && translate.whole.isWhole(root) === true &&
      translate.whole.isWhole(child) === true && translate.whole.isWhole(child.firstChild) === true;
  } },
  { remark: '单个换页符分隔的完整类名命中当前元素和后代文本', test: function () {
    translate.whole.class = ['article'];
    var root = document.createElement('div'), child = document.createElement('span');
    root.className = 'other\farticle'; child.textContent = '文本'; root.append(child); document.body.append(root);
    return root.classList.contains('article') && translate.whole.isWhole(root) === true &&
      translate.whole.isWhole(child) === true && translate.whole.isWhole(child.firstChild) === true;
  } },
  { remark: '单个回车符分隔的完整类名命中当前元素和后代文本', test: function () {
    translate.whole.class = ['article'];
    var root = document.createElement('div'), child = document.createElement('span');
    root.className = 'other\rarticle'; child.textContent = '文本'; root.append(child); document.body.append(root);
    return root.classList.contains('article') && translate.whole.isWhole(root) === true &&
      translate.whole.isWhole(child) === true && translate.whole.isWhole(child.firstChild) === true;
  } },
  { remark: '连续混合的 HTML 空白仍分隔完整类名并沿后代命中', test: function () {
    translate.whole.class = ['article'];
    var root = document.createElement('div'), child = document.createElement('span');
    root.className = 'other \t\n\f\r  article\r\n\tlast'; child.textContent = '文本'; root.append(child); document.body.append(root);
    return root.classList.contains('article') && translate.whole.isWhole(root) === true &&
      translate.whole.isWhole(child) === true && translate.whole.isWhole(child.firstChild) === true;
  } },
  { remark: '类名内部的不间断空格不分隔，只有完整类名配置才能命中', test: function () {
    // NBSP 不属于 HTML class 分隔符，不能因使用通用空白正则而误命中 article。
    var root = document.createElement('div'), child = document.createElement('span');
    root.className = 'other\u00a0article\u00a0last'; child.textContent = '文本'; root.append(child); document.body.append(root);
    translate.whole.class = ['article'];
    var rejected = !root.classList.contains('article') && translate.whole.isWhole(root) === false &&
      translate.whole.isWhole(child.firstChild) === false;
    translate.whole.class = [root.className];
    return rejected && root.classList.contains(root.className) && translate.whole.isWhole(root) === true &&
      translate.whole.isWhole(child.firstChild) === true;
  } },
  { remark: '类名内部的竖制表符不分隔，只有完整类名配置才能命中', test: function () {
    // 竖制表符也不属于 HTML 的五种 ASCII 空白，仍是同一个类名的一部分。
    var root = document.createElement('div'), child = document.createElement('span');
    root.className = 'other\varticle\vlast'; child.textContent = '文本'; root.append(child); document.body.append(root);
    translate.whole.class = ['article'];
    var rejected = !root.classList.contains('article') && translate.whole.isWhole(root) === false &&
      translate.whole.isWhole(child.firstChild) === false;
    translate.whole.class = [root.className];
    return rejected && root.classList.contains(root.className) && translate.whole.isWhole(root) === true &&
      translate.whole.isWhole(child.firstChild) === true;
  } },
  { remark: '制表符和换行分隔后仍不把部分类名当成完整配置', test: function () {
    translate.whole.class = ['article'];
    var root = document.createElement('div'), child = document.createElement('span');
    root.className = 'other\tarticle-more\nlast'; child.textContent = '文本'; root.append(child); document.body.append(root);
    return !root.classList.contains('article') && translate.whole.isWhole(root) === false &&
      translate.whole.isWhole(child) === false && translate.whole.isWhole(child.firstChild) === false;
  } }
]);
