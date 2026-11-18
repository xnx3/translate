// 每种节点形态和 title 状态独立登记；生成函数自包含，使用真实扫描和入队方法。
const htmlTitleCases = ['父节点', '叶子节点'].flatMap(function (shape) {
  return [
    { remark: '非空 title 保留原文和 Attr 目标', value: ' 标题文字 ', collected: true },
    { remark: '没有 title Attr 时不新增标题任务', value: null, collected: false },
    { remark: '空 title Attr 不新增标题任务', value: '', collected: false },
    { remark: '空白 title Attr 不新增标题任务', value: ' \t\n ', collected: false }
  ].map(function (item) {
    return { remark: 'HTML ' + shape + ' 的' + item.remark, test: new Function(`
      translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
      var root = document.createElement('div');
      if (${JSON.stringify(item.value)} !== null) root.setAttribute('title', ${JSON.stringify(item.value)});
      ${shape === '父节点' ? "root.textContent = '正文文字';" : ''}
      document.body.append(root);
      var title = root.getAttributeNode('title'), text = root.firstChild;
      translate.element.whileNodes('batch', root);
      var record = translate.node.get(title);
      var entries = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {});
      var targets = entries.flatMap(function (entry) { return entry.nodes; });
      var titleTargets = targets.filter(function (item) { return item.node === title; });
      var titleValid = ${JSON.stringify(item.collected)} ? record && record.originalText === ${JSON.stringify(item.value)} &&
        titleTargets.length === 1 && titleTargets[0].attribute === '' && title.nodeValue === ${JSON.stringify(item.value)} :
        record == null && titleTargets.length === 0;
      return titleValid === true && root.getAttributeNode('title') === title && translate.node.get(root) == null &&
        ${shape === '父节点' ? "text === root.firstChild && translate.node.get(text).originalText === '正文文字' && targets.some(function (item) { return item.node === text && item.attribute === ''; })" : "root.firstChild === null && targets.length === " + (item.collected ? '1' : '0')};
    `) };
  });
});

// 本轮顶部扫描也不再依赖 .title，抛错 getter 必须能完整通过 execute 缓存渲染及 reset。
const titleGetterCases = [
  { remark: '返回不同字符串', body: "return '属性外文字';" },
  { remark: '返回空字符串', body: "return '';" },
  { remark: '返回对象', body: "return { text: '属性外文字' };" },
  { remark: '直接抛错', body: "throw new Error('完整执行链不应读取 title getter');" }
].map(function (item) {
  return { remark: 'HTML 父节点 .title getter ' + item.remark + '，真实 Attr 和正文仍完成缓存翻译及还原', test: new Function(`
    translate.selectLanguageTag.show = false;
    translate.language.setLocal('chinese_simplified'); translate.to = 'english';
    translate.storage.set('hash_english_' + translate.util.hash('标题'), 'Title');
    translate.storage.set('hash_english_' + translate.util.hash('你好世界'), 'Hello world');
    var root = document.createElement('div'); root.setAttribute('title', '标题'); root.textContent = '你好世界'; document.body.append(root);
    var title = root.getAttributeNode('title'), text = root.firstChild, reads = 0, networkCalls = 0;
    Object.defineProperty(root, 'title', { get: function () { reads++; ${item.body} } });
    translate.lifecycle.execute.translateNetworkBefore.push(function () { networkCalls++; });
    translate.execute(root);
    var titleRecord = translate.node.get(title), textRecord = translate.node.get(text);
    var rendered = reads === 0 && title.nodeValue === 'Title' && text.nodeValue === 'Hello world' &&
      titleRecord && titleRecord.originalText === '标题' && titleRecord.resultText === 'Title' &&
      textRecord && textRecord.originalText === '你好世界' && textRecord.resultText === 'Hello world' &&
      root.getAttributeNode('title') === title && root.firstChild === text && networkCalls === 0 && translate.state === 0;
    translate.reset({ selectLanguageRefreshRender: false });
    return rendered === true && reads === 0 && title.nodeValue === '标题' && text.nodeValue === '你好世界' &&
      root.getAttributeNode('title') === title && root.firstChild === text && document.body.contains(root) && translate.node.data.size === 0;
  `) };
});

