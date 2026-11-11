'use strict';

require('../helpers/module')(__filename, [
  { remark: '不存在的键同步返回 null', args: ['missing'], expected: null },
  { remark: '不存在的空字符串键返回 null', args: [''], expected: null },
  { remark: '缺省键不存在时返回 null', args: [], expected: null },
  { remark: '显式 undefined 键不存在时返回 null', args: [undefined], expected: null },
  { remark: 'null 键不存在时返回 null', args: [null], expected: null },
  {
    remark: '返回本地存储中的字符串而不是 JSON 解析后的对象',
    test: function () {
      localStorage.setItem('json', '{"value":0}');
      return translate.storage.get('json') === '{"value":0}';
    }
  },
  {
    remark: '已存储的空字符串必须与不存在区分',
    test: function () {
      localStorage.setItem('empty', '');
      return translate.storage.get('empty') === '';
    }
  },
  {
    remark: '数字键转换后读取同名字符串键',
    test: function () {
      localStorage.setItem('0', 'zero');
      return translate.storage.get(0) === 'zero';
    }
  },
  {
    remark: 'null 键与字符串 null 访问同一持久记录',
    test: function () {
      localStorage.setItem('null', 'null-key');
      return translate.storage.get(null) === 'null-key';
    }
  },
  {
    remark: '传入键原样委托到可替换的浏览器存储实现',
    test: function () {
      const key = { token: 'keep-reference' };
      let received;
      translate.storage.browser.storage.get = function (value) {
        received = value;
        return 'custom';
      };
      return translate.storage.get(key) === 'custom' && received === key;
    }
  },
  {
    remark: '委托调用保留浏览器存储对象作为 this',
    test: function () {
      let receiver;
      translate.storage.browser.storage.get = function () {
        receiver = this;
        return null;
      };
      return translate.storage.get('key') === null && receiver === translate.storage.browser.storage;
    }
  },
  {
    remark: '可替换实现返回空字符串时统一入口原样返回',
    test: function () {
      translate.storage.browser.storage.get = function () { return ''; };
      return translate.storage.get('key') === '';
    }
  },
  {
    remark: '持久存储被外部更新后读取新值',
    test: function () {
      localStorage.setItem('external', 'before');
      translate.storage.get('external');
      localStorage.setItem('external', 'after');
      return translate.storage.get('external') === 'after';
    }
  },
  {
    remark: '持久存储被外部删除后返回 null',
    test: function () {
      localStorage.setItem('external', 'before');
      translate.storage.get('external');
      localStorage.removeItem('external');
      return translate.storage.get('external') === null;
    }
  },
  {
    remark: '读取键名中的 Unicode、空格和标点时不额外规范化',
    test: function () {
      localStorage.setItem(' 中文😀:Key ', ' value\n');
      return translate.storage.get(' 中文😀:Key ') === ' value\n';
    }
  }
]);
