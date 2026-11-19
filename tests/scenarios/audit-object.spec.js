'use strict';

const { test, expect } = require('../helpers/audit');

async function installUppercaseTranslation(page) {
  await page.evaluate(() => {
    translate.request.translateText = (options, success) => {
      success({ result: 1, to: options.to, text: options.texts.map(text => text.toUpperCase()) });
    };
  });
}

test('[E01] 同一张图片可连续切换语种并还原', async ({ page }) => {
  const actual = await page.evaluate(() => {
    const image = document.createElement('img');
    image.src = '/favicon.ico?source';
    document.body.appendChild(image);
    translate.images.add({ '/favicon.ico?source': '/favicon.ico?{language}' });
    const values = [];
    for (const language of ['english', 'french']) {
      translate.to = language;
      translate.images.execute();
      values.push(new URL(image.src).search);
    }
    translate.reset({ selectLanguageRefreshRender: false });
    return [...values, new URL(image.src).search];
  });
  expect(actual).toEqual(['?english', '?french', '?source']);
});

test('[E02] 局部 execute 只处理范围内允许翻译的图片', async ({ page }) => {
  const values = await page.evaluate(() => {
    document.body.innerHTML = '<section><img><div class="ignore"><img></div></section><img>';
    const images = Array.from(document.images);
    images.forEach(image => { image.src = '/favicon.ico?source'; });
    translate.images.add({ '/favicon.ico?source': '/favicon.ico?{language}' });
    translate.ignore.class.data.push('ignore');
    translate.selectLanguageTag.show = false;
    translate.language.setLocal('chinese_simplified');
    translate.to = 'english';
    translate.storage.set('to', 'english');
    translate.execute([document.querySelector('section')]);
    return images.map(image => new URL(image.src).search);
  });
  expect(values).toEqual(['?english', '?source', '?source']);
});

test('[E03] 译图只替换命中资源并保留 CSS 背景图层', async ({ page }) => {
  const background = await page.evaluate(() => {
    const card = document.createElement('div');
    card.style.backgroundImage = 'linear-gradient(red, blue), url("/favicon.ico?source")';
    document.body.appendChild(card);
    translate.images.add({ '/favicon.ico?source': '/favicon.ico?{language}' });
    translate.to = 'french';
    translate.images.execute();
    return getComputedStyle(card).backgroundImage;
  });
  expect(background).toContain('linear-gradient');
  expect(background).toContain('?french');
  expect(background).not.toContain('?source');
});

test('[E04] srcset 的实际候选资源随目标语种切换', async ({ page }) => {
  const candidate = await page.evaluate(async () => {
    const image = document.createElement('img');
    image.src = '/favicon.ico?base';
    image.srcset = '/favicon.ico?retina 1x';
    document.body.appendChild(image);
    translate.images.add({
      '/favicon.ico?base': '/favicon.ico?base-{language}',
      '/favicon.ico?retina': '/favicon.ico?retina-{language}'
    });
    translate.to = 'french';
    translate.images.execute();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return new URL(image.currentSrc).search;
  });
  expect(candidate).toBe('?retina-french');
});

test('[E05] reset 保留用户在译文上实际键入的新值', async ({ page }) => {
  await page.evaluate(() => {
    const input = document.createElement('input');
    input.value = 'Book';
    document.body.append(input);
    translate.node.set(input, { originalText: '书', resultText: 'Book', attribute: 'value' });
  });
  await page.locator('input').press('End');
  await page.locator('input').pressSequentially(' club');
  await page.evaluate(() => translate.reset({ selectLanguageRefreshRender: false }));
  await expect(page.locator('input')).toHaveValue('Book club');
});

test('[E07] 选择操作保存实例坐标并保留宿主同名状态', async ({ page }) => {
  const state = await page.evaluate(() => {
    window.selectionX = 910;
    window.selectionY = 920;
    translate.selectionTranslate.start();
    document.dispatchEvent(new MouseEvent('mousedown', { clientX: 20, clientY: 30 }));
    return [window.selectionX, window.selectionY, translate.selectionTranslate.selectionX, translate.selectionTranslate.selectionY];
  });
  expect(state).toEqual([910, 920, 20, 30]);
});

