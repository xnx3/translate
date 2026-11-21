'use strict';

const { test, expect } = require('../helpers/audit');

test('[A02] 自动注入前通过 setConfig 省略父页 DOM 范围', async ({ page }) => {
  await page.evaluate(() => {
    const parentArea = document.body.appendChild(document.createElement('article'));
    parentArea.id = 'a02-parent-area';
    translate.setDocuments([parentArea]);
    window.__a02ParentDocuments = translate.getDocuments();
    translate.request.appendParams = { a02Marker: 'injected' };
    const frame = document.body.appendChild(document.createElement('iframe'));
    frame.id = 'a02-child';
    translate.element.iframe.use({
      url: document.querySelector('script[src*="translate"]').src,
      setConfig(config, iframeWindow) {
        window.__a02HookTarget = iframeWindow;
        delete config.documents;
      }
    });
    translate.element.iframe.execute(frame);
  });
  await expect.poll(() => page.evaluate(() => {
    const instance = document.querySelector('#a02-child').contentWindow.translate;
    return instance && instance.executeTriggerNumber > 0 && instance.request.appendParams.a02Marker;
  })).toBe('injected');
  expect(await page.evaluate(() => {
    const frame = document.querySelector('#a02-child');
    const scopes = frame.contentWindow.translate.getDocuments();
    return {
      hookTarget: window.__a02HookTarget === frame.contentWindow,
      childScope: scopes.length === 1 && scopes[0] === frame.contentDocument.documentElement,
      parentScope: translate.getDocuments() === window.__a02ParentDocuments &&
        translate.getDocuments()[0] === document.querySelector('#a02-parent-area')
    };
  })).toEqual({ hookTarget: true, childScope: true, parentScope: true });
});

test('[A02] 无 src 子页重同步前通过 setConfig 保留自身 DOM 范围', async ({ page }) => {
  await page.evaluate(async () => {
    const parentArea = document.body.appendChild(document.createElement('article'));
    translate.setDocuments([parentArea]);
    window.__a02ParentDocuments = translate.getDocuments();
    const frame = document.body.appendChild(document.createElement('iframe'));
    frame.id = 'a02-child';
    const child = frame.contentDocument;
    const script = child.createElement('script');
    script.src = document.querySelector('script[src*="translate"]').src;
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      child.head.append(script);
    });
    const childArea = child.body.appendChild(child.createElement('section'));
    frame.contentWindow.translate.setDocuments([childArea]);
    window.__a02ChildDocuments = frame.contentWindow.translate.getDocuments();
    translate.request.appendParams = { a02Marker: 'resynchronized' };
    translate.element.iframe.use({
      url: script.src,
      setConfig(config, iframeWindow) {
        window.__a02HookTarget = iframeWindow;
        delete config.documents;
      }
    });
    translate.element.iframe.execute(frame);
  });
  await expect.poll(() => page.evaluate(() => {
    const instance = document.querySelector('#a02-child').contentWindow.translate;
    return instance.executeTriggerNumber > 0 && instance.request.appendParams.a02Marker;
  })).toBe('resynchronized');
  expect(await page.evaluate(() => {
    const frame = document.querySelector('#a02-child');
    const scopes = frame.contentWindow.translate.getDocuments();
    return {
      hookTarget: window.__a02HookTarget === frame.contentWindow,
      childScope: scopes === window.__a02ChildDocuments && scopes.length === 1 &&
        scopes[0].ownerDocument === frame.contentDocument,
      parentScope: translate.getDocuments() === window.__a02ParentDocuments,
      scripts: frame.contentDocument.querySelectorAll('script[src*="translate"]').length
    };
  })).toEqual({ hookTarget: true, childScope: true, parentScope: true, scripts: 1 });
});

