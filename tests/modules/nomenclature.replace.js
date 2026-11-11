'use strict';

require('../helpers/module')(__filename, [
  { remark: '没有匹配项时保留文本和未匹配片段', args: ['你好', '世界', 'World', null], expected: { find: false, texts: ['你好'], resultText: '你好' } },
  { remark: '空原文没有匹配项时保留空文本', args: ['', '世界', 'World', null], expected: { find: false, texts: [''], resultText: '' } },
  { remark: '空术语键不执行替换', args: ['你好', '', 'World', null], expected: { find: false, texts: ['你好'], resultText: '你好' } },
  { remark: '全文匹配时无剩余待翻译片段', args: ['你好', '你好', 'Hello', null], expected: { find: true, texts: [], resultText: 'Hello' } },
  { remark: '开头匹配保留后方剩余文本', args: ['你好世界', '你好', 'Hello', null], expected: { find: true, texts: ['世界'], resultText: 'Hello世界' } },
  { remark: '结尾匹配保留前方剩余文本', args: ['你好世界', '世界', 'World', null], expected: { find: true, texts: ['你好'], resultText: '你好World' } },
  { remark: '中间匹配分别保留前后片段', args: ['你好吗', '好', 'Good', null], expected: { find: true, texts: ['你', '吗'], resultText: '你Good吗' } },
  { remark: '多处匹配全部替换并保留各非空片段', args: ['你好我好她也好', '好', 'hao', null], expected: { find: true, texts: ['你', '我', '她也'], resultText: '你hao我hao她也hao' } },
  { remark: '相邻单字符匹配不生成空的剩余片段', args: ['好好好', '好', 'G', null], expected: { find: true, texts: [], resultText: 'GGG' } },
  { remark: '替换为空字符串时删除命中内容', args: ['aXbXc', 'X', '', null], expected: { find: true, texts: ['a', 'b', 'c'], resultText: 'abc' } },
  { remark: '术语键和值相同表示命中文本应排除后续翻译', args: ['ContiNew Admin', 'ContiNew Admin', 'ContiNew Admin', null], expected: { find: true, texts: [], resultText: 'ContiNew Admin' } },
  { remark: '术语中的正则特殊字符按普通文本匹配', args: ['a.b+a.b', 'a.b', '$&', null], expected: { find: true, texts: ['+'], resultText: '$&+$&' } },
  { remark: 'Unicode 和 emoji 作为完整文本替换', args: ['中😀文😀', '😀', '笑', null], expected: { find: true, texts: ['中', '文'], resultText: '中笑文笑' } },
  { remark: '含换行和空格的片段不被裁剪', args: [' A\nX B ', 'X', 'Y', null], expected: { find: true, texts: [' A\n', ' B '], resultText: ' A\nY B ' } },
  { remark: '术语键比原文长时不匹配', args: ['a', 'abc', 'X', null], expected: { find: false, texts: ['a'], resultText: 'a' } },
  {
    remark: '传入文本节点对象时将术语译文渲染到节点',
    test: function () {
      translate.to = 'english';
      const node = document.createTextNode('你好');
      document.body.appendChild(node);
      const result = translate.nomenclature.replace('你好', '你好', 'Hello', { node });
      return result.find === true && result.resultText === 'Hello' && node.nodeValue === 'Hello';
    }
  },
  {
    remark: '没有命中术语时不修改传入节点',
    test: function () {
      const node = document.createTextNode('你好');
      const result = translate.nomenclature.replace('你好', '世界', 'World', { node });
      return result.find === false && node.nodeValue === '你好';
    }
  },
  {
    remark: '省略可选 nodeObject 时仍只处理文本结果',
    test: function () {
      const result = translate.nomenclature.replace('你好', '你好', 'Hello');
      return result.find === true && result.resultText === 'Hello' && result.texts.length === 0;
    }
  }
]);
