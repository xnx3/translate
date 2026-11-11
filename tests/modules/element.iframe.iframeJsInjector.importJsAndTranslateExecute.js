require('../helpers/module')(__filename, [
  { remark: '在目标文档创建脚本，加载后传递当前窗口配置、设置语言并延迟执行', test: function () {
    var iframe = document.createElement('iframe'); document.body.append(iframe);
    var url = Array.from(document.scripts).find(function (script) { return /\/translate(?:\.min)?\.js(?:\?|$)/.test(script.src); }).src;
    var script, received, executed = 0, delays = [], config = { localLanguage: 'chinese_simplified', marker: 'current-window' };
    translate.config.get = function () { return config; };
    iframe.contentWindow.translate = { config: { set: function (value) { received = value; } }, language: { getCurrent: function () { return 'english'; } }, execute: function () { executed++; } };
    iframe.contentDocument.documentElement.appendChild = function (node) { script = node; return node; };
    window.setTimeout = function (callback, delay) { delays.push(delay); callback(); return 1; };
    var injector = new translate.element.iframe.iframeJsInjector(iframe, url);
    injector.importJsAndTranslateExecute();
    if (!script || script.ownerDocument !== iframe.contentDocument || script.src !== url || script.type !== 'text/javascript' || injector.isInjectJs !== true) return false;
    script.onload();
    return received === config && iframe.contentWindow.translate.to === 'english' && executed === 1 && JSON.stringify(delays) === '[10]';
  } },
  { remark: '同一个注入实例只创建一个脚本，避免重复加载运行时', test: function () {
    var iframe = document.createElement('iframe'); document.body.append(iframe); var count = 0;
    iframe.contentDocument.documentElement.appendChild = function (node) { count++; return node; };
    var injector = new translate.element.iframe.iframeJsInjector(iframe, '/selected.js');
    injector.importJsAndTranslateExecute(); injector.importJsAndTranslateExecute();
    return count === 1 && injector.isInjectJs === true;
  } },
  { remark: '同源校验失败时不获取目标文档、不创建脚本也不标记已注入', test: function () {
    var iframe = document.createElement('iframe'); iframe.src = 'https://foreign.example/frame';
    var read = 0; Object.defineProperty(iframe, 'contentDocument', { get: function () { read++; return null; } });
    Object.defineProperty(iframe, 'contentWindow', { get: function () { throw new DOMException('Blocked', 'SecurityError'); } });
    var injector = new translate.element.iframe.iframeJsInjector(iframe, '/selected.js'); injector.importJsAndTranslateExecute();
    return injector.isInjectJs === false && read === 1;
  } },
  { remark: 'DOM 插入失败时被捕获，不能把异常传播到父页面', test: function () {
    var iframe = document.createElement('iframe'); document.body.append(iframe);
    iframe.contentDocument.documentElement.appendChild = function () { throw new Error('Document destroyed'); };
    var injector = new translate.element.iframe.iframeJsInjector(iframe, '/selected.js'); injector.importJsAndTranslateExecute();
    return iframe.contentDocument.querySelectorAll('script').length === 0;
  } }
]);