const svgTitleCases = [
  { remark: '父节点带正文时补收真实 title Attr', attribute: true },
  { remark: '只有 .title expando 时跳过标题并继续扫描正文', attribute: false }
].map(function (item) {
  return { remark: 'SVG ' + item.remark, test: new Function(`
    translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
    var root = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ${item.attribute ? "root.setAttribute('title', '图形标题');" : "Object.defineProperty(root, 'title', { value: '属性外文字' });"}
    var child = document.createElementNS('http://www.w3.org/2000/svg', 'text'); child.textContent = '图形正文'; root.append(child); document.body.append(root);
    var title = root.getAttributeNode('title'), text = child.firstChild;
    translate.element.whileNodes('batch', root);
    var record = translate.node.get(title), entries = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {});
    var targets = entries.flatMap(function (entry) { return entry.nodes; });
    var titleValid = ${JSON.stringify(item.attribute)} ? record && record.originalText === '图形标题' &&
      targets.some(function (item) { return item.node === title && item.attribute === ''; }) : record == null && targets.length === 1;
    return titleValid === true && translate.node.get(root) == null && root.getAttributeNode('title') === title &&
      translate.node.get(text).originalText === '图形正文' && targets.some(function (item) { return item.node === text; }) &&
      child.firstChild === text && text.nodeValue === '图形正文';
  `) };
});

const titleIgnoreCases = ['HTML', 'SVG'].map(function (kind) {
  return { remark: kind + ' 父节点的 title 编程忽略规则不影响正文真实入队', test: new Function(`
    translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
    var wrapper = document.createElement('div'); wrapper.className = 'skip-parent-title';
    var root = ${kind === 'HTML' ? "document.createElement('div')" : "document.createElementNS('http://www.w3.org/2000/svg', 'svg')"};
    root.setAttribute('title', '标题文字'); root.textContent = '正文文字'; wrapper.append(root); document.body.append(wrapper);
    var title = root.getAttributeNode('title'), text = root.firstChild, checked = false;
    translate.ignore.class.push('skip-parent-title', function (element, data) {
      if (data.attribute === 'title') { checked = element === root && data.node === title; return true; }
      return false;
    });
    translate.element.whileNodes('batch', root);
    var entries = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {});
    var targets = entries.flatMap(function (entry) { return entry.nodes; });
    return checked && translate.node.get(title) == null && translate.node.get(text).originalText === '正文文字' &&
      targets.length === 1 && targets[0].node === text && targets[0].attribute === '' &&
      root.getAttributeNode('title') === title && title.nodeValue === '标题文字' && root.firstChild === text;
  `) };
});

const iframeTitleCases = ['HTML', 'SVG'].map(function (kind) {
  return { remark: '同源 iframe 的独立 ' + kind + ' 根节点扫描保留跨 realm title Attr 和正文目标', test: new Function(`
    translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
    var frame = document.createElement('iframe'); document.body.append(frame);
    var root = ${kind === 'HTML' ? "frame.contentDocument.createElement('div')" : "frame.contentDocument.createElementNS('http://www.w3.org/2000/svg', 'svg')"};
    // 根节点保留未挂载状态，验证顶部 Attr 收集不依赖 findNode 的父节点检查。
    root.setAttribute('title', '跨窗口标题'); root.textContent = '跨窗口正文';
    var title = root.getAttributeNode('title'), text = root.firstChild;
    translate.element.whileNodes('batch', root);
    var entries = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {});
    var targets = entries.flatMap(function (entry) { return entry.nodes; });
    return root.parentNode === null && !(root instanceof Element) && !(title instanceof Attr) && title instanceof frame.contentWindow.Attr &&
      translate.node.get(title).originalText === '跨窗口标题' && translate.node.get(text).originalText === '跨窗口正文' &&
      targets.length === 2 && targets.some(function (item) { return item.node === title && item.attribute === ''; }) &&
      targets.some(function (item) { return item.node === text && item.attribute === ''; }) &&
      title.ownerElement === root && root.firstChild === text && root.ownerDocument === frame.contentDocument;
  `) };
});

const titleRenderResetCases = ['HTML', 'SVG'].map(function (kind) {
  return { remark: kind + ' 父节点真实 title 和正文经 execute 缓存渲染再 reset，保留 Attr 及 Text 身份', test: new Function(`
    translate.selectLanguageTag.show = false;
    translate.language.setLocal('chinese_simplified'); translate.to = 'english';
    translate.storage.set('hash_english_' + translate.util.hash('标题'), 'Title');
    translate.storage.set('hash_english_' + translate.util.hash('你好世界'), 'Hello world');
    var root = ${kind === 'HTML' ? "document.createElement('div')" : "document.createElementNS('http://www.w3.org/2000/svg', 'svg')"};
    root.setAttribute('title', '标题'); root.textContent = '你好世界'; document.body.append(root);
    var title = root.getAttributeNode('title'), text = root.firstChild, networkCalls = 0;
    translate.lifecycle.execute.translateNetworkBefore.push(function () { networkCalls++; });
    translate.execute(root);
    var titleRecord = translate.node.get(title), textRecord = translate.node.get(text);
    var rendered = title.nodeValue === 'Title' && text.nodeValue === 'Hello world' &&
      titleRecord && titleRecord.originalText === '标题' && titleRecord.resultText === 'Title' &&
      textRecord && textRecord.originalText === '你好世界' && textRecord.resultText === 'Hello world' &&
      root.getAttributeNode('title') === title && root.firstChild === text && translate.node.get(root) == null &&
      networkCalls === 0 && translate.state === 0;
    translate.reset({ selectLanguageRefreshRender: false });
    return rendered === true && title.nodeValue === '标题' && text.nodeValue === '你好世界' &&
      root.getAttributeNode('title') === title && root.firstChild === text && document.body.contains(root) &&
      translate.node.data.size === 0 && translate.state === 0;
  `) };
});

