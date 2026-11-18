'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '首次记录保存原文和目标语种译文，完成后返回 undefined',
    test: async function () {
      const result = await translate.offline.fullExtract.set('first', '你好', 'english', 'Hello');
      const value = await translate.storage.IndexedDB.get('hash_first');
      return result === undefined && value.originalText === '你好' && value.english === 'Hello';
    }
  },
  {
    remark: '同一个 hash 追加第二目标语种时保留第一目标语种',
    test: async function () {
      await translate.offline.fullExtract.set('same', '你好', 'english', 'Hello');
      await translate.offline.fullExtract.set('same', '你好', 'spanish', 'Hola');
      const value = await translate.storage.IndexedDB.get('hash_same');
      return value.originalText === '你好' && value.english === 'Hello' && value.spanish === 'Hola';
    }
  },
  {
    remark: '相同 hash 和目标语种再次记录时采用新译文',
    test: async function () {
      await translate.offline.fullExtract.set('same', '你好', 'english', 'First');
      await translate.offline.fullExtract.set('same', '你好', 'english', 'Last');
      return (await translate.storage.IndexedDB.get('hash_same')).english === 'Last';
    }
  },
  {
    remark: '不同 hash 记录保持隔离',
    test: async function () {
      await translate.offline.fullExtract.set('one', '你好', 'english', 'Hello');
      await translate.offline.fullExtract.set('two', '世界', 'english', 'World');
      const first = await translate.storage.IndexedDB.get('hash_one');
      const second = await translate.storage.IndexedDB.get('hash_two');
      return first.originalText === '你好' && first.english === 'Hello' && second.originalText === '世界' && second.english === 'World';
    }
  },
  {
    remark: '数值零 hash 作为可用缓存标识',
    test: async function () {
      await translate.offline.fullExtract.set(0, '原文', 'english', 'Result');
      return (await translate.storage.IndexedDB.get('hash_0')).english === 'Result';
    }
  },
  {
    remark: 'Unicode 和换行原文译文保持完整',
    test: async function () {
      await translate.offline.fullExtract.set('unicode', '中文😀\n原文', 'english', 'English😀\nResult');
      const value = await translate.storage.IndexedDB.get('hash_unicode');
      return value.originalText === '中文😀\n原文' && value.english === 'English😀\nResult';
    }
  },
  {
    remark: '空译文可以记录并与不存在的语种字段区分',
    test: async function () {
      await translate.offline.fullExtract.set('empty', '原文', 'english', '');
      const value = await translate.storage.IndexedDB.get('hash_empty');
      return Object.prototype.hasOwnProperty.call(value, 'english') && value.english === '';
    }
  },
  {
    remark: 'IndexedDB 不可用时安全返回而不触发缓存操作',
    test: async function () {
      delete translate.storage.IndexedDB;
      return await translate.offline.fullExtract.set('hash', '原文', 'english', 'Result') === undefined;
    }
  },
  {
    remark: '同一原文并发保存不同目标语种时两个译文均可读回',
    test: async function () {
      const db = translate.storage.IndexedDB;
      await db.initDB();
      await Promise.all([
        translate.offline.fullExtract.set(42, '你好', 'english', 'Hello'),
        translate.offline.fullExtract.set(42, '你好', 'french', 'Bonjour')
      ]);
      const record = await db.get('hash_42');
      if (record?.originalText !== '你好' || record.english !== 'Hello' || record.french !== 'Bonjour') {
        throw new Error('并发完成后应同时保留 Hello 和 Bonjour，实际记录为 ' + JSON.stringify(record));
      }
      return true;
    }
  },
  {
    remark: '底层读取失败时拒绝本次提取且不继续写入',
    test: async function () {
      const db = translate.storage.IndexedDB, reason = new Error('unavailable');
      let writes = 0;
      db.get = async function () { throw reason; };
      db.set = async function () { writes++; };
      try {
        await translate.offline.fullExtract.set(42, '你好', 'english', 'Hello');
        return false;
      } catch (error) {
        return error === reason && writes === 0;
      }
    }
  }
]);
  },
  {
    remark: '提取写入失败保留旧语种与旧译文，重试成功后只覆盖指定语种',
    test: async function () {
      const db = translate.storage.IndexedDB;
      const save = translate.offline.fullExtract.set;
      await save('retry', '甲', 'english', 'One');
      await save('retry', '甲', 'french', 'Un');
      const write = db.set;
      const failure = new Error('write failed');
      db.set = async () => { throw failure; };
      let reason;
      try {
        await save('retry', '甲', 'english', 'First');
      } catch (error) {
        reason = error;
      } finally {
        db.set = write;
      }
      const old = await db.get('hash_retry');
      if (reason !== failure || old.english !== 'One' || old.french !== 'Un') return false;
      await save('retry', '甲', 'english', 'First');
      const latest = await db.get('hash_retry');
      return latest.originalText === '甲' && latest.english === 'First' && latest.french === 'Un';
    }
