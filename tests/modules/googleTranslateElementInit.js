'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "没有容器时将正确目标传入Google组件",
    test: function () {
      let observed;
      window.google = {translate:{TranslateElement:function(config,id){observed={config,id};this.marker=true;}}};
      translate.selectLanguageTag.languages = 'en,ja';
      translate.googleTranslateElementInit();
      return observed.id === "" && observed.config.pageLanguage === 'zh-CN' && observed.config.includedLanguages === 'en,ja' && observed.config.layout === 0 && translate.translate.marker === true;
    }
  },
  {
    remark: "存在容器时将正确目标传入Google组件",
    test: function () {
      document.body.innerHTML = '<div id="translate"></div>';
      let observed;
      window.google = {translate:{TranslateElement:function(config,id){observed={config,id};this.marker=true;}}};
      translate.selectLanguageTag.languages = 'en,ja';
      translate.googleTranslateElementInit();
      return observed.id === "translate" && observed.config.pageLanguage === 'zh-CN' && observed.config.includedLanguages === 'en,ja' && observed.config.layout === 0 && translate.translate.marker === true;
    }
  },
  {
    remark: "每次初始化使用当前配置并更新组件引用",
    test: function () {
      const values=[];
      window.google={translate:{TranslateElement:function(config){values.push(config.includedLanguages);}}};
      translate.selectLanguageTag.languages='en';
      translate.googleTranslateElementInit();
      const first=translate.translate;
      translate.selectLanguageTag.languages='ja';
      translate.googleTranslateElementInit();
      return first!==translate.translate && values.join(',')==='en,ja';
    }
  }
]);
