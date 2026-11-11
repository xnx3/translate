'use strict';

require('../helpers/module')(__filename, [
  { remark: "默认钩子接收路径后不返回值", args: ["/offline/en.js"], expected: undefined },
  { remark: "默认钩子允许省略路径", args: [], expected: undefined },
  { remark: "默认钩子接收空路径", args: [""], expected: undefined }
]);
