require('../helpers/module')(__filename, [
  { remark: '文档存在且 readyState 为字符串时调用注入入口，并保留实例 this', test: function () {
    var iframe = document.createElement('iframe'); document.body.append(iframe);
    var injector = new translate.element.iframe.iframeJsInjector(iframe, '/selected.js'), calls = 0;
    injector.importJsAndTranslateExecute = function () { if (this === injector) calls++; };
    injector.injectJs();
    return calls === 1;
  } },
  { remark: '没有有效 iframe 对象时不尝试注入', test: function () {
    var injector = new translate.element.iframe.iframeJsInjector(undefined, '/selected.js'), calls = 0;
    injector.importJsAndTranslateExecute = function () { calls++; };
    injector.injectJs();
    return calls === 0;
  } },
  { remark: '文档就绪状态异常时跳过注入', test: function () {
    var iframe = document.createElement('iframe'); document.body.append(iframe);
    Object.defineProperty(iframe.contentDocument, 'readyState', { get: function () { return undefined; } });
    var injector = new translate.element.iframe.iframeJsInjector(iframe, '/selected.js'), calls = 0;
    injector.importJsAndTranslateExecute = function () { calls++; };
    injector.injectJs();
    return calls === 0;
  } },
  { remark: '浏览器不允许访问 iframe 文档而返回 null 时安全跳过，不造成页面异常', test: function () {
    var iframe = document.createElement('iframe'); document.body.append(iframe);
    Object.defineProperty(iframe, 'contentDocument', { get: function () { return null; } });
    var injector = new translate.element.iframe.iframeJsInjector(iframe, '/selected.js'), calls = 0;
    injector.importJsAndTranslateExecute = function () { calls++; };
    injector.injectJs();
    return calls === 0;
  } }
]);
