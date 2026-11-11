require('../helpers/module')(__filename, [
  { remark: '没有配置整体翻译选择器时不输出警告', test: function () {
    var calls = 0; translate.log = function () { calls++; }; translate.whole.class = []; translate.whole.id = []; translate.whole.tag = [];
    translate.whole.executeTip();
    return calls === 0;
  } },
  { remark: '配置任一选择器时提示整体翻译量风险', test: function () {
    var logs = []; translate.log = function (value) { logs.push(value); }; translate.whole.class = ['article'];
    translate.whole.executeTip();
    return logs.length === 1 && logs[0].indexOf('translate.whole') >= 0;
  } },
  { remark: '错误配置 html 时同时提示标签不生效，且不修改配置', test: function () {
    var logs = []; translate.log = function (value) { logs.push(value); }; translate.whole.tag = ['html'];
    translate.whole.executeTip();
    return logs.length === 2 && logs[1].indexOf('html') >= 0 && logs[1].indexOf('不生效') >= 0 && translate.whole.tag[0] === 'html';
  } }
]);
