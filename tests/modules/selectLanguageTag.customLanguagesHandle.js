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
  },
  {
    remark: '非对象、缺少 id 和非字符串 id 的条目不会改变有效项的次序',
    test: function () {
      const en = Object.freeze({ id: 'english', name: 'English' });
      const ja = Object.freeze({ id: 'japanese', name: '日本語' });
      const list = Object.freeze([null, false, {}, { id: 0 }, en, undefined, ja]);
      translate.selectLanguageTag.languages = 'JAPANESE,unknown,english';
      const result = translate.selectLanguageTag.customLanguagesHandle(list);
      return result.length === 2 && result[0] === ja && result[1] === en;
    }
  },
  {
    remark: '切换服务后相同语种使用新列表的名称与 serviceId',
    test: function () {
      translate.selectLanguageTag.languages = 'english';
      const first = { id: 'english', name: '英文', serviceId: 'en' };
      const second = { id: 'english', name: 'English', serviceId: 'en-US' };
      translate.selectLanguageTag.customLanguagesHandle([first]);
      const result = translate.selectLanguageTag.customLanguagesHandle([second]);
      return result.length === 1 && result[0] === second;
    }
  },
  {
    remark: '第一次没有支持语种，稍后收到非空列表时能显示新语种',
    test: function () {
      translate.selectLanguageTag.languages = 'japanese';
      const lang = { id: 'japanese', name: '日本語' };
      const empty = translate.selectLanguageTag.customLanguagesHandle([]);
      const ready = translate.selectLanguageTag.customLanguagesHandle([lang]);
      return empty.length === 0 && ready.length === 1 && ready[0] === lang;
    }
  }
]);
