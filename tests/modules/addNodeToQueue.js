'use strict';

require('../helpers/module')(__filename, [
  { remark: '不传任何参数时安全结束', args: [], expected: undefined },
  { remark: '节点为 null 时不进入入队流程', args: ['batch', null, 'Hello', ''], expected: undefined },
  {
    remark: 'text 为 null 时不创建节点记录或队列项',
    test: function () {
      const node = document.createTextNode('Hello');
      const result = translate.addNodeToQueue('batch', node, null, '');
      return result === undefined && translate.node.get(node) == null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '空 text 时不创建节点记录或队列项',
    test: function () {
      const node = document.createTextNode('');
      translate.addNodeToQueue('batch', node, '', '');
      return translate.node.get(node) == null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '注释节点即使含有效文字也不参与翻译',
    test: function () {
      const node = document.createComment('Hello world');
      document.body.append(node);
      translate.addNodeToQueue('batch', node, 'Hello world', '');
      return translate.node.get(node) == null && translate.nodeQueue.batch === undefined && node.nodeValue === 'Hello world';
    }
  },
  {
    remark: 'script 文本中的 HTML 标记不能被当成待翻译页面内容',
    test: function () {
      const script = document.createElement('script');
      script.type = 'application/json';
      script.textContent = '{"html":"<b>Hello</b>"}';
      document.body.append(script);
      const node = script.firstChild;
      translate.addNodeToQueue('batch', node, node.nodeValue, '');
      return translate.node.get(node) == null && translate.nodeQueue.batch === undefined && script.textContent === '{"html":"<b>Hello</b>"}';
    }
  },
  {
    remark: 'style 文本中的 HTML 标记不能进入翻译队列',
    test: function () {
      const style = document.createElement('style');
      style.textContent = '/* <b>Hello</b> */';
      document.body.append(style);
      const node = style.firstChild;
      translate.addNodeToQueue('batch', node, node.nodeValue, '');
      return translate.node.get(node) == null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '首次普通文本入队记录完整原文，保留节点且不提前修改 DOM',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello world');
      document.body.append(node);
      const result = translate.addNodeToQueue('batch', node, 'Hello world', '');
      const data = translate.node.get(node);
      const item = Object.values(translate.nodeQueue.batch.list.english)[0];
      return result === undefined && data.originalText === 'Hello world' && data.attribute === '' && data.whole === true &&
        item.original === 'Hello world' && item.nodes[0].node === node && node.nodeValue === 'Hello world';
    }
  },
  {
    remark: '省略 attribute 时按文本节点本身记录',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello');
      translate.addNodeToQueue('batch', node, 'Hello');
      return translate.node.get(node).originalText === 'Hello' && translate.node.get(node).attribute === '' &&
        Object.values(translate.nodeQueue.batch.list.english)[0].original === 'Hello';
    }
  },
  {
    remark: 'title 文本记录在真实 Attr 上，队列仍保留元素和属性名供后续渲染',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('span');
      node.title = 'Hello';
      const attr = node.getAttributeNode('title');
      translate.addNodeToQueue('batch', node, 'Hello', 'title');
      const data = translate.node.get(attr);
      const queued = Object.values(translate.nodeQueue.batch.list.english)[0].nodes[0];
      return data.originalText === 'Hello' && data.attribute === 'title' && translate.node.get(node) == null &&
        queued.node === node && queued.attribute === 'title' && node.title === 'Hello';
    }
  },
  {
    remark: 'input value 记录在元素本身，不能错误使用可能过时的 value Attr',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('input');
      node.setAttribute('value', 'default');
      node.value = 'Hello';
      translate.addNodeToQueue('batch', node, node.value, 'value');
      return translate.node.get(node).originalText === 'Hello' && translate.node.get(node).attribute === 'value' &&
        translate.node.get(node.getAttributeNode('value')) == null && node.value === 'Hello' && node.getAttribute('value') === 'default';
    }
  },
  {
    remark: 'textarea value 记录在元素本身，不修改其默认文本',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('textarea');
      node.textContent = 'default';
      node.value = 'Hello';
      translate.addNodeToQueue('batch', node, node.value, 'value');
      return translate.node.get(node).originalText === 'Hello' && translate.node.get(node).attribute === 'value' &&
        node.value === 'Hello' && node.textContent === 'default';
    }
  },
  {
    remark: '同一 input 的 value 和 placeholder 分别记录与入队',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('input');
      node.value = 'Hello';
      node.placeholder = 'Please type';
      translate.addNodeToQueue('batch', node, node.value, 'value');
      translate.addNodeToQueue('batch', node, node.placeholder, 'placeholder');
      return translate.node.get(node).originalText === 'Hello' && translate.node.get(node.getAttributeNode('placeholder')).originalText === 'Please type' &&
        Object.values(translate.nodeQueue.batch.list.english).length === 2;
    }
  },
  {
    remark: '已扫描节点再次调用不会用新文字覆盖原文或重复创建队列项',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello');
      translate.addNodeToQueue('batch', node, 'Hello', '');
      node.nodeValue = 'changed';
      translate.addNodeToQueue('batch', node, 'changed', '');
      const items = Object.values(translate.nodeQueue.batch.list.english);
      return translate.node.get(node).originalText === 'Hello' && items.length === 1 && items[0].original === 'Hello' &&
        items[0].nodes.length === 1 && node.nodeValue === 'changed';
    }
  },
  {
    remark: '已有空字符串 originalText 也算已扫描，不被新 text 覆盖',
    test: function () {
      const node = document.createTextNode('Hello');
      translate.node.set(node, { originalText: '', custom: 123 });
      translate.addNodeToQueue('batch', node, 'Hello', '');
      return translate.node.get(node).originalText === '' && translate.node.get(node).custom === 123 && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '完全忽略的文本不请求翻译，但记录原文、最终文本及渲染时间',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.ignore.text = ['Hello'];
      const node = document.createTextNode('Hello');
      const before = Date.now();
      translate.addNodeToQueue('batch', node, 'Hello', '');
      const data = translate.node.get(node);
      return translate.nodeQueue.batch === undefined && data.originalText === 'Hello' && data.resultText === 'Hello' &&
        data.lastTranslateRenderTime >= before && Object.keys(data.translateTexts).length === 0 && node.nodeValue === 'Hello';
    }
  },
  {
    remark: '部分忽略文本不进入待译片段，原始全文仍完整记录',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.ignore.text = ['KEEP'];
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('HelloKEEPworld');
      translate.addNodeToQueue('batch', node, 'HelloKEEPworld', '');
      const data = translate.node.get(node);
      const words = Object.values(translate.nodeQueue.batch.list.english).map(item => item.original).sort();
      return JSON.stringify(words) === '["Hello","world"]' && data.originalText === 'HelloKEEPworld' && data.whole === false &&
        Object.hasOwn(data.translateTexts, 'Hello') && Object.hasOwn(data.translateTexts, 'world') && node.nodeValue === 'HelloKEEPworld';
    }
  },
  {
    remark: '忽略正则仅保护当前匹配片段，不修改全局忽略文本配置',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.ignore.text = [];
      translate.ignore.textRegex = [/\{[^}]+\}/g];
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello{user}world');
      translate.addNodeToQueue('batch', node, 'Hello{user}world', '');
      const words = Object.values(translate.nodeQueue.batch.list.english).map(item => item.original).sort();
      return JSON.stringify(words) === '["Hello","world"]' && translate.ignore.text.length === 0 && node.nodeValue === 'Hello{user}world';
    }
  },
  {
    remark: '全文命中自定义术语时直接渲染并记录结果，不创建网络待译项',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      const node = document.createTextNode('你好');
      translate.addNodeToQueue('batch', node, '你好', '');
      const data = translate.node.get(node);
      return node.nodeValue === 'Hello' && data.originalText === '你好' && data.resultText === 'Hello' &&
        Object.keys(data.translateTexts).length === 0 && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '部分术语直接替换，只把尚未命中的原文片段交给后续翻译',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '品牌=Brand');
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('你好品牌世界');
      translate.addNodeToQueue('batch', node, '你好品牌世界', '');
      const words = Object.values(translate.nodeQueue.batch.list.chinese_simplified).map(item => item.original).sort();
      const data = translate.node.get(node);
      // 英语局部译文遵循现有分词规则，在两侧中文之间补空格。
      return JSON.stringify(words) === '["世界","你好"]' && node.nodeValue === '你好 Brand 世界' && data.originalText === '你好品牌世界' && data.whole === false;
    }
  },
  {
    remark: '属性全文命中术语时更新实际属性并记录在 Attr 上',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      const node = document.createElement('input');
      node.placeholder = '你好';
      translate.addNodeToQueue('batch', node, '你好', 'placeholder');
      const data = translate.node.get(node.getAttributeNode('placeholder'));
      return node.placeholder === 'Hello' && data.originalText === '你好' && data.resultText === 'Hello' && data.attribute === 'placeholder';
    }
  },
  {
    remark: '只含空白文本不会进入网络队列，仍记录原文和当前结果',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      const node = document.createTextNode(' \n\t');
      translate.addNodeToQueue('batch', node, ' \n\t', '');
      const data = translate.node.get(node);
      // 可译文本读取会过滤纯空白；原文记录和实际 DOM 仍须完整保留。
      return translate.nodeQueue.batch === undefined && data.originalText === ' \n\t' && data.resultText === '' && node.nodeValue === ' \n\t';
    }
  }
]);
