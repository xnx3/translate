'use strict';

require('../helpers/module')(__filename, [
  { remark: '提取标准双引号背景图片 URL', args: ['url("https://images.example/a.png")'], expected: 'https://images.example/a.png' },
  { remark: '背景图查询参数和片段保留', args: ['url("https://images.example/a.png?v=1#part")'], expected: 'https://images.example/a.png?v=1#part' },
  { remark: '相对路径不会被额外转成绝对路径', args: ['url("../images/a.png")'], expected: '../images/a.png' },
  { remark: 'Unicode 与 emoji 路径不改变', args: ['url("/图片😀.png")'], expected: '/图片😀.png' },
  { remark: 'data 图片 URL 内容保持完整', args: ['url("data:image/png;base64,AAAA")'], expected: 'data:image/png;base64,AAAA' },
  { remark: '引号外的空白不进入返回值', args: ['  url("/a.png")  '], expected: '/a.png' },
  { remark: '双引号内的空格保持原样', args: ['url("/image with space.png")'], expected: '/image with space.png' },
  { remark: '空 URL 返回空字符串', args: ['url("")'], expected: '' },
  { remark: '空字符串输入原样返回', args: [''], expected: '' },
  { remark: '没有双引号的 none 字符串原样返回', args: ['none'], expected: 'none' },
  { remark: '没有双引号的普通 URL 原样返回', args: ['https://images.example/a.png'], expected: 'https://images.example/a.png' }
]);
