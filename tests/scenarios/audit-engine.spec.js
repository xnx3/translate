'use strict';

const { test, expect } = require('../helpers/audit');

// 仅替换远端翻译边界；扫描、分词、渲染、缓存及收尾均走真实实现。
test.beforeEach(async ({ page }) => {
  await page.evaluate(() => {
    translate.selectLanguageTag.show = false;
    translate.to = 'deutsch';
    translate.language.setLocal('english');
    const requests = [];
    const element = (tag, text = '') => {
      const node = document.createElement(tag);
      node.textContent = text;
      document.body.append(node);
      return node;
    };
    translate.request.post = (path, data, success, error) => {
      requests.push({ data, success, error, words: JSON.parse(decodeURIComponent(data.text)) });
    };
    window.engine = { requests, element };
  });
});

test('[B01] 业务失败后的同一节点可再次请求并显示译文', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const node = engine.element('p', 'Hello');
    translate.execute(node);
    const first = engine.requests[0];
    first.success({ result: 0, info: 'temporary' }, first.data);
    translate.execute(node);
    const retry = engine.requests[1];
    if (retry) retry.success({ result: 1, text: ['Hallo'] }, retry.data);
    return [engine.requests.length, node.textContent];
  });
  expect(actual).toEqual([2, 'Hallo']);
});

test('[B02] 回收与活动请求交错后可以继续处理页面', async ({ page }) => {
  await page.clock.install({ time: new Date('2025-01-01T00:00:00Z') });
  await page.evaluate(() => {
    const node = engine.element('p', 'Green');
    translate.execute(node);
  });
  await page.clock.setSystemTime(new Date('2025-01-01T00:05:00Z'));
  const actual = await page.evaluate(async () => {
    const request = engine.requests[0];
    translate.recycle();
    request.success({ result: 1, text: ['Grün'] }, request.data);
    await new Promise(resolve => setTimeout(resolve, 20));
    return translate.state;
  });
  expect(actual).toEqual(0);
});

test('[B03] 回收完成批次后释放已移出页面的请求节点', async ({ page }) => {
  await page.clock.install({ time: new Date('2025-01-01T00:00:00Z') });
  await page.evaluate(async () => {
    const node = engine.element('p', 'Hello');
    translate.execute(node);
    engine.completedBatch = Object.keys(translate.request.data)[0];
    engine.detachedText = node.firstChild;
    const request = engine.requests[0];
    request.success({ result: 1, text: ['Hallo'] }, request.data);
    await new Promise(resolve => setTimeout(resolve, 20));
    node.remove();
  });
  await page.clock.setSystemTime(new Date('2025-01-02T00:00:00Z'));
  const actual = await page.evaluate(() => {
    translate.recycle();
    const entries = Object.values(translate.request.data[engine.completedBatch]?.list || {});
    return entries.some(targets => Object.values(targets).some(record => record.nodes?.includes(engine.detachedText)));
  });
  expect(actual).toEqual(false);
});

test('[B04] 自动判断目标语种结束前不会发出无目标的翻译', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    translate.to = '';
    translate.storage.set('to', '');
    translate.autoDiscriminateLocalLanguage = true;
    translate.util.browserDefaultLanguage = () => '';
    translate.request.api.ip = '/language-by-ip';
    let finishDetection;
    const targets = [];
    translate.request.post = (path, data, success) => {
      if (path === '/language-by-ip') finishDetection = success;
      else if (data.text) targets.push(data.to);
    };
    translate.execute(engine.element('p', 'Hello'));
    return [typeof finishDetection, targets];
  });
  expect(actual).toEqual(['function', []]);
});

test('[B05] 忽略规则的可选捕获组没有命中时仍提交其余原文', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    translate.ignore.setTextRegexs([/foo(bar)?/]);
    translate.execute(engine.element('p', 'foo Hello'));
    return engine.requests.flatMap(request => request.words).map(text => text.trim());
  });
  expect(actual).toEqual(['Hello']);
});

