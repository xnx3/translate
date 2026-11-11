require('../helpers/module')(__filename, [
  { remark: '空节点数组不产生矩形', args: [[]], expected: [] },
  { remark: '空节点条目保留对应的空行', args: [[null, null]], expected: [[], []] },
  { remark: '元素节点返回实际布局的矩形及原节点引用', test: function () {
    const node = document.createElement('div');
    node.style.cssText = 'position:absolute;left:11px;top:12px;width:20px;height:30px;padding:0;border:0;';
    document.body.append(node);
    const result = translate.visual.getRects([node]);
    const rect = result[0][0];
    return result.length === 1 && result[0].length === 1 && rect.node === node && rect.left === 11 && rect.top === 12 && rect.right === 31 && rect.bottom === 42 && rect.width === 20 && rect.height === 30;
  } },
  { remark: '文本节点取得可见字符矩形并记录行号', test: function () {
    const span = document.createElement('span');
    span.textContent = 'Hello';
    document.body.append(span);
    const text = span.firstChild, result = translate.visual.getRects([text]);
    return result.length === 1 && result[0].length >= 1 && result[0][0].node === text && result[0][0].width > 0 && result[0][0].height > 0 && result[0][0].lineIndex === 0;
  } },
  { remark: '自动换行的文本返回多行矩形且行号连续', test: function () {
    const div = document.createElement('div');
    div.style.cssText = 'font:10px monospace;width:20px;word-break:break-all;';
    div.textContent = 'abcdefghij';
    document.body.append(div);
    const result = translate.visual.getRects([div.firstChild])[0];
    return result.length > 1 && result.every((rect, index) => rect.node === div.firstChild && rect.lineIndex === index) && result[result.length - 1].top > result[0].top;
  } },
  { remark: '注释节点不参与视觉矩形计算', test: function () {
    const comment = document.createComment('not visible');
    document.body.append(comment);
    const result = translate.visual.getRects([comment]);
    return result.length === 1 && result[0].length === 0;
  } },
  { remark: '元素与文本混合输入保持第一维顺序', test: function () {
    const div = document.createElement('div');
    div.textContent = 'hello';
    document.body.append(div);
    const result = translate.visual.getRects([div, null, div.firstChild]);
    return result.length === 3 && result[0][0].node === div && result[1].length === 0 && result[2][0].node === div.firstChild;
  } }
]);
