'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "选择事件将值 english 原样传给语种切换入口",
    test: function () {
      const values=[];
      translate.changeLanguage=value=>values.push(value);
      const result=translate.selectLanguageTag.selectOnChange({target:{value:"english"}});
      return result===undefined && values.length===1 && values[0]==="english";
    }
  },
  {
    remark: "选择事件将值 chinese_simplified 原样传给语种切换入口",
    test: function () {
      const values=[];
      translate.changeLanguage=value=>values.push(value);
      const result=translate.selectLanguageTag.selectOnChange({target:{value:"chinese_simplified"}});
      return result===undefined && values.length===1 && values[0]==="chinese_simplified";
    }
  },
  {
    remark: "选择事件将值 spanish 原样传给语种切换入口",
    test: function () {
      const values=[];
      translate.changeLanguage=value=>values.push(value);
      const result=translate.selectLanguageTag.selectOnChange({target:{value:"spanish"}});
      return result===undefined && values.length===1 && values[0]==="spanish";
    }
  },
  {
    remark: "选择事件将值  原样传给语种切换入口",
    test: function () {
      const values=[];
      translate.changeLanguage=value=>values.push(value);
      const result=translate.selectLanguageTag.selectOnChange({target:{value:""}});
      return result===undefined && values.length===1 && values[0]==="";
    }
  },
  {
    remark: "选择事件将值 UPPER 原样传给语种切换入口",
    test: function () {
      const values=[];
      translate.changeLanguage=value=>values.push(value);
      const result=translate.selectLanguageTag.selectOnChange({target:{value:"UPPER"}});
      return result===undefined && values.length===1 && values[0]==="UPPER";
    }
  }
]);
