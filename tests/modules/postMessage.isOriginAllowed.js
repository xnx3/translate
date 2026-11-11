'use strict';

require('../helpers/module')(__filename, [
  { remark: '省略来源时拒绝', args: [], expected: false },
  { remark: 'undefined 来源被拒绝', args: [undefined], expected: false },
  { remark: 'null 参数被拒绝', args: [null], expected: false },
  { remark: '非字符串来源被拒绝', args: [123], expected: false },
  { remark: '空字符串来源被拒绝', args: [''], expected: false },
  { remark: '纯空白来源被拒绝', args: [' \n '], expected: false },
  { remark: '默认空名单允许有效外部来源', args: ['https://external.example'], expected: true },
  { remark: '默认空名单允许字符串 null 不透明来源', args: ['null'], expected: true },
  {
    remark: '配置非空名单后允许精确匹配的来源',
    test: function () {
      translate.postMessage.allowedOrigins = ['https://allowed.example'];
      return translate.postMessage.isOriginAllowed('https://allowed.example') === true;
    }
  },
  {
    remark: '配置非空名单后拒绝其他外部来源',
    test: function () {
      translate.postMessage.allowedOrigins = ['https://allowed.example'];
      return translate.postMessage.isOriginAllowed('https://denied.example') === false;
    }
  },
  {
    remark: '当前页面同源来源不受外部允许名单限制',
    test: function () {
      translate.postMessage.allowedOrigins = ['https://other.example'];
      return translate.postMessage.isOriginAllowed(location.origin) === true;
    }
  },
  {
    remark: '星号名单允许任意有效来源',
    test: function () {
      translate.postMessage.allowedOrigins = ['*'];
      return translate.postMessage.isOriginAllowed('https://any.example') === true;
    }
  },
  {
    remark: '即使存在星号允许项，空来源仍应拒绝',
    test: function () {
      translate.postMessage.allowedOrigins = ['*'];
      return translate.postMessage.isOriginAllowed('') === false;
    }
  },
  {
    remark: '名单与收到的来源经过相同规范化后比较',
    test: function () {
      translate.postMessage.allowedOrigins = [' https://EXAMPLE.com:443/path '];
      return translate.postMessage.isOriginAllowed('https://example.com') === true;
    }
  },
  {
    remark: '主机相同但协议不同仍是不同来源',
    test: function () {
      translate.postMessage.allowedOrigins = ['https://example.com'];
      return translate.postMessage.isOriginAllowed('http://example.com') === false;
    }
  },
  {
    remark: '主机相同但非默认端口不同仍是不同来源',
    test: function () {
      translate.postMessage.allowedOrigins = ['https://example.com:8443'];
      return translate.postMessage.isOriginAllowed('https://example.com:8444') === false;
    }
  },
  {
    remark: '子域名不能冒充名单中的父域名',
    test: function () {
      translate.postMessage.allowedOrigins = ['https://example.com'];
      return translate.postMessage.isOriginAllowed('https://evil.example.com') === false;
    }
  },
  {
    remark: '多个名单项中的后续匹配项同样有效',
    test: function () {
      translate.postMessage.allowedOrigins = ['https://first.example', 'https://second.example'];
      return translate.postMessage.isOriginAllowed('https://second.example') === true;
    }
  },
  {
    remark: '字符串 null 来源可被显式允许',
    test: function () {
      translate.postMessage.allowedOrigins = ['null'];
      return translate.postMessage.isOriginAllowed('null') === true;
    }
  }
]);
