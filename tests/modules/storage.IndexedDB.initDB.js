'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '首次初始化创建 translate.js 数据库并返回 undefined',
    test: async function () {
      const result = await translate.storage.IndexedDB.initDB();
      return result === undefined && translate.storage.IndexedDB.db instanceof IDBDatabase &&
        translate.storage.IndexedDB.db.name === 'translate.js';
    }
  },
  {
    remark: '初始化创建以 key 为主键的 kvStore 对象仓库',
    test: async function () {
      await translate.storage.IndexedDB.initDB();
      const db = translate.storage.IndexedDB.db;
      return db.version === 1 && db.objectStoreNames.contains('kvStore') &&
        db.transaction('kvStore', 'readonly').objectStore('kvStore').keyPath === 'key';
    }
  },
  {
    remark: '初始化后可以写入和读回数据',
    test: async function () {
      await translate.storage.IndexedDB.initDB();
      await translate.storage.IndexedDB.set('ready', 'value');
      return await translate.storage.IndexedDB.get('ready') === 'value';
    }
  },
  {
    remark: '关闭连接后重新初始化保留原有记录',
    test: async function () {
      await translate.storage.IndexedDB.set('persistent', 'saved');
      translate.storage.IndexedDB.db.close();
      translate.storage.IndexedDB.db = null;
      await translate.storage.IndexedDB.initDB();
      return await translate.storage.IndexedDB.get('persistent') === 'saved';
    }
  },
  {
    remark: '重复初始化不会清空已经写入的记录',
    test: async function () {
      await translate.storage.IndexedDB.initDB();
      await translate.storage.IndexedDB.set('repeat', 'saved');
      const previous = translate.storage.IndexedDB.db;
      await translate.storage.IndexedDB.initDB();
      previous.close();
      return await translate.storage.IndexedDB.get('repeat') === 'saved';
    }
  },
  {
    remark: '打开失败时 Promise 以已约定的错误信息拒绝',
    test: async function () {
      // 只模拟浏览器打开失败事件，仍执行 initDB 的真实错误处理分支。
      indexedDB.open = function () {
        const request = {};
        queueMicrotask(function () { request.onerror({ target: request }); });
        return request;
      };
      try {
        await translate.storage.IndexedDB.initDB();
        return false;
      } catch (error) {
        return error === 'IndexedDB 打开失败';
      }
    }
  }
]);
