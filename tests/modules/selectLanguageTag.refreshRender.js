'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "不存在选择框也能刷新并允许重绘",
    test: function () {
      translate.selectLanguageTag.alreadyRender=true;
      let calls=0;
      let flag;
      translate.selectLanguageTag.render=()=>{calls++;flag=translate.selectLanguageTag.alreadyRender;};
      translate.selectLanguageTag.refreshRender();
      return calls===1 && flag===false && document.getElementById('translateSelectLanguage')===null;
    }
  },
  {
    remark: "已有选择框被删除并允许重绘",
    test: function () {
      document.body.innerHTML='<div><select id="translateSelectLanguage"></select></div>';
      translate.selectLanguageTag.alreadyRender=true;
      let calls=0;
      let flag;
      translate.selectLanguageTag.render=()=>{calls++;flag=translate.selectLanguageTag.alreadyRender;};
      translate.selectLanguageTag.refreshRender();
      return calls===1 && flag===false && document.getElementById('translateSelectLanguage')===null;
    }
  },
  {
    remark: "刷新只删除当前容器对应的选择框",
    test: function () {
      document.body.innerHTML='<div><select id="customSelectLanguage"></select><select id="otherSelectLanguage"></select></div>';
      translate.selectLanguageTag.documentId='custom';
      translate.selectLanguageTag.render=()=>{};
      translate.selectLanguageTag.refreshRender();
      return document.getElementById('customSelectLanguage')===null && document.getElementById('otherSelectLanguage')!==null;
    }
  },
  {
    remark: "真实重绘使用当前目标语种",
    test: function () {
      translate.language.local='chinese_simplified';
      translate.request.api.language=[{id:'english',name:'English'},{id:'spanish',name:'Español'}];
      translate.to='english';
      translate.storage.set('to', 'english');
      translate.selectLanguageTag.render();
      translate.to='spanish';
      translate.storage.set('to', 'spanish');
      translate.selectLanguageTag.refreshRender();
      return document.querySelectorAll('select').length===1 && document.querySelector('select').value==='spanish';
    }
  }
]);