test('[E08] 旧选区响应不能覆盖新选区或重新打开已关闭提示', async ({ page }) => {
  const actual = await page.evaluate(() => {
    const pending = [];
    translate.selectionTranslate.start();
    translate.request.post = (url, data, complete) => pending.push(complete);
    const text = document.createTextNode('paperback');
    document.body.appendChild(text);
    function select(start, end) {
      document.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 20 }));
      window.getSelection().setBaseAndExtent(text, start, text, end);
      document.dispatchEvent(new MouseEvent('mouseup'));
    }
    select(0, 5);
    select(5, 9);
    pending[1]({ result: 1, text: ['second'] });
    pending[0]({ result: 1, text: ['first'] });
    const tooltip = document.querySelector('#translateTooltip');
    const latest = tooltip.innerText;
    select(0, 5);
    document.dispatchEvent(new MouseEvent('click'));
    pending[2]({ result: 1, text: ['late'] });
    return [latest, getComputedStyle(tooltip).display];
  });
  expect(actual).toEqual(['second', 'none']);
});

test('[E09] body 就绪前开启划词也可在就绪后正常启动', async ({ page }) => {
  const count = await page.evaluate(() => {
    const body = document.body;
    body.remove();
    try { translate.selectionTranslate.start(); }
    finally { document.documentElement.appendChild(body); }
    document.dispatchEvent(new Event('DOMContentLoaded'));
    translate.selectionTranslate.start();
    return document.querySelectorAll('#translateTooltip').length;
  });
  expect(count).toBe(1);
});

test('[E10] 移除进度类保持所有同前缀的宿主样式', async ({ page }) => {
  const classes = await page.evaluate(() => {
    const el = document.createElement('span');
    el.className = 'translate_api_in_progress_custom translate_api_in_progress translatejs-text-element-hidden_alt';
    translate.progress.api.removeUITipByElements([el]);
    return [...el.classList];
  });
  expect(classes).toEqual(['translate_api_in_progress_custom', 'translatejs-text-element-hidden_alt']);
});

test('[E11] 启动后启用进度提示会影响下一次请求', async ({ page }) => {
  const marked = await page.evaluate(() => {
    const api = translate.progress.api;
    api.setUITip(false);
    api.startUITip();
    api.setUITip(true);
    const element = document.createElement('span');
    element.textContent = 'pending';
    document.body.append(element);
    const data = { nodes: [element.firstChild] };
    for (const handler of translate.lifecycle.execute.translateNetworkBefore) handler(data);
    return element.classList.contains('translatejs-text-element-hidden');
  });
  expect(marked).toBe(true);
});

test('[E12] 同一元素最后一个请求完成后才解除提示', async ({ page }) => {
  const states = await page.evaluate(() => {
    translate.progress.api.startUITip();
    const element = document.createElement('span');
    element.append(document.createTextNode('first'), document.createTextNode('second'));
    document.body.append(element);
    const batches = [...element.childNodes].map(node => ({ nodes: [node] }));
    const hooks = translate.lifecycle.execute;
    for (const batch of batches) {
      for (const before of hooks.translateNetworkBefore) before(batch);
    }
    return batches.map(batch => {
      for (const after of hooks.translateNetworkAfter) after(batch);
      return element.classList.contains('translatejs-text-element-hidden');
    });
  });
  expect(states).toEqual([true, false]);
});

test('[E13] 损坏 JSON 只报告解析失败且不会尝试动态求值', async ({ page }) => {
  const result = await page.evaluate(() => {
    const originalEval = window.eval;
    let evaluations = 0, failures = 0, successes = 0;
    window.eval = () => { evaluations++; throw new Error('evaluation disabled'); };
    try {
      translate.js.transString('{"title":', 'english', () => { successes++; }, () => { failures++; });
    } finally {
      window.eval = originalEval;
    }
    return { evaluations, failures, successes };
  });
  expect(result).toEqual({ evaluations: 0, failures: 1, successes: 0 });
});

test('[E14] 点号和数组状字符属于实际键名时仍写回原字段', async ({ page }) => {
  await installUppercaseTranslation(page);
  const result = await page.evaluate(() => {
    const input = { 'shop.name': 'flat', shop: { name: 'nested' }, 'shelf[2]': 'index' };
    let result;
    translate.js.transObject(input, 'english', value => { result = value; }, reason => { throw Error(String(reason)); });
    return result;
  });
  expect(result).toEqual({ 'shop.name': 'FLAT', shop: { name: 'NESTED' }, 'shelf[2]': 'INDEX' });
});

test('[E15] 普通文案 constructor 可作为独立译文索引', async ({ page }) => {
  await installUppercaseTranslation(page);
  const result = await page.evaluate(() => {
    let result;
    translate.js.transObject({ occupation: 'constructor' }, 'english', value => { result = value.occupation; },
      reason => { throw Error(String(reason)); });
    return result;
  });
  expect(result).toBe('CONSTRUCTOR');
});

