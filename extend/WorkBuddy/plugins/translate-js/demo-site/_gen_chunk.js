// 只调用生成工具，把接入代码块写到连接器根目录的临时文件（避开 demo-site 的文件锁）
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONNECTOR = path.join(__dirname, '..', 'index.js');
const CHUNK_OUT = path.join(__dirname, '..', '_chunk.txt');

function extractCodeChunk(text) {
  const marker = '（以上代码适用于';
  const endIdx = text.indexOf(marker);
  if (endIdx < 0) throw new Error('未找到代码块结束标记');
  const tail = text.slice(0, endIdx);
  let start = tail.indexOf('<script src');
  const styleIdx = tail.indexOf('<style');
  if (styleIdx >= 0 && (start < 0 || styleIdx < start)) start = styleIdx;
  if (start < 0) throw new Error('未找到可注入的代码块');
  return tail.slice(start).trim();
}

const child = spawn('C:/Users/Administrator/.workbuddy/binaries/node/versions/22.22.2/node.exe', [CONNECTOR], { cwd: path.join(__dirname, '..'), stdio: ['pipe', 'pipe', 'pipe'] });
let out = '';
child.stdout.on('data', d => out += d.toString());
child.stderr.on('data', d => process.stderr.write('[stderr] ' + d));
child.on('close', () => {
  const results = {};
  out.split('\n').forEach(line => {
    line = line.trim();
    if (!line.startsWith('{')) return;
    try { const m = JSON.parse(line); if (m.id !== undefined && m.result !== undefined) results[m.id] = m.result; } catch (e) {}
  });
  const gen = results[3];
  if (!gen) { console.error('❌ 生成无返回'); process.exit(1); }
  const chunk = extractCodeChunk(gen.content[0].text);
  fs.writeFileSync(CHUNK_OUT, chunk, 'utf8');
  console.log('✅ 代码块已写到 ' + CHUNK_OUT);
  console.log('--- 代码块预览 ---');
  console.log(chunk);
});

const send = o => child.stdin.write(JSON.stringify(o) + '\n');
send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'gen', version: '1' } } });
send({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'generate_translatejs_code', arguments: {
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
} } });
child.stdin.end();
