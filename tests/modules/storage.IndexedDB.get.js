'use strict';

require('../helpers/module')(__filename, [
  { remark: '没有记录的字符串键返回 undefined', args: ['missing'], expected: undefined },
  { remark: '没有记录的数字零键返回 undefined', args: [0], expected: undefined },
  { remark: '没有记录的空字符串键返回 undefined', args: [''], expected: undefined },
  {
    remark: '无需预先初始化即可读取已有字符串记录',
    test: async function () {
      await translate.storage.IndexedDB.set('string', '中文😀');
      return await translate.storage.IndexedDB.get('string') === '中文😀';
    }
  },
  {
    remark: '读回数字零时保持数字类型',
    test: async function () {
      await translate.storage.IndexedDB.set('zero', 0);
      return await translate.storage.IndexedDB.get('zero') === 0;
    }
  },
  {
    remark: '读回 false 时保持布尔类型',
    test: async function () {
      await translate.storage.IndexedDB.set('false', false);
      return await translate.storage.IndexedDB.get('false') === false;
    }
  },
  {
    remark: '读回 null 时保持 null 值',
    test: async function () {
      await translate.storage.IndexedDB.set('null', null);
      return await translate.storage.IndexedDB.get('null') === null;
    }
  },
  {
    remark: '读回空字符串时与缺失记录区分',
    test: async function () {
      await translate.storage.IndexedDB.set('empty', '');
      return await translate.storage.IndexedDB.get('empty') === '';
    }
  },
  {
    remark: '读回数组的元素、顺序和类型保持不变',
    test: async function () {
      await translate.storage.IndexedDB.set('array', ['中文', 0, false, null]);
      const value = await translate.storage.IndexedDB.get('array');
      return Array.isArray(value) && value.length === 4 && value[0] === '中文' &&
        value[1] === 0 && value[2] === false && value[3] === null;
    }
  },
  {
    remark: '对象读取保留嵌套结构且不共享原输入对象引用',
    test: async function () {
      const input = { nested: { value: 'saved' } };
      await translate.storage.IndexedDB.set('object', input);
      input.nested.value = 'changed';
      const value = await translate.storage.IndexedDB.get('object');
      return value !== input && value.nested.value === 'saved';
    }
  },
  {
    remark: '数字键和同内容字符串键保持独立',
    test: async function () {
      await translate.storage.IndexedDB.set(1, 'number');
      await translate.storage.IndexedDB.set('1', 'string');
      return await translate.storage.IndexedDB.get(1) === 'number';
    }
  },
  {
    remark: '复合数组键按 IndexedDB 键规则读取',
    test: async function () {
      await translate.storage.IndexedDB.set(['user', 1], 'compound');
      return await translate.storage.IndexedDB.get(['user', 1]) === 'compound';
    }
  },
  {
    remark: '关闭连接并清空引用后自动重新初始化再读取',
    test: async function () {
      await translate.storage.IndexedDB.set('reopen', 'saved');
      translate.storage.IndexedDB.db.close();
      translate.storage.IndexedDB.db = null;
      return await translate.storage.IndexedDB.get('reopen') === 'saved';
    }
  }
]);
