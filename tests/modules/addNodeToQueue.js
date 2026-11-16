'use strict';

require('../helpers/module')(__filename, [
  { remark: '不传任何参数时安全结束', args: [], expected: undefined },
  { remark: '节点为 null 时不进入入队流程', args: ['batch', null, 'Hello', ''], expected: undefined },
  {
    remark: 'text 为 null 时不创建节点记录或队列项',
    test: function () {
      const node = document.createTextNode('Hello');
      const result = translate.addNodeToQueue('batch', node, null, '');
      return result === undefined && translate.node.get(node) == null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '空 text 时不创建节点记录或队列项',
    test: function () {
      const node = document.createTextNode('');
      translate.addNodeToQueue('batch', node, '', '');
      return translate.node.get(node) == null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '注释节点即使含有效文字也不参与翻译',
    test: function () {
      const node = document.createComment('Hello world');
      document.body.append(node);
      translate.addNodeToQueue('batch', node, 'Hello world', '');
      return translate.node.get(node) == null && translate.nodeQueue.batch === undefined && node.nodeValue === 'Hello world';
    }
  },
  {
    remark: 'script 文本中的 HTML 标记不能被当成待翻译页面内容',
    test: function () {
      const script = document.createElement('script');
      script.type = 'application/json';
      script.textContent = '{"html":"<b>Hello</b>"}';
      document.body.append(script);
      const node = script.firstChild;
      translate.addNodeToQueue('batch', node, node.nodeValue, '');
      return translate.node.get(node) == null && translate.nodeQueue.batch === undefined && script.textContent === '{"html":"<b>Hello</b>"}';
    }
  },
  {
    remark: 'style 文本中的 HTML 标记不能进入翻译队列',
    test: function () {
      const style = document.createElement('style');
      style.textContent = '/* <b>Hello</b> */';
      document.body.append(style);
      const node = style.firstChild;
      translate.addNodeToQueue('batch', node, node.nodeValue, '');
      return translate.node.get(node) == null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '首次普通文本入队记录完整原文，保留节点且不提前修改 DOM',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello world');
      document.body.append(node);
      const result = translate.addNodeToQueue('batch', node, 'Hello world', '');
      const data = translate.node.get(node);
      const item = Object.values(translate.nodeQueue.batch.list.english)[0];
      return result === undefined && data.originalText === 'Hello world' && data.attribute === '' && data.whole === true &&
        item.original === 'Hello world' && item.nodes[0].node === node && node.nodeValue === 'Hello world';
    }
  },
  {
    remark: '省略 attribute 时按文本节点本身记录',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello');
      translate.addNodeToQueue('batch', node, 'Hello');
      return translate.node.get(node).originalText === 'Hello' && translate.node.get(node).attribute === '' &&
        Object.values(translate.nodeQueue.batch.list.english)[0].original === 'Hello';
    }
  },
  {
    remark: 'title 文本记录在真实 Attr 上，队列仍保留元素和属性名供后续渲染',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('span');
      node.title = 'Hello';
      const attr = node.getAttributeNode('title');
      translate.addNodeToQueue('batch', node, 'Hello', 'title');
      const data = translate.node.get(attr);
      const queued = Object.values(translate.nodeQueue.batch.list.english)[0].nodes[0];
      return data.originalText === 'Hello' && data.attribute === 'title' && translate.node.get(node) == null &&
        queued.node === node && queued.attribute === 'title' && node.title === 'Hello';
    }
  },
  {
    remark: 'input value 记录在元素本身，不能错误使用可能过时的 value Attr',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('input');
      node.setAttribute('value', 'default');
      node.value = 'Hello';
      translate.addNodeToQueue('batch', node, node.value, 'value');
      return translate.node.get(node).originalText === 'Hello' && translate.node.get(node).attribute === 'value' &&
        translate.node.get(node.getAttributeNode('value')) == null && node.value === 'Hello' && node.getAttribute('value') === 'default';
    }
  },
  {
    remark: 'textarea value 记录在元素本身，不修改其默认文本',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('textarea');
      node.textContent = 'default';
      node.value = 'Hello';
      translate.addNodeToQueue('batch', node, node.value, 'value');
      return translate.node.get(node).originalText === 'Hello' && translate.node.get(node).attribute === 'value' &&
        node.value === 'Hello' && node.textContent === 'default';
    }
  },
  {
    remark: '同一 input 的 value 和 placeholder 分别记录与入队',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('input');
      node.value = 'Hello';
      node.placeholder = 'Please type';
      translate.addNodeToQueue('batch', node, node.value, 'value');
      translate.addNodeToQueue('batch', node, node.placeholder, 'placeholder');
      return translate.node.get(node).originalText === 'Hello' && translate.node.get(node.getAttributeNode('placeholder')).originalText === 'Please type' &&
        Object.values(translate.nodeQueue.batch.list.english).length === 2;
    }
  },
  {
    remark: '已扫描节点再次调用不会用新文字覆盖原文或重复创建队列项',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello');
      translate.addNodeToQueue('batch', node, 'Hello', '');
      node.nodeValue = 'changed';
      translate.addNodeToQueue('batch', node, 'changed', '');
      const items = Object.values(translate.nodeQueue.batch.list.english);
      return translate.node.get(node).originalText === 'Hello' && items.length === 1 && items[0].original === 'Hello' &&
        items[0].nodes.length === 1 && node.nodeValue === 'changed';
    }
  },
  {
    remark: '已有空字符串 originalText 也算已扫描，不被新 text 覆盖',
    test: function () {
      const node = document.createTextNode('Hello');
      translate.node.set(node, { originalText: '', custom: 123 });
      translate.addNodeToQueue('batch', node, 'Hello', '');
      return translate.node.get(node).originalText === '' && translate.node.get(node).custom === 123 && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '完全忽略的文本不请求翻译，但记录原文、最终文本及渲染时间',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.ignore.text = ['Hello'];
      const node = document.createTextNode('Hello');
      const before = Date.now();
      translate.addNodeToQueue('batch', node, 'Hello', '');
      const data = translate.node.get(node);
      return translate.nodeQueue.batch === undefined && data.originalText === 'Hello' && data.resultText === 'Hello' &&
        data.lastTranslateRenderTime >= before && Object.keys(data.translateTexts).length === 0 && node.nodeValue === 'Hello';
    }
  },
  {
    remark: '部分忽略文本不进入待译片段，原始全文仍完整记录',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.ignore.text = ['KEEP'];
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('HelloKEEPworld');
      translate.addNodeToQueue('batch', node, 'HelloKEEPworld', '');
      const data = translate.node.get(node);
      const words = Object.values(translate.nodeQueue.batch.list.english).map(item => item.original).sort();
      return JSON.stringify(words) === '["Hello","world"]' && data.originalText === 'HelloKEEPworld' && data.whole === false &&
        Object.hasOwn(data.translateTexts, 'Hello') && Object.hasOwn(data.translateTexts, 'world') && node.nodeValue === 'HelloKEEPworld';
    }
  },
  {
    remark: '忽略正则仅保护当前匹配片段，不修改全局忽略文本配置',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.ignore.text = [];
      translate.ignore.textRegex = [/\{[^}]+\}/g];
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('Hello{user}world');
      translate.addNodeToQueue('batch', node, 'Hello{user}world', '');
      const words = Object.values(translate.nodeQueue.batch.list.english).map(item => item.original).sort();
      return JSON.stringify(words) === '["Hello","world"]' && translate.ignore.text.length === 0 && node.nodeValue === 'Hello{user}world';
    }
  },
  {
    remark: '全文命中自定义术语时直接渲染并记录结果，不创建网络待译项',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      const node = document.createTextNode('你好');
      translate.addNodeToQueue('batch', node, '你好', '');
      const data = translate.node.get(node);
      return node.nodeValue === 'Hello' && data.originalText === '你好' && data.resultText === 'Hello' &&
        Object.keys(data.translateTexts).length === 0 && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '部分术语直接替换，只把尚未命中的原文片段交给后续翻译',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '品牌=Brand');
      translate.nodeQueue.batch = { list: {} };
      const node = document.createTextNode('你好品牌世界');
      translate.addNodeToQueue('batch', node, '你好品牌世界', '');
      const words = Object.values(translate.nodeQueue.batch.list.chinese_simplified).map(item => item.original).sort();
      const data = translate.node.get(node);
      // 英语局部译文遵循现有分词规则，在两侧中文之间补空格。
      return JSON.stringify(words) === '["世界","你好"]' && node.nodeValue === '你好 Brand 世界' && data.originalText === '你好品牌世界' && data.whole === false;
    }
  },
  {
    remark: '属性全文命中术语时更新实际属性并记录在 Attr 上',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      const node = document.createElement('input');
      node.placeholder = '你好';
      translate.addNodeToQueue('batch', node, '你好', 'placeholder');
      const data = translate.node.get(node.getAttributeNode('placeholder'));
      return node.placeholder === 'Hello' && data.originalText === '你好' && data.resultText === 'Hello' && data.attribute === 'placeholder';
    }
  },
  {
    remark: '只含空白文本不会进入网络队列，仍记录原文和当前结果',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      const node = document.createTextNode(' \n\t');
      translate.addNodeToQueue('batch', node, ' \n\t', '');
      const data = translate.node.get(node);
      // 可译文本读取会过滤纯空白；原文记录和实际 DOM 仍须完整保留。
      return translate.nodeQueue.batch === undefined && data.originalText === ' \n\t' && data.resultText === '' && node.nodeValue === ' \n\t';
    }
  },
  {
    remark: '元素加 title 属性名全文命中术语时更新真实属性并保留属性标记',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      const node = document.createElement('span');
      node.title = '你好';
      const attr = node.getAttributeNode('title');
      translate.addNodeToQueue('batch', node, '你好', 'title');
      const data = translate.node.get(attr);
      return node.title === 'Hello' && data.originalText === '你好' && data.resultText === 'Hello' &&
        data.attribute === 'title' && translate.node.get(node) == null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: 'textarea placeholder 全文命中术语时不改变实时输入或默认文本',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      const node = document.createElement('textarea');
      node.textContent = 'default';
      node.value = '用户输入';
      node.placeholder = '你好';
      const attr = node.getAttributeNode('placeholder');
      translate.addNodeToQueue('batch', node, '你好', 'placeholder');
      const data = translate.node.get(attr);
      return node.placeholder === 'Hello' && node.value === '用户输入' && node.defaultValue === 'default' &&
        data.originalText === '你好' && data.resultText === 'Hello' && data.attribute === 'placeholder' &&
        translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '元素加 img alt 属性名全文命中术语时更新替代文本',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      const node = document.createElement('img');
      node.alt = '你好';
      const attr = node.getAttributeNode('alt');
      translate.addNodeToQueue('batch', node, '你好', 'alt');
      const data = translate.node.get(attr);
      return node.alt === 'Hello' && data.originalText === '你好' && data.resultText === 'Hello' &&
        data.attribute === 'alt' && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '元素加 meta content 属性名全文命中术语时更新内容属性',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      const node = document.createElement('meta');
      node.name = 'description';
      node.content = '你好';
      const attr = node.getAttributeNode('content');
      translate.addNodeToQueue('batch', node, '你好', 'content');
      const data = translate.node.get(attr);
      return node.content === 'Hello' && data.originalText === '你好' && data.resultText === 'Hello' &&
        data.attribute === 'content' && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: 'input placeholder 局部命中术语时立即显示译文并只排队剩余片段',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '品牌=Brand');
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('input');
      node.placeholder = '你好品牌世界';
      translate.addNodeToQueue('batch', node, '你好品牌世界', 'placeholder');
      const data = translate.node.get(node.getAttributeNode('placeholder'));
      const words = Object.values(translate.nodeQueue.batch.list.chinese_simplified).map(item => item.original).sort();
      return node.placeholder === '你好 Brand 世界' && JSON.stringify(words) === '["世界","你好"]' &&
        data.originalText === '你好品牌世界' && data.attribute === 'placeholder' && data.whole === false;
    }
  },
  {
    remark: 'textarea placeholder 局部术语替换不影响实时输入和默认文本',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '品牌=Brand');
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('textarea');
      node.textContent = 'default';
      node.value = '用户输入';
      node.placeholder = '你好品牌世界';
      translate.addNodeToQueue('batch', node, '你好品牌世界', 'placeholder');
      const data = translate.node.get(node.getAttributeNode('placeholder'));
      const words = Object.values(translate.nodeQueue.batch.list.chinese_simplified).map(item => item.original).sort();
      return node.placeholder === '你好 Brand 世界' && node.value === '用户输入' && node.defaultValue === 'default' &&
        JSON.stringify(words) === '["世界","你好"]' && data.originalText === '你好品牌世界' &&
        data.attribute === 'placeholder' && data.whole === false;
    }
  },
  {
    remark: '元素加 title 属性名局部命中术语时保留待译片段和完整原文',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '品牌=Brand');
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('span');
      node.title = '你好品牌世界';
      translate.addNodeToQueue('batch', node, '你好品牌世界', 'title');
      const data = translate.node.get(node.getAttributeNode('title'));
      const words = Object.values(translate.nodeQueue.batch.list.chinese_simplified).map(item => item.original).sort();
      return node.title === '你好 Brand 世界' && JSON.stringify(words) === '["世界","你好"]' &&
        data.originalText === '你好品牌世界' && data.attribute === 'title' && data.whole === false;
    }
  },
  {
    remark: '直接传真实 Attr 和空属性名时仍能全文替换术语',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      const node = document.createElement('span');
      node.title = '你好';
      const attr = node.getAttributeNode('title');
      translate.addNodeToQueue('batch', attr, '你好', '');
      const data = translate.node.get(attr);
      return node.title === 'Hello' && attr.nodeValue === 'Hello' && data.originalText === '你好' &&
        data.resultText === 'Hello' && data.attribute === '' && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: 'input 实时 value 命中术语时保留旧 HTML value 并记录实时值',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      const node = document.createElement('input');
      node.setAttribute('value', 'default');
      node.value = '你好';
      translate.addNodeToQueue('batch', node, '你好', 'value');
      const data = translate.node.get(node);
      return node.value === 'Hello' && node.getAttribute('value') === 'default' &&
        data.originalText === '你好' && data.resultText === 'Hello' && data.attribute === 'value' &&
        translate.node.get(node.getAttributeNode('value')) == null && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: 'textarea 实时 value 命中术语时保留默认文本并记录实时值',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      const node = document.createElement('textarea');
      node.textContent = 'default';
      node.value = '你好';
      translate.addNodeToQueue('batch', node, '你好', 'value');
      const data = translate.node.get(node);
      return node.value === 'Hello' && node.defaultValue === 'default' && node.textContent === 'default' &&
        data.originalText === '你好' && data.resultText === 'Hello' && data.attribute === 'value' &&
        translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: 'input placeholder 只有空白时原属性和结果记录都保留完整空白',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      const node = document.createElement('input');
      node.placeholder = ' \n\t';
      translate.addNodeToQueue('batch', node, ' \n\t', 'placeholder');
      const data = translate.node.get(node.getAttributeNode('placeholder'));
      // 普通属性的原有结果读取保留空白，不应套用 Text/Attr 直接读取时的判空规则。
      return node.placeholder === ' \n\t' && data.originalText === ' \n\t' && data.resultText === ' \n\t' &&
        data.attribute === 'placeholder' && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: 'title 只有空白时原属性和结果记录都保留完整空白',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      const node = document.createElement('span');
      node.title = ' \n\t';
      translate.addNodeToQueue('batch', node, ' \n\t', 'title');
      const data = translate.node.get(node.getAttributeNode('title'));
      return node.title === ' \n\t' && data.originalText === ' \n\t' && data.resultText === ' \n\t' &&
        data.attribute === 'title' && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '缺少 placeholder 属性但给出全文术语时不抛错也不创建该属性',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      const node = document.createElement('input');
      const result = translate.addNodeToQueue('batch', node, '你好', 'placeholder');
      return result === undefined && !node.hasAttribute('placeholder') && node.placeholder === '' &&
        translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '缺少 data-label 属性但给出全文术语时不抛错也不创建该属性',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      const node = document.createElement('div');
      const result = translate.addNodeToQueue('batch', node, '你好', 'data-label');
      // 这里只保护原有的安全结束行为，不规定缺失目标的内部记录结构。
      return result === undefined && !node.hasAttribute('data-label') && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '自定义元素同步移除刚翻译的 title 后结果读取当前空属性',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      // 属性回调会在写入时同步执行，覆盖普通 MutationObserver 无法插入的时序。
      customElements.define('translate-title-remove', class extends HTMLElement {
        static get observedAttributes() { return ['title']; }
        attributeChangedCallback(name, oldValue, newValue) {
          if (newValue === 'Hello') this.removeAttribute(name);
        }
      });
      const node = document.createElement('translate-title-remove');
      node.title = '你好';
      const attr = node.getAttributeNode('title');
      translate.addNodeToQueue('batch', node, '你好', 'title');
      const data = translate.node.get(attr);
      return !node.hasAttribute('title') && node.title === '' && attr.ownerElement === null &&
        data.originalText === '你好' && data.resultText === '' && data.attribute === 'title' &&
        translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '自定义元素同步更换 title Attr 后结果读取新属性而不是旧节点',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      customElements.define('translate-title-replace', class extends HTMLElement {
        static get observedAttributes() { return ['title']; }
        attributeChangedCallback(name, oldValue, newValue) {
          if (newValue === 'Hello') {
            this.removeAttribute(name);
            this.setAttribute(name, '用户设置的新值');
          }
        }
      });
      const node = document.createElement('translate-title-replace');
      node.title = '你好';
      const attr = node.getAttributeNode('title');
      translate.addNodeToQueue('batch', node, '你好', 'title');
      const data = translate.node.get(attr);
      return node.title === '用户设置的新值' && node.getAttributeNode('title') !== attr && attr.ownerElement === null &&
        data.originalText === '你好' && data.resultText === '用户设置的新值' && data.attribute === 'title' &&
        translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '自定义元素同步覆盖同一 title Attr 后结果记录回调设置的新值',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.nomenclature.append('chinese_simplified', 'english', '你好=Hello');
      customElements.define('translate-title-overwrite', class extends HTMLElement {
        static get observedAttributes() { return ['title']; }
        attributeChangedCallback(name, oldValue, newValue) {
          if (newValue === 'Hello') this.setAttribute(name, '用户设置的新值');
        }
      });
      const node = document.createElement('translate-title-overwrite');
      node.title = '你好';
      const attr = node.getAttributeNode('title');
      translate.addNodeToQueue('batch', node, '你好', 'title');
      const data = translate.node.get(attr);
      return node.title === '用户设置的新值' && node.getAttributeNode('title') === attr &&
        data.originalText === '你好' && data.resultText === '用户设置的新值' && data.attribute === 'title' &&
        translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '普通 data-label 全文被忽略时保持属性内容且不创建网络待译项',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.ignore.text = ['Hello'];
      const node = document.createElement('div');
      node.setAttribute('data-label', 'Hello');
      translate.addNodeToQueue('batch', node, 'Hello', 'data-label');
      const data = translate.node.get(node.getAttributeNode('data-label'));
      return node.getAttribute('data-label') === 'Hello' && data.originalText === 'Hello' &&
        data.attribute === 'data-label' && translate.nodeQueue.batch === undefined;
    }
  },
  {
    remark: '普通 placeholder 局部被忽略时仅将未忽略片段加入队列',
    test: function () {
      translate.language.setLocal('chinese_simplified');
      translate.to = 'japanese';
      translate.ignore.text = ['KEEP'];
      translate.nodeQueue.batch = { list: {} };
      const node = document.createElement('input');
      node.placeholder = 'HelloKEEPworld';
      translate.addNodeToQueue('batch', node, 'HelloKEEPworld', 'placeholder');
      const data = translate.node.get(node.getAttributeNode('placeholder'));
      const words = Object.values(translate.nodeQueue.batch.list.english).map(item => item.original).sort();
      return node.placeholder === 'HelloKEEPworld' && JSON.stringify(words) === '["Hello","world"]' &&
        data.originalText === 'HelloKEEPworld' && data.attribute === 'placeholder' && data.whole === false;
    }
  }
]);