// 有无子 Text 分别验证 placeholder；空、空白和缺省值不应产生新的翻译任务。
// 扫描结果检查真实 Attr／Text 身份，不以入队入口的调用次数代替最终队列。
const textareaPlaceholderCases = [false, true].flatMap(function (hasText) {
  return [null, '', ' \t\n ', ' 输入提示 '].map(function (placeholder) {
    var collected = placeholder === ' 输入提示 ';
    return { remark: 'textarea ' + (hasText ? '带默认文本' : '没有子节点') + '，placeholder ' + (placeholder === null ? '缺省' : placeholder === '' ? '为空' : collected ? '非空时保留原文并收集真实 Attr' : '仅空白时不收集'), test: new Function(`
      translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
      var node = document.createElement('textarea');
      if (${JSON.stringify(placeholder)} !== null) node.setAttribute('placeholder', ${JSON.stringify(placeholder)});
      if (${hasText}) node.textContent = '默认正文';
      document.body.append(node);
      var attribute = node.getAttributeNode('placeholder'), text = node.firstChild;
      translate.element.whileNodes('batch', node);
      var targets = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {}).flatMap(function (entry) { return entry.nodes; });
      var placeholders = targets.filter(function (item) { return item.node === attribute; });
      var record = translate.node.get(attribute);
      return targets.length === ${Number(hasText) + Number(collected)} && placeholders.length === ${Number(collected)} &&
        (${collected} ? record && record.originalText === ${JSON.stringify(placeholder)} && record.attribute === '' && placeholders[0].attribute === '' : record == null) &&
        (${hasText} ? text === node.firstChild && translate.node.get(text).originalText === '默认正文' && targets.some(function (item) { return item.node === text && item.attribute === ''; }) : node.firstChild === null) &&
        node.getAttribute('placeholder') === ${JSON.stringify(placeholder)} && node.getAttributeNode('placeholder') === attribute && translate.node.get(node) == null;
    `) };
  });
});

// input 保留原叶节点流程，textarea 带默认 Text；仅显式允许 value 才记录元素实时值。
// condition 只作稳定判断，不限定扫描次数；未启用或拒绝时用 getter 陷阱确保不会偷读 value。
const parentValueCases = ['input', 'textarea'].flatMap(function (tag) {
  return ['unconfigured', 'other', 'deny', 'allow', 'cleared'].map(function (mode) {
    var enabled = mode === 'allow', hasText = tag === 'textarea';
    var description = { unconfigured: '未配置 value', other: '只配置其它属性', deny: 'condition 拒绝 value', allow: '显式允许实时 value', cleared: '实时 value 已清空' }[mode];
    return { remark: tag + ' ' + description + '时保持 value 开关并收集 placeholder', test: new Function(`
      translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
      var node = document.createElement(${JSON.stringify(tag)}); node.setAttribute('value', '旧属性值');
      node.setAttribute('placeholder', '输入提示'); node.setAttribute('data-label', '自定义标签');
      if (${hasText}) node.textContent = '默认正文';
      node.value = ${JSON.stringify(mode === 'cleared' ? '' : '实时内容')};
      ${mode === 'unconfigured' ? '' : "translate.element.tagAttribute[" + JSON.stringify(tag) + "] = { attribute: [" + JSON.stringify(mode === 'other' ? 'data-label' : 'value') + "], condition: function () { return " + JSON.stringify(mode !== 'deny') + "; } };"}
      ${['unconfigured', 'other', 'deny'].includes(mode) ? "Object.defineProperty(node, 'value', { get: function () { throw new Error('未启用的 value 不应读取'); } });" : ''}
      document.body.append(node);
      var placeholder = node.getAttributeNode('placeholder'), label = node.getAttributeNode('data-label'), oldValue = node.getAttributeNode('value'), text = node.firstChild;
      translate.element.whileNodes('batch', node);
      var targets = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {}).flatMap(function (entry) { return entry.nodes; });
      var valueTargets = targets.filter(function (item) { return item.node === node; });
      var record = translate.node.get(node);
      return targets.length === ${1 + Number(hasText) + Number(enabled) + Number(mode === 'other')} &&
        targets.filter(function (item) { return item.node === placeholder && item.attribute === ''; }).length === 1 &&
        translate.node.get(placeholder).originalText === '输入提示' && valueTargets.length === ${Number(enabled)} &&
        (${enabled} ? record && record.originalText === '实时内容' && record.attribute === 'value' && valueTargets[0].attribute === 'value' : record == null) &&
        (${mode === 'other'} ? targets.some(function (item) { return item.node === label; }) : translate.node.get(label) == null) &&
        (${hasText} ? translate.node.get(text).originalText === '默认正文' && text === node.firstChild : node.firstChild === null) &&
        translate.node.get(oldValue) == null && oldValue.nodeValue === '旧属性值' && node.getAttributeNode('value') === oldValue;
    `) };
  });
});

