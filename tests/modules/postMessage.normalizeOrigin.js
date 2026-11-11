'use strict';

require('../helpers/module')(__filename, [
  { remark: '省略参数返回空字符串', args: [], expected: '' },
  { remark: '显式 undefined 返回空字符串', args: [undefined], expected: '' },
  { remark: 'null 不是 origin 字符串，返回空字符串', args: [null], expected: '' },
  { remark: '数值不是 origin 字符串，返回空字符串', args: [0], expected: '' },
  { remark: '布尔值不是 origin 字符串，返回空字符串', args: [false], expected: '' },
  { remark: '对象不是 origin 字符串，返回空字符串', args: [{}], expected: '' },
  { remark: '空字符串返回空字符串', args: [''], expected: '' },
  { remark: '纯空白字符串返回空字符串', args: [' \t\n '], expected: '' },
  { remark: '通配符保持星号', args: ['*'], expected: '*' },
  { remark: '通配符前后空白被裁剪', args: [' * '], expected: '*' },
  { remark: '不透明来源标识 null 保持字符串', args: ['null'], expected: 'null' },
  { remark: '不透明来源标识前后空白被裁剪', args: [' null '], expected: 'null' },
  { remark: 'HTTP 默认端口被规范化', args: ['http://Example.COM:80/path?x=1#part'], expected: 'http://example.com' },
  { remark: 'HTTPS 默认端口被规范化', args: ['https://Example.COM:443/path'], expected: 'https://example.com' },
  { remark: '非默认端口保留', args: ['https://example.com:8443/path'], expected: 'https://example.com:8443' },
  { remark: '用户名密码和路径不属于 origin', args: ['https://user:pass@example.com/path'], expected: 'https://example.com' },
  { remark: '文件 URL 规范化为不透明来源 null', args: ['file:///C:/index.html'], expected: 'null' },
  { remark: '没有主机的 mailto URL 返回空字符串', args: ['mailto:user@example.com'], expected: '' },
  { remark: '没有主机的 javascript URL 返回空字符串', args: ['javascript:void(0)'], expected: '' },
  { remark: 'IPv6 主机和非默认端口保持完整', args: ['http://[::1]:8123/path'], expected: 'http://[::1]:8123' }
]);
