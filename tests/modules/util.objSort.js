'use strict';

require('../helpers/module')(__filename, [
  { remark: '空对象排序后没有元素', args: [{}], expected: [] },
  {
    remark: '字符串键按长度从长到短排列并保留各自的值',
    test: function () {
      const result = translate.util.objSort({ a: '短', abcd: '长', abc: '中' });
      return Object.keys(result).join(',') === 'abcd,abc,a' && result.abcd === '长' && result.abc === '中' && result.a === '短';
    }
  },
  {
    remark: '相同长度的键保持各自的值而不会被覆盖',
    test: function () {
      const result = translate.util.objSort({ ab: 1, cd: 2, e: 3 });
      return Object.keys(result).slice(0, 2).sort().join(',') === 'ab,cd' && result.ab === 1 && result.cd === 2 && result.e === 3;
    }
  },
  {
    remark: '中文键按照字符长度排列',
    test: function () {
      const result = translate.util.objSort({ 你: 1, 你好世界: 2, 你好: 3 });
      return Object.keys(result).join(',') === '你好世界,你好,你';
    }
  },
  {
    remark: '空字符串键和普通键的值都保留',
    test: function () {
      const result = translate.util.objSort({ '': false, abc: null });
      return Object.keys(result).join(',') === 'abc,' && result[''] === false && result.abc === null;
    }
  },
  {
    remark: '排序不会删除或改变输入对象的键值',
    test: function () {
      const input = { a: '短', abc: '长' };
      translate.util.objSort(input);
      return Object.keys(input).join(',') === 'a,abc' && input.a === '短' && input.abc === '长';
    }
  }
]);
