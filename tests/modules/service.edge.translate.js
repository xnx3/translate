'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '普通请求映射来源与目标语种并保留待翻译数组',
    test: function () {
      let received;
      translate.request.send = function (...args) { received = args; };
      const data = { from: 'chinese_simplified', to: 'english', text: encodeURIComponent(JSON.stringify(['你好', '世界'])) };
      const callback = function () {};
      translate.service.edge.translate('translate.json', data, callback);
      const url = new URL(received[0]);
      return url.searchParams.get('from') === 'zh-CHS' && url.searchParams.get('to') === 'en' &&
        JSON.stringify(JSON.parse(received[1])) === '["你好","世界"]' && received[2].text === data.text &&
        received[4] === 'post' && received[5] === true && received[6]['Content-Type'] === 'application/json';
    }
  },
  {
    remark: '自动识别来源保留 auto 而不查语种映射',
    test: function () {
      let url;
      translate.request.send = function (value) { url = new URL(value); };
      translate.service.edge.translate('translate.json', { from: 'auto', to: 'spanish', text: encodeURIComponent('["Hello"]') }, function () {});
      return url.searchParams.get('from') === 'auto' && url.searchParams.get('to') === 'es';
    }
  },
  {
    remark: 'romance 来源按约定映射为法语 fr',
    test: function () {
      let url;
      translate.request.send = function (value) { url = new URL(value); };
      translate.service.edge.translate('translate.json', { from: 'romance', to: 'english', text: encodeURIComponent('["Bonjour"]') }, function () {});
      return url.searchParams.get('from') === 'fr';
    }
  },
  {
    remark: 'Edge 返回结果转换成统一响应格式并保留顺序',
    test: function () {
      let response;
      translate.request.send = function (url, body, append, callback) {
        callback([{ translations: [{ text: 'Hello' }] }, { translations: [{ text: 'World' }] }]);
      };
      translate.service.edge.translate('translate.json', {
        from: 'chinese_simplified', to: 'english', text: encodeURIComponent('["你好","世界"]')
      }, function (value) { response = value; });
      return response.result === 1 && response.info === 'SUCCESS' && response.from === 'chinese_simplified' &&
        response.to === 'english' && response.text.length === 2 && response.text[0] === 'Hello' && response.text[1] === 'World';
    }
  },
  {
    remark: '转发异常回调参数给底层请求',
    test: function () {
      const abnormal = function () {};
      let received;
      translate.request.send = function (...args) { received = args; };
      translate.service.edge.translate('translate.json', { from: 'auto', to: 'english', text: encodeURIComponent('["text"]') }, function () {}, abnormal);
      return received[7] === abnormal && received[8] === true;
    }
  },
  {
    remark: 'Unicode、换行和引号内容通过请求体完整传递',
    test: function () {
      const input = ['中文😀', 'A\nB', '"quoted"'];
      let body;
      translate.request.send = function (url, value) { body = JSON.parse(value); };
      translate.service.edge.translate('translate.json', { from: 'auto', to: 'english', text: encodeURIComponent(JSON.stringify(input)) }, function () {});
      return body.length === 3 && body[0] === '中文😀' && body[1] === 'A\nB' && body[2] === '"quoted"';
    }
  },
  {
    remark: '输入条目超过 900 时分片并对回调数组补齐正确位置',
    test: function () {
      const input = Array.from({ length: 901 }, function (_, index) { return 'text-' + index; });
      const requests = [];
      const responses = [];
      translate.request.send = function (url, body, append, callback) { requests.push({ body: JSON.parse(body), callback }); };
      translate.service.edge.translate('translate.json', { from: 'auto', to: 'english', text: encodeURIComponent(JSON.stringify(input)) }, function (data) { responses.push(data); });
      if (requests.length !== 2 || requests[0].body.length !== 900 || requests[1].body.length !== 1) return false;
      // 先完成后一个分片，检验归位是否依赖完成顺序或返回长度猜测。
      requests[1].callback([{ translations: [{ text: 'last' }] }]);
      requests[0].callback(requests[0].body.map(function (_, index) { return { translations: [{ text: 'first-' + index }] }; }));
      return responses.length === 2 && responses[0].text.length === 901 && responses[0].text[0] === null &&
        responses[0].text[899] === null && responses[0].text[900] === 'last' &&
        responses[1].text[0] === 'first-0' && responses[1].text[899] === 'first-899' && responses[1].text[900] === null;
    }
  },
  {
    remark: '单个请求的空译文保持空字符串而不丢失数组位置',
    test: function () {
      let result;
      translate.request.send = function (url, body, append, callback) { callback([{ translations: [{ text: '' }] }]); };
      translate.service.edge.translate('translate.json', { from: 'auto', to: 'english', text: encodeURIComponent('["text"]') }, function (data) { result = data; });
      return result.text.length === 1 && result.text[0] === '';
    }
  }
]);
