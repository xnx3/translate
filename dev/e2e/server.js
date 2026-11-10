'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { renderIframeFixture } = require('./iframe-fixtures');

const CORE = path.resolve(__dirname, '../../translate.js/translate.js');
const MINIFIED = path.resolve(__dirname, '../../translate.js/translate.min.js');
const DEFAULT_PORT = 8123;
const CROSS_ORIGIN_PORT = 8124;
const MAX_BODY_BYTES = 1024 * 1024;

const DICT = {
  '你好世界': { english: 'Hello world', spanish: 'Hola mundo' },
  '这是一个测试。': { english: 'This is a test.', spanish: 'Esta es una prueba.' },
  '动态内容': { english: 'Dynamic content', spanish: 'Contenido dinamico' },
  '第二段：更多内容。': { english: 'Second paragraph: more content.', spanish: 'Segundo parrafo: mas contenido.' },
  '中文段落。': { english: 'Chinese paragraph.', spanish: 'Parrafo chino.' },
  '请输入': { english: 'Please enter', spanish: 'Por favor ingrese' },
  '标题': { english: 'Title', spanish: 'Titulo' },
  '图片说明': { english: 'Image description', spanish: 'Descripcion de imagen' },
  '按钮': { english: 'Button', spanish: 'Boton' },
  '忽略我': { english: 'IGNORE_ME', spanish: 'IGNORE_ME' },
  '忽略我ID': { english: 'IGNORE_ME_ID', spanish: 'IGNORE_ME_ID' },
  '忽略我CODE': { english: 'IGNORE_ME_CODE', spanish: 'IGNORE_ME_CODE' },
  '忽略我TEXT': { english: 'IGNORE_ME_TEXT', spanish: 'IGNORE_ME_TEXT' }
};

function mockTranslate(text, to) {
  if (DICT[text] && DICT[text][to]) return DICT[text][to];
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  return `[${to}:${(hash >>> 0).toString(16)}]`;
}

