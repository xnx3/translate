'use strict';

require('../helpers/module')(__filename, [
  { remark: '普通开始标签被识别', args: ['<div>'], expected: true },
  { remark: '普通结束标签被识别', args: ['</div>'], expected: true },
  { remark: '自闭合标签被识别', args: ['<br/>'], expected: true },
  { remark: '带属性的标签被识别', args: ['<img alt="图片">'], expected: true },
  { remark: '文本中间的标签被识别', args: ['前<span>后'], expected: true },
  { remark: '成对标签被识别', args: ['<b>文字</b>'], expected: true },
  { remark: '空字符串没有标签', args: [''], expected: false },
  { remark: '普通中文文本没有标签', args: ['普通文本'], expected: false },
  { remark: '只有左尖括号不构成标签', args: ['<div'], expected: false },
  { remark: '只有右尖括号不构成标签', args: ['div>'], expected: false },
  { remark: 'HTML 转义文本不构成实际标签', args: ['&lt;div&gt;'], expected: false },
  { remark: '空尖括号不构成标签内容', args: ['<>'], expected: false }
]);
