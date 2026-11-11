'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '同步请求状态 200 执行脚本且返回 true',
    test: function () {
      const calls = [];
      // 仅替换网络依赖以确定响应状态，真实同步请求参数、脚本执行和返回判定仍由被测方法完成。
      window.XMLHttpRequest = class {
        open(method, url, async) { calls.push([method, url, async]); }
        send(body) { this.readyState = 4; this.status = 200; this.responseText = 'window.__syncModuleLoaded = 7;'; calls.push(body); }
      };
      const result = translate.util.synchronizesLoadJs('/module-test.js');
      return result === true && calls[0][0] === 'GET' && calls[0][1] === '/module-test.js' && calls[0][2] === false && calls[1] === null &&
        window.__syncModuleLoaded === 7;
    }
  },
  {
    remark: '同步请求状态 204 执行脚本且返回 true',
    test: function () {
      const calls = [];
      // 仅替换网络依赖以确定响应状态，真实同步请求参数、脚本执行和返回判定仍由被测方法完成。
      window.XMLHttpRequest = class {
        open(method, url, async) { calls.push([method, url, async]); }
        send(body) { this.readyState = 4; this.status = 204; this.responseText = 'window.__syncModuleLoaded = 7;'; calls.push(body); }
      };
      const result = translate.util.synchronizesLoadJs('/module-test.js');
      return result === true && calls[0][0] === 'GET' && calls[0][1] === '/module-test.js' && calls[0][2] === false && calls[1] === null &&
        window.__syncModuleLoaded === 7;
    }
  },
  {
    remark: '同步请求状态 299 执行脚本且返回 true',
    test: function () {
      const calls = [];
      // 仅替换网络依赖以确定响应状态，真实同步请求参数、脚本执行和返回判定仍由被测方法完成。
      window.XMLHttpRequest = class {
        open(method, url, async) { calls.push([method, url, async]); }
        send(body) { this.readyState = 4; this.status = 299; this.responseText = 'window.__syncModuleLoaded = 7;'; calls.push(body); }
      };
      const result = translate.util.synchronizesLoadJs('/module-test.js');
      return result === true && calls[0][0] === 'GET' && calls[0][1] === '/module-test.js' && calls[0][2] === false && calls[1] === null &&
        window.__syncModuleLoaded === 7;
    }
  },
  {
    remark: '同步请求状态 304 执行脚本且返回 true',
    test: function () {
      const calls = [];
      // 仅替换网络依赖以确定响应状态，真实同步请求参数、脚本执行和返回判定仍由被测方法完成。
      window.XMLHttpRequest = class {
        open(method, url, async) { calls.push([method, url, async]); }
        send(body) { this.readyState = 4; this.status = 304; this.responseText = 'window.__syncModuleLoaded = 7;'; calls.push(body); }
      };
      const result = translate.util.synchronizesLoadJs('/module-test.js');
      return result === true && calls[0][0] === 'GET' && calls[0][1] === '/module-test.js' && calls[0][2] === false && calls[1] === null &&
        window.__syncModuleLoaded === 7;
    }
  },
  {
    remark: '同步请求状态 0 执行脚本且返回 true',
    test: function () {
      const calls = [];
      // 仅替换网络依赖以确定响应状态，真实同步请求参数、脚本执行和返回判定仍由被测方法完成。
      window.XMLHttpRequest = class {
        open(method, url, async) { calls.push([method, url, async]); }
        send(body) { this.readyState = 4; this.status = 0; this.responseText = 'window.__syncModuleLoaded = 7;'; calls.push(body); }
      };
      const result = translate.util.synchronizesLoadJs('/module-test.js');
      return result === true && calls[0][0] === 'GET' && calls[0][1] === '/module-test.js' && calls[0][2] === false && calls[1] === null &&
        window.__syncModuleLoaded === 7;
    }
  },
  {
    remark: '同步请求状态 300 不执行脚本且返回 false',
    test: function () {
      const calls = [];
      // 仅替换网络依赖以确定响应状态，真实同步请求参数、脚本执行和返回判定仍由被测方法完成。
      window.XMLHttpRequest = class {
        open(method, url, async) { calls.push([method, url, async]); }
        send(body) { this.readyState = 4; this.status = 300; this.responseText = 'window.__syncModuleLoaded = 7;'; calls.push(body); }
      };
      const result = translate.util.synchronizesLoadJs('/module-test.js');
      return result === false && calls[0][0] === 'GET' && calls[0][1] === '/module-test.js' && calls[0][2] === false && calls[1] === null &&
        window.__syncModuleLoaded === undefined;
    }
  },
  {
    remark: '同步请求状态 404 不执行脚本且返回 false',
    test: function () {
      const calls = [];
      // 仅替换网络依赖以确定响应状态，真实同步请求参数、脚本执行和返回判定仍由被测方法完成。
      window.XMLHttpRequest = class {
        open(method, url, async) { calls.push([method, url, async]); }
        send(body) { this.readyState = 4; this.status = 404; this.responseText = 'window.__syncModuleLoaded = 7;'; calls.push(body); }
      };
      const result = translate.util.synchronizesLoadJs('/module-test.js');
      return result === false && calls[0][0] === 'GET' && calls[0][1] === '/module-test.js' && calls[0][2] === false && calls[1] === null &&
        window.__syncModuleLoaded === undefined;
    }
  },
  {
    remark: '同步请求状态 500 不执行脚本且返回 false',
    test: function () {
      const calls = [];
      // 仅替换网络依赖以确定响应状态，真实同步请求参数、脚本执行和返回判定仍由被测方法完成。
      window.XMLHttpRequest = class {
        open(method, url, async) { calls.push([method, url, async]); }
        send(body) { this.readyState = 4; this.status = 500; this.responseText = 'window.__syncModuleLoaded = 7;'; calls.push(body); }
      };
      const result = translate.util.synchronizesLoadJs('/module-test.js');
      return result === false && calls[0][0] === 'GET' && calls[0][1] === '/module-test.js' && calls[0][2] === false && calls[1] === null &&
        window.__syncModuleLoaded === undefined;
    }
  },
  {
    remark: '请求尚未完成时不执行脚本且返回 false',
    test: function () {
      window.XMLHttpRequest = class {
        open() {}
        send() { this.readyState = 3; this.status = 200; this.responseText = 'window.__syncModuleLoaded = 7;'; }
      };
      return translate.util.synchronizesLoadJs('/module-test.js') === false && window.__syncModuleLoaded === undefined;
    }
  }
]);
