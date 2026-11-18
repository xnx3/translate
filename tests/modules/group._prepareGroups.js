'use strict';

// 每个样例独立初始化普通队列；需要覆盖旧记录和特殊队列形态时再由样例修改。
function batchCase(remark, html, check, ...args) {
  return { remark, test: new Function(`
    translate.language.setLocal('chinese_simplified');
    translate.to = 'english';
    translate.whole.enableAll();
    const root = document.createElement('div');
    root.innerHTML = ${JSON.stringify(html)};
    document.body.append(root);
    translate.group.addElements(root);
    translate.element.whileNodes('article', root);
    const batch = translate.nodeQueue.article;
    const prepare = () => translate.group._prepareGroups('article');
    return (${check})(root, batch, prepare, ...${JSON.stringify(args)});
  `) };
}

function rejectsChangedRecord(root, batch, prepare, key, value) {
  const nodes = [root.firstChild, root.lastChild.firstChild];
  const record = translate.node.get(nodes[1]);
  record[key] = value;
  const entries = Object.values(batch.list.chinese_simplified);
  return prepare().length === 0 && batch.groups.length === 0 &&
    entries.length === 2 && nodes.every(node =>
      Object.values(batch.list.chinese_simplified).some(item => item.nodes.some(target => target.node === node)));
}

