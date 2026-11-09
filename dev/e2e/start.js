'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = __dirname;
const REPORT = path.join(ROOT, 'report', 'results.json');

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, { cwd: ROOT, env, stdio: 'inherit', windowsHide: true });
  if (result.error) throw result.error;
  return result.status === null ? 1 : result.status;
}

function dependenciesReady() {
  try {
    const lock = JSON.parse(fs.readFileSync(path.join(ROOT, 'package-lock.json'), 'utf8'));
    const declared = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).devDependencies;
    for (const name of ['@playwright/test', 'playwright', 'playwright-core']) {
      const locked = lock.packages['node_modules/' + name].version;
      const installed = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules', name, 'package.json'), 'utf8')).version;
      if (installed !== locked || (declared[name] && declared[name] !== locked)) return false;
    }
    return fs.existsSync(path.join(ROOT, 'node_modules', '@playwright', 'test', 'cli.js'));
  } catch {
    return false;
  }
}

function installDependencies() {
  console.log('正在安装锁定版本的测试依赖，首次运行需要联网。');
  const args = ['ci', '--include=dev', '--ignore-scripts', '--no-audit', '--no-fund'];
  if (process.platform !== 'win32') return run('npm', args);
  const npmPaths = [path.dirname(process.execPath)];
  const found = spawnSync('where.exe', ['npm.cmd'], { encoding: 'utf8', windowsHide: true });
  if (found.status === 0) npmPaths.push(...found.stdout.trim().split(/\r?\n/).map((file) => path.dirname(file)));
  const cli = npmPaths.map((directory) => path.join(directory, 'node_modules', 'npm', 'bin', 'npm-cli.js'))
    .find((file) => fs.existsSync(file));
  return cli ? run(process.execPath, [cli, ...args]) :
    run(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', 'npm.cmd ci --include=dev --ignore-scripts --no-audit --no-fund']);
}

function browserCache() {
  const configured = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (configured === '0') return path.join(path.dirname(require.resolve('playwright-core/package.json')), '.local-browsers');
  if (configured) return path.resolve(ROOT, configured);
  if (process.platform === 'win32') {
    return path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'), 'ms-playwright');
  }
  if (process.platform === 'darwin') return path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright');
  return path.join(process.env.XDG_CACHE_HOME || path.join(os.homedir(), '.cache'), 'ms-playwright');
}

async function chooseBrowser() {
  const { chromium } = require('playwright');
  async function canLaunch(executablePath) {
    try {
      const browser = await chromium.launch({ headless: true, timeout: 10000, ...(executablePath ? { executablePath } : {}) });
      await browser.close();
      return true;
    } catch {
      return false;
    }
  }

  const custom = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  if (custom) {
    if (!fs.existsSync(custom) || !await canLaunch(custom)) {
      throw new Error('PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH 指定的浏览器不存在或无法启动：' + custom);
    }
    console.log('使用指定的浏览器：' + custom);
    return custom;
  }
  if (await canLaunch()) return undefined;

  const cache = browserCache();
  const directories = fs.existsSync(cache) ? fs.readdirSync(cache)
    .filter((name) => /^(chromium_headless_shell|chromium)-\d+$/.test(name))
    .sort((a, b) => Number(b.split('-').pop()) - Number(a.split('-').pop())) : [];
  const executables = process.platform === 'win32' ? [
    'chrome-headless-shell-win64/chrome-headless-shell.exe', 'chrome-win64/chrome.exe', 'chrome-win/chrome.exe'
  ] : process.platform === 'darwin' ? [
    'chrome-headless-shell-mac-arm64/chrome-headless-shell', 'chrome-headless-shell-mac-x64/chrome-headless-shell',
    'chrome-mac/Chromium.app/Contents/MacOS/Chromium'
  ] : ['chrome-headless-shell-linux64/chrome-headless-shell', 'chrome-linux/headless_shell', 'chrome-linux/chrome'];
  for (const directory of directories) {
    for (const relative of executables) {
      const file = path.join(cache, directory, relative);
      if (fs.existsSync(file) && await canLaunch(file)) {
        console.log('固定版本浏览器尚未安装，本次使用可运行的本机缓存浏览器：' + file);
        return file;
      }
    }
  }

  console.log('正在下载测试浏览器，首次运行需要联网。');
  const code = run(process.execPath, [path.join(ROOT, 'node_modules', 'playwright', 'cli.js'),
    'install', 'chromium', '--only-shell'], { ...process.env, PLAYWRIGHT_SKIP_BROWSER_GC: '1' });
  if (code !== 0) throw new Error('测试浏览器下载失败。请检查网络后重新双击 test.bat。');
  if (!await canLaunch()) throw new Error('测试浏览器已下载，但无法启动，请查看上方输出。');
  return undefined;
}

function printSummary() {
  if (!fs.existsSync(REPORT)) {
    console.error('未生成测试报告，请查看上方错误信息。');
    return;
  }
  const report = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
  const counts = { passed: 0, known: 0, skipped: 0, failed: 0 };
  function visit(suite) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        if (test.status === 'skipped') counts.skipped++;
        else if (test.status === 'unexpected' || test.status === 'flaky') counts.failed++;
        else if (test.expectedStatus === 'failed') counts.known++;
        else counts.passed++;
      }
    }
    for (const child of suite.suites || []) visit(child);
  }
  visit(report);
  console.log(`\n测试统计：正常通过 ${counts.passed}，已知失败 ${counts.known}，跳过 ${counts.skipped}，意外失败 ${counts.failed}。`);
  if (counts.known) console.log('“已知失败”仍是未修复的问题；本次运行只豁免了符合已记录特征的故障。');
  console.log('详细报告：' + REPORT);
}

async function main() {
  process.chdir(ROOT);
  if (Number(process.versions.node.split('.')[0]) < 20) throw new Error('请安装 Node.js 20 或更新版本后再运行 test.bat。');
  if (!dependenciesReady()) {
    if (installDependencies() !== 0 || !dependenciesReady()) throw new Error('测试依赖安装失败，请检查网络和 npm 后重试。');
  }
  const executablePath = await chooseBrowser();
  if (fs.existsSync(REPORT)) fs.unlinkSync(REPORT);
  const args = process.argv.slice(2).filter((arg) => arg !== '--no-pause');
  const strict = args.includes('--strict');
  const forwarded = args.filter((arg) => arg !== '--strict');
  console.log('\n开始测试当前目录中的 translate.js：' + path.resolve(ROOT, '../../translate.js/translate.js'));
  const code = run(process.execPath, [path.join(ROOT, 'node_modules', '@playwright', 'test', 'cli.js'),
    'test', '--project=' + (strict ? 'strict' : 'chromium'), ...forwarded],
  { ...process.env, ...(executablePath ? { PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH: executablePath } : {}) });
  printSummary();
  process.exitCode = code;
}

main().catch((error) => {
  console.error('\n自动化测试未完成：' + error.message);
  process.exitCode = 1;
});
