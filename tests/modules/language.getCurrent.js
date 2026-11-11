'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '没有目标语种缓存时返回已设置的本地语种',
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.storage.set('to', '');
      return translate.language.getCurrent() === 'chinese_simplified';
    }
  },
  {
    remark: '已缓存英文目标时优先返回英文',
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.storage.set('to', 'english');
      return translate.language.getCurrent() === 'english';
    }
  },
  {
    remark: '缓存目标为日语时不被 translate.to 的其他值覆盖',
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.storage.set('to', 'japanese');
      translate.to = 'english';
      return translate.language.getCurrent() === 'japanese';
    }
  },
  {
    remark: '缓存目标清空后重新回到本地语种',
    test: function () {
      translate.language.local = 'korean';
      translate.storage.set('to', 'english');
      translate.storage.set('to', '');
      return translate.language.getCurrent() === 'korean';
    }
  },
  {
    remark: '缓存目标连续变更时读取最后一次语种',
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.storage.set('to', 'english');
      translate.storage.set('to', 'french');
      return translate.language.getCurrent() === 'french';
    }
  }
]);
