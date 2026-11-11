require('../helpers/module')(__filename, [
  { remark: '原始字符串请求体保持不变', args: ['{"text":"hello"}'], expected: '{"text":"hello"}' },
  { remark: '空字符串请求体保持为空', args: [''], expected: '' },
  { remark: '对象请求包含业务值和浏览器默认语种', test: function () {
    const params = new URLSearchParams(translate.request.buildPostParams({ text: 'hello', count: 0, enabled: false, empty: '' }));
    return params.get('text') === 'hello' && params.get('count') === '0' && params.get('enabled') === 'false' && params.get('empty') === '' && params.get('browserDefaultLanguage') === translate.util.browserDefaultLanguage();
  } },
  { remark: '缺参时仍生成浏览器默认语种', test: function () {
    const params = new URLSearchParams(translate.request.buildPostParams());
    return params.get('browserDefaultLanguage') === translate.util.browserDefaultLanguage();
  } },
  { remark: 'null 数据仍生成浏览器默认语种', test: function () {
    const params = new URLSearchParams(translate.request.buildPostParams(null));
    return params.get('browserDefaultLanguage') === translate.util.browserDefaultLanguage();
  } },
  { remark: '全局追加参数覆盖对象中的同名业务参数', test: function () {
    translate.request.appendParams = { shared: 'global', extra: 'value' };
    const params = new URLSearchParams(translate.request.buildPostParams({ shared: 'local' }));
    return params.get('shared') === 'global' && params.get('extra') === 'value';
  } },
  { remark: '仅本次传输的参数最后覆盖全局追加参数', test: function () {
    translate.request.appendParams = { stream: 0 };
    const params = new URLSearchParams(translate.request.buildPostParams({ stream: 2 }, { stream: 1, special: 'yes' }));
    return params.get('stream') === '1' && params.get('special') === 'yes';
  } },
  { remark: '非空企业 key 自动加入表单参数', test: function () {
    translate.enterprise.key = 'test-key';
    return new URLSearchParams(translate.request.buildPostParams({ a: 1 })).get('key') === 'test-key';
  } },
  { remark: '空企业 key 不覆盖调用者的 key', test: function () {
    translate.enterprise.key = '';
    return new URLSearchParams(translate.request.buildPostParams({ key: 'local' })).get('key') === 'local';
  } },
  { remark: '对象和追加参数都只采纳自身属性', test: function () {
    const input = Object.assign(Object.create({ hidden: 'bad' }), { visible: 'ok' });
    translate.request.appendParams = Object.assign(Object.create({ appendHidden: 'bad' }), { appendVisible: 'ok' });
    const extra = Object.assign(Object.create({ extraHidden: 'bad' }), { extraVisible: 'ok' });
    const params = new URLSearchParams(translate.request.buildPostParams(input, extra));
    return params.get('visible') === 'ok' && params.get('appendVisible') === 'ok' && params.get('extraVisible') === 'ok' && !params.has('hidden') && !params.has('appendHidden') && !params.has('extraHidden');
  } },
  { remark: '字符串请求体不被对象公共参数改写', test: function () {
    translate.request.appendParams = { extra: 'value' };
    translate.enterprise.key = 'key';
    return translate.request.buildPostParams('raw=body', { stream: 1 }) === 'raw=body';
  } }
]);
