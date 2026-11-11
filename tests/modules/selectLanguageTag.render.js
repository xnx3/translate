'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "隐藏配置不创建选择框或请求语言列表",
    test: function () {
      translate.selectLanguageTag.show=false;
      let calls=0;
      translate.request.post=()=>{calls++;};
      translate.selectLanguageTag.render();
      return calls===0 && document.querySelector('select')===null;
    }
  },
  {
    remark: "缓存语言列表时创建容器并渲染真实选项",
    test: function () {
      translate.request.api.language=[{id:'english',name:'English'},{id:'spanish',name:'Español'}];
      translate.selectLanguageTag.render();
      return document.getElementById('translate')!==null && document.querySelectorAll('option').length===2;
    }
  },
  {
    remark: "重复渲染不生成重复容器和选择框",
    test: function () {
      translate.request.api.language=[{id:'english',name:'English'}];
      translate.selectLanguageTag.render();
      translate.selectLanguageTag.render();
      return document.querySelectorAll('#translate').length===1 && document.querySelectorAll('select').length===1;
    }
  },
  {
    remark: "已有选择框时保留原节点",
    test: function () {
      document.body.innerHTML='<div id="translate"><select id="translateSelectLanguage"></select></div>';
      const select=document.querySelector('select');
      translate.selectLanguageTag.render();
      return document.querySelector('select')===select && document.querySelectorAll('select').length===1;
    }
  },
  {
    remark: "语言请求成功后缓存并按过滤顺序渲染",
    test: function () {
      translate.selectLanguageTag.languages='spanish,english';
      let calls=0;
      translate.request.post=(url,data,callback)=>{calls++;callback({result:1,list:[{id:'english',name:'English'},{id:'spanish',name:'Español'}]});};
      translate.selectLanguageTag.render();
      return calls===1 && Array.isArray(translate.request.api.language) && Array.from(document.querySelectorAll('option')).map(item=>item.value).join(',')==='spanish,english';
    }
  },
  {
    remark: "语言请求失败时不伪造可选语种",
    test: function () {
      translate.request.post=(url,data,callback)=>callback({result:0,info:'offline'});
      translate.selectLanguageTag.render();
      return document.querySelector('select')===null;
    }
  },
  {
    remark: "空语言数组仍生成空选择框",
    test: function () {
      translate.request.api.language=[];
      translate.selectLanguageTag.render();
      return document.querySelector('select')!==null && document.querySelectorAll('option').length===0;
    }
  }
]);
