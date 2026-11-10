'use strict';

const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');
const { test: base, expect } = require('@playwright/test');
const { DEFAULT_PORT, CROSS_ORIGIN_PORT } = require('./server');

const knownFailures = new WeakMap();
const duplicateLoadError = 'PAGEERROR: translate.js 已经加载过一次了，当前是重复加载，避免你的翻译出现异常，已帮你拦截此次加载。本信息只是给你一个提示，你可以检查一下你的项目中是否出现了重复引入 translate.js ，当然，这个异常并不会影响到你的具体使用，它已经自动帮你处理拦截了这个异常，只不过提示出来是让你知道，你的代码里出现了重复引入的情况。';
const forbiddenAccessError = (port) => `PAGEERROR: Failed to read a named property 'translate' from 'Window': Blocked a frame with origin "http://127.0.0.1:${port}" from accessing a cross-origin frame.`;

// Each exception below was reproduced against the unchanged core. A known issue
// only applies when the assertion and its exact DOM/error signature both match;
// strict mode keeps all these assertions as ordinary failures.
const test = base.extend({
  iframeEvidence: [async ({ page }, use, testInfo) => {
    const errors = [];
    const artifactErrors = [];
    const downloads = [];
    const build = testInfo.project.metadata.build;
    const expected = fs.readFileSync(path.resolve(__dirname, '../../translate.js', build));
    const expectedHash = createHash('sha256').update(expected).digest('hex');
    page.on('pageerror', (error) => errors.push('PAGEERROR: ' + error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push('CONSOLE: ' + message.text());
    });
    page.on('response', (response) => {
      const pathname = new URL(response.url()).pathname;
      if (!['/translate.js', '/translate.min.js'].includes(pathname)) return;
      downloads.push((async () => {
        expect(pathname, 'Every frame must use the selected release artifact').toBe('/' + build);
        expect(response.status()).toBe(200);
        expect(createHash('sha256').update(await response.body()).digest('hex'),
          'The iframe must execute the checked-out artifact bytes').toBe(expectedHash);
      })().catch((error) => artifactErrors.push(error.message)));
    });
    await use({ errors });
    // Drain promises that response handlers append while earlier bodies finish.
    for (let i = 0; i < downloads.length; i++) await downloads[i];
    expect(downloads.length, 'At least one frame must load the selected artifact').toBeGreaterThan(0);
    expect(artifactErrors, 'Release artifact verification').toEqual([]);
    const known = knownFailures.get(testInfo);
    expect(errors, 'Unexpected iframe browser errors').toEqual(known ? known.errors : []);
    // Classify only after artifact checks and the final browser-error comparison.
    // An extra assertion, late error, or bad artifact must fail in every mode.
    if (known && !testInfo.project.metadata.strict && testInfo.errors.length === 1 &&
        sameErrors(errors, known.errors)) {
      test.fail(true, known.reason);
    }
  }, { auto: true }]
});

