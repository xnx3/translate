'use strict';

const { test, expect } = require('../helpers/audit');

test('[F02] 无需翻译的根数组保留原有 JSON 类型', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const body = JSON.stringify(['one', 'two']);
    return JSON.parse(await translate.network.RequestHandler.handleJson(body, { params: [] }));
  });
  expect(actual).toEqual(['one', 'two']);
});

test('[F03] 翻译传输失败后拦截器能结束等待', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    translate.language.setLocal('chinese_simplified');
    translate.storage.set('to', 'english');
    translate.to = 'english';
    let attempts = 0;
    translate.request.translateText = (data, success, failure) => {
      attempts++;
      if (failure) failure({ status: 503 });
    };
    const outcome = await Promise.race([
      translate.network._translateText('Hello').then(() => 'settled', () => 'settled'),
      new Promise(resolve => setTimeout(() => resolve('pending'), 80))
    ]);
    return [attempts, outcome];
  });
  expect(actual).toEqual([1, 'settled']);
});

test('[F04] 译文中的百分号保持普通字符串语义', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    translate.network._translateText = async () => ({ result: 1, text: ['20% off'] });
    const url = await translate.network.RequestHandler.handleGet(location.origin + '/offers?q=promotion', { params: ['q'] });
    return new URL(url).searchParams.get('q');
  });
  expect(actual).toEqual('20% off');
});

test('[F05] 相对业务地址服从页面 base URL', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const base = document.createElement('base'); base.href = '/shop/'; document.head.prepend(base);
    translate.network._translateText = async () => ({ result: 1, text: ['neu'] });
    const url = await translate.network.RequestHandler.handleGet('search?q=alt', { params: ['q'] });
    return new URL(url, document.baseURI).pathname;
  });
  expect(actual).toEqual('/shop/search');
});

test('[F06] 多选查询参数翻译后仍保留每个值及顺序', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    translate.network._translateText = async word => ({ result: 1, text: [word.toUpperCase()] });
    const url = await translate.network.RequestHandler.handleGet(location.origin + '/filters?tag=red&tag=blue', { params: ['tag'] });
    return new URL(url).searchParams.getAll('tag');
  });
  expect(actual).toEqual(['RED', 'BLUE']);
});

test('[F07] 匹配业务规则的二进制正文按原字节转发', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    translate.network.rules = [{ url: /sample/, methods: ['POST'], params: ['q'] }];
    translate.network.fetch.originalFetch = async request => new Response(await request.arrayBuffer());
    const response = await translate.network.fetch.hookFetch(location.origin + '/sample', {
      method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: new Uint8Array([0, 192, 255, 65])
    });
    return [...new Uint8Array(await response.arrayBuffer())];
  });
  expect(actual).toEqual([0, 192, 255, 65]);
});

test('[F09] 等待译文时复用 XHR 不会再次发送旧请求', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const net = translate.network;
    const xhr = new XMLHttpRequest();
    let release;
    net.RequestHandler.handleGet = () => new Promise(resolve => { release = resolve; });
    net.rules = [{ url: /first/, methods: ['GET'], params: ['q'] }];
    const sent = [];
    let url;
    net.originalOpen = (method, current) => { url = new URL(current, document.baseURI).pathname; };
    net.originalSend = () => sent.push(url);
    net.hookOpen.call(xhr, 'GET', '/first?q=old', true); net.hookSend.call(xhr);
    net.hookOpen.call(xhr, 'GET', '/latest', true); net.hookSend.call(xhr);
    release('/first?q=translated');
    await new Promise(resolve => setTimeout(resolve, 0));
    return sent;
  });
  expect(actual).toEqual(['/latest']);
});

