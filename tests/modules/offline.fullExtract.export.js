'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "省略目标语种被拒绝，不创建下载",
    test: async function () {
      let calls = 0;
      URL.createObjectURL = function () { calls++; };
      const result = await translate.offline.fullExtract.export();
      return result === undefined && calls === 0;
    }
  },
  {
    remark: "undefined 目标语种被拒绝，不创建下载",
    test: async function () {
      let calls = 0;
      URL.createObjectURL = function () { calls++; };
      const result = await translate.offline.fullExtract.export(undefined);
      return result === undefined && calls === 0;
    }
  },
  {
    remark: "null 目标语种被拒绝，不创建下载",
    test: async function () {
      let calls = 0;
      URL.createObjectURL = function () { calls++; };
      const result = await translate.offline.fullExtract.export(null);
      return result === undefined && calls === 0;
    }
  },
  {
    remark: "数值目标语种被拒绝，不创建下载",
    test: async function () {
      let calls = 0;
      URL.createObjectURL = function () { calls++; };
      const result = await translate.offline.fullExtract.export(1);
      return result === undefined && calls === 0;
    }
  },
  {
    remark: "对象目标语种被拒绝，不创建下载",
    test: async function () {
      let calls = 0;
      URL.createObjectURL = function () { calls++; };
      const result = await translate.offline.fullExtract.export({});
      return result === undefined && calls === 0;
    }
  },
  {
    remark: "IndexedDB 不存在时不创建下载",
    test: async function () {
      delete translate.storage.IndexedDB;
      let calls = 0;
      URL.createObjectURL = function () { calls++; };
      return await translate.offline.fullExtract.export('english') === undefined && calls === 0;
    }
  },
  {
    remark: "有效译文导出为语种命名的 txt 文件",
    test: async function () {
      let capturedBlob;
      let clicked;
      let revoked;
      URL.createObjectURL = function (blob) { capturedBlob = blob; return 'blob:test-export'; };
      URL.revokeObjectURL = function (url) { revoked = url; };
      HTMLAnchorElement.prototype.click = function () { clicked = { href: this.getAttribute('href'), download: this.download, node: this }; };
      await translate.offline.fullExtract.set('one', '你好', 'english', 'Hello');
      const result = await translate.offline.fullExtract.export('english');
      const text = await capturedBlob.text();
      return result === undefined && capturedBlob.type === 'text/plain' && clicked.download === 'english.txt' &&
        clicked.href === 'blob:test-export' && text === "translate.offline.append('english',`\n你好=Hello\n`);";
    }
  },
  {
    remark: "只导出指定语种的译文，不混入其他语种",
    test: async function () {
      let capturedBlob;
      let clicked;
      let revoked;
      URL.createObjectURL = function (blob) { capturedBlob = blob; return 'blob:test-export'; };
      URL.revokeObjectURL = function (url) { revoked = url; };
      HTMLAnchorElement.prototype.click = function () { clicked = { href: this.getAttribute('href'), download: this.download, node: this }; };
      await translate.offline.fullExtract.set('one', '你好', 'english', 'Hello');
      await translate.offline.fullExtract.set('one', '你好', 'spanish', 'Hola');
      await translate.offline.fullExtract.export('spanish');
      const text = await capturedBlob.text();
      return clicked.download === 'spanish.txt' && text.includes('你好=Hola') && !text.includes('Hello');
    }
  },
  {
    remark: "跳过缺失、空字符串和纯空白译文",
    test: async function () {
      let capturedBlob;
      let clicked;
      let revoked;
      URL.createObjectURL = function (blob) { capturedBlob = blob; return 'blob:test-export'; };
      URL.revokeObjectURL = function (url) { revoked = url; };
      HTMLAnchorElement.prototype.click = function () { clicked = { href: this.getAttribute('href'), download: this.download, node: this }; };
      await translate.storage.IndexedDB.set('hash_valid', { originalText: '有效', english: 'Valid' });
      await translate.storage.IndexedDB.set('hash_missing', { originalText: '缺失', spanish: 'Other' });
      await translate.storage.IndexedDB.set('hash_empty', { originalText: '空值', english: '' });
      await translate.storage.IndexedDB.set('hash_blank', { originalText: '空白', english: '  ' });
      await translate.offline.fullExtract.export('english');
      const text = await capturedBlob.text();
      return text.includes('有效=Valid') && !text.includes('缺失=') && !text.includes('空值=') && !text.includes('空白=');
    }
  },
  {
    remark: "只扫描 hash_ 前缀记录，不把其他存储数据导出",
    test: async function () {
      let capturedBlob;
      let clicked;
      let revoked;
      URL.createObjectURL = function (blob) { capturedBlob = blob; return 'blob:test-export'; };
      URL.revokeObjectURL = function (url) { revoked = url; };
      HTMLAnchorElement.prototype.click = function () { clicked = { href: this.getAttribute('href'), download: this.download, node: this }; };
      await translate.storage.IndexedDB.set('hash_valid', { originalText: '有效', english: 'Valid' });
      await translate.storage.IndexedDB.set('other', { originalText: '其他', english: 'Other' });
      await translate.offline.fullExtract.export('english');
      const text = await capturedBlob.text();
      return text.includes('有效=Valid') && !text.includes('其他=Other');
    }
  },
  {
    remark: "导出后移除临时链接并释放 Blob URL",
    test: async function () {
      let capturedBlob;
      let clicked;
      let revoked;
      URL.createObjectURL = function (blob) { capturedBlob = blob; return 'blob:test-export'; };
      URL.revokeObjectURL = function (url) { revoked = url; };
      HTMLAnchorElement.prototype.click = function () { clicked = { href: this.getAttribute('href'), download: this.download, node: this }; };
      await translate.offline.fullExtract.export('english');
      await new Promise(function (resolve) { setTimeout(resolve, 150); });
      return clicked.node.parentNode === null && revoked === 'blob:test-export';
    }
  },
  {
    remark: "空数据库仍产生可执行的空离线配置",
    test: async function () {
      let capturedBlob;
      let clicked;
      let revoked;
      URL.createObjectURL = function (blob) { capturedBlob = blob; return 'blob:test-export'; };
      URL.revokeObjectURL = function (url) { revoked = url; };
      HTMLAnchorElement.prototype.click = function () { clicked = { href: this.getAttribute('href'), download: this.download, node: this }; };
      await translate.offline.fullExtract.export('english');
      return await capturedBlob.text() === "translate.offline.append('english',`\n`);";
    }
  },
  {
    remark: "Unicode 原文译文在下载内容中保持完整",
    test: async function () {
      let capturedBlob;
      let clicked;
      let revoked;
      URL.createObjectURL = function (blob) { capturedBlob = blob; return 'blob:test-export'; };
      URL.revokeObjectURL = function (url) { revoked = url; };
      HTMLAnchorElement.prototype.click = function () { clicked = { href: this.getAttribute('href'), download: this.download, node: this }; };
      await translate.offline.fullExtract.set('unicode', '中文😀', 'english', 'English😀');
      await translate.offline.fullExtract.export('english');
      return (await capturedBlob.text()).includes('中文😀=English😀');
    }
  },
  {
    remark: "带换行的原文译文导出为可执行配置，再导入后完整还原",
    test: async function () {
      let capturedBlob;
      let clicked;
      let revoked;
      URL.createObjectURL = function (blob) { capturedBlob = blob; return 'blob:test-export'; };
      URL.revokeObjectURL = function (url) { revoked = url; };
      HTMLAnchorElement.prototype.click = function () { clicked = { href: this.getAttribute('href'), download: this.download, node: this }; };
      await translate.offline.fullExtract.set('lines', '第一\n第二', 'english', 'First\nSecond');
      await translate.offline.fullExtract.export('english');
      const text = await capturedBlob.text();
      // Blob 保存的是 JavaScript 源码，里面的模板字符串还需经过一次求值。
      // 验证实际下载内容能被执行并由 append 还原换行，避免混淆两层转义。
      const key = 'hash_english_' + translate.util.hash('第一\n第二');
      translate.storage.set(key, '等待导入');
      new Function(text)();
      return !text.includes('第一\n第二') && translate.storage.get(key) === 'First\nSecond';
    }
  },
  {
    remark: "路径中的反斜杠导出再导入后保持原样，不能变成制表符或换行",
    test: async function () {
      let capturedBlob;
      URL.createObjectURL = function (blob) { capturedBlob = blob; return 'blob:test-export'; };
      URL.revokeObjectURL = function () {};
      HTMLAnchorElement.prototype.click = function () {};
      const original = 'C:\\temp\\file.txt';
      const expected = 'D:\\new\\file.txt';
      await translate.offline.fullExtract.set('backslashes', original, 'english', expected);
      await translate.offline.fullExtract.export('english');
      const text = await capturedBlob.text();
      // 不发起真实下载；执行实际生成的配置，验证路径经过两层处理仍完整保存。
      const key = 'hash_english_' + translate.util.hash(original);
      translate.storage.set(key, '等待导入');
      new Function(text)();
      return translate.storage.get(key) === expected;
    }
  },
  {
    remark: "原文译文中的反引号导出再导入后保持字面文本，不破坏配置语法",
    test: async function () {
      let capturedBlob;
      URL.createObjectURL = function (blob) { capturedBlob = blob; return 'blob:test-export'; };
      URL.revokeObjectURL = function () {};
      HTMLAnchorElement.prototype.click = function () {};
      const original = '`原文`';
      const expected = '`translated`';
      await translate.offline.fullExtract.set('backticks', original, 'english', expected);
      await translate.offline.fullExtract.export('english');
      const text = await capturedBlob.text();
      // 反引号是合法页面文本，不能提前结束导出脚本的模板字符串。
      const key = 'hash_english_' + translate.util.hash(original);
      translate.storage.set(key, '等待导入');
      new Function(text)();
      return translate.storage.get(key) === expected;
    }
  },
  {
    remark: "字面文本 ${1+1} 导出再导入后保持原样，不能被计算成数字",
    test: async function () {
      let capturedBlob;
      URL.createObjectURL = function (blob) { capturedBlob = blob; return 'blob:test-export'; };
      URL.revokeObjectURL = function () {};
      HTMLAnchorElement.prototype.click = function () {};
      const original = '原文${1+1}';
      const expected = 'Result${1+1}';
      await translate.offline.fullExtract.set('interpolation', original, 'english', expected);
      await translate.offline.fullExtract.export('english');
      const text = await capturedBlob.text();
      // 固定文本只含简单加法，用于检测导出器是否误把文本当成模板插值。
      const key = 'hash_english_' + translate.util.hash(original);
      translate.storage.set(key, '等待导入');
      new Function(text)();
      return translate.storage.get(key) === expected;
    }
  }
]);
