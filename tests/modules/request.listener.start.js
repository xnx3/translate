require('../helpers/module')(__filename, [
  { remark: '启用请求监听开关，但等到 execute 生命周期才安装监听', test: function () {
    var listener = translate.request.listener;
    listener.use = false; listener.isStart = false; listener.intervalId = null; listener.observer = null;
    listener.start();
    return listener.use === true && listener.isStart === false && listener.intervalId === null && listener.observer === null;
  } },
  { remark: '重复启用不重置已有任务和监听资源', test: function () {
    var listener = translate.request.listener, observer = {};
    listener.use = true; listener.isStart = true; listener.executetime = 1234; listener.observer = observer;
    listener.start(); listener.start();
    // 本项使用的是资源占位对象，并未安装浏览器观察器。
    var result = listener.use === true && listener.isStart === true && listener.executetime === 1234 && listener.observer === observer;
    listener.observer = null;
    return result;
  } }
]);
