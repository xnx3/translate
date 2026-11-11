'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '省略回调时登记对象记录，默认函数允许任意后代且保留真实元素引用',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '<span>正文</span>';
      var result = translate.group.addElements(root), entry = translate.group.elements[0];
      return result === true && translate.group.elements.length === 1 && entry.element === root &&
        typeof entry.ignoreFunction === 'function' && entry.ignoreFunction(root.firstChild) === true;
    }
  },
  {
    remark: '显式 null 回调与省略回调一样使用默认允许函数',
    test: function () {
      var root = document.createElement('div');
      var result = translate.group.addElements(root, null), entry = translate.group.elements[0];
      return result === true && entry.element === root && typeof entry.ignoreFunction === 'function' &&
        entry.ignoreFunction(document.createElement('span')) === true;
    }
  },
  {
    remark: '登记时保存指定回调原引用，不提前执行用户判断函数',
    test: function () {
      var root = document.createElement('div'), calls = 0;
      var callback = function () { calls++; return false; };
      return translate.group.addElements(root, callback) === true && calls === 0 &&
        translate.group.elements[0].element === root && translate.group.elements[0].ignoreFunction === callback;
    }
  },
  {
    remark: '同一个根重新登记更新回调，不新增默认允许记录，也不影响其他区域',
    test: function () {
      var root = document.createElement('div'), other = document.createElement('section');
      root.innerHTML = '<span>需要排除</span>';
      translate.group.addElements(root);
      translate.group.addElements(other);
      var callback = function () { return false; };
      var result = translate.group.addElements(root, callback);
      return result === true && translate.group.elements.length === 2 &&
        translate.group.elements[0].element === root && translate.group.elements[0].ignoreFunction === callback &&
        translate.group.elements[1].element === other && translate.group.inGroup(root.firstChild) === false &&
        translate.group.inGroup(other) === true;
    }
  },
  {
    remark: '同根更新时省略回调可恢复默认允许，不继续使用之前的拒绝规则',
    test: function () {
      var root = document.createElement('div'); root.innerHTML = '<span>正文</span>';
      translate.group.addElements(root, function () { return false; });
      var before = translate.group.inGroup(root.firstChild);
      var result = translate.group.addElements(root);
      return before === false && result === true && translate.group.elements.length === 1 &&
        translate.group.inGroup(root.firstChild) === true;
    }
  },
  { remark: 'null 元素登记失败', args: [null], expected: false },
  { remark: '选择器字符串不能代替真实元素登记', args: ['#article'], expected: false },
  {
    remark: 'TextNode 不能作为登记区域，不向 elements 添加无效条目',
    test: function () {
      return translate.group.addElements(document.createTextNode('正文')) === false &&
        translate.group.elements.length === 0;
    }
  },
  {
    remark: '元素数组不是单个 Element，不作为批量参数悄悄展开登记',
    test: function () {
      return translate.group.addElements([document.createElement('div')]) === false &&
        translate.group.elements.length === 0;
    }
  },
  {
    remark: '无效回调登记失败，保留既有区域与规则且不添加新区域',
    test: function () {
      var root = document.createElement('div'), other = document.createElement('section');
      var callback = function () { return false; };
      translate.group.addElements(root, callback);
      var update = translate.group.addElements(root, 'invalid callback');
      var added = translate.group.addElements(other, 'invalid callback');
      return update === false && added === false && translate.group.elements.length === 1 &&
        translate.group.elements[0].element === root && translate.group.elements[0].ignoreFunction === callback;
    }
  },
  {
    remark: '带 nodeType 的普通对象不能冒充可登记的真实元素',
    test: function () {
      return translate.group.addElements({ nodeType: 1 }) === false && translate.group.elements.length === 0;
    }
  }
]);
