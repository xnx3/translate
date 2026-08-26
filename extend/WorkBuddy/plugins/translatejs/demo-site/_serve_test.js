'use strict';
// 启动本地静态服务，验证 index.html 与 translate.js 均可访问（模拟真实部署）
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = 8099;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) {
    res.writeHead(404); res.end('404'); return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'text/plain' });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, async () => {
  const base = 'http://127.0.0.1:' + PORT;
  try {
    const r1 = await fetch(base + '/');
    const t1 = await r1.text();
    console.log('GET /                     ->', r1.status, '| bytes:', t1.length, '| 含接入脚本:', t1.includes('translate.execute();'));
    const r2 = await fetch(base + '/assets/js/translate.js');
    const t2 = await r2.text();
    console.log('GET /assets/js/translate.js ->', r2.status, '| bytes:', t2.length, '| Content-Type:', r2.headers.get('content-type'));
    console.log('  开头为官方注释:', t2.slice(0, 40).includes('translate') || t2.includes('translate.js') || t2.length > 500000);
  } catch (e) {
    console.log('❌ 请求失败:', e.message);
  }
  server.close();
});
