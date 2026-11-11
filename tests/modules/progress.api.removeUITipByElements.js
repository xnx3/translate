'use strict';

require('../helpers/module')(__filename, [
  { remark: "省略元素集合不抛错", args: [], expected: undefined },
  { remark: "null元素集合不抛错", args: [null], expected: undefined },
  { remark: "空集合不抛错", args: [[]], expected: undefined },
  {
    remark: "移除提示类并保留正常类：keep translate_api_in_progress",
    test: function () {
      const node=document.createElement('div');
      node.className="keep translate_api_in_progress";
      translate.progress.api.removeUITipByElements([node]);
      return node.classList.contains('keep') && !node.classList.contains('translate_api_in_progress') && !node.classList.contains('translatejs-text-element-hidden');
    }
  },
  {
    remark: "移除提示类并保留正常类：keep translatejs-text-element-hidden",
    test: function () {
      const node=document.createElement('div');
      node.className="keep translatejs-text-element-hidden";
      translate.progress.api.removeUITipByElements([node]);
      return node.classList.contains('keep') && !node.classList.contains('translate_api_in_progress') && !node.classList.contains('translatejs-text-element-hidden');
    }
  },
  {
    remark: "移除提示类并保留正常类：translate_api_in_progress translatejs-text-element-hidden keep",
    test: function () {
      const node=document.createElement('div');
      node.className="translate_api_in_progress translatejs-text-element-hidden keep";
      translate.progress.api.removeUITipByElements([node]);
      return node.classList.contains('keep') && !node.classList.contains('translate_api_in_progress') && !node.classList.contains('translatejs-text-element-hidden');
    }
  },
  {
    remark: "移除提示类并保留正常类：keep",
    test: function () {
      const node=document.createElement('div');
      node.className="keep";
      translate.progress.api.removeUITipByElements([node]);
      return node.classList.contains('keep') && !node.classList.contains('translate_api_in_progress') && !node.classList.contains('translatejs-text-element-hidden');
    }
  },
  {
    remark: "集合中无效项不影响后续有效元素",
    test: function () {
      const node=document.createElement('div');
      node.className='keep translate_api_in_progress';
      translate.progress.api.removeUITipByElements([null,undefined,document.createTextNode('x'),node]);
      return node.classList.contains('keep') && !node.classList.contains('translate_api_in_progress');
    }
  },
  {
    remark: "多个元素分别清理且不递归删除未指定后代",
    test: function () {
      const a=document.createElement('div');
      const b=document.createElement('div');
      a.innerHTML='<span class="translate_api_in_progress"></span>';
      a.className=b.className='translate_api_in_progress keep';
      translate.progress.api.removeUITipByElements([a,b]);
      return !a.classList.contains('translate_api_in_progress') && !b.classList.contains('translate_api_in_progress') && a.firstChild.classList.contains('translate_api_in_progress');
    }
  }
]);
