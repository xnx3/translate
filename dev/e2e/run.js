'use strict';

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { startServer, DEFAULT_PORT, CROSS_ORIGIN_PORT } = require('./server');

const BASE = `http://127.0.0.1:${DEFAULT_PORT}`;
const SHOTS = path.join(__dirname, 'report', 'screenshots');
const STRICT = process.argv.includes('--strict');
const results = [];

function record(name, pass, detail) {
  results.push({ name, pass, detail: detail || '' });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
}

async function resetRequests(port) {
  await fetch(`http://127.0.0.1:${port}/__reset`);
}

async function getRequests(port) {
  return await (await fetch(`http://127.0.0.1:${port}/__requests`)).json();
}

async function addBanner(page, kind, text) {
  await page.evaluate(({ kind, text }) => {
    document.querySelectorAll('.harness-banner').forEach((node) => node.remove());
    const banner = document.createElement('div');
    banner.className = 'harness-banner ' + kind + ' ignore';
    banner.textContent = text;
    document.body.prepend(banner);
    document.body.classList.add('harness-has-banner');
  }, { kind, text });
}

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(SHOTS, name), fullPage: true });
}

async function newPage(browser, initScript) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  if (initScript) await context.addInitScript(initScript);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push('PAGEERROR: ' + error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push('CONSOLE: ' + message.text());
  });
  return { context, page, errors };
}

async function gotoFixture(browser, initScript) {
  const session = await newPage(browser, initScript);
  await session.page.goto(BASE + '/', { waitUntil: 'load', timeout: 30000 });
  await session.page.waitForFunction(() => window.translate && window.translate.version, null, { timeout: 10000 });
  await session.page.waitForFunction(() => {
    const title = document.querySelector('#title');
    return title && title.textContent.trim() === 'Hello world';
  }, null, { timeout: 15000 });
  return session;
}

