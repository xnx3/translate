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
  } }
]);
