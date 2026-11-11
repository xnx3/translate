'use strict';

require('../helpers/module')(__filename, [
  { remark: '缺失的普通键返回 null', args: ['missing'], expected: null },
  { remark: '缺失的空字符串键返回 null', args: [''], expected: null },
  { remark: '缺省键按 undefined 转换后读取', args: [], expected: null },
  { remark: '显式 undefined 键未写入时返回 null', args: [undefined], expected: null },
  { remark: 'null 键未写入时返回 null', args: [null], expected: null },
  { remark: '数字零键未写入时返回 null', args: [0], expected: null },
  {
    remark: '持久记录的空字符串不被当成缺失',
    test: function () {
      localStorage.setItem('empty', '');
      return translate.storage.browser.storage.get('empty') === '';
    }
  },
  {
    remark: '数字键读取对应字符串记录并同步内存副本',
    test: function () {
      localStorage.setItem('12', 'value');
      return translate.storage.browser.storage.get(12) === 'value' &&
        translate.storage.browser.memory.get('12') === 'value';
    }
  },
  {
    remark: '空字符串键可以读取并建立副本',
    test: function () {
      localStorage.setItem('', 'empty-key');
      return translate.storage.browser.storage.get('') === 'empty-key' &&
        translate.storage.browser.memory.get('') === 'empty-key';
    }
  },
  {
    remark: 'JSON 字符串原样返回，不解析也不裁剪空白',
    test: function () {
      const value = ' {"中文":"😀"}\n';
      localStorage.setItem('json', value);
      return translate.storage.browser.storage.get('json') === value;
    }
  },
  {
    remark: '正常读取以外部更新后的持久值为准并更新副本',
    test: function () {
      localStorage.setItem('external', 'before');
      translate.storage.browser.storage.get('external');
      localStorage.setItem('external', 'after');
      return translate.storage.browser.storage.get('external') === 'after' &&
        translate.storage.browser.memory.get('external') === 'after';
    }
  },
  {
    remark: '外部删除记录后同时移除旧内存副本',
    test: function () {
      localStorage.setItem('removed', 'old');
      translate.storage.browser.storage.get('removed');
      localStorage.removeItem('removed');
      return translate.storage.browser.storage.get('removed') === null &&
        translate.storage.browser.memory.get('removed') === null;
    }
  },
  {
    remark: 'getItem 抛异常时返回先前读取的副本',
    test: function () {
      localStorage.setItem('cached', 'before');
      translate.storage.browser.storage.get('cached');
      Storage.prototype.getItem = function () { throw new DOMException('disabled', 'SecurityError'); };
      return translate.storage.browser.storage.get('cached') === 'before';
    }
  },
  {
    remark: 'localStorage 属性访问抛异常时仍能返回副本',
    test: function () {
      translate.storage.browser.storage.set('cached', 'value');
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get: function () { throw new DOMException('disabled', 'SecurityError'); }
      });
      return translate.storage.browser.storage.get('cached') === 'value';
    }
  },
  {
    remark: '读取失败且没有副本时返回 null，不伪造持久记录',
    test: function () {
      localStorage.setItem('unread', 'disk-only');
      Storage.prototype.getItem = function () { throw new Error('disabled'); };
      return translate.storage.browser.storage.get('unread') === null;
    }
  },
  {
    remark: '空字符串副本在读取失败时仍返回空字符串',
    test: function () {
      translate.storage.browser.storage.set('empty', '');
      Storage.prototype.getItem = function () { throw new Error('disabled'); };
      return translate.storage.browser.storage.get('empty') === '';
    }
  },
  {
    remark: '第一次读取失败后保持内存模式，不再次调用已恢复的 getItem',
    test: function () {
      translate.storage.browser.storage.set('sticky', 'memory');
      const original = Storage.prototype.getItem;
      Storage.prototype.getItem = function () { throw new Error('disabled'); };
      translate.storage.browser.storage.get('sticky');
      let calls = 0;
      Storage.prototype.getItem = function (key) { calls++; return original.call(this, key); };
      localStorage.setItem('sticky', 'new-disk');
      return translate.storage.browser.storage.get('sticky') === 'memory' && calls === 0;
    }
  },
  {
    remark: '外部删除已同步后再发生读故障，不恢复已删除的副本',
    test: function () {
      localStorage.setItem('removed', 'old');
      translate.storage.browser.storage.get('removed');
      localStorage.removeItem('removed');
      translate.storage.browser.storage.get('removed');
      Storage.prototype.getItem = function () { throw new Error('disabled'); };
      return translate.storage.browser.storage.get('removed') === null;
    }
  },
  {
    remark: '写故障触发回退后不读取磁盘中的同名旧值',
    test: function () {
      localStorage.setItem('old', 'disk');
      Storage.prototype.setItem = function () { throw new DOMException('full', 'QuotaExceededError'); };
      translate.storage.browser.storage.set('old', 'new');
      return translate.storage.browser.storage.get('old') === 'new';
    }
  }
]);