test('[A08] 有待处理的列表请求时刷新只保留一个选择框', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const requests = [];
    translate.request.post = (path, data, done) => requests.push(done);
    translate.selectLanguageTag.render();
    translate.selectLanguageTag.refreshRender();
    for (const notify of requests.reverse()) notify({result: 1, list: [{id: 'english', name:'English'}]});
    return document.querySelectorAll('#translateSelectLanguage').length;
  });
  expect(actual).toEqual(1);
});

test('[A20] 初次导出且无缓存时能显示空结果提示', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    translate.language.setLocal('italian');
    translate.storage.set('to','english');
    let notified = false;
    window.alert = () => { notified = true; };
    translate.util.loadMsgJs = () => { window.msg = {alert: window.alert}; };
    translate.offline.export();
    return notified;
  });
  expect(actual).toEqual(true);
});

test('[A23] 监听 input 时区域外的脚本改值不加入翻译', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const area = document.body.appendChild(document.createElement('section'));
    const inside = area.appendChild(document.createElement('input'));
    const outside = document.body.appendChild(document.createElement('input'));
    translate.setDocuments([area]);
    translate.element.tagAttribute.input = {attribute: ['value']};
    const scanned = [];
    translate.execute = docs => scanned.push(...docs);
    translate.listener.addListener();
    inside.value = 'inside';
    outside.value = 'outside';
    return [scanned.includes(inside), scanned.includes(outside)];
  });
  expect(actual).toEqual([true,false]);
});

test('[A24] 一次包含重复节点和新兄弟的 DOM 通知也翻译新兄弟', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const host = document.body.appendChild(document.createElement('section'));
    translate.setDocuments([host]);
    const scanned = [];
    translate.execute = docs => scanned.push(...docs);
    translate.listener.addListener();
    const first = document.createElement('span'), last = document.createElement('i');
    host.append(first);
    const fragment = document.createDocumentFragment();
    fragment.append(first, last);
    host.append(fragment);
    await new Promise(resolve => setTimeout(resolve, 0));
    return [scanned.includes(first), scanned.includes(last)];
  });
  expect(actual).toEqual([true,true]);
});

test('[A25] 更换范围后的 DOM 监听转移到新容器', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const oldRoot = document.body.appendChild(document.createElement('section'));
    const newRoot = document.body.appendChild(document.createElement('section'));
    translate.setDocuments([oldRoot]);
    const scanned = [];
    translate.execute = docs => scanned.push(...docs);
    translate.listener.addListener();
    translate.setDocuments([newRoot]);
    const oldNode = oldRoot.appendChild(document.createElement('p'));
    const newNode = newRoot.appendChild(document.createElement('p'));
    await new Promise(resolve => setTimeout(resolve, 0));
    return [scanned.includes(oldNode), scanned.includes(newNode)];
  });
  expect(actual).toEqual([false,true]);
});

test('[A26] 单个节点两个片段各执行一次写回', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const text = document.body.appendChild(document.createTextNode('甲乙'));
    translate.to = 'english';
    const analyser = translate.element.nodeAnalyse;
    const originalSet = analyser.set;
    const writes = [];
    analyser.set = function (...args) {
      writes.push(args[1]);
      return originalSet.apply(this, args);
    };
    const task = new translate.renderTask();
    task.add(text, '甲', 'A');
    task.add(text, '乙', 'B');
    task.execute();
    return writes.sort();
  });
  expect(actual).toEqual(["乙","甲"]);
});

test('[A27] 整页请求与后续局部请求按顺序出队', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const part = document.body.appendChild(document.createElement('article'));
    const calls = [];
    translate.state = 1;
    translate.execute = docs => { calls.push(docs == null || Array.from(docs).includes(document.documentElement) ? 'page' :
      Array.from(docs).includes(part) ? 'partial' : 'unknown'); };
    translate.waitingExecute.add();
    translate.waitingExecute.add([part]);
    translate.state = 0;
    await new Promise(resolve => setTimeout(resolve, 1200));
    return calls;
  });
  expect(actual).toEqual(["page","partial"]);
});