test('[F10] 重新打开 XHR 后保留同名请求头的所有值', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const net = translate.network, xhr = new XMLHttpRequest();
    let applied = new Headers();
    net.rules = [{ url: /search/, methods: ['GET'], params: ['q'] }];
    net.originalOpen = () => { applied = new Headers(); };
    net.setRequestHeaderOriginal = (name, value) => applied.append(name, value);
    net.RequestHandler.handleGet = async () => '/search?q=translated';
    net.hookOpen.call(xhr, 'GET', '/search?q=old', true);
    net.setRequestHeader.call(xhr, 'X-Item', 'one'); net.setRequestHeader.call(xhr, 'X-Item', 'two');
    return await new Promise(resolve => {
      net.originalSend = () => resolve(applied.get('X-Item'));
      net.hookSend.call(xhr);
    });
  });
  expect(actual).toEqual('one, two');
});

test('[F11] 超过两千字符的文本请求保留对选中字段的翻译', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const net = translate.network;
    net.rules = [{ url: /sample/, methods: ['POST'], params: ['q'] }];
    net.RequestHandler.handleJson = async body => JSON.stringify({ ...JSON.parse(body), q: 'new' });
    net.fetch.originalFetch = async request => new Response(await request.text());
    const body = JSON.stringify({ q: 'old', note: 'a'.repeat(2000) });
    const response = await net.fetch.hookFetch(location.origin + '/sample', { method: 'POST', body, headers: { 'Content-Type': 'application/json' } });
    const data = await response.json();
    return [data.q, data.note.length];
  });
  expect(actual).toEqual(['new', 2000]);
});

test('[F12] 启用 fetch 拦截后仍保留先安装的业务包装器', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    let calls = 0;
    window.fetch = async () => { calls++; return new Response('wrapped'); };
    translate.network.rules = [];
    translate.network.fetch.use();
    const response = await window.fetch(location.origin + '/health');
    return [calls, await response.text()];
  });
  expect(actual).toEqual([1, 'wrapped']);
});

test('[F13] 本库发出的翻译请求不交给业务参数翻译器', async ({ page }) => {
  await page.route('**/translate.json*', route => route.fulfill({
    json: { result: 1, from: 'english', to: 'deutsch', text: ['Hallo'] }
  }));
  const calls = await page.evaluate(async () => {
    const net = translate.network;
    const translatedByBusinessRules = [];
    net.rules = [{ url: /translate\.json/, methods: ['POST'], params: ['text'] }];
    // 只记录边界调用并原样透传，不请求二次翻译。
    net._translateText = async value => {
      translatedByBusinessRules.push(value);
      return { result: 1, text: [value] };
    };
    net.use();
    translate.request.sse.use = false;
    translate.request.getUrl = path => new URL(path, location.href).href;
    await new Promise((resolve, reject) => {
      translate.request.post(translate.request.api.translate, {
        from: 'english', to: 'deutsch', text: encodeURIComponent(JSON.stringify(['Hello']))
      }, resolve, () => reject(Error('本地翻译 fixture 请求失败')));
    });
    return translatedByBusinessRules.length;
  });
  expect(calls).toBe(0);
});

test('[F14] 重复隐藏后显示可一次清除该标识的样式', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const api = translate.visual.hideText;
    api.hide('panel'); api.hide('panel'); api.show('panel');
    return [document.querySelectorAll('style#translatejs-text-hidden-panel').length, document.documentElement.classList.contains('translatejs-text-hidden-panel')];
  });
  expect(actual).toEqual([0, false]);
});

test('[F15] 显示文字时保留页面自身同名节点', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const host = document.createElement('meta'); host.id = 'translatejs-text-hidden-sample'; document.head.append(host);
    translate.visual.hideText.hide('sample');
    translate.visual.hideText.show('sample');
    return [host.isConnected, document.querySelectorAll('style#translatejs-text-hidden-sample').length];
  });
  expect(actual).toEqual([true, 0]);
});

test('[F16] 已就绪页面调用 quickUse 会启动首次执行', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    let count = 0; translate.execute = () => { count++; };
    translate.quickUse();
    await new Promise(resolve => setTimeout(resolve, 10));
    return count > 0;
  });
  expect(actual).toEqual(true);
});

