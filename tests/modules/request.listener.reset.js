require('../helpers/module')(__filename, [
  { remark: '释放定时器和观察器，清空启动状态及等待任务', test: function () {
    var listener = translate.request.listener, cleared = [], disconnected = 0;
    window.clearInterval = function (id) { cleared.push(id); };
    listener.intervalId = 123; listener.observer = { disconnect: function () { disconnected++; } };
    listener.isStart = true; listener.executetime = 456; listener.use = true; listener.lasttime = 789;
    listener.reset();
    return JSON.stringify(cleared) === '[123]' && disconnected === 1 && listener.intervalId === null && listener.observer === null && listener.isStart === false && listener.executetime === 0 && listener.use === true && listener.lasttime === 789;
  } },
  { remark: '未安装资源时允许 reset，重复 reset 不重复释放资源', test: function () {
    var listener = translate.request.listener, calls = 0;
    window.clearInterval = function () { calls++; };
    listener.intervalId = null; listener.observer = null; listener.isStart = false; listener.executetime = 0;
    listener.reset(); listener.reset();
    return calls === 0 && listener.intervalId === null && listener.observer === null;
  } },
  { remark: '仅存在观察器时只释放观察器', test: function () {
    var listener = translate.request.listener, calls = 0;
    listener.intervalId = null; listener.observer = { disconnect: function () { calls++; } };
    listener.reset(); listener.reset();
    return calls === 1 && listener.observer === null;
  } }
]);
