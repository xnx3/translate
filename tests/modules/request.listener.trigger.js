require('../helpers/module')(__filename, [
  { remark: '默认允许普通相对请求触发翻译', args: ['/products?page=1'], expected: true },
  { remark: '默认允许绝对地址请求触发翻译', args: ['https://example.com/api?q=%E4%B8%AD%E6%96%87'], expected: true },
  { remark: '默认过滤扩展点不按后缀排除 JSON 请求', args: ['/data.json'], expected: true },
  { remark: '空字符串不改变默认允许行为', args: [''], expected: true }
]);
