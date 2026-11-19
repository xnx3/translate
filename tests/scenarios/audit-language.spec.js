'use strict';

const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { test, expect } = require('../helpers/audit');
const babel = require(path.join(path.dirname(require.resolve('playwright/package.json')), 'lib/transform/babelBundle'));

test('[C09] 逐字符识别不维护只写入而从不读取的局部数组', async ({ page }) => {
  const source = await page.evaluate(() => translate.language.get.toString());
  const ast = babel.babelParse('(' + source + ')', 'language-get.js', false);
  const unused = [];
  babel.traverse(ast, {
    VariableDeclarator(declaration) {
      const { id, init } = declaration.node;
      if (id.type !== 'Identifier' || !init) return;
      const isArray = init.type === 'ArrayExpression' ||
        (init.type === 'NewExpression' && init.callee.name === 'Array');
      if (!isArray) return;
      const references = declaration.scope.getBinding(id.name).referencePaths;
      const onlyUnobservedPush = references.length > 0 && references.every(reference => {
        const member = reference.parentPath;
        const call = member.parentPath;
        return member.isMemberExpression() && member.node.object === reference.node &&
          member.node.property.name === 'push' && call.isCallExpression() &&
          call.node.callee === member.node && call.parentPath.isExpressionStatement();
      });
      if (onlyUnobservedPush && references.some(reference => reference.findParent(parent => parent.isLoop()))) {
        unused.push(id.name);
      }
    }
  });
  expect(unused, '循环内写入、但没有读取方的数组').toEqual([]);
});

test('[C16] Edge 分片翻译一条长文本后仍返回同一条完整译文', async ({ page }) => {
  const actual = await page.evaluate(async () => {
    translate.language.setLocal('english');
    translate.service.use('client.edge');
    const original = 'abcdef'.repeat(7000);
    const pending = [];
    translate.request.send = (url, body, context, success) => {
      const texts = JSON.parse(body);
      pending.push(() => success(texts.map(text => ({ translations: [{ text: text.toUpperCase() }] })), context));
    };
    const responses = [];
    translate.request.translateText({ from: 'english', to: 'french', texts: [original] }, data => {
      responses.push(Array.from(data.text));
    });
    for (const finish of pending.reverse()) finish();
    await new Promise(resolve => setTimeout(resolve, 0));
    return {
      callbacks: responses.length,
      complete: responses.length === 1 && responses[0].length === 1 && responses[0][0] === original.toUpperCase()
    };
  });
  expect(actual).toEqual({ callbacks: 1, complete: true });
});

test('[C18] 提示组件依赖首次加载不使用同步网络请求', async ({ page }) => {
  // 观测常规加载路径。外部 URL 由上下文拦截，无需访问 CDN。
  const synchronous = await page.evaluate(() => {
    const syncUrls = [];
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async = true, ...rest) {
      if (async === false) {
        syncUrls.push(String(url));
        throw new Error('同步 XHR 已被测试拦截');
      }
      return open.call(this, method, url, async, ...rest);
    };
    try { translate.util.loadMsgJs(); }
    catch (error) { if (!syncUrls.length) throw error; }
    finally { XMLHttpRequest.prototype.open = open; }
    return syncUrls;
  });
  expect(synchronous).toEqual([]);
});

test('[G01] 页面已声明 translate 为 null 时仍可载入脚本', async ({ context }, testInfo) => {
  const tab = await context.newPage();
  await tab.goto('/iframe-blank.html');
  await tab.evaluate(() => { window.translate = null; });
  await tab.addScriptTag({ url: '/' + testInfo.project.metadata.build });
  expect(await tab.evaluate(() => typeof window.translate?.execute)).toBe('function');
});

test('[G02] 子页在译文渲染完成后发送一次语言切换完成通知', async ({ page }, testInfo) => {
  await page.evaluate(async () => {
    const frame = document.createElement('iframe');
    frame.name = 'translation-child';
    frame.src = '/iframe-blank.html';
    const ready = new Promise(resolve => frame.addEventListener('load', resolve, { once: true }));
    document.body.append(frame);
    await ready;
  });
  const frame = page.frame({ name: 'translation-child' });
  await frame.waitForURL('**/iframe-blank.html');
  await frame.addScriptTag({ url: '/' + testInfo.project.metadata.build });
  const actual = await frame.evaluate(async () => {
    document.body.innerHTML = '<p>Hello</p>';
    const text = document.querySelector('p');
    translate.language.setLocal('english');
    translate.selectLanguageTag.show = false;
    translate.request.api.init = '';
    translate.request.api.connectTest = '';
    translate.request.api.translate = '/translate.json';
    let finish;
    translate.request.post = (url, data, done) => {
      finish = () => done({ result: 1, from: data.from, to: data.to, text: ['Bonjour'] }, data);
    };
    const confirmations = [];
    translate.postMessage.send = (target, type) => {
      if (type === translate.postMessage.TYPES.LANGUAGE_CHANGED) confirmations.push(text.textContent);
    };
    translate.postMessage.executeChangeLanguage('french', true);
    if (!finish) throw new Error('本地翻译请求未发起');
    finish();
    await new Promise(resolve => setTimeout(resolve, 25));
    return { text: text.textContent, confirmations };
  });
  expect(actual).toEqual({ text: 'Bonjour', confirmations: ['Bonjour'] });
});

test('[G07] Node CommonJS 可在服务端导入浏览器库后再决定是否使用', async ({}, testInfo) => {
  const build = path.resolve(__dirname, '../../translate.js', testInfo.project.metadata.build);
  const probe = "const t = require(process.argv[1]); process.stdout.write(typeof t.execute); process.exit(0);";
  const exported = execFileSync(process.execPath, ['-e', probe, build], { encoding: 'utf8', timeout: 5000 });
  expect(exported).toBe('function');
});
