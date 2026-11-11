'use strict';

require('../helpers/module')(__filename, [
  { remark: '省略 iframe 返回空字符串', args: [], expected: '' },
  { remark: 'undefined iframe 返回空字符串', args: [undefined], expected: '' },
  { remark: 'null iframe 返回空字符串', args: [null], expected: '' },
  {
    remark: '绝对 HTTPS src 得到对应来源',
    test: function () {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', 'https://child.example/path');
      return translate.postMessage.getIframeOrigin(iframe) === 'https://child.example';
    }
  },
  {
    remark: '非默认端口被保留',
    test: function () {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', 'http://child.example:8124/path');
      return translate.postMessage.getIframeOrigin(iframe) === 'http://child.example:8124';
    }
  },
  {
    remark: '相对 src 得到当前页面来源',
    test: function () {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', '/child.html');
      return translate.postMessage.getIframeOrigin(iframe) === location.origin;
    }
  },
  {
    remark: '无 src 的 iframe 回退为当前来源',
    test: function () {
      const iframe = document.createElement('iframe');
      return translate.postMessage.getIframeOrigin(iframe) === location.origin;
    }
  },
  {
    remark: '空 src 的 iframe 回退为当前来源',
    test: function () {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', '');
      return translate.postMessage.getIframeOrigin(iframe) === location.origin;
    }
  },
  {
    remark: 'about:blank iframe 回退为当前来源',
    test: function () {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', 'about:blank');
      return translate.postMessage.getIframeOrigin(iframe) === location.origin;
    }
  },
  {
    remark: '只有 srcdoc 的 iframe 回退为当前来源',
    test: function () {
      const iframe = document.createElement('iframe');
      iframe.srcdoc = '<p>child</p>';
      return translate.postMessage.getIframeOrigin(iframe) === location.origin;
    }
  },
  {
    remark: '文件 src 保持 null 不透明来源标识',
    test: function () {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', 'file:///tmp/child.html');
      return translate.postMessage.getIframeOrigin(iframe) === 'null';
    }
  },
  {
    remark: '没有 getAttribute 时仍可读取 src 属性',
    test: function () {
      return translate.postMessage.getIframeOrigin({ src: 'https://child.example/page' }) === 'https://child.example';
    }
  },
  {
    remark: '有效 src 属性值优先于空的 src attribute',
    test: function () {
      const iframe = { src: 'https://child.example/page', getAttribute: function () { return ''; } };
      return translate.postMessage.getIframeOrigin(iframe) === 'https://child.example';
    }
  },
  {
    remark: '有效 src attribute 优先于备用 src 属性',
    test: function () {
      const iframe = {
        src: 'https://fallback.example/page',
        getAttribute: function () { return 'https://attribute.example/page'; }
      };
      return translate.postMessage.getIframeOrigin(iframe) === 'https://attribute.example';
    }
  }
]);
