'use strict';

require('../helpers/module')(__filename, [
  { remark: '空数据库省略匹配参数返回空数组', args: [], expected: [] },
  { remark: '空数据库的空字符串匹配返回空数组', args: [''], expected: [] },
  { remark: '空数据库使用星号匹配返回空数组', args: ['*'], expected: [] },
  { remark: '空数据库查询不存在的具体键返回空数组', args: ['missing'], expected: [] },
  {
    remark: '具体键精确匹配且返回真实类型的值',
    test: async function () {
      await translate.storage.IndexedDB.set('user', 0);
      await translate.storage.IndexedDB.set('user2', 'other');
      const rows = await translate.storage.IndexedDB.list('user');
      return rows.length === 1 && rows[0].key === 'user' && rows[0].value === 0;
    }
  },
  {
    remark: '前缀星号匹配零个或多个字符',
    test: async function () {
      await translate.storage.IndexedDB.set('user', 'base');
      await translate.storage.IndexedDB.set('user001', 'child');
      await translate.storage.IndexedDB.set('other', 'excluded');
      const rows = await translate.storage.IndexedDB.list('user*');
      return rows.length === 2 && rows.some(row => row.key === 'user' && row.value === 'base') &&
        rows.some(row => row.key === 'user001' && row.value === 'child');
    }
  },
  {
    remark: '后缀匹配只返回指定结尾的键',
    test: async function () {
      await translate.storage.IndexedDB.set('done', 1);
      await translate.storage.IndexedDB.set('user-done', 2);
      await translate.storage.IndexedDB.set('done-later', 3);
      const rows = await translate.storage.IndexedDB.list('*done');
      return rows.length === 2 && rows.some(row => row.key === 'done') &&
        rows.some(row => row.key === 'user-done');
    }
  },
  {
    remark: '中间星号包含零字符和多个字符两种匹配',
    test: async function () {
      await translate.storage.IndexedDB.set('ab', 1);
      await translate.storage.IndexedDB.set('a-middle-b', 2);
      await translate.storage.IndexedDB.set('a-middle-c', 3);
      const rows = await translate.storage.IndexedDB.list('a*b');
      return rows.length === 2 && rows.some(row => row.key === 'ab') &&
        rows.some(row => row.key === 'a-middle-b');
    }
  },
  {
    remark: '多个星号可同时匹配多个位置',
    test: async function () {
      await translate.storage.IndexedDB.set('a-mid-b-tail-c', 1);
      await translate.storage.IndexedDB.set('abc', 2);
      await translate.storage.IndexedDB.set('acb', 3);
      const rows = await translate.storage.IndexedDB.list('a*b*c');
      return rows.length === 2 && rows.some(row => row.key === 'abc') &&
        rows.some(row => row.key === 'a-mid-b-tail-c');
    }
  },
  {
    remark: '单独星号返回所有记录并保留 false、null 和对象值',
    test: async function () {
      await translate.storage.IndexedDB.set('false', false);
      await translate.storage.IndexedDB.set('null', null);
      await translate.storage.IndexedDB.set('object', { nested: '中文' });
      const rows = await translate.storage.IndexedDB.list('*');
      return rows.length === 3 && rows.some(row => row.key === 'false' && row.value === false) &&
        rows.some(row => row.key === 'null' && row.value === null) &&
        rows.some(row => row.key === 'object' && row.value.nested === '中文');
    }
  },
  {
    remark: 'Unicode 前缀和 emoji 键可以模糊匹配',
    test: async function () {
      await translate.storage.IndexedDB.set('中文😀', 'match');
      await translate.storage.IndexedDB.set('english', 'excluded');
      const rows = await translate.storage.IndexedDB.list('中文*');
      return rows.length === 1 && rows[0].key === '中文😀' && rows[0].value === 'match';
    }
  },
  {
    remark: '匹配大小写敏感，不混合大小写不同的键',
    test: async function () {
      await translate.storage.IndexedDB.set('User', 'upper');
      await translate.storage.IndexedDB.set('user', 'lower');
      const rows = await translate.storage.IndexedDB.list('User');
      return rows.length === 1 && rows[0].value === 'upper';
    }
  }
]);
