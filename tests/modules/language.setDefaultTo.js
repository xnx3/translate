'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '首次设置英文时同时设置默认语种、目标语种和缓存',
    test: function () {
      translate.storage.set('to', '');
      translate.language.setDefaultTo('english');
      return translate.language.defaultTo === 'english' && translate.to === 'english' && translate.storage.get('to') === 'english';
    }
  },
  {
    remark: '首次设置日语时保存日语标识',
    test: function () {
      translate.storage.set('to', '');
      translate.language.setDefaultTo('japanese');
      return translate.language.defaultTo === 'japanese' && translate.to === 'japanese' && translate.storage.get('to') === 'japanese';
    }
  },
  {
    remark: '用户已经选择韩语时新默认语种不覆盖用户缓存',
    test: function () {
      translate.storage.set('to', 'korean');
      translate.to = 'korean';
      translate.language.setDefaultTo('english');
      return translate.language.defaultTo === 'english' && translate.to === 'korean' && translate.storage.get('to') === 'korean';
    }
  },
  {
    remark: '重复设置相同默认语种保持一致',
    test: function () {
      translate.storage.set('to', '');
      translate.language.setDefaultTo('english');
      translate.language.setDefaultTo('english');
      return translate.language.defaultTo === 'english' && translate.to === 'english' && translate.storage.get('to') === 'english';
    }
  },
  {
    remark: '修改默认值后仍保留已经产生的首次目标选择',
    test: function () {
      translate.storage.set('to', '');
      translate.language.setDefaultTo('english');
      translate.language.setDefaultTo('french');
      return translate.language.defaultTo === 'french' && translate.storage.get('to') === 'english' && translate.to === 'english';
    }
  }
]);
