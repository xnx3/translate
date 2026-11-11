// 每个开关输入独立报告；仅将输入字面量写入函数，避免浏览器执行依赖闭包。
const disabledCases = ['false', 'null', 'undefined', '0', '1', '"true"', '{}', '[]'].map(function (value) {
  return { remark: '开关为 ' + value + ' 时不视为已启用', test: new Function(`
    translate.whole.context.is_use = ${value};
    return translate.whole.context.isUse() === false;
  `) };
});

require('../helpers/module')(__filename, [
  { remark: '初始状态没有主动启用时返回 false', args: [], expected: false },
  { remark: '严格布尔 true 表示已启用', test: function () {
    translate.whole.context.is_use = true;
    return translate.whole.context.isUse() === true;
  } },
  ...disabledCases
]);
