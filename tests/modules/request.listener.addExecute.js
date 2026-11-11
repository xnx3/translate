require('../helpers/module')(__filename, [
  { remark: '首次收到请求完成通知时安排立即执行，记录已初始化状态', test: function () {
    var listener = translate.request.listener;
    Date.now = function () { return 10000; };
    listener.lasttime = 0; listener.executetime = 0;
    listener.addExecute();
    return listener.executetime === 10000 && listener.lasttime === 1;
  } },
  { remark: '已有等待任务时重复通知不会推迟原来的执行时间', test: function () {
    var listener = translate.request.listener;
    Date.now = function () { return 10000; };
    listener.lasttime = 9000; listener.executetime = 9500;
    listener.addExecute();
    return listener.executetime === 9500 && listener.lasttime === 9000;
  } },
  { remark: '距离上次执行不足最小间隔时安排在间隔到期时执行', test: function () {
    var listener = translate.request.listener;
    Date.now = function () { return 10000; };
    listener.lasttime = 9800; listener.executetime = 0; listener.minIntervalTime = 800;
    listener.addExecute();
    return listener.executetime === 10600;
  } },
  { remark: '恰好达到最小间隔时可立即安排执行', test: function () {
    var listener = translate.request.listener;
    Date.now = function () { return 10000; };
    listener.lasttime = 9200; listener.executetime = 0; listener.minIntervalTime = 800;
    listener.addExecute();
    return listener.executetime === 10000;
  } },
  { remark: '超过最小间隔和自定义间隔为零时均采用当前时间', test: function () {
    var listener = translate.request.listener;
    Date.now = function () { return 10000; };
    listener.lasttime = 100; listener.executetime = 0; listener.minIntervalTime = 0;
    listener.addExecute();
    return listener.executetime === 10000;
  } }
]);