test('[A30] 语言列表加载后导出的配置让新实例继续使用同一服务语种', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const path = 'regional-languages.json';
    const languages = [{id: 'italian', name:'Italiano'}];
    translate.request.api.language = path;
    translate.request.post = (_path, _data, done) => done({result: 1, list: languages});
    translate.selectLanguageTag.render();
    const config = translate.config.get();
    translate.request.api.language = 'unrelated-language-list.json';
    translate.config.set({request:{api:{language:config.request.api.language}}});
    return translate.request.api.language === path ||
      JSON.stringify(translate.request.api.language) === JSON.stringify(languages);
  });
  expect(actual).toEqual(true);
});

test('[A31] 自定义语言选择器不参与正文翻译', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const root = document.body.appendChild(document.createElement('aside'));
    root.id = 'language-picker';
    translate.selectLanguageTag.documentId = root.id;
    translate.selectLanguageTag.customUI([{id: 'italian', name: 'Italiano'}]);
    return translate.ignore.isIgnore(root.querySelector('option').firstChild);
  });
  expect(actual).toEqual(true);
});

test('[A35] 第一次翻译之后启用监听仍会跟踪后续 DOM', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    translate.language.setLocal('italian');
    translate.to = 'english';
    translate.selectLanguageTag.show = false;
    translate.execute();
    translate.listener.start();
    const added = document.createElement('div');
    const scanned = [];
    const originalExecute = translate.execute;
    translate.execute = function (docs) {
      if (docs) scanned.push(...docs);
      return originalExecute.apply(this, arguments);
    };
    translate.execute();
    document.body.append(added);
    await new Promise(resolve => setTimeout(resolve, 0));
    return scanned.includes(added);
  });
  expect(actual).toEqual(true);
});

test('[A36] 业务清空已翻译文本后 reset 保持空文本', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const text = document.body.appendChild(document.createTextNode('新'));
    translate.node.set(text, {originalText: '原', resultText: '新', translateTexts: {'原':'新'}, whole:true});
    translate.listener.addListener();
    text.nodeValue = '';
    await new Promise(resolve => setTimeout(resolve, 0));
    translate.reset({selectLanguageRefreshRender:false});
    return text.nodeValue;
  });
  expect(actual).toEqual("");
});

test('[A37] 节点在相同父级重排后分组保留新顺序或回退', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    translate.language.setLocal('chinese_simplified');
    translate.to = 'english';
    translate.whole.enableAll();
    const root = document.body.appendChild(document.createElement('p'));
    root.innerHTML = '<b>甲方</b><i>乙方</i>';
    translate.group.addElements(root);
    translate.element.whileNodes('moved', root);
    root.prepend(root.lastChild);
    const groups = translate.group._prepareGroups('moved');
    if (!groups.length) return Object.keys(translate.nodeQueue.moved.list).length > 0;
    return groups.flatMap(group => group.words.map(word => word.text)).join('') === '乙方甲方';
  });
  expect(actual).toEqual(true);
});

test('[A40] 显式关闭监听后区域变更不再触发翻译', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    const root = document.body.appendChild(document.createElement('article'));
    translate.setDocuments([root]);
    translate.listener.start();
    translate.listener.addListener();
    const scanned = [];
    translate.execute = docs => scanned.push(...docs);
    const first = root.appendChild(document.createElement('i'));
    await new Promise(resolve => setTimeout(resolve, 0));
    translate.config.set({listener: {use:false}});
    const second = root.appendChild(document.createElement('b'));
    await new Promise(resolve => setTimeout(resolve, 0));
    return [scanned.includes(first), scanned.includes(second)];
  });
  expect(actual).toEqual([true,false]);
});

