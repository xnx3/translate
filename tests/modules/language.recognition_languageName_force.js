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
  },
  {
    remark: '目标语种未登记语族时保留原识别结果',
    test: function () {
      translate.language.translateLocal = true;
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'custom-lang');
      const result = { languageName: 'english', languageArray: { english: {}, japanese: {} } };
      return translate.language.recognition_languageName_force(result) === 'english';
    }
  },
  {
    remark: '已登记的拉丁目标和未知本地语种不强制改变识别结果',
    test: function () {
      translate.language.translateLocal = true;
      translate.language.setLocal('custom-lang');
      translate.storage.set('to', 'english');
      const result = { languageName: 'english', languageArray: { english: {}, japanese: {} } };
      return translate.language.recognition_languageName_force(result) === 'english';
    }
  },
  {
    remark: '分类中未登记的语种不妨碍识别后面的已知非拉丁语种',
    test: function () {
      translate.language.translateLocal = true;
      translate.language.setLocal('chinese_simplified');
      translate.storage.set('to', 'english');
      const result = { languageName: 'english', languageArray: { unknown: {}, english: {}, chinese_simplified: {} } };
      return translate.language.recognition_languageName_force(result) === 'chinese_simplified' &&
        result.languageName === 'english' && Object.keys(result.languageArray).length === 3;
    }
  }
]);
