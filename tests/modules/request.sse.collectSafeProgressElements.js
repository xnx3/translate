// 每种非法字段值单独注册，失败时直接报告具体字段和输入。
// 将本项数据写成函数字面量，避免浏览器执行 test 时依赖 Node 侧闭包。
const invalidCases = [
  ['uuid', undefined], ['uuid', null],
  ['renderLang', undefined], ['renderLang', null], ['renderLang', ''], ['renderLang', 42],
  ['renderedIndexes', undefined], ['renderedIndexes', null], ['renderedIndexes', '0'], ['renderedIndexes', {}],
  ['fanyiLangs', undefined], ['fanyiLangs', null], ['fanyiLangs', 'english'], ['fanyiLangs', {}],
  ['translateHashArray', undefined], ['translateHashArray', null], ['translateHashArray', 42], ['translateHashArray', {}]
].map(function (item) {
  const field = JSON.stringify(item[0]);
  const value = item[1] === undefined ? 'undefined' : JSON.stringify(item[1]);
  return {
    remark: '非法字段 ' + item[0] + '=' + value + ' 不初始化或消耗进度状态',
    test: new Function(`
      translate.progress.api.use = true; translate.progress.api.isTip = true;
      translate.nodeQueue.unit = { list: { english: { a: { nodes: [] } } } };
      var state = {}, data = { uuid: 'unit', fanyiLangs: ['english'], translateHashArray: { english: ['a'] }, renderLang: 'english', renderedIndexes: [0] };
      data[${field}] = ${value};
      return translate.request.sse.collectSafeProgressElements(state, data).length === 0 && state.initialized !== true;
    `)
  };
});
const missingCases = [
  ['state=null', 'null', '{}'],
  ['data=null', '{}', 'null'],
  ['data 没有必填字段', '{}', '{}'],
  ['缺少 renderLang', '{}', "{ uuid: 'missing' }"],
  ['缺少 renderedIndexes 和 fanyiLangs', '{}', "{ uuid: 'missing', renderLang: 'english' }"],
  ['缺少 translateHashArray', '{}', "{ uuid: 'missing', renderLang: 'english', renderedIndexes: [], fanyiLangs: [] }"],
  ['不存在对应 nodeQueue', '{}', "{ uuid: 'missing', renderLang: 'english', renderedIndexes: [], fanyiLangs: [], translateHashArray: { english: [] } }"]
].map(function (item) {
  return { remark: item[0] + ' 时返回空数组，不抛异常', test: new Function(`
    translate.progress.api.use = true; translate.progress.api.isTip = true;
    return translate.request.sse.collectSafeProgressElements(${item[1]}, ${item[2]}).length === 0;
  `) };
});