const parentIgnoreCases = ['自身 class', '祖先 class', '祖先 tag', '自身 tag', '自身 id'].map(function (mode) {
  return { remark: 'textarea 父节点命中' + mode + '忽略时，placeholder 和正文均不入队', test: new Function(`
    translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
    var wrapper = document.createElement(${JSON.stringify(mode === '祖先 tag' ? 'pre' : 'div')}), node = document.createElement('textarea');
    node.setAttribute('placeholder', '输入提示'); node.textContent = '默认正文'; wrapper.append(node); document.body.append(wrapper);
    ${mode === '自身 class' ? "node.className = 'ignore';" : mode === '祖先 class' ? "wrapper.className = 'ignore';" : mode === '自身 tag' ? "translate.ignore.tag.push('textarea');" : mode === '自身 id' ? "node.id = 'ignored-textarea'; translate.ignore.id.push('ignored-textarea');" : ''}
    var placeholder = node.getAttributeNode('placeholder'), text = node.firstChild;
    translate.element.whileNodes('batch', wrapper);
    var targets = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {}).flatMap(function (entry) { return entry.nodes; });
    return targets.length === 0 && translate.node.get(placeholder) == null && translate.node.get(text) == null &&
      placeholder.nodeValue === '输入提示' && text.nodeValue === '默认正文' && node.firstChild === text && node.getAttributeNode('placeholder') === placeholder;
  `) };
});

const parentAttributeIgnoreCases = ['placeholder', 'title'].map(function (ignoredAttribute) {
  return { remark: 'textarea 父节点仅编程忽略 ' + ignoredAttribute + '，其它真实属性和正文仍入队', test: new Function(`
    translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
    var node = document.createElement('textarea'); node.className = 'filter-parent'; node.title = '标题原文';
    node.setAttribute('placeholder', '输入提示'); node.textContent = '默认正文'; document.body.append(node);
    var placeholder = node.getAttributeNode('placeholder'), title = node.getAttributeNode('title'), text = node.firstChild, checked = false;
    translate.ignore.class.push('filter-parent', function (element, data) {
      if (data.attribute === ${JSON.stringify(ignoredAttribute)}) { checked = element === node && data.node === ${ignoredAttribute}; return true; }
      return false;
    });
    translate.element.whileNodes('batch', node);
    var targets = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {}).flatMap(function (entry) { return entry.nodes; });
    var ignored = ${ignoredAttribute}, allowed = ${ignoredAttribute === 'title' ? 'placeholder' : 'title'};
    return checked && targets.length === 2 && translate.node.get(ignored) == null &&
      targets.filter(function (item) { return item.node === allowed && item.attribute === ''; }).length === 1 &&
      targets.filter(function (item) { return item.node === text && item.attribute === ''; }).length === 1 &&
      translate.node.get(text).originalText === '默认正文' && node.firstChild === text;
  `) };
});

// 重复扫描以实际队列目标和节点记录为准，不要求 addNodeToQueue 仅被调用一次。
const parentQueueCases = ['div', 'textarea'].map(function (tag) {
  return { remark: tag + ' 父节点连续扫描两次，title、自定义属性、正文及启用的 value 目标均只入队一次', test: new Function(`
    translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
    var node = document.createElement(${JSON.stringify(tag)}); node.title = '标题原文'; node.setAttribute('data-label', '自定义标签'); node.textContent = '默认正文';
    translate.element.tagAttribute[${JSON.stringify(tag)}] = { attribute: ${JSON.stringify(tag === 'textarea' ? ['data-label', 'value'] : ['data-label'])} };
    ${tag === 'textarea' ? "node.setAttribute('placeholder', '输入提示'); node.value = '实时内容';" : ''}
    document.body.append(node);
    var nodes = [node.getAttributeNode('title'), node.getAttributeNode('data-label'), node.firstChild${tag === 'textarea' ? ", node.getAttributeNode('placeholder'), node" : ''}];
    var originals = ${JSON.stringify(tag === 'textarea' ? ['标题原文', '自定义标签', '默认正文', '输入提示', '实时内容'] : ['标题原文', '自定义标签', '默认正文'])};
    translate.element.whileNodes('batch', node);
    var records = nodes.map(function (target) { return translate.node.get(target); });
    var snapshots = records.map(function (record) { return JSON.stringify(record); });
    translate.element.whileNodes('batch', node);
    var targets = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {}).flatMap(function (entry) { return entry.nodes; });
    return targets.length === nodes.length && nodes.every(function (target, index) {
      var record = translate.node.get(target), expectedAttribute = target === node ? 'value' : '';
      return record && record === records[index] && record.originalText === originals[index] && record.attribute === expectedAttribute &&
        JSON.stringify(record) === snapshots[index] && targets.filter(function (item) { return item.node === target && item.attribute === expectedAttribute; }).length === 1;
    });
  `) };
});

