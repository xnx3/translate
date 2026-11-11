'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '旧 append 接口把语种和配置原样转交 offline.append',
    test: function () {
      let received;
      translate.offline.append = function (to, properties) { received = [to, properties, this]; };
      const result = translate.office.append('english', '你好=Hello\n世界=World');
      return result === undefined && received[0] === 'english' && received[1] === '你好=Hello\n世界=World' &&
        received[2] === translate.offline;
    }
  },
  {
    remark: '空配置也由离线接口判断，旧包装层不丢弃调用',
    test: function () {
      let received;
      translate.offline.append = function (to, properties) { received = [to, properties]; };
      translate.office.append('spanish', '');
      return received[0] === 'spanish' && received[1] === '';
    }
  },
  {
    remark: '真实旧接口调用仍能生成对应语种缓存',
    test: function () {
      translate.office.append('english', '你好=Hello');
      return translate.storage.get('hash_english_' + translate.util.hash('你好')) === 'Hello';
    }
  },
  {
    remark: '旧包装层不把内部实现的返回值作为公开返回值',
    test: function () {
      translate.offline.append = function () { return 'internal'; };
      return translate.office.append('english', '你好=Hello') === undefined;
    }
  }
]);
