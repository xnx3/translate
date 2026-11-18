'use strict';

// Playwright 在另一个 JS 运行环境执行用例，将固定样例与检查函数一起传给浏览器。
function scanCase(remark, html, check, ...args) {
  return { remark, test: new Function(`
    const root = document.createElement('div');
    root.innerHTML = ${JSON.stringify(html)};
    document.body.append(root);
    const scan = (node = root) => translate.element.whileNodes('article', node);
    const collect = () => translate.group._collectGroups('article');
    const texts = () => collect().map(group => group.words.map(word => word.text));
    return (${check})(root, scan, collect, texts, ...${JSON.stringify(args)});
  `) };
}

function excludesContent(root, scan, collect, texts) {
  translate.group.addElements(root);
  translate.group.addElements(root.firstElementChild);
  scan();
  return JSON.stringify(texts()) === JSON.stringify([['前'], ['后']]);
}

require('../helpers/module')(__filename, [
  { remark: '省略批次标识时没有候选组', args: [], expected: [] },
  { remark: 'null 批次标识时没有候选组', args: [null], expected: [] },
  scanCase('已登记区域但批次不存在时返回空数组', '正文', function (root, scan, collect) {
    translate.group.addElements(root);
    return collect().length === 0 && !Object.hasOwn(translate.nodeQueue, 'article');
  }),
  scanCase('扫描完成但没有登记任何区域时不收集', '正文', function (root, scan, collect) {
    scan();
    return collect().length === 0;
  }),
  scanCase('登记配置不是数组时返回空数组', '正文', function (root, scan, collect) {
    scan(); translate.group.elements = null;
    return collect().length === 0;
  }),
  scanCase('按快照顺序保留每段原文、权重和真实 Text 引用，重复收集结果彼此独立',
    ' 前 <b>同<i>同</i></b> 尾 ', function (root, scan, collect) {
      translate.group.addElements(root);
      scan();
      const nodes = [root.firstChild, root.querySelector('b').firstChild,
        root.querySelector('i').firstChild, root.lastChild];
      const original = root.innerHTML;
      const list = translate.nodeQueue.article.list;
      const result = collect(), again = collect();
      const expected = [
        { text: ' 前 ', weight: 0 }, { text: '同', weight: 1 },
        { text: '同', weight: 1 }, { text: ' 尾 ', weight: 0 }
      ];
      return result.length === 1 && JSON.stringify(result[0].words) === JSON.stringify(expected) &&
        result[0].nodes.length === nodes.length && result[0].nodes.every((node, i) => node === nodes[i]) &&
        again !== result && again[0].words !== result[0].words && again[0].nodes !== result[0].nodes &&
        root.innerHTML === original && translate.nodeQueue.article.list === list;
    }),
  scanCase('空 Text 跳过，纯空白段落丢弃，同段非空白正文两侧的空白保留', '<p>  </p><p> </p>',
    function (root, scan, collect, texts) {
      const paragraph = root.lastChild;
      paragraph.append(document.createTextNode(''), document.createTextNode('正文'), document.createTextNode('\t'));
      translate.group.addElements(root); scan();
      return JSON.stringify(texts()) === JSON.stringify([[' ', '正文', '\t']]);
    }),
  scanCase('只扫描文本根时沿当前父链确定分组和权重', '<strong>原文</strong>',
    function (root, scan, collect) {
      const node = root.querySelector('strong').firstChild;
      translate.group.addElements(root); scan(node);
      const [group] = collect();
      return group.nodes.length === 1 && group.nodes[0] === node &&
        JSON.stringify(group.words) === JSON.stringify([{ text: '原文', weight: 1 }]);
    }),
  scanCase('修改 nodeValue 后仍使用首次扫描文字', '原文', function (root, scan, collect) {
    translate.group.addElements(root); scan();
    root.firstChild.nodeValue = '新值';
    const [group] = collect();
    return group.words[0].text === '原文' && group.nodes[0] === root.firstChild &&
      root.firstChild.nodeValue === '新值';
  }),
  scanCase('内部节点移出原父链后跳过该节点，两侧不再连成一段', '前<b>移走</b>后',
    function (root, scan, collect, texts) {
      translate.group.addElements(root); scan();
      document.body.append(root.querySelector('b').firstChild);
      return JSON.stringify(texts()) === JSON.stringify([['前'], ['后']]);
    }),
  scanCase('整个扫描根移入新登记区域后采纳当前外层祖先', '<span>移动区域</span>',
    function (root, scan, collect) {
      const span = root.firstChild, destination = document.createElement('section');
      scan(span); destination.append(span); translate.group.addElements(destination);
      const groups = collect();
      return groups.length === 1 && groups[0].nodes[0] === span.firstChild &&
        groups[0].words[0].weight === 1;
    }),
  scanCase('重扫同一 Text 和重叠父子范围只收集一次', '前<b>中</b>后',
    function (root, scan, collect, texts) {
      translate.group.addElements(root);
      scan(root.firstChild); scan(root.querySelector('b')); scan(); scan();
      const groups = collect(), nodes = groups.flatMap(group => group.nodes);
      return JSON.stringify(texts()) === JSON.stringify([['前', '中', '后']]) &&
        nodes.length === 3 && new Set(nodes).size === 3;
    }),
  scanCase('嵌套登记均允许时采用最外根，不拆开行内文字', '前<b>中</b>后',
    function (root, scan, collect, texts) {
      translate.group.addElements(root.querySelector('b')); translate.group.addElements(root);
      scan();
      return JSON.stringify(texts()) === JSON.stringify([['前', '中', '后']]) &&
        collect()[0].words[1].weight === 1;
    }),
  scanCase('内层独立登记重新允许外层回调拒绝的分支，并按各自根重新计算权重',
    '前<span>略<b>独立</b></span>后', function (root, scan, collect, texts) {
      translate.group.addElements(root, element => element !== root.firstElementChild);
      translate.group.addElements(root.querySelector('b')); scan();
      return JSON.stringify(texts()) === JSON.stringify([['前'], ['独立'], ['后']]) &&
        collect()[1].words[0].weight === 0;
    }),
  scanCase('登记回调返回空值时仍允许后代', '前<b>中</b>后',
    function (root, scan, collect, texts) {
      translate.group.addElements(root, () => null); scan();
      return JSON.stringify(texts()) === JSON.stringify([['前', '中', '后']]);
    }),
  scanCase('同名条件 class 每次收到当前 Text，可保留部分内容并在空元素处分段',
    '前<span class="gate">忽略</span><span class="gate">保留</span><i class="gate"></i>后',
    function (root, scan, collect, texts) {
      translate.group.addElements(root);
      scan();
      const calls = [];
      translate.ignore.class.push('gate', (element, data) => {
        calls.push([element, data.node, data.attribute]);
        return data.node === root.firstElementChild.firstChild;
      });
      return JSON.stringify(texts()) === JSON.stringify([['前'], ['保留'], ['后']]) &&
        calls.some(([element, node, attr]) => element === root.firstElementChild &&
          node === element.firstChild && attr === '');
    }),
  ...[
    ['hidden', '<span hidden>隐</span>'], ['translate=NO', '<b translate="NO">隐</b>'],
    ['notranslate class', '<em class="extra notranslate">隐</em>'],
    ...['script', 'style', 'template', 'noscript', 'iframe', 'object', 'canvas', 'svg', 'math',
      'textarea', 'select', 'option', 'optgroup', 'button', 'datalist'].map(tag => [tag, '<' + tag + '>隐</' + tag + '>']),
    ...['link', 'meta', 'embed', 'input'].map(tag => [tag, '<' + tag + '>'])
  ].map(([name, markup]) => scanCase(name + ' 子树或空元素切断前后正文，单独登记仍遵守排除条件',
    '前' + markup + '后', excludesContent)),
  ...['id', 'tag', 'class'].map(kind => scanCase('忽略配置 ' + kind + ' 命中空元素仍切断前后正文',
    '前<i class="skip" id="skip"></i>后', function (root, scan, collect, texts, kind) {
      translate.group.addElements(root); scan();
      if (kind === 'class') translate.ignore.class.push('skip', null);
      else translate.ignore[kind].push(kind === 'id' ? 'skip' : 'i');
      return JSON.stringify(texts()) === JSON.stringify([['前'], ['后']]);
    }, kind)),
  scanCase('近似 notranslate 类名和 translate=yes 均保留可翻译文本',
    '前<b class="notranslate-more" translate="yes">中</b>后', function (root, scan, collect, texts) {
      translate.group.addElements(root); scan();
      return JSON.stringify(texts()) === JSON.stringify([['前', '中', '后']]);
    })
]);
