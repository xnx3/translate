'use strict';

require('../helpers/module')(__filename, [
  { remark: "没有Cookie时返回空字符串", args: ["missing"], expected: '' },
  { remark: "省略键时不存在匹配则返回空字符串", args: [], expected: '' },
  {
    remark: "读取普通值时按Cookie编码还原",
    test: function () {
      document.cookie = "sample=hello";
      return translate.getCookie('sample') === "hello";
    }
  },
  {
    remark: "读取空值时按Cookie编码还原",
    test: function () {
      document.cookie = "sample=";
      return translate.getCookie('sample') === "";
    }
  },
  {
    remark: "读取空格时按Cookie编码还原",
    test: function () {
      document.cookie = "sample=a%20b";
      return translate.getCookie('sample') === "a b";
    }
  },
  {
    remark: "读取中文时按Cookie编码还原",
    test: function () {
      document.cookie = "sample=%u4E2D%u6587";
      return translate.getCookie('sample') === "中文";
    }
  },
  {
    remark: "读取符号时按Cookie编码还原",
    test: function () {
      document.cookie = "sample=a%3Bb%3Dc";
      return translate.getCookie('sample') === "a;b=c";
    }
  },
  {
    remark: "读取数字字符串时按Cookie编码还原",
    test: function () {
      document.cookie = "sample=0";
      return translate.getCookie('sample') === "0";
    }
  },
  {
    remark: "多个Cookie中精确查找目标键",
    test: function () {
      document.cookie = 'longname=wrong';
      document.cookie = 'name=right';
      return translate.getCookie('name') === 'right' && translate.getCookie('nam') === '';
    }
  },
  {
    remark: "Cookie键名区分大小写",
    test: function () {
      document.cookie = 'Key=upper';
      document.cookie = 'key=lower';
      return translate.getCookie('Key') === 'upper' && translate.getCookie('key') === 'lower';
    }
  }
]);
