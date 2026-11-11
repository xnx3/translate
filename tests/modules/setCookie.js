'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "写入英文时按现有 Cookie 编码约定保存",
    test: function () {
      const result = translate.setCookie('sample', 'hello');
      return result === undefined && document.cookie === "sample=hello";
    }
  },
  {
    remark: "写入空字符串时按现有 Cookie 编码约定保存",
    test: function () {
      const result = translate.setCookie('sample', '');
      return result === undefined && document.cookie === "sample=";
    }
  },
  {
    remark: "写入空格时按现有 Cookie 编码约定保存",
    test: function () {
      const result = translate.setCookie('sample', 'a b');
      return result === undefined && document.cookie === "sample=a%20b";
    }
  },
  {
    remark: "写入中文时按现有 Cookie 编码约定保存",
    test: function () {
      const result = translate.setCookie('sample', '中文');
      return result === undefined && document.cookie === "sample=%u4E2D%u6587";
    }
  },
  {
    remark: "写入分号和等号时按现有 Cookie 编码约定保存",
    test: function () {
      const result = translate.setCookie('sample', 'a;b=c');
      return result === undefined && document.cookie === "sample=a%3Bb%3Dc";
    }
  },
  {
    remark: "写入百分号和加号时按现有 Cookie 编码约定保存",
    test: function () {
      const result = translate.setCookie('sample', '%+');
      return result === undefined && document.cookie === "sample=%25+";
    }
  },
  {
    remark: "写入数字零时按现有 Cookie 编码约定保存",
    test: function () {
      const result = translate.setCookie('sample', 0);
      return result === undefined && document.cookie === "sample=0";
    }
  },
  {
    remark: "写入布尔false时按现有 Cookie 编码约定保存",
    test: function () {
      const result = translate.setCookie('sample', false);
      return result === undefined && document.cookie === "sample=false";
    }
  },
  {
    remark: "写入null时按现有 Cookie 编码约定保存",
    test: function () {
      const result = translate.setCookie('sample', null);
      return result === undefined && document.cookie === "sample=null";
    }
  },
  {
    remark: "写入undefined时按现有 Cookie 编码约定保存",
    test: function () {
      const result = translate.setCookie('sample', undefined);
      return result === undefined && document.cookie === "sample=undefined";
    }
  },
  {
    remark: "相同Cookie键再次写入会覆盖旧值",
    test: function () {
      translate.setCookie('same', 'first');
      translate.setCookie('same', 'second');
      return document.cookie === 'same=second';
    }
  },
  {
    remark: "写入第二个Cookie时保留第一个键",
    test: function () {
      translate.setCookie('first', 'one');
      translate.setCookie('second', 'two');
      const entries = document.cookie.split('; ').sort();
      return entries.length === 2 && entries[0] === 'first=one' && entries[1] === 'second=two';
    }
  },
  {
    remark: "省略value参数保存字符串 undefined",
    test: function () {
      translate.setCookie('missing');
      return document.cookie === 'missing=undefined';
    }
  }
]);
