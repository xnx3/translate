'use strict';

// 每项在独立页面建立真实扫描记录，只检查返回范围与输入引用，不复制覆盖判定算法。
require('../helpers/module')(__filename, [
  {
    remark: "批次不存在时返回新的空数组，不创建批次",
    test: function () {
      var first = translate.group._getScanScopes('missing'), second = translate.group._getScanScopes('missing');
      return Array.isArray(first) && first.length === 0 && Array.isArray(second) && second.length === 0 &&
        first !== second && typeof translate.nodeQueue.missing === 'undefined';
    }
  },
  {
    remark: "批次尚无 scan 时返回空数组，保留原批次及普通队列",
    test: function () {
      var list = [], batch = { list: list, expireTime: 123 };
      translate.nodeQueue.coverage = batch;
      var result = translate.group._getScanScopes('coverage');
      return Array.isArray(result) && result.length === 0 && translate.nodeQueue.coverage === batch &&
        batch.list === list && batch.expireTime === 123 && typeof batch.scan === 'undefined';
    }
  },
  {
    remark: "scan 尚无 scopes 时返回空数组，不初始化或改动扫描记录",
    test: function () {
      var scan = {};
      translate.nodeQueue.coverage = { scan: scan };
      var result = translate.group._getScanScopes('coverage');
      return Array.isArray(result) && result.length === 0 && translate.nodeQueue.coverage.scan === scan &&
        typeof scan.scopes === 'undefined';
    }
  },
  {
    remark: "scopes 不是数组时返回空数组，不改原值",
    test: function () {
      var scopes = { length: 1, 0: { complete: true, events: [{}] } };
      translate.nodeQueue.coverage = { scan: { scopes: scopes } };
      var result = translate.group._getScanScopes('coverage');
      return Array.isArray(result) && result.length === 0 && translate.nodeQueue.coverage.scan.scopes === scopes;
    }
  },
  {
    remark: "空的 scopes 返回新数组，原数组保持不变",
    test: function () {
      var scopes = [];
      translate.nodeQueue.coverage = { scan: { scopes: scopes } };
      var result = translate.group._getScanScopes('coverage');
      return Array.isArray(result) && result.length === 0 && result !== scopes && scopes.length === 0;
    }
  },
  {
    remark: "混合空项、未完成、非严格 true 和空事件记录全部过滤",
    test: function () {
      var scopes = [null, undefined, {}, { complete: false, events: [{}] },
        { complete: 1, events: [{}] }, { complete: 'true', events: [{}] },
        { complete: true, events: [] }, { complete: true, events: {} }];
      translate.nodeQueue.coverage = { scan: { scopes: scopes } };
      var result = translate.group._getScanScopes('coverage');
      return Array.isArray(result) && result.length === 0 && scopes.length === 8 &&
        translate.nodeQueue.coverage.scan.scopes === scopes;
    }
  },
  {
    remark: "同根同完整事件稳定保留第一次，返回新数组并保留原 scope 和事件引用",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section>甲<b>乙</b><i>丙</i></section><aside>外</aside>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', root);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var result = translate.group._getScanScopes('coverage');
      var again = translate.group._getScanScopes('coverage');
      return result.length === 1 && result[0] === scan.scopes[0] && result[0].events === scan.scopes[0].events &&
        result !== scan.scopes && result !== again && scan.scopes.length === 2;
    }
  },
  {
    remark: "同根但历史完整流不同不能当作重复范围删除",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section>甲<b>乙</b><i>丙</i></section><aside>外</aside>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', child);
      child.lastChild.remove();
      translate.element.whileNodes('coverage', child);
      var scan = translate.nodeQueue.coverage.scan;
      var result = translate.group._getScanScopes('coverage');
      return result.length === 2 && result[0] === scan.scopes[0] && result[1] === scan.scopes[1];
    }
  },
  {
    remark: "先扫描子范围后扫描父范围，只返回完整覆盖它的父范围",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section>甲<b>乙</b><i>丙</i></section><aside>外</aside>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var result = translate.group._getScanScopes('coverage');
      return result.length === 1 && result[0] === scan.scopes[1] && scan.scopes.length === 2;
    }
  },
  {
    remark: "先扫描父范围后扫描子范围，结果同样只保留父范围",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section>甲<b>乙</b><i>丙</i></section><aside>外</aside>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', root);
      translate.element.whileNodes('coverage', child);
      var scan = translate.nodeQueue.coverage.scan;
      var result = translate.group._getScanScopes('coverage');
      return result.length === 1 && result[0] === scan.scopes[0] && scan.scopes.length === 2;
    }
  },
  {
    remark: "三级覆盖与同根重复过滤后，无关区域保持首次出现的相对顺序",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section>甲<b>乙</b><i>丙</i></section><aside>外</aside>';
      var child = root.firstChild;
      var outside = document.createElement('p'); outside.textContent = '独立区域';
      translate.element.whileNodes('coverage', child.querySelector('b'));
      translate.element.whileNodes('coverage', outside);
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var result = translate.group._getScanScopes('coverage');
      return result.length === 2 && result[0] === scan.scopes[1] && result[1] === scan.scopes[3] &&
        scan.scopes.length === 6;
    }
  },
  {
    remark: "Text 单事件范围被完整父流覆盖，不重复返回文字范围",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section>甲<b>乙</b><i>丙</i></section><aside>外</aside>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', child.firstChild);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var result = translate.group._getScanScopes('coverage');
      return result.length === 1 && result[0] === scan.scopes[1];
    }
  },
  {
    remark: "DocumentFragment 完整覆盖内部元素时只返回片段范围",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var fragment = document.createDocumentFragment(), child = document.createElement('p');
      child.innerHTML = '片段<b>内容</b>'; fragment.append(child);
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', fragment);
      var scan = translate.nodeQueue.coverage.scan;
      var result = translate.group._getScanScopes('coverage');
      return result.length === 1 && result[0] === scan.scopes[1] && result[0].root === fragment;
    }
  },
  {
    remark: "父流记录后子范围新增节点，不能用旧父流覆盖新子流",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section>甲<b>乙</b><i>丙</i></section><aside>外</aside>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', root);
      var added = document.createElement('span'); added.textContent = '新增'; child.append(added);
      translate.element.whileNodes('coverage', child);
      var scan = translate.nodeQueue.coverage.scan;
      var result = translate.group._getScanScopes('coverage');
      return result.length === 2 && result[0] === scan.scopes[0] && result[1] === scan.scopes[1];
    }
  },
  {
    remark: "父流记录后子范围删除节点，保留与父流不同的完整子流",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section>甲<b>乙</b><i>丙</i></section><aside>外</aside>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', root);
      child.lastChild.remove();
      translate.element.whileNodes('coverage', child);
      var scan = translate.nodeQueue.coverage.scan;
      var result = translate.group._getScanScopes('coverage');
      return result.length === 2 && result[0] === scan.scopes[0] && result[1] === scan.scopes[1];
    }
  },
  {
    remark: "子范围后代顺序变化，即使节点及文字相同也不误删范围",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section>甲<b>乙</b><i>丙</i></section><aside>外</aside>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', root);
      child.insertBefore(child.lastChild, child.firstChild);
      translate.element.whileNodes('coverage', child);
      var scan = translate.nodeQueue.coverage.scan;
      var result = translate.group._getScanScopes('coverage');
      return result.length === 2 && result[0] === scan.scopes[0] && result[1] === scan.scopes[1];
    }
  },
  {
    remark: "扫描后移出父容器的子节点仍按已存父流过滤，不使用实时 contains",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section>甲<b>乙</b><i>丙</i></section><aside>外</aside>';
      var child = root.firstChild;
      var outside = document.createElement('div');
      translate.element.whileNodes('coverage', root);
      outside.append(child);
      translate.element.whileNodes('coverage', child);
      var scan = translate.nodeQueue.coverage.scan;
      var result = translate.group._getScanScopes('coverage');
      return root.contains(child) === false && result.length === 1 && result[0] === scan.scopes[0];
    }
  },
  {
    remark: "扫描后才移入父容器的子节点不能被旧父流过滤",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section>甲<b>乙</b><i>丙</i></section><aside>外</aside>';
      var child = root.firstChild;
      root.removeChild(child);
      translate.element.whileNodes('coverage', root);
      root.append(child);
      translate.element.whileNodes('coverage', child);
      var scan = translate.nodeQueue.coverage.scan;
      var result = translate.group._getScanScopes('coverage');
      return root.contains(child) === true && result.length === 2 && result[0] === scan.scopes[0] && result[1] === scan.scopes[1];
    }
  },
  {
    remark: "真实父扫描在子流之后异常中断，只返回已完成的子范围",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section>甲<b>乙</b><i>丙</i></section><aside>外</aside>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', child);
      var failure = new Error('expected scan failure'), caught = false;
      root.lastChild.title = '标题';
      translate.element.tagAttribute.aside = { attribute: ['title'], condition: function () { throw failure; } };
      try { translate.element.whileNodes('coverage', root); } catch (error) { caught = error === failure; }
      var scan = translate.nodeQueue.coverage.scan;
      var result = translate.group._getScanScopes('coverage');
      return caught && scan.scopes[1].complete === false && result.length === 1 && result[0] === scan.scopes[0];
    }
  },
  {
    remark: "不同 snapshot 引用即使节点及字段相同也保留两个历史范围",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section>甲<b>乙</b><i>丙</i></section><aside>外</aside>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var event = scan.scopes[0].events[1], snapshot = event.snapshot;
      event.snapshot = { node: snapshot.node, nodeType: snapshot.nodeType, nodeName: snapshot.nodeName,
        parent: snapshot.parent, text: snapshot.text };
      var result = translate.group._getScanScopes('coverage');
      return result.length === 2 && result[0] === scan.scopes[0] && result[1] === scan.scopes[1];
    }
  },
  {
    remark: "相同文字的独立 Text 节点不会被另一个范围中的文字误覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('p'); root.textContent = '相同';
      translate.element.whileNodes('coverage', document.createTextNode('相同'));
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var result = translate.group._getScanScopes('coverage');
      return result.length === 2 && result[0] === scan.scopes[0] && result[1] === scan.scopes[1];
    }
  },
  {
    remark: "A短到B再到A长的历史覆盖链只保留长流，已过滤中间范围仍可覆盖短流",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var a = document.createElement('div'), b = document.createElement('section'); a.textContent = '正文';
      translate.element.whileNodes('coverage', a);
      var scan = translate.nodeQueue.coverage.scan, shortScope = scan.scopes[0];
      b.append(a);
      translate.element.whileNodes('coverage', b);
      var middle = scan.scopes[1];
      // 历史记录允许同一 snapshot 再次嵌套，构造合法配平长流，避免真实 DOM 形成循环。
      var longer = { root: a, complete: true,
        events: [shortScope.events[0]].concat(middle.events, [shortScope.events[shortScope.events.length - 1]]) };
      scan.scopes.push(longer);
      var result = translate.group._getScanScopes('coverage');
      return result.length === 1 && result[0] === longer && scan.scopes.length === 3 &&
        longer.events[2].snapshot === shortScope.events[0].snapshot;
    }
  },
  {
    remark: "输入全部冻结且禁止 DOM、group 与 ignore 读取时，仍返回新数组并保留全部对象引用",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section>甲<b>乙</b><i>丙</i></section><aside>外</aside>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      translate.element.whileNodes('coverage', root);
      var batch = translate.nodeQueue.coverage, scan = batch.scan, originalScopes = scan.scopes;
      var parentScope = scan.scopes[1], originalEvents = parentScope.events;
      scan.scopes.forEach(function (scope) {
        scope.events.forEach(function (event) { Object.freeze(event.snapshot); Object.freeze(event); });
        Object.freeze(scope.events); Object.freeze(scope);
      });
      Object.freeze(originalScopes); Object.freeze(scan); Object.freeze(batch);
      var denied = function () { throw new Error('不能重新读取 DOM 或过滤配置'); };
      scan.snapshots.forEach(function (snapshot) {
        Object.defineProperties(snapshot.node, { contains: { get: denied }, childNodes: { get: denied }, parentNode: { get: denied } });
      });
      Object.defineProperties(translate.group, { elements: { get: denied }, inGroup: { get: denied }, analyze: { get: denied } });
      Object.defineProperty(translate, 'ignore', { get: denied });
      var result = translate.group._getScanScopes('coverage'), again = translate.group._getScanScopes('coverage');
      return result.length === 1 && result[0] === parentScope && result !== originalScopes && result !== again &&
        scan.scopes === originalScopes && originalScopes.length === 3 && result[0].events === originalEvents &&
        result[0].events.every(function (event) { return scan.snapshots.get(event.snapshot.node) === event.snapshot; });
    }
  }
]);
