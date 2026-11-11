require('../helpers/module')(__filename, [
  { remark: '开启全页面整体翻译开关，后续未配置选择器的元素也可命中', test: function () {
    translate.whole.isEnableAll = false; translate.whole.class = []; translate.whole.tag = []; translate.whole.id = [];
    var element = document.createElement('p'), before = translate.whole.isWhole(element);
    translate.whole.enableAll();
    return before === false && translate.whole.isEnableAll === true && translate.whole.isWhole(element) === true;
  } },
  { remark: '重复启用不改变已有 class、tag 和 id 配置', test: function () {
    var classes = ['article'], tags = ['p'], ids = ['main'];
    translate.whole.class = classes; translate.whole.tag = tags; translate.whole.id = ids;
    translate.whole.enableAll(); translate.whole.enableAll();
    return translate.whole.isEnableAll === true && translate.whole.class === classes && translate.whole.tag === tags && translate.whole.id === ids;
  } }
]);
