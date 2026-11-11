'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "嵌套元素标识包含完整祖先顺序",
    test: function () {
      const root=document.createElement('div');
      root.innerHTML='<section><span></span><span></span></section>';
      return nodeuuid.uuid(root.firstChild.lastChild)==='SECTION1_SPAN2';
    }
  },
  {
    remark: "脱离父元素的根节点没有可定位的祖先路径，返回空字符串",
    test: function () {
      return nodeuuid.uuid(document.createElement('div'))==='';
    }
  },
  {
    remark: "同一节点重复读取得到相同标识",
    test: function () {
      const root=document.createElement('div');
      root.innerHTML='<p>text</p>';
      const node=root.firstChild.firstChild;
      return nodeuuid.uuid(node)===nodeuuid.uuid(node) && nodeuuid.uuid(node).endsWith('P1_#text1');
    }
  },
  {
    remark: "相同父级中不同同名节点具有不同标识",
    test: function () {
      const root=document.createElement('div');
      root.innerHTML='<span></span><span></span>';
      return nodeuuid.uuid(root.firstChild)!==nodeuuid.uuid(root.lastChild);
    }
  }
]);
