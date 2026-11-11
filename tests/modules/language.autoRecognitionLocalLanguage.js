'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '已经指定本地语种时不重新识别页面',
    test: function () {
      translate.language.local = 'korean';
      document.body.textContent = 'Hello world';
      return translate.language.autoRecognitionLocalLanguage() === 'korean' && translate.language.local === 'korean';
    }
  },
  {
    remark: '未设置语种时识别整页英文并保存',
    test: function () {
      translate.language.local = '';
      document.body.textContent = 'Hello world';
      // 保留整页识别路径，同时移除夹具标题，确保语种由本用例的正文决定。
      document.head.querySelectorAll('title').forEach(node => node.remove());
      return translate.language.autoRecognitionLocalLanguage() === 'english' && translate.language.local === 'english';
    }
  },
  {
    remark: '未设置语种时识别整页日文假名并保存',
    test: function () {
      translate.language.local = '';
      document.body.textContent = 'こんにちは';
      document.head.querySelectorAll('title').forEach(node => node.remove());
      return translate.language.autoRecognitionLocalLanguage() === 'japanese' && translate.language.local === 'japanese';
    }
  },
  {
    remark: '未设置语种时只根据指定翻译区域识别',
    test: function () {
      translate.language.local = '';
      document.body.innerHTML = '<p id="target">안녕하세요</p><div>Hello world English outside</div>';
      translate.documents = [document.querySelector('#target')];
      return translate.language.autoRecognitionLocalLanguage() === 'korean';
    }
  }
]);
