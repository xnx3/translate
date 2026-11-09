'use strict';

const { test: base, expect } = require('@playwright/test');
const { DEFAULT_PORT, CROSS_ORIGIN_PORT } = require('./server');

const BASE = `http://127.0.0.1:${DEFAULT_PORT}`;
const CROSS_ORIGIN = `http://127.0.0.1:${CROSS_ORIGIN_PORT}`;
const knownFailures = new WeakMap();

const test = base.extend({
  runtimeErrors: [async ({ page }, use, testInfo) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push('PAGEERROR: ' + error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push('CONSOLE: ' + message.text());
    });
    await use(errors);
    const known = knownFailures.get(testInfo);
    // Classify after hooks so that a second assertion or a late browser error
    // cannot hide behind an otherwise expected failure.
    if (known && testInfo.project.name !== 'strict' && testInfo.errors.length === 1 &&
        JSON.stringify(errors) === JSON.stringify(known.errors)) {
      test.fail(true, known.reason);
    }
  }, { auto: true }]
});

test.beforeEach(async ({ request }) => {
  expect((await request.get(BASE + '/__reset')).ok()).toBe(true);
  expect((await request.get(CROSS_ORIGIN + '/__reset')).ok()).toBe(true);
});

test.afterEach(async ({ runtimeErrors }, testInfo) => {
  const known = knownFailures.get(testInfo);
  expect(runtimeErrors, 'Unexpected browser errors').toEqual(known ? known.errors : []);
});

async function gotoFixture(page) {
  await page.goto('/');
  await expect(page.locator('#title')).toHaveText('Hello world');
}

async function requests(request, origin = BASE) {
  const response = await request.get(origin + '/__requests');
  expect(response.ok()).toBe(true);
  return response.json();
}

function onlyKnownErrors(errors, message) {
  return errors.length > 0 && errors.every((error) => error === 'PAGEERROR: ' + message);
}

// Only the reproduced failure signature is expected. Setup errors, other browser
// errors and different assertion failures must still fail the command.
async function knownIssue(testInfo, errors, reason, assertion, matchesFailure) {
  try {
    await assertion();
  } catch (error) {
    if (error.matcherResult && await matchesFailure()) {
      knownFailures.set(testInfo, { reason, errors: [...errors] });
    }
    throw error;
  }
}

test('static translation, language selector and local API request', async ({ page, request }) => {
  await gotoFixture(page);
  await expect(page.locator('#p1')).toHaveText('This is a test.');
  await expect(page.locator('#p2')).toHaveText('Second paragraph: more content.');
  for (const language of ['chinese_simplified', 'english', 'spanish']) {
    await expect(page.locator(`select.translateSelectLanguage option[value="${language}"]`)).toHaveCount(1);
  }
  expect(await requests(request)).toEqual(expect.arrayContaining([
    expect.objectContaining({ to: 'english', texts: expect.arrayContaining(['你好世界']) })
  ]));
});

test('ignore rules and default attribute translation', async ({ page, request }) => {
  await gotoFixture(page);
  const ignored = [
    ['#ignore-class', '忽略我'],
    ['#ignore-id', '忽略我ID'],
    ['#ignore-code', '忽略我CODE'],
    ['#ignore-text', '忽略我TEXT']
  ];
  for (const [selector, text] of ignored) {
    await expect(page.locator(selector)).toHaveText(text);
  }
  await expect(page.locator('#inp')).toHaveAttribute('placeholder', 'Please enter');
  await expect(page.locator('#inp')).toHaveAttribute('title', 'Title');
  await expect(page.locator('#img')).toHaveAttribute('alt', 'Image description');
  await expect(page.locator('#inp')).toHaveValue('按钮');
  const sent = (await requests(request)).flatMap((request) => request.texts);
  for (const [, text] of ignored) expect(sent).not.toContain(text);
});

test('input value translation can be enabled through tagAttribute', async ({ page }) => {
  await gotoFixture(page);
  await page.evaluate(() => {
    translate.element.tagAttribute.input = { attribute: ['value'], condition: () => true };
    translate.execute();
  });
  await expect(page.locator('#inp')).toHaveValue('Button');
});

test('dynamic childList insertion is translated', async ({ page }) => {
  await gotoFixture(page);
  await page.locator('#add-dynamic').click();
  await expect(page.locator('#dynamic-p')).toHaveText('Dynamic content');
});

test('dynamic characterData changes are translated', async ({ page }) => {
  await gotoFixture(page);
  await page.locator('#change-text').click();
  await expect(page.locator('#p1')).toHaveText('Dynamic content');
});