async function main() {
  fs.mkdirSync(SHOTS, { recursive: true });

  const serverA = await startServer(DEFAULT_PORT);
  const serverB = await startServer(CROSS_ORIGIN_PORT);
  let browser;

  try {
    try {
      browser = await chromium.launch({ headless: true });
    } catch (error) {
      throw new Error(
        'Chromium is not installed. Run `npx playwright install chromium` in dev/e2e first.\n' +
        error.message
      );
    }

    // 1. Baseline translation and selector.
    {
      await resetRequests(DEFAULT_PORT);
      const { context, page, errors } = await gotoFixture(browser);
      const title = await page.locator('#title').innerText();
      const p1 = await page.locator('#p1').innerText();
      const p2 = await page.locator('#p2').innerText();
      const options = await page.$$eval('select.translateSelectLanguage option', (items) => items.map((item) => item.value));
      const requests = await getRequests(DEFAULT_PORT);

      record('static translation', title === 'Hello world' && p1 === 'This is a test.' && p2 === 'Second paragraph: more content.',
        `title=${JSON.stringify(title)}, p1=${JSON.stringify(p1)}, p2=${JSON.stringify(p2)}`);
      record('language selector rendered', options.includes('english') && options.includes('spanish'), `options=${options.join(',')}`);
      record('no page or console errors on baseline flow', errors.length === 0, errors.slice(0, 3).join(' | '));
      record('translation request sent to mocked API', requests.some((request) => request.to === 'english'), `requests=${requests.length}`);

      await addBanner(page, 'pass', 'PASS — static DOM translated (zh -> en); selector rendered; 0 console errors');
      await screenshot(page, '01-static-translation-pass.png');
      await context.close();
    }

    // 2. Ignore rules, attributes and input value.
    {
      const { context, page } = await gotoFixture(browser);
      const values = await page.evaluate(() => ({
        cls: document.querySelector('#ignore-class').textContent,
        id: document.querySelector('#ignore-id').textContent,
        code: document.querySelector('#ignore-code').textContent,
        text: document.querySelector('#ignore-text').textContent,
        placeholder: document.querySelector('#inp').getAttribute('placeholder'),
        title: document.querySelector('#inp').getAttribute('title'),
        alt: document.querySelector('#img').getAttribute('alt'),
        value: document.querySelector('#inp').value
      }));
      const requests = await getRequests(DEFAULT_PORT);
      const sent = requests.flatMap((request) => request.texts);
      const ignored = ['忽略我', '忽略我ID', '忽略我CODE', '忽略我TEXT'];
      const untouched = values.cls === '忽略我' && values.id === '忽略我ID' && values.code === '忽略我CODE' && values.text === '忽略我TEXT';
      const notSent = ignored.every((text) => !sent.includes(text));
      record('ignore class/id/tag/text', untouched && notSent, JSON.stringify(values));
      record('attributes translated by default', values.placeholder === 'Please enter' && values.title === 'Title' && values.alt === 'Image description', JSON.stringify(values));
      record('input value is not translated by default', values.value === '按钮', `value=${JSON.stringify(values.value)}`);

      await page.evaluate(() => {
        translate.element.tagAttribute['input'] = { attribute: ['value'], condition: () => true };
        translate.execute();
      });
      await page.waitForFunction(() => document.querySelector('#inp').value === 'Button', null, { timeout: 10000 }).catch(() => {});
      const valueAfter = await page.locator('#inp').inputValue();
      record('input value translated through tagAttribute', valueAfter === 'Button', `value=${JSON.stringify(valueAfter)}`);
      await context.close();
    }

    // 3. Dynamic DOM: childList and characterData.
    {
      const { context, page } = await gotoFixture(browser);
      await page.click('#add-dynamic');
      await page.waitForFunction(() => {
        const node = document.querySelector('#dynamic-p');
        return node && node.textContent.trim() === 'Dynamic content';
      }, null, { timeout: 10000 }).catch(() => {});
      const added = await page.locator('#dynamic-p').innerText().catch(() => '');

      await page.click('#change-text');
      await page.waitForFunction(() => document.querySelector('#p1').textContent.trim() === 'Dynamic content', null, { timeout: 10000 }).catch(() => {});
      const changed = await page.locator('#p1').innerText();

      record('dynamic childList insertion translated', added === 'Dynamic content', `text=${JSON.stringify(added)}`);
      record('dynamic characterData change translated', changed === 'Dynamic content', `text=${JSON.stringify(changed)}`);

      await addBanner(page, 'pass', 'PASS — dynamic DOM translated: appended node + changed text node');
      await screenshot(page, '02-dynamic-dom-pass.png');
      await context.close();
    }

    // 4. Language switch and cache behavior.
    {
      const { context, page } = await gotoFixture(browser);
      await page.evaluate(() => {
        window.__alive = true;
        translate.changeLanguage('spanish');
      });
      await page.waitForFunction(() => document.querySelector('#title').textContent.trim() === 'Hola mundo', null, { timeout: 15000 }).catch(() => {});
      const titleEs = await page.locator('#title').innerText();
      const alive = await page.evaluate(() => window.__alive === true);
      record('switch to Spanish', titleEs === 'Hola mundo', `title=${JSON.stringify(titleEs)}`);
      record('switch does not reload the page', alive, `window.__alive=${alive}`);

      await page.evaluate(() => translate.changeLanguage('english'));
      await page.waitForFunction(() => document.querySelector('#title').textContent.trim() === 'Hello world', null, { timeout: 15000 }).catch(() => {});

      const keys = await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('hash_english_')));
      record('translation cache written', keys.length > 0, `keys=${keys.length}`);

      await resetRequests(DEFAULT_PORT);
      await page.reload({ waitUntil: 'load' });
      await page.waitForFunction(() => document.querySelector('#title').textContent.trim() === 'Hello world', null, { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(800);
      const requests = await getRequests(DEFAULT_PORT);
      const apiCalls = requests.filter((request) => request.to === 'english' || request.to === 'spanish');
      record('cache hit avoids translate.json on reload', apiCalls.length === 0, `apiCalls=${apiCalls.length}`);
      await context.close();
    }

    // 5. localStorage quota.
    {
      const { context, page, errors } = await gotoFixture(browser);
      await page.evaluate(() => {
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function (key, value) {
          if (String(key).startsWith('hash_')) throw new DOMException('Quota exceeded', 'QuotaExceededError');
          return original.call(this, key, value);
        };
      });
      await page.click('#add-dynamic');
      await page.waitForTimeout(2500);
      const text = await page.locator('#dynamic-p').innerText().catch(() => '');
      record('quota error handled gracefully', text === 'Dynamic content',
        `dynamic text=${JSON.stringify(text)}, errors=${errors.slice(0, 2).join(' | ')}`);

      if (text === 'Dynamic content') {
        await addBanner(page, 'pass', 'PASS — localStorage quota error fell back to memory cache; appended text was translated');
        await screenshot(page, '03-quota-pass.png');
      } else {
        await addBanner(page, 'fail', 'FAIL — localStorage quota: appended text stays Chinese. ' + (errors[0] || ''));
        await screenshot(page, '03-quota-fail.png');
      }
      await context.close();
    }

    // 6. localStorage disabled.
    {
      const { context, page, errors } = await newPage(browser, () => {
        Storage.prototype.setItem = function () {
          throw new DOMException('Storage disabled', 'SecurityError');
        };
      });
      await page.goto(BASE + '/', { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(2500);
      const title = await page.locator('#title').innerText().catch(() => '');
      record('storage disabled handled gracefully', title === 'Hello world',
        `title=${JSON.stringify(title)}, errors=${errors.slice(0, 2).join(' | ')}`);

      if (title === 'Hello world') {
        await addBanner(page, 'pass', 'PASS — storage disabled: translation continued with in-memory cache');
        await screenshot(page, '04-storage-disabled-pass.png');
      } else {
        await addBanner(page, 'fail', 'FAIL — storage disabled: page never translates. ' + (errors[0] || ''));
        await screenshot(page, '04-storage-disabled-fail.png');
      }
      await context.close();
    }

    // 7. Same-origin iframe injection.
    {
      const { context, page } = await newPage(browser);
      await page.goto(BASE + '/iframe-parent.html', { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(4000);
      const frame = page.frames().find((item) => item.url().includes('/iframe-blank.html'));
      const childTitle = frame ? await frame.locator('#blank-title').innerText().catch(() => '') : '';
      record('same-origin iframe injection', childTitle === 'Hello world',
        `frame=${Boolean(frame)}, title=${JSON.stringify(childTitle)}`);
      await context.close();
    }

    // 8. Nested iframe injection.
    {
      const { context, page, errors } = await newPage(browser);
      await page.goto(BASE + '/nested-top.html', { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(5000);
      const middle = page.frames().find((item) => item.url().includes('/nested-middle.html'));
      const inner = page.frames().find((item) => item.url().includes('/iframe-blank.html'));
      const middleTitle = middle ? await middle.locator('#middle-title').innerText().catch(() => '') : '';
      const innerTitle = inner ? await inner.locator('#blank-title').innerText().catch(() => '') : '';
      record('nested iframe injection (middle -> inner)', innerTitle === 'Hello world',
        `middleTitle=${JSON.stringify(middleTitle)}, innerTitle=${JSON.stringify(innerTitle)}, errors=${errors.slice(0, 3).join(' | ')}`);

      if (innerTitle === 'Hello world') {
        await addBanner(page, 'pass', 'PASS — nested iframe translated (middle -> inner)');
        await screenshot(page, '05-nested-iframe-pass.png');
      } else {
        await addBanner(page, 'fail', 'FAIL — nested iframe stays Chinese. ' + (errors[0] || ''));
        await screenshot(page, '05-nested-iframe-fail.png');
      }
      await context.close();
    }

    // 9. Cross-origin postMessage origin policy.
    {
      const { context, page, errors } = await newPage(browser);
      await page.goto(BASE + '/cross-origin-parent.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(4000);
      const child = page.frames().find((item) => item.url().includes(`127.0.0.1:${CROSS_ORIGIN_PORT}/iframe.html`));
      const initial = child ? await child.locator('#iframe-title').innerText().catch(() => '') : '';

      await addBanner(page, 'warn', 'BEFORE — cross-origin iframe language: ' + initial);
      await screenshot(page, '07-cross-origin-postmessage-before.png');

      await page.evaluate(() => {
        const iframe = document.getElementById('child');
        iframe.contentWindow.postMessage({ type: 'translate-js-iframe-changeLanguage', language: 'spanish' }, '*');
      });
      await page.waitForTimeout(2500);
      const after = child ? await child.locator('#iframe-title').innerText().catch(() => '') : '';

      record('cross-origin postMessage accepted by default (security finding)', initial === 'Hello world' && after === 'Hola mundo',
        `initial=${JSON.stringify(initial)}, after=${JSON.stringify(after)}, errors=${errors.slice(0, 2).join(' | ')}`);

      await addBanner(page, 'warn', 'AFTER — a message from 127.0.0.1:8123 changed this 8124 iframe to Spanish: ' + after);
      await screenshot(page, '08-cross-origin-postmessage-after.png');
      await context.close();
    }

    // 10. Shadow DOM.
    {
      const { context, page } = await gotoFixture(browser);
      const before = await page.evaluate(() => document.getElementById('shadow-host').shadowRoot.getElementById('shadow-p').textContent);
      await page.evaluate(() => {
        const node = document.createElement('p');
        node.textContent = '动态内容';
        document.getElementById('shadow-host').shadowRoot.appendChild(node);
      });
      await page.waitForTimeout(1500);
      const after = await page.evaluate(() => document.getElementById('shadow-host').shadowRoot.getElementById('shadow-p').textContent);
      record('Shadow DOM translation', before === 'Dynamic content' && after === 'Dynamic content',
        `before=${JSON.stringify(before)}, after=${JSON.stringify(after)} (known gap)`);

      await addBanner(page, 'fail', 'FAIL — Shadow DOM text stays Chinese: ' + JSON.stringify(before));
      await screenshot(page, '06-shadow-dom-fail.png');
      await context.close();
    }

    // 11. Public cache API.
    {
      const { context, page } = await gotoFixture(browser);
      const api = await page.evaluate(() => ({
        clearTranslationCache: typeof translate.storage.clearCache === 'function',
        clearLanguageCache: typeof translate.language.clearCacheLanguage === 'function',
        storageRemove: typeof translate.storage.remove === 'function',
        storageClear: typeof translate.storage.clear === 'function'
      }));
      record('public clear-translation-cache API', api.clearTranslationCache || api.storageRemove || api.storageClear, JSON.stringify(api));
      await context.close();
    }
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => serverA.close(resolve));
    await new Promise((resolve) => serverB.close(resolve));
  }

  const passed = results.filter((result) => result.pass).length;
  console.log(`\nSUMMARY: ${passed}/${results.length} checks passed`);
  console.log(`Screenshots: ${SHOTS}`);
  console.log(JSON.stringify(results, null, 2));

  if (STRICT && passed !== results.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
