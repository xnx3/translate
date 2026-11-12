'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '普通英文句子识别为英文并返回实际保存的队列节点',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello world');
      const result = translate.addNodeToQueueAnalysis('batch', node, 'Hello world', '');
      const item = Object.values(translate.nodeQueue.batch.list.english)[0];
      return result.length === 1 && result[0] === item.nodes[0] && result[0].node === node &&
        item.original === 'Hello world' && item.translateText === 'Hello world' && result[0].attribute === '';
    }
  },
  {
    remark: '简体中文句子进入简体中文队列',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nodeQueue.batch = { list: {} };
      const result = translate.addNodeToQueueAnalysis('batch', document.createTextNode('你好世界'), '你好世界', '');
      const items = Object.values(translate.nodeQueue.batch.list.chinese_simplified);
      return result.length === 1 && items.length === 1 && items[0].original === '你好世界';
    }
  },
  {
    remark: '日文假名文本进入日语队列',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nodeQueue.batch = { list: {} };
      const result = translate.addNodeToQueueAnalysis('batch', document.createTextNode('こんにちは'), 'こんにちは', '');
      return result.length === 1 && Object.values(translate.nodeQueue.batch.list.japanese)[0].original === 'こんにちは';
    }
  },
  {
    remark: '韩文音节文本进入韩语队列',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nodeQueue.batch = { list: {} };
      const result = translate.addNodeToQueueAnalysis('batch', document.createTextNode('안녕하세요'), '안녕하세요', '');
      return result.length === 1 && Object.values(translate.nodeQueue.batch.list.korean)[0].original === '안녕하세요';
    }
  },
  {
    remark: '中英文混排在普通模式下拆成两个源语种，节点身份保持一致',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('你好hello');
      const result = translate.addNodeToQueueAnalysis('batch', node, '你好hello', '');
      return result.length === 2 && result.every(entry => entry.node === node) &&
        Object.values(translate.nodeQueue.batch.list.chinese_simplified)[0].original === '你好' &&
        Object.values(translate.nodeQueue.batch.list.english)[0].original === 'hello';
    }
  },
  {
    remark: '混排文本中的目标英语片段被过滤，仅中文片段入队',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nodeQueue.batch = { list: {} };
      const result = translate.addNodeToQueueAnalysis('batch', document.createTextNode('你好hello'), '你好hello', '');
      return result.length === 1 && translate.nodeQueue.batch.list.english === undefined &&
        Object.values(translate.nodeQueue.batch.list.chinese_simplified)[0].original === '你好';
    }
  },
  {
    remark: '混排文本中的目标中文片段被过滤，仅英文片段入队',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'chinese_simplified';
      translate.nodeQueue.batch = { list: {} };
      const result = translate.addNodeToQueueAnalysis('batch', document.createTextNode('你好hello'), '你好hello', '');
      return result.length === 1 && translate.nodeQueue.batch.list.chinese_simplified === undefined &&
        Object.values(translate.nodeQueue.batch.list.english)[0].original === 'hello';
    }
  },
  {
    remark: '纯目标语种文本不创建待翻译条目',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nodeQueue.batch = { list: {} };
      const result = translate.addNodeToQueueAnalysis('batch', document.createTextNode('Hello world'), 'Hello world', '');
      return result.length === 0 && Object.keys(translate.nodeQueue.batch.list).length === 0;
    }
  },
  {
    remark: '空字符串分析返回空结果，不创建语种条目',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const result = translate.addNodeToQueueAnalysis('batch', document.createTextNode(''), '', '');
      return result.length === 0 && Object.keys(translate.nodeQueue.batch.list).length === 0;
    }
  },
  {
    remark: '纯数字文本无需翻译，不创建语种条目',
    test: function () {
      translate.nodeQueue.batch = { list: {} };
      const result = translate.addNodeToQueueAnalysis('batch', document.createTextNode('12345'), '12345', '');
      return result.length === 0 && Object.keys(translate.nodeQueue.batch.list).length === 0;
    }
  },
  {
    remark: '相同节点重复分析不重复入队，第二次返回空数组',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello');
      const first = translate.addNodeToQueueAnalysis('batch', node, 'Hello', '');
      const second = translate.addNodeToQueueAnalysis('batch', node, 'Hello', '');
      return first.length === 1 && second.length === 0 && Object.values(translate.nodeQueue.batch.list.english)[0].nodes.length === 1;
    }
  },
  {
    remark: '相同文本的不同节点共用文本条目，分别返回各自节点',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const a = document.createTextNode('Hello');
      const b = document.createTextNode('Hello');
      const first = translate.addNodeToQueueAnalysis('batch', a, 'Hello', '');
      const second = translate.addNodeToQueueAnalysis('batch', b, 'Hello', '');
      return first.length === 1 && second.length === 1 && first[0].node === a && second[0].node === b &&
        Object.values(translate.nodeQueue.batch.list.english)[0].nodes.length === 2;
    }
  },
  {
    remark: '属性名原样传递，元素的两个属性分别入队',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('input');
      node.title = 'Hello';
      node.placeholder = 'Hello';
      const a = translate.addNodeToQueueAnalysis('batch', node, 'Hello', 'title');
      const b = translate.addNodeToQueueAnalysis('batch', node, 'Hello', 'placeholder');
      return a.length === 1 && b.length === 1 && a[0].attribute === 'title' && b[0].attribute === 'placeholder' &&
        a[0].node === node && b[0].node === node;
    }
  },
  {
    remark: '全局整体模式把中英文全文作为一个条目，不再拆分语种',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.whole.enableAll();
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('你好hello');
      const result = translate.addNodeToQueueAnalysis('batch', node, '你好hello', '');
      const items = Object.values(translate.nodeQueue.batch.list).flatMap(list => Object.values(list));
      return result.length === 1 && items.length === 1 && items[0].original === '你好hello' && items[0].translateText === '你好hello' &&
        result[0].beforeText === '' && result[0].afterText === '';
    }
  },
  {
    remark: '父元素命中 whole class 时后代文本也按整体入队',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.whole.class = ['whole-text'];
      translate.nodeQueue.batch = { list: {} };
      const parent = document.createElement('div');
      parent.className = 'whole-text';
      parent.innerHTML = '<span>你好hello</span>';
      document.body.append(parent);
      const node = parent.firstChild.firstChild;
      const result = translate.addNodeToQueueAnalysis('batch', node, '你好hello', '');
      const items = Object.values(translate.nodeQueue.batch.list).flatMap(list => Object.values(list));
      return result.length === 1 && items.length === 1 && items[0].original === '你好hello' && result[0].node === node;
    }
  },
  {
    remark: 'whole 配置未命中的旁侧元素仍使用普通语种拆分',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.whole.id = ['only-this'];
      translate.nodeQueue.batch = { list: {} };
      const element = document.createElement('p');
      element.textContent = '你好hello';
      document.body.append(element);
      const result = translate.addNodeToQueueAnalysis('batch', element.firstChild, '你好hello', '');
      return result.length === 2 && Object.values(translate.nodeQueue.batch.list.chinese_simplified)[0].original === '你好' &&
        Object.values(translate.nodeQueue.batch.list.english)[0].original === 'hello';
    }
  },
  {
    remark: '分析本身不修改真实 DOM，也不取代外层负责创建的原文记录',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello');
      document.body.append(node);
      const original = { originalText: 'Hello', custom: 123 };
      translate.node.set(node, original);
      translate.addNodeToQueueAnalysis('batch', node, 'Hello', '');
      return node.nodeValue === 'Hello' && translate.node.get(node) === original && original.custom === 123;
    }
  },
  {
    remark: '父级 class 以制表符和换行分隔时，混排文本仍整体入队并保留节点',
    test: function () {
      // 通过真实入队调用验证类名识别的效果，不能仅检查 isWhole 的布尔返回值。
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.whole.class = ['article'];
      translate.nodeQueue.batch = { list: {} };
      const parent = document.createElement('div');
      parent.className = 'other\tarticle\nlast';
      parent.innerHTML = '<span>你好hello</span>';
      document.body.append(parent);
      const node = parent.firstChild.firstChild;
      const result = translate.addNodeToQueueAnalysis('batch', node, '你好hello', '');
      const items = Object.values(translate.nodeQueue.batch.list).flatMap(list => Object.values(list));
      return parent.classList.contains('article') && result.length === 1 && items.length === 1 &&
        items[0].original === '你好hello' && items[0].translateText === '你好hello' &&
        items[0].nodes[0] === result[0] && result[0].node === node && parent.firstChild.firstChild === node &&
        node.nodeValue === '你好hello' && result[0].beforeText === '' && result[0].afterText === '';
    }
  }
]);
