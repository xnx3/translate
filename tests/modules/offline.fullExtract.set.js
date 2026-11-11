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
  }
]);
