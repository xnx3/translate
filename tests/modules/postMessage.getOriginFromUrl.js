'use strict';

require('../helpers/module')(__filename, [
  { remark: '省略 URL 返回空字符串', args: [], expected: '' },
  { remark: '显式 undefined 返回空字符串', args: [undefined], expected: '' },
  { remark: 'null URL 返回空字符串', args: [null], expected: '' },
  { remark: '数值 URL 返回空字符串', args: [123], expected: '' },
  { remark: '对象 URL 返回空字符串', args: [{}], expected: '' },
  { remark: '空 URL 返回空字符串', args: [''], expected: '' },
  { remark: '纯空白 URL 返回空字符串', args: [' \t\n'], expected: '' },
  { remark: 'HTTP URL 只保留协议和主机', args: ['http://example.com/path?q=1#x'], expected: 'http://example.com' },
  { remark: 'HTTPS URL 的主机大小写被规范化', args: ['https://EXAMPLE.COM/path'], expected: 'https://example.com' },
  { remark: 'HTTP 默认端口不保留', args: ['http://example.com:80/'], expected: 'http://example.com' },
  { remark: 'HTTPS 默认端口不保留', args: ['https://example.com:443/'], expected: 'https://example.com' },
  { remark: '非默认端口保留', args: ['http://example.com:8124/'], expected: 'http://example.com:8124' },
  { remark: '用户名和密码被排除', args: ['https://a:b@example.com/path'], expected: 'https://example.com' },
  { remark: '文件协议返回 null 来源标识', args: ['file:///tmp/page.html'], expected: 'null' },
  { remark: 'data URL 没有可访问主机，返回空字符串', args: ['data:text/html,test'], expected: '' },
  { remark: 'about URL 没有主机，返回空字符串', args: ['about:blank'], expected: '' },
  { remark: 'IPv6 主机保持方括号和端口', args: ['http://[::1]:8124/page'], expected: 'http://[::1]:8124' },
  {
    remark: '相对路径按当前页面 URL 解析',
    test: function () {
      return translate.postMessage.getOriginFromUrl('/path?x=1') === location.origin;
    }
  },
  {
    remark: '相对父级路径仍解析为当前来源',
    test: function () {
      return translate.postMessage.getOriginFromUrl('../path') === location.origin;
    }
  },
  {
    remark: '省略协议的 URL 使用当前页面协议',
    test: function () {
      return translate.postMessage.getOriginFromUrl('//example.com/path') === location.protocol + '//example.com';
    }
  }
]);
