'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '无需手动初始化即可写入字符串，完成后返回 undefined',
    test: async function () {
      const result = await translate.storage.IndexedDB.set('string', '中文😀');
      return result === undefined && await translate.storage.IndexedDB.get('string') === '中文😀';
    }
  },
  {
    remark: '空字符串值可以保存且不变成缺失记录',
    test: async function () {
      await translate.storage.IndexedDB.set('empty', '');
      return await translate.storage.IndexedDB.get('empty') === '';
    }
  },
  {
    remark: '数值零保持数值类型',
    test: async function () {
      await translate.storage.IndexedDB.set('zero', 0);
      return await translate.storage.IndexedDB.get('zero') === 0;
    }
  },
  {
    remark: '布尔 false 保持布尔类型',
    test: async function () {
      await translate.storage.IndexedDB.set('false', false);
      return await translate.storage.IndexedDB.get('false') === false;
    }
  },
  {
    remark: 'null 值保持 null',
    test: async function () {
      await translate.storage.IndexedDB.set('null', null);
      return await translate.storage.IndexedDB.get('null') === null;
    }
  },
  {
    remark: '显式 undefined 值会保存记录而不是省略整个记录',
    test: async function () {
      await translate.storage.IndexedDB.set('undefined', undefined);
      const rows = await translate.storage.IndexedDB.list('undefined');
      return rows.length === 1 && rows[0].key === 'undefined' && rows[0].value === undefined;
    }
  },
  {
    remark: '省略 value 时按 undefined 保存记录',
    test: async function () {
      await translate.storage.IndexedDB.set('omitted');
      const rows = await translate.storage.IndexedDB.list('omitted');
      return rows.length === 1 && rows[0].value === undefined;
    }
  },
  {
    remark: '空字符串是可用的键',
    test: async function () {
      await translate.storage.IndexedDB.set('', 'empty-key');
      return await translate.storage.IndexedDB.get('') === 'empty-key';
    }
  },
  {
    remark: '数字零是可用的键',
    test: async function () {
      await translate.storage.IndexedDB.set(0, 'zero-key');
      return await translate.storage.IndexedDB.get(0) === 'zero-key';
    }
  },
  {
    remark: '负数是可用的数值键',
    test: async function () {
      await translate.storage.IndexedDB.set(-1, 'negative-key');
      return await translate.storage.IndexedDB.get(-1) === 'negative-key';
    }
  },
  {
    remark: '数组复合键可以写入并按同值数组查询',
    test: async function () {
      await translate.storage.IndexedDB.set(['user', 2], 'compound');
      return await translate.storage.IndexedDB.get(['user', 2]) === 'compound';
    }
  },
  {
    remark: 'Date 类型键按时间值读取',
    test: async function () {
      await translate.storage.IndexedDB.set(new Date('2026-01-01T00:00:00Z'), 'date-key');
      return await translate.storage.IndexedDB.get(new Date('2026-01-01T00:00:00Z')) === 'date-key';
    }
  },
  {
    remark: '写入嵌套对象后修改输入不会修改数据库副本',
    test: async function () {
      const input = { name: '中文', nested: [0, false] };
      await translate.storage.IndexedDB.set('object', input);
      input.nested[0] = 10;
      const value = await translate.storage.IndexedDB.get('object');
      return value.name === '中文' && value.nested[0] === 0 && value.nested[1] === false;
    }
  },
  {
    remark: '数组值保留顺序和元素类型',
    test: async function () {
      await translate.storage.IndexedDB.set('array', ['😀', 0, false, null]);
      const value = await translate.storage.IndexedDB.get('array');
      return Array.isArray(value) && value.length === 4 && value[0] === '😀' &&
        value[1] === 0 && value[2] === false && value[3] === null;
    }
  },
  {
    remark: '同一个键再次写入时替换旧值',
    test: async function () {
      await translate.storage.IndexedDB.set('same', 'before');
      await translate.storage.IndexedDB.set('same', 'after');
      return await translate.storage.IndexedDB.get('same') === 'after';
    }
  },
  {
    remark: '不同类型的键不会因字符串表示相同而互相覆盖',
    test: async function () {
      await translate.storage.IndexedDB.set(1, 'number');
      await translate.storage.IndexedDB.set('1', 'string');
      return await translate.storage.IndexedDB.get(1) === 'number' &&
        await translate.storage.IndexedDB.get('1') === 'string';
    }
  }
]);