// 只验证根内部已附着的元素；不新增 Document／Fragment／ShadowRoot 自身的属性翻译约定。
const parentRootCases = ['Document', 'DocumentFragment', 'ShadowRoot'].map(function (kind) {
  return { remark: kind + ' 作为扫描根时，内部 textarea 的 placeholder 和默认正文各收集一次', test: new Function(`
    translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
    var node = document.createElement('textarea'); node.setAttribute('placeholder', '输入提示'); node.textContent = '默认正文';
    ${kind === 'Document' ? 'document.body.append(node); var root = document;' : kind === 'DocumentFragment' ? 'var root = document.createDocumentFragment(); root.append(node);' : "var host = document.createElement('div'); document.body.append(host); var root = host.attachShadow({ mode: 'open' }); root.append(node);"}
    var placeholder = node.getAttributeNode('placeholder'), text = node.firstChild;
    translate.element.whileNodes('batch', root);
    var targets = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {}).flatMap(function (entry) { return entry.nodes; });
    return targets.length === 2 && targets.filter(function (item) { return item.node === placeholder && item.attribute === ''; }).length === 1 &&
      targets.filter(function (item) { return item.node === text && item.attribute === ''; }).length === 1 &&
      translate.node.get(placeholder).originalText === '输入提示' && translate.node.get(text).originalText === '默认正文' &&
      translate.node.get(root) == null && node.parentNode !== null && node.firstChild === text;
  `) };
});

// 保留 findNode 对未挂载根的既有早退；顶部 title 和子 Text 仍可按旧路径收集。
const detachedTextareaCases = [false, true].map(function (hasText) {
  return { remark: '未挂载 textarea ' + (hasText ? '带默认文本' : '没有子节点') + '时保留 title 路径，不新增 placeholder 根节点支持', test: new Function(`
    translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
    var node = document.createElement('textarea'); node.title = '标题原文'; node.setAttribute('placeholder', '输入提示');
    if (${hasText}) node.textContent = '默认正文';
    var placeholder = node.getAttributeNode('placeholder'), title = node.getAttributeNode('title'), text = node.firstChild;
    translate.element.whileNodes('batch', node);
    var targets = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {}).flatMap(function (entry) { return entry.nodes; });
    return node.parentNode === null && targets.length === ${1 + Number(hasText)} && translate.node.get(placeholder) == null &&
      translate.node.get(title).originalText === '标题原文' && targets.some(function (item) { return item.node === title; }) &&
      (${hasText} ? translate.node.get(text).originalText === '默认正文' && targets.some(function (item) { return item.node === text; }) : text === null);
  `) };
});

// 同源 iframe 的 Document 作为显式扫描根，验证一层／两层跨 realm 节点和配置数组。
// 不把显式扫描内层文档等同于自动跨 iframe 注入，后者仍由独立 iframe 模块检查。
const iframeParentCases = [1, 2].flatMap(function (depth) {
  return [false, true].map(function (liveValue) {
    return { remark: depth + ' 层同源 iframe 内显式扫描 textarea 父节点，' + (liveValue ? '跨 realm value 配置生效' : '未配置时不启用 value'), test: new Function(`
      translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
      var doc = document, frame;
      for (var depth = 0; depth < ${depth}; depth++) { frame = doc.createElement('iframe'); doc.body.append(frame); doc = frame.contentDocument; }
      var node = doc.createElement('textarea'); node.setAttribute('placeholder', '输入提示'); node.textContent = '默认正文'; node.value = '实时内容'; doc.body.append(node);
      ${liveValue ? "translate.element.tagAttribute.textarea = { attribute: new frame.contentWindow.Array('value') };" : ''}
      var placeholder = node.getAttributeNode('placeholder'), text = node.firstChild;
      translate.element.whileNodes('batch', doc);
      var targets = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {}).flatMap(function (entry) { return entry.nodes; });
      return !(node instanceof Element) && placeholder instanceof frame.contentWindow.Attr && targets.length === ${liveValue ? 3 : 2} &&
        targets.filter(function (item) { return item.node === placeholder && item.attribute === ''; }).length === 1 &&
        targets.filter(function (item) { return item.node === text && item.attribute === ''; }).length === 1 &&
        translate.node.get(placeholder).originalText === '输入提示' && translate.node.get(text).originalText === '默认正文' &&
        (${liveValue} ? translate.node.get(node).originalText === '实时内容' && translate.node.get(node).attribute === 'value' &&
          targets.filter(function (item) { return item.node === node && item.attribute === 'value'; }).length === 1 : translate.node.get(node) == null) &&
        node.ownerDocument === doc && placeholder.ownerElement === node && node.firstChild === text;
    `) };
  });
});

