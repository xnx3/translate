'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "导出 language.select.show 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.selectLanguageTag.show = false;
      const data = translate.config.get();
      return data.language.select.show === false;
    }
  },
  {
    remark: "导出 language.select.languages 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.selectLanguageTag.languages = 'english,spanish';
      const data = translate.config.get();
      return data.language.select.languages === 'english,spanish';
    }
  },
  {
    remark: "导出 language.select.documentId 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.selectLanguageTag.documentId = 'custom-selector';
      const data = translate.config.get();
      return data.language.select.documentId === 'custom-selector';
    }
  },
  {
    remark: "导出 language.local 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.language.local = 'chinese_simplified';
      const data = translate.config.get();
      return data.language.local === 'chinese_simplified';
    }
  },
  {
    remark: "导出 language.defaultTo 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.language.defaultTo = 'english';
      const data = translate.config.get();
      return data.language.defaultTo === 'english';
    }
  },
  {
    remark: "导出 language.autoDiscriminateLocalLanguage 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.autoDiscriminateLocalLanguage = true;
      const data = translate.config.get();
      return data.language.autoDiscriminateLocalLanguage === true;
    }
  },
  {
    remark: "导出 language.urlParamControl.use 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.language.setUrlParamControl_use = true;
      const data = translate.config.get();
      return data.language.urlParamControl.use === true;
    }
  },
  {
    remark: "导出 language.urlParamControl.name 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.language.setUrlParamControl_name = 'lang';
      const data = translate.config.get();
      return data.language.urlParamControl.name === 'lang';
    }
  },
  {
    remark: "导出 language.translateLocal 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.language.translateLocal = true;
      const data = translate.config.get();
      return data.language.translateLocal === true;
    }
  },
  {
    remark: "导出 listener.use 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.listener.use = true;
      const data = translate.config.get();
      return data.listener.use === true;
    }
  },
  {
    remark: "导出 service 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.service.name = 'custom.service';
      const data = translate.config.get();
      return data.service === 'custom.service';
    }
  },
  {
    remark: "导出 whole.enableAll 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.whole.isEnableAll = true;
      const data = translate.config.get();
      return data.whole.enableAll === true;
    }
  },
  {
    remark: "导出 whole.context.use 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.whole.context.is_use = true;
      const data = translate.config.get();
      return data.whole.context.use === true;
    }
  },
  {
    remark: "导出 selectionTranslate.use 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.selectionTranslate.use = true;
      const data = translate.config.get();
      return data.selectionTranslate.use === true;
    }
  },
  {
    remark: "导出 request.api.language 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.request.api.language = 'custom-language.json';
      const data = translate.config.get();
      return data.request.api.language === 'custom-language.json';
    }
  },
  {
    remark: "导出 request.api.translate 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.request.api.translate = 'custom-translate.json';
      const data = translate.config.get();
      return data.request.api.translate === 'custom-translate.json';
    }
  },
  {
    remark: "导出 request.api.ip 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.request.api.ip = 'custom-ip.json';
      const data = translate.config.get();
      return data.request.api.ip === 'custom-ip.json';
    }
  },
  {
    remark: "导出 request.api.connectTest 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.request.api.connectTest = 'custom-connect.json';
      const data = translate.config.get();
      return data.request.api.connectTest === 'custom-connect.json';
    }
  },
  {
    remark: "导出 request.api.init 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.request.api.init = 'custom-init.json';
      const data = translate.config.get();
      return data.request.api.init === 'custom-init.json';
    }
  },
  {
    remark: "导出 request.listener.use 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.request.listener.use = true;
      const data = translate.config.get();
      return data.request.listener.use === true;
    }
  },
  {
    remark: "导出 request.listener.delayExecuteTime 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.request.listener.delayExecuteTime = 0;
      const data = translate.config.get();
      return data.request.listener.delayExecuteTime === 0;
    }
  },
  {
    remark: "导出 request.listener.minIntervalTime 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.request.listener.minIntervalTime = 120;
      const data = translate.config.get();
      return data.request.listener.minIntervalTime === 120;
    }
  },
  {
    remark: "导出 request.sse.use 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.request.sse.use = false;
      const data = translate.config.get();
      return data.request.sse.use === false;
    }
  },
  {
    remark: "导出 request.waitingExecute 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.waitingExecute.use = true;
      const data = translate.config.get();
      return data.request.waitingExecute === true;
    }
  },
  {
    remark: "导出 progress.api.use 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.progress.api.use = true;
      const data = translate.config.get();
      return data.progress.api.use === true;
    }
  },
  {
    remark: "导出 progress.style 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.progress.style = 'color: red;';
      const data = translate.config.get();
      return data.progress.style === 'color: red;';
    }
  },
  {
    remark: "导出 network.use 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.network.isUse = true;
      const data = translate.config.get();
      return data.network.use === true;
    }
  },
  {
    remark: "导出 visual.webPageLoadTranslateBeforeHiddenText.use 的当前值，不使用默认配置覆盖",
    test: function () {
      translate.visual.webPageLoadTranslateBeforeHiddenText_use = true;
      const data = translate.config.get();
      return data.visual.webPageLoadTranslateBeforeHiddenText.use === true;
    }
  },
  {
    remark: "导出 language.range 的数组内容",
    test: function () {
      const value = ['english'];
      translate.language.translateLanguagesRange = value;
      const data = translate.config.get();
      return JSON.stringify(data.language.range) === JSON.stringify(value);
    }
  },
  {
    remark: "导出 images 的数组内容",
    test: function () {
      const value = [{ key: '/old.png', value: '/new.png' }];
      translate.images.queues = value;
      const data = translate.config.get();
      return JSON.stringify(data.images) === JSON.stringify(value);
    }
  },
  {
    remark: "导出 ignore.text 的数组内容",
    test: function () {
      const value = ['忽略😀'];
      translate.ignore.text = value;
      const data = translate.config.get();
      return JSON.stringify(data.ignore.text) === JSON.stringify(value);
    }
  },
  {
    remark: "导出 ignore.id 的数组内容",
    test: function () {
      const value = ['ignored-id'];
      translate.ignore.id = value;
      const data = translate.config.get();
      return JSON.stringify(data.ignore.id) === JSON.stringify(value);
    }
  },
  {
    remark: "导出 ignore.tag 的数组内容",
    test: function () {
      const value = ['custom-tag'];
      translate.ignore.tag = value;
      const data = translate.config.get();
      return JSON.stringify(data.ignore.tag) === JSON.stringify(value);
    }
  },
  {
    remark: "导出 ignore.class.data 的数组内容",
    test: function () {
      const value = ['ignored-class'];
      translate.ignore.class.data = value;
      const data = translate.config.get();
      return JSON.stringify(data.ignore.class.data) === JSON.stringify(value);
    }
  },
  {
    remark: "导出 whole.class 的数组内容",
    test: function () {
      const value = ['whole-class'];
      translate.whole.class = value;
      const data = translate.config.get();
      return JSON.stringify(data.whole.class) === JSON.stringify(value);
    }
  },
  {
    remark: "导出 whole.tag 的数组内容",
    test: function () {
      const value = ['article'];
      translate.whole.tag = value;
      const data = translate.config.get();
      return JSON.stringify(data.whole.tag) === JSON.stringify(value);
    }
  },
  {
    remark: "导出 whole.id 的数组内容",
    test: function () {
      const value = ['whole-id'];
      translate.whole.id = value;
      const data = translate.config.get();
      return JSON.stringify(data.whole.id) === JSON.stringify(value);
    }
  },
  {
    remark: "导出 request.api.host 的数组内容",
    test: function () {
      const value = ['https://local.example/'];
      translate.request.api.host = value;
      const data = translate.config.get();
      return JSON.stringify(data.request.api.host) === JSON.stringify(value);
    }
  },
  {
    remark: "导出 element.tagAttribute 的数组内容",
    test: function () {
      const value = [{ tag: 'input', attributes: ['value'] }];
      translate.element.tagAttribute = value;
      const data = translate.config.get();
      return JSON.stringify(data.element.tagAttribute) === JSON.stringify(value);
    }
  },
  {
    remark: "导出 network.rules 的数组内容",
    test: function () {
      const value = [{ url: '/api/*', method: 'GET' }];
      translate.network.rules = value;
      const data = translate.config.get();
      return JSON.stringify(data.network.rules) === JSON.stringify(value);
    }
  },
  {
    remark: "导出指定的 DOM 翻译范围并保留原节点",
    test: function () {
      const node = document.createElement('section');
      translate.documents = [node];
      const data = translate.config.get();
      return data.documents.length === 1 && data.documents[0] === node;
    }
  },
  {
    remark: "导出自定义术语的完整语种映射",
    test: function () {
      translate.nomenclature.data = { chinese_simplified: { english: { '你好': 'Hello' } } };
      const data = translate.config.get();
      return data.nomenclature.chinese_simplified.english['你好'] === 'Hello';
    }
  },
  {
    remark: "导出忽略文本的正则表达式对象",
    test: function () {
      const regex = /^skip/u;
      translate.ignore.textRegex = [regex];
      const data = translate.config.get();
      return data.ignore.textRegex.length === 1 && data.ignore.textRegex[0].source === '^skip' && data.ignore.textRegex[0].flags === 'u';
    }
  },
  {
    remark: "导出追加请求参数中的零值和空字符串",
    test: function () {
      translate.request.appendParams = { zero: 0, text: '' };
      const data = translate.config.get();
      return data.request.appendParams.zero === 0 && data.request.appendParams.text === '';
    }
  },
  {
    remark: "导出追加请求头的名称和值",
    test: function () {
      translate.request.appendHeaders = { 'X-Test': '中文' };
      return translate.config.get().request.appendHeaders['X-Test'] === '中文';
    }
  },
  {
    remark: "每次调用返回新的配置容器而不复用上次容器",
    test: function () {
      const first = translate.config.get();
      const second = translate.config.get();
      return first !== second && first.language !== second.language;
    }
  }
]);
