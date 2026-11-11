'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "保持原列表",
    test: function () {
      const list=[{id:'english',name:'English'},{id:'spanish',name:'Español'},{id:'chinese_simplified',name:'简体中文'}];
      translate.selectLanguageTag.languages="";
      const result=translate.selectLanguageTag.customLanguagesHandle(list);
      return JSON.stringify(result.map(item=>item.id))==="[\"english\",\"spanish\",\"chinese_simplified\"]" && list.length===3;
    }
  },
  {
    remark: "按配置顺序",
    test: function () {
      const list=[{id:'english',name:'English'},{id:'spanish',name:'Español'},{id:'chinese_simplified',name:'简体中文'}];
      translate.selectLanguageTag.languages="spanish,english";
      const result=translate.selectLanguageTag.customLanguagesHandle(list);
      return JSON.stringify(result.map(item=>item.id))==="[\"spanish\",\"english\"]" && list.length===3;
    }
  },
  {
    remark: "转小写匹配",
    test: function () {
      const list=[{id:'english',name:'English'},{id:'spanish',name:'Español'},{id:'chinese_simplified',name:'简体中文'}];
      translate.selectLanguageTag.languages="ENGLISH,SPANISH";
      const result=translate.selectLanguageTag.customLanguagesHandle(list);
      return JSON.stringify(result.map(item=>item.id))==="[\"english\",\"spanish\"]" && list.length===3;
    }
  },
  {
    remark: "忽略未知语种",
    test: function () {
      const list=[{id:'english',name:'English'},{id:'spanish',name:'Español'},{id:'chinese_simplified',name:'简体中文'}];
      translate.selectLanguageTag.languages="unknown,english";
      const result=translate.selectLanguageTag.customLanguagesHandle(list);
      return JSON.stringify(result.map(item=>item.id))==="[\"english\"]" && list.length===3;
    }
  },
  {
    remark: "忽略空分隔项",
    test: function () {
      const list=[{id:'english',name:'English'},{id:'spanish',name:'Español'},{id:'chinese_simplified',name:'简体中文'}];
      translate.selectLanguageTag.languages=",english,,spanish,";
      const result=translate.selectLanguageTag.customLanguagesHandle(list);
      return JSON.stringify(result.map(item=>item.id))==="[\"english\",\"spanish\"]" && list.length===3;
    }
  },
  {
    remark: "全部未知返回空表",
    test: function () {
      const list=[{id:'english',name:'English'},{id:'spanish',name:'Español'},{id:'chinese_simplified',name:'简体中文'}];
      translate.selectLanguageTag.languages="missing";
      const result=translate.selectLanguageTag.customLanguagesHandle(list);
      return JSON.stringify(result.map(item=>item.id))==="[]" && list.length===3;
    }
  },
  {
    remark: "单语种",
    test: function () {
      const list=[{id:'english',name:'English'},{id:'spanish',name:'Español'},{id:'chinese_simplified',name:'简体中文'}];
      translate.selectLanguageTag.languages="chinese_simplified";
      const result=translate.selectLanguageTag.customLanguagesHandle(list);
      return JSON.stringify(result.map(item=>item.id))==="[\"chinese_simplified\"]" && list.length===3;
    }
  },
  {
    remark: "没有过滤配置时保留原数组引用",
    test: function () {
      translate.selectLanguageTag.languages='';
      const list=[];
      return translate.selectLanguageTag.customLanguagesHandle(list)===list;
    }
  },
  {
    remark: "过滤后的元素保留原对象引用",
    test: function () {
      translate.selectLanguageTag.languages='english';
      const item={id:'english',name:'English'};
      return translate.selectLanguageTag.customLanguagesHandle([item])[0]===item;
    }
  },
  {
    remark: "新支持列表传入后不能继续返回已移除语种的旧缓存",
    test: function () {
      translate.selectLanguageTag.languages='english';
      translate.selectLanguageTag.customLanguagesHandle([{id:'english',name:'Old'}]);
      const result=translate.selectLanguageTag.customLanguagesHandle([{id:'spanish',name:'Español'}]);
      return result.length===0;
    }
  }
]);
