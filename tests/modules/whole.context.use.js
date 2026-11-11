require('../helpers/module')(__filename, [
  { remark: '启用行内上下文仅改变开关，不扫描、入队或请求', test: function () {
    var queue = translate.nodeQueue, calls = 0;
    translate.whole.context.is_use = false;
    translate.execute = function () { calls++; }; translate.request.post = function () { calls++; };
    translate.whole.context.use();
    return translate.whole.context.is_use === true && calls === 0 && translate.nodeQueue === queue;
  } },
  { remark: '重复调用保持启用状态，不隐式开启全页面整体翻译', test: function () {
    translate.whole.isEnableAll = false;
    translate.whole.context.use(); translate.whole.context.use();
    return translate.whole.context.isUse() === true && translate.whole.isEnableAll === false;
  } }
]);
