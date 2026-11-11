'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '省略参数名时读取默认 language 参数',
    test: function () {
      history.replaceState(null, '', '?language=english');
      translate.language.setUrlParamControl();
      return translate.language.setUrlParamControl_use === true && translate.language.setUrlParamControl_name === 'language' &&
        translate.to === 'english' && translate.storage.get('to') === 'english';
    }
  },
  {
    remark: '自定义参数名读取 lang 参数而不是 language',
    test: function () {
      history.replaceState(null, '', '?language=english&lang=japanese');
      translate.language.setUrlParamControl('lang');
      return translate.language.setUrlParamControl_name === 'lang' && translate.to === 'japanese' && translate.storage.get('to') === 'japanese';
    }
  },
  {
    remark: '空参数名回退到默认 language',
    test: function () {
      history.replaceState(null, '', '?language=korean');
      translate.language.setUrlParamControl('');
      return translate.language.setUrlParamControl_name === 'language' && translate.to === 'korean';
    }
  },
  {
    remark: '查询参数不存在时保留当前目标',
    test: function () {
      history.replaceState(null, '', '?other=english');
      translate.to = 'korean';
      translate.language.setUrlParamControl();
      return translate.to === 'korean';
    }
  },
  {
    remark: '查询参数为空时保留当前目标',
    test: function () {
      history.replaceState(null, '', '?language=');
      translate.to = 'korean';
      translate.language.setUrlParamControl();
      return translate.to === 'korean';
    }
  },
  {
    remark: '查询参数是字面量 null 时不作为语种',
    test: function () {
      history.replaceState(null, '', '?language=null');
      translate.to = 'korean';
      translate.language.setUrlParamControl();
      return translate.to === 'korean';
    }
  },
  {
    remark: '查询参数是字面量 undefined 时不作为语种',
    test: function () {
      history.replaceState(null, '', '?language=undefined');
      translate.to = 'korean';
      translate.language.setUrlParamControl();
      return translate.to === 'korean';
    }
  }
]);
