'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '字符串键值写入 localStorage 并同步返回 undefined',
    test: function () {
      const result = translate.storage.set('key', 'value');
      return result === undefined && localStorage.getItem('key') === 'value';
    }
  },
  {
    remark: '空字符串值会实际保存',
    test: function () {
      translate.storage.set('empty', '');
      return localStorage.getItem('empty') === '';
    }
  },
  {
    remark: '数字零转成字符串保存',
    test: function () {
      translate.storage.set('zero', 0);
      return localStorage.getItem('zero') === '0';
    }
  },
  {
    remark: '布尔 false 转成字符串保存',
    test: function () {
      translate.storage.set('false', false);
      return localStorage.getItem('false') === 'false';
    }
  },
  {
    remark: 'null 值转成字符串保存',
    test: function () {
      translate.storage.set('null', null);
      return localStorage.getItem('null') === 'null';
    }
  },
  {
    remark: '显式 undefined 值转成字符串保存',
    test: function () {
      translate.storage.set('undefined', undefined);
      return localStorage.getItem('undefined') === 'undefined';
    }
  },
  {
    remark: '省略值时仍保存字符串 undefined',
    test: function () {
      translate.storage.set('omitted');
      return localStorage.getItem('omitted') === 'undefined';
    }
  },
  {
    remark: '省略全部参数时键和值都按 String 约定处理',
    test: function () {
      translate.storage.set();
      return localStorage.getItem('undefined') === 'undefined';
    }
  },
  {
    remark: '空字符串键不被忽略',
    test: function () {
      translate.storage.set('', 'empty-key');
      return localStorage.getItem('') === 'empty-key';
    }
  },
  {
    remark: '数字键转换为字符串',
    test: function () {
      translate.storage.set(12, 'number-key');
      return localStorage.getItem('12') === 'number-key';
    }
  },
  {
    remark: '普通对象值按 String 约定处理而非自动 JSON 序列化',
    test: function () {
      translate.storage.set('object', { value: 1 });
      return localStorage.getItem('object') === '[object Object]';
    }
  },
  {
    remark: 'Unicode 和换行内容原样保存',
    test: function () {
      translate.storage.set('中文😀', ' A\n中文😀 ');
      return localStorage.getItem('中文😀') === ' A\n中文😀 ';
    }
  },
  {
    remark: '重复写入同一键只保留新值',
    test: function () {
      translate.storage.set('same', 'old');
      translate.storage.set('same', 'new');
      return localStorage.getItem('same') === 'new';
    }
  },
  {
    remark: '传入的键和值原样委托，统一入口不预先转换',
    test: function () {
      const key = { key: true };
      const value = { value: true };
      let received;
      translate.storage.browser.storage.set = function (k, v) { received = [k, v, this]; };
      const result = translate.storage.set(key, value);
      return result === undefined && received[0] === key && received[1] === value &&
        received[2] === translate.storage.browser.storage;
    }
  },
  {
    remark: '写入操作不会把可替换实现的返回值泄漏给调用方',
    test: function () {
      translate.storage.browser.storage.set = function () { return 'internal'; };
      return translate.storage.set('key', 'value') === undefined;
    }
  }
]);
