'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '还原真实文本节点的原文，保留 DOM 节点身份和原有元素结构',
    test: function () {
      const element = document.createElement('p');
      const text = document.createTextNode('Hello');
      element.append(text);
      document.body.append(element);
      translate.node.set(text, { originalText: '你好', resultText: 'Hello', attribute: '' });
      translate.reset({ selectLanguageRefreshRender: false });
      return text.nodeValue === '你好' && element.firstChild === text && document.body.firstChild === element && translate.node.data.size === 0;
    }
  },
  {
    remark: '还原 title 属性节点，不把原文写入元素的 nodeValue',
    test: function () {
      const element = document.createElement('span');
      element.title = 'Hello';
      const attr = element.getAttributeNode('title');
      translate.node.set(attr, { originalText: '中文提示', attribute: 'title' });
      translate.reset({ selectLanguageRefreshRender: false });
      return element.title === '中文提示' && element.getAttributeNode('title') === attr && element.nodeValue === null;
    }
  },
  {
    remark: '还原 input 当前 value，保留 value 属性的默认值',
    test: function () {
      const input = document.createElement('input');
      input.setAttribute('value', '默认值');
      input.value = 'Hello';
      translate.node.set(input, { originalText: '当前值', attribute: 'value' });
      translate.reset({ selectLanguageRefreshRender: false });
      return input.value === '当前值' && input.getAttribute('value') === '默认值';
    }
  },
  {
    remark: '还原 textarea 当前 value，不覆盖默认文本子节点',
    test: function () {
      const textarea = document.createElement('textarea');
      textarea.textContent = '默认内容';
      textarea.value = 'Hello';
      translate.node.set(textarea, { originalText: '当前内容', attribute: 'value' });
      translate.reset({ selectLanguageRefreshRender: false });
      return textarea.value === '当前内容' && textarea.textContent === '默认内容';
    }
  },
  {
    remark: '同一 input 的 value 和 placeholder 可以分别还原',
    test: function () {
      const input = document.createElement('input');
      input.value = 'Hello';
      input.placeholder = 'Please type';
      translate.node.set(input, { originalText: '你好', attribute: 'value' });
      translate.node.set(input.getAttributeNode('placeholder'), { originalText: '请输入', attribute: 'placeholder' });
      translate.reset({ selectLanguageRefreshRender: false });
      return input.value === '你好' && input.placeholder === '请输入';
    }
  },
  {
    remark: '原文为空字符串也必须还原，不能按假值跳过',
    test: function () {
      const node = document.createTextNode('Hello');
      translate.node.set(node, { originalText: '', attribute: '' });
      translate.reset({ selectLanguageRefreshRender: false });
      return node.nodeValue === '';
    }
  },
  {
    remark: '原文中的空格、换行、中文和 emoji 完整还原',
    test: function () {
      const node = document.createTextNode('Hello');
      translate.node.set(node, { originalText: '  中文\n😀\t', attribute: '' });
      translate.reset({ selectLanguageRefreshRender: false });
      return node.nodeValue === '  中文\n😀\t';
    }
  },
  {
    remark: '尚未记录原文的节点保持当前内容，相关记录仍清空',
    test: function () {
      const node = document.createTextNode('保留');
      translate.node.set(node, { resultText: '保留' });
      translate.reset({ selectLanguageRefreshRender: false });
      return node.nodeValue === '保留' && translate.node.data.size === 0;
    }
  },
  {
    remark: '非字符串原文不会被强制转换后覆盖页面内容',
    test: function () {
      const values = [null, undefined, false, 0, {}, []];
      const nodes = values.map(value => {
        const node = document.createTextNode('保留');
        translate.node.set(node, { originalText: value });
        return node;
      });
      translate.reset({ selectLanguageRefreshRender: false });
      return nodes.every(node => node.nodeValue === '保留') && translate.node.data.size === 0;
    }
  },
  {
    remark: '已离开文档的文本节点也可以还原',
    test: function () {
      const node = document.createTextNode('Hello');
      document.body.append(node);
      translate.node.set(node, { originalText: '你好', attribute: '' });
      node.remove();
      translate.reset({ selectLanguageRefreshRender: false });
      return node.nodeValue === '你好' && node.parentNode === null;
    }
  },
  {
    remark: '清除队列、耗时和执行状态，使后续任务可以重新开始',
    test: function () {
      translate.nodeQueue = { old: { list: { english: {} } } };
      translate.time.execute.data = { old: 123 };
      translate.state = 2;
      translate.init_first_trigger_execute = true;
      translate.reset({ selectLanguageRefreshRender: false });
      return Object.keys(translate.nodeQueue).length === 0 && Object.keys(translate.time.execute.data).length === 0 &&
        translate.state === 0 && translate.init_first_trigger_execute === undefined;
    }
  },
  {
    remark: '清除翻译目标和双向历史记录，保留无关存储与翻译缓存',
    test: function () {
      translate.to = 'english';
      translate.storage.set('to', 'english');
      translate.storage.set('custom-key', '保留');
      translate.storage.set('hash_english_123', '缓存');
      translate.history.translateText.add('你好', 'Hello');
      translate.reset({ selectLanguageRefreshRender: false });
      return translate.to === null && translate.storage.get('to') === '' && translate.storage.get('custom-key') === '保留' &&
        translate.storage.get('hash_english_123') === '缓存' && translate.history.translateText.originalMap.size === 0 &&
        translate.history.translateText.resultMap.size === 0;
    }
  },
  {
    remark: '不传配置时默认刷新语言选择器一次',
    test: function () {
      // 选择器自身另有模块覆盖，此处只观察 reset 是否按配置调用它。
      let refreshes = 0;
      translate.selectLanguageTag.refreshRender = function () { refreshes++; };
      const result = translate.reset();
      return result === undefined && refreshes === 1 && translate.state === 0;
    }
  },
  {
    remark: '空配置沿用默认刷新，并保留调用方附加字段',
    test: function () {
      let refreshes = 0;
      translate.selectLanguageTag.refreshRender = function () { refreshes++; };
      const config = { custom: '保留' };
      translate.reset(config);
      return refreshes === 1 && config.custom === '保留';
    }
  },
  {
    remark: 'selectLanguageRefreshRender 为 false 时跳过刷新但仍完成还原',
    test: function () {
      let refreshes = 0;
      translate.selectLanguageTag.refreshRender = function () { refreshes++; };
      const node = document.createTextNode('Hello');
      translate.node.set(node, { originalText: '你好' });
      translate.reset({ selectLanguageRefreshRender: false, notTranslateTip: false });
      return refreshes === 0 && node.nodeValue === '你好' && translate.state === 0;
    }
  },
  {
    remark: '显式开启刷新并关闭提示时仍执行一次刷新',
    test: function () {
      let refreshes = 0;
      translate.selectLanguageTag.refreshRender = function () { refreshes++; };
      translate.reset({ selectLanguageRefreshRender: true, notTranslateTip: false });
      return refreshes === 1 && translate.to === null;
    }
  },
  {
    remark: '启用提示但关闭刷新时不改变刷新开关的行为',
    test: function () {
      let refreshes = 0;
      translate.selectLanguageTag.refreshRender = function () { refreshes++; };
      translate.reset({ selectLanguageRefreshRender: false, notTranslateTip: true });
      return refreshes === 0 && translate.to === null && translate.state === 0;
    }
  },
  {
    remark: '反复重置保持原文且不丢失节点身份',
    test: function () {
      const node = document.createTextNode('Hello');
      document.body.append(node);
      translate.node.set(node, { originalText: '你好', attribute: '' });
      translate.reset({ selectLanguageRefreshRender: false });
      translate.reset({ selectLanguageRefreshRender: false });
      return node.nodeValue === '你好' && document.body.firstChild === node && translate.node.data.size === 0 && translate.state === 0;
    }
  },
  {
    remark: '先停止真实 DOM 监听再还原，后续页面修改不会重新进入翻译队列',
    test: async function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.listener.start();
      // start 只打开开关；这里补齐初始化阶段实际启动观察器的步骤，防止空测。
      translate.listener.addListener();
      const wasStarted = translate.listener.isStart === true;
      translate.reset({ selectLanguageRefreshRender: false });
      document.body.append(document.createTextNode('新的中文'));
      await new Promise(resolve => setTimeout(resolve, 80));
      return wasStarted && translate.listener.isStart === false && translate.node.data.size === 0 && Object.keys(translate.nodeQueue).length === 0;
    }
  }
]);
