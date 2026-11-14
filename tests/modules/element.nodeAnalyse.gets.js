// 标签类型、meta name/property 各自独立报告；生成函数仅包含本项数据字面量。
const inputCases = ['button', 'submit', 'text'].map(function (type) {
  const expected = type === 'text' ? ['placeholder'] : ['value', 'placeholder'];
  return { remark: 'input type=' + type + ' 只收集对应的 value 和 placeholder', test: new Function(`
    var input = document.createElement('input'); input.type = ${JSON.stringify(type)}; input.setAttribute('value', '值'); input.placeholder = '提示';
    var result = translate.element.nodeAnalyse.gets(input);
    return JSON.stringify(result.map(function (item) { return item.attribute; })) === ${JSON.stringify(JSON.stringify(expected))};
  `) };
});
const metaCases = [
  ['name', 'keywords'], ['name', 'description'], ['name', 'sharetitle'],
  ['property', 'og:title'], ['property', 'og:description'], ['property', 'og:site_name'], ['property', 'og:novel:latest_chapter_name']
].map(function (item) {
  return { remark: 'meta ' + item[0] + '=' + item[1] + ' 大小写不敏感地收集 content', test: new Function(`
    var meta = document.createElement('meta'); meta.setAttribute(${JSON.stringify(item[0])}, ${JSON.stringify(item[1].toUpperCase())}); meta.content = '内容';
    var result = translate.element.nodeAnalyse.gets(meta);
    return result.length === 1 && result[0].node === meta.getAttributeNode('content') && result[0].text === '内容' && result[0].attribute === 'content';
  `) };
});

// 每个标签、值状态分别登记；把数据写入生成函数，浏览器执行时不依赖模块闭包。
const liveValueCases = ['input', 'textarea'].flatMap(function (tag) {
  return [
    { remark: '实时值覆盖旧 HTML value', htmlValue: true, value: '当前内容', attributes: ['value'] },
    { remark: '没有 HTML value 也收集实时值', htmlValue: false, value: '当前内容', attributes: ['value'] },
    { remark: '实时值清空后不回退旧 HTML value', htmlValue: true, value: '', attributes: ['value'] },
    { remark: '实时值的空格和制表符原样保留', htmlValue: true, value: ' \t ', attributes: ['value'] },
    { remark: '大写 VALUE 配置仍返回规范的 value 目标', htmlValue: true, value: '当前内容', attributes: ['VALUE'] },
    { remark: '重复且大小写混合的 value 配置只收集一次', htmlValue: true, value: '当前内容', attributes: ['value', 'VALUE', 'value'] }
  ].map(function (item) {
    return { remark: tag + ' 显式配置 value：' + item.remark, test: new Function(`
      var node = document.createElement(${JSON.stringify(tag)});
      if (${JSON.stringify(item.htmlValue)}) node.setAttribute('value', '旧属性内容');
      node.value = ${JSON.stringify(item.value)};
      translate.element.tagAttribute[${JSON.stringify(tag)}] = { attribute: ${JSON.stringify(item.attributes)} };
      var oldAttribute = node.getAttributeNode('value');
      var result = translate.element.nodeAnalyse.gets(node);
      return ${JSON.stringify(item.value)} === '' ? result.length === 0 :
        result.length === 1 && result[0].node === node && result[0].node.nodeType === 1 &&
        result[0].text === ${JSON.stringify(item.value)} && result[0].attribute === 'value' &&
        node.getAttributeNode('value') === oldAttribute &&
        node.getAttribute('value') === ${JSON.stringify(item.htmlValue ? '旧属性内容' : null)};
    `) };
  });
});

