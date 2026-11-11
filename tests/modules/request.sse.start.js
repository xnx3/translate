require('../helpers/module')(__filename, [
  { remark: '关闭状态调用后启用 SSE', test: function () {
    translate.request.sse.use = false;
    return translate.request.sse.start() === undefined && translate.request.sse.use === true;
  } },
  { remark: '已启用时重复调用保持启用', test: function () {
    translate.request.sse.use = true;
    translate.request.sse.start();
    translate.request.sse.start();
    return translate.request.sse.use === true;
  } },
  { remark: '启用不改写已注册的事件回调', test: function () {
    const callback = function () {};
    translate.request.sse.onDone = callback;
    translate.request.sse.start();
    return translate.request.sse.use === true && translate.request.sse.onDone === callback;
  } }
]);
