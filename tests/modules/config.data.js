'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '语言配置默认不强制识别或翻译并使用 language 查询参数',
    test: function () {
      const data = new translate.config.data();
      return data.language.local === '' && data.language.defaultTo === '' && data.language.autoDiscriminateLocalLanguage === false && data.language.translateLocal === false && data.language.range.length === 0 && data.language.urlParamControl.use === false && data.language.urlParamControl.name === 'language';
    }
  },
  {
    remark: '语言选择器默认展示且未限制语种',
    test: function () {
      const data = new translate.config.data();
      return data.language.select.show === true && data.language.select.languages === '' && data.language.select.documentId === 'translate';
    }
  },
  {
    remark: '文档图片术语和忽略集合均从空配置开始',
    test: function () {
      const data = new translate.config.data();
      const arrays = [data.documents, data.images, data.nomenclature, data.ignore.text, data.ignore.textRegex, data.ignore.id, data.ignore.class.data, data.ignore.tag];
      return arrays.every(value => Array.isArray(value) && value.length === 0) && Object.keys(data.ignore.class.conditionFunction).length === 0;
    }
  },
  {
    remark: '整体翻译默认关闭且未指定标签类名或 id',
    test: function () {
      const data = new translate.config.data();
      return data.whole.enableAll === false && data.whole.context.use === false && data.whole.class.length === 0 && data.whole.tag.length === 0 && data.whole.id.length === 0;
    }
  },
  {
    remark: '请求接口默认路径完整且主机集合为空',
    test: function () {
      const api = new translate.config.data().request.api;
      return Array.isArray(api.host) && api.host.length === 0 && api.language === 'language.json' && api.translate === 'translate.json' && api.ip === 'ip.json' && api.connectTest === 'connectTest.json' && api.init === 'init.json';
    }
  },
  {
    remark: '请求监听默认关闭并保留延迟限频和排队默认值',
    test: function () {
      const request = new translate.config.data().request;
      return request.listener.use === false && request.listener.delayExecuteTime === 200 && request.listener.minIntervalTime === 800 && request.waitingExecute === true && request.sse.use === false && Object.keys(request.appendParams).length === 0 && Object.keys(request.appendHeaders).length === 0;
    }
  },
  {
    remark: '界面监听划词遮罩网络拦截及隐藏文字默认关闭',
    test: function () {
      const data = new translate.config.data();
      return data.service === 'translate.service' && data.listener.use === false && data.selectionTranslate.use === false && data.progress.api.use === false && data.progress.style === '' && data.network.use === false && data.network.rules.length === 0 && data.visual.webPageLoadTranslateBeforeHiddenText.use === false && Object.keys(data.element.tagAttribute).length === 0;
    }
  },
  {
    remark: '任意层级数组和对象均由实例独立持有',
    test: function () {
      const first = new translate.config.data();
      const second = new translate.config.data();
      // 比较所有层级的引用，避免遗漏某个嵌套对象被不同 iframe 共用的情况。
      function independent(left, right) {
        if (!left || typeof left !== 'object') return true;
        return left !== right && Object.keys(left).every(key => independent(left[key], right[key]));
      }
      return independent(first, second);
    }
  },
  {
    remark: '修改首个配置的嵌套数组映射和开关不会污染后建实例',
    test: function () {
      const first = new translate.config.data();
      first.documents.push(document.body);
      first.language.range.push('english');
      first.ignore.class.conditionFunction.demo = function () { return true; };
      first.request.appendHeaders['X-Test'] = 'one';
      first.request.api.host.push('https://example.test/');
      first.whole.context.use = true;
      const second = new translate.config.data();
      return second.documents.length === 0 && second.language.range.length === 0 && Object.keys(second.ignore.class.conditionFunction).length === 0 && Object.keys(second.request.appendHeaders).length === 0 && second.request.api.host.length === 0 && second.whole.context.use === false;
    }
  }
]);