function send(res, status, body, type) {
  if (res.destroyed || res.writableEnded) return;
  res.writeHead(status, {
    'content-type': type || 'text/plain; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    let size = 0;
    let settled = false;
    const fail = (message, statusCode) => {
      if (settled) return;
      settled = true;
      chunks = [];
      reject(Object.assign(new Error(message), { statusCode }));
    };
    req.on('data', (chunk) => {
      if (settled) return;
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        fail('request body is too large', 413);
        req.resume();
        return;
      }
      chunks.push(chunk);
    });
    req.once('end', () => {
      if (settled) return;
      settled = true;
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    req.once('aborted', () => fail('request aborted', 400));
    req.once('error', () => fail('request body could not be read', 400));
    if (req.aborted) fail('request aborted', 400);
  });
}

function baseConfig(port, build = 'translate.js') {
  return `<script src="/${build}"></script>
<script>
  translate.request.api.host = ['http://127.0.0.1:${port}/'];
  translate.request.api.connectTest = '';
  translate.request.api.init = '';
  translate.request.api.language = 'language.json';
  translate.request.api.translate = 'translate.json';
  translate.language.setLocal('chinese_simplified');
  translate.language.setDefaultTo('english');
</script>`;
}

function fixture(port, build) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>translate.js harness fixture</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 24px; line-height: 1.5; }
  #translate { margin-bottom: 12px; }
  .box { border: 1px solid #ccc; border-radius: 6px; padding: 10px; margin: 10px 0; }
  .harness-banner { position: fixed; top: 0; left: 0; right: 0; z-index: 99999; padding: 10px 14px; color: #fff; font: 14px/1.4 ui-monospace, monospace; box-shadow: 0 2px 8px rgba(0,0,0,.25); }
  .harness-banner.fail { background: #b00020; }
  .harness-banner.pass { background: #0b6b2f; }
  .harness-banner.warn { background: #8a4b00; }
  body.harness-has-banner { padding-top: 52px; }
</style>
</head>
<body>
<div id="translate"></div>

<h1 id="title">你好世界</h1>
<p id="p1">这是一个测试。</p>
<p id="p2">第二段：更多内容。</p>

<p id="ignore-class" class="ignore">忽略我</p>
<p id="ignore-id">忽略我ID</p>
<code id="ignore-code">忽略我CODE</code>
<p id="ignore-text">忽略我TEXT</p>

<div class="box">
  <input id="inp" placeholder="请输入" title="标题" value="按钮">
  <img id="img" alt="图片说明" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==">
</div>

<div id="dynamic-host"></div>
<button id="add-dynamic">Add dynamic content</button>
<button id="change-text">Change text node</button>

<div id="shadow-host"></div>

${baseConfig(port, build)}
<script>
  translate.ignore.id.push('ignore-id');
  translate.ignore.text.push('忽略我TEXT');
  const shadow = document.getElementById('shadow-host').attachShadow({ mode: 'open' });
  shadow.innerHTML = '<p id="shadow-p">动态内容</p>';
  translate.listener.start();
  translate.execute();

  document.getElementById('add-dynamic').addEventListener('click', function() {
    const p = document.createElement('p');
    p.id = 'dynamic-p';
    p.textContent = '动态内容';
    document.getElementById('dynamic-host').appendChild(p);
  });

  document.getElementById('change-text').addEventListener('click', function() {
    document.getElementById('p1').firstChild.nodeValue = '动态内容';
  });
</script>
</body>
</html>`;
}

function iframeBlank() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>iframe blank</title></head>
<body>
<h1 id="blank-title">你好世界</h1>
<p id="blank-p">这是一个测试。</p>
</body>
</html>`;
}

function iframeParent(port, build) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>iframe parent</title></head>
<body>
<h1 id="parent-title">中文段落。</h1>
<div id="iframe-host"></div>
${baseConfig(port, build)}
<script>
  translate.element.iframe.use('/${build}');
  translate.listener.start();
  translate.execute();
  setTimeout(function() {
    const iframe = document.createElement('iframe');
    iframe.id = 'child';
    iframe.src = '/iframe-blank.html';
    iframe.width = 480;
    iframe.height = 140;
    document.getElementById('iframe-host').appendChild(iframe);
  }, 300);
</script>
</body>
</html>`;
}

function nestedTop() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>nested top</title></head>
<body>
<h1 id="top-title">Top page without translate.js</h1>
<iframe id="middle" src="/nested-middle.html" width="640" height="260"></iframe>
</body>
</html>`;
}

function nestedMiddle(port, build) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>nested middle</title></head>
<body>
<h1 id="middle-title">你好世界</h1>
<div id="inner-host"></div>
${baseConfig(port, build)}
<script>
  translate.element.iframe.use('/${build}');
  translate.listener.start();
  translate.execute();
  setTimeout(function() {
    const iframe = document.createElement('iframe');
    iframe.id = 'inner';
    iframe.src = '/iframe-blank.html';
    iframe.width = 480;
    iframe.height = 140;
    document.getElementById('inner-host').appendChild(iframe);
  }, 500);
</script>
</body>
</html>`;
}

function crossOriginParent() {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>cross-origin parent</title></head>
<body>
<h1>Cross-origin parent (127.0.0.1:${DEFAULT_PORT})</h1>
<iframe id="child" src="http://127.0.0.1:${CROSS_ORIGIN_PORT}/iframe.html" width="560" height="180"></iframe>
</body>
</html>`;
}

function crossOriginIframe(port, build) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>cross-origin iframe</title></head>
<body>
<div id="translate"></div>
<h1 id="iframe-title">你好世界</h1>
<p id="iframe-p">这是一个测试。</p>
${baseConfig(port, build)}
<script>
  translate.execute();
</script>
</body>
</html>`;
}

function createServer(port) {
  const requests = [];
  const origin = `http://127.0.0.1:${port}/`;

  const handleRequest = async (req, res) => {
    const url = new URL(req.url, origin);
    const pathname = url.pathname;
    const build = req.headers['x-translate-build'] || 'translate.js';
    if (build !== 'translate.js' && build !== 'translate.min.js') {
      return send(res, 400, 'unsupported translate build');
    }

    const iframeFixture = renderIframeFixture(url, { port, build });
    if (iframeFixture !== null) {
      return send(res, 200, iframeFixture, 'text/html; charset=utf-8');
    }

    if (pathname === '/' || pathname === '/fixture.html') {
      return send(res, 200, fixture(port, build), 'text/html; charset=utf-8');
    }
    if (pathname === '/iframe-parent.html') {
      return send(res, 200, iframeParent(port, build), 'text/html; charset=utf-8');
    }
    if (pathname === '/iframe-blank.html') {
      return send(res, 200, iframeBlank(), 'text/html; charset=utf-8');
    }
    if (pathname === '/iframe.html') {
      return send(res, 200, crossOriginIframe(port, build), 'text/html; charset=utf-8');
    }
    if (pathname === '/nested-top.html') {
      return send(res, 200, nestedTop(), 'text/html; charset=utf-8');
    }
    if (pathname === '/nested-middle.html') {
      return send(res, 200, nestedMiddle(port, build), 'text/html; charset=utf-8');
    }
    if (pathname === '/cross-origin-parent.html') {
      return send(res, 200, crossOriginParent(), 'text/html; charset=utf-8');
    }
    if (pathname === '/translate.js') {
      return send(res, 200, fs.readFileSync(CORE, 'utf8'), 'application/javascript; charset=utf-8');
    }
    if (pathname === '/translate.min.js') {
      return send(res, 200, fs.readFileSync(MINIFIED, 'utf8'), 'application/javascript; charset=utf-8');
    }
    if (pathname === '/language.json') {
      return send(res, 200, JSON.stringify({
        result: 1,
        list: [
          { id: 'chinese_simplified', name: '简体中文', serviceId: 'zh-CHS' },
          { id: 'english', name: 'English', serviceId: 'en' },
          { id: 'spanish', name: 'Español', serviceId: 'es' },
          { id: 'arabic', name: 'العربية', serviceId: 'ar' }
        ]
      }), 'application/json; charset=utf-8');
    }
    if (pathname === '/connectTest.json') {
      return send(res, 200, JSON.stringify({ result: 1, info: origin }), 'application/json; charset=utf-8');
    }
    if (pathname === '/init.json') {
      return send(res, 200, JSON.stringify({ result: 1, version: '4.1.0.20260526' }), 'application/json; charset=utf-8');
    }
    if (pathname === '/translate.json') {
      const body = await readBody(req);
      const params = new URLSearchParams(body);
      const from = params.get('from') || '';
      const to = params.get('to') || '';
      let texts = [];
      try {
        texts = JSON.parse(decodeURIComponent(params.get('text') || '[]'));
      } catch (e) {
        return send(res, 400, JSON.stringify({ result: 0, info: 'bad text: ' + e.message }), 'application/json');
      }
      if (!Array.isArray(texts) || !texts.every((text) => typeof text === 'string')) {
        return send(res, 400, JSON.stringify({ result: 0, info: 'text must be an array of strings' }), 'application/json; charset=utf-8');
      }
      requests.push({ from, to, texts, at: Date.now() });
      return send(res, 200, JSON.stringify({
        result: 1,
        from,
        to,
        text: texts.map((text) => mockTranslate(text, to))
      }), 'application/json; charset=utf-8');
    }
    if (pathname === '/__requests') {
      return send(res, 200, JSON.stringify(requests), 'application/json; charset=utf-8');
    }
    if (pathname === '/__reset') {
      requests.length = 0;
      return send(res, 200, 'ok');
    }
    if (pathname === '/health') {
      return send(res, 200, 'ok');
    }
    if (pathname === '/favicon.ico') {
      return send(res, 204, '');
    }
    return send(res, 404, 'not found');
  };
  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch((error) => {
      if (res.headersSent) {
        res.destroy();
        return;
      }
      send(res, error.statusCode || 500, JSON.stringify({ result: 0, info: error.message }), 'application/json; charset=utf-8');
    });
  });

  server.requests = requests;
  return server;
}

function startServer(port) {
  return new Promise((resolve, reject) => {
    const server = createServer(port);
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || DEFAULT_PORT);
  startServer(port).then(() => {
    console.log(`translate.js e2e fixture server on http://127.0.0.1:${port}/`);
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  CORE,
  MINIFIED,
  DEFAULT_PORT,
  CROSS_ORIGIN_PORT,
  startServer
};
