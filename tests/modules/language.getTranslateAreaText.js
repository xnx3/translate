'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '全页文本提取会去掉普通空格、制表符和换行',
    test: function () {
      document.head.querySelectorAll('title').forEach(node => node.remove());
      document.body.textContent = ' 你好\t 世界\n ';
      translate.documents = [];
      return translate.language.getTranslateAreaText() === '你好世界';
    }
  },
  {
    remark: '只读取明确指定的翻译区域，排除区域外文本',
    test: function () {
      document.body.innerHTML = '<div id="inside">Hello world</div><p>区域外文字</p>';
      translate.documents = [document.querySelector('#inside')];
      return translate.language.getTranslateAreaText() === 'Helloworld';
    }
  },
  {
    remark: '多个指定区域按配置顺序提取文本',
    test: function () {
      document.body.innerHTML = '<div id="one">甲</div><div id="two">乙</div>';
      translate.documents = [document.querySelector('#two'), document.querySelector('#one')];
      return translate.language.getTranslateAreaText() === '乙甲';
    }
  },
  {
    remark: '默认忽略 code 和 pre 标签内的文字',
    test: function () {
      document.body.innerHTML = '<div id="inside">甲<code>IGNORE</code><pre>IGNORE</pre>乙</div>';
      translate.documents = [document.querySelector('#inside')];
      return translate.language.getTranslateAreaText() === '甲乙';
    }
  },
  {
    remark: '移除忽略标签时不修改真实页面 DOM',
    test: function () {
      document.body.innerHTML = '<div id="inside">甲<code>原始代码</code>乙</div>';
      translate.documents = [document.querySelector('#inside')];
      translate.language.getTranslateAreaText();
      return document.querySelector('code').textContent === '原始代码' && document.querySelector('#inside').textContent === '甲原始代码乙';
    }
  },
  {
    remark: '指定区域数组中的 null 元素不会妨碍有效区域',
    test: function () {
      const node = document.createElement('div');
      node.textContent = '有效文本';
      document.body.appendChild(node);
      translate.documents = [null, node];
      return translate.language.getTranslateAreaText() === '有效文本';
    }
  },
  { remark: '[C03] 采样仅保留范围中可见且未忽略的正文', test: function () {
    const source = document.createElement('section');
    source.innerHTML = 'Hello<span class="ignore">隐藏</span><b hidden>secret</b>';
    document.body.append(source);
    translate.setDocuments([source]);
    return translate.language.getTranslateAreaText() === 'Hello';
  } },
  { remark: '[C04] 采样支持直接指定的 Text 根', test: function () {
    const text = document.createTextNode('Bonjour');
    document.body.append(text);
    translate.setDocuments([text]);
    return translate.language.getTranslateAreaText() === 'Bonjour';
  } },
  { remark: '[C05] 空区域采样不覆盖手动设置的源语种', test: function () {
    translate.language.setLocal('french');
    const empty = document.createElement('section');
    document.body.append(empty);
    translate.setDocuments([empty]);
    return translate.language.getTranslateAreaText() === '' && translate.language.getLocal() === 'french';
  } }
]);
