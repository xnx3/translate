require('../helpers/module')(__filename, [
  { remark: '空队列向视觉调整传入空节点数组', test: function () {
    let received;
    translate.nodeQueue.test = { list: {} };
    translate.visual.adjustTranslationSpaces = function (nodes) { received = nodes; };
    translate.visual.adjustTranslationSpacesByNodequeueUuid('test');
    return Array.isArray(received) && received.length === 0;
  } },
  { remark: '同一语种不同文本的全部节点按队列顺序传递', test: function () {
    const a = document.createTextNode('a'), b = document.createTextNode('b'), c = document.createTextNode('c'); let received;
    translate.nodeQueue.test = { list: { english: { h1: { nodes: [{ node: a }, { node: b }] }, h2: { nodes: [{ node: c }] } } } };
    translate.visual.adjustTranslationSpaces = function (nodes) { received = nodes; };
    translate.visual.adjustTranslationSpacesByNodequeueUuid('test');
    return received.length === 3 && received[0] === a && received[1] === b && received[2] === c;
  } },
  { remark: '数字标点所属空语种同样参与视觉间隔', test: function () {
    const a = document.createTextNode('a'), number = document.createTextNode('9'); let received;
    translate.nodeQueue.test = { list: { english: { h1: { nodes: [{ node: a }] } }, '': { h2: { nodes: [{ node: number }] } } } };
    translate.visual.adjustTranslationSpaces = function (nodes) { received = nodes; };
    translate.visual.adjustTranslationSpacesByNodequeueUuid('test');
    return received.length === 2 && received[0] === a && received[1] === number;
  } },
  { remark: '继承的语种条目不会被错误收集', test: function () {
    const a = document.createTextNode('a'), hidden = document.createTextNode('hidden'); let received;
    const list = Object.assign(Object.create({ hidden: { h: { nodes: [{ node: hidden }] } } }), { english: { h: { nodes: [{ node: a }] } } });
    translate.nodeQueue.test = { list };
    translate.visual.adjustTranslationSpaces = function (nodes) { received = nodes; };
    translate.visual.adjustTranslationSpacesByNodequeueUuid('test');
    return received.length === 1 && received[0] === a;
  } }
]);
