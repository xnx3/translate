'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '写入字符串并同步返回 undefined',
    test: function () {
      const result = translate.storage.browser.memory.set('plain', 'value');
      return result === undefined && translate.storage.browser.memory.get('plain') === 'value';
    }
  },
  {
    remark: '写入空字符串，不能转成 null 或丢弃',
    test: function () {
      translate.storage.browser.memory.set('empty', '');
      return translate.storage.browser.memory.get('empty') === '';
    }
  },
  {
    remark: '数字 0 转成字符串而不是丢失',
    test: function () {
      translate.storage.browser.memory.set('zero', 0);
      return translate.storage.browser.memory.get('zero') === '0';
    }
  },
  {
    remark: '布尔 false 按 String 约定保存',
    test: function () {
      translate.storage.browser.memory.set('false', false);
      return translate.storage.browser.memory.get('false') === 'false';
    }
  },
  {
    remark: 'null 值按 String 约定保存',
    test: function () {
      translate.storage.browser.memory.set('null', null);
      return translate.storage.browser.memory.get('null') === 'null';
    }
  },
  {
    remark: '显式 undefined 值按 String 约定保存',
    test: function () {
      translate.storage.browser.memory.set('undefined', undefined);
      return translate.storage.browser.memory.get('undefined') === 'undefined';
    }
  },
  {
    remark: '省略 value 与显式 undefined 遵守同一转换约定',
    test: function () {
      translate.storage.browser.memory.set('omitted');
      return translate.storage.browser.memory.get('omitted') === 'undefined';
    }
  },
  {
    remark: '同时省略 key 和 value，保存字符串 undefined 键和值',
    test: function () {
      translate.storage.browser.memory.set();
      return translate.storage.browser.memory.get('undefined') === 'undefined';
    }
  },
  {
    remark: '数字键可以由对应字符串读取',
    test: function () {
      translate.storage.browser.memory.set(0, 'zero-key');
      return translate.storage.browser.memory.get('0') === 'zero-key';
    }
  },
  {
    remark: '空字符串键可以写入',
    test: function () {
      translate.storage.browser.memory.set('', 'value');
      return translate.storage.browser.memory.get('') === 'value';
    }
  },
  {
    remark: 'null 键与字符串 null 访问同一记录',
    test: function () {
      translate.storage.browser.memory.set(null, 'null-key');
      return translate.storage.browser.memory.get('null') === 'null-key';
    }
  },
  {
    remark: '普通对象不会隐式 JSON 序列化',
    test: function () {
      translate.storage.browser.memory.set('object', { a: 1 });
      return translate.storage.browser.memory.get('object') === '[object Object]';
    }
  },
  {
    remark: '调用方预先 JSON 序列化的内容原样保存',
    test: function () {
      translate.storage.browser.memory.set('json', '{"name":"中文","count":0}');
      return translate.storage.browser.memory.get('json') === '{"name":"中文","count":0}';
    }
  },
  {
    remark: '覆盖同一个键时只读取最后写入值',
    test: function () {
      translate.storage.browser.memory.set('same', 'first');
      translate.storage.browser.memory.set('same', 'second');
      return translate.storage.browser.memory.get('same') === 'second';
    }
  },
  {
    remark: '原型属性名作为普通键保存，不能污染 Object 原型',
    test: function () {
      translate.storage.browser.memory.set('__proto__', 'safe');
      return translate.storage.browser.memory.get('__proto__') === 'safe' &&
        Object.prototype.safe === undefined;
    }
  },
  {
    remark: 'Unicode 键和值以及首尾空格原样保存',
    test: function () {
      translate.storage.browser.memory.set(' 中文😀 ', ' \n值😀 ');
      return translate.storage.browser.memory.get(' 中文😀 ') === ' \n值😀 ';
    }
  },
  {
    remark: '内存写入不会持久化到 localStorage',
    test: function () {
      localStorage.removeItem('memory-only');
      translate.storage.browser.memory.set('memory-only', 'temporary');
      return localStorage.getItem('memory-only') === null;
    }
  }
]);
