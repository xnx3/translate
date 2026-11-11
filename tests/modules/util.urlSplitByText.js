'use strict';

require('../helpers/module')(__filename, [
  { remark: '空字符串没有可分割片段', args: [''], expected: {} },
  { remark: '纯文字作为非 URL 片段保留', args: ['普通中文内容'], expected: { 普通中文内容: '0' } },
  { remark: '整个文本为 HTTPS 地址时标为 URL', args: ['https://example.test/path'], expected: { 'https://example.test/path': '1' } },
  { remark: '整个文本为 HTTP 地址时标为 URL', args: ['http://example.test'], expected: { 'http://example.test': '1' } },
  { remark: '中文前后文字与 URL 分开', args: ['前https://example.test后'], expected: { 前: '0', 'https://example.test': '1', 后: '0' } },
  { remark: '两个地址及中间的普通空格全部保留', args: ['https://a.test http://b.test'], expected: { 'https://a.test': '1', ' ': '0', 'http://b.test': '1' } },
  { remark: 'URL 查询和片段标识保留完整', args: ['https://example.test/p?a=1&b=2#part'], expected: { 'https://example.test/p?a=1&b=2#part': '1' } },
  { remark: '协议名大小写不同仍识别', args: ['HTTPS://EXAMPLE.TEST/P'], expected: { 'HTTPS://EXAMPLE.TEST/P': '1' } },
  { remark: 'URL 后的中文逗号不吞入网址', args: ['https://example.test，继续'], expected: { 'https://example.test': '1', '，继续': '0' } },
  { remark: '没有 HTTP 协议的域名保留为普通文本', args: ['example.test/path'], expected: { 'example.test/path': '0' } },
  { remark: 'FTP 协议不误识别为 HTTP URL', args: ['ftp://example.test/file'], expected: { 'ftp://example.test/file': '0' } },
  { remark: '重复 URL 作为同一个键时仍正确标识', args: ['https://a.test https://a.test'], expected: { 'https://a.test': '1', ' ': '0' } }
]);
