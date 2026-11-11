'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "同级div元素从1开始计数并区分同名兄弟",
    test: function () {
      const root=document.createElement("section");
      root.innerHTML="<div></div><b></b><div></div>";
      return nodeuuid.index(root.children[0])==="DIV1" && nodeuuid.index(root.children[2])==="DIV2";
    }
  },
  {
    remark: "同级span元素从1开始计数并区分同名兄弟",
    test: function () {
      const root=document.createElement("section");
      root.innerHTML="<span></span><b></b><span></span>";
      return nodeuuid.index(root.children[0])==="SPAN1" && nodeuuid.index(root.children[2])==="SPAN2";
    }
  },
  {
    remark: "同级p元素从1开始计数并区分同名兄弟",
    test: function () {
      const root=document.createElement("section");
      root.innerHTML="<p></p><b></b><p></p>";
      return nodeuuid.index(root.children[0])==="P1" && nodeuuid.index(root.children[2])==="P2";
    }
  },
  {
    remark: "父元素不存在时返回空标识",
    test: function () {
      return nodeuuid.index(document.createElement('div'))==='';
    }
  },
  {
    remark: "文本节点使用childNodes索引，保留其他类型节点位置",
    test: function () {
      const root=document.createElement('div');
      root.append('first',document.createElement('b'),'second');
      return nodeuuid.index(root.childNodes[0])==='#text1' && nodeuuid.index(root.childNodes[2])==='#text3';
    }
  },
  {
    remark: "插入同名兄弟后更新元素序号",
    test: function () {
      const root=document.createElement('div');
      root.innerHTML='<p></p><p></p>';
      const second=root.lastChild;
      root.prepend(document.createElement('p'));
      return nodeuuid.index(second)==='P3';
    }
  }
]);
