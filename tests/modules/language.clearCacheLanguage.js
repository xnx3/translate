'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '清空当前目标语种及目标语种缓存',
    test: function () {
      translate.to = 'english';
      translate.storage.set('to', 'english');
      translate.language.clearCacheLanguage();
      return translate.to === '' && translate.storage.get('to') === '';
    }
  },
  {
    remark: '没有目标语种时重复清理仍保持为空',
    test: function () {
      translate.language.clearCacheLanguage();
      translate.language.clearCacheLanguage();
      return translate.to === '' && translate.storage.get('to') === '';
    }
  },
  {
    remark: '清理目标缓存不修改本地语种和默认语种',
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.language.defaultTo = 'english';
      translate.language.clearCacheLanguage();
      return translate.language.local === 'chinese_simplified' && translate.language.defaultTo === 'english';
    }
  },
  {
    remark: '清理目标缓存保留无关的用户存储项',
    test: function () {
      translate.storage.set('module-unrelated', 'keep');
      translate.language.clearCacheLanguage();
      return translate.storage.get('module-unrelated') === 'keep';
    }
  },
  {
    remark: '已启用 URL 语种控制时仍会清空目标缓存',
    test: function () {
      translate.language.setUrlParamControl_use = true;
      translate.to = 'english';
      translate.storage.set('to', 'english');
      translate.language.clearCacheLanguage();
      return translate.to === '' && translate.storage.get('to') === '';
    }
  }
]);
