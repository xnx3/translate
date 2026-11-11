require('../helpers/module')(__filename, [
  { remark: '没有规则时返回 null', test: function () {
    translate.network.rules = [];
    return translate.network.getRuleMatch('https://example.com/search', 'GET') === null;
  } },
  { remark: 'URL 和方法都匹配时返回原规则对象', test: function () {
    const rule = { url: /\/search/, methods: ['GET'], params: ['q'] };
    translate.network.rules = [rule];
    return translate.network.getRuleMatch('https://example.com/search?q=x', 'GET') === rule;
  } },
  { remark: '请求方法忽略大小写', test: function () {
    const rule = { url: /\/search/, methods: ['GET', 'POST'], params: ['q'] };
    translate.network.rules = [rule];
    return translate.network.getRuleMatch('/search', 'post') === rule;
  } },
  { remark: 'URL 不匹配时不返回规则', test: function () {
    translate.network.rules = [{ url: /\/search/, methods: ['GET'], params: ['q'] }];
    return translate.network.getRuleMatch('/other', 'GET') === null;
  } },
  { remark: '方法不匹配时不返回规则', test: function () {
    translate.network.rules = [{ url: /\/search/, methods: ['GET'], params: ['q'] }];
    return translate.network.getRuleMatch('/search', 'POST') === null;
  } },
  { remark: '多个规则命中时使用第一个规则', test: function () {
    const first = { url: /search/, methods: ['GET'], params: ['first'] }, second = { url: /search/, methods: ['GET'], params: ['second'] };
    translate.network.rules = [first, second];
    return translate.network.getRuleMatch('/search', 'GET') === first;
  } },
  { remark: '缺少 URL 的规则被跳过但后续有效规则仍能命中', test: function () {
    const valid = { url: /search/, methods: ['GET'], params: ['q'] };
    translate.network.rules = [{ methods: ['GET'] }, { url: '', methods: ['GET'] }, valid];
    return translate.network.getRuleMatch('/search', 'GET') === valid;
  } }
]);
