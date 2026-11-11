'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '当前语种与本地语种相同时提示无需导出且不创建弹窗',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'chinese_simplified');
      let message;
      window.alert = function (value) { message = value; };
      const result = translate.offline.export();
      return result === undefined && message.includes('无需导出') && document.getElementById('msgPopupsTextarea') === null;
    }
  },
  {
    remark: '没有有效翻译缓存时提示无有效内容',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'english');
      translate.nodeQueue = {};
      let message;
      window.msg = { alert: function (value) { message = value; } };
      translate.offline.export();
      return message === '无有效内容！';
    }
  },
  {
    remark: '导出有效缓存为当前语种的离线配置文本',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'english');
      translate.nodeQueue = { test: { list: { chinese_simplified: { first: { original: '你好' } } } } };
      translate.storage.set('hash_english_first', 'Hello');
      translate.util.loadMsgJs = function () {};
      window.msg = { popups: function () { const textarea = document.createElement('textarea'); textarea.id = 'msgPopupsTextarea'; document.body.appendChild(textarea); } };
      translate.offline.export();
      return document.getElementById('msgPopupsTextarea').value === "translate.offline.append('english',`\n你好=Hello\n`);";
    }
  },
  {
    remark: '只导出当前目标语种，不混入其他语种缓存',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'spanish');
      translate.nodeQueue = { test: { list: { chinese_simplified: { first: { original: '你好' } } } } };
      translate.storage.set('hash_english_first', 'Hello');
      translate.storage.set('hash_spanish_first', 'Hola');
      translate.util.loadMsgJs = function () {};
      window.msg = { popups: function () { const textarea = document.createElement('textarea'); textarea.id = 'msgPopupsTextarea'; document.body.appendChild(textarea); } };
      translate.offline.export();
      const value = document.getElementById('msgPopupsTextarea').value;
      return value.includes("append('spanish'") && value.includes('你好=Hola') && !value.includes('Hello');
    }
  },
  {
    remark: '忽略没有译文缓存以及空译文的条目',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'english');
      translate.nodeQueue = { test: { list: { chinese_simplified: { valid: { original: '有效' }, missing: { original: '缺失' }, empty: { original: '空值' } } } } };
      translate.storage.set('hash_english_valid', 'Valid');
      translate.storage.set('hash_english_empty', '');
      translate.util.loadMsgJs = function () {};
      window.msg = { popups: function () { const textarea = document.createElement('textarea'); textarea.id = 'msgPopupsTextarea'; document.body.appendChild(textarea); } };
      translate.offline.export();
      const value = document.getElementById('msgPopupsTextarea').value;
      return value.includes('有效=Valid') && !value.includes('缺失=') && !value.includes('空值=');
    }
  },
  {
    remark: '嵌套队列中原型继承的条目不会进入导出文本',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'english');
      const list = Object.create({ inherited: { original: '不应导出' } });
      list.valid = { original: '有效' };
      translate.nodeQueue = { test: { list: { chinese_simplified: list } } };
      translate.storage.set('hash_english_inherited', 'Excluded');
      translate.storage.set('hash_english_valid', 'Valid');
      translate.util.loadMsgJs = function () {};
      window.msg = { popups: function () { const textarea = document.createElement('textarea'); textarea.id = 'msgPopupsTextarea'; document.body.appendChild(textarea); } };
      translate.offline.export();
      const value = document.getElementById('msgPopupsTextarea').value;
      return value.includes('有效=Valid') && !value.includes('不应导出');
    }
  },
  {
    remark: '带换行的原文译文导出为可执行配置，再导入后完整还原',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'english');
      translate.nodeQueue = { test: { list: { chinese_simplified: { first: { original: '第一\n第二' } } } } };
      translate.storage.set('hash_english_first', 'First\nSecond');
      translate.util.loadMsgJs = function () {};
      window.msg = { popups: function () { const textarea = document.createElement('textarea'); textarea.id = 'msgPopupsTextarea'; document.body.appendChild(textarea); } };
      translate.offline.export();
      const value = document.getElementById('msgPopupsTextarea').value;
      // 导出结果是一段 JavaScript；模板字符串求值还会消耗一层反斜杠。
      // 直接执行实际导出的配置，再经真实 append 解码，验证最终原文和译文。
      const key = 'hash_english_' + translate.util.hash('第一\n第二');
      translate.storage.set(key, '等待导入');
      new Function(value)();
      return !value.includes('第一\n第二') && translate.storage.get(key) === 'First\nSecond';
    }
  },
  {
    remark: '路径中的反斜杠导出再导入后保持原样，不能变成制表符或换行',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'english');
      const original = 'C:\\temp\\file.txt';
      const expected = 'D:\\new\\file.txt';
      translate.nodeQueue = { test: { list: { chinese_simplified: { first: { original } } } } };
      translate.storage.set('hash_english_first', expected);
      translate.util.loadMsgJs = function () {};
      window.msg = { popups: function () { const textarea = document.createElement('textarea'); textarea.id = 'msgPopupsTextarea'; document.body.appendChild(textarea); } };
      translate.offline.export();
      const value = document.getElementById('msgPopupsTextarea').value;
      // 实际执行导出的配置，验证反斜杠经过 JavaScript 求值和 append 后仍是普通路径字符。
      const key = 'hash_english_' + translate.util.hash(original);
      translate.storage.set(key, '等待导入');
      new Function(value)();
      return translate.storage.get(key) === expected;
    }
  },
  {
    remark: '原文译文中的反引号导出再导入后保持字面文本，不破坏配置语法',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'english');
      const original = '`原文`';
      const expected = '`translated`';
      translate.nodeQueue = { test: { list: { chinese_simplified: { first: { original } } } } };
      translate.storage.set('hash_english_first', expected);
      translate.util.loadMsgJs = function () {};
      window.msg = { popups: function () { const textarea = document.createElement('textarea'); textarea.id = 'msgPopupsTextarea'; document.body.appendChild(textarea); } };
      translate.offline.export();
      const value = document.getElementById('msgPopupsTextarea').value;
      // 反引号是合法页面文本，导出器必须负责避免它提前结束生成的模板字符串。
      const key = 'hash_english_' + translate.util.hash(original);
      translate.storage.set(key, '等待导入');
      new Function(value)();
      return translate.storage.get(key) === expected;
    }
  },
  {
    remark: '字面文本 ${1+1} 导出再导入后保持原样，不能被计算成数字',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'english');
      const original = '原文${1+1}';
      const expected = 'Result${1+1}';
      translate.nodeQueue = { test: { list: { chinese_simplified: { first: { original } } } } };
      translate.storage.set('hash_english_first', expected);
      translate.util.loadMsgJs = function () {};
      window.msg = { popups: function () { const textarea = document.createElement('textarea'); textarea.id = 'msgPopupsTextarea'; document.body.appendChild(textarea); } };
      translate.offline.export();
      const value = document.getElementById('msgPopupsTextarea').value;
      // 只使用固定的加法表达式作为文本边界；用例不执行任何外部行为。
      const key = 'hash_english_' + translate.util.hash(original);
      translate.storage.set(key, '等待导入');
      new Function(value)();
      return translate.storage.get(key) === expected;
    }
  }
]);
