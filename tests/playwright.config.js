'use strict';

const { defineConfig } = require('@playwright/test');

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

module.exports = defineConfig({
  testDir: __dirname,
  //只发现方法模块和完整场景，避免将启动器、辅助代码或模拟服务当成测试。
  //modules 保持平铺；新增 method.path.js 文件后会自动加入两份发布文件的测试。
  testMatch: ['**/modules/*.js', '**/scenarios/*.js'],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: 20000,
  expect: { timeout: 5000 },
  outputDir: 'test-results',
  reporter: [
    ['list'],
    ['json', { outputFile: 'report/results.json' }]
  ],
  use: {
    baseURL: 'http://127.0.0.1:8123',
    headless: true,
    viewport: { width: 1280, height: 900 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: executablePath ? { executablePath } : {}
  },
  projects: [
    {
      name: 'chromium',
      metadata: { build: 'translate.js', strict: false },
      use: { browserName: 'chromium', extraHTTPHeaders: { 'x-translate-build': 'translate.js' } }
    },
    {
      name: 'chromium-minified',
      metadata: { build: 'translate.min.js', strict: false },
      use: { browserName: 'chromium', extraHTTPHeaders: { 'x-translate-build': 'translate.min.js' } }
    },
    {
      name: 'strict',
      metadata: { build: 'translate.js', strict: true },
      use: { browserName: 'chromium', extraHTTPHeaders: { 'x-translate-build': 'translate.js' } }
    },
    {
      name: 'strict-minified',
      metadata: { build: 'translate.min.js', strict: true },
      use: { browserName: 'chromium', extraHTTPHeaders: { 'x-translate-build': 'translate.min.js' } }
    }
  ],
  webServer: [
    {
      command: 'node fixtures/server.js',
      env: { PORT: '8123' },
      url: 'http://127.0.0.1:8123/health',
      reuseExistingServer: false,
      timeout: 10000
    },
    {
      command: 'node fixtures/server.js',
      env: { PORT: '8124' },
      url: 'http://127.0.0.1:8124/health',
      reuseExistingServer: false,
      timeout: 10000
    }
  ]
});
