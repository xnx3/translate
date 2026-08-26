'use strict';
// 集成测试：用 jsdom 的 window.eval 在页面上下文执行 translate.js（不经过 HTML 解析，
// 规避库内含 </script> 被 HTML 解析器截断的问题），再执行生成的配置，验证集成是否生效。
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const DEMO = __dirname;
let html = fs.readFileSync(path.join(DEMO, 'index.html'), 'utf8');
const lib = fs.readFileSync(path.join(DEMO, 'assets', 'js', 'translate.js'), 'utf8');

// 去掉页面里真实的两个 <script>（external lib + inline config），改由我们手动 eval 控制执行顺序
html = html.replace(/<script src="\/assets\/js\/translate\.js"><\/script>/, '');
const cfgMatch = html.match(/<script>([\s\S]*?translate\.execute[\s\S]*?)<\/script>/);
const cfg = cfgMatch ? cfgMatch[1] : '';
html = html.replace(/<script>[\s\S]*?translate\.execute[\s\S]*?<\/script>/, '');

const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/' });
const { window } = dom;
if (typeof window.fetch === 'undefined') window.fetch = () => Promise.reject(new Error('no-network'));

let libErr = null, cfgErr = null;
try { window.eval(lib); } catch (e) { libErr = e.message; }
try { if (cfg) window.eval(cfg); } catch (e) { cfgErr = e.message; }

setTimeout(() => {
  const t = window.translate;
  console.log('1) window.translate 已定义        :', !!t, libErr ? '(库执行报错: ' + libErr + ')' : '');
  if (t) {
    console.log('2) translate.language 存在        :', !!t.language);
    console.log('3) translate.selectLanguageTag 存在:', !!t.selectLanguageTag);
    console.log('4) selectLanguageTag.languages    :', t.selectLanguageTag && JSON.stringify(t.selectLanguageTag.languages));
    console.log('5) selectLanguageTag.show         :', t.selectLanguageTag && t.selectLanguageTag.show);
  }
  const sel = window.document.querySelector('select.translateSelectLanguage');
  console.log('6) 切换栏已渲染到 DOM            :', !!sel, sel ? '(选项数 ' + (sel.options ? sel.options.length : '?') + ')' : '');
  console.log('7) 手动切换按钮(class=ignore)数量 :', window.document.querySelectorAll('a.ignore').length);
  if (cfgErr) console.log('8) 配置脚本执行报错            :', cfgErr);
  const ok = !!t && !!sel && window.document.querySelectorAll('a.ignore').length >= 2;
  console.log('\n结论:', ok ? '✅ 集成生效（translate 全局已初始化、切换栏已挂载、按钮已生成）' : '❌ 集成未完全生效');
  process.exit(ok ? 0 : 1);
}, 1500);