test('[F17] 决定首屏显隐前已使 URL 语言配置生效', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    let configured = false, enabledAtHide = false;
    translate.language.setUrlParamControl = () => { configured = true; };
    translate.visual.webPageLoadTranslateBeforeHiddenText = () => { enabledAtHide = configured && translate.language.translateLocal; };
    translate.quickUse();
    return enabledAtHide;
  });
  expect(actual).toEqual(true);
});

test('[F18] 初始化历史映射时使用当前语种的术语', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    translate.language.setLocal('english'); translate.to = 'deutsch';
    translate.nomenclature.data = { english: { deutsch: { File: 'Datei' }, french: { File: 'Fichier' } } };
    translate.selectLanguageTag.show = false;
    translate.execute([]);
    return translate.history.translateText.originalMap.get('File');
  });
  expect(actual).toEqual('Datei');
});

test('[F20] 已加载调试模块时每次打开都显示对话框', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    let shows = 0;
    translate.debug.data = {};
    translate.debug.showUIDialog = () => { shows++; };
    translate.debug.use(); translate.debug.use();
    return shows;
  });
  expect(actual).toEqual(2);
});

test('[F21] 初始化依赖恢复后可正常重试', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    delete translate.init_execute;
    const initMessages = translate.postMessage.init.bind(translate.postMessage);
    let attempts = 0;
    translate.postMessage.init = () => {
      attempts++;
      if (attempts === 1) throw Error('temporarily unavailable');
      return initMessages();
    };
    try { translate.init(); } catch { /* 模拟宿主第一次初始化未就绪。 */ }
    translate.init();
    return attempts;
  });
  expect(actual).toEqual(2);
});

test('[F22] 逐行提取矩形只需线性读取原始 DOMRectList', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const text = document.createTextNode('text'); document.body.append(text);
    let reads = 0;
    const values = Array.from({length: 4}, (_, i) => new DOMRect(0, i * 20, 10, 15));
    const rects = new Proxy(values, { get(target, key, receiver) {
      if (typeof key === 'string' && /^\d+$/.test(key)) reads++;
      return Reflect.get(target, key, receiver);
    } });
    const getRects = Range.prototype.getClientRects;
    try {
      Range.prototype.getClientRects = () => rects;
      const result = translate.visual.getRects([text])[0];
      return [result.map(item => item.lineIndex), reads <= values.length * 2];
    } finally { Range.prototype.getClientRects = getRects; }
  });
  expect(actual).toEqual([[0, 1, 2, 3], true]);
});

test('[F23] 同一组矩形的视觉顺序不随输入排列而改变', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const rects = [{ top: 0, left: 20 }, { top: 4, left: 10 }, { top: 8, left: 0 }];
    const sort = indexes => translate.visual.coordinateSort(indexes.map(i => rects[i])).map(rect => rect.top).join(',');
    const orders = [[0,1,2], [1,2,0], [2,0,1], [0,2,1], [1,0,2], [2,1,0]];
    return new Set(orders.map(sort)).size;
  });
  expect(actual).toEqual(1);
});

test('[F24] 重叠矩形不会遮掉后面的真实贴边邻居', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const a = new DOMRect(0,0,10,10), overlap = new DOMRect(5,0,2,10), b = new DOMRect(10,0,7,10);
    const pairs = translate.visual.afterAdjacent([a, overlap, b]);
    return pairs.some(pair => pair.before === a && pair.after === b);
  });
  expect(actual).toEqual(true);
});

test('[F25] 尚未登记的页面文本不会使间隔调整中断', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    translate.to = 'english';
    const part = document.createElement('span');
    const a = document.createTextNode('One'), b = document.createTextNode('two');
    part.append(a, b); document.body.append(part);
    translate.visual.adjustTranslationSpaces([a, b]);
    return [a.isConnected, b.isConnected, b.data];
  });
  expect(actual).toEqual([true, true, 'two']);
});
