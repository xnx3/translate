'use strict';

require('../helpers/module')(__filename, [
  { remark: '空数据库省略匹配参数返回空数组', args: [], expected: [] },
  { remark: '空数据库的空字符串匹配返回空数组', args: [''], expected: [] },
  { remark: '空数据库使用星号匹配返回空数组', args: ['*'], expected: [] },
  { remark: '空数据库查询不存在的具体键返回空数组', args: ['missing'], expected: [] },
  {
    remark: '具体键精确匹配且返回真实类型的值',
    test: async function () {
      await translate.storage.IndexedDB.set('user', 0);
      await translate.storage.IndexedDB.set('user2', 'other');
      const rows = await translate.storage.IndexedDB.list('user');
      return rows.length === 1 && rows[0].key === 'user' && rows[0].value === 0;
    }
  },
  {
    remark: '前缀星号匹配零个或多个字符',
    test: async function () {
      await translate.storage.IndexedDB.set('user', 'base');
      await translate.storage.IndexedDB.set('user001', 'child');
      await translate.storage.IndexedDB.set('other', 'excluded');
      const rows = await translate.storage.IndexedDB.list('user*');
      return rows.length === 2 && rows.some(row => row.key === 'user' && row.value === 'base') &&
        rows.some(row => row.key === 'user001' && row.value === 'child');
    }
  },
  {
    remark: '后缀匹配只返回指定结尾的键',
    test: async function () {
      await translate.storage.IndexedDB.set('done', 1);
      await translate.storage.IndexedDB.set('user-done', 2);
      await translate.storage.IndexedDB.set('done-later', 3);
      const rows = await translate.storage.IndexedDB.list('*done');
      return rows.length === 2 && rows.some(row => row.key === 'done') &&
        rows.some(row => row.key === 'user-done');
    }
  },
  {
    remark: '中间星号包含零字符和多个字符两种匹配',
    test: async function () {
      await translate.storage.IndexedDB.set('ab', 1);
      await translate.storage.IndexedDB.set('a-middle-b', 2);
      await translate.storage.IndexedDB.set('a-middle-c', 3);
      const rows = await translate.storage.IndexedDB.list('a*b');
      return rows.length === 2 && rows.some(row => row.key === 'ab') &&
        rows.some(row => row.key === 'a-middle-b');
    }
  },
  {
    remark: '多个星号可同时匹配多个位置',
    test: async function () {
      await translate.storage.IndexedDB.set('a-mid-b-tail-c', 1);
      await translate.storage.IndexedDB.set('abc', 2);
      await translate.storage.IndexedDB.set('acb', 3);
      const rows = await translate.storage.IndexedDB.list('a*b*c');
      return rows.length === 2 && rows.some(row => row.key === 'abc') &&
        rows.some(row => row.key === 'a-mid-b-tail-c');
    }
  },
  {
    remark: '单独星号返回所有记录并保留 false、null 和对象值',
    test: async function () {
      await translate.storage.IndexedDB.set('false', false);
      await translate.storage.IndexedDB.set('null', null);
      await translate.storage.IndexedDB.set('object', { nested: '中文' });
      const rows = await translate.storage.IndexedDB.list('*');
      return rows.length === 3 && rows.some(row => row.key === 'false' && row.value === false) &&
        rows.some(row => row.key === 'null' && row.value === null) &&
        rows.some(row => row.key === 'object' && row.value.nested === '中文');
    }
  },
  {
    remark: 'Unicode 前缀和 emoji 键可以模糊匹配',
    test: async function () {
      await translate.storage.IndexedDB.set('中文😀', 'match');
      await translate.storage.IndexedDB.set('english', 'excluded');
      const rows = await translate.storage.IndexedDB.list('中文*');
      return rows.length === 1 && rows[0].key === '中文😀' && rows[0].value === 'match';
    }
  },
  {
    remark: '匹配大小写敏感，不混合大小写不同的键',
    test: async function () {
      await translate.storage.IndexedDB.set('User', 'upper');
      await translate.storage.IndexedDB.set('user', 'lower');
      const rows = await translate.storage.IndexedDB.list('User');
      return rows.length === 1 && rows[0].value === 'upper';
    }
  },
  // 保留现有默认参数：省略参数和显式 undefined 都按空字符串匹配，不代表列出全部记录。
  {
    remark: '数据库已有普通键时省略参数不会列出普通记录',
    test: async function () {
      await translate.storage.IndexedDB.set('ordinary', '保留');
      const rows = await translate.storage.IndexedDB.list();
      return rows.length === 0;
    }
  },
  {
    remark: '数据库已有普通键时显式 undefined 不会列出普通记录',
    test: async function () {
      await translate.storage.IndexedDB.set('ordinary', '保留');
      const rows = await translate.storage.IndexedDB.list(undefined);
      return rows.length === 0;
    }
  },
  {
    remark: '数据库已有普通键时空字符串不会列出普通记录',
    test: async function () {
      await translate.storage.IndexedDB.set('ordinary', '保留');
      const rows = await translate.storage.IndexedDB.list('');
      return rows.length === 0;
    }
  },
  {
    remark: '数据库包含空键和普通键时省略参数只返回空键',
    test: async function () {
      await translate.storage.IndexedDB.set('', '空键值');
      await translate.storage.IndexedDB.set('ordinary', '普通值');
      const rows = await translate.storage.IndexedDB.list();
      return rows.length === 1 && rows[0].key === '' && rows[0].value === '空键值';
    }
  },
  {
    remark: '数据库包含空键和普通键时显式 undefined 只返回空键',
    test: async function () {
      await translate.storage.IndexedDB.set('', '空键值');
      await translate.storage.IndexedDB.set('ordinary', '普通值');
      const rows = await translate.storage.IndexedDB.list(undefined);
      return rows.length === 1 && rows[0].key === '' && rows[0].value === '空键值';
    }
  },
  {
    remark: '数据库包含空键和普通键时空字符串只返回空键',
    test: async function () {
      await translate.storage.IndexedDB.set('', '空键值');
      await translate.storage.IndexedDB.set('ordinary', '普通值');
      const rows = await translate.storage.IndexedDB.list('');
      return rows.length === 1 && rows[0].key === '' && rows[0].value === '空键值';
    }
  },
  {
    remark: '单独星号同时返回空键和普通键',
    test: async function () {
      await translate.storage.IndexedDB.set('', '空键值');
      await translate.storage.IndexedDB.set('ordinary', '普通值');
      const rows = await translate.storage.IndexedDB.list('*');
      return rows.length === 2 && rows.some(row => row.key === '' && row.value === '空键值') &&
        rows.some(row => row.key === 'ordinary' && row.value === '普通值');
    }
  },
  // 现有实现只把星号转换为 .*，其余字符继续按正则解释；这些用例固定原有兼容行为。
  {
    remark: '点号保留正则单字符语义，整个键仍受首尾锚点限制',
    test: async function () {
      await translate.storage.IndexedDB.set('user.1', '点号');
      await translate.storage.IndexedDB.set('userX1', '单字符');
      await translate.storage.IndexedDB.set('xuser.1', '多余前缀');
      await translate.storage.IndexedDB.set('user.1x', '多余后缀');
      const rows = await translate.storage.IndexedDB.list('user.1');
      return rows.length === 2 && rows.some(row => row.key === 'user.1' && row.value === '点号') &&
        rows.some(row => row.key === 'userX1' && row.value === '单字符');
    }
  },
  {
    remark: '方括号保留正则字符组语义，不按字面括号匹配键',
    test: async function () {
      await translate.storage.IndexedDB.set('a1', '字符组命中');
      await translate.storage.IndexedDB.set('a[1]', '字面括号');
      await translate.storage.IndexedDB.set('a2', '不匹配');
      const rows = await translate.storage.IndexedDB.list('a[1]');
      return rows.length === 1 && rows[0].key === 'a1' && rows[0].value === '字符组命中';
    }
  },
  {
    remark: '正则转义后的点号可以查询包含字面点号的键',
    test: async function () {
      await translate.storage.IndexedDB.set('user.1', '字面点号');
      await translate.storage.IndexedDB.set('userX1', '不匹配');
      const rows = await translate.storage.IndexedDB.list('user\\.1');
      return rows.length === 1 && rows[0].key === 'user.1' && rows[0].value === '字面点号';
    }
  },
  {
    remark: '正则转义后的方括号可以查询包含字面括号的键',
    test: async function () {
      await translate.storage.IndexedDB.set('a[1]', '字面括号');
      await translate.storage.IndexedDB.set('a1', '不匹配');
      const rows = await translate.storage.IndexedDB.list('a\\[1\\]');
      return rows.length === 1 && rows[0].key === 'a[1]' && rows[0].value === '字面括号';
    }
  },
  {
    remark: '加号保留正则一次或多次重复语义',
    test: async function () {
      await translate.storage.IndexedDB.set('a', '一次');
      await translate.storage.IndexedDB.set('aaa', '多次');
      await translate.storage.IndexedDB.set('b', '不匹配');
      const rows = await translate.storage.IndexedDB.list('a+');
      return rows.length === 2 && rows.some(row => row.key === 'a' && row.value === '一次') &&
        rows.some(row => row.key === 'aaa' && row.value === '多次');
    }
  },
  {
    remark: '问号保留正则零次或一次重复语义',
    test: async function () {
      await translate.storage.IndexedDB.set('color', '零次');
      await translate.storage.IndexedDB.set('colour', '一次');
      await translate.storage.IndexedDB.set('colouur', '不匹配');
      const rows = await translate.storage.IndexedDB.list('colou?r');
      return rows.length === 2 && rows.some(row => row.key === 'color' && row.value === '零次') &&
        rows.some(row => row.key === 'colour' && row.value === '一次');
    }
  },
  {
    remark: '花括号保留正则指定重复两次的语义',
    test: async function () {
      await translate.storage.IndexedDB.set('a', '一次');
      await translate.storage.IndexedDB.set('aa', '两次');
      await translate.storage.IndexedDB.set('aaa', '三次');
      const rows = await translate.storage.IndexedDB.list('a{2}');
      return rows.length === 1 && rows[0].key === 'aa' && rows[0].value === '两次';
    }
  },
  {
    remark: '圆括号保留正则分组并对整个分组重复匹配',
    test: async function () {
      await translate.storage.IndexedDB.set('ab', '一组');
      await translate.storage.IndexedDB.set('abab', '两组');
      await translate.storage.IndexedDB.set('aba', '不完整');
      const rows = await translate.storage.IndexedDB.list('(ab)+');
      return rows.length === 2 && rows.some(row => row.key === 'ab' && row.value === '一组') &&
        rows.some(row => row.key === 'abab' && row.value === '两组');
    }
  },
  {
    remark: '未闭合方括号使查询以 SyntaxError 拒绝，同一数据库仍可读取原记录',
    test: async function () {
      await translate.storage.IndexedDB.set('safe', '原记录');
      let syntaxError = false;
      try {
        await translate.storage.IndexedDB.list('[');
      } catch (error) {
        syntaxError = error instanceof SyntaxError;
      }
      return syntaxError && await translate.storage.IndexedDB.get('safe') === '原记录';
    }
  },
  {
    remark: '未闭合圆括号使查询以 SyntaxError 拒绝，同一数据库仍可读取原记录',
    test: async function () {
      await translate.storage.IndexedDB.set('safe', '原记录');
      let syntaxError = false;
      try {
        await translate.storage.IndexedDB.list('(');
      } catch (error) {
        syntaxError = error instanceof SyntaxError;
      }
      return syntaxError && await translate.storage.IndexedDB.get('safe') === '原记录';
    }
  },
  {
    remark: '尾部反斜杠转义自动追加的美元锚点，保留匹配美元字符前缀的现有行为',
    test: async function () {
      await translate.storage.IndexedDB.set('$', '美元字符');
      await translate.storage.IndexedDB.set('$more', '美元前缀');
      await translate.storage.IndexedDB.set('x$', '非美元前缀');
      await translate.storage.IndexedDB.set('safe', '原记录');
      // 尾部反斜杠会转义实现自动追加的 $，因此该表达式仍合法且没有结尾锚点。
      // 保留现有规则：它匹配以字面美元字符开头的键，而不是报告非法正则。
      const rows = await translate.storage.IndexedDB.list('\\');
      return rows.length === 2 && rows.some(row => row.key === '$' && row.value === '美元字符') &&
        rows.some(row => row.key === '$more' && row.value === '美元前缀') &&
        await translate.storage.IndexedDB.get('safe') === '原记录';
    }
  },
  {
    remark: '星号沿用正则点号不跨换行的限制，不返回中间包含换行的键',
    test: async function () {
      await translate.storage.IndexedDB.set('ordinary', '普通值');
      await translate.storage.IndexedDB.set('first\nsecond', '含换行值');
      // 星号只替换成 .*，未启用 dotAll；使用中间换行避免混入 $ 对尾换行的特殊规则。
      const rows = await translate.storage.IndexedDB.list('*');
      return rows.length === 1 && rows[0].key === 'ordinary' && rows[0].value === '普通值';
    }
  }
]);
