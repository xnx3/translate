'use strict';

require('../helpers/module')(__filename, [
  // 来源：verify.html 原始第 17 条，保留原来的局部结果判断。
  {
    remark: '测试传入一个字符串',
    test: function () {
      return translate.nomenclature.dispose('你好我好她也好', '好', 'hao', null).resultText[0] === '你hao我hao她也hao';
    }
  },
  // 来源：verify.html 原始第 18 条。
  {
    remark: '测试传入一个字符串数组',
    args: [['你好我好她也好', '萨达好收到好SS'], '好', 'hao', null],
    expected: { find: true, texts: ['你', '我', '她也', '萨达', '收到', 'SS'], resultText: ['你hao我hao她也hao', '萨达hao收到haoSS'] }
  },
  // 来源：verify.html 原始第 19 条；原备注写数组，实际输入为字符串，此处保留原始记录。
  {
    remark: '测试传入一个字符串数组 - 源文本 跟 自定义忽略翻译文本完全一致',
    args: ['ContiNew Admin', 'ContiNew Admin', 'ContiNew Admin', null],
    expected: { find: true, texts: [], resultText: ['ContiNew Admin'] }
  },
  { remark: '空输入数组返回空结果且未命中', args: [[], 'x', 'y', null], expected: { find: false, texts: [], resultText: [] } },
  { remark: '单条未命中字符串保持原文本', args: ['abc', 'x', 'y', null], expected: { find: false, texts: ['abc'], resultText: ['abc'] } },
  { remark: '单条空字符串保持空值而不丢失结果位置', args: ['', 'x', 'y', null], expected: { find: false, texts: [''], resultText: [''] } },
  { remark: '全文命中时不留下待翻译片段', args: [['x'], 'x', 'y', null], expected: { find: true, texts: [], resultText: ['y'] } },
  { remark: '混合命中与未命中条目保留输入顺序', args: [['aXb', 'keep', 'X'], 'X', 'Y', null], expected: { find: true, texts: ['a', 'b', 'keep'], resultText: ['aYb', 'keep', 'Y'] } },
  { remark: '跨条目的重复剩余片段按首次出现去重', args: [['aXa', 'aXb'], 'X', 'Y', null], expected: { find: true, texts: ['a', 'b'], resultText: ['aYa', 'aYb'] } },
  { remark: '没有任何匹配时也去除重复待翻译文本', args: [['same', 'same', 'other'], 'X', 'Y', null], expected: { find: false, texts: ['same', 'other'], resultText: ['same', 'same', 'other'] } },
  { remark: '空术语键不替换任何条目', args: [['abc', 'def'], '', 'Y', null], expected: { find: false, texts: ['abc', 'def'], resultText: ['abc', 'def'] } },
  { remark: '空替换值删除所有命中术语', args: [['aXa', 'X'], 'X', '', null], expected: { find: true, texts: ['a'], resultText: ['aa', ''] } },
  { remark: '相邻匹配不产生空片段', args: [['XXX'], 'X', 'Y', null], expected: { find: true, texts: [], resultText: ['YYY'] } },
  { remark: 'Unicode 和 emoji 在多个条目中正确替换', args: [['中😀', '😀文'], '😀', '笑', null], expected: { find: true, texts: ['中', '文'], resultText: ['中笑', '笑文'] } },
  { remark: '不把美元和正则符号当成替换表达式', args: [['a.b+a.b'], 'a.b', '$&', null], expected: { find: true, texts: ['+'], resultText: ['$&+$&'] } },
  {
    remark: '处理数组不修改调用方输入内容',
    test: function () {
      const input = ['aXb', 'keep'];
      const result = translate.nomenclature.dispose(input, 'X', 'Y', null);
      return input.length === 2 && input[0] === 'aXb' && input[1] === 'keep' &&
        result.resultText[0] === 'aYb';
    }
  },
  {
    remark: '省略可选 nodeObject 时仍可替换字符串数组',
    test: function () {
      const result = translate.nomenclature.dispose(['aXb'], 'X', 'Y');
      return result.find === true && result.resultText[0] === 'aYb';
    }
  },
  {
    remark: '传入节点对象时将单条全文命中结果写入真实 DOM',
    test: function () {
      translate.to = 'english';
      const node = document.createTextNode('你好');
      document.body.appendChild(node);
      const result = translate.nomenclature.dispose('你好', '你好', 'Hello', { node });
      return result.find === true && result.resultText[0] === 'Hello' && node.nodeValue === 'Hello';
    }
  },
  {
    remark: '批量术语结果保留空项与重复项的位置，只去重剩余待译文本',
    args: [['', 'X', '甲X乙', '', '甲X乙'], 'X', '', null],
    expected: { find: true, texts: ['', '甲', '乙'], resultText: ['', '', '甲乙', '', '甲乙'] }
  },
  {
    remark: '批量术语保留美元与反斜杠字面值，译文含原词时不递归替换',
    args: [['{ID}，{ID}', '{ID}'], '{ID}', '$&\\{ID}', null],
    expected: { find: true, texts: ['，'], resultText: ['$&\\{ID}，$&\\{ID}', '$&\\{ID}'] }
  },
  {
    remark: '批量术语写入控件指定属性时，正文和未命中的文本各自保留',
    test: function () {
      const node = document.createElement('input');
      node.title = '您好';
      node.value = '初始值';
      translate.to = 'chinese_simplified';
      const output = translate.nomenclature.dispose(['您好', '另一条'], '您', '你', { node, attribute: 'title' });
      return output.find === true && JSON.stringify(output.resultText) === JSON.stringify(['你好', '另一条']) &&
        JSON.stringify(output.texts) === JSON.stringify(['好', '另一条']) && node.title === '你好' && node.value === '初始值';
    }
  },
  {
    remark: '批量术语通过对象传入的 node 为 null 时保持原数组可复用',
    test: function () {
      const input = Object.freeze(['甲X', 'X', '甲X']);
      const result = translate.nomenclature.dispose(input, 'X', '乙', { node: null });
      return JSON.stringify(result.resultText) === JSON.stringify(['甲乙', '乙', '甲乙']) &&
        result.find === true && result.texts.length === 1 && result.texts[0] === '甲';
    }
  },
  {
    remark: '参数组合：同一术语出现在两个相邻数组元素的边界时不能跨元素匹配',
    args: [['前半', '句后', '半句半句', '前半'], '半句', '', null],
    expected: { find: true, texts: ['前半', '句后'], resultText: ['前半', '句后', '', '前半'] }
  },
  {
    remark: '参数组合：字面术语与译文相同，含换行和制表符的剩余片段按首现去重',
    args: [['A\t◆\nB', 'A\t◆', '◆\nB'], '◆', '◆'],
    expected: { find: true, texts: ['A\t', '\nB'], resultText: ['A\t◆\nB', 'A\t◆', '◆\nB'] }
  }
]);