// 扩大扫描曾触发的两个边界继续保留：无 name 的 SVG meta，以及空字典继承的 constructor。
const parentBoundaryCases = ['SVG meta', 'constructor'].flatMap(function (kind) {
  return [false, true].map(function (hasText) {
    return { remark: kind + ' ' + (hasText ? '父节点' : '叶子节点') + '正常扫描 title 和正文，不把其它属性误收集', test: new Function(`
      translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
      var node = ${kind === 'SVG meta' ? "document.createElementNS('http://www.w3.org/2000/svg', 'meta')" : "document.createElement('constructor')"};
      node.setAttribute('title', '标题原文'); node.setAttribute('data-label', '未配置标签');
      ${kind === 'SVG meta' ? "node.setAttribute('name', 'description'); node.setAttribute('property', 'OG:DESCRIPTION'); node.setAttribute('content', '属性原文');" : ''}
      if (${hasText}) node.textContent = '默认正文';
      document.body.append(node);
      var title = node.getAttributeNode('title'), text = node.firstChild, label = node.getAttributeNode('data-label');
      translate.element.whileNodes('batch', node);
      var targets = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {}).flatMap(function (entry) { return entry.nodes; });
      return targets.length === ${1 + Number(hasText)} && targets.filter(function (item) { return item.node === title && item.attribute === ''; }).length === 1 &&
        translate.node.get(title).originalText === '标题原文' && translate.node.get(label) == null && translate.node.get(node) == null &&
        (${hasText} ? translate.node.get(text).originalText === '默认正文' && targets.some(function (item) { return item.node === text; }) : text === null) &&
        node.getAttributeNode('title') === title;
    `) };
  });
});

const parentNonTextChildCases = ['空白 Text', 'Comment'].map(function (kind) {
  return { remark: 'textarea 只有' + kind + '子节点时也收集 placeholder，不翻译空白或注释', test: new Function(`
    translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
    var node = document.createElement('textarea'); node.setAttribute('placeholder', '输入提示');
    var child = ${kind === 'Comment' ? "document.createComment('注释原文')" : "document.createTextNode(' \\t\\n ')"};
    node.append(child); document.body.append(node);
    var placeholder = node.getAttributeNode('placeholder'), original = child.nodeValue;
    translate.element.whileNodes('batch', node);
    var targets = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {}).flatMap(function (entry) { return entry.nodes; });
    return targets.length === 1 && targets[0].node === placeholder && targets[0].attribute === '' &&
      translate.node.get(placeholder).originalText === '输入提示' && translate.node.get(child) == null &&
      node.firstChild === child && child.nodeValue === original;
  `) };
});

// 完整 execute 只命中已预置的缓存，检查扫描修复的用户可见结果；reset 仅核对原有 Attr／Text 还原。
const parentRenderResetCases = [false, true].map(function (liveValue) {
  return { remark: 'textarea 父节点的 placeholder 与默认正文完成缓存翻译并还原，' + (liveValue ? '显式 value 同时翻译' : '不额外启用 value'), test: new Function(`
    translate.selectLanguageTag.show = false; translate.language.setLocal('chinese_simplified'); translate.to = 'english';
    [['输入提示', 'Please enter'], ['默认正文', 'Default text'], ['实时内容', 'Live text']].forEach(function (item) { translate.storage.set('hash_english_' + translate.util.hash(item[0]), item[1]); });
    var node = document.createElement('textarea'); node.setAttribute('placeholder', '输入提示'); node.textContent = '默认正文';
    ${liveValue ? "node.value = '实时内容'; translate.element.tagAttribute.textarea = { attribute: ['value'] };" : ''}
    document.body.append(node);
    var placeholder = node.getAttributeNode('placeholder'), text = node.firstChild, networkCalls = 0;
    translate.lifecycle.execute.translateNetworkBefore.push(function () { networkCalls++; });
    translate.execute(node);
    var record = translate.node.get(placeholder), textRecord = translate.node.get(text);
    var rendered = placeholder.nodeValue === 'Please enter' && text.nodeValue === 'Default text' &&
      record && record.originalText === '输入提示' && record.resultText === 'Please enter' &&
      textRecord && textRecord.originalText === '默认正文' && textRecord.resultText === 'Default text' &&
      (${liveValue} ? node.value === 'Live text' && translate.node.get(node).attribute === 'value' : translate.node.get(node) == null) &&
      networkCalls === 0 && translate.state === 0;
    translate.reset({ selectLanguageRefreshRender: false });
    return rendered === true && node.getAttributeNode('placeholder') === placeholder && placeholder.nodeValue === '输入提示' &&
      node.firstChild === text && text.nodeValue === '默认正文' && translate.node.data.size === 0 && translate.state === 0;
  `) };
});

