'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '单个元素参数被规范为单元素数组后传给触发钩子',
    test: function () {
      const element = document.createElement('p');
      let received;
      // 使用公开钩子终止后续步骤，只验证 execute 自己负责的参数规范过程。
      translate.lifecycle.execute.trigger.push(function (data) { received = data; return false; });
      translate.execute(element);
      return Array.isArray(received.docs) && received.docs.length === 1 && received.docs[0] === element;
    }
  },
  {
    remark: '元素数组保留顺序和引用，不被复制或交换位置',
    test: function () {
      const docs = [document.createElement('p'), document.createElement('div')];
      let received;
      translate.lifecycle.execute.trigger.push(function (data) { received = data; return false; });
      translate.execute(docs);
      return received.docs === docs && received.docs[0] === docs[0] && received.docs[1] === docs[1];
    }
  },
  {
    remark: 'NodeList 参数保持集合及节点顺序',
    test: function () {
      document.body.innerHTML = '<p>a</p><p>b</p>';
      const docs = document.querySelectorAll('p');
      let received;
      translate.lifecycle.execute.trigger.push(function (data) { received = data; return false; });
      translate.execute(docs);
      return received.docs === docs && received.docs.length === 2 && received.docs[1].textContent === 'b';
    }
  },
  {
    remark: 'HTMLCollection 参数保持集合及节点顺序',
    test: function () {
      document.body.innerHTML = '<p>a</p><p>b</p>';
      const docs = document.getElementsByTagName('p');
      let received;
      translate.lifecycle.execute.trigger.push(function (data) { received = data; return false; });
      translate.execute(docs);
      return received.docs === docs && received.docs.length === 2 && received.docs[0].textContent === 'a';
    }
  },
  {
    remark: '显式空数组表示空范围，不回退到整个页面',
    test: function () {
      const docs = [];
      let received;
      translate.lifecycle.execute.trigger.push(function (data) { received = data; return false; });
      translate.execute(docs);
      return received.docs === docs && received.docs.length === 0;
    }
  },
  {
    remark: '单个 Attr 节点参数被放入单元素数组',
    test: function () {
      const element = document.createElement('p');
      element.title = '标题';
      const node = element.getAttributeNode('title');
      let received;
      translate.lifecycle.execute.trigger.push(function (data) { received = data; return false; });
      translate.execute(node);
      return Array.isArray(received.docs) && received.docs.length === 1 && received.docs[0] === node;
    }
  },
  {
    remark: '单个 Document 参数被放入单元素数组',
    test: function () {
      let received;
      translate.lifecycle.execute.trigger.push(function (data) { received = data; return false; });
      translate.execute(document);
      return Array.isArray(received.docs) && received.docs.length === 1 && received.docs[0] === document;
    }
  },
  {
    remark: '省略参数时使用 setDocuments 指定的范围',
    test: function () {
      const docs = [document.createElement('p')];
      translate.setDocuments(docs);
      let received;
      translate.lifecycle.execute.trigger.push(function (data) { received = data; return false; });
      translate.execute();
      return received.docs.length === 1 && received.docs[0] === docs[0];
    }
  },
  {
    remark: 'null 参数与省略参数一样使用预设范围',
    test: function () {
      const element = document.createElement('p');
      translate.setDocuments([element]);
      let received;
      translate.lifecycle.execute.trigger.push(function (data) { received = data; return false; });
      translate.execute(null);
      return received.docs.length === 1 && received.docs[0] === element;
    }
  },
  {
    remark: '显式传入范围优先于 setDocuments 的预设范围',
    test: function () {
      const preset = document.createElement('p');
      const explicit = document.createElement('div');
      translate.setDocuments([preset]);
      let received;
      translate.lifecycle.execute.trigger.push(function (data) { received = data; return false; });
      translate.execute(explicit);
      return received.docs.length === 1 && received.docs[0] === explicit;
    }
  },
  {
    remark: '当前目标为空时先读取已保存语种，再触发 execute 钩子',
    test: function () {
      translate.to = null;
      translate.storage.set('to', 'english');
      let received;
      translate.lifecycle.execute.trigger.push(function (data) { received = data; return false; });
      translate.execute([]);
      return translate.to === 'english' && received.to === 'english';
    }
  },
  {
    remark: '当前目标为空字符串时也能恢复已保存语种',
    test: function () {
      translate.to = '';
      translate.storage.set('to', 'spanish');
      let received;
      translate.lifecycle.execute.trigger.push(function (data) { received = data; return false; });
      translate.execute([]);
      return translate.to === 'spanish' && received.to === 'spanish';
    }
  },
  {
    remark: '已有目标语种优先于上次缓存的语种',
    test: function () {
      translate.to = 'english';
      translate.storage.set('to', 'spanish');
      let received;
      translate.lifecycle.execute.trigger.push(function (data) { received = data; return false; });
      translate.execute([]);
      return translate.to === 'english' && received.to === 'english' && translate.storage.get('to') === 'spanish';
    }
  },
  {
    remark: '钩子阻止执行时不扫描 DOM、不启动网络，仍通知 finally',
    test: function () {
      document.body.textContent = '你好世界';
      const node = document.body.firstChild;
      let finalData;
      let starts = 0;
      translate.lifecycle.execute.trigger.push(function () { return false; });
      translate.lifecycle.execute.start.push(function () { starts++; });
      translate.lifecycle.execute.finally.push(function (data) { finalData = data; });
      const result = translate.execute(document.body);
      return result === undefined && starts === 0 && finalData.state === 2 && node.nodeValue === '你好世界' &&
        translate.node.get(node) == null && Object.keys(translate.request.data).length === 0;
    }
  },
  {
    remark: '连续触发即使被钩子阻止，也分别递增触发次数并生成唯一 uuid',
    test: function () {
      const received = [];
      const before = translate.executeTriggerNumber;
      const completed = translate.executeNumber;
      translate.lifecycle.execute.trigger.push(function (data) { received.push(data); return false; });
      translate.execute([]);
      translate.execute([]);
      return translate.executeTriggerNumber === before + 2 && received[0].executeTriggerNumber === before + 1 &&
        received[1].executeTriggerNumber === before + 2 && typeof received[0].uuid === 'string' && received[0].uuid.length > 0 &&
        received[0].uuid !== received[1].uuid && translate.executeNumber === completed;
    }
  },
  {
    remark: '忙碌状态接收数组参数时进入等待队列，不扫描本次节点',
    test: function () {
      translate.to = 'english';
      translate.state = 20;
      const docs = [document.createElement('p')];
      let finalData;
      translate.lifecycle.execute.finally.push(function (data) { finalData = data; });
      translate.execute(docs);
      clearInterval(translate.waitingExecute.intervalId);
      return translate.waitingExecute.queue.length === 1 && translate.waitingExecute.queue[0] === docs &&
        finalData.state === 4 && translate.state === 20 && translate.node.get(docs[0]) == null;
    }
  },
  {
    remark: '忙碌状态也应接受单个元素参数并加入等待队列',
    test: function () {
      translate.to = 'english';
      translate.state = 20;
      const element = document.createElement('p');
      // 单元素是 execute 已支持的参数形态，排队不能因日志调用 slice 而抛错。
      translate.execute(element);
      clearInterval(translate.waitingExecute.intervalId);
      return translate.waitingExecute.queue.length === 1 && translate.waitingExecute.queue[0] === element;
    }
  },
  {
    remark: '忙碌状态也应接受真实 NodeList 参数并加入等待队列',
    test: function () {
      translate.to = 'english';
      translate.state = 20;
      document.body.innerHTML = '<p>你好世界</p>';
      const docs = document.querySelectorAll('p');
      translate.execute(docs);
      clearInterval(translate.waitingExecute.intervalId);
      return translate.waitingExecute.queue.length === 1 && translate.waitingExecute.queue[0] === docs;
    }
  },
  {
    remark: '没有目标语种且未启用自动识别时结束本轮，不扫描或改变原文',
    test: function () {
      translate.selectLanguageTag.show = false;
      translate.to = null;
      translate.autoDiscriminateLocalLanguage = false;
      translate.storage.set('to', '');
      document.body.textContent = '你好世界';
      const node = document.body.firstChild;
      let finalData;
      translate.lifecycle.execute.finally.push(function (data) { finalData = data; });
      translate.execute([document.body]);
      return finalData.state === 6 && translate.state === 0 && node.nodeValue === '你好世界' && translate.node.get(node) == null;
    }
  },
  {
    remark: '目标等于本地语种且未允许本地翻译时不继续扫描',
    test: function () {
      translate.selectLanguageTag.show = false;
      translate.language.setLocal('chinese_simplified');
      translate.to = 'chinese_simplified';
      translate.language.translateLocal = false;
      document.body.textContent = 'Hello';
      let finalData;
      translate.lifecycle.execute.finally.push(function (data) { finalData = data; });
      translate.execute([document.body]);
      return finalData.state === 8 && translate.state === 0 && document.body.textContent === 'Hello' && translate.node.data.size === 0;
    }
  },
  {
    remark: '空范围也能结束本轮并通知渲染完成，不翻译页面其他内容',
    test: function () {
      translate.selectLanguageTag.show = false;
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      document.body.textContent = '你好世界';
      let finishes = 0;
      let finalData;
      translate.lifecycle.execute.renderFinish.push(function () { finishes++; });
      translate.lifecycle.execute.finally.push(function (data) { finalData = data; });
      const before = translate.executeNumber;
      translate.execute([]);
      return translate.state === 0 && finishes === 1 && finalData.state === 18 && translate.executeNumber === before + 1 && document.body.textContent === '你好世界';
    }
  },
  {
    remark: '空范围与非空源语种过滤同时使用时也不应访问尚未创建的批次',
    test: function () {
      translate.selectLanguageTag.show = false;
      translate.language.setLocal('chinese_simplified');
      translate.language.translateLanguagesRange = ['chinese_simplified'];
      translate.to = 'english';
      translate.execute([]);
      return translate.state === 0 && translate.executeNumber === 1;
    }
  },
  {
    remark: '禁用翻译接口时仍完成节点扫描和生命周期，原文不被伪造译文覆盖',
    test: function () {
      translate.selectLanguageTag.show = false;
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.request.api.translate = '';
      const element = document.createElement('p');
      element.textContent = '你好世界';
      document.body.append(element);
      let finalData;
      translate.lifecycle.execute.finally.push(function (data) { finalData = data; });
      translate.execute(element);
      return finalData.state === 16 && translate.state === 0 && element.textContent === '你好世界' &&
        translate.node.get(element.firstChild).originalText === '你好世界' && translate.executeNumber === 1;
    }
  },
  {
    remark: '通过本地模拟接口翻译单个元素，旁侧元素保持原文',
    test: async function () {
      translate.selectLanguageTag.show = false;
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      document.body.innerHTML = '<p id="selected">你好世界</p><p id="other">动态内容</p>';
      const selected = document.getElementById('selected');
      const text = selected.firstChild;
      const finished = new Promise(resolve => {
        const timeout = setTimeout(() => resolve(false), 4000);
        translate.lifecycle.execute.renderFinish.push(function () { clearTimeout(timeout); resolve(true); });
      });
      translate.execute(selected);
      const complete = await finished;
      return complete === true && selected.textContent === 'Hello world' && selected.firstChild === text &&
        document.getElementById('other').textContent === '动态内容' && translate.node.get(text).originalText === '你好世界' && translate.state === 0;
    }
  },
  {
    remark: '通过本地模拟接口翻译元素数组中的多个独立目标',
    test: async function () {
      translate.selectLanguageTag.show = false;
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      document.body.innerHTML = '<p>你好世界</p><p>动态内容</p><aside>标题</aside>';
      const docs = Array.from(document.querySelectorAll('p'));
      const finished = new Promise(resolve => {
        const timeout = setTimeout(() => resolve(false), 4000);
        translate.lifecycle.execute.renderFinish.push(function () { clearTimeout(timeout); resolve(true); });
      });
      translate.execute(docs);
      return await finished === true && docs[0].textContent === 'Hello world' && docs[1].textContent === 'Dynamic content' &&
        document.querySelector('aside').textContent === '标题' && translate.state === 0;
    }
  },
  {
    remark: '通过本地模拟接口翻译真实 NodeList 集合',
    test: async function () {
      translate.selectLanguageTag.show = false;
      translate.language.setLocal('chinese_simplified');
      translate.to = 'spanish';
      document.body.innerHTML = '<p>你好世界</p><p>动态内容</p>';
      const docs = document.querySelectorAll('p');
      const finished = new Promise(resolve => {
        const timeout = setTimeout(() => resolve(false), 4000);
        translate.lifecycle.execute.renderFinish.push(function () { clearTimeout(timeout); resolve(true); });
      });
      translate.execute(docs);
      return await finished === true && docs[0].textContent === 'Hola mundo' && docs[1].textContent === 'Contenido dinamico' && translate.state === 0;
    }
  },
  {
    remark: '不传参数时实际翻译 setDocuments 范围，其他 DOM 不受影响',
    test: async function () {
      translate.selectLanguageTag.show = false;
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      document.body.innerHTML = '<p id="selected">你好世界</p><p id="other">动态内容</p>';
      translate.setDocuments([document.getElementById('selected')]);
      const finished = new Promise(resolve => {
        const timeout = setTimeout(() => resolve(false), 4000);
        translate.lifecycle.execute.renderFinish.push(function () { clearTimeout(timeout); resolve(true); });
      });
      translate.execute();
      return await finished === true && document.getElementById('selected').textContent === 'Hello world' && document.getElementById('other').textContent === '动态内容';
    }
  },
  {
    remark: '真实表单 title、placeholder 和按钮 value 可以一轮翻译并分别保留原文记录',
    test: async function () {
      translate.selectLanguageTag.show = false;
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      document.body.innerHTML = '<input type="button" title="标题" placeholder="请输入" value="按钮">';
      const input = document.querySelector('input');
      const finished = new Promise(resolve => {
        const timeout = setTimeout(() => resolve(false), 4000);
        translate.lifecycle.execute.renderFinish.push(function () { clearTimeout(timeout); resolve(true); });
      });
      translate.execute(input);
      // 默认扫描静态 HTML value 时，历史记录在 value Attr；显式翻译实时 .value 的场景才记录在元素上。
      return await finished === true && input.title === 'Title' && input.placeholder === 'Please enter' && input.value === 'Button' &&
        translate.node.get(input.getAttributeNode('value')).originalText === '按钮' && translate.node.get(input.getAttributeNode('title')).originalText === '标题' &&
        translate.node.get(input.getAttributeNode('placeholder')).originalText === '请输入';
    }
  },
  {
    remark: '已缓存完整译文时直接渲染，不重复发起翻译网络请求',
    test: function () {
      translate.selectLanguageTag.show = false;
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      translate.storage.set('hash_english_' + translate.util.hash('你好世界'), 'Hello world');
      const element = document.createElement('p');
      element.textContent = '你好世界';
      document.body.append(element);
      let networkCalls = 0;
      translate.lifecycle.execute.translateNetworkBefore.push(function () { networkCalls++; });
      translate.execute(element);
      return element.textContent === 'Hello world' && networkCalls === 0 && translate.state === 0 &&
        translate.node.get(element.firstChild).originalText === '你好世界';
    }
  },
  {
    remark: '同文本的两个 DOM 目标共用一个请求文本，并全部获得译文',
    test: async function () {
      translate.selectLanguageTag.show = false;
      translate.language.setLocal('chinese_simplified');
      translate.to = 'english';
      document.body.innerHTML = '<p>你好世界</p><p>你好世界</p>';
      let request;
      translate.lifecycle.execute.translateNetworkBefore.push(function (data) { request = data; });
      const finished = new Promise(resolve => {
        const timeout = setTimeout(() => resolve(false), 4000);
        translate.lifecycle.execute.renderFinish.push(function () { clearTimeout(timeout); resolve(true); });
      });
      translate.execute([document.body]);
      return await finished === true && Array.from(document.querySelectorAll('p')).every(element => element.textContent === 'Hello world') &&
        request.texts.length === 1 && request.texts[0] === '你好世界' && request.nodes.length === 2;
    }
  }
]);
