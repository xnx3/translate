require('../helpers/module')(__filename, [
  { remark: '空块不触发业务事件', args: [''], expected: { name: 'message', data: '', dataText: '', dispatch: false } },
  { remark: '注释心跳不触发业务事件', args: [': heartbeat'], expected: { name: 'message', data: '', dataText: '', dispatch: false } },
  { remark: '只有 id 和 retry 的控制块不派发', args: ['id: 42\nretry: 1000'], expected: { name: 'message', data: '', dataText: '', dispatch: false } },
  { remark: '普通文本默认派发 message', args: ['data: hello'], expected: { name: 'message', data: 'hello', dataText: 'hello', dispatch: true } },
  { remark: '命名事件的 JSON 对象被解析', args: ['event: batch\ndata: {"index":0,"text":"你好"}'], expected: { name: 'batch', data: { index: 0, text: '你好' }, dataText: '{"index":0,"text":"你好"}', dispatch: true } },
  { remark: '多行 data 使用换行合并', args: ['data: first\ndata: second'], expected: { name: 'message', data: 'first\nsecond', dataText: 'first\nsecond', dispatch: true } },
  { remark: '冒号后只移除一个空格', args: ['data:  hello'], expected: { name: 'message', data: ' hello', dataText: ' hello', dispatch: true } },
  { remark: '没有冒号的 data 字段仍派发空正文', args: ['data'], expected: { name: 'message', data: '', dataText: '', dispatch: true } },
  { remark: '空事件名回落为 message', args: ['event:\ndata: x'], expected: { name: 'message', data: 'x', dataText: 'x', dispatch: true } },
  { remark: '正文中的冒号完整保留', args: ['data: http://a:b/path'], expected: { name: 'message', data: 'http://a:b/path', dataText: 'http://a:b/path', dispatch: true } },
  { remark: 'JSON 布尔 false 保持布尔类型', args: ['data: false'], expected: { name: 'message', data: false, dataText: 'false', dispatch: true } },
  { remark: 'JSON null 保持空值类型', args: ['data: null'], expected: { name: 'message', data: null, dataText: 'null', dispatch: true } },
  { remark: 'JSON 数组完整解析', args: ['data: [1,"a"]'], expected: { name: 'message', data: [1, 'a'], dataText: '[1,"a"]', dispatch: true } },
  { remark: '无效 JSON 保留原始正文', args: ['data: {broken'], expected: { name: 'message', data: '{broken', dataText: '{broken', dispatch: true } },
  { remark: '注释与未知字段不污染业务正文', args: [': beat\nunknown: ignored\nevent: done\ndata: ok\n'], expected: { name: 'done', data: 'ok', dataText: 'ok', dispatch: true } }
]);
