'use strict';

const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }, testInfo) => {
  await page.goto('/iframe-blank.html');
  await page.addScriptTag({ url: '/' + testInfo.project.metadata.build });
  await page.evaluate(() => {
    document.body.innerHTML = '<main><article></article><p id="cn">你好</p><p id="ja">こんにちは</p></main>';
    Object.assign(translate.request.api, { host: [location.origin + '/'], init: '', connectTest: '', translate: 'translate.json' });
    translate.request.sse.use = false;
    translate.selectLanguageTag.show = false;
    translate.language.setLocal('chinese_simplified');
    translate.to = 'english';
    window.finished = [];
    translate.lifecycle.execute.renderFinish.push(uuid => finished.push(uuid));
  });
});

// 将真正发出的 POST 保留到断言完成后，由测试明确指定响应顺序。
async function captureRequests(page) {
  const requests = [];
  await page.route(url => url.pathname === '/translate.json', route => {
    const form = new URLSearchParams(route.request().postData());
    requests.push({ route, from: form.get('from'), to: form.get('to'), texts: JSON.parse(form.get('text')) });
  });
  return requests;
}

async function respond({ route, from, to, texts }) {
  const text = texts.map(() => from === null
    ? { words: [{ text: 'China' }, { text: 'from ' }], order: [1, 0] }
    : 'hello');
  await route.fulfill({ json: { result: 1, from, to, text } });
}

test('未登记 group 时按来源语种提交普通文本', async ({ page }) => {
  const requests = await captureRequests(page);
  await page.evaluate(() => translate.execute(document.querySelector('main')));
  await expect.poll(() => requests.length).toBe(2);
  expect(requests.map(r => r.from).sort()).toEqual(['chinese_simplified', 'japanese']);
  expect(requests.flatMap(r => r.texts).sort()).toEqual(['你好', 'こんにちは'].sort());
  await Promise.all(requests.map(respond));
  await expect(page.locator('#cn')).toHaveText('hello');
  await expect(page.locator('#ja')).toHaveText('hello');
});

test('50 个段落合并为一个请求，区外两个语种各自翻译并一起收尾', async ({ page }) => {
  const requests = await captureRequests(page);
  await page.evaluate(() => {
    const article = document.querySelector('article');
    article.innerHTML = '<p><b>中国</b>来自</p>'.repeat(50);
    // 逐片段缓存没有整句语境和显示顺序；即使全部命中，在线分组仍须请求整句。
    translate.storage.set('hash_english_' + translate.util.hash('中国'), 'the country');
    translate.storage.set('hash_english_' + translate.util.hash('来自'), 'comes from');
    translate.group.addElements(article);
    translate.execute(document.querySelector('main'));
  });
  await expect.poll(() => requests.length).toBe(3);
  const group = requests.find(r => r.from === null);
  const ordinary = requests.filter(r => r.from !== null);
  expect(group.to).toBe('english');
  expect(group.texts).toHaveLength(50);
  expect(group.texts[0]).toEqual({ words: [{ text: '中国', weight: 1 }, { text: '来自', weight: 0 }] });
  expect(ordinary.map(r => r.from).sort()).toEqual(['chinese_simplified', 'japanese']);
  expect(ordinary.flatMap(r => r.texts).sort()).toEqual(['你好', 'こんにちは'].sort());
  await respond(group);
  await expect(page.locator('article p').last()).toHaveText('from China');
  await expect(page.locator('article b').last()).toHaveText('China');
  expect(await page.evaluate(() => finished.length)).toBe(0);
  await Promise.all(ordinary.map(respond));
  await expect.poll(() => page.evaluate(() => finished.length)).toBe(1);
  expect(await page.evaluate(() => translate.state)).toBe(0);
});

test('旧普通请求先返回时，后发 group 请求仍保持执行中', async ({ page }) => {
  const requests = await captureRequests(page);
  await page.evaluate(() => {
    translate.waitingExecute.use = false;
    translate.execute(document.querySelector('#cn'));
    const article = document.querySelector('article');
    article.innerHTML = '<b>中国</b>来自';
    translate.group.addElements(article);
    translate.execute(article);
  });
  await expect.poll(() => requests.length).toBe(2);
  await respond(requests.find(r => r.from !== null));
  await expect.poll(() => page.evaluate(() => finished.length)).toBe(1);
  expect(await page.evaluate(() => translate.state)).toBe(20);
  await respond(requests.find(r => r.from === null));
  await expect.poll(() => page.evaluate(() => finished.length)).toBe(2);
  expect(await page.evaluate(() => translate.state)).toBe(0);
});
