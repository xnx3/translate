'use strict';

const { test, expect } = require('../helpers/audit');

// Only the server boundary is replaced. Cache, batching and callback delivery are real.
async function installEchoService(page) {
  await page.evaluate(() => {
    window.translationBatches = [];
    translate.request.post = (path, data, success) => {
      const texts = JSON.parse(decodeURIComponent(data.text));
      translationBatches.push(texts);
      success({ result: 1, text: texts.map(value => data.from + '/' + value) }, data);
    };
  });
}

test('[D01] Edge 分片乱序完成后整批只回调一次并可从缓存重读', async ({ page }) => {
  const actual = await page.evaluate(() => {
    const texts = Array.from({ length: 901 }, (_, index) => 'line-' + index);
    const pending = [], results = [];
    translate.service.use('client.edge');
    translate.request.send = (url, body, metadata, callback) => {
      const items = JSON.parse(body);
      pending.push(() => callback(items.map(value => ({ translations: [{ text: 'T/' + value }] }))));
    };
    const run = () => translate.request.translateText({ from: 'english', to: 'french', texts }, data => {
      results.push(data.text.slice());
    });
    run();
    const firstBatchCount = pending.length;
    pending.reverse().forEach(finish => finish());
    run();
    const expected = texts.map(text => 'T/' + text);
    return { firstBatchCount, sent: pending.length, matches: results.map(row =>
      row.length === expected.length && row.every((value, index) => value === expected[index])) };
  });
  expect(actual).toEqual({ firstBatchCount: 2, sent: 2, matches: [true, true] });
});

test('[D02] 同形异义词按源语种隔离缓存', async ({ page }) => {
  await installEchoService(page);
  const actual = await page.evaluate(() => {
    const values = [];
    for (const from of ['deutsch', 'english', 'deutsch']) {
      translate.request.translateText({ from, to: 'french', texts: 'Gift' }, result => values.push(result.text[0]));
    }
    return { values, requests: translationBatches.length };
  });
  expect(actual).toEqual({ values: ['deutsch/Gift', 'english/Gift', 'deutsch/Gift'], requests: 2 });
});

test('[D03] 不同原文在哈希相同时仍分别保存和读取译文', async ({ page }) => {
  await installEchoService(page);
  const actual = await page.evaluate(() => {
    const result = [];
    for (const texts of ['Aa', 'BB', 'Aa', 'BB']) {
      translate.request.translateText({ from: 'english', to: 'french', texts }, data => result.push(data.text[0]));
    }
    return result;
  });
  expect(actual).toEqual(['english/Aa', 'english/BB', 'english/Aa', 'english/BB']);
});

test('[D04] 切换服务后解析到新服务配置的主机', async ({ page }) => {
  const correct = await page.evaluate(() => {
    translate.request.speedDetectionControl.getHost();
    translate.service.use('giteeAI');
    return translate.request.api.host.some(host => translate.request.getUrl('translate.json').startsWith(host));
  });
  expect(correct).toBe(true);
});

test('[D07] 同步 XHR 在 send 返回前交付已完成的响应', async ({ page }) => {
  const response = await page.evaluate(() => {
    const calls = [];
    translate.request.send(location.origin + '/health', '', {}, text => calls.push(text),
      'GET', false, {}, () => calls.push('failed'), false);
    return calls;
  });
  expect(response).toHaveLength(1);
  expect(response[0]).not.toBe('failed');
});

test('[D08] 业务失败结果通过一次终态通知交付调用方', async ({ page }) => {
  const calls = await page.evaluate(() => {
    translate.request.post = (path, data, complete) => complete({ result: 0, info: 'offline' }, data);
    const notifications = [];
    const onEnd = data => notifications.push(data.info);
    translate.request.translateText('sample', onEnd, onEnd);
    return notifications;
  });
  expect(calls).toEqual(['offline']);
});

test('[D09] 缺失或非法的 texts 不抛出内部异常也不报告翻译成功', async ({ page }) => {
  const actual = await page.evaluate(() => {
    let requests = 0, successes = 0;
    translate.request.post = () => { requests++; };
    for (const input of [{}, { texts: null }, { texts: {} }]) {
      translate.request.translateText(input, value => { if (value.result === 1) successes++; }, () => {});
    }
    return { requests, successes };
  });
  expect(actual).toEqual({ requests: 0, successes: 0 });
});

