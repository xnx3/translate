'use strict';

require('../helpers/module')(__filename, [
  { remark: '未配置允许来源且省略参数时使用星号', args: [], expected: '*' },
  { remark: '显式 undefined 来源回退为星号', args: [undefined], expected: '*' },
  { remark: 'null 参数回退为星号', args: [null], expected: '*' },
  { remark: '空字符串回退为星号', args: [''], expected: '*' },
  { remark: '纯空白来源回退为星号', args: ['   '], expected: '*' },
  { remark: '显式通配符保持星号', args: ['*'], expected: '*' },
  { remark: '字符串 null 不透明来源转换为星号', args: ['null'], expected: '*' },
  { remark: 'file URL 不透明来源转换为星号', args: ['file:///tmp/page.html'], expected: '*' },
  { remark: '明确的 HTTPS 来源被规范化', args: ['https://EXAMPLE.com:443/path'], expected: 'https://example.com' },
  { remark: '明确来源的非默认端口保留', args: ['https://example.com:8443/path'], expected: 'https://example.com:8443' },
  {
    remark: '只有一个允许来源时，无参数使用该来源',
    test: function () {
      translate.postMessage.allowedOrigins = ['https://allowed.example/path'];
      return translate.postMessage.resolveTargetOrigin() === 'https://allowed.example';
    }
  },
  {
    remark: '显式来源优先于单个允许来源',
    test: function () {
      translate.postMessage.allowedOrigins = ['https://allowed.example'];
      return translate.postMessage.resolveTargetOrigin('https://target.example') === 'https://target.example';
    }
  },
  {
    remark: '多个允许来源且没有明确目标时回退为星号',
    test: function () {
      translate.postMessage.allowedOrigins = ['https://first.example', 'https://second.example'];
      return translate.postMessage.resolveTargetOrigin() === '*';
    }
  },
  {
    remark: '单个允许来源配置为星号时返回星号',
    test: function () {
      translate.postMessage.allowedOrigins = ['*'];
      return translate.postMessage.resolveTargetOrigin('') === '*';
    }
  },
  {
    remark: '单个允许来源不是字符串时不能作为目标来源',
    test: function () {
      translate.postMessage.allowedOrigins = [null];
      return translate.postMessage.resolveTargetOrigin() === '*';
    }
  }
]);