require('../helpers/module')(__filename, [
  { remark: '省略批次标识返回空数组', args: [], expected: [] },
  { remark: 'null 批次标识返回空数组', args: [null], expected: [] },
  { remark: '未创建的批次返回空数组', args: ['missing'], expected: [] },
  {
    remark: '已有批次缺少普通 list 时不写入 groups',
    test: function () {
      translate.to = 'english';
      translate.nodeQueue.article = {};
      return translate.group._prepareGroups('article').length === 0 &&
        !Object.hasOwn(translate.nodeQueue.article, 'groups');
    }
  },
  ...[null, '', 123].map(target => batchCase('目标语种为 ' + JSON.stringify(target) + ' 时保留队列且允许重试',
    '正文', function (root, batch, prepare, target) {
      const list = batch.list.chinese_simplified, item = Object.values(list)[0];
      translate.to = target;
      const rejected = prepare().length === 0 && !Object.hasOwn(batch, 'groups') &&
        Object.values(batch.list.chinese_simplified)[0] === item && item.nodes[0].node === root.firstChild;
      translate.to = 'english';
      return rejected && prepare().length === 1;
    }, target)),
  batchCase('按节点迁移，每个词保留原文、权重和目标语言；记录及 DOM 保持原值',
    '段落<b>强调</b>', function (root, batch, prepare) {
      const first = root.firstChild, second = root.lastChild.firstChild;
      const records = [translate.node.get(first), translate.node.get(second)];
      const groups = prepare(), [group] = groups;
      const expected = [{ text: '段落', weight: 0 }, { text: '强调', weight: 1 }];
      return groups === batch.groups && groups.length === 1 && group.to === 'english' &&
        !Object.hasOwn(group, 'from') && JSON.stringify(group.words) === JSON.stringify(expected) &&
        group.nodes.length === 2 && group.nodes[0] === first && group.nodes[1] === second &&
        Object.keys(batch.list).length === 0 && records[0] === translate.node.get(first) &&
        records[1] === translate.node.get(second) && root.textContent === '段落强调' &&
        records[0].originalText === '段落' && records[1].originalText === '强调';
    }),
  batchCase('准备后切换目标语言并再次调用时复用原分组和原语种', '正文',
    function (root, batch, prepare) {
      const first = prepare();
      translate.to = 'japanese';
      return first.length === 1 && prepare() === first && first[0].to === 'english' &&
        Object.keys(batch.list).length === 0;
    }),
  batchCase('无合格内容的空 groups 也可重复读取', '', function (root, batch, prepare) {
    const first = prepare();
    return first.length === 0 && prepare() === first && first === batch.groups;
  }),
  batchCase('相同 hash 的区域外正文、title 属性及实时 value 保留原目标和顺序',
    '同文', function (root, batch, prepare) {
      const outside = document.createElement('span'), input = document.createElement('input');
      outside.textContent = '同文'; outside.title = '同文'; input.value = '同文';
      document.body.append(outside, input);
      translate.element.tagAttribute.input = { attribute: ['value'] };
      translate.element.whileNodes('article', outside);
      translate.element.whileNodes('article', input);
      const item = Object.values(batch.list.chinese_simplified)[0];
      const oldTargets = item.nodes.filter(target => target.node !== root.firstChild);
      const [group] = prepare();
      return group.nodes.length === 1 && group.nodes[0] === root.firstChild &&
        Object.values(batch.list.chinese_simplified)[0] === item &&
        item.nodes.length === 3 && item.nodes.every((target, i) => target === oldTargets[i]) &&
        item.nodes.some(target => target.node === outside.firstChild) &&
        item.nodes.some(target => target.node === outside.getAttributeNode('title')) &&
        item.nodes.some(target => target.node === input && target.attribute === 'value');
    }),
  batchCase('重复文字的不同 Text 节点按位置迁移为两项', '相同<b>相同</b>',
    function (root, batch, prepare) {
      const [group] = prepare();
      return group.nodes.length === 2 && group.nodes[0] === root.firstChild &&
        group.nodes[1] === root.querySelector('b').firstChild &&
        group.words[0].text === '相同' && group.words[1].text === '相同' && Object.keys(batch.list).length === 0;
    }),
  batchCase('已修改的文字使整个候选保留普通任务，其他段落独立迁移',
    '<p>开始<b>结尾</b></p><p>另一段</p>', function (root, batch, prepare) {
      const changed = root.querySelector('b').firstChild;
      changed.nodeValue = '新值';
      const groups = prepare();
      const remaining = Object.values(batch.list.chinese_simplified).flatMap(item => item.nodes);
      return groups.length === 1 && groups[0].nodes[0] === root.lastChild.firstChild &&
        remaining.length === 2 && remaining.some(target => target.node === root.firstChild.firstChild) &&
        remaining.some(target => target.node === changed) && changed.nodeValue === '新值';
    }),
  ...[
    ['whole', false], ['originalText', '旧原文'], ['resultText', '已译'], ['resultText', ''], ['lastTranslateRenderTime', 0]
  ].map(([field, value]) => batchCase('待翻译节点已有 ' + field + '=' + JSON.stringify(value) + ' 时整组回退',
    '开始<b>结尾</b>', rejectsChangedRecord, field, value)),
  batchCase('待翻译节点缺少历史记录时不迁移同组任何节点', '开始<b>结尾</b>',
    function (root, batch, prepare) {
      translate.node.delete(root.lastChild.firstChild);
      return prepare().length === 0 && Object.keys(batch.list.chinese_simplified).length === 2;
    }),
  batchCase('同一正文同时属于特殊队列项时保留普通项与特殊项', '开始<b>结尾</b>',
    function (root, batch, prepare) {
      const queue = batch.list.chinese_simplified, node = root.querySelector('b').firstChild;
      const special = { type: 'wholeContext', nodes: [{ node, attribute: '' }] };
      queue.special = special;
      return prepare().length === 0 && Object.keys(queue).length === 3 &&
        queue.special === special && special.nodes[0].node === node;
    }),
  batchCase('无任务的非目标语种片段使同组其他待翻译项留在普通队列', '开始<b>结尾</b>',
    function (root, batch, prepare) {
      const queue = batch.list.chinese_simplified, second = root.lastChild.firstChild;
      const key = Object.keys(queue).find(key => queue[key].nodes.some(target => target.node === second));
      delete queue[key];
      const entries = Object.values(queue);
      return prepare().length === 0 && Object.keys(queue).length === 1 &&
        entries[0].nodes[0].node === root.firstChild;
    }),
  ...['Hello', '123', '!?', ' \t'].map(context => batchCase('待译正文旁保留上下文 ' + JSON.stringify(context),
    '正文<b>' + context + '</b>', function (root, batch, prepare, context) {
      const groups = prepare();
      return groups.length === 1 &&
        JSON.stringify(groups[0].words) === JSON.stringify([{ text: '正文', weight: 0 }, { text: context, weight: 1 }]) &&
        groups[0].nodes[1] === root.lastChild.firstChild && Object.keys(batch.list).length === 0;
    }, context)),
  ...['Hello', '123', '!?'].map(context => batchCase('只有 ' + context + ' 的段落不触发分组翻译', context,
    function (root, batch, prepare) { return prepare().length === 0 && batch.groups.length === 0; })),
  ...['ignore', 'term', 'regex'].map(protection => batchCase('原样目标语言上下文命中 ' + protection + ' 时整组回退',
    '正文<b>Hello</b>', function (root, batch, prepare, protection) {
      const node = root.lastChild.firstChild;
      translate.node.set(node, { originalText: 'Hello', resultText: 'Hello' });
      const regex = /ell/g; regex.lastIndex = 2;
      if (protection === 'ignore') translate.ignore.text.push('ell');
      if (protection === 'term') translate.nomenclature.data.chinese_simplified = { english: { ell: '替代' } };
      if (protection === 'regex') translate.ignore.textRegex.push(regex);
      return prepare().length === 0 && Object.values(batch.list.chinese_simplified)[0].nodes[0].node === root.firstChild &&
        regex.lastIndex === 2;
    }, protection)),
  batchCase('已渲染的上下文记录必须与当前原文一致', '正文<b>Hello</b>',
    function (root, batch, prepare) {
      translate.node.set(root.lastChild.firstChild, { originalText: 'Hello', resultText: 'World' });
      return prepare().length === 0 && Object.keys(batch.list.chinese_simplified).length === 1;
    }),
  batchCase('语言范围允许所有非目标语种且目标语种在范围外时也可分组', '文本<b>Hello</b>',
    function (root, batch, prepare) {
      translate.language.translateLanguagesRange = ['chinese_simplified'];
      const groups = prepare();
      return groups.length === 1 && groups[0].nodes.length === 2 && Object.keys(batch.list).length === 0;
    }),
  batchCase('片段含范围外的非目标语种时整个候选留在普通队列', '中文<b>日本かな</b>',
    function (root, batch, prepare) {
      translate.language.translateLanguagesRange = ['chinese_simplified'];
      const first = Object.values(batch.list.chinese_simplified)[0];
      return prepare().length === 0 && Object.values(batch.list.chinese_simplified)[0] === first &&
        first.nodes[0].node === root.firstChild;
    }),
  batchCase('多种非目标语种共用一组，迁出不同语种下同一个节点的全部普通任务', '中文<b>かな</b>',
    function (root, batch, prepare) {
      const second = root.lastChild.firstChild;
      const shared = { node: second };
      batch.list.chinese_simplified.shared = { nodes: [shared] };
      const groups = prepare();
      return groups.length === 1 && !Object.hasOwn(groups[0], 'from') && groups[0].nodes[1] === second &&
        groups[0].words[1].text === 'かな' && Object.keys(batch.list).length === 0;
    }),
  batchCase('不完整的无关队列不妨碍迁移；保留无效目标及显式属性目标', '正文',
    function (root, batch, prepare) {
      const queue = batch.list.chinese_simplified, original = Object.values(queue)[0];
      const attributeTarget = { node: root.firstChild, attribute: 'example' };
      original.nodes.push(null, {}, attributeTarget);
      queue.unrelated = {}; batch.list.empty = null; batch.list.legacy = 1;
      const groups = prepare();
      return groups.length === 1 && groups[0].nodes[0] === root.firstChild && original.nodes.length === 3 &&
        original.nodes[0] === null && original.nodes[2] === attributeTarget && Object.hasOwn(queue, 'unrelated') &&
        batch.list.empty === null && batch.list.legacy === 1;
    })
]);
