'use strict';
// 校验：下载的 translate.js 与生成的 inline 配置脚本，JS 语法是否都有效
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const JS_DIR = path.join(__dirname, 'assets', 'js');
const HTML = path.join(__dirname, 'index.html');
const NODE = 'C:/Users/Administrator/.workbuddy/binaries/node/versions/22.22.2/node.exe';

function check(label, file) {
  try {
    execSync('"' + NODE + '" --check "' + file + '"', { stdio: 'pipe' });
    console.log('✅ ' + label + ' 语法有效: ' + file);
    return true;
  } catch (e) {
    console.log('❌ ' + label + ' 语法错误:\n' + e.stderr.toString());
    return false;
  }
}

// 1) 下载的 translate.js 本体
const ok1 = check('translate.js 源码', path.join(JS_DIR, 'translate.js'));

// 2) 从 index.html 抽取 translate 配置的那个 <script> 内联块做语法校验
const html = fs.readFileSync(HTML, 'utf8');
const m = html.match(/<script>([\s\S]*?translate\.execute[\s\S]*?)<\/script>/);
if (!m) {
  console.log('❌ 未在 index.html 中找到 translate 配置内联脚本');
  process.exit(1);
}
const inlineFile = path.join(__dirname, '_inline_check.js');
fs.writeFileSync(inlineFile, m[1], 'utf8');
const ok2 = check('生成的接入配置脚本', inlineFile);

// 3) 结构检查：script src 路径是否与已下载文件对应
const srcMatch = html.match(/<script src="([^"]+)"><\/script>/);
const src = srcMatch ? srcMatch[1] : '';
console.log('\n路径核对:');
console.log('  <script src> =', src);
const rel = src.replace(/^\//, '');
console.log('  对应本地文件存在:', fs.existsSync(path.join(__dirname, rel)));
console.log('  含 translate.execute:', html.includes('translate.execute();'));
console.log('  含 selectLanguageTag.languages:', html.includes('selectLanguageTag.languages'));
console.log('  含 class="ignore" 切换按钮:', html.includes('class="ignore"'));

process.exit((ok1 && ok2) ? 0 : 1);
