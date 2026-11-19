require('../helpers/module')(__filename, [
  { remark: '在 HTTP 页面启用 iframe 翻译，并保存调用者给出的脚本地址', test: function () {
    var url = Array.from(document.scripts).find(function (script) { return /\/translate(?:\.min)?\.js(?:\?|$)/.test(script.src); }).src;
    translate.element.iframe.use(url);
    return translate.element.iframe.isUse === true && translate.element.iframe.translateJsUrl === url;
  } },
  { remark: '再次启用允许更新注入地址，不修改已记录 iframe 的 WeakMap', test: function () {
    var map = translate.element.iframe.iframeMap;
    translate.element.iframe.use('/first.js'); translate.element.iframe.use('/second.js');
    return translate.element.iframe.isUse === true && translate.element.iframe.translateJsUrl === '/second.js' && translate.element.iframe.iframeMap === map;
  } },
  { remark: '对象形式读取 url 并保留配置钩子及扩展选项', test: function () {
    var hook = function () {};
    var options = { url: '/custom.js', setConfig: hook, futureOption: 'keep' };
    translate.element.iframe.use(options);
    return translate.element.iframe.isUse === true && translate.element.iframe.translateJsUrl === '/custom.js' &&
      translate.element.iframe.options === options && translate.element.iframe.options.setConfig === hook &&
      translate.element.iframe.options.futureOption === 'keep';
  } },
  { remark: '对象形式后重新使用字符串地址时清除旧配置钩子', test: function () {
    var calls = 0;
    translate.element.iframe.use({ url: '/custom.js', setConfig: function () { calls++; } });
    translate.element.iframe.use('/legacy.js');
    return translate.element.iframe.translateJsUrl === '/legacy.js' &&
      typeof translate.element.iframe.options.setConfig === 'undefined' && calls === 0;
  } }
]);