test('[D11] 上一代主机测速回调不能改写新一代队列', async ({ page }) => {
  const remaining = await page.evaluate(() => {
    const requests = [];
    translate.request.api.connectTest = 'ping';
    translate.request.send = (url, data, meta, success, method, async, headers, failure) => {
      requests.push({ url, success, failure });
    };
    const old = location.origin + '/old/', current = location.origin + '/new/';
    translate.request.setHost([old]);
    translate.request.setHost([current]);
    requests[1].success({ info: current });
    requests[0].failure({ requestURL: requests[0].url });
    return translate.request.speedDetectionControl.hostQueue.map(entry => new URL(entry.host).pathname);
  });
  expect(remaining).toEqual(['/new/']);
});

test('[D12] 部分企业节点仍在测速时不会判定全部失效', async ({ page }) => {
  const state = await page.evaluate(() => {
    const requests = [];
    const hosts = ['/a/', '/b/'].map(path => location.origin + path);
    translate.enterprise.isUse = true;
    translate.request.api.host = hosts;
    translate.request.api.connectTest = 'ping';
    translate.request.send = (url, data, meta, success, method, async, headers, failure) => {
      requests.push({ success, failure, url });
    };
    translate.request.speedDetectionControl.checkResponseSpeed();
    requests[0].failure({ requestURL: requests[0].url });
    translate.enterprise.automaticAdaptationService();
    const partial = translate.service.name;
    requests[1].success({ info: hosts[1] });
    translate.enterprise.automaticAdaptationService();
    return [partial, translate.service.name];
  });
  expect(state).toEqual(['translate.service', 'translate.service']);
});

test('[D13] 过期损坏的缓存队列回退到当前配置的主机', async ({ page }) => {
  const valid = await page.evaluate(() => {
    const control = translate.request.speedDetectionControl;
    return ['not-json', '[]'].map(value => {
      control.hostQueue = [];
      translate.storage.set('speedDetectionControl_hostQueue', value);
      return translate.request.api.host.includes(control.getHost());
    });
  });
  expect(valid).toEqual([true, true]);
});

test('[D14] 附加表单键值中的保留字符往返无损', async ({ page }) => {
  const actual = await page.evaluate(() => {
    translate.request.appendParams = { 'product code': 'A&B+C=3' };
    return new URLSearchParams(translate.request.buildPostParams({})).get('product code');
  });
  expect(actual).toBe('A&B+C=3');
});

test('[D15] 默认页面标识剔除仅对页面有意义的查询与片段', async ({ page }) => {
  const fields = await page.evaluate(() => {
    history.replaceState(null, '', '/catalog?layout=wide#section');
    const header = translate.request.buildHeaders({}).currentpage;
    if (!header) return ['', ''];
    const pageIdentifier = new URL(header, location.origin);
    return [pageIdentifier.search, pageIdentifier.hash];
  });
  expect(fields).toEqual(['', '']);
});

test('[D16] 普通失败诊断不打印请求字段的完整值', async ({ page }) => {
  await page.route('**/audit-response-failure', route => route.fulfill({ status: 503, body: '' }));
  const log = await page.evaluate(async () => {
    const messages = [];
    translate.log = message => messages.push(String(message));
    translate.request.api.connectTest = 'other-endpoint';
    await new Promise(resolve => translate.request.send(location.origin + '/audit-response-failure',
      { text: 'ordinary-field-value' }, {}, () => {}, 'POST', true, {}, resolve, true));
    return messages.join('\n');
  });
  expect(log).not.toContain('ordinary-field-value');
});

test('[D18] 错型的 text 响应不能切成字符并缓存为整句译文', async ({ page }) => {
  const actual = await page.evaluate(() => {
    const options = { from: 'english', to: 'french', texts: ['first', 'second', 'third'] };
    const notifications = [];
    translate.request.post = (path, data, complete) => complete({ result: 1, text: 'abc' }, data);
    translate.request.translateText(options, data => notifications.push(data.result === 1 ? 'success' : 'failure'),
      () => notifications.push('failure'));
    let reads = 0;
    translate.request.post = () => { reads++; };
    translate.request.translateText(options, () => {});
    return { notifications, reads };
  });
  expect(actual).toEqual({ notifications: ['failure'], reads: 1 });
});

test('[D19] 已有查询参数和版本参数分别保留', async ({ page }) => {
  const query = await page.evaluate(() => {
    const url = new URL(translate.request.getUrl('translate.json?region=eu'));
    return [url.searchParams.get('region'), url.searchParams.get('v') === translate.version];
  });
  expect(query).toEqual(['eu', true]);
});

