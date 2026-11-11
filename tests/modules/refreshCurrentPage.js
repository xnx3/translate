'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '真实刷新重新载入同源页面，清除页面内临时标记并保留Cookie',
    test: async function () {
      // 在子页面触发真实 location.reload，避免刷新承载当前断言的页面。
      const frame = document.createElement('iframe');
      frame.src = '/iframe-blank.html';
      await new Promise(resolve => { frame.onload = resolve; document.body.append(frame); });
      const url = Array.from(document.scripts).find(script => /\/translate(?:\.min)?\.js$/.test(script.src)).src;
      const script = frame.contentDocument.createElement('script');
      script.src = url;
      await new Promise((resolve, reject) => { script.onload = resolve; script.onerror = reject; frame.contentDocument.head.append(script); });
      frame.contentWindow.__reloadProbe = 'before';
      frame.contentDocument.cookie = 'reloadProbe=kept';
      await new Promise(resolve => { frame.onload = resolve; frame.contentWindow.translate.refreshCurrentPage(); });
      return frame.contentWindow.__reloadProbe === undefined &&
        frame.contentDocument.getElementById('blank-title') !== null &&
        frame.contentDocument.cookie.includes('reloadProbe=kept');
    }
  }
]);
