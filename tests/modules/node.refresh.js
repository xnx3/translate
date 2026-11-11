'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '空记录表刷新后仍为空且不抛错',
    test: function () {
      translate.node.data.clear();
      return translate.node.refresh() === undefined && translate.node.data.size === 0;
    }
  },
  {
    remark: '保留仍连接到文档的元素记录并移除脱离文档的元素',
    test: function () {
      const attached = document.createElement('div');
      const detached = document.createElement('div');
      document.body.append(attached);
      const record = {};
      translate.node.set(attached, record);
      translate.node.set(detached, {});
      translate.node.refresh();
      return translate.node.get(attached) === record && translate.node.get(detached) === undefined;
    }
  },
  {
    remark: '文本节点根据实际连接状态保留或移除',
    test: function () {
      const attached = document.createTextNode('保留');
      const detached = document.createTextNode('删除');
      document.body.append(attached);
      translate.node.set(attached, {});
      translate.node.set(detached, {});
      translate.node.refresh();
      return translate.node.find(attached) && !translate.node.find(detached);
    }
  },
  {
    remark: '属性所属元素仍在文档时保留属性记录',
    test: function () {
      const element = document.createElement('input');
      element.placeholder = '提示';
      document.body.append(element);
      const attribute = element.getAttributeNode('placeholder');
      const record = {};
      translate.node.set(attribute, record);
      translate.node.refresh();
      return translate.node.get(attribute) === record;
    }
  },
  {
    remark: '从已连接元素移除的属性记录会被清理',
    test: function () {
      const element = document.createElement('div');
      element.title = '提示';
      document.body.append(element);
      const attribute = element.getAttributeNode('title');
      translate.node.set(attribute, {});
      element.removeAttribute('title');
      translate.node.refresh();
      return translate.node.get(attribute) === undefined;
    }
  },
  {
    remark: '移除祖先后同时清理后代元素文本和属性记录',
    test: function () {
      const parent = document.createElement('div');
      const child = document.createElement('span');
      child.textContent = '后代';
      child.title = '提示';
      parent.append(child);
      document.body.append(parent);
      const text = child.firstChild;
      const attribute = child.getAttributeNode('title');
      translate.node.set(child, {});
      translate.node.set(text, {});
      translate.node.set(attribute, {});
      parent.remove();
      translate.node.refresh();
      return !translate.node.find(child) && !translate.node.find(text) && !translate.node.find(attribute);
    }
  },
  {
    remark: '刷新前重新插回文档的节点保留原记录',
    test: function () {
      const element = document.createElement('p');
      document.body.append(element);
      const record = {};
      translate.node.set(element, record);
      element.remove();
      document.body.append(element);
      translate.node.refresh();
      return translate.node.get(element) === record;
    }
  },
  {
    remark: '连续刷新不会误删有效记录也不会遗漏相邻无效记录',
    test: function () {
      translate.node.data.clear();
      const kept = document.createTextNode('保留');
      document.body.append(kept);
      const record = {};
      translate.node.set(document.createTextNode('删除一'), {});
      translate.node.set(kept, record);
      translate.node.set(document.createTextNode('删除二'), {});
      translate.node.refresh();
      translate.node.refresh();
      return translate.node.data.size === 1 && translate.node.get(kept) === record;
    }
  }
]);
