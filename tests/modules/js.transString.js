require('../helpers/module')(__filename, [
  { remark: '标准 JSON 对象解析后交给对象翻译并保留目标语种及回调', test: function () {
    let received; const success = function () {}, failure = function () {};
    // 只隔离下一层翻译边界，实际执行 transString 的解析与参数传递。
    translate.js.transObject = function (object, to, ok, bad) { received = { object, to, ok, bad }; };
    translate.js.transString('{"title":"你好"}', 'english', success, failure);
    return received.object.title === '你好' && received.to === 'english' && received.ok === success && received.bad === failure;
  } },
  { remark: '标准 JSON 数组保持元素顺序及类型', test: function () {
    let received; translate.js.transObject = function (object) { received = object; };
    translate.js.transString('["你好",0,false,null]', 'english', function () {}, function () {});
    return Array.isArray(received) && received[0] === '你好' && received[1] === 0 && received[2] === false && received[3] === null;
  } },
  { remark: 'JS 对象字面量支持单引号和未加引号的属性名', test: function () {
    let received; translate.js.transObject = function (object) { received = object; };
    translate.js.transString("{ title: '你好', }", 'english', function () {}, function () {});
    return received.title === '你好';
  } },
  { remark: '空对象也会交给对象翻译', test: function () {
    let received; translate.js.transObject = function (object) { received = object; };
    translate.js.transString('{}', 'english', function () {}, function () {});
    return received !== undefined && Object.keys(received).length === 0;
  } },
  { remark: '无法解析的输入只调用失败回调而不调用对象翻译', test: function () {
    let failed = 0, delegated = 0, error;
    translate.js.transObject = function () { delegated++; };
    translate.js.transString('{ broken syntax', 'english', function () {}, function (value) { failed++; error = value; });
    return failed === 1 && delegated === 0 && error instanceof Error;
  } },
  { remark: '转义换行和引号在解析后保持正确文本', test: function () {
    let received; translate.js.transObject = function (object) { received = object; };
    translate.js.transString('{"text":"first\\n\\\"second\\\""}', 'english', function () {}, function () {});
    return received.text === 'first\n"second"';
  } },
  ...[
    { label: '顶层字符串中的转义引号与表情', value: '第 "2" 页 😀' },
    { label: '嵌套空数组与同名内层键', value: { items: [[], { items: [''] }] } },
    { label: '根数组中的空容器和多个假值', value: [{}, [], '', false, 0, null] }
  ].map(({ label, value }) => ({
    remark: '参数组合：标准 JSON 的' + label + '逐值交给翻译回调',
    input: value,
    test: function (value) {
      let delegated = 0;
      let success = 0;
      let failed = 0;
      let received;
      translate.js.transObject = (parsed, target, done) => {
        delegated++;
        received = { parsed, target };
        done(parsed);
      };
      translate.js.transString(' \n' + JSON.stringify(value) + '\t', 'french',
        () => { success++; }, () => { failed++; });
      return delegated === 1 && received.target === 'french' && success === 1 && failed === 0 &&
        JSON.stringify(received.parsed) === JSON.stringify(value);
    }
  }))
]);
