'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "只配置 language.select.languages 时设置对应值",
    test: function () {
      translate.config.set({ language: { select: { languages: 'english,spanish' } } });
      return translate.selectLanguageTag.languages === 'english,spanish';
    }
  },
  {
    remark: "只配置 language.select.documentId 时设置对应值",
    test: function () {
      translate.config.set({ language: { select: { documentId: 'custom-selector' } } });
      return translate.selectLanguageTag.documentId === 'custom-selector';
    }
  },
  {
    remark: "只配置 language.local 时设置对应值",
    test: function () {
      translate.config.set({ language: { local: 'chinese_simplified' } });
      return translate.language.local === 'chinese_simplified';
    }
  },
  {
    remark: "只配置 language.defaultTo 时设置对应值",
    test: function () {
      translate.config.set({ language: { defaultTo: 'english' } });
      return translate.language.defaultTo === 'english';
    }
  },
  {
    remark: "只配置 language.urlParamControl.name 时设置对应值",
    test: function () {
      translate.config.set({ language: { urlParamControl: { name: 'lang' } } });
      return translate.language.setUrlParamControl_name === 'lang';
    }
  },
  {
    remark: "只配置 service 时设置对应值",
    test: function () {
      translate.config.set({ service: 'custom.service' });
      return translate.service.name === 'custom.service';
    }
  },
  {
    remark: "只配置 request.api.language 时设置对应值",
    test: function () {
      translate.config.set({ request: { api: { language: 'custom-language.json' } } });
      return translate.request.api.language === 'custom-language.json';
    }
  },
  {
    remark: "只配置 request.api.translate 时设置对应值",
    test: function () {
      translate.config.set({ request: { api: { translate: 'custom-translate.json' } } });
      return translate.request.api.translate === 'custom-translate.json';
    }
  },
  {
    remark: "只配置 request.api.ip 时设置对应值",
    test: function () {
      translate.config.set({ request: { api: { ip: 'custom-ip.json' } } });
      return translate.request.api.ip === 'custom-ip.json';
    }
  },
  {
    remark: "只配置 request.api.connectTest 时设置对应值",
    test: function () {
      translate.config.set({ request: { api: { connectTest: 'custom-connect.json' } } });
      return translate.request.api.connectTest === 'custom-connect.json';
    }
  },
  {
    remark: "只配置 request.api.init 时设置对应值",
    test: function () {
      translate.config.set({ request: { api: { init: 'custom-init.json' } } });
      return translate.request.api.init === 'custom-init.json';
    }
  },
  {
    remark: "只配置 progress.style 时设置对应值",
    test: function () {
      translate.config.set({ progress: { style: 'color: red;' } });
      return translate.progress.style === 'color: red;';
    }
  },
  {
    remark: "language.select.show 显式配置 true 时保留布尔值",
    test: function () {
      translate.selectLanguageTag.show = false;
      translate.config.set({ language: { select: { show: true } } });
      return translate.selectLanguageTag.show === true;
    }
  },
  {
    remark: "language.select.show 显式配置 false 时保留布尔值",
    test: function () {
      translate.selectLanguageTag.show = true;
      translate.config.set({ language: { select: { show: false } } });
      return translate.selectLanguageTag.show === false;
    }
  },
  {
    remark: "language.urlParamControl.use 显式配置 true 时保留布尔值",
    test: function () {
      translate.language.setUrlParamControl_use = false;
      translate.config.set({ language: { urlParamControl: { use: true } } });
      return translate.language.setUrlParamControl_use === true;
    }
  },
  {
    remark: "language.urlParamControl.use 显式配置 false 时保留布尔值",
    test: function () {
      translate.language.setUrlParamControl_use = true;
      translate.config.set({ language: { urlParamControl: { use: false } } });
      return translate.language.setUrlParamControl_use === false;
    }
  },
  {
    remark: "language.translateLocal 显式配置 true 时保留布尔值",
    test: function () {
      translate.language.translateLocal = false;
      translate.config.set({ language: { translateLocal: true } });
      return translate.language.translateLocal === true;
    }
  },
  {
    remark: "language.translateLocal 显式配置 false 时保留布尔值",
    test: function () {
      translate.language.translateLocal = true;
      translate.config.set({ language: { translateLocal: false } });
      return translate.language.translateLocal === false;
    }
  },
  {
    remark: "listener.use 显式配置 true 时保留布尔值",
    test: function () {
      translate.listener.use = false;
      translate.config.set({ listener: { use: true } });
      return translate.listener.use === true;
    }
  },
  {
    remark: "listener.use 显式配置 false 时保留布尔值",
    test: function () {
      translate.listener.use = true;
      translate.config.set({ listener: { use: false } });
      return translate.listener.use === false;
    }
  },
  {
    remark: "whole.enableAll 显式配置 true 时保留布尔值",
    test: function () {
      translate.whole.isEnableAll = false;
      translate.config.set({ whole: { enableAll: true } });
      return translate.whole.isEnableAll === true;
    }
  },
  {
    remark: "whole.enableAll 显式配置 false 时保留布尔值",
    test: function () {
      translate.whole.isEnableAll = true;
      translate.config.set({ whole: { enableAll: false } });
      return translate.whole.isEnableAll === false;
    }
  },
  {
    remark: "whole.context.use 显式配置 true 时保留布尔值",
    test: function () {
      translate.whole.context.is_use = false;
      translate.config.set({ whole: { context: { use: true } } });
      return translate.whole.context.is_use === true;
    }
  },
  {
    remark: "whole.context.use 显式配置 false 时保留布尔值",
    test: function () {
      translate.whole.context.is_use = true;
      translate.config.set({ whole: { context: { use: false } } });
      return translate.whole.context.is_use === false;
    }
  },
  {
    remark: "request.listener.use 显式配置 true 时保留布尔值",
    test: function () {
      translate.request.listener.use = false;
      translate.config.set({ request: { listener: { use: true } } });
      return translate.request.listener.use === true;
    }
  },
  {
    remark: "request.listener.use 显式配置 false 时保留布尔值",
    test: function () {
      translate.request.listener.use = true;
      translate.config.set({ request: { listener: { use: false } } });
      return translate.request.listener.use === false;
    }
  },
  {
    remark: "request.sse.use 显式配置 true 时保留布尔值",
    test: function () {
      translate.request.sse.use = false;
      translate.config.set({ request: { sse: { use: true } } });
      return translate.request.sse.use === true;
    }
  },
  {
    remark: "request.sse.use 显式配置 false 时保留布尔值",
    test: function () {
      translate.request.sse.use = true;
      translate.config.set({ request: { sse: { use: false } } });
      return translate.request.sse.use === false;
    }
  },
  {
    remark: "request.waitingExecute 显式配置 true 时保留布尔值",
    test: function () {
      translate.waitingExecute.use = false;
      translate.config.set({ request: { waitingExecute: true } });
      return translate.waitingExecute.use === true;
    }
  },
  {
    remark: "request.waitingExecute 显式配置 false 时保留布尔值",
    test: function () {
      translate.waitingExecute.use = true;
      translate.config.set({ request: { waitingExecute: false } });
      return translate.waitingExecute.use === false;
    }
  },
  {
    remark: "request.listener.delayExecuteTime 接受数值 0",
    test: function () {
      translate.config.set({ request: { listener: { delayExecuteTime: 0 } } });
      return translate.request.listener.delayExecuteTime === 0;
    }
  },
  {
    remark: "request.listener.delayExecuteTime 接受数值 120",
    test: function () {
      translate.config.set({ request: { listener: { delayExecuteTime: 120 } } });
      return translate.request.listener.delayExecuteTime === 120;
    }
  },
  {
    remark: "request.listener.minIntervalTime 接受数值 0",
    test: function () {
      translate.config.set({ request: { listener: { minIntervalTime: 0 } } });
      return translate.request.listener.minIntervalTime === 0;
    }
  },
  {
    remark: "request.listener.minIntervalTime 接受数值 120",
    test: function () {
      translate.config.set({ request: { listener: { minIntervalTime: 120 } } });
      return translate.request.listener.minIntervalTime === 120;
    }
  },
  {
    remark: "request.api.language 的空字符串作为显式配置保留",
    test: function () {
      translate.request.api.language = 'before';
      translate.config.set({ request: { api: { language: '' } } });
      return translate.request.api.language === '';
    }
  },
  {
    remark: "request.api.ip 的空字符串作为显式配置保留",
    test: function () {
      translate.request.api.ip = 'before';
      translate.config.set({ request: { api: { ip: '' } } });
      return translate.request.api.ip === '';
    }
  },
  {
    remark: "request.api.connectTest 的空字符串作为显式配置保留",
    test: function () {
      translate.request.api.connectTest = 'before';
      translate.config.set({ request: { api: { connectTest: '' } } });
      return translate.request.api.connectTest === '';
    }
  },
  {
    remark: "request.api.init 的空字符串作为显式配置保留",
    test: function () {
      translate.request.api.init = 'before';
      translate.config.set({ request: { api: { init: '' } } });
      return translate.request.api.init === '';
    }
  },
  {
    remark: "progress.style 的空字符串作为显式配置保留",
    test: function () {
      translate.progress.style = 'before';
      translate.config.set({ progress: { style: '' } });
      return translate.progress.style === '';
    }
  },
  {
    remark: "images 接受非空数组",
    test: function () {
      const value = [{ key: '/old.png', value: '/new.png' }];
      translate.config.set({ images: value });
      return JSON.stringify(translate.images.queues) === JSON.stringify(value);
    }
  },
  {
    remark: "images 接受空数组以清空当前列表",
    test: function () {
      translate.images.queues = [{ key: '/old.png', value: '/new.png' }];
      translate.config.set({ images: [] });
      return Array.isArray(translate.images.queues) && translate.images.queues.length === 0;
    }
  },
  {
    remark: "ignore.text 接受非空数组",
    test: function () {
      const value = ['忽略😀'];
      translate.config.set({ ignore: { text: value } });
      return JSON.stringify(translate.ignore.text) === JSON.stringify(value);
    }
  },
  {
    remark: "ignore.text 接受空数组以清空当前列表",
    test: function () {
      translate.ignore.text = ['忽略😀'];
      translate.config.set({ ignore: { text: [] } });
      return Array.isArray(translate.ignore.text) && translate.ignore.text.length === 0;
    }
  },
  {
    remark: "ignore.id 接受非空数组",
    test: function () {
      const value = ['ignored-id'];
      translate.config.set({ ignore: { id: value } });
      return JSON.stringify(translate.ignore.id) === JSON.stringify(value);
    }
  },
  {
    remark: "ignore.id 接受空数组以清空当前列表",
    test: function () {
      translate.ignore.id = ['ignored-id'];
      translate.config.set({ ignore: { id: [] } });
      return Array.isArray(translate.ignore.id) && translate.ignore.id.length === 0;
    }
  },
  {
    remark: "ignore.tag 接受非空数组",
    test: function () {
      const value = ['custom-tag'];
      translate.config.set({ ignore: { tag: value } });
      return JSON.stringify(translate.ignore.tag) === JSON.stringify(value);
    }
  },
  {
    remark: "ignore.tag 接受空数组以清空当前列表",
    test: function () {
      translate.ignore.tag = ['custom-tag'];
      translate.config.set({ ignore: { tag: [] } });
      return Array.isArray(translate.ignore.tag) && translate.ignore.tag.length === 0;
    }
  },
  {
    remark: "whole.class 接受非空数组",
    test: function () {
      const value = ['whole-class'];
      translate.config.set({ whole: { class: value } });
      return JSON.stringify(translate.whole.class) === JSON.stringify(value);
    }
  },
  {
    remark: "whole.class 接受空数组以清空当前列表",
    test: function () {
      translate.whole.class = ['whole-class'];
      translate.config.set({ whole: { class: [] } });
      return Array.isArray(translate.whole.class) && translate.whole.class.length === 0;
    }
  },
  {
    remark: "whole.tag 接受非空数组",
    test: function () {
      const value = ['article'];
      translate.config.set({ whole: { tag: value } });
      return JSON.stringify(translate.whole.tag) === JSON.stringify(value);
    }
  },
  {
    remark: "whole.tag 接受空数组以清空当前列表",
    test: function () {
      translate.whole.tag = ['article'];
      translate.config.set({ whole: { tag: [] } });
      return Array.isArray(translate.whole.tag) && translate.whole.tag.length === 0;
    }
  },
  {
    remark: "whole.id 接受非空数组",
    test: function () {
      const value = ['whole-id'];
      translate.config.set({ whole: { id: value } });
      return JSON.stringify(translate.whole.id) === JSON.stringify(value);
    }
  },
  {
    remark: "whole.id 接受空数组以清空当前列表",
    test: function () {
      translate.whole.id = ['whole-id'];
      translate.config.set({ whole: { id: [] } });
      return Array.isArray(translate.whole.id) && translate.whole.id.length === 0;
    }
  },
  {
    remark: "request.api.host 接受非空数组",
    test: function () {
      const value = ['https://local.example/'];
      translate.config.set({ request: { api: { host: value } } });
      return JSON.stringify(translate.request.api.host) === JSON.stringify(value);
    }
  },
  {
    remark: "request.api.host 接受空数组以清空当前列表",
    test: function () {
      translate.request.api.host = ['https://local.example/'];
      translate.config.set({ request: { api: { host: [] } } });
      return Array.isArray(translate.request.api.host) && translate.request.api.host.length === 0;
    }
  },
  {
    remark: "element.tagAttribute 接受非空数组",
    test: function () {
      const value = [{ tag: 'input', attributes: ['value'] }];
      translate.config.set({ element: { tagAttribute: value } });
      return JSON.stringify(translate.element.tagAttribute) === JSON.stringify(value);
    }
  },
  {
    remark: "element.tagAttribute 接受空数组以清空当前列表",
    test: function () {
      translate.element.tagAttribute = [{ tag: 'input', attributes: ['value'] }];
      translate.config.set({ element: { tagAttribute: [] } });
      return Array.isArray(translate.element.tagAttribute) && translate.element.tagAttribute.length === 0;
    }
  },
  {
    remark: "network.rules 接受非空数组",
    test: function () {
      const value = [{ url: '/api/*', method: 'GET' }];
      translate.config.set({ network: { rules: value } });
      return JSON.stringify(translate.network.rules) === JSON.stringify(value);
    }
  },
  {
    remark: "network.rules 接受空数组以清空当前列表",
    test: function () {
      translate.network.rules = [{ url: '/api/*', method: 'GET' }];
      translate.config.set({ network: { rules: [] } });
      return Array.isArray(translate.network.rules) && translate.network.rules.length === 0;
    }
  },
  {
    remark: "language.range 接受非空语种数组",
    test: function () {
      translate.config.set({ language: { range: ['english', 'spanish'] } });
      return translate.language.translateLanguagesRange.length === 2 &&
        translate.language.translateLanguagesRange[0] === 'english' && translate.language.translateLanguagesRange[1] === 'spanish';
    }
  },
  {
    remark: "nomenclature 接受完整术语映射",
    test: function () {
      translate.config.set({ nomenclature: { chinese_simplified: { english: { '你好': 'Hello' } } } });
      return translate.nomenclature.data.chinese_simplified.english['你好'] === 'Hello';
    }
  },
  {
    remark: "ignore.textRegex 保留正则对象及其标志",
    test: function () {
      translate.config.set({ ignore: { textRegex: [/^skip/u] } });
      return translate.ignore.textRegex.length === 1 && translate.ignore.textRegex[0].source === '^skip' && translate.ignore.textRegex[0].flags === 'u';
    }
  },
  {
    remark: "ignore.class 同时保留类名列表和条件函数",
    test: function () {
      const condition = function () { return true; };
      translate.config.set({ ignore: { class: { data: ['ignored'], conditionFunction: { ignored: condition } } } });
      return translate.ignore.class.data[0] === 'ignored' && translate.ignore.class.conditionFunction.ignored === condition;
    }
  },
  {
    remark: "request.appendParams 保留零值和空字符串",
    test: function () {
      translate.config.set({ request: { appendParams: { zero: 0, text: '' } } });
      return translate.request.appendParams.zero === 0 && translate.request.appendParams.text === '';
    }
  },
  {
    remark: "request.appendHeaders 保留请求头名称和值",
    test: function () {
      translate.config.set({ request: { appendHeaders: { 'X-Test': '中文' } } });
      return translate.request.appendHeaders['X-Test'] === '中文';
    }
  },
  {
    remark: "documents 接受指定 DOM 数组而不扩大范围",
    test: function () {
      const node = document.createElement('section');
      translate.config.set({ documents: [node] });
      return translate.documents.length === 1 && translate.documents[0] === node;
    }
  },
  {
    remark: "仅更新一个字段时其他已配置字段保持不变",
    test: function () {
      translate.selectLanguageTag.show = false;
      translate.language.local = 'chinese_simplified';
      translate.config.set({ language: { select: { documentId: 'updated' } } });
      return translate.selectLanguageTag.documentId === 'updated' && translate.selectLanguageTag.show === false &&
        translate.language.local === 'chinese_simplified';
    }
  },
  {
    remark: "省略参数 不会重置已有配置",
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.selectLanguageTag.show = false;
      const result = translate.config.set();
      return result === undefined && translate.language.local === 'chinese_simplified' && translate.selectLanguageTag.show === false;
    }
  },
  {
    remark: "显式 undefined 不会重置已有配置",
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.selectLanguageTag.show = false;
      const result = translate.config.set(undefined);
      return result === undefined && translate.language.local === 'chinese_simplified' && translate.selectLanguageTag.show === false;
    }
  },
  {
    remark: "null 不会重置已有配置",
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.selectLanguageTag.show = false;
      const result = translate.config.set(null);
      return result === undefined && translate.language.local === 'chinese_simplified' && translate.selectLanguageTag.show === false;
    }
  },
  {
    remark: "空字符串 不会重置已有配置",
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.selectLanguageTag.show = false;
      const result = translate.config.set('');
      return result === undefined && translate.language.local === 'chinese_simplified' && translate.selectLanguageTag.show === false;
    }
  },
  {
    remark: "数字 不会重置已有配置",
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.selectLanguageTag.show = false;
      const result = translate.config.set(123);
      return result === undefined && translate.language.local === 'chinese_simplified' && translate.selectLanguageTag.show === false;
    }
  },
  {
    remark: "布尔 false 不会重置已有配置",
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.selectLanguageTag.show = false;
      const result = translate.config.set(false);
      return result === undefined && translate.language.local === 'chinese_simplified' && translate.selectLanguageTag.show === false;
    }
  },
  {
    remark: "空对象 不会重置已有配置",
    test: function () {
      translate.language.local = 'chinese_simplified';
      translate.selectLanguageTag.show = false;
      const result = translate.config.set({});
      return result === undefined && translate.language.local === 'chinese_simplified' && translate.selectLanguageTag.show === false;
    }
  },
  {
    remark: "language 为 null 时当作省略处理",
    test: function () {
      translate.language.local = 'chinese_simplified';
      const result = translate.config.set({ language: null });
      return result === undefined && translate.language.local === 'chinese_simplified';
    }
  },
  {
    remark: "listener 为 null 时当作省略处理",
    test: function () {
      translate.language.local = 'chinese_simplified';
      const result = translate.config.set({ listener: null });
      return result === undefined && translate.language.local === 'chinese_simplified';
    }
  },
  {
    remark: "ignore 为 null 时当作省略处理",
    test: function () {
      translate.language.local = 'chinese_simplified';
      const result = translate.config.set({ ignore: null });
      return result === undefined && translate.language.local === 'chinese_simplified';
    }
  },
  {
    remark: "whole 为 null 时当作省略处理",
    test: function () {
      translate.language.local = 'chinese_simplified';
      const result = translate.config.set({ whole: null });
      return result === undefined && translate.language.local === 'chinese_simplified';
    }
  },
  {
    remark: "selectionTranslate 为 null 时当作省略处理",
    test: function () {
      translate.language.local = 'chinese_simplified';
      const result = translate.config.set({ selectionTranslate: null });
      return result === undefined && translate.language.local === 'chinese_simplified';
    }
  },
  {
    remark: "request 为 null 时当作省略处理",
    test: function () {
      translate.language.local = 'chinese_simplified';
      const result = translate.config.set({ request: null });
      return result === undefined && translate.language.local === 'chinese_simplified';
    }
  },
  {
    remark: "element 为 null 时当作省略处理",
    test: function () {
      translate.language.local = 'chinese_simplified';
      const result = translate.config.set({ element: null });
      return result === undefined && translate.language.local === 'chinese_simplified';
    }
  },
  {
    remark: "progress 为 null 时当作省略处理",
    test: function () {
      translate.language.local = 'chinese_simplified';
      const result = translate.config.set({ progress: null });
      return result === undefined && translate.language.local === 'chinese_simplified';
    }
  },
  {
    remark: "network 为 null 时当作省略处理",
    test: function () {
      translate.language.local = 'chinese_simplified';
      const result = translate.config.set({ network: null });
      return result === undefined && translate.language.local === 'chinese_simplified';
    }
  },
  {
    remark: "visual 为 null 时当作省略处理",
    test: function () {
      translate.language.local = 'chinese_simplified';
      const result = translate.config.set({ visual: null });
      return result === undefined && translate.language.local === 'chinese_simplified';
    }
  },
  {
    remark: "language.select.show 不把字符串 false 当成布尔配置",
    test: function () {
      translate.selectLanguageTag.show = true;
      translate.config.set({ language: { select: { show: 'false' } } });
      return translate.selectLanguageTag.show === true;
    }
  },
  {
    remark: "listener.use 不把字符串 false 当成布尔配置",
    test: function () {
      translate.listener.use = true;
      translate.config.set({ listener: { use: 'false' } });
      return translate.listener.use === true;
    }
  },
  {
    remark: "whole.enableAll 不把字符串 false 当成布尔配置",
    test: function () {
      translate.whole.isEnableAll = true;
      translate.config.set({ whole: { enableAll: 'false' } });
      return translate.whole.isEnableAll === true;
    }
  },
  {
    remark: "request.sse.use 不把字符串 false 当成布尔配置",
    test: function () {
      translate.request.sse.use = true;
      translate.config.set({ request: { sse: { use: 'false' } } });
      return translate.request.sse.use === true;
    }
  },
  {
    remark: "language.select.languages 的空白字符串不覆盖已有有效配置",
    test: function () {
      translate.selectLanguageTag.languages = 'before';
      translate.config.set({ language: { select: { languages: '   ' } } });
      return translate.selectLanguageTag.languages === 'before';
    }
  },
  {
    remark: "language.select.documentId 的空白字符串不覆盖已有有效配置",
    test: function () {
      translate.selectLanguageTag.documentId = 'before';
      translate.config.set({ language: { select: { documentId: '   ' } } });
      return translate.selectLanguageTag.documentId === 'before';
    }
  },
  {
    remark: "language.local 的空白字符串不覆盖已有有效配置",
    test: function () {
      translate.language.local = 'before';
      translate.config.set({ language: { local: '   ' } });
      return translate.language.local === 'before';
    }
  },
  {
    remark: "language.defaultTo 的空白字符串不覆盖已有有效配置",
    test: function () {
      translate.language.defaultTo = 'before';
      translate.config.set({ language: { defaultTo: '   ' } });
      return translate.language.defaultTo === 'before';
    }
  },
  {
    remark: "service 的空白字符串不覆盖已有有效配置",
    test: function () {
      translate.service.name = 'before';
      translate.config.set({ service: '   ' });
      return translate.service.name === 'before';
    }
  },
  {
    remark: "启用本地语种自动识别时调用既有设置流程",
    test: function () {
      translate.autoDiscriminateLocalLanguage = false;
      translate.config.set({ language: { autoDiscriminateLocalLanguage: true } });
      return translate.autoDiscriminateLocalLanguage === true;
    }
  },
  {
    remark: "selectionTranslate.use 首次启用调用启动方法，重复配置不重复启动",
    test: function () {
      translate.selectionTranslate.use = false;
      let calls = 0;
      translate.selectionTranslate.start = function () { calls++; translate.selectionTranslate.use = true; };
      translate.config.set({ selectionTranslate: { use: true } });
      translate.config.set({ selectionTranslate: { use: true } });
      return calls === 1 && translate.selectionTranslate.use === true;
    }
  },
  {
    remark: "progress.api.use 首次启用调用启动方法，重复配置不重复启动",
    test: function () {
      translate.progress.api.use = false;
      let calls = 0;
      translate.progress.api.startUITip = function () { calls++; translate.progress.api.use = true; };
      translate.config.set({ progress: { api: { use: true } } });
      translate.config.set({ progress: { api: { use: true } } });
      return calls === 1 && translate.progress.api.use === true;
    }
  },
  {
    remark: "network.use 首次启用调用启动方法，重复配置不重复启动",
    test: function () {
      translate.network.isUse = false;
      let calls = 0;
      translate.network.use = function () { calls++; translate.network.isUse = true; };
      translate.config.set({ network: { use: true } });
      translate.config.set({ network: { use: true } });
      return calls === 1 && translate.network.isUse === true;
    }
  },
  {
    remark: "visual.webPageLoadTranslateBeforeHiddenText.use 首次启用调用启动方法，重复配置不重复启动",
    test: function () {
      translate.visual.webPageLoadTranslateBeforeHiddenText_use = false;
      let calls = 0;
      translate.visual.webPageLoadTranslateBeforeHiddenText = function () { calls++; translate.visual.webPageLoadTranslateBeforeHiddenText_use = true; };
      translate.config.set({ visual: { webPageLoadTranslateBeforeHiddenText: { use: true } } });
      translate.config.set({ visual: { webPageLoadTranslateBeforeHiddenText: { use: true } } });
      return calls === 1 && translate.visual.webPageLoadTranslateBeforeHiddenText_use === true;
    }
  }
]);