test('language switches to Spanish and back without reloading', async ({ page }) => {
  await gotoFixture(page);
  await page.evaluate(() => {
    window.__alive = true;
    translate.changeLanguage('spanish');
  });
  await expect(page.locator('#title')).toHaveText('Hola mundo');
  expect(await page.evaluate(() => window.__alive)).toBe(true);
  await page.evaluate(() => translate.changeLanguage('english'));
  await expect(page.locator('#title')).toHaveText('Hello world');
  await expect(page.locator('#p1')).toHaveText('This is a test.');
  expect(await page.evaluate(() => window.__alive)).toBe(true);
});

test('cache reload restores translated content without a translation request', async ({ page, request }) => {
  await gotoFixture(page);
  await expect(page.locator('#p1')).toHaveText('This is a test.');
  await expect(page.locator('#p2')).toHaveText('Second paragraph: more content.');
  const keys = await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('hash_english_')));
  expect(keys.length).toBeGreaterThan(0);

  await request.get(BASE + '/__reset');
  await page.reload();
  // No requests alone is not a cache hit: the translated DOM must be correct.
  await expect(page.locator('#title')).toHaveText('Hello world');
  await expect(page.locator('#p1')).toHaveText('This is a test.');
  await expect(page.locator('#p2')).toHaveText('Second paragraph: more content.');
  await expect(page.locator('#inp')).toHaveAttribute('placeholder', 'Please enter');
  await expect(page.locator('#img')).toHaveAttribute('alt', 'Image description');
  expect(await requests(request)).toEqual([]);
});

test('translation continues when localStorage quota is exhausted', async ({ page, runtimeErrors }, testInfo) => {
  await gotoFixture(page);
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    window.__quotaHits = 0;
    Storage.prototype.setItem = function (key, value) {
      if (String(key).startsWith('hash_')) {
        window.__quotaHits++;
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      }
      return original.call(this, key, value);
    };
  });
  await page.locator('#add-dynamic').click();
  await knownIssue(testInfo, runtimeErrors, 'Core storage.set does not guard QuotaExceededError',
    () => expect(page.locator('#dynamic-p')).toHaveText('Dynamic content'),
    async () => onlyKnownErrors(runtimeErrors, 'Quota exceeded') &&
      await page.evaluate(() => window.__quotaHits > 0 && document.querySelector('#dynamic-p').textContent === '动态内容')
  );
});

for (const operation of ['write', 'read', 'access']) {
  test(`translation continues when localStorage ${operation} is disabled`, async ({ page, runtimeErrors }, testInfo) => {
    await page.addInitScript((operation) => {
      window.__storageFaultHits = 0;
      const fail = () => {
        window.__storageFaultHits++;
        throw new DOMException(`Storage ${operation} disabled`, 'SecurityError');
      };
      if (operation === 'access') {
        Object.defineProperty(window, 'localStorage', { configurable: true, get: fail });
      } else {
        Storage.prototype[operation === 'write' ? 'setItem' : 'getItem'] = fail;
      }
    }, operation);
    await page.goto('/');
    await knownIssue(testInfo, runtimeErrors, `Core does not guard localStorage ${operation} failures`,
      () => expect(page.locator('#title')).toHaveText('Hello world'),
      async () => onlyKnownErrors(runtimeErrors, `Storage ${operation} disabled`) &&
        await page.evaluate(() => window.__storageFaultHits > 0 && document.querySelector('#title').textContent === '你好世界')
    );
  });
}

test('same-origin iframe content is injected and translated', async ({ page }) => {
  await page.goto('/iframe-parent.html');
  const child = page.frameLocator('#child');
  await expect(child.locator('#blank-title')).toHaveText('Hello world');
  await expect(child.locator('#blank-p')).toHaveText('This is a test.');
});

test('nested iframe is translated when only its middle page loads translate.js', async ({ page, runtimeErrors }, testInfo) => {
  await page.goto('/nested-top.html');
  const middle = page.frameLocator('#middle');
  const innerTitle = middle.frameLocator('#inner').locator('#blank-title');
  await expect(middle.locator('#middle-title')).toHaveText('Hello world');
  await knownIssue(testInfo, runtimeErrors, 'Nested injection reads parent.translate.config instead of its own config',
    () => expect(innerTitle).toHaveText('Hello world'),
    async () => onlyKnownErrors(runtimeErrors, "Cannot read properties of undefined (reading 'config')") &&
      await innerTitle.textContent() === '你好世界'
  );
});

async function crossOriginChild(page) {
  await page.goto('/cross-origin-parent.html');
  const child = page.frameLocator('#child');
  await expect(child.locator('#iframe-title')).toHaveText('Hello world');
  return child;
}

