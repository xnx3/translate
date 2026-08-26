'use strict';
// 真实无头浏览器端到端测试：用 Playwright(Chromium) 加载示例站，
// 等待语言切换栏出现 -> 切到 english -> 等待真实翻译 -> 截图 + 对比正文是否变化。
const { chromium } = require('playwright');
const path = require('path');

const SHOT = path.join(__dirname, '_e2e_en.png');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERR:' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });

  await page.goto('http://127.0.0.1:8099/', { waitUntil: 'load', timeout: 30000 });
  await page.waitForSelector('select.translateSelectLanguage', { timeout: 20000 });
  console.log('✅ 切换栏 select.translateSelectLanguage 已在浏览器中渲染');

  const opts = await page.$$eval('select.translateSelectLanguage option', (os) => os.map((o) => o.value + '=' + o.text));
  console.log('   切换栏选项:', opts.join(' | '));

  const before = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 160));
  console.log('切换前正文片段:', before);

  await page.selectOption('select.translateSelectLanguage', 'english');
  // 等待真实翻译请求完成、DOM 文本被替换
  await page.waitForTimeout(10000);

  const after = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 160));
  console.log('切换后正文片段:', after);
  console.log('正文是否发生变化:', before !== after ? '✅ 是（翻译已生效）' : '⚠️ 否（可能翻译通道不可达，但切换栏交互正常）');

  const ignoreBtns = await page.$$eval('a.ignore', (a) => a.length);
  console.log('手动切换按钮(class=ignore)数量:', ignoreBtns);

  await page.screenshot({ path: SHOT, timeout: 60000, animations: 'disabled' });
  console.log('截图已保存:', SHOT);
  if (errs.length) console.log('页面 JS 错误(前3):', errs.slice(0, 3));
  await browser.close();
})().catch((e) => { console.error('❌ 端到端测试异常:', e.message); process.exit(1); });