require('../helpers/module')(__filename, [
  { remark: '递归遍历真实嵌套节点，按 DOM 顺序收集叶子文本并创建带过期时间的队列', test: function () {
    var root = document.createElement('div'); root.innerHTML = '甲<span>乙<b>丙</b></span>丁'; document.body.append(root);
    var calls = []; Date.now = function () { return 10000; };
    translate.addNodeToQueue = function (uuid, node, text) { calls.push([uuid, text]); };
    translate.element.whileNodes('unit', root);
    return JSON.stringify(calls) === '[["unit","甲"],["unit","乙"],["unit","丙"],["unit","丁"]]' && translate.nodeQueue.unit.expireTime === 130000 && typeof translate.nodeQueue.unit.list === 'object';
  } },
  { remark: '空节点不创建任务，已存在队列不重置有效期和其他状态', test: function () {
    translate.element.whileNodes('missing', null); translate.element.whileNodes('missing', undefined);
    var root = document.createElement('div'), queue = { expireTime: 123, list: {}, custom: 'keep' }; translate.nodeQueue.unit = queue;
    translate.element.whileNodes('unit', root);
    return typeof translate.nodeQueue.missing === 'undefined' && translate.nodeQueue.unit === queue && queue.expireTime === 123 && queue.custom === 'keep';
  } },
  { remark: '容器 title 单独入队，忽略 title 的规则不影响正文扫描', test: function () {
    var root = document.createElement('div'); root.title = '标题'; root.textContent = '正文'; document.body.append(root); var calls = [];
    translate.addNodeToQueue = function (uuid, node, text) { calls.push(text); };
    translate.ignore.isIgnore = function (node, info) { return info && info.attribute === 'title'; };
    translate.element.whileNodes('unit', root);
    return JSON.stringify(calls) === '["正文"]';
  } },
  { remark: '自定义 input value 使用实时值且绑定元素本身，不使用过期的 HTML Attr', test: function () {
    var root = document.createElement('div'), input = document.createElement('input'); input.setAttribute('value', '旧值'); input.value = '当前值'; root.append(input); document.body.append(root);
    translate.element.tagAttribute.input = { attribute: ['value'], condition: function () { return true; } }; var calls = [];
    translate.addNodeToQueue = function () { calls.push(Array.from(arguments)); };
    translate.element.whileNodes('unit', root);
    return calls.length === 1 && calls[0][1] === input && calls[0][2] === '当前值' && calls[0][3] === 'value';
  } },
  { remark: '自定义属性 condition 不通过或属性不存在时不加入队列', test: function () {
    var root = document.createElement('div'), a = document.createElement('span'), b = document.createElement('span'); a.setAttribute('data-label', '不允许'); root.append(a, b); document.body.append(root);
    translate.element.tagAttribute.span = { attribute: ['data-label'], condition: function (node) { return node === b; } }; var calls = 0;
    translate.addNodeToQueue = function () { calls++; };
    translate.element.whileNodes('unit', root);
    return calls === 0;
  } },
  { remark: '首次扫描会把页面现存的带 src iframe 交给原 iframe 执行入口', test: function () {
    var root = document.createElement('div'), iframe = document.createElement('iframe'); iframe.src = 'about:blank'; root.append(iframe); document.body.append(root); var calls = [];
    translate.element.iframe.execute = function (node) { calls.push(node); };
    translate.element.whileNodes('unit', root);
    return calls.length === 1 && calls[0] === iframe;
  } },
  { remark: '叶子输入框通过 nodeAnalyse 收集 placeholder，忽略节点不入队', test: function () {
    var root = document.createElement('div'); root.innerHTML = '<input placeholder="提示"><span class="excluded">忽略</span>'; document.body.append(root); translate.ignore.class.push('excluded'); var texts = [];
    translate.addNodeToQueue = function (uuid, node, text) { texts.push(text); };
    translate.element.whileNodes('unit', root);
    return JSON.stringify(texts) === '["提示"]';
  } },
  ...htmlTitleCases,
  ...titleGetterCases,
  ...svgTitleCases,
  ...titleIgnoreCases,
  ...iframeTitleCases,
  ...titleRenderResetCases,
  ...textareaPlaceholderCases,
  ...parentValueCases,
  ...parentIgnoreCases,
  ...parentAttributeIgnoreCases,
  ...parentQueueCases,
  ...parentRootCases,
  ...detachedTextareaCases,
  ...iframeParentCases,
  ...parentBoundaryCases,
  ...parentNonTextChildCases,
  ...parentRenderResetCases,
  { remark: '父 placeholder 与子 Text 原文相同时合并文本项，但保留两个不同翻译目标', test: function () {
    translate.language.setLocal('chinese_simplified'); translate.to = 'english'; translate.whole.enableAll();
    var node = document.createElement('textarea'); node.setAttribute('placeholder', '相同原文'); node.textContent = '相同原文'; document.body.append(node);
    var placeholder = node.getAttributeNode('placeholder'), text = node.firstChild;
    translate.element.whileNodes('batch', node);
    var entries = Object.values(translate.nodeQueue.batch.list.chinese_simplified || {});
    return entries.length === 1 && entries[0].nodes.length === 2 &&
      entries[0].nodes.filter(function (item) { return item.node === placeholder && item.attribute === ''; }).length === 1 &&
      entries[0].nodes.filter(function (item) { return item.node === text && item.attribute === ''; }).length === 1 &&
      translate.node.get(placeholder).originalText === '相同原文' && translate.node.get(text).originalText === '相同原文' &&
      node.firstChild === text && node.getAttributeNode('placeholder') === placeholder;
  } },
  { remark: '扫描快照按进入和离开顺序记录，纯空白及空 Text 各占一个事件，属性与注释各走原流程', test: function () {
    const root = document.createElement('div');
    root.title = '标题';
    const span = document.createElement('span'), blank = document.createTextNode(' \t'), empty = document.createTextNode('');
    const comment = document.createComment('注释'), title = root.getAttributeNode('title');
    span.append(blank, empty); root.append(span, comment); document.body.append(root);
    translate.element.whileNodes('order', root, null);
    const { scopes, snapshots } = translate.nodeQueue.order.scan;
    const scope = scopes[0], nodes = [root, span, blank, empty, span, root];
    return scopes.length === 1 && scope.root === root && scope.complete &&
      scope.events.map(event => event.type).join(',') === 'enter,enter,text,text,leave,leave' &&
      scope.events.every((event, i) => event.snapshot === snapshots.get(nodes[i])) &&
      snapshots.size === 4 && !snapshots.has(comment) && !snapshots.has(title) &&
      snapshots.get(blank).parent === span && snapshots.get(blank).text === ' \t' && snapshots.get(empty).text === '';
  } },
  { remark: '显式传入的内部扫描范围只追加事件，由顶层负责标记完成', test: function () {
    const root = document.createElement('p');
    root.textContent = '内容';
    const externalScope = { root, events: [], complete: false };
    translate.element.whileNodes('recursive', root, externalScope);
    const scan = translate.nodeQueue.recursive.scan;
    return scan.scopes.length === 0 && externalScope.complete === false &&
      externalScope.events.map(event => event.type).join(',') === 'enter,text,leave' &&
      externalScope.events[0].snapshot === scan.snapshots.get(root) &&
      externalScope.events[1].snapshot === scan.snapshots.get(root.firstChild);
  } },
  { remark: '同批次重扫保留首遇文字，另一批次为同一 Text 新建快照', test: function () {
    const root = document.createElement('div'); root.textContent = '首次'; document.body.append(root);
    const text = root.firstChild;
    translate.element.whileNodes('first', root);
    text.nodeValue = '再次';
    translate.element.whileNodes('first', text);
    translate.element.whileNodes('second', text);
    const first = translate.nodeQueue.first.scan, second = translate.nodeQueue.second.scan;
    return first.scopes.length === 2 && second.scopes.length === 1 &&
      first.scopes[1].events[0].snapshot === first.snapshots.get(text) && first.snapshots.get(text).text === '首次' &&
      second.scopes[0].events[0].snapshot !== first.snapshots.get(text) && second.snapshots.get(text).text === '再次';
  } },
  { remark: '属性条件抛错时传播原异常并保留未完成范围，后续范围仍能完成', test: function () {
    const root = document.createElement('p');
    root.innerHTML = '已扫描<span data-label="标签">未扫描</span>';
    const failure = new Error('condition'), span = root.lastChild;
    translate.element.tagAttribute.span = { attribute: ['data-label'], condition() { throw failure; } };
    let caught;
    try { translate.element.whileNodes('interrupted', root); } catch (error) { caught = error; }
    translate.element.whileNodes('interrupted', root.firstChild);
    const { scopes, snapshots } = translate.nodeQueue.interrupted.scan;
    return caught === failure && scopes.length === 2 && !scopes[0].complete && scopes[1].complete &&
      scopes[0].events.map(event => event.type).join(',') === 'enter,text,enter' &&
      scopes[0].events[2].snapshot === snapshots.get(span) && !snapshots.has(span.firstChild);
  } }
]);
