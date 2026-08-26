'use strict';
// 驱动脚本：真实调用 translate.js 连接器，完成下载 + 生成，并注入示例 HTML
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONNECTOR = path.join(__dirname, '..', 'index.js');           // 连接器 index.js
const DEMO_DIR = __dirname;                                          // demo-site
const JS_DIR = path.join(DEMO_DIR, 'assets', 'js');
const HTML_FILE = path.join(DEMO_DIR, 'index.html');

function callConnector() {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [CONNECTOR], { cwd: path.join(__dirname, '..'), stdio: ['pipe', 'pipe', 'pipe'] });
    let out = '';
    child.stdout.on('data', (d) => { out += d.toString(); });
    child.stderr.on('data', (d) => { process.stderr.write('[connector stderr] ' + d.toString()); });
    child.on('close', () => {
      // 解析所有 JSON-RPC 响应行（按 id 索引）
      const results = {};
      out.split('\n').forEach((line) => {
        line = line.trim();
        if (!line.startsWith('{')) return;
        try {
          const msg = JSON.parse(line);
          if (msg.id !== undefined && msg.result !== undefined) results[msg.id] = msg.result;
        } catch (e) { /* 忽略非 JSON 行 */ }
      });
      resolve(results);
    });

    const send = (obj) => child.stdin.write(JSON.stringify(obj) + '\n');
    send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'demo-driver', version: '1' } } });
    // 2) 下载最新 translate.js 到示例站静态目录（按顺序：gitee -> github -> res.zvo.cn）
    send({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'download_translatejs', arguments: { target_dir: JS_DIR } } });
    // 3) 生成 local 模式接入代码
    send({
      jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'generate_translatejs_code', arguments: {
        tech_stack: 'plain_html',
        local_language: 'chinese_simplified',
        target_languages: ['english', 'japanese'],
        show_selector: true,
        intro_mode: 'local',
        local_path: '/assets/js/translate.js',
        service_channel: 'client_edge',
        listen_dynamic: true,
        manual_switch: true,
        selector_css: 'top:12px;right:12px;background:#fff;padding:6px 10px;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,.15);'
      } }
    });
    child.stdin.end();
  });
}

function extractCodeChunk(text) {
  const marker = '（以上代码适用于';
  const endIdx = text.indexOf(marker);
  if (endIdx < 0) throw new Error('未在生成结果中找到代码块结束标记');
  const tail = text.slice(0, endIdx);
  // 代码块起点：最早的 <script src 或 <style
  let start = tail.indexOf('<script src');
  const styleIdx = tail.indexOf('<style');
  if (styleIdx >= 0 && (start < 0 || styleIdx < start)) start = styleIdx;
  if (start < 0) throw new Error('未找到可注入的代码块');
  return tail.slice(start).trim();
}

(async () => {
  const results = await callConnector();

  // 检查下载结果
  const dl = results[2];
  if (!dl) { console.error('❌ download_translatejs 无返回'); process.exit(1); }
  const dlText = dl.content[0].text;
  console.log('=== download_translatejs 结果 ===');
  console.log(dlText.split('\n').slice(0, 6).join('\n'));
  const dlFile = path.join(JS_DIR, 'translate.js');
  console.log('  本地文件存在:', fs.existsSync(dlFile), '大小:', fs.existsSync(dlFile) ? fs.statSync(dlFile).size + ' 字节' : 'N/A');

  // 检查生成结果
  const gen = results[3];
  if (!gen) { console.error('❌ generate_translatejs_code 无返回'); process.exit(1); }
  const genText = gen.content[0].text;
  const codeChunk = extractCodeChunk(genText);
  console.log('\n=== 生成的接入代码块（将注入） ===');
  console.log(codeChunk);

  // 注入到 </body> 之前
  let html = fs.readFileSync(HTML_FILE, 'utf8');
  if (html.includes('translate.js/translate.js') || html.includes('translate.execute')) {
    console.log('\n⚠️ 示例 HTML 似乎已接入过 translate.js，跳过注入。');
  } else {
    html = html.replace('</body>', codeChunk + '\n</body>');
    fs.writeFileSync(HTML_FILE, html, 'utf8');
    console.log('\n✅ 已注入到 index.html 的 </body> 之前');
  }
  console.log('\n写入文件: ' + HTML_FILE);
})();
