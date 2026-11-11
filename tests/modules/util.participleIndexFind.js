'use strict';

require('../helpers/module')(__filename, [
  { remark: '空保护分词列表返回空数组', args: ['你好世界', []], expected: [] },
  { remark: '空原文没有分词位置', args: ['', ['你好']], expected: [] },
  { remark: '未命中的分词返回空数组', args: ['你好世界', ['再见']], expected: [] },
  { remark: '分词出现在原文开头', args: ['你好世界', ['你好']], expected: [{ start: 0, end: 1 }] },
  { remark: '分词出现在原文末尾', args: ['你好世界', ['世界']], expected: [{ start: 2, end: 3 }] },
  { remark: '分词等于原文时标出整个范围', args: ['你好', ['你好']], expected: [{ start: 0, end: 1 }] },
  { remark: '同一分词重复出现时记录每一个范围', args: ['ab ab', ['ab']], expected: [{ start: 0, end: 1 }, { start: 3, end: 4 }] },
  { remark: '相邻分词重复出现时范围不丢失', args: ['abab', ['ab']], expected: [{ start: 0, end: 1 }, { start: 2, end: 3 }] },
  {
    remark: '多个分词全部记录，验证位置集合而不依赖返回顺序',
    test: function () {
      const result = translate.util.participleIndexFind('甲乙丙丁', ['甲乙', '丙丁']);
      result.sort((a, b) => a.start - b.start);
      return result.length === 2 && result[0].start === 0 && result[0].end === 1 &&
        result[1].start === 2 && result[1].end === 3;
    }
  },
  {
    remark: '查找不会修改原始分词数组',
    test: function () {
      const words = ['甲乙', '丙丁'];
      translate.util.participleIndexFind('甲乙丙丁', words);
      return words.length === 2 && words[0] === '甲乙' && words[1] === '丙丁';
    }
  },
  {
    remark: '单字符分词命中后应返回有限的位置结果，不得陷入死循环',
    test: async function () {
      const script = Array.from(document.scripts).find(node => /\/translate(?:\.min)?\.js$/.test(node.src));
      if (!script) return false;
      // 在可终止的 Worker 中加载当前实际发布文件。超时即失败，不让被测循环阻塞浏览器主线程。
      // 计时从脚本加载完成后开始，避免把下载或进程启动耗时误判为算法挂死。
      // 完整发布脚本在创建 network.fetch 配置时读取 window.fetch；Worker 的同名宿主是 self。
      // 仅补上全局别名，不替换被测算法，保证 ready 表示实际脚本已经成功加载。
      const code = 'self.window=self;importScripts(' + JSON.stringify(script.src) + ');' +
        'postMessage("ready");onmessage=function(){postMessage(translate.util.participleIndexFind("abc",["a"]));};';
      const url = URL.createObjectURL(new Blob([code], { type: 'application/javascript' }));
      const worker = new Worker(url);
      try {
        return await new Promise(resolve => {
          let timer = setTimeout(() => finish(false), 10000);
          function finish(value) {
            clearTimeout(timer);
            worker.terminate();
            resolve(value);
          }
          worker.onerror = event => { event.preventDefault(); finish(false); };
          worker.onmessage = event => {
            if (event.data === 'ready') {
              clearTimeout(timer);
              timer = setTimeout(() => finish(false), 1000);
              worker.postMessage('run');
            } else {
              const result = event.data;
              finish(Array.isArray(result) && result.length === 1 && result[0].start === 0 && result[0].end === 0);
            }
          };
        });
      } finally {
        worker.terminate();
        URL.revokeObjectURL(url);
      }
    }
  }
]);
