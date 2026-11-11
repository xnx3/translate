require('../helpers/module')(__filename, [
  { remark: '未传请求头时添加当前页面地址', test: function () {
    translate.service.name = 'translate.service';
    translate.request.appendHeaders = {};
    const result = translate.request.buildHeaders();
    return Object.keys(result).length === 1 && result.currentpage === location.href;
  } },
  { remark: 'null 请求头也能构造当前页面地址', test: function () {
    translate.service.name = 'translate.service';
    return translate.request.buildHeaders(null).currentpage === location.href;
  } },
  { remark: '请求头与全局追加头合并且不修改输入', test: function () {
    translate.service.name = 'translate.service';
    translate.request.appendHeaders = { 'x-extra': 'extra' };
    const input = { 'x-local': 'local' }, result = translate.request.buildHeaders(input);
    return result['x-local'] === 'local' && result['x-extra'] === 'extra' && result.currentpage === location.href && !('currentpage' in input) && !('x-extra' in input);
  } },
  { remark: '同名追加头覆盖请求自己的值', test: function () {
    translate.request.appendHeaders = { Authorization: 'global' };
    return translate.request.buildHeaders({ Authorization: 'local' }).Authorization === 'global';
  } },
  { remark: '继承属性不会成为请求头', test: function () {
    const input = Object.assign(Object.create({ inherited: 'bad' }), { own: 'ok' });
    translate.request.appendHeaders = Object.assign(Object.create({ extraInherited: 'bad' }), { extraOwn: 'ok' });
    const result = translate.request.buildHeaders(input);
    return result.own === 'ok' && result.extraOwn === 'ok' && !('inherited' in result) && !('extraInherited' in result);
  } },
  { remark: 'edge 模式不自动追加 currentpage', test: function () {
    translate.service.name = 'client.edge';
    translate.request.appendHeaders = {};
    const result = translate.request.buildHeaders({ Accept: 'application/json' });
    return result.Accept === 'application/json' && !('currentpage' in result);
  } },
  { remark: '普通模式中的 currentpage 始终使用真实页面地址', test: function () {
    translate.service.name = 'translate.service';
    translate.request.appendHeaders = { currentpage: 'incorrect' };
    return translate.request.buildHeaders({ currentpage: 'also incorrect' }).currentpage === location.href;
  } }
]);