// Read only literal data from the exported call. The generated JS is never executed.
async function exportedArguments(page, original, translation) {
  const source = await page.evaluate(({ original, translation }) => {
    translate.language.setLocal('italian');
    translate.storage.set('to', 'english');
    const hash = translate.util.hash(original);
    translate.nodeQueue = {sample: {list: {italian: {[hash]: {original}}}}};
    translate.storage.set('hash_english_' + hash, translation);
    translate.util.loadMsgJs = () => {};
    window.msg = {popups() {
      const field = document.body.appendChild(document.createElement('textarea'));
      field.id = 'msgPopupsTextarea';
    }};
    translate.offline.export();
    return document.querySelector('#msgPopupsTextarea').value;
  }, { original, translation });
  const path = require('path');
  const { babelParse } = require(path.join(path.dirname(require.resolve('playwright/package.json')), 'lib/transform/babelBundle'));
  const statements = babelParse(source, 'offline-export.js', false).program.body;
  expect(statements).toHaveLength(1);
  const call = statements[0].expression;
  expect(call.type).toBe('CallExpression');
  expect(call.callee.property.name).toBe('append');
  return call.arguments.map(arg => {
    if (arg.type === 'StringLiteral') return arg.value;
    expect(arg.type).toBe('TemplateLiteral');
    expect(arg.expressions).toHaveLength(0);
    return arg.quasis[0].value.cooked;
  });
}

test('[A18] 导出并重新导入含等号的正常文案', async ({ page }) => {
  const args = await exportedArguments(page, 'q=1', 'Query = one');
  const value = await page.evaluate(args => {
    const hash = translate.util.hash('q=1');
    translate.storage.set('hash_english_' + hash, '');
    translate.offline.append(...args);
    return translate.storage.get('hash_english_' + hash);
  }, args);
  expect(value).toBe('Query = one');
});

test('[A19] 导出的普通 Windows 路径在字符串字面量中保持原值', async ({ page }) => {
  const word = 'C:\\travel\\notes';
  const args = await exportedArguments(page, 'Folder', word);
  expect(args[1]).toContain(word);
});

test('[A32] 打开离线面板后定时回收仍能保留可导出的旧条目', async ({ page }, testInfo) => {
  // Install before loading the library in a fresh page so its real recycle timer uses this clock.
  await page.clock.install();
  await page.goto('/iframe-blank.html');
  await page.addScriptTag({url: '/' + testInfo.project.metadata.build});
  await page.evaluate(() => {
    translate.language.setLocal('italian');
    translate.storage.set('to', 'english');
    translate.util.loadMsgJs = () => {};
    window.msg = {alert() {}, popups() {
      const field = document.body.appendChild(document.createElement('textarea'));
      field.id = 'msgPopupsTextarea';
    }};
    translate.offline.showPanel();
    const hash = translate.util.hash('Ciao');
    translate.storage.set('hash_english_' + hash, 'Hello');
    translate.nodeQueue.sample = {expireTime: Date.now() + 1000, list:{italian:{[hash]:{original:'Ciao'}}}};
  });
  await page.clock.fastForward(180000);
  const exported = await page.evaluate(() => {
    translate.offline.export();
    return document.querySelector('#msgPopupsTextarea')?.value || '';
  });
  expect(exported).toContain('Ciao');
});

test('[A38] 互不重叠的扫描范围增长时避免逐对枚举', async ({ page }) => {
  const [small, large] = await page.evaluate(() => {
    const group = translate.group;
    const original = group._isScanScopeCovered;
    let comparisons = 0;
    group._isScanScopeCovered = function (...args) {
      comparisons++;
      return original.apply(this, args);
    };
    function count(size) {
      const scopes = [];
      for (let i = 0; i < size; i++) {
        const node = document.createTextNode(String(i));
        scopes.push({root: node, complete: true, events: [{type: 'text', snapshot: {node}}]});
      }
      translate.nodeQueue.sample = {scan: {scopes}};
      comparisons = 0;
      if (group._getScanScopes('sample').length !== size) throw Error('分离的扫描根应全部保留');
      return comparisons;
    }
    return [count(8), count(32)];
  });
  // 4× input leaves headroom for an indexed or n·log(n) implementation.
  expect(large).toBeLessThanOrEqual(Math.max(32, 8 * small));
});
