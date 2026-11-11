'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '已经指定简体中文时直接返回该语种',
    test: function () {
      translate.language.local = 'chinese_simplified';
      return translate.language.getLocal() === 'chinese_simplified';
    }
  },
  {
    remark: '已经指定英文时不被页面中文覆盖',
    test: function () {
      translate.language.local = 'english';
      document.body.textContent = '这是中文页面';
      return translate.language.getLocal() === 'english';
    }
  },
  {
    remark: '未设置本地语种时识别页面英文文本',
    test: function () {
      translate.language.local = '';
      document.body.textContent = 'Hello world';
      // 明确识别正文，避免测试夹具中英文 title 影响语种占比。
      translate.documents = [document.body];
      return translate.language.getLocal() === 'english';
    }
  },
  {
    remark: '本地语种为 null 时识别页面日文假名',
    test: function () {
      translate.language.local = null;
      document.body.textContent = 'こんにちは';
      translate.documents = [document.body];
      return translate.language.getLocal() === 'japanese';
    }
  },
  {
    remark: '连续读取保持已经识别的本地语种',
    test: function () {
      translate.language.local = '';
      document.body.textContent = '안녕하세요';
      translate.documents = [document.body];
      const first = translate.language.getLocal();
      document.body.textContent = 'Hello world';
      return first === 'korean' && translate.language.getLocal() === 'korean';
    }
  }
]);
