// 每种无效对象和每类来源差异独立报告，不在一个 test 中循环多个参数。
const invalidCases = [
  ['null', 'null'], ['undefined', 'undefined'], ['普通对象', '{}'], ['div 元素', "document.createElement('div')"]
].map(function (item) {
  return { remark: item[0] + ' 不能当作可访问 iframe', test: new Function(`
    return translate.element.iframe.isIframeSameOrigin(${item[1]}) === false;
  `) };
});
const crossOriginCases = [
  ['主机不同', "'https://foreign.example/frame'"],
  ['端口不同', "location.protocol + '//' + location.hostname + ':' + (Number(location.port || 80) + 1) + '/frame'"]
].map(function (item) {
  return { remark: '跨域窗口访问抛错时回退到 src，' + item[0] + ' 被拒绝', test: new Function(`
    var iframe = document.createElement('iframe'); iframe.src = ${item[1]};
    Object.defineProperty(iframe, 'contentDocument', { get: function () { return null; } });
    Object.defineProperty(iframe, 'contentWindow', { get: function () { throw new DOMException('Blocked', 'SecurityError'); } });
    return translate.element.iframe.isIframeSameOrigin(iframe) === false;
  `) };
});

require('../helpers/module')(__filename, [
  ...invalidCases,
  { remark: '已附着的 about:blank 继承当前页面来源，允许注入', test: function () {
    var iframe = document.createElement('iframe'); document.body.append(iframe);
    return iframe.contentDocument.URL === 'about:blank' && translate.element.iframe.isIframeSameOrigin(iframe) === true;
  } },
  { remark: '同源页面加载后按最终文档 URL 判断，而不是被修改的 src 属性', test: async function () {
    var iframe = document.createElement('iframe');
    await new Promise(function (resolve) { iframe.onload = resolve; iframe.src = '/iframe-blank.html'; document.body.append(iframe); });
    return translate.element.iframe.isIframeSameOrigin(iframe) === true;
  } },
  ...crossOriginCases,
  { remark: '无法读取窗口且 src 是当前来源时 URL 比较仍可正常完成', test: function () {
    var iframe = document.createElement('iframe'); iframe.src = location.origin + '/iframe-blank.html';
    Object.defineProperty(iframe, 'contentDocument', { get: function () { throw new DOMException('Blocked', 'SecurityError'); } });
    return translate.element.iframe.isIframeSameOrigin(iframe) === true;
  } },
  { remark: '尚未进入文档且没有可访问窗口的 iframe 不误判为有效同源文档', test: function () {
    return translate.element.iframe.isIframeSameOrigin(document.createElement('iframe')) === false;
  } }
]);
