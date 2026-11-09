'use strict';

const { defineConfig } = require('@playwright/test');

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: 'run.js',
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
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'strict', use: { browserName: 'chromium' } }
  ],
  webServer: [
    {
      command: 'node server.js',
      env: { PORT: '8123' },
      url: 'http://127.0.0.1:8123/health',
      reuseExistingServer: false,
      timeout: 10000
    },
    {
      command: 'node server.js',
      env: { PORT: '8124' },
      url: 'http://127.0.0.1:8124/health',
      reuseExistingServer: false,
      timeout: 10000
    }
  ]
});
