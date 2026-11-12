'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "缺参不修改现有区域及待翻译队列",
    test: function () {
      const node = document.createElement('section');
      const nodes = [node];
      const queue = {keep: true};
      translate.documents = nodes;
      translate.nodeQueue = queue;
      translate.setDocuments();
      return translate.documents === nodes && translate.nodeQueue === queue;
    }
  },
  {
    remark: "undefined不修改现有区域及待翻译队列",
    test: function () {
      const node = document.createElement('section');
      const nodes = [node];
      const queue = {keep: true};
      translate.documents = nodes;
      translate.nodeQueue = queue;
      translate.setDocuments(undefined);
      return translate.documents === nodes && translate.nodeQueue === queue;
    }
  },
  {
    remark: "null不修改现有区域及待翻译队列",
    test: function () {
      const node = document.createElement('section');
      const nodes = [node];
      const queue = {keep: true};
      translate.documents = nodes;
      translate.nodeQueue = queue;
      translate.setDocuments(null);
      return translate.documents === nodes && translate.nodeQueue === queue;
    }
  },
  {
    remark: "单个元素设为翻译范围并清空队列",
    test: function () {
      const node = document.createElement('section');
      translate.nodeQueue = {old: true};
      translate.setDocuments(node);
      return translate.getDocuments()[0] === node && Object.keys(translate.nodeQueue).length === 0;
    }
  },
  {
    remark: "数组保留输入引用和区域顺序",
    test: function () {
      const a = document.createElement('div');
      const b = document.createElement('section');
      const nodes = [b, a];
      translate.setDocuments(nodes);
      return translate.documents === nodes && translate.documents[0] === b && translate.documents[1] === a;
    }
  },
  {
    remark: "NodeList可以作为多元素范围",
    test: function () {
      document.body.innerHTML = '<div></div><div></div>';
      const nodes = document.querySelectorAll('div');
      translate.setDocuments(nodes);
      return translate.documents === nodes && translate.documents.length === 2;
    }
  },
  {
    remark: "HTMLCollection可以作为多元素范围",
    test: function () {
      document.body.innerHTML = '<div></div><div></div>';
      const nodes = document.getElementsByTagName('div');
      translate.setDocuments(nodes);
      return translate.documents === nodes && translate.documents.length === 2;
    }
  },
  {
    remark: "过滤数组中间的null区域并保留有效节点",
    test: function () {
      const a = document.createElement('div');
      const b = document.createElement('div');
      const nodes = [a, null, b];
      translate.setDocuments(nodes);
      return translate.documents.length === 2 && translate.documents[0] === a && translate.documents[1] === b;
    }
  },
  {
    remark: "相邻null区域应全部移除",
    test: function () {
      const a = document.createElement('div');
      translate.setDocuments([null, null, a]);
      return translate.documents.length === 1 && translate.documents[0] === a;
    }
  },
  {
    remark: "相邻undefined区域应全部移除",
    test: function () {
      const a = document.createElement('div');
      translate.setDocuments([undefined, undefined, a]);
      return translate.documents.length === 1 && translate.documents[0] === a;
    }
  },
  {
    remark: "空数组保留已有有效范围并清空队列",
    test: function () {
      const node = document.createElement('div');
      translate.setDocuments([node]);
      translate.nodeQueue = {old: true};
      translate.setDocuments([]);
      return translate.documents.length === 1 && translate.documents[0] === node && Object.keys(translate.nodeQueue).length === 0;
    }
  },
  {
    remark: "数组开头相邻null与undefined全部移除并保留引用和节点顺序",
    test: function () {
      const a = document.createElement('div');
      const b = document.createElement('section');
      const nodes = [null, undefined, b, a];
      translate.nodeQueue = {old: true};
      translate.setDocuments(nodes);
      return translate.documents === nodes && nodes.length === 2 && nodes[0] === b && nodes[1] === a &&
        Object.keys(translate.nodeQueue).length === 0;
    }
  },
  {
    remark: "数组中间相邻null与undefined全部移除并保留引用和节点顺序",
    test: function () {
      const a = document.createElement('div');
      const b = document.createElement('section');
      const nodes = [b, null, undefined, a];
      translate.nodeQueue = {old: true};
      translate.setDocuments(nodes);
      return translate.documents === nodes && nodes.length === 2 && nodes[0] === b && nodes[1] === a &&
        Object.keys(translate.nodeQueue).length === 0;
    }
  },
  {
    remark: "数组末尾相邻null与undefined全部移除并保留引用和节点顺序",
    test: function () {
      const a = document.createElement('div');
      const b = document.createElement('section');
      const nodes = [b, a, null, undefined];
      translate.nodeQueue = {old: true};
      translate.setDocuments(nodes);
      return translate.documents === nodes && nodes.length === 2 && nodes[0] === b && nodes[1] === a &&
        Object.keys(translate.nodeQueue).length === 0;
    }
  },
  {
    remark: "连续四个混合空项全部移除并保留两侧有效节点",
    test: function () {
      const a = document.createElement('div');
      const b = document.createElement('section');
      const nodes = [b, null, undefined, null, undefined, a];
      translate.nodeQueue = {old: true};
      translate.setDocuments(nodes);
      return translate.documents === nodes && nodes.length === 2 && nodes[0] === b && nodes[1] === a &&
        Object.keys(translate.nodeQueue).length === 0;
    }
  },
  {
    remark: "全为空项的数组过滤后为空时保留原范围并清空队列",
    test: function () {
      const node = document.createElement('section');
      const previous = [node];
      translate.setDocuments(previous);
      const nodes = [null, undefined, null, undefined];
      translate.nodeQueue = {old: true};
      translate.setDocuments(nodes);
      // 过滤后沿用已有空数组约定，不将原范围改成空范围。
      return nodes.length === 0 && translate.documents === previous && previous.length === 1 &&
        previous[0] === node && Object.keys(translate.nodeQueue).length === 0;
    }
  }
]);
