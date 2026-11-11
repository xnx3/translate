// 各类事件单独报告；只隔离监听回调，实际执行 triggerEvent 分派逻辑。
const namedEventCases = [['item', 'Item'], ['done', 'Done'], ['error', 'Error']].map(function (item) {
  return { remark: item[0] + ' 事件只调用对应的专用回调', test: new Function(`
    var calls = [], callbacks = {};
    ['Batch', 'Item', 'Done', 'Error'].forEach(function (name) { callbacks['on' + name] = function () { calls.push(name); }; });
    translate.request.sse.triggerEvent(${JSON.stringify(item[0])}, {}, {}, callbacks);
    return calls.length === 1 && calls[0] === ${JSON.stringify(item[1])};
  `) };
});

require('../helpers/module')(__filename, [
  { remark: '批次事件先调用本次请求监听，再调用全局监听，并保留参数与 this', test: function () {
    var calls = [], data = { text: ['译文'] }, request = { text: '原文' };
    var local = { onEvent: function (name, value, input) { calls.push(this === local && name === 'batch' && value === data && input === request ? 'local-event' : 'error'); }, onBatch: function (value, input) { calls.push(this === local && value === data && input === request ? 'local-batch' : 'error'); } };
    translate.request.sse.onEvent = function (name, value, input) { calls.push(this === translate.request.sse && name === 'batch' && value === data && input === request ? 'global-event' : 'error'); };
    translate.request.sse.onBatch = function (value, input) { calls.push(value === data && input === request ? 'global-batch' : 'error'); };
    translate.request.sse.triggerEvent('batch', data, request, local);
    return JSON.stringify(calls) === JSON.stringify(['local-event', 'local-batch', 'global-event', 'global-batch']);
  } },
  ...namedEventCases,
  { remark: '未知事件仍通知通用监听，不误触发专用监听', test: function () {
    var calls = [];
    translate.request.sse.onEvent = function (name, data) { calls.push(name, data); };
    translate.request.sse.onDone = function () { calls.push('wrong'); };
    translate.request.sse.triggerEvent('custom', 'payload', {}, null);
    return JSON.stringify(calls) === '["custom","payload"]';
  } },
  { remark: '某一个监听抛错时记录日志，其他监听仍按顺序收到事件', test: function () {
    var calls = [], logs = [];
    translate.log = function (message) { logs.push(message); };
    translate.request.sse.onEvent = function () { calls.push('global'); };
    translate.request.sse.onDone = function () { calls.push('done'); };
    translate.request.sse.triggerEvent('done', {}, {}, { onEvent: function () { throw new Error('监听失败'); }, onDone: function () { calls.push('local'); } });
    return JSON.stringify(calls) === '["local","global","done"]' && logs.length === 1 && logs[0].indexOf('监听失败') >= 0;
  } },
  { remark: '非函数回调和缺少本次请求回调均可安全跳过', test: function () {
    var calls = 0;
    translate.request.sse.onEvent = null;
    translate.request.sse.onItem = function () { calls++; };
    translate.request.sse.triggerEvent('item', {}, {}, { onEvent: 'invalid', onItem: true });
    translate.request.sse.triggerEvent('item', {}, {});
    return calls === 2;
  } }
]);