const valueEnableCases = ['input', 'textarea'].flatMap(function (tag) {
  return [
    { remark: '未配置标签时不收集实时 value', setup: '', other: false },
    { remark: '仅配置其他属性时不扩大到实时 value', setup: "{ attribute: ['data-label'] }", other: true },
    { remark: 'condition 拒绝时不收集实时或旧属性 value', setup: "{ attribute: ['value'], condition: function () { return false; } }", other: false }
  ].map(function (item) {
    return { remark: tag + ' ' + item.remark, test: new Function(`
      var node = document.createElement(${JSON.stringify(tag)});
      node.setAttribute('value', '旧属性内容'); node.value = '当前内容';
      node.setAttribute('data-label', '其他标签');
      ${item.setup ? 'translate.element.tagAttribute[' + JSON.stringify(tag) + '] = ' + item.setup + ';' : ''}
      var result = translate.element.nodeAnalyse.gets(node);
      return ${JSON.stringify(item.other)} ? result.length === 1 && result[0].attribute === 'data-label' &&
        result[0].text === '其他标签' && result[0].node === node.getAttributeNode('data-label') : result.length === 0;
    `) };
  });
});

const buttonValueCases = ['button', 'submit'].flatMap(function (type) {
  return ['default', 'deny', 'allow'].map(function (mode) {
    var description = mode === 'default' ? '未配置时保留默认 value Attr' :
      mode === 'deny' ? 'condition 拒绝时回退默认 value Attr' : '显式允许时使用元素实时 value 目标';
    return { remark: 'input type=' + type + ' ' + description, test: new Function(`
      var node = document.createElement('input'); node.type = ${JSON.stringify(type)};
      node.setAttribute('value', '按钮文字');
      ${mode === 'default' ? '' : "translate.element.tagAttribute.input = { attribute: ['value'], condition: function () { return " + JSON.stringify(mode === 'allow') + "; } };"}
      ${mode === 'allow' ? '' : "Object.defineProperty(node, 'value', { get: function () { throw new Error('默认或拒绝配置不能读取实时 value'); } });"}
      var result = translate.element.nodeAnalyse.gets(node);
      return result.length === 1 && result[0].text === '按钮文字' && result[0].attribute === 'value' &&
        result[0].node === ${mode === 'allow' ? 'node' : "node.getAttributeNode('value')"};
    `) };
  });
});

// 普通元素仍以 HTML Attr 为准，getter 陷阱防止把实时 value 规则扩散到其他标签。
const ordinaryValueCases = ['div', 'button', 'option'].map(function (tag) {
  return { remark: tag + ' 配置 value 仍返回真实 Attr，不能读取 value 属性 getter', test: new Function(`
    var node = document.createElement(${JSON.stringify(tag)}); node.setAttribute('value', '属性文字');
    Object.defineProperty(node, 'value', { get: function () { throw new Error('普通标签不应读取实时 value'); } });
    translate.element.tagAttribute[${JSON.stringify(tag)}] = { attribute: ['value'] };
    var result = translate.element.nodeAnalyse.gets(node);
    return result.length === 1 && result[0].text === '属性文字' && result[0].attribute === 'value' &&
      result[0].node === node.getAttributeNode('value') && result[0].node.nodeType === 2;
  `) };
});

const valueConditionCases = ['input', 'textarea'].map(function (tag) {
  return { remark: tag + ' 的实时 value 与 placeholder、title、自定义属性共存，condition 接收原配置和元素', test: new Function(`
    var node = document.createElement(${JSON.stringify(tag)}); node.setAttribute('value', '旧属性内容');
    node.value = '当前内容'; node.placeholder = '输入提示'; node.title = '标题'; node.setAttribute('data-label', '其他标签');
    var called = false, correctReceiver = true, correctNode = true;
    var config = { attribute: ['value', 'data-label'], condition: function (element) {
      called = true; correctReceiver = correctReceiver && this === config; correctNode = correctNode && element === node;
      return true;
    } };
    translate.element.tagAttribute[${JSON.stringify(tag)}] = config;
    var result = translate.element.nodeAnalyse.gets(node);
    var value = result.filter(function (item) { return item.attribute === 'value'; });
    var placeholder = result.filter(function (item) { return item.attribute === 'placeholder'; });
    var title = result.filter(function (item) { return item.attribute === 'title'; });
    var label = result.filter(function (item) { return item.attribute === 'data-label'; });
    return called && correctReceiver && correctNode && result.length === 4 &&
      value.length === 1 && value[0].node === node && value[0].text === '当前内容' &&
      placeholder.length === 1 && placeholder[0].node === node.getAttributeNode('placeholder') && placeholder[0].text === '输入提示' &&
      title.length === 1 && title[0].node === node.getAttributeNode('title') && title[0].text === '标题' &&
      label.length === 1 && label[0].node === node.getAttributeNode('data-label') && label[0].text === '其他标签';
  `) };
});