test('[D20] GET 的查询数据到达实际请求 URL', async ({ page }) => {
  let query;
  await page.route('**/audit-query*', route => {
    query = new URL(route.request().url()).searchParams.get('edition');
    return route.fulfill({ status: 200, body: 'ok' });
  });
  await page.evaluate(() => new Promise(resolve => {
    translate.request.send(location.origin + '/audit-query', { edition: 'paperback' }, {},
      resolve, 'GET', true, {}, resolve, false);
  }));
  expect(query).toBe('paperback');
});

test('[D21] XHR 响应观察器抛错仍交付业务回调', async ({ page }) => {
  const result = await page.evaluate(() => {
    const calls = [];
    window.XMLHttpRequest = class {
      open() {}
      setRequestHeader() {}
      send() {}
    };
    translate.request.response = () => { throw new Error('observer failed'); };
    const xhr = translate.request.send(location.origin + '/health', '', {}, text => calls.push(text),
      'GET', true, {}, () => {}, false);
    Object.assign(xhr, { readyState: 4, status: 200, responseText: 'ok' });
    xhr.onreadystatechange();
    return calls;
  });
  expect(result).toEqual(['ok']);
});

test('[D22] 收到明确限流响应只报告原状态且不重复提交', async ({ page }) => {
  const events = await page.evaluate(() => {
    window.fetch = async () => new Response('', { status: 429 });
    return new Promise(resolve => {
      translate.request.sse.post('translate.json', {}, () => resolve('success'),
        state => resolve(state.status), () => resolve('fallback'));
    });
  });
  expect(events).toBe(429);
});

test('[D23] 未回应的异步 XHR 具有有限的默认超时', async ({ page }) => {
  const timeout = await page.evaluate(() => {
    window.XMLHttpRequest = class {
      timeout = 0;
      open() {}
      setRequestHeader() {}
      send() {}
    };
    const xhr = translate.request.send(location.origin + '/health', '', {}, () => {},
      'POST', true, {}, () => {}, false);
    return xhr.timeout;
  });
  expect(timeout).toBeGreaterThan(0);
});

test('[D24] Edge 的内置语言列表不启动网络测速', async ({ page }) => {
  const actual = await page.evaluate(() => {
    translate.service.use('client.edge');
    translate.request.api.connectTest = 'ping';
    let probes = 0, languages = 0;
    translate.request.send = () => { probes++; };
    translate.request.post(translate.request.api.language, {}, data => { languages = data.list.length; });
    return { probes, filled: languages > 0 };
  });
  expect(actual).toEqual({ probes: 0, filled: true });
});

async function observedResourceCount(page, pathname, status) {
  return page.evaluate(({ pathname, status }) => {
    let publish, scheduled = 0;
    window.PerformanceObserver = class {
      static supportedEntryTypes = ['resource'];
      constructor(callback) { publish = callback; }
      observe() {}
      disconnect() {}
    };
    const listener = translate.request.listener;
    listener.start();
    listener.addExecute = () => { scheduled++; };
    listener.addListener();
    try {
      publish({ getEntries: () => [{
        initiatorType: 'fetch', name: new URL(pathname, location.origin).href, responseStatus: status
      }] });
      return scheduled;
    } finally {
      listener.reset();
    }
  }, { pathname, status });
}

test('[D25] 同源业务 AJAX 完成会调度翻译', async ({ page }) => {
  expect(await observedResourceCount(page, '/stock', 200)).toBe(1);
});

test('[D26] 自建服务专用头只在本服务生效', async ({ page }) => {
  const scoped = await page.evaluate(() => {
    const built = [];
    window.XMLHttpRequest = class {
      fields = new Headers();
      open() {}
      setRequestHeader(name, value) { this.fields.append(name, value); }
      send() { built.push(this.fields.has('X-Local-Edition')); }
    };
    translate.request.appendHeaders = { 'X-Local-Edition': 'paperback' };
    translate.request.send(location.origin + '/books', {}, {}, () => {}, 'POST', true, {}, () => {}, false);
    translate.service.use('client.edge');
    translate.service.edge.api.translate = 'http://localhost:8124/adapter';
    translate.service.edge.translate('translate.json', {
      from: 'english', to: 'french', text: encodeURIComponent(JSON.stringify(['book']))
    }, () => {});
    return built;
  });
  expect(scoped).toEqual([true, false]);
});

test('[D27] Edge 语种菜单不含遗留的 Name 占位符', async ({ page }) => {
  const placeholders = await page.evaluate(() => {
    translate.service.use('client.edge');
    let languages;
    translate.request.post(translate.request.api.language, {}, data => { languages = data.list; });
    return languages.filter(item => item.name.endsWith('Name')).map(item => item.id);
  });
  expect(placeholders).toEqual([]);
});

