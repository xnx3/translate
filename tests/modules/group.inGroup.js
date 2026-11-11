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
      translate.group.elements = [root];
      return translate.group.inGroup(root) === true && root.isConnected === false;
    }
  },
  {
    remark: '多层后代属于分组区域，不要求子元素单独登记',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '<section><p><b>内容</b></p></section>';
      translate.group.elements = [root];
      return translate.group.inGroup(root.querySelector('b')) === true;
    }
  },
  {
    remark: '未登记的祖先和相邻元素不因为包含或靠近分组而命中',
    test: function () {
      var parent = document.createElement('div');
      parent.innerHTML = '<p>分组</p><p>相邻元素</p>';
      translate.group.elements = [parent.firstChild];
      return translate.group.inGroup(parent) === false &&
        translate.group.inGroup(parent.lastChild) === false;
    }
  },
  {
    remark: '组内直接和嵌套的 TextNode 均能作为成员判断输入',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '普通<span>内部</span>';
      translate.group.elements = [root];
      return translate.group.inGroup(root.firstChild) === true &&
        translate.group.inGroup(root.lastChild.firstChild) === true;
    }
  },
  {
    remark: '没有父元素的独立 TextNode 不属于任何已登记区域',
    test: function () {
      translate.group.elements = [document.createElement('div')];
      return translate.group.inGroup(document.createTextNode('独立文本')) === false;
    }
  },
  { remark: 'null 输入返回 false', args: [null], expected: false },
  { remark: '省略输入返回 false', args: [], expected: false },
  { remark: '选择器字符串不能代替真实元素输入', args: ['body'], expected: false },
  {
    remark: '即使登记 body，document 也不作为元素或文本成员处理',
    test: function () {
      translate.group.elements = [document.body];
      return translate.group.inGroup(document) === false;
    }
  },
  {
    remark: 'elements 可以直接接收 querySelectorAll 返回的 NodeList',
    test: function () {
      document.body.innerHTML = '<section class="group"><b>甲</b></section><section class="group"><em>乙</em></section><p>外部</p>';
      translate.group.elements = document.querySelectorAll('.group');
      return translate.group.inGroup(document.querySelector('b')) === true &&
        translate.group.inGroup(document.querySelector('em')) === true &&
        translate.group.inGroup(document.querySelector('p')) === false;
    }
  },
  {
    remark: 'elements 支持 HTMLCollection，并实时识别集合中新增和移除的根',
    test: function () {
      var container = document.createElement('div');
      translate.group.elements = container.children;
      var root = document.createElement('p');
      root.innerHTML = '<b>内容</b>';
      var child = root.firstChild;
      var before = translate.group.inGroup(child);
      container.append(root);
      var added = translate.group.inGroup(child);
      root.remove();
      return before === false && added === true && translate.group.inGroup(child) === false;
    }
  },
  {
    remark: '普通数组的 push、删除和整体替换立即改变成员判断',
    test: function () {
      var first = document.createElement('p'), second = document.createElement('p');
      translate.group.elements = [];
      translate.group.elements.push(first);
      var added = translate.group.inGroup(first);
      translate.group.elements.splice(0, 1);
      var removed = translate.group.inGroup(first);
      translate.group.elements = [second];
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
      translate.group.elements = [root];
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
      translate.group.elements = [root];
      return translate.group.inGroup(root) === true &&
        translate.group.inGroup(root.firstChild) === true &&
        translate.group.inGroup(root.firstChild.firstChild) === true &&
        translate.group.inGroup(iframe) === false;
    }
  },
  {
    remark: '合法区域已登记时，带 nodeType 的普通对象也不能冒充真实 Element 或 TextNode',
    test: function () {
      translate.group.elements = [document.createElement('div')];
      return translate.group.inGroup({ nodeType: 1 }) === false &&
        translate.group.inGroup({ nodeType: 3 }) === false;
    }
  },
  {
    remark: '集合中的空项、选择器和普通对象不影响其他合法区域的成员判断',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '<span>正文</span>';
      translate.group.elements = [null, 'selector', {}, root];
      return translate.group.inGroup(root) === true &&
        translate.group.inGroup(root.firstChild) === true &&
        translate.group.inGroup(root.firstChild.firstChild) === true &&
        translate.group.inGroup(document.createElement('p')) === false;
    }
  }
]);