async function sendLanguage(page, language) {
  await page.evaluate(({ language, origin }) => {
    document.querySelector('#child').contentWindow.postMessage({
      type: 'translate-js-iframe-changeLanguage', language
    }, origin);
  }, { language, origin: CROSS_ORIGIN });
}

test('cross-origin language messages follow the documented permissive default', async ({ page }) => {
  const child = await crossOriginChild(page);
  await sendLanguage(page, 'spanish');
  await expect(child.locator('#iframe-title')).toHaveText('Hola mundo');
});

test('an explicit origin allowlist rejects and permits cross-origin messages', async ({ page }) => {
  const child = await crossOriginChild(page);
  const frame = page.frames().find((frame) => frame.url() === CROSS_ORIGIN + '/iframe.html');
  expect(frame).toBeTruthy();
  await frame.evaluate(() => {
    translate.postMessage.allowedOrigins = [location.origin];
    window.__languageCalls = [];
    window.__messageReceived = false;
    const original = translate.changeLanguage;
    translate.changeLanguage = function (...args) {
      window.__languageCalls.push(args[0]);
      return original.apply(this, args);
    };
    // This handler runs after the core handler, so rejection is checked after
    // message delivery, rather than after an arbitrary sleep.
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'translate-js-iframe-changeLanguage') {
        window.__messageReceived = true;
      }
    });
  });
  await sendLanguage(page, 'spanish');
  await expect.poll(() => frame.evaluate(() => window.__messageReceived)).toBe(true);
  expect(await frame.evaluate(() => window.__languageCalls)).toEqual([]);
  await expect(child.locator('#iframe-title')).toHaveText('Hello world');

  await frame.evaluate((origin) => { translate.postMessage.allowedOrigins = [origin]; }, BASE);
  await sendLanguage(page, 'spanish');
  await expect(child.locator('#iframe-title')).toHaveText('Hola mundo');
  expect(await frame.evaluate(() => window.__languageCalls)).toContain('spanish');
});

test('initial open Shadow DOM content is translated', async ({ page, runtimeErrors }, testInfo) => {
  await gotoFixture(page);
  const shadowText = page.locator('#shadow-host #shadow-p');
  await knownIssue(testInfo, runtimeErrors, 'Core DOM traversal does not enter open shadow roots',
    () => expect(shadowText).toHaveText('Dynamic content'),
    async () => runtimeErrors.length === 0 && await shadowText.textContent() === '动态内容'
  );
});

test('dynamically inserted open Shadow DOM content is translated', async ({ page, runtimeErrors }, testInfo) => {
  await gotoFixture(page);
  await page.evaluate(() => {
    const node = document.createElement('p');
    node.id = 'shadow-dynamic';
    node.textContent = '动态内容';
    document.querySelector('#shadow-host').shadowRoot.appendChild(node);
  });
  await page.locator('#add-dynamic').click();
  await expect(page.locator('#dynamic-p')).toHaveText('Dynamic content');
  const added = page.locator('#shadow-host #shadow-dynamic');
  await knownIssue(testInfo, runtimeErrors, 'Core listener does not observe mutations inside open shadow roots',
    () => expect(added).toHaveText('Dynamic content'),
    async () => runtimeErrors.length === 0 && await added.textContent() === '动态内容'
  );
});

test('optional clearCache removes translation entries and preserves unrelated storage', async ({ page }) => {
  await gotoFixture(page);
  const supported = await page.evaluate(() => typeof translate.storage.clearCache === 'function');
  test.skip(!supported, 'clearCache is a proposed API, not part of the current core contract');
  const result = await page.evaluate(async () => {
    localStorage.setItem('__e2e_business_setting', 'keep');
    localStorage.setItem('hash_english_e2e_sentinel', 'cached');
    const before = Object.keys(localStorage).filter((key) => key.startsWith('hash_'));
    const otherEntries = Object.fromEntries(Object.keys(localStorage)
      .filter((key) => !key.startsWith('hash_')).map((key) => [key, localStorage.getItem(key)]));
    await translate.storage.clearCache();
    return {
      before,
      remaining: Object.keys(localStorage).filter((key) => key.startsWith('hash_')),
      otherEntries,
      afterEntries: Object.fromEntries(Object.keys(otherEntries).map((key) => [key, localStorage.getItem(key)]))
    };
  });
  expect(result.before.length).toBeGreaterThan(0);
  expect(result.remaining).toEqual([]);
  expect(result.afterEntries).toEqual(result.otherEntries);
});