const iframeValueCases = ['input', 'textarea'].map(function (tag) {
  return { remark: '同源 iframe 的 ' + tag + ' 和跨 realm 大写配置仍收集当前元素实时 value', test: new Function(`
    var frame = document.createElement('iframe'); document.body.append(frame);
    var node = frame.contentDocument.createElement(${JSON.stringify(tag)});
    node.setAttribute('value', '旧属性内容'); node.value = '当前内容'; frame.contentDocument.body.append(node);
    var attributes = frame.contentWindow.Array.of('VALUE');
    translate.element.tagAttribute[${JSON.stringify(tag)}] = { attribute: attributes };
    var result = translate.element.nodeAnalyse.gets(node);
    return !(node instanceof Element) && !(attributes instanceof Array) && result.length === 1 &&
      result[0].node === node && result[0].node.ownerDocument === frame.contentDocument &&
      result[0].text === '当前内容' && result[0].attribute === 'value' && node.getAttribute('value') === '旧属性内容';
  `) };
});

// 使用真实执行链命中译文缓存，再还原当前值；默认 Attr/Text 的内容和身份必须保留。
const valueRenderResetCases = ['input', 'textarea'].map(function (tag) {
  return { remark: tag + ' 实时 value 经实际 execute 缓存渲染再 reset，保留 HTML 默认值及节点身份', test: new Function(`
    translate.selectLanguageTag.show = false;
    translate.language.setLocal('chinese_simplified'); translate.to = 'english';
    translate.storage.set('hash_english_' + translate.util.hash('你好世界'), 'Hello world');
    var node = document.createElement(${JSON.stringify(tag)});
    ${tag === 'input' ? "node.setAttribute('value', '原默认值');" : "node.textContent = 'default'; node.setAttribute('value', '旧属性内容');"}
    node.value = '你好世界'; document.body.append(node);
    var oldAttribute = node.getAttributeNode('value'), oldText = node.firstChild, defaultValue = node.defaultValue;
    translate.element.tagAttribute[${JSON.stringify(tag)}] = { attribute: ['value'] };
    var collected = translate.element.nodeAnalyse.gets(node);
    var networkCalls = 0;
    translate.lifecycle.execute.translateNetworkBefore.push(function () { networkCalls++; });
    translate.execute(node);
    var record = translate.node.get(node);
    var rendered = collected.length === 1 && collected[0].node === node && collected[0].attribute === 'value' &&
      node.value === 'Hello world' && record && record.attribute === 'value' && record.originalText === '你好世界' &&
      record.resultText === 'Hello world' && translate.node.get(oldAttribute) == null &&
      node.defaultValue === defaultValue && node.getAttributeNode('value') === oldAttribute &&
      node.firstChild === oldText && networkCalls === 0 && translate.state === 0;
    translate.reset({ selectLanguageRefreshRender: false });
    return rendered === true && node.value === '你好世界' && node.defaultValue === defaultValue &&
      node.getAttributeNode('value') === oldAttribute && oldAttribute.nodeValue === ${JSON.stringify(tag === 'input' ? '原默认值' : '旧属性内容')} &&
      node.firstChild === oldText && ${tag === 'input' ? 'oldText === null' : "oldText.nodeValue === 'default'"} &&
      document.body.contains(node) && translate.node.data.size === 0;
  `) };
});

