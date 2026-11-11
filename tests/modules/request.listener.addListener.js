require('../helpers/module')(__filename, [
  { remark: '未启用时不创建任何观察器或定时器', test: function () {
    var listener = translate.request.listener, count = 0;
    window.setInterval = function () { count++; };
    window.PerformanceObserver = function () { count++; };
    listener.use = false; listener.isStart = false;
    listener.addListener();
    return count === 0 && listener.isStart === false;
  } },
  { remark: '支持资源类型时优先使用 entryTypes，重复安装仅创建一份资源', test: function () {
    var listener = translate.request.listener, intervals = 0, observers = 0, options;
    window.setInterval = function (callback, delay) { intervals++; return delay; };
    window.clearInterval = function () {};
    window.PerformanceObserver = function () { observers++; this.observe = function (value) { options = value; }; this.disconnect = function () {}; };
    PerformanceObserver.supportedEntryTypes = ['resource'];
    listener.use = true; listener.isStart = false;
    listener.addListener(); listener.addListener();
    var result = intervals === 1 && observers === 1 && listener.intervalId === 100 && JSON.stringify(options) === '{"entryTypes":["resource"]}';
    listener.reset();
    return result;
  } },
  { remark: 'entryTypes 不被接受时回退到 type 加 buffered', test: function () {
    var listener = translate.request.listener, options = [];
    window.setInterval = function () { return 1; }; window.clearInterval = function () {};
    window.PerformanceObserver = function () { this.observe = function (value) { options.push(value); if (value.entryTypes) throw new Error('unsupported'); }; this.disconnect = function () {}; };
    PerformanceObserver.supportedEntryTypes = ['resource'];
    listener.use = true; listener.isStart = false; listener.addListener();
    var result = options.length === 2 && options[1].type === 'resource' && options[1].buffered === true && listener.isStart === true;
    listener.reset();
    return result;
  } },
  { remark: '两种 observe 参数都不支持时释放已安装资源，允许后续重试', test: function () {
    var listener = translate.request.listener, cleared = 0, disconnected = 0;
    window.setInterval = function () { return 9; }; window.clearInterval = function (id) { if (id === 9) cleared++; };
    window.PerformanceObserver = function () { this.observe = function () { throw new Error('unsupported'); }; this.disconnect = function () { disconnected++; }; };
    PerformanceObserver.supportedEntryTypes = ['resource'];
    listener.use = true; listener.isStart = false; listener.addListener();
    return cleared === 1 && disconnected === 1 && listener.isStart === false && listener.observer === null && listener.intervalId === null;
  } },
  { remark: '不存在 PerformanceObserver 时清理定时器并恢复未启动状态', test: function () {
    var listener = translate.request.listener, cleared = 0;
    window.setInterval = function () { return 4; }; window.clearInterval = function () { cleared++; };
    window.PerformanceObserver = undefined;
    listener.use = true; listener.isStart = false; listener.addListener();
    return cleared === 1 && listener.isStart === false && listener.intervalId === null;
  } },
  { remark: '只监听外部 fetch 与 XHR，排除自身翻译请求、edge 请求及 trigger 拒绝项', test: function () {
    var listener = translate.request.listener, callback, scheduled = 0, seen = [];
    window.setInterval = function () { return 1; }; window.clearInterval = function () {};
    window.PerformanceObserver = function (value) { callback = value; this.observe = function () {}; this.disconnect = function () {}; };
    listener.use = true; listener.isStart = false;
    translate.request.api.host = 'https://translate.example/';
    listener.trigger = function (url) { seen.push(url); return url.indexOf('skip') < 0; };
    listener.addExecute = function () { scheduled++; };
    listener.addListener();
    callback({ getEntries: function () { return [
      { initiatorType: 'img', name: 'https://site.example/logo.png' },
      { initiatorType: 'fetch', name: 'https://translate.example/translate.json' },
      { initiatorType: 'fetch', name: 'https://edge.microsoft.com/translate/translatetext' },
      { initiatorType: 'xmlhttprequest', name: 'https://site.example/skip' }
    ]; } });
    callback({ getEntries: function () { return [{ initiatorType: 'fetch', name: 'https://site.example/api' }, { initiatorType: 'fetch', name: 'https://site.example/other' }]; } });
    var result = scheduled === 1 && JSON.stringify(seen) === '["https://site.example/skip","https://site.example/api"]' && Array.isArray(translate.request.api.host);
    listener.reset();
    return result;
  } },
  { remark: '等待任务在延迟到期后执行一次，边界时刻及首次 execute 前均不提前执行', test: function () {
    var listener = translate.request.listener, tick, calls = 0, now = 1200;
    Date.now = function () { return now; };
    window.setInterval = function (callback) { tick = callback; return 1; }; window.clearInterval = function () {};
    window.PerformanceObserver = function () { this.observe = function () {}; this.disconnect = function () {}; };
    translate.execute = function () { calls++; };
    listener.use = true; listener.isStart = false; listener.delayExecuteTime = 200; listener.executetime = 1000;
    translate.executeTriggerNumber = 1; listener.addListener(); tick();
    var boundary = calls === 0 && listener.executetime === 1000;
    now = 1201; tick(); tick();
    var executed = calls === 1 && listener.executetime === 0 && listener.lasttime === 1201;
    listener.executetime = 1000; translate.executeTriggerNumber = 0; tick();
    var result = boundary && executed && calls === 1 && listener.executetime === 0;
    listener.reset();
    return result;
  } },
  { remark: '自动翻译抛错时记录异常并保持任务已消费，避免重复触发', test: function () {
    var listener = translate.request.listener, tick, logs = 0;
    Date.now = function () { return 5000; };
    window.setInterval = function (callback) { tick = callback; return 1; }; window.clearInterval = function () {};
    window.PerformanceObserver = function () { this.observe = function () {}; this.disconnect = function () {}; };
    translate.execute = function () { throw new Error('execute failed'); }; translate.log = function () { logs++; };
    translate.executeTriggerNumber = 1;
    listener.use = true; listener.isStart = false; listener.executetime = 1000; listener.addListener(); tick(); tick();
    var result = logs >= 1 && listener.executetime === 0 && listener.lasttime === 5000;
    listener.reset();
    return result;
  } }
]);
