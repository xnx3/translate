'use strict';

const path = require('path');
const { test: base, expect } = require('@playwright/test');

// 每个用例沿用 Playwright 的独立浏览器上下文，避免前一项的全局变量、
// localStorage、IndexedDB、监听器或定时器影响下一项。浏览器进程仍可复用。
const test = base.extend({
  browserErrors: [async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await use(errors);
    // 自定义 test 即使返回 true，未处理的浏览器异常也不能被忽略。
    expect(errors, '浏览器不应出现未处理的异常').toStrictEqual([]);
  }, { auto: true }]
});

module.exports = function registerModule(filename, cases) {
  const method = path.basename(filename, '.js');
  if (!Array.isArray(cases) || cases.length === 0) {
    throw new Error(method + ' 必须提供非空用例数组');
  }

  cases.forEach((item, index) => {
    const title = `${method} / ${index + 1}. ${item.remark}`;
    const custom = Object.hasOwn(item, 'test');
    const fields = custom ? ['remark', 'test'] : ['remark', 'args', 'expected'];
    // 检查字段存在性，不能把 false、0、空字符串或 undefined 的预期误当缺失。
    // 同时拒绝约定之外的字段，避免旧 name/id 或拼错的字段被悄悄忽略。
    if (typeof item.remark !== 'string' || !item.remark.trim() ||
        Object.keys(item).some(field => !fields.includes(field)) ||
        (custom ? typeof item.test !== 'function' || Object.hasOwn(item, 'args') || Object.hasOwn(item, 'expected') :
          !Array.isArray(item.args) || !Object.hasOwn(item, 'expected'))) {
      throw new Error(method + ' / ' + title + ' 的用例格式不符合 README 约定');
    }

    test(title, async ({ page }, testInfo) => {
      const build = testInfo.project.metadata.build;
      expect(['translate.js', 'translate.min.js']).toContain(build);

      // 使用已有的同源空白页面，保留真实浏览器 API；不启动整页自动翻译。
      // 直接加载本次项目选择的发布文件，不复制函数、不改写源代码。
      await page.goto('/iframe-blank.html');
      await page.evaluate(() => document.body.replaceChildren());
      await page.addScriptTag({ url: '/' + build });
      await page.evaluate(() => {
        // 方法触发接口时也使用本地模拟服务，不依赖真实翻译服务。
        translate.request.api.host = [location.origin + '/'];
        translate.request.api.connectTest = '';
        translate.request.api.init = '';
        translate.request.api.language = 'language.json';
        translate.request.api.translate = 'translate.json';
      });

      if (custom) {
        // Playwright 在浏览器执行函数并等待 Promise；只有布尔 true 通过。
        // false、漏写 return、其他类型、抛错和超时都保留为真实失败。
        expect(await page.evaluate(item.test)).toBe(true);
      } else {
        const actual = await page.evaluate(async ({ method, args }) => {
          const parts = method.split('.');
          let owner = translate;
          for (const part of parts.slice(0, -1)) owner = owner[part];
          // 保留所属对象作为 this，兼容依赖 this 的方法及异步返回值。
          return await owner[parts[parts.length - 1]].apply(owner, args);
        }, { method, args: item.args });
        expect(actual).toStrictEqual(item.expected);
      }
    });
  });
};
