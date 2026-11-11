require('../helpers/module')(__filename, [
  { remark: '未启用 iframe 翻译时不添加 load 监听、不注入脚本也不建立记录', test: function () {
    var iframe = document.createElement('iframe'); document.body.append(iframe); var count = 0;
    translate.element.iframe.isUse = false; iframe.addEventListener = function () { count++; };
    translate.element.iframe.execute(iframe);
    return count === 0 && !translate.element.iframe.iframeMap.has(iframe) && iframe.contentDocument.scripts.length === 0;
  } },
  { remark: '无 src 且未加载运行时的同源 iframe 立即交给注入器', test: function () {
    var iframe = document.createElement('iframe'); document.body.append(iframe); var args, injected = 0;
    translate.element.iframe.isUse = true; translate.element.iframe.translateJsUrl = '/selected.js';
    translate.element.iframe.iframeJsInjector = class { constructor(frame, url) { args = [frame, url]; } injectJs() { injected++; } };
    translate.element.iframe.execute(iframe);
    return injected === 1 && args[0] === iframe && args[1] === '/selected.js';
  } },
  { remark: '无 src 且已有有效运行时时复用库、同步本窗口配置并延迟执行，不重复注入', test: function () {
    var iframe = document.createElement('iframe'); document.body.append(iframe); var received, executed = 0, injected = 0, config = { marker: 'self' };
    translate.element.iframe.isUse = true; translate.config.get = function () { return config; };
    iframe.contentWindow.translate = { version: 'v-test', config: { set: function (value) { received = value; } }, language: { getCurrent: function () { return 'english'; } }, execute: function () { executed++; } };
    translate.element.iframe.iframeJsInjector = class { injectJs() { injected++; } };
    window.setTimeout = function (callback, delay) { if (delay === 10) callback(); return 1; };
    translate.element.iframe.execute(iframe); translate.element.iframe.execute(iframe);
    return injected === 0 && executed === 2 && received === config && iframe.contentWindow.translate.to === 'english';
  } },
  { remark: 'id=translate 的同名窗口属性没有 version 时仍注入真正运行时', test: function () {
    var iframe = document.createElement('iframe'); document.body.append(iframe); iframe.contentDocument.body.innerHTML = '<div id="translate"></div>'; var injected = 0;
    translate.element.iframe.isUse = true; translate.element.iframe.iframeJsInjector = class { injectJs() { injected++; } };
    translate.element.iframe.execute(iframe);
    return injected === 1;
  } },
  { remark: '带 src 的 iframe 重复扫描只注册一次 load，加载后缺少库才注入', test: function () {
    var iframe = document.createElement('iframe'); iframe.src = 'about:blank'; document.body.append(iframe); var loads = [], injected = 0;
    iframe.addEventListener = function (name, callback) { if (name === 'load') loads.push(callback); };
    translate.element.iframe.isUse = true; translate.element.iframe.iframeJsInjector = class { injectJs() { injected++; } };
    translate.element.iframe.execute(iframe); translate.element.iframe.execute(iframe);
    if (loads.length !== 1 || injected !== 0) return false;
    loads[0](); iframe.contentWindow.translate = { version: 'already-loaded' }; loads[0]();
    return injected === 1 && translate.element.iframe.iframeMap.get(iframe).addLoad === true && translate.element.iframe.iframeMap.get(iframe).isTranslate === true;
  } },
  { remark: 'load 时文档已不可访问则跳过注入，不尝试读取受限窗口', test: function () {
    var iframe = document.createElement('iframe'); iframe.src = 'about:blank'; document.body.append(iframe); var load, injected = 0;
    iframe.addEventListener = function (name, callback) { load = callback; }; translate.element.iframe.isUse = true;
    translate.element.iframe.iframeJsInjector = class { injectJs() { injected++; } };
    translate.element.iframe.execute(iframe);
    Object.defineProperty(iframe, 'contentDocument', { get: function () { return null; } });
    Object.defineProperty(iframe, 'contentWindow', { get: function () { throw new DOMException('Blocked', 'SecurityError'); } });
    load();
    return injected === 0;
  } },
  { remark: '同源判断拒绝跨域 iframe 后不创建跟踪记录或注入器', test: function () {
    var iframe = document.createElement('iframe'); iframe.src = 'https://foreign.example/frame'; var injected = 0;
    Object.defineProperty(iframe, 'contentDocument', { get: function () { return null; } }); Object.defineProperty(iframe, 'contentWindow', { get: function () { throw new DOMException('Blocked', 'SecurityError'); } });
    translate.element.iframe.isUse = true; translate.element.iframe.iframeJsInjector = class { injectJs() { injected++; } };
    translate.element.iframe.execute(iframe);
    return injected === 0 && !translate.element.iframe.iframeMap.has(iframe);
  } }
]);
