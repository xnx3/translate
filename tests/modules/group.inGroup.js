'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '默认没有分组区域，普通元素不属于 group',
    test: function () {
      return Array.isArray(translate.group.elements) &&
        translate.group.elements.length === 0 &&
        translate.group.inGroup(document.createElement('div')) === false;
    }
  },
  {
    remark: '登记的元素本身属于分组区域，即使尚未插入文档',
    test: function () {
      var root = document.createElement('div');
      translate.group.addElements(root);
      return translate.group.inGroup(root) === true && root.isConnected === false;
    }
  },
  {
    remark: '多层后代属于分组区域，不要求子元素单独登记',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '<section><p><b>内容</b></p></section>';
      translate.group.addElements(root);
      return translate.group.inGroup(root.querySelector('b')) === true;
    }
  },
  {
    remark: '未登记的祖先和相邻元素不因为包含或靠近分组而命中',
    test: function () {
      var parent = document.createElement('div');
      parent.innerHTML = '<p>分组</p><p>相邻元素</p>';
      translate.group.addElements(parent.firstChild);
      return translate.group.inGroup(parent) === false &&
        translate.group.inGroup(parent.lastChild) === false;
    }
  },
  {
    remark: '组内直接和嵌套的 TextNode 均能作为成员判断输入',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '普通<span>内部</span>';
      translate.group.addElements(root);
      return translate.group.inGroup(root.firstChild) === true &&
        translate.group.inGroup(root.lastChild.firstChild) === true;
    }
  },
  {
    remark: '没有父元素的独立 TextNode 不属于任何已登记区域',
    test: function () {
      translate.group.addElements(document.createElement('div'));
      return translate.group.inGroup(document.createTextNode('独立文本')) === false;
    }
  },
  { remark: 'null 输入返回 false', args: [null], expected: false },
  { remark: '省略输入返回 false', args: [], expected: false },
  { remark: '选择器字符串不能代替真实元素输入', args: ['body'], expected: false },
  {
    remark: '即使登记 body，document 也不作为元素或文本成员处理',
    test: function () {
      translate.group.addElements(document.body);
      return translate.group.inGroup(document) === false;
    }
  },
  {
    remark: '对象形式的区域记录保存各自元素，多个区域都能判断归属',
    test: function () {
      document.body.innerHTML = '<section class="group"><b>甲</b></section><section class="group"><em>乙</em></section><p>外部</p>';
      var roots = document.querySelectorAll('.group');
      translate.group.elements = [
        { element: roots[0], ignoreFunction: function () { return true; } },
        { element: roots[1], ignoreFunction: function () { return true; } }
      ];
      return translate.group.inGroup(document.querySelector('b')) === true &&
        translate.group.inGroup(document.querySelector('em')) === true &&
        translate.group.inGroup(document.querySelector('p')) === false;
    }
  },
  {
    remark: '分别登记多个区域后，移除某条对象记录只影响对应区域',
    test: function () {
      var first = document.createElement('p'), second = document.createElement('p');
      first.innerHTML = '<b>第一个</b>'; second.innerHTML = '<em>第二个</em>';
      translate.group.addElements(first);
      translate.group.addElements(second);
      var before = translate.group.inGroup(first.firstChild) && translate.group.inGroup(second.firstChild);
      translate.group.elements.splice(0, 1);
      return before && translate.group.inGroup(first.firstChild) === false &&
        translate.group.inGroup(second.firstChild) === true;
    }
  },
  {
    remark: '普通数组的 push、删除和整体替换立即改变成员判断',
    test: function () {
      var first = document.createElement('p'), second = document.createElement('p');
      translate.group.elements = [];
      translate.group.elements.push({ element: first, ignoreFunction: function () { return true; } });
      var added = translate.group.inGroup(first);
      translate.group.elements.splice(0, 1);
      var removed = translate.group.inGroup(first);
      translate.group.elements = [{ element: second, ignoreFunction: function () { return true; } }];
      return added === true && removed === false &&
        translate.group.inGroup(first) === false && translate.group.inGroup(second) === true;
    }
  },
  {
    remark: '后代移出分组后立即失效，移回后重新命中，不使用旧的包含关系缓存',
    test: function () {
      var root = document.createElement('div'), outside = document.createElement('div');
      var child = document.createElement('span');
      root.append(child);
      translate.group.addElements(root);
      var before = translate.group.inGroup(child);
      outside.append(child);
      var moved = translate.group.inGroup(child);
      root.append(child);
      return before === true && moved === false && translate.group.inGroup(child) === true;
    }
  },
  {
    remark: '同源 iframe 中的真实元素和 TextNode 可登记，不依赖当前窗口的 instanceof',
    test: function () {
      var iframe = document.createElement('iframe');
      document.body.append(iframe);
      var root = iframe.contentDocument.createElement('div');
      root.innerHTML = '<b>子页面内容</b>';
      iframe.contentDocument.body.append(root);
      translate.group.addElements(root);
      return translate.group.inGroup(root) === true &&
        translate.group.inGroup(root.firstChild) === true &&
        translate.group.inGroup(root.firstChild.firstChild) === true &&
        translate.group.inGroup(iframe) === false;
    }
  },
  {
    remark: '合法区域已登记时，带 nodeType 的普通对象也不能冒充真实 Element 或 TextNode',
    test: function () {
      translate.group.addElements(document.createElement('div'));
      return translate.group.inGroup({ nodeType: 1 }) === false &&
        translate.group.inGroup({ nodeType: 3 }) === false;
    }
  },
  {
    remark: '集合中的空项、选择器和普通对象不影响其他合法区域的成员判断',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '<span>正文</span>';
      translate.group.elements = [null, 'selector', {}, { element: root, ignoreFunction: function () { return true; } }];
      return translate.group.inGroup(root) === true &&
        translate.group.inGroup(root.firstChild) === true &&
        translate.group.inGroup(root.firstChild.firstChild) === true &&
        translate.group.inGroup(document.createElement('p')) === false;
    }
  },
  {
    remark: '回调返回 false 排除指定子元素及其所有后代，兄弟元素仍属于分组',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '<section class="excluded"><p><b>忽略</b></p></section><p>保留</p>';
      translate.group.addElements(root, function (element) { return !element.classList.contains('excluded'); });
      return translate.group.inGroup(root.firstChild) === false &&
        translate.group.inGroup(root.querySelector('b')) === false &&
        translate.group.inGroup(root.querySelector('b').firstChild) === false &&
        translate.group.inGroup(root.lastChild) === true;
    }
  },
  {
    remark: 'TextNode 判断时回调只接收其父级等真实 Element，不把 TextNode 传入回调',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '<span><b>正文</b></span>';
      var valid = true, seenParent = false;
      translate.group.addElements(root, function (element) {
        valid = valid && element.nodeType === 1;
        if (element === root.querySelector('b')) seenParent = true;
        return true;
      });
      return translate.group.inGroup(root.querySelector('b').firstChild) === true && valid && seenParent;
    }
  },
  {
    remark: '登记根自身及其直接文字默认属于组，回调只用于后代元素',
    test: function () {
      var root = document.createElement('div');
      root.textContent = '直接正文';
      var calls = 0;
      translate.group.addElements(root, function () { calls++; return false; });
      return translate.group.inGroup(root) === true &&
        translate.group.inGroup(root.firstChild) === true && calls === 0;
    }
  },
  {
    remark: '回调依赖的状态改变后立即重新判断，不缓存旧的允许或拒绝结果',
    test: function () {
      var root = document.createElement('div'), allowed = false;
      root.innerHTML = '<span>正文</span>';
      translate.group.addElements(root, function () { return allowed; });
      var rejected = translate.group.inGroup(root.firstChild);
      allowed = true;
      var accepted = translate.group.inGroup(root.firstChild);
      allowed = false;
      return rejected === false && accepted === true && translate.group.inGroup(root.firstChild) === false;
    }
  },
  {
    remark: '只有严格布尔 false 排除元素，回调返回 0 或 undefined 仍允许参与',
    test: function () {
      var root = document.createElement('div'), decision = 0;
      root.innerHTML = '<span>正文</span>';
      translate.group.addElements(root, function () { return decision; });
      var zero = translate.group.inGroup(root.firstChild);
      decision = undefined;
      return zero === true && translate.group.inGroup(root.firstChild) === true;
    }
  },
  {
    remark: '内层区域独立登记后可允许外层规则排除的分支，不影响其他被排除分支',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '<section class="excluded"><b>内层开启</b></section><section class="excluded"><b>仍忽略</b></section>';
      translate.group.addElements(root, function (element) { return !element.classList.contains('excluded'); });
      translate.group.addElements(root.firstChild);
      return translate.group.inGroup(root.firstChild) === true &&
        translate.group.inGroup(root.firstChild.firstChild.firstChild) === true &&
        translate.group.inGroup(root.lastChild.firstChild) === false;
    }
  },
  {
    remark: '回调抛出的异常保留给调用方，不静默当作允许或拒绝',
    test: function () {
      var root = document.createElement('div'), failure = new Error('group callback failure');
      root.innerHTML = '<span>正文</span>';
      translate.group.addElements(root, function () { throw failure; });
      try { translate.group.inGroup(root.firstChild); } catch (error) { return error === failure; }
      return false;
    }
  }
]);
