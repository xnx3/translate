'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '新增类名且省略条件时默认忽略该类名元素',
    test: function () {
      const result = translate.ignore.class.push('custom-ignore');
      const element = document.createElement('div');
      element.className = 'custom-ignore';
      return result === undefined && translate.ignore.class.data.includes('custom-ignore') &&
        translate.ignore.isIgnore(element) === true;
    }
  },
  {
    remark: '条件显式为 null 时仍默认忽略',
    test: function () {
      translate.ignore.class.push('custom-ignore', null);
      const element = document.createElement('div');
      element.className = 'custom-ignore';
      return translate.ignore.isIgnore(element) === true;
    }
  },
  {
    remark: '保存返回 true 的条件函数引用并用于忽略判断',
    test: function () {
      const condition = function () { return true; };
      translate.ignore.class.push('custom-ignore', condition);
      const element = document.createElement('div');
      element.className = 'custom-ignore';
      return translate.ignore.class.conditionFunction['custom-ignore'] === condition &&
        translate.ignore.isIgnore(element) === true;
    }
  },
  {
    remark: '条件返回 false 时同类名元素仍可翻译',
    test: function () {
      translate.ignore.class.push('custom-ignore', function () { return false; });
      const element = document.createElement('div');
      element.className = 'custom-ignore';
      return translate.ignore.isIgnore(element) === false;
    }
  },
  {
    remark: '同一类名重复追加不增加列表项，也不覆盖首次条件',
    test: function () {
      const first = function () { return true; };
      const second = function () { return false; };
      translate.ignore.class.push('custom-ignore', first);
      const before = translate.ignore.class.data.length;
      translate.ignore.class.push('custom-ignore', second);
      return translate.ignore.class.data.length === before &&
        translate.ignore.class.conditionFunction['custom-ignore'] === first;
    }
  },
  {
    remark: '错误类型的条件不登记为函数，类名仍按默认规则忽略',
    test: function () {
      translate.ignore.class.push('custom-ignore', 'not-function');
      const element = document.createElement('div');
      element.className = 'custom-ignore';
      return typeof translate.ignore.class.conditionFunction['custom-ignore'] !== 'function' &&
        translate.ignore.isIgnore(element) === true;
    }
  },
  {
    remark: '多个类名各自保存条件，互不覆盖',
    test: function () {
      const first = function () { return true; };
      const second = function () { return false; };
      translate.ignore.class.push('first-ignore', first);
      translate.ignore.class.push('second-ignore', second);
      return translate.ignore.class.conditionFunction['first-ignore'] === first &&
        translate.ignore.class.conditionFunction['second-ignore'] === second;
    }
  },
  {
    remark: '默认已存在的 ignore 类名不能被追加操作覆盖',
    test: function () {
      const first = translate.ignore.class.conditionFunction.ignore;
      const before = translate.ignore.class.data.length;
      translate.ignore.class.push('ignore', function () { return false; });
      return translate.ignore.class.data.length === before && translate.ignore.class.conditionFunction.ignore === first;
    }
  }
]);
