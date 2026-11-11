require('../helpers/module')(__filename, [
  { remark: '默认响应扩展点不修改成功 XHR 的字段', test: function () {
    const xhr = { status: 200, readyState: 4, responseText: '{"result":1}', data: { a: 1 } };
    const before = JSON.stringify(xhr);
    return translate.request.response(xhr) === undefined && JSON.stringify(xhr) === before;
  } },
  { remark: '默认响应扩展点不改写异常响应', test: function () {
    const xhr = { status: 500, readyState: 4, responseText: 'server error' };
    return translate.request.response(xhr) === undefined && xhr.status === 500 && xhr.responseText === 'server error';
  } },
  { remark: '默认扩展点兼容 SSE 的最小响应对象', test: function () {
    const xhr = { sse: true, status: 200, readyState: 4, data: {}, responseText: '{}' };
    return translate.request.response(xhr) === undefined && xhr.sse === true && xhr.status === 200;
  } }
]);
