'use strict';

// 输入是已有扫描快照；用例不要求快照对象本身通过实时 DOM 校验。
require('../helpers/module')(__filename, [
  {
    remark: "实际段落扫描事件中的 P 容器快照是候选边界",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('p');
      translate.element.whileNodes('boundary', root);
      var snapshot = translate.nodeQueue.boundary.scan.scopes[0].events[0].snapshot;
      return translate.group._isParagraphBoundary(snapshot) === true;
    }
  },
  {
    remark: "实际扫描事件中的 B 行内标签快照不是段落边界",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('b');
      translate.element.whileNodes('boundary', root);
      var snapshot = translate.nodeQueue.boundary.scan.scopes[0].events[0].snapshot;
      return translate.group._isParagraphBoundary(snapshot) === false;
    }
  },
  {
    remark: "BR 扫描快照是换行边界",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('br');
      translate.element.whileNodes('boundary', root);
      var snapshot = translate.nodeQueue.boundary.scan.scopes[0].events[0].snapshot;
      return translate.group._isParagraphBoundary(snapshot) === true;
    }
  },
  {
    remark: "HR 扫描快照是水平分隔边界",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('hr');
      translate.element.whileNodes('boundary', root);
      var snapshot = translate.nodeQueue.boundary.scan.scopes[0].events[0].snapshot;
      return translate.group._isParagraphBoundary(snapshot) === true;
    }
  },
  {
    remark: "Text 快照不是标签边界，即使文字恰好为 P",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var text = document.createTextNode('P');
      translate.element.whileNodes('boundary', text);
      var snapshot = translate.nodeQueue.boundary.scan.scopes[0].events[0].snapshot;
      return translate.group._isParagraphBoundary(snapshot) === false;
    }
  },
  {
    remark: "DocumentFragment 快照不是段落标签边界",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var fragment = document.createDocumentFragment();
      translate.element.whileNodes('boundary', fragment);
      var snapshot = translate.nodeQueue.boundary.scan.scopes[0].events[0].snapshot;
      return translate.group._isParagraphBoundary(snapshot) === false;
    }
  },
  {
    remark: "Document 快照不是段落标签边界",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var doc = document.implementation.createHTMLDocument('');
      translate.element.whileNodes('boundary', doc);
      var snapshot = translate.nodeQueue.boundary.scan.scopes[0].events[0].snapshot;
      return translate.group._isParagraphBoundary(snapshot) === false;
    }
  },
  {
    remark: "冻结实际快照并禁止读取 node、实时 CSS、group 与 ignore 时仍只按快照字段判断",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('p');
      translate.element.whileNodes('boundary', root);
      var snapshot = translate.nodeQueue.boundary.scan.scopes[0].events[0].snapshot;
      var denied = function () { throw new Error('不能读取实时 DOM/CSS 或过滤配置'); };
      Object.defineProperty(snapshot, 'node', { get: denied });
      Object.freeze(snapshot);
      Object.defineProperty(window, 'getComputedStyle', { get: denied });
      Object.defineProperties(translate.group, { elements: { get: denied }, inGroup: { get: denied }, analyze: { get: denied } });
      Object.defineProperty(translate, 'ignore', { get: denied });
      return translate.group._isParagraphBoundary(snapshot) === true &&
        snapshot.nodeType === 1 && snapshot.nodeName === 'P' && Object.isFrozen(snapshot);
    }
  },
  {
    remark: "CSS 将 SPAN 设为 block 也不会改变按静态标签识别的规则",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('span');
      root.style.display = 'block'; document.body.append(root);
      translate.element.whileNodes('boundary', root);
      var snapshot = translate.nodeQueue.boundary.scan.scopes[0].events[0].snapshot;
      return getComputedStyle(root).display === 'block' && translate.group._isParagraphBoundary(snapshot) === false;
    }
  },
  {
    remark: "CSS 将 DIV 设为 inline 也不会改变其静态候选边界身份",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.style.display = 'inline'; document.body.append(root);
      translate.element.whileNodes('boundary', root);
      var snapshot = translate.nodeQueue.boundary.scan.scopes[0].events[0].snapshot;
      return getComputedStyle(root).display === 'inline' && translate.group._isParagraphBoundary(snapshot) === true;
    }
  },
  {
    "remark": "只需要合法快照字段，小写标签名 p 也返回 true",
    "args": [
      {
        "nodeType": 1,
        "nodeName": "p"
      }
    ],
    "expected": true
  },
  {
    "remark": "标签名判断不区分大小写，混合大小写 Br 返回 true",
    "args": [
      {
        "nodeType": 1,
        "nodeName": "Br"
      }
    ],
    "expected": true
  },
  {
    "remark": "null 快照返回 false",
    "args": [
      null
    ],
    "expected": false
  },
  {
    "remark": "省略快照返回 false",
    "args": [],
    "expected": false
  },
  {
    "remark": "nodeType 必须为数值 1，字符串 1 不作为元素快照",
    "args": [
      {
        "nodeType": "1",
        "nodeName": "P"
      }
    ],
    "expected": false
  },
  {
    "remark": "nodeName 不是字符串时返回 false",
    "args": [
      {
        "nodeType": 1,
        "nodeName": 1
      }
    ],
    "expected": false
  },
  {
    "remark": "标签名不去除额外空白，带空格的 P 不视为合法标签名",
    "args": [
      {
        "nodeType": 1,
        "nodeName": " P "
      }
    ],
    "expected": false
  },
  {
    "remark": "完整匹配标签名，名称以 P 开头的未知 PANEL 不作为边界",
    "args": [
      {
        "nodeType": 1,
        "nodeName": "PANEL"
      }
    ],
    "expected": false
  }
]);
