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
  }
]);
