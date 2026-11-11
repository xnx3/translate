require('../helpers/module')(__filename, [
  { remark: '收集嵌套行内节点的连续文本，保留真实 TextNode、顺序和原始空格', test: function () {
    translate.whole.context.use(); translate.whole.tag = ['p'];
    var root = document.createElement('p'); root.innerHTML = 'Please <a>read <strong>the docs</strong></a> now.'; document.body.append(root);
    var groups = translate.whole.context.collectInlineTextGroups(root);
    return groups.length === 1 && JSON.stringify(groups[0].texts) === '["Please ","read ","the docs"," now."]' && groups[0].nodes[0] === root.firstChild && groups[0].nodes[2] === root.querySelector('strong').firstChild;
  } },
  { remark: '功能未启用和根元素未命中时均返回空数组', test: function () {
    var root = document.createElement('p'); root.innerHTML = '甲<span>乙</span>'; document.body.append(root);
    translate.whole.tag = ['p']; var before = translate.whole.context.collectInlineTextGroups(root);
    translate.whole.context.use(); translate.whole.tag = [];
    return before.length === 0 && translate.whole.context.collectInlineTextGroups(root).length === 0;
  } },
  { remark: 'br 和 code 切断前后文本，代码自身不参与翻译', test: function () {
    translate.whole.context.use(); translate.whole.tag = ['p'];
    var root = document.createElement('p'); root.innerHTML = '甲<span>乙</span><br>丙<em>丁</em><code>npm install</code>戊<a>己</a>'; document.body.append(root);
    var groups = translate.whole.context.collectInlineTextGroups(root);
    return JSON.stringify(groups.map(function (group) { return group.texts; })) === '[["甲","乙"],["丙","丁"],["戊","己"]]';
  } },
  { remark: '嵌套块级元素形成边界，其内部内容不越级并入父级上下文', test: function () {
    translate.whole.context.use(); translate.whole.id = ['root'];
    var root = document.createElement('div'); root.id = 'root'; root.innerHTML = '甲<span>乙</span><p>内层<a>段落</a></p>丙<em>丁</em>'; document.body.append(root);
    return JSON.stringify(translate.whole.context.collectInlineTextGroups(root).map(function (group) { return group.texts; })) === '[["甲","乙"],["丙","丁"]]';
  } },
  { remark: '忽略区域切断分组，不能收集其中内容，也不能跨过它合并', test: function () {
    translate.whole.context.use(); translate.whole.tag = ['p']; translate.ignore.class.push('excluded');
    var root = document.createElement('p'); root.innerHTML = '甲<span>乙</span><em class="excluded">不要翻译</em>丙<a>丁</a>'; document.body.append(root);
    return JSON.stringify(translate.whole.context.collectInlineTextGroups(root).map(function (group) { return group.texts; })) === '[["甲","乙"],["丙","丁"]]';
  } },
  { remark: '只有单段文本和只有空白文本的根不产生上下文分组', test: function () {
    translate.whole.context.use(); translate.whole.tag = ['p'];
    var single = document.createElement('p'), blank = document.createElement('p'); single.textContent = '单独一段'; blank.innerHTML = ' \n<span>\t </span>'; document.body.append(single, blank);
    return translate.whole.context.collectInlineTextGroups(single).length === 0 && translate.whole.context.collectInlineTextGroups(blank).length === 0;
  } },
  { remark: '空白缩进不作为 segment，注释节点会切断上下文', test: function () {
    translate.whole.context.use(); translate.whole.tag = ['p'];
    var root = document.createElement('p'); root.innerHTML = '<span>甲</span> \n <a>乙</a><!--边界-->丙<em>丁</em>'; document.body.append(root);
    return JSON.stringify(translate.whole.context.collectInlineTextGroups(root).map(function (group) { return group.texts; })) === '[["甲","乙"],["丙","丁"]]';
  } },
  { remark: '纯收集不改写 DOM，不创建翻译队列和节点记录，重复收集结果稳定', test: function () {
    translate.whole.context.use(); translate.whole.tag = ['p'];
    var root = document.createElement('p'); root.innerHTML = '甲<span title="标题">乙</span>'; document.body.append(root);
    var html = root.innerHTML, queueKeys = Object.keys(translate.nodeQueue).join(','), first = translate.whole.context.collectInlineTextGroups(root), second = translate.whole.context.collectInlineTextGroups(root);
    return root.innerHTML === html && Object.keys(translate.nodeQueue).join(',') === queueKeys && first.length === 1 && second.length === 1 && first[0].nodes.every(function (node, index) { return node === second[0].nodes[index]; });
  } }
]);
