'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '读取唯一的普通查询参数',
    test: function () {
      history.replaceState(null, '', '?language=english');
      return translate.util.getUrlParam('language') === 'english';
    }
  },
  {
    remark: '读取多个查询参数中的中间参数',
    test: function () {
      history.replaceState(null, '', '?a=1&lang=japanese&b=2');
      return translate.util.getUrlParam('lang') === 'japanese';
    }
  },
  {
    remark: '未提供的参数返回空字符串',
    test: function () {
      history.replaceState(null, '', '?other=english');
      return translate.util.getUrlParam('language') === '';
    }
  },
  {
    remark: '空参数值返回空字符串',
    test: function () {
      history.replaceState(null, '', '?language=');
      return translate.util.getUrlParam('language') === '';
    }
  },
  {
    remark: '查询参数名不能匹配另一个参数名的后缀',
    test: function () {
      history.replaceState(null, '', '?mylanguage=english');
      return translate.util.getUrlParam('language') === '';
    }
  },
  {
    remark: '参数值中的百分号编码能够解码',
    test: function () {
      history.replaceState(null, '', '?value=hello%20world');
      return translate.util.getUrlParam('value') === 'hello world';
    }
  },
  {
    remark: '同名参数重复时读取第一个值',
    test: function () {
      history.replaceState(null, '', '?language=english&language=japanese');
      return translate.util.getUrlParam('language') === 'english';
    }
  },
  {
    remark: '片段标识中的参数不作为查询参数读取',
    test: function () {
      history.replaceState(null, '', '#language=english');
      return translate.util.getUrlParam('language') === '';
    }
  }
]);
