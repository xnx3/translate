'use strict';

const { test: base, expect } = require('@playwright/test');

const test = base.extend({
  page: async ({ page, context }, use, testInfo) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // 场景可通过 page.route 提供服务端回包。未模拟的外站请求不能访问真实供应商。
    await context.route(/^https?:\/\//, route => {
      const host = new URL(route.request().url()).hostname;
      return ['localhost', '127.0.0.1', '[::1]'].includes(host) ? route.continue() : route.abort();
    });
    await page.goto('/iframe-blank.html');
    await page.evaluate(() => document.body.replaceChildren());
    const build = testInfo.project.metadata.build;
    expect(['translate.js', 'translate.min.js']).toContain(build);
    await page.addScriptTag({ url: '/' + build });
    await page.evaluate(() => {
      Object.assign(translate.request.api, {
        host: [location.origin + '/'], connectTest: '', init: '',
        language: 'language.json', translate: 'translate.json'
      });
    });
    await use(page);
    expect(errors, '页面不应出现未处理异常').toEqual([]);
  }
});

module.exports = { test, expect };
