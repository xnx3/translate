'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '空任务正常返回且不调用完成钩子',
    test: async function () {
      let count = 0;
      translate.listener.renderTaskFinish = function () { count++; };
      const task = new translate.renderTask();
      const result = task.execute();
      await new Promise(resolve => setTimeout(resolve, 20));
      return result === undefined && count === 0 && task.taskQueue.size === 0;
    }
  },
  {
    remark: '真实文本节点完成替换并记录原文译文及修改时间',
    test: function () {
      translate.to = 'chinese_simplified';
      const node = document.createTextNode('你好');
      document.body.append(node);
      const task = new translate.renderTask();
      task.add(node, '你好', '您好');
      const before = Date.now();
      const result = task.execute();
      const record = translate.node.get(node);
      return result === undefined && node.nodeValue === '您好' && record.originalText === '你好' && record.resultText === '您好' && record.translateTexts['你好'] === '您好' && record.lastTranslateRenderTime >= before && record.lastTranslateRenderTime <= Date.now();
    }
  },
  {
    remark: '已经扫描的节点复用原历史对象及原始文本',
    test: function () {
      translate.to = 'chinese_simplified';
      const node = document.createTextNode('你好');
      const record = { originalText: '最初原文', whole: false, translateTexts: {}, custom: '保留' };
      translate.node.set(node, record);
      const task = new translate.renderTask();
      task.add(node, '你好', '您好');
      task.execute();
      return translate.node.get(node) === record && record.originalText === '最初原文' && record.custom === '保留' && record.translateTexts['你好'] === '您好' && node.nodeValue === '您好';
    }
  },
  {
    remark: '同节点的长匹配优先于短匹配防止破坏长词',
    test: function () {
      translate.to = 'chinese_simplified';
      const node = document.createTextNode('你好世界，你好');
      const task = new translate.renderTask();
      // 刻意先加入短词，执行时应根据长度排序，而非按照添加顺序直接替换。
      task.add(node, '你好', '您好');
      task.add(node, '你好世界', '地球');
      task.execute();
      return node.nodeValue === '地球，您好' && task.taskQueue.get(node)[0].originalText === '你好世界';
    }
  },
  {
    remark: '不同节点具有相同原文时均独立完成各自翻译',
    test: function () {
      translate.to = 'chinese_simplified';
      const first = document.createTextNode('你好');
      const second = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(first, '你好', '您好');
      task.add(second, '你好', '您好呀');
      task.execute();
      return first.nodeValue === '您好' && second.nodeValue === '您好呀' && translate.node.get(first).resultText === '您好' && translate.node.get(second).resultText === '您好呀';
    }
  },
  {
    remark: '元素 title 翻译只改属性并把历史记录在属性节点',
    test: function () {
      translate.to = 'chinese_simplified';
      const element = document.createElement('div');
      element.title = '提示';
      element.textContent = '正文保留';
      const attribute = element.getAttributeNode('title');
      const task = new translate.renderTask();
      task.add(element, '提示', '说明', 'title');
      task.execute();
      const record = translate.node.get(attribute);
      return element.title === '说明' && element.textContent === '正文保留' && record.attribute === 'title' && record.originalText === '提示' && record.resultText === '说明' && !translate.node.find(element);
    }
  },
  {
    remark: 'input 动态 value 使用属性值且历史记录在输入框本身',
    test: function () {
      translate.to = 'chinese_simplified';
      const input = document.createElement('input');
      input.value = '输入';
      const task = new translate.renderTask();
      task.add(input, '输入', '填写', 'value');
      task.execute();
      const record = translate.node.get(input);
      return input.value === '填写' && record.attribute === 'value' && record.originalText === '输入' && record.resultText === '填写';
    }
  },
  {
    remark: 'textarea 动态 value 同样能翻译且不依赖 value HTML 属性',
    test: function () {
      translate.to = 'chinese_simplified';
      const input = document.createElement('textarea');
      input.value = '多行\n文字😀';
      const task = new translate.renderTask();
      task.add(input, '多行\n文字😀', '多行\n内容😀', 'value');
      task.execute();
      return input.value === '多行\n内容😀' && translate.node.get(input).resultText === '多行\n内容😀';
    }
  },
  {
    remark: '传入 null 属性和空分词数组时仍可翻译文本本身',
    test: function () {
      translate.to = 'chinese_simplified';
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, '你好', '您好', null, []);
      task.execute();
      return node.nodeValue === '您好' && translate.node.get(node).attribute === '';
    }
  },
  {
    remark: '保护分词内的文字不替换而独立出现的词仍替换',
    test: function () {
      translate.to = 'chinese_simplified';
      const node = document.createTextNode('你好世界，你好');
      const participles = ['你好世界'];
      const task = new translate.renderTask();
      task.add(node, '你好', '您好', undefined, participles);
      task.execute();
      return node.nodeValue === '你好世界，您好' && participles.length === 1 && participles[0] === '你好世界';
    }
  },
  {
    remark: '入队后文本已被外部改写时不能覆盖用户的新内容',
    test: function () {
      translate.to = 'chinese_simplified';
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, '你好', '您好');
      node.nodeValue = '新的内容';
      task.execute();
      return node.nodeValue === '新的内容';
    }
  },
  {
    remark: '有真实 Map 任务时异步完成钩子收到本次任务实例且仅一次',
    test: async function () {
      translate.to = 'chinese_simplified';
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, '你好', '您好');
      const received = [];
      translate.listener.renderTaskFinish = function (value) { received.push(value); };
      task.execute();
      const synchronousCount = received.length;
      await new Promise(resolve => setTimeout(resolve, 30));
      return synchronousCount === 0 && received.length === 1 && received[0] === task && node.nodeValue === '您好';
    }
  },
  {
    remark: '空译文删除文本开头的原文，保留节点及原文译文记录',
    test: function () {
      translate.to = 'chinese_simplified';
      const node = document.createTextNode('你好世界');
      document.body.append(node);
      const task = new translate.renderTask();
      task.add(node, '你好', '');
      task.execute();
      const record = translate.node.get(node);
      return node.nodeValue === '世界' && node.isConnected && record.originalText === '你好世界' && record.resultText === '世界' && record.translateTexts['你好'] === '';
    }
  },
  {
    remark: '英文空译文仅删除中间原文，不格式化两侧全角逗号或补空格',
    test: function () {
      translate.to = 'english';
      const node = document.createTextNode('甲，你好，乙');
      document.body.append(node);
      const task = new translate.renderTask();
      task.add(node, '你好', '');
      task.execute();
      return node.nodeValue === '甲，，乙' && node.isConnected && translate.node.get(node).translateTexts['你好'] === '';
    }
  },
  {
    remark: '英文空译文删除相邻的全部原文后保留空文本节点',
    test: function () {
      translate.to = 'english';
      const node = document.createTextNode('你好你好');
      document.body.append(node);
      const task = new translate.renderTask();
      task.add(node, '你好', '');
      task.execute();
      const record = translate.node.get(node);
      return node.nodeValue === '' && node.isConnected && record.originalText === '你好你好' && record.resultText === '' && record.translateTexts['你好'] === '';
    }
  },
  {
    remark: '英文空译文保留受保护分词及原标点，只删除独立原文',
    test: function () {
      translate.to = 'english';
      const node = document.createTextNode('你好世界，你好');
      const participles = ['你好世界'];
      document.body.append(node);
      const task = new translate.renderTask();
      task.add(node, '你好', '', undefined, participles);
      task.execute();
      return node.nodeValue === '你好世界，' && node.isConnected && participles.length === 1 && participles[0] === '你好世界';
    }
  },
  {
    remark: '空译文清空 title 的文字，保留属性节点及元素正文',
    test: function () {
      translate.to = 'english';
      const element = document.createElement('div');
      element.title = '你好';
      element.textContent = '正文保留';
      document.body.append(element);
      const attribute = element.getAttributeNode('title');
      const task = new translate.renderTask();
      task.add(element, '你好', '', 'title');
      task.execute();
      const record = translate.node.get(attribute);
      return element.title === '' && element.getAttributeNode('title') === attribute && element.textContent === '正文保留' && element.isConnected && record.resultText === '' && record.translateTexts['你好'] === '';
    }
  },
  {
    remark: '空译文清空 input 的实时 value，保留输入框及翻译记录',
    test: function () {
      translate.to = 'english';
      const input = document.createElement('input');
      input.value = '你好';
      document.body.append(input);
      const task = new translate.renderTask();
      task.add(input, '你好', '', 'value');
      task.execute();
      const record = translate.node.get(input);
      return input.value === '' && input.isConnected && record.resultText === '' && record.translateTexts['你好'] === '';
    }
  },
  {
    remark: '空译文删除 textarea 实时 value 的开头原文，保留其余文字',
    test: function () {
      translate.to = 'english';
      const input = document.createElement('textarea');
      input.value = '你好世界';
      document.body.append(input);
      const task = new translate.renderTask();
      task.add(input, '你好', '', 'value');
      task.execute();
      const record = translate.node.get(input);
      return input.value === '世界' && input.isConnected && record.resultText === '世界' && record.translateTexts['你好'] === '';
    }
  },
  {
    remark: '同节点的空译文与普通译文任务均执行，删除不影响后续替换',
    test: function () {
      translate.to = 'english';
      const node = document.createTextNode('你好世界');
      document.body.append(node);
      const task = new translate.renderTask();
      task.add(node, '你好', '');
      task.add(node, '世界', 'World');
      task.execute();
      const record = translate.node.get(node);
      return node.nodeValue === 'World' && node.isConnected && record.translateTexts['你好'] === '' && record.translateTexts['世界'] === 'World';
    }
  }
]);
