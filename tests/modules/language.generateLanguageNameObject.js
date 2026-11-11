'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '生成语言表包含英语和法语的拉丁体系',
    test: function () {
      const result = translate.language.generateLanguageNameObject();
      return result instanceof Map && result.get('english').system === 'latin' && result.get('french').system === 'latin';
    }
  },
  {
    remark: '简繁中文、日语和韩语映射到汉字体系',
    test: function () {
      const result = translate.language.generateLanguageNameObject();
      return ['chinese_simplified', 'chinese_traditional', 'japanese', 'korean'].every(language => result.get(language).system === 'chinese');
    }
  },
  {
    remark: '空的语言体系配置生成空 Map',
    test: function () {
      translate.language.systems = {};
      return translate.language.generateLanguageNameObject().size === 0;
    }
  },
  {
    remark: '自定义体系只收集自身属性，不遍历原型上的配置',
    test: function () {
      const systems = Object.create({ ignored: { languages: ['inherited'] } });
      systems.test = { languages: ['one', 'two'] };
      translate.language.systems = systems;
      const result = translate.language.generateLanguageNameObject();
      return result.size === 2 && result.get('one').system === 'test' && result.get('two').system === 'test' && !result.has('inherited');
    }
  },
  {
    remark: '生成结果不会修改传入体系的语言列表',
    test: function () {
      translate.language.systems = { test: { languages: ['one', 'two'] } };
      translate.language.generateLanguageNameObject();
      return translate.language.systems.test.languages.join(',') === 'one,two';
    }
  }
]);