function sameErrors(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

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

async function untranslatedSignature(frame, build, scriptCount) {
  return frame.evaluate(({ build, scriptCount }) => window.__frameReady === true &&
    document.querySelector('#frame-title').textContent === '你好世界' &&
    document.querySelector('#frame-p').textContent === '这是一个测试。' &&
    document.querySelectorAll(`script[src="/${build}"]`).length === scriptCount,
  { build, scriptCount });
}

async function knownMissingInjection(frame, testInfo, errors, reason) {
  await knownIssue(testInfo, errors, reason, () => translated(frame),
    async () => sameErrors(errors, []) &&
      await untranslatedSignature(frame, testInfo.project.metadata.build, 0));
}

async function knownWrongParent(frame, testInfo, errors, expectedError) {
  await knownIssue(testInfo, errors, 'Nested iframe configuration is read from the injector ancestor',
    () => translated(frame),
    async () => sameErrors(errors, [expectedError]) &&
      await untranslatedSignature(frame, testInfo.project.metadata.build, 1));
}

async function openSuite(page, scenario) {
  await page.goto('/iframe-suite.html?scenario=' + scenario);
  await expect.poll(() => page.evaluate(() => window.__suiteReady === true)).toBe(true);
}

async function frameAt(parent, selector) {
  const handle = await parent.locator(selector).elementHandle();
  expect(handle, 'The requested iframe element must exist').toBeTruthy();
  const frame = await handle.contentFrame();
  expect(frame, 'The iframe browsing context must exist').toBeTruthy();
  await expect.poll(() => frame.evaluate(() => window.__frameReady === true)).toBe(true);
  return frame;
}

async function translated(frame) {
  await expect(frame.locator('#frame-title')).toHaveText('Hello world');
  await expect(frame.locator('#frame-p')).toHaveText('This is a test.');
}

async function oneScript(frame, build) {
  await expect(frame.locator(`script[src="/${build}"]`)).toHaveCount(1);
}

async function addDynamicFrame(page) {
  await openSuite(page, 'dynamic');
  await page.locator('#add-frame').click();
  const frame = await frameAt(page, '#child');
  await translated(frame);
  return frame;
}

test('iframe static src is injected when scanning starts before its load event', async ({ page, iframeEvidence }, testInfo) => {
  await openSuite(page, 'static');
  const frame = await frameAt(page, '#child');
  await knownMissingInjection(frame, testInfo, iframeEvidence.errors, 'Initial iframe elements are not discovered by the baseline traversal');
  await oneScript(frame, testInfo.project.metadata.build);
});

test('iframe with an already loaded src is translated when the parent starts later', async ({ page, iframeEvidence }, testInfo) => {
  await openSuite(page, 'loaded');
  const frame = await frameAt(page, '#child');
  await knownMissingInjection(frame, testInfo, iframeEvidence.errors, 'An existing iframe is not injected when the parent starts after its load');
  await oneScript(frame, testInfo.project.metadata.build);
});

test('iframe dynamically appended with src is discovered and injected', async ({ page }, testInfo) => {
  const frame = await addDynamicFrame(page);
  await oneScript(frame, testInfo.project.metadata.build);
});

test('iframe without src translates its same-origin document', async ({ page }, testInfo) => {
  await openSuite(page, 'blank');
  const frame = await frameAt(page, '#child');
  expect(await page.locator('#child').getAttribute('src')).toBeNull();
  await translated(frame);
  await oneScript(frame, testInfo.project.metadata.build);
});

test('iframe srcdoc translates its inherited-origin document', async ({ page, iframeEvidence }, testInfo) => {
  await openSuite(page, 'srcdoc');
  const frame = await frameAt(page, '#child');
  expect(frame.url()).toBe('about:srcdoc');
  await knownMissingInjection(frame, testInfo, iframeEvidence.errors, 'The baseline does not inject the about:srcdoc document');
  await oneScript(frame, testInfo.project.metadata.build);
});

test('iframe siblings are each injected once and translated independently', async ({ page }, testInfo) => {
  await openSuite(page, 'siblings');
  for (const [selector, marker] of [['#child', 'first'], ['#child-2', 'second']]) {
    const frame = await frameAt(page, selector);
    await expect(frame.locator('#frame-marker')).toHaveText(marker);
    await translated(frame);
    await oneScript(frame, testInfo.project.metadata.build);
  }
});

test('iframe that loads translate itself keeps its own configuration without duplicate injection', async ({ page }, testInfo) => {
  await openSuite(page, 'existing');
  await page.locator('#add-frame').click();
  const frame = await frameAt(page, '#child');
  await translated(frame);
  await oneScript(frame, testInfo.project.metadata.build);
  expect(await frame.evaluate(() => ({
    owner: translate.request.appendParams.__e2e_owner,
    show: translate.selectLanguageTag.show,
    ignored: translate.ignore.text.includes('忽略我TEXT')
  }))).toEqual({ owner: 'child', show: false, ignored: true });
  await expect(frame.locator('#frame-ignored')).toHaveText('忽略我TEXT');
});

test('iframe repeated scans do not insert a second script into a loaded src document', async ({ page }, testInfo) => {
  const frame = await addDynamicFrame(page);
  await page.evaluate(() => {
    const iframe = document.querySelector('#child');
    for (let i = 0; i < 3; i++) translate.element.iframe.execute(iframe);
  });
  await translated(frame);
  await oneScript(frame, testInfo.project.metadata.build);
});

test('iframe navigation to another same-origin document reinjects into the new document', async ({ page }, testInfo) => {
  const frame = await addDynamicFrame(page);
  await Promise.all([
    frame.waitForURL('**/iframe-suite-child.html?marker=navigated'),
    page.locator('#child').evaluate((iframe) => { iframe.src = '/iframe-suite-child.html?marker=navigated'; })
  ]);
  await expect(frame.locator('#frame-marker')).toHaveText('navigated');
  await translated(frame);
  await oneScript(frame, testInfo.project.metadata.build);
});

test('iframe reload reinjects once into the replacement document', async ({ page }, testInfo) => {
  const frame = await addDynamicFrame(page);
  await Promise.all([
    page.waitForEvent('framenavigated', { predicate: (navigated) => navigated === frame }),
    frame.evaluate(() => location.reload())
  ]);
  await expect.poll(() => frame.evaluate(() => window.__frameReady === true)).toBe(true);
  await translated(frame);
  await oneScript(frame, testInfo.project.metadata.build);
});

test('iframe removal and a new element at the same location still translate', async ({ page }, testInfo) => {
  const original = await addDynamicFrame(page);
  await page.locator('#child').evaluate((iframe) => iframe.remove());
  await expect.poll(() => original.isDetached()).toBe(true);
  await page.locator('#add-frame').click();
  const replacement = await frameAt(page, '#child');
  expect(replacement).not.toBe(original);
  await translated(replacement);
  await oneScript(replacement, testInfo.project.metadata.build);
});

test('iframe injected configuration enables translation of later DOM additions', async ({ page }) => {
  const frame = await addDynamicFrame(page);
  await frame.locator('#add-content').click();
  await expect(frame.locator('#frame-dynamic')).toHaveText('Dynamic content');
});

test('iframe language switches repeatedly after injection without reloading', async ({ page }) => {
  const frame = await addDynamicFrame(page);
  await frame.evaluate(() => translate.changeLanguage('spanish'));
  await expect(frame.locator('#frame-title')).toHaveText('Hola mundo');
  await expect(frame.locator('#frame-p')).toHaveText('Esta es una prueba.');
  await frame.evaluate(() => translate.changeLanguage('english'));
  await translated(frame);
});

test('iframe nested under a parent without translate inherits its immediate injector configuration', async ({ page, iframeEvidence }, testInfo) => {
  await openSuite(page, 'nested-empty');
  const middle = page.frameLocator('#middle');
  await expect(middle.locator('#suite-title')).toHaveText('Chinese paragraph.');
  await middle.locator('#add-inner').click();
  const inner = await frameAt(middle, '#inner');
  await knownWrongParent(inner, testInfo, iframeEvidence.errors,
    "PAGEERROR: Cannot read properties of undefined (reading 'get')");
  await oneScript(inner, testInfo.project.metadata.build);
  expect(await inner.evaluate(() => translate.request.appendParams.__e2e_owner)).toBe('middle');
});

test('iframe nested configuration comes from the middle injector rather than its different ancestor', async ({ page, iframeEvidence }, testInfo) => {
  await openSuite(page, 'nested-config');
  const middle = page.frameLocator('#middle');
  await expect(middle.locator('#suite-title')).toHaveText('Chinese paragraph.');
  await middle.locator('#add-inner').click();
  const inner = await frameAt(middle, '#inner');
  await translated(inner);
  await oneScript(inner, testInfo.project.metadata.build);
  const inherited = await inner.evaluate(() => ({
    owner: translate.request.appendParams.__e2e_owner,
    show: translate.selectLanguageTag.show,
    ignored: translate.ignore.text.includes('忽略我TEXT')
  }));
  await knownIssue(testInfo, iframeEvidence.errors, 'The nested iframe incorrectly inherits the outer ancestor configuration',
    async () => expect(inherited).toEqual({ owner: 'middle', show: false, ignored: true }),
    async () => sameErrors(iframeEvidence.errors, []) &&
      JSON.stringify(inherited) === JSON.stringify({ owner: 'outer', show: true, ignored: false }) &&
      await inner.locator('#frame-title').textContent() === 'Hello world' &&
      await inner.locator('#frame-p').textContent() === 'This is a test.' &&
      await inner.locator('#frame-ignored').textContent() === 'IGNORE_ME TEXT');
  await expect(inner.locator('#frame-ignored')).toHaveText('忽略我TEXT');
  await expect(inner.locator('select.translateSelectLanguage')).toHaveCount(0);
});

test('iframe injection works below multiple ancestors that never loaded translate', async ({ page, iframeEvidence }, testInfo) => {
  await openSuite(page, 'deep-empty');
  const middle = page.frameLocator('#wrapper').frameLocator('#middle');
  await expect(middle.locator('#suite-title')).toHaveText('Chinese paragraph.');
  await middle.locator('#add-inner').click();
  const inner = await frameAt(middle, '#inner');
  await knownWrongParent(inner, testInfo, iframeEvidence.errors,
    "PAGEERROR: Cannot read properties of undefined (reading 'config')");
  await oneScript(inner, testInfo.project.metadata.build);
});

test('iframe cross-origin child is left untouched by same-origin automatic injection', async ({ page }, testInfo) => {
  await openSuite(page, 'cross-child');
  await expect(page.locator('#suite-title')).toHaveText('Chinese paragraph.');
  const child = await frameAt(page, '#child');
  expect(new URL(child.url()).port).toBe(String(CROSS_ORIGIN_PORT));
  await expect(child.locator('#frame-title')).toHaveText('你好世界');
  await expect(child.locator(`script[src="/${testInfo.project.metadata.build}"]`)).toHaveCount(0);
  expect(await child.evaluate(() => typeof window.translate?.version)).toBe('undefined');
});

test('iframe with a cross-origin ancestor can inject its own same-origin child', async ({ page, iframeEvidence }, testInfo) => {
  await openSuite(page, 'cross-ancestor');
  const middle = page.frameLocator('#middle');
  await expect(middle.locator('#suite-title')).toHaveText('Chinese paragraph.');
  await middle.locator('#add-inner').click();
  const inner = await frameAt(middle, '#inner');
  await knownWrongParent(inner, testInfo, iframeEvidence.errors, forbiddenAccessError(CROSS_ORIGIN_PORT));
  await oneScript(inner, testInfo.project.metadata.build);
  expect(await inner.evaluate(() => translate.request.appendParams.__e2e_owner)).toBe('middle');
});

test('iframe automatic injection remains disabled until explicitly enabled', async ({ page }, testInfo) => {
  await openSuite(page, 'disabled');
  await expect(page.locator('#suite-title')).toHaveText('Chinese paragraph.');
  const frame = await frameAt(page, '#child');
  await expect(frame.locator('#frame-title')).toHaveText('你好世界');
  await expect(frame.locator(`script[src="/${testInfo.project.metadata.build}"]`)).toHaveCount(0);
  expect(await frame.evaluate(() => typeof window.translate?.version)).toBe('undefined');
});

test('iframe same-origin child can navigate cross-origin without forbidden window access', async ({ page, iframeEvidence }, testInfo) => {
  const frame = await addDynamicFrame(page);
  const destination = `http://127.0.0.1:${CROSS_ORIGIN_PORT}/iframe-suite-child.html?marker=cross-navigation`;
  await Promise.all([
    frame.waitForURL(destination),
    page.locator('#child').evaluate((iframe, destination) => { iframe.src = destination; }, destination)
  ]);
  await expect(frame.locator('#frame-marker')).toHaveText('cross-navigation');
  await expect(frame.locator('#frame-title')).toHaveText('你好世界');
  await expect(frame.locator(`script[src="/${testInfo.project.metadata.build}"]`)).toHaveCount(0);
  expect(await frame.evaluate(() => typeof window.translate?.version)).toBe('undefined');
  await knownIssue(testInfo, iframeEvidence.errors, 'The installed iframe load handler reads a window after it navigates cross-origin',
    async () => expect(iframeEvidence.errors).toEqual([]),
    async () => sameErrors(iframeEvidence.errors, [forbiddenAccessError(DEFAULT_PORT)]) &&
      await untranslatedSignature(frame, testInfo.project.metadata.build, 0));
});

test('iframe sandbox without same-origin permission is not injected or read as same-origin', async ({ page, iframeEvidence }, testInfo) => {
  await openSuite(page, 'dynamic');
  await page.evaluate(() => {
    const frame = document.createElement('iframe');
    frame.id = 'sandboxed';
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.src = '/iframe-suite-child.html?marker=sandboxed';
    frame.addEventListener('load', () => { window.__sandboxLoaded = true; });
    document.querySelector('#frame-host').appendChild(frame);
  });
  await expect.poll(() => page.evaluate(() => window.__sandboxLoaded === true)).toBe(true);
  const frame = await frameAt(page, '#sandboxed');
  await expect(frame.locator('#frame-title')).toHaveText('你好世界');
  await expect(frame.locator(`script[src="/${testInfo.project.metadata.build}"]`)).toHaveCount(0);
  expect(await frame.evaluate(() => typeof window.translate?.version)).toBe('undefined');
  await knownIssue(testInfo, iframeEvidence.errors, 'The iframe load handler reads an opaque sandbox window',
    async () => expect(iframeEvidence.errors).toEqual([]),
    async () => sameErrors(iframeEvidence.errors, [forbiddenAccessError(DEFAULT_PORT)]) &&
      await untranslatedSignature(frame, testInfo.project.metadata.build, 0));
});

test('iframe without src is not injected twice when scanned repeatedly', async ({ page, iframeEvidence }, testInfo) => {
  await openSuite(page, 'blank');
  const frame = await frameAt(page, '#child');
  await translated(frame);
  await page.evaluate(() => {
    const iframe = document.querySelector('#child');
    for (let i = 0; i < 3; i++) translate.element.iframe.execute(iframe);
  });
  await knownIssue(testInfo, iframeEvidence.errors, 'Repeated scans of a no-src iframe insert duplicate scripts',
    () => oneScript(frame, testInfo.project.metadata.build),
    async () => sameErrors(iframeEvidence.errors, [duplicateLoadError, duplicateLoadError, duplicateLoadError]) &&
      await frame.locator(`script[src="/${testInfo.project.metadata.build}"]`).count() === 4 &&
      await frame.locator('#frame-title').textContent() === 'Hello world' &&
      await frame.locator('#frame-p').textContent() === 'This is a test.');
  await translated(frame);
});
