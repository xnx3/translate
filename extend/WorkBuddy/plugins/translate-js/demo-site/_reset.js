// 清除示例 HTML 中已注入的 translate.js 代码块，便于重新生成（这次带 self_test 自检块）
const fs = require('fs');
const path = require('path');
const HTML = path.join(__dirname, 'index.html');
let html = fs.readFileSync(HTML, 'utf8');
const marker = '<script src="/assets/js/translate.js">';
const idx = html.indexOf(marker);
if (idx < 0) {
  console.log('未找到已注入块，无需清理');
  process.exit(0);
}
const bodyIdx = html.lastIndexOf('</body>');
html = html.slice(0, idx) + html.slice(bodyIdx);
fs.writeFileSync(HTML, html, 'utf8');
console.log('✅ 已清除旧注入块，index.html 回到待接入状态');
