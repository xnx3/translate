require('../helpers/module')(__filename, [
  { remark: '启用状态调用后关闭 SSE', test: function () {
    translate.request.sse.use = true;
    return translate.request.sse.stop() === undefined && translate.request.sse.use === false;
  } },
  { remark: '已关闭时重复调用保持关闭', test: function () {
    translate.request.sse.use = false;
    translate.request.sse.stop();
    translate.request.sse.stop();
    return translate.request.sse.use === false;
  } },
  { remark: '关闭保留已注册的事件回调', test: function () {
    const callback = function () {};
    translate.request.sse.onDone = callback;
    translate.request.sse.stop();
    return translate.request.sse.use === false && translate.request.sse.onDone === callback;
  } }
]);