require('../helpers/module')(__filename, [
  { remark: '文本和属性节点返回自身，空白节点不产生翻译项', test: function () {
    var text = document.createTextNode(' 文本 '), element = document.createElement('span'); element.title = '标题';
    var one = translate.element.nodeAnalyse.gets(text), two = translate.element.nodeAnalyse.gets(element.getAttributeNode('title'));
    return one.length === 1 && one[0].text === ' 文本 ' && one[0].attribute === '' && one[0].node === text && two.length === 1 && two[0].text === '标题' && translate.element.nodeAnalyse.gets(document.createTextNode('\n\t ')).length === 0;
  } },
  { remark: '图片同时收集 alt 和 title，返回真实 Attr 节点', test: function () {
    var image = document.createElement('img'); image.alt = '图片说明'; image.title = '图片标题';
    var result = translate.element.nodeAnalyse.gets(image);
    return result.length === 2 && result[0].attribute === 'alt' && result[0].node === image.getAttributeNode('alt') && result[1].attribute === 'title' && result[1].node === image.getAttributeNode('title');
  } },
  ...inputCases,
  { remark: 'textarea 只收集 placeholder 属性，不把当前 value 擅自当作属性文本', test: function () {
    var element = document.createElement('textarea'); element.placeholder = '多行提示'; element.value = '用户输入';
    var result = translate.element.nodeAnalyse.gets(element);
    return result.length === 1 && result[0].text === '多行提示' && result[0].attribute === 'placeholder';
  } },
  ...metaCases,
  { remark: 'meta 不翻译不在范围内的 name', test: function () {
    var meta = document.createElement('meta'); meta.name = 'viewport'; meta.content = '内容';
    return translate.element.nodeAnalyse.gets(meta).length === 0;
  } },
  { remark: 'meta description 的纯空白 content 不生成翻译项', test: function () {
    var meta = document.createElement('meta'); meta.name = 'description'; meta.content = '  ';
    return translate.element.nodeAnalyse.gets(meta).length === 0;
  } },
  { remark: '自定义属性遵守 condition，默认已收集的 value 不重复加入', test: function () {
    translate.element.tagAttribute.input = { attribute: ['value', 'data-label'], condition: function (node) { return node.classList.contains('allowed'); } };
    var input = document.createElement('input'); input.type = 'submit'; input.setAttribute('value', '提交'); input.setAttribute('data-label', '标签'); input.className = 'allowed';
    var allowed = translate.element.nodeAnalyse.gets(input); input.className = ''; var denied = translate.element.nodeAnalyse.gets(input);
    return JSON.stringify(allowed.map(function (item) { return item.attribute; })) === '["value","data-label"]' && denied.length === 1 && denied[0].attribute === 'value';
  } },
  { remark: '只读取当前节点的可翻译内容，不直接递归收集后代', test: function () {
    var root = document.createElement('div'); root.innerHTML = '甲<span>乙</span>';
    return translate.element.nodeAnalyse.gets(root).length === 0;
  } },
  // condition 是可选配置；省略和显式 undefined 分别验证，属性名单仍限制翻译范围。
  { remark: '自定义属性省略 condition 时默认允许，只收集名单内属性', test: function () {
    translate.element.tagAttribute.span = { attribute: ['data-label'] };
    var node = document.createElement('span'); node.setAttribute('data-label', '标签'); node.setAttribute('data-other', '范围外');
    var result = translate.element.nodeAnalyse.gets(node);
    return result.length === 1 && result[0].attribute === 'data-label' && result[0].text === '标签' && result[0].node === node.getAttributeNode('data-label');
  } },
  { remark: '自定义属性显式传入 condition 为 undefined 时默认允许，只收集名单内属性', test: function () {
    translate.element.tagAttribute.span = { attribute: ['data-label'], condition: undefined };
    var node = document.createElement('span'); node.setAttribute('data-label', '标签'); node.setAttribute('data-other', '范围外');
    var result = translate.element.nodeAnalyse.gets(node);
    return result.length === 1 && result[0].attribute === 'data-label' && result[0].text === '标签' && result[0].node === node.getAttributeNode('data-label');
  } },
  ...liveValueCases,
  ...valueEnableCases,
  ...buttonValueCases,
  ...ordinaryValueCases,
  ...valueConditionCases,
  ...iframeValueCases,
  ...valueRenderResetCases
]);
