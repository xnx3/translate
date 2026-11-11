'use strict';

require('../helpers/module')(__filename, [
  { remark: '删除不存在的键返回 undefined', args: ['missing'], expected: undefined },
  { remark: '删除不存在的空键返回 undefined', args: [''], expected: undefined },
  { remark: '省略键返回 undefined', args: [], expected: undefined },
  { remark: '显式 undefined 键返回 undefined', args: [undefined], expected: undefined },
  { remark: 'null 键按 String 约定处理且返回 undefined', args: [null], expected: undefined },
  {
    remark: '已存在的键被删除后返回 null，删除操作无返回值',
    test: function () {
      translate.storage.browser.memory.set('key', 'value');
      const result = translate.storage.browser.memory.remove('key');
      return result === undefined && translate.storage.browser.memory.get('key') === null;
    }
  },
  {
    remark: '数字键删除对应字符串键',
    test: function () {
      translate.storage.browser.memory.set('12', 'value');
      translate.storage.browser.memory.remove(12);
      return translate.storage.browser.memory.get('12') === null;
    }
  },
  {
    remark: '可以删除值为空字符串的记录',
    test: function () {
      translate.storage.browser.memory.set('', '');
      translate.storage.browser.memory.remove('');
      return translate.storage.browser.memory.get('') === null;
    }
  },
  {
    remark: '删除一个键不影响其他键',
    test: function () {
      translate.storage.browser.memory.set('first', '1');
      translate.storage.browser.memory.set('second', '2');
      translate.storage.browser.memory.remove('first');
      return translate.storage.browser.memory.get('first') === null &&
        translate.storage.browser.memory.get('second') === '2';
    }
  },
  {
    remark: '连续删除同一记录保持无异常且不恢复数据',
    test: function () {
      translate.storage.browser.memory.set('repeat', 'before');
      translate.storage.browser.memory.remove('repeat');
      translate.storage.browser.memory.remove('repeat');
      return translate.storage.browser.memory.get('repeat') === null;
    }
  },
  {
    remark: '删除后可以重新写入同名记录',
    test: function () {
      translate.storage.browser.memory.set('rewrite', 'before');
      translate.storage.browser.memory.remove('rewrite');
      translate.storage.browser.memory.set('rewrite', 'after');
      return translate.storage.browser.memory.get('rewrite') === 'after';
    }
  },
  {
    remark: '删除原型属性名不会影响普通对象原型',
    test: function () {
      translate.storage.browser.memory.set('__proto__', 'safe');
      translate.storage.browser.memory.remove('__proto__');
      return translate.storage.browser.memory.get('__proto__') === null &&
        typeof Object.prototype.toString === 'function';
    }
  },
  {
    remark: '删除内存记录不删除同名的持久存储记录',
    test: function () {
      localStorage.setItem('disk', 'persistent');
      translate.storage.browser.memory.set('disk', 'temporary');
      translate.storage.browser.memory.remove('disk');
      return translate.storage.browser.memory.get('disk') === null &&
        localStorage.getItem('disk') === 'persistent';
    }
  }
]);
