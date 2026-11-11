'use strict';

require('../helpers/module')(__filename, [
  { remark: '省略节点返回 false', args: [], expected: false },
  { remark: 'undefined 节点返回 false', args: [undefined], expected: false },
  { remark: 'null 节点返回 false', args: [null], expected: false },
  {
    remark: '普通元素没有忽略规则时返回 false',
    test: function () {
      const node = document.createElement('div');
      document.body.appendChild(node);
      return translate.ignore.isIgnore(node) === false;
    }
  },
  {
    remark: '当前元素的 tag 命中忽略列表',
    test: function () {
      const node = document.createElement('code');
      document.body.appendChild(node);
      return translate.ignore.isIgnore(node) === true;
    }
  },
  {
    remark: '祖先 tag 命中时后代元素也忽略',
    test: function () {
      const root = document.createElement('pre');
      const child = document.createElement('span');
      root.appendChild(child);
      document.body.appendChild(root);
      return translate.ignore.isIgnore(child) === true;
    }
  },
  {
    remark: '默认 ignore 类名命中当前元素',
    test: function () {
      const node = document.createElement('div');
      node.className = 'ignore';
      return translate.ignore.isIgnore(node) === true;
    }
  },
  {
    remark: '多个类名中存在完整匹配项即可命中',
    test: function () {
      const node = document.createElement('div');
      node.className = 'first  ignore last';
      return translate.ignore.isIgnore(node) === true;
    }
  },
  {
    remark: '类名只包含 ignore 子串不算命中',
    test: function () {
      const node = document.createElement('div');
      node.className = 'not-ignore ignore-child';
      return translate.ignore.isIgnore(node) === false;
    }
  },
  {
    remark: '祖先的忽略类名影响嵌套文本节点',
    test: function () {
      const root = document.createElement('div');
      root.className = 'ignore';
      const child = document.createElement('span');
      const text = document.createTextNode('内容');
      child.appendChild(text);
      root.appendChild(child);
      return translate.ignore.isIgnore(text) === true;
    }
  },
  {
    remark: '当前元素 id 命中忽略列表',
    test: function () {
      translate.ignore.id = ['skip-id'];
      const node = document.createElement('div');
      node.id = 'skip-id';
      return translate.ignore.isIgnore(node) === true;
    }
  },
  {
    remark: '祖先 id 命中时后代元素也忽略',
    test: function () {
      translate.ignore.id = ['skip-id'];
      const root = document.createElement('div');
      root.id = 'skip-id';
      const child = document.createElement('span');
      root.appendChild(child);
      return translate.ignore.isIgnore(child) === true;
    }
  },
  {
    remark: '相邻元素不继承兄弟元素的忽略规则',
    test: function () {
      const root = document.createElement('div');
      const ignored = document.createElement('span');
      ignored.className = 'ignore';
      const sibling = document.createElement('span');
      root.append(ignored, sibling);
      return translate.ignore.isIgnore(sibling) === false;
    }
  },
  {
    remark: '自定义条件返回 false 时不忽略当前元素',
    test: function () {
      translate.ignore.class.push('conditional', function () { return false; });
      const node = document.createElement('div');
      node.className = 'conditional';
      return translate.ignore.isIgnore(node) === false;
    }
  },
  {
    remark: '自定义条件接收到的是实际参与翻译的后代元素',
    test: function () {
      let received;
      translate.ignore.class.push('conditional', function (element) { received = element; return true; });
      const root = document.createElement('div');
      root.className = 'conditional';
      const child = document.createElement('span');
      root.appendChild(child);
      return translate.ignore.isIgnore(child) === true && received === child;
    }
  },
  {
    remark: '属性节点按 ownerElement 判断祖先规则并传递属性名',
    test: function () {
      let received;
      translate.ignore.class.push('conditional', function (element, data) {
        received = [element, data];
        return true;
      });
      const element = document.createElement('input');
      element.className = 'conditional';
      element.setAttribute('placeholder', '请输入');
      const node = element.getAttributeNode('placeholder');
      const data = { attribute: 'placeholder' };
      return translate.ignore.isIgnore(node, data) === true && received[0] === element &&
        received[1].node === node && received[1].attribute === 'placeholder';
    }
  },
  {
    remark: '文本节点按父元素判断规则并传递原始文本节点',
    test: function () {
      let received;
      translate.ignore.class.push('conditional', function (element, data) { received = [element, data]; return true; });
      const element = document.createElement('div');
      element.className = 'conditional';
      const text = document.createTextNode('内容');
      element.appendChild(text);
      return translate.ignore.isIgnore(text) === true && received[0] === element && received[1].node === text;
    }
  },
  {
    remark: '已提供 data.node 时不覆盖调用方指定的原始节点',
    test: function () {
      const original = document.createTextNode('原始');
      let received;
      translate.ignore.class.push('conditional', function (element, data) { received = data.node; return true; });
      const element = document.createElement('div');
      element.className = 'conditional';
      return translate.ignore.isIgnore(element, { node: original, attribute: 'title' }) === true && received === original;
    }
  },
  {
    remark: '普通脱离文档的元素没有忽略祖先时返回 false',
    test: function () {
      return translate.ignore.isIgnore(document.createElement('span')) === false;
    }
  }
]);