test('[B06] 切换目标后上个请求的失败不能破坏当前批次', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    engine.element('p', 'Hello');
    translate.execute();
    const old = engine.requests[0];
    translate.changeLanguage('french');
    const latest = engine.requests.at(-1);
    old.error({ status: 503, data: old.data });
    latest.success({ result: 1, text: ['Bonjour'] }, latest.data);
    await new Promise(resolve => setTimeout(resolve, 20));
    return [translate.to, translate.state, document.querySelector('p').textContent];
  });
  expect(actual).toEqual(['french', 0, 'Bonjour']);
});

test('[B07] 保留包含完整原文的有效译文', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const node = engine.element('p', 'Bus');
    translate.execute(node);
    const request = engine.requests[0];
    request.success({ result: 1, text: ['Busse'] }, request.data);
    return node.textContent;
  });
  expect(actual).toEqual('Busse');
});

test('[B08] 不同原文具有相同哈希值时仍各自回填', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const nodes = [engine.element('p', 'Aa'), engine.element('p', 'BB')];
    translate.execute(nodes);
    for (const request of engine.requests) {
      const answers = { Aa: 'Rot', BB: 'Blau' };
      request.success({ result: 1, text: request.words.map(word => answers[word]) }, request.data);
    }
    return nodes.map(node => node.textContent);
  });
  expect(actual).toEqual(['Rot', 'Blau']);
});

test('[B09] 局部执行会扫描开放 ShadowRoot 内的实际显示文本', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const host = engine.element('div');
    const root = host.attachShadow({ mode: 'open' });
    const node = document.createElement('span');
    node.textContent = 'Hello'; root.append(node);
    translate.execute(host);
    return engine.requests.flatMap(request => request.words);
  });
  expect(actual).toEqual(['Hello']);
});

test('[B10] 同时完成的两个源语言请求只触发一次整批完成', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    let finished = 0;
    translate.lifecycle.execute.renderFinish.push(() => finished++);
    translate.execute([engine.element('p', 'Hello'), engine.element('p', '你好')]);
    for (const request of engine.requests) request.success({ result: 1, text: ['Hallo'] }, request.data);
    await new Promise(resolve => setTimeout(resolve, 20));
    return [engine.requests.length, finished, translate.executeNumber];
  });
  expect(actual).toEqual([2, 1, 1]);
});

test('[B11] 对象形式和兼容签名的网络前置回调都获得源语种', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    let objectFrom, legacyFrom;
    translate.lifecycle.execute.translateNetworkBefore.push(data => { objectFrom = data.from; });
    translate.lifecycle.execute.translateNetworkBefore.push(function (uuid, from, to, texts) { legacyFrom = from; });
    translate.execute(engine.element('p', 'Hello'));
    return [objectFrom, legacyFrom];
  });
  expect(actual).toEqual(['english', 'english']);
});

test('[B12] 直接传入单个 Text 节点仅翻译该文本', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const node = engine.element('p', 'Hello').firstChild;
    translate.execute(node);
    return engine.requests.flatMap(request => request.words);
  });
  expect(actual).toEqual(['Hello']);
});

test('[B13] 长集合的最后一个有效根也会被扫描', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const first = engine.element('p', 'Hello'), last = engine.element('p', 'Goodbye');
    const roots = Array(15001);
    roots[0] = first; roots[15000] = last;
    translate.execute(roots);
    return engine.requests.flatMap(request => request.words).sort();
  });
  expect(actual).toEqual(['Goodbye', 'Hello']);
});

test('[B14] 初次扫描包含无 src 的同源子窗口', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const frame = engine.element('iframe');
    let visited = false;
    translate.element.iframe.execute = item => { if (item === frame) visited = true; };
    translate.execute([frame]);
    return visited;
  });
  expect(actual).toEqual(true);
});

