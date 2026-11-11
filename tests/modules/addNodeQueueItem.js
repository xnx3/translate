'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '首次入队保留文本、节点、属性和前后边界，返回实际保存的对象',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello');
      const result = translate.addNodeQueueItem('batch', node, 'Hello', '', 'english', '前', '后');
      const items = Object.values(translate.nodeQueue.batch.list.english);
      return items.length === 1 && items[0].original === 'Hello' && items[0].translateText === 'Hello' &&
        items[0].nodes.length === 1 && items[0].nodes[0] === result && result.node === node &&
        result.attribute === '' && result.beforeText === '前' && result.afterText === '后';
    }
  },
  {
    remark: '同一批次同一语种相同文本合并请求，但保留两个不同节点',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const first = document.createTextNode('Hello');
      const second = document.createTextNode('Hello');
      translate.addNodeQueueItem('batch', first, 'Hello', '', 'english', '', '');
      const result = translate.addNodeQueueItem('batch', second, 'Hello', '', 'english', 'a', 'b');
      const items = Object.values(translate.nodeQueue.batch.list.english);
      return items.length === 1 && items[0].nodes.length === 2 && items[0].nodes[0].node === first &&
        items[0].nodes[1] === result && result.node === second && result.beforeText === 'a' && result.afterText === 'b';
    }
  },
  {
    remark: '完全相同节点与属性重复入队返回 null，并保留首次边界',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello');
      const first = translate.addNodeQueueItem('batch', node, 'Hello', '', 'english', 'first', 'last');
      const duplicate = translate.addNodeQueueItem('batch', node, 'Hello', '', 'english', 'new', 'new');
      return duplicate === null && Object.values(translate.nodeQueue.batch.list.english)[0].nodes.length === 1 &&
        first.beforeText === 'first' && first.afterText === 'last';
    }
  },
  {
    remark: '同一元素的 title 与 placeholder 不能被当作重复节点丢弃',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('input');
      translate.addNodeQueueItem('batch', node, 'Hello', 'title', 'english', '', '');
      const second = translate.addNodeQueueItem('batch', node, 'Hello', 'placeholder', 'english', '', '');
      const items = Object.values(translate.nodeQueue.batch.list.english);
      return second !== null && items.length === 1 && items[0].nodes.length === 2 &&
        items[0].nodes[0].attribute === 'title' && items[0].nodes[1].attribute === 'placeholder';
    }
  },
  {
    remark: '同一节点的不同待译文本分别保存，互不覆盖',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello world');
      translate.addNodeQueueItem('batch', node, 'Hello', '', 'english', '', ' ');
      translate.addNodeQueueItem('batch', node, 'world', '', 'english', ' ', '');
      const items = Object.values(translate.nodeQueue.batch.list.english);
      return items.length === 2 && items.some(item => item.original === 'Hello' && item.nodes[0].afterText === ' ') &&
        items.some(item => item.original === 'world' && item.nodes[0].beforeText === ' ');
    }
  },
  {
    remark: '相同文本在不同源语种下分别入队',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('test');
      const a = translate.addNodeQueueItem('batch', node, 'test', '', 'english', '', '');
      const b = translate.addNodeQueueItem('batch', node, 'test', '', 'french', '', '');
      return a !== b && Object.values(translate.nodeQueue.batch.list.english)[0].nodes[0] === a &&
        Object.values(translate.nodeQueue.batch.list.french)[0].nodes[0] === b;
    }
  },
  {
    remark: '不同执行批次分别保存相同节点，不跨批次去重',
    test: function () {
      translate.nodeQueue.first = { list: {} };
      translate.nodeQueue.second = { list: {} };
      const node = document.createTextNode('Hello');
      const a = translate.addNodeQueueItem('first', node, 'Hello', '', 'english', '', '');
      const b = translate.addNodeQueueItem('second', node, 'Hello', '', 'english', '', '');
      return a !== b && Object.values(translate.nodeQueue.first.list.english)[0].nodes.length === 1 &&
        Object.values(translate.nodeQueue.second.list.english)[0].nodes.length === 1;
    }
  },
  {
    remark: '节点克隆即使文本相同也作为独立目标保留',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello');
      const clone = node.cloneNode(true);
      translate.addNodeQueueItem('batch', node, 'Hello', '', 'english', '', '');
      translate.addNodeQueueItem('batch', clone, 'Hello', '', 'english', '', '');
      const nodes = Object.values(translate.nodeQueue.batch.list.english)[0].nodes;
      return nodes.length === 2 && nodes[0].node === node && nodes[1].node === clone;
    }
  },
  {
    remark: '真实 Attr 节点作为目标时保留属性节点身份',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const element = document.createElement('span');
      element.title = 'Hello';
      const attr = element.getAttributeNode('title');
      const result = translate.addNodeQueueItem('batch', attr, 'Hello', 'title', 'english', '', '');
      return result.node === attr && result.node.ownerElement === element && result.attribute === 'title' && element.title === 'Hello';
    }
  },
  {
    remark: 'input value 目标保留元素身份且入队不修改现有值',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('input');
      node.value = 'Hello';
      const result = translate.addNodeQueueItem('batch', node, 'Hello', 'value', 'english', '', '');
      return result.node === node && result.attribute === 'value' && node.value === 'Hello';
    }
  },
  {
    remark: '中文、换行和 emoji 文本完整保留，不进行字符串截断',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const text = '你好\n世界😀';
      const node = document.createTextNode(text);
      translate.addNodeQueueItem('batch', node, text, '', 'chinese_simplified', '\n', '\t');
      const item = Object.values(translate.nodeQueue.batch.list.chinese_simplified)[0];
      return item.original === '你好\n世界😀' && item.translateText === '你好\n世界😀' &&
        item.nodes[0].beforeText === '\n' && item.nodes[0].afterText === '\t';
    }
  },
  {
    remark: '文本中的首尾空格原样保留，不与去掉空格的文本合并',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode(' Hello ');
      translate.addNodeQueueItem('batch', node, ' Hello ', '', 'english', '', '');
      translate.addNodeQueueItem('batch', node, 'Hello', '', 'english', '', '');
      const items = Object.values(translate.nodeQueue.batch.list.english);
      return items.length === 2 && items.some(item => item.original === ' Hello ') && items.some(item => item.original === 'Hello');
    }
  },
  {
    remark: '保留现有语种和队列元数据，新增条目不会重建整个批次',
    test: function () {
      const existing = { original: 'ancien', nodes: [] };
      translate.nodeQueue.batch = { expireTime: 123, list: { french: { old: existing } } };
      translate.addNodeQueueItem('batch', document.createTextNode('Hello'), 'Hello', '', 'english', '', '');
      return translate.nodeQueue.batch.expireTime === 123 && translate.nodeQueue.batch.list.french.old === existing &&
        Object.values(translate.nodeQueue.batch.list.english).length === 1;
    }
  },
  {
    remark: '长文本完整入队，重复请求仍只保留一个目标',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const text = 'Hello 世界😀 '.repeat(2000);
      const node = document.createTextNode(text);
      translate.addNodeQueueItem('batch', node, text, '', 'english', '', '');
      const duplicate = translate.addNodeQueueItem('batch', node, text, '', 'english', '', '');
      const item = Object.values(translate.nodeQueue.batch.list.english)[0];
      return duplicate === null && item.original === text && item.translateText === text && item.nodes.length === 1;
    }
  },
  {
    remark: '省略可选的前后边界时仍成功入队，并保留 undefined',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const result = translate.addNodeQueueItem('batch', document.createTextNode('Hello'), 'Hello', '', 'english');
      return result !== null && result.beforeText === undefined && result.afterText === undefined;
    }
  },
  {
    remark: '重复条目位于多个目标中间时仍能正确去重',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const nodes = ['a', 'b', 'c'].map(() => document.createTextNode('Hello'));
      nodes.forEach(node => translate.addNodeQueueItem('batch', node, 'Hello', '', 'english', '', ''));
      const duplicate = translate.addNodeQueueItem('batch', nodes[1], 'Hello', '', 'english', '', '');
      const stored = Object.values(translate.nodeQueue.batch.list.english)[0].nodes;
      return duplicate === null && stored.length === 3 && stored.every((entry, index) => entry.node === nodes[index]);
    }
  }
]);