test('[E16] C++ 按字面量忽略，纯空白忽略配置不会拆词', async ({ page }) => {
  const batches = await page.evaluate(() => {
    const batches = [];
    translate.request.translateText = (options, complete) => {
      batches.push(options.texts.slice());
      complete({ result: 1, to: options.to, text: options.texts.slice() });
    };
    translate.ignore.text = ['C++'];
    translate.js.transObject({ title: 'C++primer' }, 'english', () => {}, () => {});
    translate.ignore.text = [' '];
    translate.js.transObject({ title: 'word' }, 'english', () => {}, () => {});
    return batches;
  });
  expect(batches).toEqual([['primer'], ['word']]);
});

test('[E18] 底层传输失败触发对象翻译失败回调并保留输入', async ({ page }) => {
  const result = await page.evaluate(() => {
    const input = { title: 'book' };
    const ends = [];
    translate.request.translateText = (options, complete, failed) => {
      if (typeof failed === 'function') failed({ status: 503 });
    };
    translate.js.transObject(input, 'english', () => ends.push('success'), () => ends.push('failure'));
    return { ends, input };
  });
  expect(result).toEqual({ ends: ['failure'], input: { title: 'book' } });
});

test('[E19] 根字符串的成功结果为译文本身', async ({ page }) => {
  await installUppercaseTranslation(page);
  const result = await page.evaluate(() => {
    let value;
    translate.js.transObject('book', 'english', text => { value = text; }, reason => { throw Error(String(reason)); });
    return value;
  });
  expect(result).toBe('BOOK');
});

test('[E20] 在途翻译不会覆盖调用方对同一字段的新编辑', async ({ page }) => {
  const title = await page.evaluate(() => {
    const input = { title: 'first edition' };
    let finish;
    translate.request.translateText = (options, complete) => { finish = complete; };
    translate.js.transObject(input, 'french', () => {}, () => {});
    input.title = 'second edition';
    finish({ result: 1, to: 'french', text: ['première édition'] });
    return input.title;
  });
  expect(title).toBe('second edition');
});

test('[E21] 只遍历对象自身的可枚举文案', async ({ page }) => {
  const values = await page.evaluate(() => {
    const input = Object.create({ sharedLabel: 'shared' });
    input.title = 'own';
    return Object.keys(translate.js.find(input).stringResult);
  });
  expect(values).toEqual(['own']);
});

test('[E22] 序列化保留单行函数的可执行类型', async ({ page }) => {
  // 由浏览器直接解析一行源码，避免测试转译器重排空白、意外测到多行分支。
  await page.addScriptTag({ content: 'window.auditLabel = function label(value) { return value; };' });
  const source = await page.evaluate(() => translate.js.objToString({ format: window.auditLabel }));
  const path = require('node:path');
  const { babelParse } = require(path.join(path.dirname(require.resolve('playwright/package.json')), 'lib/transform/babelBundle'));
  const property = babelParse('(' + source + ')', 'serialized.js', false).program.body[0].expression.properties[0];
  expect(property.key.name || property.key.value).toBe('format');
  expect(['ObjectMethod', 'ArrowFunctionExpression', 'FunctionExpression']).toContain(property.value?.type || property.type);
});

test('[E23] 普通业务对象中的 jsObject 字段和其他自有键完整输出', async ({ page }) => {
  const output = await page.evaluate(() => {
    const business = { title: 'book', jsObject: { edition: 2 } };
    return JSON.parse(translate.js.objToString(business, 0));
  });
  expect(output).toEqual({ title: 'book', jsObject: { edition: 2 } });
});

test('[E24] 普通文案中的换行占位字符串可原样往返', async ({ page }) => {
  const result = await page.evaluate(() => {
    const input = { title: '___TRANSLATEJS_LINE_BREAK___' };
    return JSON.parse(translate.js.objToString(input, 0)).title;
  });
  expect(result).toBe('___TRANSLATEJS_LINE_BREAK___');
});

test('[E25] 全部节点暂时失效后在可用节点恢复时返回企业服务', async ({ page }) => {
  const services = await page.evaluate(() => {
    const control = translate.request.speedDetectionControl;
    translate.enterprise.isUse = true;
    control.hostQueue = [{ host: location.origin + '/', time: control.disableTime }];
    translate.enterprise.automaticAdaptationService();
    const fallback = translate.service.name;
    control.hostQueue[0].time = 15;
    translate.enterprise.automaticAdaptationService();
    return [fallback, translate.service.name];
  });
  expect(services).toEqual(['client.edge', 'translate.service']);
});