test('[B15] 启用子窗口翻译时已经就绪的同源文档也会被处理', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const frame = document.createElement('iframe');
    const loaded = new Promise(resolve => frame.addEventListener('load', resolve, { once: true }));
    frame.src = '/iframe-blank.html'; document.body.append(frame); await loaded;
    let inserted = 0;
    frame.contentDocument.documentElement.appendChild = node => { if (node.tagName === 'SCRIPT') inserted++; return node; };
    translate.element.iframe.use('/translate.js');
    translate.element.iframe.execute(frame);
    await new Promise(resolve => setTimeout(resolve, 15));
    return inserted;
  });
  expect(actual).toEqual(1);
});

test('[B17] 响应缺少一项时允许只重试未完成的节点', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const nodes = [engine.element('p', 'Red'), engine.element('p', 'Blue')];
    translate.execute(nodes);
    const first = engine.requests[0], missing = first.words[1];
    first.success({ result: 1, text: ['Farbe'] }, first.data);
    await new Promise(resolve => setTimeout(resolve, 20));
    translate.execute(nodes);
    return engine.requests.slice(1).some(request => request.words.includes(missing));
  });
  expect(actual).toEqual(true);
});

test('[B18] 后端提供语种别名不会把批次留在运行状态', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    translate.execute(engine.element('p', 'Hello'));
    const request = engine.requests[0];
    request.success({ result: 1, from: 'en', text: ['Hallo'] }, request.data);
    await new Promise(resolve => setTimeout(resolve, 20));
    return translate.state;
  });
  expect(actual).toEqual(0);
});

test('[B19] 缓存命中时按节点身份所做的比较应是线性的', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const nodes = Array.from({ length: 12 }, (_, index) => engine.element('p', 'Word' + String.fromCharCode(65 + index)));
    let comparisons = 0;
    for (const node of nodes) {
      const text = node.firstChild, original = text.isSameNode.bind(text);
      text.isSameNode = other => { comparisons++; return original(other); };
      translate.storage.set('hash_deutsch_' + translate.util.hash(text.data), 'Wort');
    }
    translate.execute(nodes);
    return nodes.every(node => node.textContent === 'Wort') && comparisons <= nodes.length * 4;
  });
  expect(actual).toEqual(true);
});

test('[B20] 相同按钮入队可保留全部目标且身份比较线性增长', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const nodes = Array.from({ length: 16 }, () => engine.element('button', 'Open'));
    let comparisons = 0;
    for (const node of nodes) {
      const text = node.firstChild, original = text.isSameNode.bind(text);
      text.isSameNode = other => { comparisons++; return original(other); };
    }
    translate.execute(nodes);
    const request = engine.requests[0];
    request.success({ result: 1, text: ['Öffnen'] }, request.data);
    return nodes.every(node => node.textContent === 'Öffnen') && comparisons <= 4 * nodes.length;
  });
  expect(actual).toEqual(true);
});

test('[B21] 显式读写 data 属性保留真实 Attr 节点', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const node = engine.element('span');
    node.setAttribute('data-label', 'One');
    const attr = node.getAttributeNode('data-label');
    const prev = translate.element.nodeAnalyse.get(node, 'data-label').text;
    translate.element.nodeAnalyse.set(node, 'One', 'Eins', 'data-label');
    return [prev, node.getAttribute('data-label'), attr === node.getAttributeNode('data-label')];
  });
  expect(actual).toEqual(['One', 'Eins', true]);
});

test('[B22] 显式配置的字符串 DOM 属性可收集并回写', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const node = engine.element('div');
    node.caption = 'Hello';
    translate.element.tagAttribute.div = { attribute: ['caption'] };
    translate.execute(node);
    for (const request of engine.requests) request.success({ result: 1, text: ['Hallo'] }, request.data);
    return [node.caption, node.hasAttribute('caption')];
  });
  expect(actual).toEqual(['Hallo', false]);
});

test('[B23] title 内带标签外观的文本仍然是可翻译文案', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const node = engine.element('span');
    node.title = 'Use <b> here';
    translate.whole.enableAll();
    translate.execute(node);
    return engine.requests.flatMap(request => request.words);
  });
  expect(actual).toEqual(['Use <b> here']);
});

