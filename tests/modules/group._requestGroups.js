'use strict';

// 单项只改变一处条件。默认的第一组有效，确保第二组校验失败时也不能发出部分请求。
const rejectedInputs = [
  ['省略分组', 'groups', undefined], ['空批次', 'groups', []], ['类数组批次', 'groups', { length: 1 }],
  ['首组为空', 'groups', [null]], ['缺少成功回调', 'success', undefined],
  ['失败回调类型错误', 'error', 'callback'], ['目标为空', 'target', ''],
  ['目标只有空白', 'target', ' \t'], ['目标不是字符串', 'target', 0],
  ['末组缺失', 'last', null], ['末组目标不同', 'last', { to: 'spanish', words: [{ text: '乙' }], nodes: ['B'] }],
  ['末组没有词', 'last', { to: 'english', words: [], nodes: [] }],
  ['末组词为类数组', 'last', { to: 'english', words: { length: 1 }, nodes: ['B'] }],
  ['末组没有节点数组', 'last', { to: 'english', words: [{ text: '乙' }] }],
  ['末组节点少于词数', 'last', { to: 'english', words: [{ text: '乙' }], nodes: [] }],
  ['接口未配置', 'api', null], ['接口仅含空白', 'api', '  '], ['已切换到其他服务', 'service', 'client.edge']
];

require('../helpers/module')(__filename, [
  ...rejectedInputs.map(([label, field, value]) => ({
    remark: label + '时返回 null，整批不发送', input: { field, value },
    test: function ({ field, value }) {
      const first = { to: 'english', words: [{ text: '甲', weight: 1 }], nodes: [document.createTextNode('甲')] };
      const groups = [first];
      if (field === 'last') groups.push(value);
      if (field === 'target') first.to = value;
      if (field === 'api') translate.request.api.translate = value;
      if (field === 'service') translate.service.name = value;
      let sends = 0;
      translate.request.send = () => { sends++; };
      const result = translate.group._requestGroups('batch', field === 'groups' ? value : groups,
        field === 'success' ? value : () => {}, field === 'error' ? value : undefined);
      return result === null && sends === 0;
    }
  })),
  {
    remark: '一次真实序列化发送所有段落，异步 JSON 回调保留原批次节点映射与 XHR',
    test: function () {
      const wire = [];
      // 保留 request.send 的序列化、请求钩子和响应解析，仅接管最终的浏览器传输。
      window.XMLHttpRequest = class {
        open(method, url, async) { this.method = method; this.url = url; this.async = async; }
        setRequestHeader() {}
        send(body) { wire.push(body); }
      };
      const node = document.createTextNode('甲 & +%😀');
      const a = { to: 'english', nodes: [node], words: [{ text: node.data, weight: 1 }] };
      const b = { to: 'english', nodes: [document.createTextNode('乙')], words: [{ text: '乙', weight: 0 }] };
      const groups = [a, b];
      translate.to = 'japanese';
      let replies = 0, received;
      const xhr = translate.group._requestGroups('batch-1', groups, (...args) => { replies++; received = args; }, null);
      if (wire.length !== 1 || xhr.method.toUpperCase() !== 'POST' || !xhr.async) return false;
      const form = new URLSearchParams(wire[0]);
      const expected = [{ words: a.words }, { words: b.words }];
      if (form.has('from') || form.get('to') !== 'english' ||
          JSON.stringify(JSON.parse(form.get('text'))) !== JSON.stringify(expected)) return false;
      // 调用方可以复用输入数组；已发出的请求必须保持发出时的段落顺序。
      groups.reverse();
      xhr.readyState = 4; xhr.status = 200;
      xhr.responseText = xhr.response = JSON.stringify({ result: 1, text: ['first', 'second'] });
      xhr.onreadystatechange();
      const [data, context, transport] = received;
      return replies === 1 && transport === xhr && data.result === 1 && data.text[1] === 'second' &&
        context.uuid === 'batch-1' && context.to === 'english' && context.groups !== groups &&
        context.groups[0] === a && context.groups[1] === b && context.groups[0].nodes[0] === node;
    }
  },
  ...[
    { status: 200, body: '服务维护', label: 'HTTP 200 非 JSON 将原文交给成功回调' },
    { status: 503, body: 'busy', label: 'HTTP 503 将同一个 XHR 交给失败回调' }
  ].map(input => ({
    remark: input.label + '且只通知一次', input,
    test: function ({ status, body }) {
      window.XMLHttpRequest = class { open() {} setRequestHeader() {} send() {} };
      const groups = [{ to: 'english', nodes: [document.createTextNode('甲')], words: [{ text: '甲', weight: 0 }] }];
      const successes = [], failures = [];
      const xhr = translate.group._requestGroups('batch', groups, (...args) => successes.push(args),
        (...args) => failures.push(args));
      xhr.readyState = 4; xhr.status = status; xhr.response = xhr.responseText = body;
      xhr.onreadystatechange();
      return status === 200
        ? failures.length === 0 && successes.length === 1 && successes[0].length === 1 && successes[0][0] === body
        : successes.length === 0 && failures.length === 1 && failures[0][0] === xhr;
    }
  })),
  { remark: '参数组合：一组对应数量不符时整批无副作用，修正映射后同一输入可重试',
    test: function () {
      const a = document.createTextNode('甲'), b = document.createTextNode('乙');
      const groups = [
        {to: 'english', words: [{text: '甲', weight: 0}], nodes: [a]},
        {to: 'english', words: [{text: '乙', weight: 1}], nodes: []}
      ];
      const callbacks = [];
      const sends = [];
      const ticket = {};
      translate.request.send = function (path, data, context) {
        sends.push({data, context});
        return ticket;
      };
      const done = () => callbacks.push('done'), fail = () => callbacks.push('error');
      const first = translate.group._requestGroups('retry', groups, done, fail);
      if (first !== null || sends.length || callbacks.length || groups[1].nodes.length) return false;
      groups[1].nodes.push(b);
      const retry = translate.group._requestGroups('retry', groups, done, fail);
      if (retry !== ticket || sends.length !== 1 || callbacks.length) return false;
      const payload = JSON.parse(decodeURIComponent(sends[0].data.text));
      return payload.length === 2 && payload[0].words[0].text === '甲' && payload[1].words[0].text === '乙' &&
        sends[0].context.groups[0].nodes[0] === a && sends[0].context.groups[1].nodes[0] === b;
    } }
]);
