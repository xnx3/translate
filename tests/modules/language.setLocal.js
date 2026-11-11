'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '设置简体中文后保存语种并启用 v2',
    test: function () {
      translate.useVersion = 'v1';
      const result = translate.language.setLocal('chinese_simplified');
      return result === undefined && translate.language.local === 'chinese_simplified' && translate.useVersion === 'v2';
    }
  },
  {
    remark: '设置英文后可以通过本地语种入口读取',
    test: function () {
      translate.language.setLocal('english');
      return translate.language.local === 'english' && translate.language.getLocal() === 'english';
    }
  },
  {
    remark: '设置日语后保存完整的语种标识',
    test: function () {
      translate.language.setLocal('japanese');
      return translate.language.local === 'japanese';
    }
  },
  {
    remark: '连续设置语种时最后一次设置生效',
    test: function () {
      translate.language.setLocal('english');
      translate.language.setLocal('korean');
      return translate.language.local === 'korean';
    }
  },
  {
    remark: '重复设置相同语种不会改变目标翻译语种',
    test: function () {
      translate.to = 'japanese';
      translate.language.setLocal('english');
      translate.language.setLocal('english');
      return translate.language.local === 'english' && translate.to === 'japanese';
    }
  }
]);
