'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '未启用强制翻译时保持原识别结果',
    test: function () {
      translate.language.translateLocal = false;
      return translate.language.recognition_languageName_force({ languageName: 'english', languageArray: { english: {}, chinese_simplified: {} } }) === 'english';
    }
  },
  {
    remark: '拉丁目标下存在中文片段时强制以中文为待翻译语种',
    test: function () {
      translate.language.translateLocal = true;
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'english');
      return translate.language.recognition_languageName_force({ languageName: 'english', languageArray: { english: {}, chinese_simplified: {} } }) === 'chinese_simplified';
    }
  },
  {
    remark: '拉丁目标下只有拉丁片段时保持原识别结果',
    test: function () {
      translate.language.translateLocal = true;
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'english');
      return translate.language.recognition_languageName_force({ languageName: 'english', languageArray: { english: {}, french: {} } }) === 'english';
    }
  },
  {
    remark: '目标不属于拉丁体系时保持原识别结果',
    test: function () {
      translate.language.translateLocal = true;
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'japanese');
      return translate.language.recognition_languageName_force({ languageName: 'english', languageArray: { english: {}, chinese_simplified: {} } }) === 'english';
    }
  },
  {
    remark: '忽略分类对象原型上继承的语种',
    test: function () {
      translate.language.translateLocal = true;
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'english');
      const languages = Object.create({ chinese_simplified: {} });
      languages.english = {};
      return translate.language.recognition_languageName_force({ languageName: 'english', languageArray: languages }) === 'english';
    }
  }
]);