test('[D28] IndexedDB 源码示例使用可调用的 API 大小写', async ({ page }) => {
  const fs = require('node:fs');
  const path = require('node:path');
  const source = fs.readFileSync(path.join(__dirname, '../../translate.js/translate.js'), 'utf8');
  const exampleMethods = Array.from(
    source.matchAll(/await\s+translate\.storage\.(indexeddb)\.(set|get)\(/gi),
    match => [match[1], match[2]]
  );
  expect(exampleMethods.map(([, method]) => method)).toEqual(expect.arrayContaining(['set', 'get']));
  const usable = await page.evaluate(methods =>
    methods.every(([owner, method]) => typeof translate.storage[owner]?.[method] === 'function'), exampleMethods);
  expect(usable).toBe(true);
});

test('[D29] 首次并发读写共享 IndexedDB 连接', async ({ page }) => {
  const opens = await page.evaluate(async () => {
    const originalOpen = indexedDB.open.bind(indexedDB);
    let opens = 0;
    indexedDB.open = (...args) => { opens++; return originalOpen(...args); };
    const db = translate.storage.IndexedDB;
    await Promise.all([db.get('inventory'), db.set('price', '7'), db.get('title')]);
    return opens;
  });
  expect(opens).toBe(1);
});

test('[D29] 同源其他连接升级数据库时旧连接及时释放', async ({ page }) => {
  const blocked = await page.evaluate(async () => {
    const storage = translate.storage.IndexedDB;
    await storage.initDB();
    const current = storage.db;
    return new Promise((resolve, reject) => {
      let blocked = false;
      const upgrade = indexedDB.open(current.name, current.version + 1);
      upgrade.onblocked = () => {
        blocked = true;
        current.close(); // Unblock the real upgrade so the test always finishes.
      };
      upgrade.onerror = () => reject(upgrade.error);
      upgrade.onsuccess = () => {
        upgrade.result.close();
        resolve(blocked);
      };
    });
  });
  expect(blocked).toBe(false);
});

test('[D30] 表单构造不改变同一对象下一次发送的参数', async ({ page }) => {
  const actual = await page.evaluate(() => {
    const request = { text: 'book' };
    translate.request.appendParams = { theme: 'wide' };
    translate.request.buildPostParams(request);
    translate.request.appendParams = {};
    const params = new URLSearchParams(translate.request.buildPostParams(request));
    return { keys: Object.keys(request), theme: params.get('theme') };
  });
  expect(actual).toEqual({ keys: ['text'], theme: null });
});

test('[D31] 同批重复原文只提交一次且保留所有输出位置', async ({ page }) => {
  await installEchoService(page);
  const actual = await page.evaluate(() => {
    let values;
    translate.request.translateText({ from: 'english', to: 'french', texts: ['book', 'menu', 'book'] },
      data => { values = data.text; });
    return { values, batches: translationBatches };
  });
  expect(actual).toEqual({ values: ['english/book', 'english/menu', 'english/book'], batches: [['book', 'menu']] });
});

test('[D32] 有效空译文第二次可从缓存读取', async ({ page }) => {
  const actual = await page.evaluate(() => {
    let count = 0;
    const values = [];
    translate.request.post = (path, data, success) => { count++; success({ result: 1, text: [''] }, data); };
    for (let i = 0; i < 2; i++) {
      translate.request.translateText({ from: 'english', to: 'french', texts: 'blank' }, data => values.push(data.text[0]));
    }
    return { count, values };
  });
  expect(actual).toEqual({ count: 1, values: ['', ''] });
});

test('[D33] 不同大小写的头按同一个 HTTP 字段覆盖', async ({ page }) => {
  const value = await page.evaluate(() => {
    translate.request.appendHeaders = { 'content-type': 'text/plain' };
    return new Headers(translate.request.buildHeaders({ 'Content-Type': 'application/json' })).get('content-type');
  });
  expect(value).toBe('text/plain');
});

test('[D34] 无原型的普通参数字典可按自有键编码', async ({ page }) => {
  const value = await page.evaluate(() => {
    translate.request.appendParams = Object.assign(Object.create(null), { edition: 'print' });
    return new URLSearchParams(translate.request.buildPostParams({})).get('edition');
  });
  expect(value).toBe('print');
});

test('[D35] 已知失败的业务资源不会误触发翻译调度', async ({ page }) => {
  await page.evaluate(() => { translate.request.api.host = [location.origin + '/translation/']; });
  expect(await observedResourceCount(page, '/stock', 404)).toBe(0);
});
