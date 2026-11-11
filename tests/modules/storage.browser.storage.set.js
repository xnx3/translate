'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '字符串键值同时写入磁盘和内存，返回 undefined',
    test: function () {
      const result = translate.storage.browser.storage.set('key', 'value');
      return result === undefined && localStorage.getItem('key') === 'value' &&
        translate.storage.browser.memory.get('key') === 'value';
    }
  },
  {
    remark: '空字符串值写入磁盘和内存',
    test: function () {
      translate.storage.browser.storage.set('empty', '');
      return localStorage.getItem('empty') === '' && translate.storage.browser.memory.get('empty') === '';
    }
  },
  {
    remark: '数字零写入为字符串 0',
    test: function () {
      translate.storage.browser.storage.set('zero', 0);
      return localStorage.getItem('zero') === '0' && translate.storage.browser.memory.get('zero') === '0';
    }
  },
  {
    remark: 'false 值不会被真假判断丢弃',
    test: function () {
      translate.storage.browser.storage.set('false', false);
      return localStorage.getItem('false') === 'false';
    }
  },
  {
    remark: 'null 值按 String 约定写入',
    test: function () {
      translate.storage.browser.storage.set('null', null);
      return localStorage.getItem('null') === 'null';
    }
  },
  {
    remark: '显式 undefined 值按 String 约定写入',
    test: function () {
      translate.storage.browser.storage.set('undefined', undefined);
      return localStorage.getItem('undefined') === 'undefined';
    }
  },
  {
    remark: '省略 value 时保存字符串 undefined',
    test: function () {
      translate.storage.browser.storage.set('omitted');
      return localStorage.getItem('omitted') === 'undefined';
    }
  },
  {
    remark: '省略全部参数时键和值都转换为 undefined 字符串',
    test: function () {
      translate.storage.browser.storage.set();
      return localStorage.getItem('undefined') === 'undefined';
    }
  },
  {
    remark: '空字符串键可正常保存',
    test: function () {
      translate.storage.browser.storage.set('', 'empty-key');
      return localStorage.getItem('') === 'empty-key';
    }
  },
  {
    remark: '数字零键按字符串存入',
    test: function () {
      translate.storage.browser.storage.set(0, 'number');
      return localStorage.getItem('0') === 'number';
    }
  },
  {
    remark: 'null 键按字符串存入',
    test: function () {
      translate.storage.browser.storage.set(null, 'null-key');
      return localStorage.getItem('null') === 'null-key';
    }
  },
  {
    remark: '普通对象值不会自动变成 JSON',
    test: function () {
      translate.storage.browser.storage.set('object', { a: 1 });
      return localStorage.getItem('object') === '[object Object]';
    }
  },
  {
    remark: 'Unicode、首尾空格和换行保持不变',
    test: function () {
      translate.storage.browser.storage.set(' 中文😀 ', ' A\n值 ');
      return localStorage.getItem(' 中文😀 ') === ' A\n值 ';
    }
  },
  {
    remark: '同名记录覆盖后磁盘和内存都保存新值',
    test: function () {
      translate.storage.browser.storage.set('overwrite', 'old');
      translate.storage.browser.storage.set('overwrite', 'new');
      return localStorage.getItem('overwrite') === 'new' &&
        translate.storage.browser.memory.get('overwrite') === 'new';
    }
  },
  {
    remark: '配额写入失败时不抛错，先保留的新值仍可读',
    test: function () {
      localStorage.setItem('quota', 'old');
      Storage.prototype.setItem = function () { throw new DOMException('full', 'QuotaExceededError'); };
      const result = translate.storage.browser.storage.set('quota', 'new');
      return result === undefined && translate.storage.browser.storage.get('quota') === 'new' &&
        translate.storage.browser.memory.get('quota') === 'new';
    }
  },
  {
    remark: 'localStorage 属性本身不可访问时仍保存内存值',
    test: function () {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get: function () { throw new DOMException('disabled', 'SecurityError'); }
      });
      const result = translate.storage.browser.storage.set('blocked', 'value');
      return result === undefined && translate.storage.browser.memory.get('blocked') === 'value';
    }
  },
  {
    remark: '首次写失败后保持内存模式，不重试后续磁盘写入',
    test: function () {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function () { throw new Error('disabled'); };
      translate.storage.browser.storage.set('first', '1');
      let calls = 0;
      Storage.prototype.setItem = function (key, value) { calls++; return original.call(this, key, value); };
      translate.storage.browser.storage.set('second', '2');
      return calls === 0 && localStorage.getItem('second') === null &&
        translate.storage.browser.memory.get('second') === '2';
    }
  },
  {
    remark: '读取失败触发回退后，写入也只更新内存',
    test: function () {
      Storage.prototype.getItem = function () { throw new Error('disabled'); };
      translate.storage.browser.storage.get('trigger');
      let writes = 0;
      Storage.prototype.setItem = function () { writes++; };
      translate.storage.browser.storage.set('after-read-failure', 'value');
      return writes === 0 && translate.storage.browser.memory.get('after-read-failure') === 'value';
    }
  }
]);
