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
  },
  {
    remark: '非法键以 DataError 拒绝，后续合法写入和已有记录均可读取',
    test: async function () {
      const db = translate.storage.IndexedDB;
      await db.set('existing', 1);
      for (const key of [undefined, null, false, NaN, {}, ['valid', null], new Date(NaN)]) {
        try {
          await db.set(key, 'invalid');
          return false;
        } catch (error) {
          if (error.name !== 'DataError') return false;
        }
      }
      await db.set('after', 2);
      return await db.get('existing') === 1 && await db.get('after') === 2;
    }
  },
  {
    remark: '覆盖写入包含不能结构化克隆的值时拒绝并保留旧值',
    test: async function () {
      const db = translate.storage.IndexedDB;
      await db.set('stable', { revision: 1 });
      try {
        await db.set('stable', { revision: 2, callback: function () {} });
        return false;
      } catch (error) {
        return error.name === 'DataCloneError' && (await db.get('stable')).revision === 1;
      }
    }
  },
  {
    remark: '二进制视图按字节作为键并与字符串和数组键分别存储',
    test: async function () {
      const db = translate.storage.IndexedDB;
      const buffer = Uint8Array.from([9, 1, 2, 8]);
      await db.set(buffer.subarray(1, 3), 'binary');
      await db.set('1,2', 'string');
      await db.set([1, 2], 'array');
      return await db.get(Uint8Array.of(1, 2).buffer) === 'binary' &&
        await db.get(buffer) === undefined && await db.get('1,2') === 'string' &&
        await db.get([1, 2]) === 'array';
    }
  },
  {
    remark: '[D17] 写请求成功但事务中止时拒绝写入，重读仍为已提交的旧值',
    test: async function () {
      const db = translate.storage.IndexedDB;
      await db.set('version', '旧值');
      const originalPut = IDBObjectStore.prototype.put;
      let aborted;
      IDBObjectStore.prototype.put = function (...args) {
        const request = originalPut.apply(this, args);
        const transaction = this.transaction;
        aborted = new Promise(resolve => transaction.addEventListener('abort', resolve, { once: true }));
        request.addEventListener('success', () => transaction.abort(), { once: true });
        return request;
      };
      let rejected = false;
      try {
        await db.set('version', '新值');
      } catch {
        rejected = true;
      } finally {
        IDBObjectStore.prototype.put = originalPut;
      }
      await aborted;
      const actual = await db.get('version');
      if (!rejected || actual !== '旧值') throw new Error('事务已回滚；set 是否拒绝=' + rejected + '，重读值=' + actual);
      return true;
    }
  },
  {
    remark: '首次并发写入不同键能够全部提交并在重开数据库后读取',
    test: async function () {
      const db = translate.storage.IndexedDB;
      await Promise.all([db.set('p1', false), db.set('p2', ['甲']), db.set('p3', 0)]);
      db.db.close();
      db.db = null;
      const rows = await db.list('p*');
      return rows.length === 3 && rows[0].key === 'p1' && rows[0].value === false &&
        rows[1].key === 'p2' && rows[1].value[0] === '甲' && rows[2].key === 'p3' && rows[2].value === 0;
    }
  }
]);