test('[B24] 自定义整体翻译 class 对同一元素的 Attr 和文本一致', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const node = engine.element('span', 'Hello');
    node.className = 'whole'; node.title = 'World';
    translate.whole.class = ['whole'];
    return [translate.whole.isWhole(node.firstChild), translate.whole.isWhole(node.getAttributeNode('title'))];
  });
  expect(actual).toEqual([true, true]);
});

test('[B25] 用户条件回调异常后可启动下一轮扫描', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const node = engine.element('div'); node.setAttribute('data-label', 'Hello');
    translate.element.tagAttribute.div = { attribute: ['data-label'], condition() { throw Error('condition'); } };
    try { translate.execute(node); } catch { /* 允许调用方处理条件异常。 */ }
    delete translate.element.tagAttribute.div;
    translate.execute(engine.element('p', 'World'));
    return engine.requests.flatMap(request => request.words);
  });
  expect(actual).toEqual(['World']);
});

test('[B26] 空范围任务不会留下无法回收的批次', async ({ page }) => {
  await page.clock.install({ time: new Date('2025-01-01T00:00:00Z') });
  await page.evaluate(() => translate.execute([]));
  await page.clock.setSystemTime(new Date('2025-01-02T00:00:00Z'));
  const actual = await page.evaluate(() => {
    translate.recycle();
    return Object.keys(translate.nodeQueue);
  });
  expect(actual).toEqual([]);
});

test('[B28] 混合列表中的空值不影响后续有效节点的转换', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const node = engine.element('span');
    const elements = translate.element.nodeToElement([null, node.firstChild, node]);
    return elements.length === 1 && elements[0] === node;
  });
  expect(actual).toBe(true);
});

test('[B29] 未登记分组的普通批次完成后释放扫描快照中的正文引用', async ({ page }) => {
  const retained = await page.evaluate(async () => {
    const root = engine.element('section');
    root.innerHTML = '<p>Hello</p>';
    const text = root.querySelector('p').firstChild;
    translate.storage.set('hash_deutsch_' + translate.util.hash('Hello'), 'Hallo');
    translate.execute(root);
    if (text.nodeValue !== 'Hallo') throw Error('缓存渲染未完成');
    await new Promise(resolve => setTimeout(resolve, 20));
    return Object.values(translate.nodeQueue).some(batch => batch.scan?.snapshots?.has(text));
  });
  expect(retained).toBe(false);
});

test('[B30] 无 src 子窗口脚本处于加载中时重复扫描只注入一次', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const frame = engine.element('iframe'); let scripts = 0;
    frame.contentDocument.documentElement.appendChild = node => { if (node.tagName === 'SCRIPT') scripts++; return node; };
    translate.element.iframe.use('/translate.js');
    translate.element.iframe.execute(frame);
    translate.element.iframe.execute(frame);
    return scripts;
  });
  expect(actual).toEqual(1);
});

test('[B31] 来自同源子文档的真实 iframe 也能识别其来源', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const frame = engine.element('iframe');
    const inner = frame.contentDocument.createElement('iframe');
    frame.contentDocument.body.append(inner);
    return [!!inner.contentDocument, translate.element.iframe.isIframeSameOrigin(inner)];
  });
  expect(actual).toEqual([true, true]);
});

test('[B32] 行内标签之间可见的空格保留在分组上下文', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const node = engine.element('p'); node.innerHTML = '<b>New</b> <i>York</i>';
    translate.whole.context.use(); translate.whole.tag = ['p'];
    const groups = translate.whole.context.collectInlineTextGroups(node);
    return groups.map(group => group.texts.join(''));
  });
  expect(actual).toEqual(['New York']);
});

test('[B33] 属性忽略回调获得真实 Attr 后才决定入队', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const node = engine.element('div'); node.className = 'explicit-ignore'; node.dataset.label = 'Hello';
    translate.element.tagAttribute.div = { attribute: ['data-label'] };
    translate.ignore.class.push('explicit-ignore', (element, data) => data.attribute === 'data-label' && data.node.nodeType === Node.ATTRIBUTE_NODE);
    translate.execute(node);
    return engine.requests.length;
  });
  expect(actual).toEqual(0);
});
