'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "默认未指定时返回页面根元素数组",
    test: function () {
      const result = translate.getDocuments();
      return Array.isArray(result) && result.length === 1 && result[0] === document.documentElement;
    }
  },
  {
    remark: "显式空数组时返回页面根元素数组",
    test: function () {
      translate.documents = [];
      const result = translate.getDocuments();
      return Array.isArray(result) && result.length === 1 && result[0] === document.documentElement;
    }
  },
  {
    remark: "显式null时返回页面根元素数组",
    test: function () {
      translate.documents = null;
      const result = translate.getDocuments();
      return Array.isArray(result) && result.length === 1 && result[0] === document.documentElement;
    }
  },
  {
    remark: "显式undefined时返回页面根元素数组",
    test: function () {
      translate.documents = undefined;
      const result = translate.getDocuments();
      return Array.isArray(result) && result.length === 1 && result[0] === document.documentElement;
    }
  },
  {
    remark: "单个指定区域返回原数组及原元素",
    test: function () {
      const node = document.createElement('div');
      const nodes = [node];
      translate.documents = nodes;
      return translate.getDocuments() === nodes && translate.getDocuments()[0] === node;
    }
  },
  {
    remark: "多个指定区域保持顺序及节点身份",
    test: function () {
      const a = document.createElement('section');
      const b = document.createElement('div');
      translate.documents = [b, a];
      const result = translate.getDocuments();
      return result.length === 2 && result[0] === b && result[1] === a;
    }
  },
  {
    remark: "指定区域为NodeList时保持集合引用",
    test: function () {
      document.body.innerHTML = '<div></div><div></div>';
      const nodes = document.querySelectorAll('div');
      translate.documents = nodes;
      return translate.getDocuments() === nodes && translate.getDocuments().length === 2;
    }
  },
  {
    remark: "连续获取区域不会修改页面和队列",
    test: function () {
      document.body.innerHTML = '<p>原文</p>';
      const queue = translate.nodeQueue;
      translate.getDocuments();
      translate.getDocuments();
      return document.body.textContent === '原文' && translate.nodeQueue === queue;
    }
  }
]);
