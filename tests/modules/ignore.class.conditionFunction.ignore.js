'use strict';

require('../helpers/module')(__filename, [
  { remark: '默认 ignore 条件无参数时返回 true', args: [], expected: true },
  { remark: '默认 ignore 条件不要求附加数据，null 输入也保持忽略', args: [null], expected: true },
  {
    remark: '带 ignore 类名的实际元素默认满足忽略条件',
    test: function () {
      const element = document.createElement('div');
      element.className = 'ignore';
      return translate.ignore.class.conditionFunction.ignore(element) === true;
    }
  }
]);
