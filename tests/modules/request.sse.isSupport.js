require('../helpers/module')(__filename, [
  { remark: '具备 fetch 和可读取 Response 流的浏览器支持 SSE', args: [], expected: true },
  { remark: '缺少 fetch 时报告不支持', test: function () {
    window.fetch = undefined;
    return translate.request.sse.isSupport() === false;
  } },
  { remark: '缺少 TextDecoder 时报告不支持', test: function () {
    window.TextDecoder = undefined;
    return translate.request.sse.isSupport() === false;
  } },
  { remark: '缺少 Response 时报告不支持', test: function () {
    window.Response = undefined;
    return translate.request.sse.isSupport() === false;
  } },
  { remark: 'Response 构造失败时安全返回不支持', test: function () {
    window.Response = function () { throw new Error('测试浏览器能力失败'); };
    return translate.request.sse.isSupport() === false;
  } },
  { remark: 'Response 没有可读取的 body 时报告不支持', test: function () {
    window.Response = function () { this.body = null; };
    return translate.request.sse.isSupport() === false;
  } },
  { remark: 'Response body 没有 getReader 时报告不支持', test: function () {
    window.Response = function () { this.body = {}; };
    return translate.request.sse.isSupport() === false;
  } }
]);