require('../helpers/module')(__filename, [
  { remark: '进度遮罩未同时启用 use 和 isTip 时不处理状态', test: function () {
    var state = {};
    translate.progress.api.use = false; translate.progress.api.isTip = true;
    var first = translate.request.sse.collectSafeProgressElements(state, {});
    translate.progress.api.use = true; translate.progress.api.isTip = false;
    var second = translate.request.sse.collectSafeProgressElements(state, {});
    return first.length === 0 && second.length === 0 && Object.keys(state).length === 0;
  } },
  ...missingCases,
  { remark: '同一元素的两段文本全部渲染后才可移除遮罩，重复通知不重复返回', test: function () {
    translate.progress.api.use = true; translate.progress.api.isTip = true;
    var element = document.createElement('p'); element.append('甲', document.createTextNode('乙')); document.body.append(element);
    translate.nodeQueue.unit = { list: { english: { a: { nodes: [{ node: element.childNodes[0] }] }, b: { nodes: [{ node: element.childNodes[1] }] } } } };
    var state = {}, data = { uuid: 'unit', fanyiLangs: ['english'], translateHashArray: { english: ['a', 'b'] }, renderLang: 'english', renderedIndexes: [0, 0] };
    var first = translate.request.sse.collectSafeProgressElements(state, data);
    data.renderedIndexes = [1]; var second = translate.request.sse.collectSafeProgressElements(state, data);
    var third = translate.request.sse.collectSafeProgressElements(state, data);
    return first.length === 0 && second.length === 1 && second[0] === element && third.length === 0 && state.elementPendingMap.size === 0;
  } },
  { remark: '多个独立元素可分别在自己的文本完成后安全返回', test: function () {
    translate.progress.api.use = true; translate.progress.api.isTip = true;
    var first = document.createElement('p'), second = document.createElement('p'); first.textContent = '甲'; second.textContent = '乙'; document.body.append(first, second);
    translate.nodeQueue.unit = { list: { english: { a: { nodes: [{ node: first.firstChild }] }, b: { nodes: [{ node: second.firstChild }] } } } };
    var state = {}, data = { uuid: 'unit', fanyiLangs: ['english'], translateHashArray: { english: ['a', 'b'] }, renderLang: 'english', renderedIndexes: [0] };
    var one = translate.request.sse.collectSafeProgressElements(state, data);
    data.renderedIndexes = [1]; var two = translate.request.sse.collectSafeProgressElements(state, data);
    return one.length === 1 && one[0] === first && two.length === 1 && two[0] === second;
  } },
  { remark: '同一元素包含不同来源语言时等待所有语言任务完成', test: function () {
    translate.progress.api.use = true; translate.progress.api.isTip = true;
    var element = document.createElement('p'); element.textContent = '甲 hello'; document.body.append(element);
    translate.nodeQueue.unit = { list: { chinese_simplified: { a: { nodes: [{ node: element.firstChild }] } }, english: { b: { nodes: [{ node: element.firstChild }] } } } };
    var state = {}, data = { uuid: 'unit', fanyiLangs: ['chinese_simplified', 'english'], translateHashArray: { chinese_simplified: ['a'], english: ['b'] }, renderLang: 'chinese_simplified', renderedIndexes: [0] };
    var first = translate.request.sse.collectSafeProgressElements(state, data);
    data.renderLang = 'english'; var second = translate.request.sse.collectSafeProgressElements(state, data);
    return first.length === 0 && second.length === 1 && second[0] === element;
  } },
  { remark: '同一文本关联同一元素的多个节点时去重，不留下无法消除的 pending', test: function () {
    translate.progress.api.use = true; translate.progress.api.isTip = true;
    var element = document.createElement('p'); element.append('甲', document.createTextNode('甲')); document.body.append(element);
    translate.nodeQueue.unit = { list: { english: { a: { nodes: [{ node: element.firstChild }, { node: element.lastChild }, { node: element.firstChild }, null] } } } };
    var state = {}, result = translate.request.sse.collectSafeProgressElements(state, { uuid: 'unit', fanyiLangs: ['english'], translateHashArray: { english: ['a'] }, renderLang: 'english', renderedIndexes: [0, 0] });
    return result.length === 1 && result[0] === element && state.elementPendingMap.size === 0;
  } },
  { remark: '非法索引和不存在的队列项被跳过，有效索引仍能正常返回', test: function () {
    translate.progress.api.use = true; translate.progress.api.isTip = true;
    var element = document.createElement('p'); element.textContent = '甲'; document.body.append(element);
    translate.nodeQueue.unit = { list: { english: { a: { nodes: [{ node: element.firstChild }] } } } };
    var result = translate.request.sse.collectSafeProgressElements({}, { uuid: 'unit', fanyiLangs: ['english'], translateHashArray: { english: ['a', 'missing'] }, renderLang: 'english', renderedIndexes: ['bad', -1, 99, 1, 0] });
    return result.length === 1 && result[0] === element;
  } },
  { remark: '已初始化但关键映射缺失时安全返回空数组', test: function () {
    translate.progress.api.use = true; translate.progress.api.isTip = true;
    translate.nodeQueue.unit = { list: { english: {} } };
    var data = { uuid: 'unit', fanyiLangs: ['english'], translateHashArray: { english: [] }, renderLang: 'english', renderedIndexes: [] };
    return translate.request.sse.collectSafeProgressElements({ initialized: true }, data).length === 0 && translate.request.sse.collectSafeProgressElements({ initialized: true, elementPendingMap: new Map() }, data).length === 0;
  } },
  ...invalidCases,
  { remark: '片段直接文本与正常文本混合完成时只返回真实元素且清空待完成计数', test: function () {
    translate.progress.api.use = true; translate.progress.api.isTip = true;
    var fragment = document.createDocumentFragment(), fragmentText = document.createTextNode('片段原文'); fragment.append(fragmentText);
    var element = document.createElement('p'); element.textContent = '正常原文'; document.body.append(element);
    var text = element.firstChild;
    translate.nodeQueue.unit = { list: { english: {
      a: { nodes: [{ node: fragmentText }] }, b: { nodes: [{ node: text }] }
    } } };
    var state = {}, data = { uuid: 'unit', fanyiLangs: ['english'], translateHashArray: { english: ['a', 'b'] }, renderLang: 'english', renderedIndexes: [0, 1] };
    var result = translate.request.sse.collectSafeProgressElements(state, data);
    return result.length === 1 && result[0] === element && state.elementPendingMap.size === 0 &&
      fragmentText.parentNode === fragment && fragmentText.nodeValue === '片段原文' &&
      element.firstChild === text && text.nodeValue === '正常原文';
  } }
]);
