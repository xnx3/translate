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
  } },
  { remark: '规则使用全局正则时连续请求相同地址仍稳定命中', test: function () {
    var rule = { url: /\/search/g, methods: ['GET'], params: ['q'] };
    translate.network.rules = [rule];
    var first = translate.network.getRuleMatch('/search', 'GET');
    var second = translate.network.getRuleMatch('/search', 'GET');
    return first === rule && second === rule;
  } },
  { remark: '全局正则连续请求不同的有效地址仍返回原规则', test: function () {
    const rule = { url: /\/search/g, methods: ['GET'], params: ['q'] };
    translate.network.rules = [rule];
    const first = translate.network.getRuleMatch('/search?q=first', 'GET');
    const second = translate.network.getRuleMatch('/search?q=second', 'GET');
    return first === rule && second === rule;
  } },
  { remark: '全局正则先请求不匹配地址再请求有效地址仍可命中', test: function () {
    const rule = { url: /\/search/g, methods: ['GET'], params: ['q'] };
    translate.network.rules = [rule];
    const unmatched = translate.network.getRuleMatch('/other', 'GET');
    const matched = translate.network.getRuleMatch('/search', 'GET');
    return unmatched === null && matched === rule;
  } },
  { remark: '全局正则命中但请求方法不符后正确方法仍可命中', test: function () {
    const rule = { url: /\/search/g, methods: ['GET'], params: ['q'] };
    translate.network.rules = [rule];
    const wrongMethod = translate.network.getRuleMatch('/search', 'POST');
    const correctMethod = translate.network.getRuleMatch('/search', 'GET');
    return wrongMethod === null && correctMethod === rule;
  } },
  { remark: '两规则共享全局正则时前一规则方法不符不影响后一规则', test: function () {
    // 两条规则有意引用同一正则，验证每条 URL 判断也独立于前一条的匹配位置。
    const url = /\/search/g;
    const first = { url: url, methods: ['POST'], params: ['first'] };
    const second = { url: url, methods: ['GET'], params: ['second'] };
    translate.network.rules = [first, second];
    return translate.network.getRuleMatch('/search', 'GET') === second;
  } },
  { remark: '多条全局正则规则均命中时连续调用仍优先返回第一条', test: function () {
    const first = { url: /search/g, methods: ['GET'], params: ['first'] };
    const second = { url: /search/g, methods: ['GET'], params: ['second'] };
    translate.network.rules = [first, second];
    const firstRequest = translate.network.getRuleMatch('/search', 'GET');
    const secondRequest = translate.network.getRuleMatch('/search', 'GET');
    return firstRequest === first && secondRequest === first;
  } },
  { remark: '粘连正则连续三次请求相同有效地址均返回原规则', test: function () {
    const rule = { url: /\/search/y, methods: ['GET'], params: ['q'] };
    translate.network.rules = [rule];
    const first = translate.network.getRuleMatch('/search', 'GET');
    const second = translate.network.getRuleMatch('/search', 'GET');
    const third = translate.network.getRuleMatch('/search', 'GET');
    return first === rule && second === rule && third === rule;
  } },
  { remark: '粘连正则仍只从地址开头匹配而不搜索后面的子串', test: function () {
    const rule = { url: /\/search/y, methods: ['GET'], params: ['q'] };
    translate.network.rules = [rule];
    const unmatched = translate.network.getRuleMatch('/prefix/search', 'GET');
    const matched = translate.network.getRuleMatch('/search', 'GET');
    return unmatched === null && matched === rule;
  } }
]);
