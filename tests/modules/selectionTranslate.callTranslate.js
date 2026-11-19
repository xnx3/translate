'use strict';

require('../helpers/module')(__filename, [
  {
    remark: "没有选中文本时不发送请求",
    test: function () {
      let count=0;
      translate.request.post=()=>{count++;};
      window.getSelection().removeAllRanges();
      translate.selectionTranslate.callTranslate({});
      return count===0;
    }
  },
  {
    remark: "翻译接口配置无效时不发送请求：",
    test: function () {
      document.body.textContent='你好世界';
      const range=document.createRange();
      range.selectNodeContents(document.body);
      window.getSelection().addRange(range);
      translate.request.api.translate="";
      let count=0;
      translate.request.post=()=>{count++;};
      translate.selectionTranslate.callTranslate({});
      return count===0;
    }
  },
  {
    remark: "翻译接口配置无效时不发送请求：null",
    test: function () {
      document.body.textContent='你好世界';
      const range=document.createRange();
      range.selectNodeContents(document.body);
      window.getSelection().addRange(range);
      translate.request.api.translate=null;
      let count=0;
      translate.request.post=()=>{count++;};
      translate.selectionTranslate.callTranslate({});
      return count===0;
    }
  },
  {
    remark: "翻译接口配置无效时不发送请求：42",
    test: function () {
      document.body.textContent='你好世界';
      const range=document.createRange();
      range.selectNodeContents(document.body);
      window.getSelection().addRange(range);
      translate.request.api.translate=42;
      let count=0;
      translate.request.post=()=>{count++;};
      translate.selectionTranslate.callTranslate({});
      return count===0;
    }
  },
  {
    remark: "选中文本按当前语种封装并显示响应结果",
    test: function () {
      translate.selectionTranslate.start();
      const text=document.createTextNode('你好世界');
      document.body.prepend(text);
      const range=document.createRange();
      range.selectNodeContents(text);
      window.getSelection().addRange(range);
      translate.language.local='chinese_simplified';
      translate.to='english';
      window.selectionX=10;window.selectionY=20;
      let observed;
      translate.request.post=(url,data,callback)=>{observed=data;callback({result:1,text:['Hello world']});};
      translate.selectionTranslate.callTranslate({});
      const tooltip=document.getElementById('translateTooltip');
      return observed.from==='chinese_simplified' && observed.to==='english' && JSON.parse(decodeURIComponent(observed.text))[0]==='你好世界' && tooltip.innerText==='Hello world' && tooltip.style.left==='60px' && tooltip.style.top==='40px';
    }
  },
  {
    remark: "接口返回失败时不覆盖已有提示文本",
    test: function () {
      translate.selectionTranslate.start();
      const node=document.createTextNode('hello');
      document.body.prepend(node);
      const range=document.createRange();range.selectNodeContents(node);window.getSelection().addRange(range);
      const tooltip=document.getElementById('translateTooltip');tooltip.innerText='keep';
      translate.request.post=(url,data,callback)=>callback({result:0,info:'offline'});
      translate.selectionTranslate.callTranslate({});
      return tooltip.innerText==='keep';
    }
  },
  ...[
    { label: '[E06] 跨节点首尾偏移相同', anchor: 1, focus: 1, reverse: false, expected: '乙丙' },
    { label: '反向选中跨节点文本', anchor: 1, focus: 1, reverse: true, expected: '乙丙' },
    { label: '跨节点选中含 emoji 和保留字符的全文', anchor: 0, focus: 7, reverse: false, expected: '甲乙丙&+% 😀' }
  ].map(input => ({
    remark: input.label + '时只发送一次，并保留选区文本',
    input,
    test: function ({ anchor, focus, reverse, expected }) {
      const left = document.createTextNode('甲乙');
      const right = document.createTextNode('丙&+% 😀');
      document.body.append(left, right);
      const selection = window.getSelection();
      if (reverse) selection.setBaseAndExtent(right, focus, left, anchor);
      else selection.setBaseAndExtent(left, anchor, right, focus);
      const sent = [];
      translate.request.post = (url, data) => sent.push(JSON.parse(decodeURIComponent(data.text)));
      translate.selectionTranslate.callTranslate(new MouseEvent('mouseup'));
      return selection.toString() === expected && sent.length === 1 &&
        sent[0].length === 1 && sent[0][0] === expected;
    }
  })),
  {
    remark: '光标折叠在非零偏移时不发送请求',
    test: function () {
      const text = document.createTextNode('甲乙');
      document.body.append(text);
      window.getSelection().collapse(text, 1);
      let sent = 0;
      translate.request.post = () => { sent++; };
      translate.selectionTranslate.callTranslate();
      return window.getSelection().isCollapsed && sent === 0;
    }
  },
  {
    remark: '参数组合：连续选择两个词且响应反序时提示保留最近选中的词',
    test: function () {
      translate.selectionTranslate.start();
      const first = document.createTextNode('first'), second = document.createTextNode('second');
      document.body.append(first, second);
      const pending = [], selection = window.getSelection();
      translate.request.post = (url, data, complete) => pending.push({data, complete});
      window.selectionX = 0; window.selectionY = 0;
      for (const node of [first, second]) {
        selection.setBaseAndExtent(node, 0, node, node.length);
        translate.selectionTranslate.callTranslate(new MouseEvent('mouseup'));
      }
      if (pending.length !== 2) return false;
      pending[1].complete({result: 1, text: ['第二个']}, pending[1].data);
      pending[0].complete({result: 1, text: ['第一个']}, pending[0].data);
      return selection.toString() === 'second' &&
        document.getElementById('translateTooltip').textContent === '第二个';
    }
  }
]);
