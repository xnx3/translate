'use strict';

function checkAttribute({ name, value, expected }) {
  const element = document.createElement('span');
  if (name) element.setAttribute(name, value);
  return translate.group._hasIgnoreAttribute(element) === expected;
}

require('../helpers/module')(__filename, [
  ['未设置属性时允许翻译', '', '', false],
  ['hidden 使用属性存在性判断', 'hidden', 'until-found', true],
  ['translate=no 忽略大小写', 'translate', 'NO', true],
  ['translate=yes 允许翻译', 'translate', 'yes', false],
  ['空白分隔的独立 notranslate 类阻止翻译', 'class', 'main\tnotranslate\nactive', true],
  ['类名中嵌有 notranslate 不会误判', 'class', 'partial-notranslate', false],
  ['参数组合：hidden 的字符串值 false 仍表示存在此布尔属性', 'hidden', 'false', true],
  ['参数组合：空 translate 属性允许正常翻译', 'translate', '', false],
  ['参数组合：class 大小写不同不会命中 notranslate 规则', 'class', 'NoTranslate', false]
].map(([remark, name, value, expected]) => ({ remark, input: { name, value, expected }, test: checkAttribute })));
