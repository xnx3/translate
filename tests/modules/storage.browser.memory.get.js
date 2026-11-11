'use strict';

require('../helpers/module')(__filename, [
  { remark: '不存在的普通键返回 null', args: ['missing'], expected: null },
  { remark: '不存在的空字符串键返回 null', args: [''], expected: null },
  { remark: '不存在的数字键转换后仍返回 null', args: [0], expected: null },
  { remark: '不存在的 null 键转换后返回 null', args: [null], expected: null },
  { remark: '省略键按 undefined 转换，未写入时返回 null', args: [], expected: null },
  { remark: '显式 undefined 键未写入时返回 null', args: [undefined], expected: null },
  { remark: '原型属性名不能被误认为已存入的键', args: ['__proto__'], expected: null },
  { remark: 'constructor 键未写入时返回 null', args: ['constructor'], expected: null },
  {
    remark: '读取字符串时保持大小写、换行、空格和 Unicode 原样',
    test: function () {
      const value = ' A\n中文😀 ';
      translate.storage.browser.memory.set('mixed', value);
      return translate.storage.browser.memory.get('mixed') === value;
    }
  },
  {
    remark: '已写入的空字符串与不存在的键区分',
    test: function () {
      translate.storage.browser.memory.set('empty', '');
      return translate.storage.browser.memory.get('empty') === '';
    }
  },
  {
    remark: '数字键和字符串键读取同一条记录',
    test: function () {
      translate.storage.browser.memory.set(12, 'twelve');
      return translate.storage.browser.memory.get('12') === 'twelve';
    }
  },
  {
    remark: '空字符串键可以读取，不能当成缺少参数',
    test: function () {
      translate.storage.browser.memory.set('', 'empty-key');
      return translate.storage.browser.memory.get('') === 'empty-key';
    }
  },
  {
    remark: '大小写不同的键保持独立',
    test: function () {
      translate.storage.browser.memory.set('Key', 'upper');
      translate.storage.browser.memory.set('key', 'lower');
      return translate.storage.browser.memory.get('Key') === 'upper' &&
        translate.storage.browser.memory.get('key') === 'lower';
    }
  },
  {
    remark: '仅内存写入的值不会被 localStorage 中同名旧值覆盖',
    test: function () {
      localStorage.setItem('local-only', 'disk');
      translate.storage.browser.memory.set('local-only', 'memory');
      return translate.storage.browser.memory.get('local-only') === 'memory';
    }
  },
  {
    remark: '读取被删除的键返回 null，不恢复旧值',
    test: function () {
      translate.storage.browser.memory.set('removed', 'before');
      translate.storage.browser.memory.remove('removed');
      return translate.storage.browser.memory.get('removed') === null;
    }
  }
]);
