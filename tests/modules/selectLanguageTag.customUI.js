'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "选中目标语种",
    test: function () {
      document.body.innerHTML='<div id="translate"></div>';
      translate.language.local='chinese_simplified';
      translate.to="spanish";
      translate.storage.set('to', 'spanish');
      translate.selectLanguageTag.customUI([{id:'english',name:'English'},{id:'spanish',name:'Español'},{id:'chinese_simplified',name:'简体中文'}]);
      const select=document.querySelector('select');
      return select.id==='translateSelectLanguage' && select.className==='translateSelectLanguage' && select.value==="spanish" && select.options.length===3;
    }
  },
  {
    remark: "未设置目标选中本地语种",
    test: function () {
      document.body.innerHTML='<div id="translate"></div>';
      translate.language.local='chinese_simplified';
      translate.to="";
      translate.selectLanguageTag.customUI([{id:'english',name:'English'},{id:'spanish',name:'Español'},{id:'chinese_simplified',name:'简体中文'}]);
      const select=document.querySelector('select');
      return select.id==='translateSelectLanguage' && select.className==='translateSelectLanguage' && select.value==="chinese_simplified" && select.options.length===3;
    }
  },
  {
    remark: "自定义容器ID用于选择框ID和类名",
    test: function () {
      document.body.innerHTML='<div id="custom"></div>';
      translate.selectLanguageTag.documentId='custom';
      translate.selectLanguageTag.customUI([]);
      const select=document.querySelector('select');
      return select.id==='customSelectLanguage' && select.className==='customSelectLanguage' && select.options.length===0;
    }
  },
  {
    remark: "语种名称包含HTML符号时仅作为文本显示",
    test: function () {
      document.body.innerHTML='<div id="translate"></div>';
      translate.selectLanguageTag.customUI([{id:'english',name:'<b>English & 中文</b>'}]);
      return document.querySelector('option').textContent==='<b>English & 中文</b>' && document.querySelector('option b')===null;
    }
  },
  {
    remark: "过滤缺少名称或合法ID的无效语种项",
    test: function () {
      document.body.innerHTML='<div id="translate"></div>';
      translate.selectLanguageTag.customUI([null,{id:'english'}, {id:1,name:'bad'}, {id:'spanish',name:'Español'}]);
      return document.querySelectorAll('option').length===1 && document.querySelector('option').value==='spanish';
    }
  },
  {
    remark: "真实change事件调用现有选择回调",
    test: function () {
      document.body.innerHTML='<div id="translate"></div>';
      let language;
      translate.changeLanguage=value=>{language=value;};
      translate.selectLanguageTag.customUI([{id:'english',name:'English'},{id:'spanish',name:'Español'}]);
      const select=document.querySelector('select');
      select.value='spanish';
      select.dispatchEvent(new Event('change'));
      return language==='spanish';
    }
  }
]);
