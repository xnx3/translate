'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '默认关闭上下文翻译时不创建队列或节点记录',
    test: function () {
      const nodes = [document.createTextNode('Hello '), document.createTextNode('world')];
      const result = translate.addWholeContextToQueue('batch', { nodes, texts: ['Hello ', 'world'] });
      return result === null && translate.nodeQueue.batch === undefined && nodes.every(node => translate.node.get(node) == null);
    }
  },
  {
    remark: '启用后两个片段按顺序形成一个上下文条目，并设置两分钟有效期',
    test: function () {
      translate.whole.context.use();
      const nodes = [document.createTextNode('Hello '), document.createTextNode('world')];
      const before = Date.now();
      const item = translate.addWholeContextToQueue('batch', { nodes, texts: ['Hello ', 'world'] });
      const after = Date.now();
      return item !== null && item.type === 'wholeContext' && item.original === 'Hello world' &&
        JSON.stringify(item.translateText) === '["Hello ","world"]' && item.nodes.length === 2 &&
        item.nodes.every((entry, index) => entry.node === nodes[index] && entry.attribute === '' && entry.beforeText === '' && entry.afterText === '') &&
        translate.nodeQueue.batch.expireTime >= before + 120000 && translate.nodeQueue.batch.expireTime <= after + 120000;
    }
  },
  {
    remark: '三个片段包含中文与 emoji 时保留顺序和各自原始空格',
    test: function () {
      translate.whole.context.use();
      const texts = ['你好 ', '世界', ' 😀'];
      const nodes = texts.map(text => document.createTextNode(text));
      const item = translate.addWholeContextToQueue('batch', { nodes, texts });
      return item.original === '你好 世界 😀' && item.nodes.length === 3 && item.translateText[0] === '你好 ' &&
        item.translateText[1] === '世界' && item.translateText[2] === ' 😀' && item.nodes[2].node === nodes[2];
    }
  },
  {
    remark: '每个节点记录各自原文和整体标志，不能都记录为拼接后的全文',
    test: function () {
      translate.whole.context.use();
      const texts = ['Please ', 'read'];
      const nodes = texts.map(text => document.createTextNode(text));
      translate.addWholeContextToQueue('batch', { nodes, texts });
      return nodes.every((node, index) => {
        const data = translate.node.get(node);
        return data.originalText === texts[index] && data.whole === true && data.attribute === '' &&
          Object.hasOwn(data.translateTexts, texts[index]) && data.translateTexts[texts[index]] === null;
      });
    }
  },
  {
    remark: 'translateText 保存独立数组，调用方后续修改输入数组不改变已入队文本',
    test: function () {
      translate.whole.context.use();
      const texts = ['Hello ', 'world'];
      const nodes = texts.map(text => document.createTextNode(text));
      const item = translate.addWholeContextToQueue('batch', { nodes, texts });
      texts[0] = 'changed';
      texts.push('new');
      return item.translateText !== texts && item.translateText.length === 2 && item.translateText[0] === 'Hello ' && item.original === 'Hello world';
    }
  },
  {
    remark: '文本完全相同的不同 group 保持独立，避免破坏分段下标映射',
    test: function () {
      translate.whole.context.use();
      const firstNodes = ['Hello ', 'world'].map(text => document.createTextNode(text));
      const secondNodes = ['Hello ', 'world'].map(text => document.createTextNode(text));
      const first = translate.addWholeContextToQueue('batch', { nodes: firstNodes, texts: ['Hello ', 'world'] });
      const second = translate.addWholeContextToQueue('batch', { nodes: secondNodes, texts: ['Hello ', 'world'] });
      const items = Object.values(translate.nodeQueue.batch.list).flatMap(list => Object.values(list));
      return first !== second && items.length === 2 && first.nodes.length === 2 && second.nodes.length === 2 &&
        first.nodes[0].node === firstNodes[0] && second.nodes[0].node === secondNodes[0];
    }
  },
  {
    remark: '普通全文条目与相同全文的上下文条目不能共用队列项',
    test: function () {
      translate.whole.context.use();
      translate.nodeQueue.batch = { list: {} };
      const ordinary = document.createTextNode('Hello world');
      translate.addNodeQueueItem('batch', ordinary, 'Hello world', '', 'english', '', '');
      const nodes = ['Hello ', 'world'].map(text => document.createTextNode(text));
      const item = translate.addWholeContextToQueue('batch', { nodes, texts: ['Hello ', 'world'] });
      const items = Object.values(translate.nodeQueue.batch.list.english);
      return items.length === 2 && items.includes(item) && item.type === 'wholeContext' && item.nodes.length === 2 &&
        items.some(entry => entry.type === undefined && entry.original === 'Hello world' && entry.nodes[0].node === ordinary);
    }
  },
  {
    remark: '已有节点元数据可以保留并补充上下文所需字段',
    test: function () {
      translate.whole.context.use();
      const nodes = ['Hello ', 'world'].map(text => document.createTextNode(text));
      translate.node.set(nodes[0], { custom: 123, translateTexts: { existing: '保留' } });
      const item = translate.addWholeContextToQueue('batch', { nodes, texts: ['Hello ', 'world'] });
      return item !== null && translate.node.get(nodes[0]).custom === 123 &&
        translate.node.get(nodes[0]).translateTexts.existing === '保留' && translate.node.get(nodes[0]).translateTexts['Hello '] === null;
    }
  },
  {
    remark: '同一 group 再次入队应跳过，不能重复写入已记录节点',
    test: function () {
      translate.whole.context.use();
      const nodes = ['Hello ', 'world'].map(text => document.createTextNode(text));
      const group = { nodes, texts: ['Hello ', 'world'] };
      const first = translate.addWholeContextToQueue('batch', group);
      const duplicate = translate.addWholeContextToQueue('batch', group);
      const items = Object.values(translate.nodeQueue.batch.list).flatMap(list => Object.values(list));
      return duplicate === null && items.length === 1 && items[0] === first;
    }
  },
  {
    remark: 'group 中任一节点已被普通翻译记录时整个 group 跳过，其他节点不被部分记录',
    test: function () {
      translate.whole.context.use();
      const nodes = ['Hello ', 'world'].map(text => document.createTextNode(text));
      const prior = { originalText: 'world', custom: '保留' };
      translate.node.set(nodes[1], prior);
      const result = translate.addWholeContextToQueue('batch', { nodes, texts: ['Hello ', 'world'] });
      return result === null && translate.nodeQueue.batch === undefined && translate.node.get(nodes[0]) == null && translate.node.get(nodes[1]) === prior;
    }
  },
  {
    remark: '已有空字符串原文的节点也算已记录，不能重复入队',
    test: function () {
      translate.whole.context.use();
      const nodes = ['Hello ', 'world'].map(text => document.createTextNode(text));
      translate.node.set(nodes[0], { originalText: '' });
      return translate.addWholeContextToQueue('batch', { nodes, texts: ['Hello ', 'world'] }) === null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '省略 group 时返回 null，不创建批次',
    test: function () {
      translate.whole.context.use();
      return translate.addWholeContextToQueue('batch') === null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: 'group 为 null 时返回 null，不创建批次',
    test: function () {
      translate.whole.context.use();
      return translate.addWholeContextToQueue('batch', null) === null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '缺少 nodes 时拒绝入队',
    test: function () {
      translate.whole.context.use();
      return translate.addWholeContextToQueue('batch', { texts: ['Hello ', 'world'] }) === null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '缺少 texts 时拒绝入队',
    test: function () {
      translate.whole.context.use();
      return translate.addWholeContextToQueue('batch', { nodes: [document.createTextNode('a'), document.createTextNode('b')] }) === null;
    }
  },
  {
    remark: '空 group 拒绝入队',
    test: function () {
      translate.whole.context.use();
      return translate.addWholeContextToQueue('batch', { nodes: [], texts: [] }) === null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '只有一个片段不能进入多片段上下文队列',
    test: function () {
      translate.whole.context.use();
      const node = document.createTextNode('Hello');
      return translate.addWholeContextToQueue('batch', { nodes: [node], texts: ['Hello'] }) === null && translate.node.get(node) == null;
    }
  },
  {
    remark: '节点数量多于文本数量时拒绝入队',
    test: function () {
      translate.whole.context.use();
      return translate.addWholeContextToQueue('batch', { nodes: [document.createTextNode('a'), document.createTextNode('b')], texts: ['a'] }) === null;
    }
  },
  {
    remark: '文本数量多于节点数量时拒绝入队',
    test: function () {
      translate.whole.context.use();
      return translate.addWholeContextToQueue('batch', { nodes: [document.createTextNode('a'), document.createTextNode('b')], texts: ['a', 'b', 'c'] }) === null;
    }
  },
  {
    remark: '第二个节点为空时拒绝整个 group，首节点不会被部分记录',
    test: function () {
      translate.whole.context.use();
      const node = document.createTextNode('Hello ');
      return translate.addWholeContextToQueue('batch', { nodes: [node, null], texts: ['Hello ', 'world'] }) === null &&
        translate.node.get(node) == null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '缺失数组元素的稀疏节点数组不能入队',
    test: function () {
      translate.whole.context.use();
      const nodes = [document.createTextNode('Hello ')];
      nodes.length = 2;
      return translate.addWholeContextToQueue('batch', { nodes, texts: ['Hello ', 'world'] }) === null;
    }
  },
  {
    remark: '空字符串片段不能入队，即使其他片段有效',
    test: function () {
      translate.whole.context.use();
      const nodes = [document.createTextNode('Hello'), document.createTextNode('')];
      return translate.addWholeContextToQueue('batch', { nodes, texts: ['Hello', ''] }) === null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '仅包含空格换行的片段不能入队',
    test: function () {
      translate.whole.context.use();
      const nodes = [document.createTextNode('Hello'), document.createTextNode(' \n\t')];
      return translate.addWholeContextToQueue('batch', { nodes, texts: ['Hello', ' \n\t'] }) === null;
    }
  },
  {
    remark: '数字片段不自动转成字符串，拒绝整个 group',
    test: function () {
      translate.whole.context.use();
      const nodes = [document.createTextNode('Hello'), document.createTextNode('123')];
      return translate.addWholeContextToQueue('batch', { nodes, texts: ['Hello', 123] }) === null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: 'null 片段不自动转成字符串',
    test: function () {
      translate.whole.context.use();
      return translate.addWholeContextToQueue('batch', { nodes: [document.createTextNode('a'), document.createTextNode('b')], texts: ['Hello', null] }) === null;
    }
  },
  {
    remark: '保留已有批次的有效期和其他语种条目',
    test: function () {
      translate.whole.context.use();
      const existing = { original: '旧条目' };
      translate.nodeQueue.batch = { expireTime: 123, list: { french: { old: existing } } };
      const nodes = ['Hello ', 'world'].map(text => document.createTextNode(text));
      const item = translate.addWholeContextToQueue('batch', { nodes, texts: ['Hello ', 'world'] });
      return item !== null && translate.nodeQueue.batch.expireTime === 123 && translate.nodeQueue.batch.list.french.old === existing;
    }
  },
  {
    remark: '模拟 hash 冲突时保留旧条目并跳过新 group，不写入新节点记录',
    test: function () {
      translate.whole.context.use();
      // 固定底层 hash 只用于稳定构造冲突；仍调用真实入队方法验证保护行为。
      translate.util.hash = function () { return 'collision'; };
      const firstNodes = ['Hello ', 'world'].map(text => document.createTextNode(text));
      const secondNodes = ['Other ', 'words'].map(text => document.createTextNode(text));
      const first = translate.addWholeContextToQueue('batch', { nodes: firstNodes, texts: ['Hello ', 'world'] });
      const second = translate.addWholeContextToQueue('batch', { nodes: secondNodes, texts: ['Other ', 'words'] });
      return second === null && translate.nodeQueue.batch.list.english.collision === first && first.original === 'Hello world' &&
        secondNodes.every(node => translate.node.get(node) == null);
    }
  }
]);
