'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "省略可选参数保存原文译文且不提前改写节点",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      const result = task.add(node, '你好', 'Hello');
      const stored = task.taskQueue.get(node)[0];
      return result === undefined && stored.originalText === '你好' && stored.resultText === 'Hello' && stored.attribute === undefined && stored.participles === undefined && node.nodeValue === '你好';
    }
  },
  {
    remark: "显式 undefined 属性和分词参数按未设置保存",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, '你好', 'Hello', undefined, undefined);
      const stored = task.taskQueue.get(node)[0];
      return stored.attribute === undefined && stored.participles === undefined;
    }
  },
  {
    remark: "null 属性表示文本本身且分词数组保留引用",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      const participles = ['你好世界'];
      task.add(node, '你好', 'Hello', null, participles);
      const stored = task.taskQueue.get(node)[0];
      return stored.attribute === null && stored.participles === participles && participles.length === 1;
    }
  },
  {
    remark: "空字符串属性和空分词数组均能正常记录",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      const participles = [];
      task.add(node, '你好', 'Hello', '', participles);
      const stored = task.taskQueue.get(node)[0];
      return stored.attribute === '' && stored.participles === participles && stored.participles.length === 0;
    }
  },
  {
    remark: "同一节点的多个替换任务按添加顺序累积",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, '你', 'you');
      task.add(node, '你好', 'Hello');
      const stored = task.taskQueue.get(node);
      return task.taskQueue.size === 1 && stored.length === 2 && stored[0].originalText === '你' && stored[1].originalText === '你好';
    }
  },
  {
    remark: "同文字的不同节点分别维护任务并归入相同文字分组",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      const second = document.createTextNode('你好');
      task.add(node, '你好', 'Hello');
      task.add(second, '你好', 'Bonjour');
      const group = task.nodes[translate.util.hash('你好')];
      return task.taskQueue.size === 2 && task.taskQueue.get(node)[0].resultText === 'Hello' && task.taskQueue.get(second)[0].resultText === 'Bonjour' && group.length === 2 && group[0] === node && group[1] === second;
    }
  },
  {
    remark: "title 属性任务根据属性内容归组且保留属性名",
    test: function () {
      const node = document.createElement('div');
      node.title = '提示';
      const task = new translate.renderTask();
      task.add(node, '提示', 'Tip', 'title');
      return task.taskQueue.get(node)[0].attribute === 'title' && task.nodes[translate.util.hash('提示')][0] === node && node.title === '提示';
    }
  },
  {
    remark: "input 的动态 value 任务使用当前值归组",
    test: function () {
      const node = document.createElement('input');
      node.value = '输入值';
      const task = new translate.renderTask();
      task.add(node, '输入值', 'Input', 'value');
      return task.taskQueue.get(node)[0].attribute === 'value' && task.nodes[translate.util.hash('输入值')][0] === node && node.value === '输入值';
    }
  },
  {
    remark: "中文换行和 emoji 原文译文保持完整",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, '中文\n😀', 'English\n😀');
      const stored = task.taskQueue.get(node)[0];
      return stored.originalText === '中文\n😀' && stored.resultText === 'English\n😀';
    }
  },
  {
    remark: "空译文保留为空用于清除匹配内容",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, '你好', '');
      return task.taskQueue.get(node)[0].resultText === '';
    }
  },
  {
    remark: "原文没有边缘空格时保持译文",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, "你好", "Hello");
      return task.taskQueue.get(node)[0].resultText === "Hello";
    }
  },
  {
    remark: "原文有前空格而译文没有时补一个前空格",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, " 你好", "Hello");
      return task.taskQueue.get(node)[0].resultText === " Hello";
    }
  },
  {
    remark: "译文已有前空格时不重复追加",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, " 你好", " Hello");
      return task.taskQueue.get(node)[0].resultText === " Hello";
    }
  },
  {
    remark: "原文有后空格而译文没有时补一个后空格",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, "你好 ", "Hello");
      return task.taskQueue.get(node)[0].resultText === "Hello ";
    }
  },
  {
    remark: "译文已有后空格时不能再重复追加",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, "你好 ", "Hello ");
      return task.taskQueue.get(node)[0].resultText === "Hello ";
    }
  },
  {
    remark: "原文前后都有空格时译文两侧都应保留",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, " 你好 ", "Hello");
      return task.taskQueue.get(node)[0].resultText === " Hello ";
    }
  },
  {
    remark: "不能把译文前空格误当成译文后空格",
    test: function () {
      const node = document.createTextNode('你好');
      const task = new translate.renderTask();
      task.add(node, "你好 ", " Hello");
      return task.taskQueue.get(node)[0].resultText === " Hello ";
    }
  }
]);
