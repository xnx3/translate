'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "日志原样传递普通字符串并保持参数引用",
    test: function () {
      const value = 'hello';
      const original = console.log;
      let observed;
      let count = 0;
      console.log = item => { observed = item; count++; };
      try {
        const result = translate.log(value);
        return result === undefined && observed === value && count === 1;
      } finally { console.log = original; }
    }
  },
  {
    remark: "日志原样传递空字符串并保持参数引用",
    test: function () {
      const value = '';
      const original = console.log;
      let observed;
      let count = 0;
      console.log = item => { observed = item; count++; };
      try {
        const result = translate.log(value);
        return result === undefined && observed === value && count === 1;
      } finally { console.log = original; }
    }
  },
  {
    remark: "日志原样传递换行及Unicode并保持参数引用",
    test: function () {
      const value = ' 中文😀\n ';
      const original = console.log;
      let observed;
      let count = 0;
      console.log = item => { observed = item; count++; };
      try {
        const result = translate.log(value);
        return result === undefined && observed === value && count === 1;
      } finally { console.log = original; }
    }
  },
  {
    remark: "日志原样传递数字零并保持参数引用",
    test: function () {
      const value = 0;
      const original = console.log;
      let observed;
      let count = 0;
      console.log = item => { observed = item; count++; };
      try {
        const result = translate.log(value);
        return result === undefined && observed === value && count === 1;
      } finally { console.log = original; }
    }
  },
  {
    remark: "日志原样传递负数并保持参数引用",
    test: function () {
      const value = -12;
      const original = console.log;
      let observed;
      let count = 0;
      console.log = item => { observed = item; count++; };
      try {
        const result = translate.log(value);
        return result === undefined && observed === value && count === 1;
      } finally { console.log = original; }
    }
  },
  {
    remark: "日志原样传递布尔false并保持参数引用",
    test: function () {
      const value = false;
      const original = console.log;
      let observed;
      let count = 0;
      console.log = item => { observed = item; count++; };
      try {
        const result = translate.log(value);
        return result === undefined && observed === value && count === 1;
      } finally { console.log = original; }
    }
  },
  {
    remark: "日志原样传递null并保持参数引用",
    test: function () {
      const value = null;
      const original = console.log;
      let observed;
      let count = 0;
      console.log = item => { observed = item; count++; };
      try {
        const result = translate.log(value);
        return result === undefined && observed === value && count === 1;
      } finally { console.log = original; }
    }
  },
  {
    remark: "日志原样传递undefined并保持参数引用",
    test: function () {
      const value = undefined;
      const original = console.log;
      let observed;
      let count = 0;
      console.log = item => { observed = item; count++; };
      try {
        const result = translate.log(value);
        return result === undefined && observed === value && count === 1;
      } finally { console.log = original; }
    }
  },
  {
    remark: "日志原样传递数组并保持参数引用",
    test: function () {
      const value = [1, 2];
      const original = console.log;
      let observed;
      let count = 0;
      console.log = item => { observed = item; count++; };
      try {
        const result = translate.log(value);
        return result === undefined && observed === value && count === 1;
      } finally { console.log = original; }
    }
  },
  {
    remark: "日志原样传递对象并保持参数引用",
    test: function () {
      const value = {value: 'original'};
      const original = console.log;
      let observed;
      let count = 0;
      console.log = item => { observed = item; count++; };
      try {
        const result = translate.log(value);
        return result === undefined && observed === value && count === 1;
      } finally { console.log = original; }
    }
  },
  {
    remark: "省略日志参数时向控制台传递 undefined",
    test: function () {
      const original = console.log;
      let observed = 1;
      console.log = item => { observed = item; };
      try { translate.log(); return observed === undefined; } finally { console.log = original; }
    }
  }
]);
