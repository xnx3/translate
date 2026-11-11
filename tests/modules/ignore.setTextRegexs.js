'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "空正则数组不改变已有配置",
    test: function () {
      const before = translate.ignore.textRegex.length;
      const result = translate.ignore.setTextRegexs([]);
      return result === undefined && translate.ignore.textRegex.length === before;
    }
  },
  {
    remark: "单个正则对象追加到列表并保留标志",
    test: function () {
      const regex = /请求/gu;
      translate.ignore.setTextRegexs([regex]);
      return translate.ignore.textRegex.length === 1 && translate.ignore.textRegex[0] === regex &&
        translate.ignore.textRegex[0].flags === 'gu';
    }
  },
  {
    remark: "多个正则保持输入顺序",
    test: function () {
      const first = /one/i;
      const second = /^two$/m;
      translate.ignore.setTextRegexs([first, second]);
      return translate.ignore.textRegex.length === 2 && translate.ignore.textRegex[0] === first &&
        translate.ignore.textRegex[1] === second;
    }
  },
  {
    remark: "连续追加保留已有正则，不覆盖前一次配置",
    test: function () {
      const first = /first/;
      const second = /second/;
      translate.ignore.setTextRegexs([first]);
      translate.ignore.setTextRegexs([second]);
      return translate.ignore.textRegex.length === 2 && translate.ignore.textRegex[0] === first &&
        translate.ignore.textRegex[1] === second;
    }
  },
  {
    remark: "不会修改调用方传入的数组",
    test: function () {
      const regex = /input/;
      const input = [regex];
      translate.ignore.setTextRegexs(input);
      return input.length === 1 && input[0] === regex && translate.ignore.textRegex !== input;
    }
  },
  {
    remark: "省略参数 不是数组时抛出约定异常且不改变已有配置",
    test: function () {
      const existing = /existing/;
      translate.ignore.textRegex = [existing];
      try {
        translate.ignore.setTextRegexs();
        return false;
      } catch (error) {
        return error instanceof Error && error.message === '参数必须为数组' &&
          translate.ignore.textRegex.length === 1 && translate.ignore.textRegex[0] === existing;
      }
    }
  },
  {
    remark: "undefined 不是数组时抛出约定异常且不改变已有配置",
    test: function () {
      const existing = /existing/;
      translate.ignore.textRegex = [existing];
      try {
        translate.ignore.setTextRegexs(undefined);
        return false;
      } catch (error) {
        return error instanceof Error && error.message === '参数必须为数组' &&
          translate.ignore.textRegex.length === 1 && translate.ignore.textRegex[0] === existing;
      }
    }
  },
  {
    remark: "null 不是数组时抛出约定异常且不改变已有配置",
    test: function () {
      const existing = /existing/;
      translate.ignore.textRegex = [existing];
      try {
        translate.ignore.setTextRegexs(null);
        return false;
      } catch (error) {
        return error instanceof Error && error.message === '参数必须为数组' &&
          translate.ignore.textRegex.length === 1 && translate.ignore.textRegex[0] === existing;
      }
    }
  },
  {
    remark: "字符串 不是数组时抛出约定异常且不改变已有配置",
    test: function () {
      const existing = /existing/;
      translate.ignore.textRegex = [existing];
      try {
        translate.ignore.setTextRegexs('text');
        return false;
      } catch (error) {
        return error instanceof Error && error.message === '参数必须为数组' &&
          translate.ignore.textRegex.length === 1 && translate.ignore.textRegex[0] === existing;
      }
    }
  },
  {
    remark: "普通对象 不是数组时抛出约定异常且不改变已有配置",
    test: function () {
      const existing = /existing/;
      translate.ignore.textRegex = [existing];
      try {
        translate.ignore.setTextRegexs({});
        return false;
      } catch (error) {
        return error instanceof Error && error.message === '参数必须为数组' &&
          translate.ignore.textRegex.length === 1 && translate.ignore.textRegex[0] === existing;
      }
    }
  },
  {
    remark: "单独正则 不是数组时抛出约定异常且不改变已有配置",
    test: function () {
      const existing = /existing/;
      translate.ignore.textRegex = [existing];
      try {
        translate.ignore.setTextRegexs(/one/);
        return false;
      } catch (error) {
        return error instanceof Error && error.message === '参数必须为数组' &&
          translate.ignore.textRegex.length === 1 && translate.ignore.textRegex[0] === existing;
      }
    }
  },
  {
    remark: "数字 不是数组时抛出约定异常且不改变已有配置",
    test: function () {
      const existing = /existing/;
      translate.ignore.textRegex = [existing];
      try {
        translate.ignore.setTextRegexs(0);
        return false;
      } catch (error) {
        return error instanceof Error && error.message === '参数必须为数组' &&
          translate.ignore.textRegex.length === 1 && translate.ignore.textRegex[0] === existing;
      }
    }
  },
  {
    remark: "布尔值 不是数组时抛出约定异常且不改变已有配置",
    test: function () {
      const existing = /existing/;
      translate.ignore.textRegex = [existing];
      try {
        translate.ignore.setTextRegexs(false);
        return false;
      } catch (error) {
        return error instanceof Error && error.message === '参数必须为数组' &&
          translate.ignore.textRegex.length === 1 && translate.ignore.textRegex[0] === existing;
      }
    }
  },
  {
    remark: "数组首项为字符串时拒绝并指出第0项",
    test: function () {
      try {
        translate.ignore.setTextRegexs(['text']);
        return false;
      } catch (error) {
        return error instanceof Error && error.message === '第0项不是RegExp对象';
      }
    }
  },
  {
    remark: "数组首项为null时拒绝并指出第0项",
    test: function () {
      try {
        translate.ignore.setTextRegexs([null]);
        return false;
      } catch (error) {
        return error instanceof Error && error.message === '第0项不是RegExp对象';
      }
    }
  },
  {
    remark: "数组首项为undefined时拒绝并指出第0项",
    test: function () {
      try {
        translate.ignore.setTextRegexs([undefined]);
        return false;
      } catch (error) {
        return error instanceof Error && error.message === '第0项不是RegExp对象';
      }
    }
  },
  {
    remark: "数组首项为数字时拒绝并指出第0项",
    test: function () {
      try {
        translate.ignore.setTextRegexs([0]);
        return false;
      } catch (error) {
        return error instanceof Error && error.message === '第0项不是RegExp对象';
      }
    }
  },
  {
    remark: "数组首项为对象时拒绝并指出第0项",
    test: function () {
      try {
        translate.ignore.setTextRegexs([{}]);
        return false;
      } catch (error) {
        return error instanceof Error && error.message === '第0项不是RegExp对象';
      }
    }
  },
  {
    remark: "数组首项为函数时拒绝并指出第0项",
    test: function () {
      try {
        translate.ignore.setTextRegexs([function () {}]);
        return false;
      } catch (error) {
        return error instanceof Error && error.message === '第0项不是RegExp对象';
      }
    }
  },
  {
    remark: "后续项校验失败时不追加先前通过校验的项",
    test: function () {
      const existing = /existing/;
      translate.ignore.textRegex = [existing];
      try {
        translate.ignore.setTextRegexs([/valid/, null]);
        return false;
      } catch (error) {
        return error.message === '第1项不是RegExp对象' && translate.ignore.textRegex.length === 1 &&
          translate.ignore.textRegex[0] === existing;
      }
    }
  }
]);
