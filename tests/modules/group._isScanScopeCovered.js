'use strict';

// 每项使用真实浏览器中的独立扫描记录；错误流只改对应记录，不复制被测算法。
require('../helpers/module')(__filename, [
  {
    remark: "子范围先扫描、父范围后扫描，完整历史子流仍能被覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      return translate.group._isScanScopeCovered(childScope, parentScope) === true;
    }
  },
  {
    remark: "父范围先扫描、子范围后扫描，不依赖范围创建顺序",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<p>我们<b>最好</b></p>';
      translate.element.whileNodes('coverage', root);
      translate.element.whileNodes('coverage', root.firstChild);
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return translate.group._isScanScopeCovered(scopes[1], scopes[0]) === true;
    }
  },
  {
    remark: "父范围不能反过来被较短的子范围覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      return translate.group._isScanScopeCovered(parentScope, childScope) === false;
    }
  },
  {
    remark: "三层嵌套的内层范围可被中层和最外层各自完整覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('article');
      root.innerHTML = '<section>正文<p><b>强调</b></p></section>';
      translate.element.whileNodes('coverage', root.querySelector('p'));
      translate.element.whileNodes('coverage', root.firstChild);
      translate.element.whileNodes('coverage', root);
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return translate.group._isScanScopeCovered(scopes[0], scopes[1]) === true &&
        translate.group._isScanScopeCovered(scopes[0], scopes[2]) === true;
    }
  },
  {
    remark: "直接 Text 的单条 text 事件可以被父范围完整覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('p');
      root.textContent = '段落';
      translate.element.whileNodes('coverage', root.firstChild);
      translate.element.whileNodes('coverage', root);
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return translate.group._isScanScopeCovered(scopes[0], scopes[1]) === true;
    }
  },
  {
    remark: "空字符串 Text 也按真实节点身份被父范围覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('p'), text = document.createTextNode('');
      root.append(text);
      translate.element.whileNodes('coverage', text);
      translate.element.whileNodes('coverage', root);
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return translate.group._isScanScopeCovered(scopes[0], scopes[1]) === true;
    }
  },
  {
    remark: "独立空白和换行 Text 的完整事件不因没有可翻译文字而被排除",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('p'), text = document.createTextNode(' \n\t ');
      root.append(text);
      translate.element.whileNodes('coverage', text);
      translate.element.whileNodes('coverage', root);
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return translate.group._isScanScopeCovered(scopes[0], scopes[1]) === true;
    }
  },
  {
    remark: "空元素的 enter/leave 完整子流可以被父范围覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div'), child = document.createElement('span');
      root.append(child);
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return translate.group._isScanScopeCovered(scopes[0], scopes[1]) === true;
    }
  },
  {
    remark: "DocumentFragment 的历史事件可以完整覆盖内部元素",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var fragment = document.createDocumentFragment(), child = document.createElement('p');
      child.innerHTML = '片段<b>内容</b>';
      fragment.append(child);
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', fragment);
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return translate.group._isScanScopeCovered(scopes[0], scopes[1]) === true;
    }
  },
  {
    remark: "ShadowRoot 独立扫描范围可覆盖其内部 Text",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var host = document.createElement('div'), shadow = host.attachShadow({ mode: 'open' });
      shadow.textContent = '影子内容';
      translate.element.whileNodes('coverage', shadow.firstChild);
      translate.element.whileNodes('coverage', shadow);
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return translate.group._isScanScopeCovered(scopes[0], scopes[1]) === true;
    }
  },
  {
    remark: "相同根和相同完整事件不属于父子覆盖，由另一步负责同根去重",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      return translate.group._isScanScopeCovered(childScope, childScope) === false;
    }
  },
  {
    remark: "同根即使事件较长也不能互相覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      var longer = {
        root: childScope.root,
        events: [childScope.events[0]].concat(childScope.events, [childScope.events[childScope.events.length - 1]]),
        complete: true
      };
      return translate.group._isScanScopeCovered(childScope, longer) === false;
    }
  },
  {
    remark: "不同根但父事件不更长时不认定覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      var other = { root: root, events: childScope.events.slice(), complete: true };
      return translate.group._isScanScopeCovered(childScope, other) === false;
    }
  },
  {
    remark: "事件 wrapper 不同但 type 和 snapshot 引用相同仍能覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      var copied = {
        root: childScope.root,
        complete: true,
        events: childScope.events.map(function (event) {
          return { type: event.type, snapshot: event.snapshot };
        })
      };
      return translate.group._isScanScopeCovered(copied, parentScope) === true;
    }
  },
  {
    remark: "相同节点和字段但不同 snapshot 对象不算同一份历史记录",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      var textEvent = childScope.events.filter(function (event) { return event.type === 'text'; })[0];
      var snapshot = textEvent.snapshot;
      textEvent.snapshot = {
        node: snapshot.node,
        nodeType: snapshot.nodeType,
        nodeName: snapshot.nodeName,
        parent: snapshot.parent,
        text: snapshot.text
      };
      return translate.group._isScanScopeCovered(childScope, parentScope) === false;
    }
  },
  {
    remark: "文字相同的不同真实 Text 节点不能互相覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('p');
      root.textContent = '相同';
      translate.element.whileNodes('coverage', document.createTextNode('相同'));
      translate.element.whileNodes('coverage', root);
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return translate.group._isScanScopeCovered(scopes[0], scopes[1]) === false;
    }
  },
  {
    remark: "事件 type 不同即使 snapshot 相同也不能覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      childScope.events[1] = { type: 'enter', snapshot: childScope.events[1].snapshot };
      return translate.group._isScanScopeCovered(childScope, parentScope) === false;
    }
  },
  {
    remark: "子范围缺少结束 leave 时不能把半段事件认定为完整子流",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      childScope.events = childScope.events.slice(0, -1);
      return translate.group._isScanScopeCovered(childScope, parentScope) === false;
    }
  },
  {
    remark: "未完成的父范围不能覆盖完整子范围",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      parentScope.complete = false;
      return translate.group._isScanScopeCovered(childScope, parentScope) === false;
    }
  },
  {
    remark: "未完成的子范围不参与覆盖判定",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      childScope.complete = false;
      return translate.group._isScanScopeCovered(childScope, parentScope) === false;
    }
  },
  {
    remark: "完成状态只有严格布尔 true 有效，数字 1 不当作完成",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      parentScope.complete = 1;
      return translate.group._isScanScopeCovered(childScope, parentScope) === false;
    }
  },
  {
    remark: "父范围没有事件时返回 false",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      parentScope.events = [];
      return translate.group._isScanScopeCovered(childScope, parentScope) === false;
    }
  },
  {
    remark: "子范围没有事件时返回 false",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      childScope.events = [];
      return translate.group._isScanScopeCovered(childScope, parentScope) === false;
    }
  },
  {
    remark: "父流先匹配到子流但后续未闭合，仍返回 false",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      parentScope.events = parentScope.events.slice(0, -1);
      return translate.group._isScanScopeCovered(childScope, parentScope) === false;
    }
  },
  {
    remark: "父流先匹配到子流但最后 leave 配错 snapshot，仍返回 false",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      var last = parentScope.events.length - 1;
      parentScope.events[last] = { type: 'leave', snapshot: childScope.events[0].snapshot };
      return translate.group._isScanScopeCovered(childScope, parentScope) === false;
    }
  },
  {
    remark: "父流先匹配到子流但后续事件类型错误，仍返回 false",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      parentScope.events.splice(parentScope.events.length - 1, 0, {
        type: 'invalid', snapshot: childScope.events[0].snapshot
      });
      return translate.group._isScanScopeCovered(childScope, parentScope) === false;
    }
  },
  {
    remark: "父流闭合后又出现独立顶层容器，不能认定为一个完整范围",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      var rootSnapshot = parentScope.events[0].snapshot;
      parentScope.events.push({ type: 'enter', snapshot: rootSnapshot }, { type: 'leave', snapshot: rootSnapshot });
      return translate.group._isScanScopeCovered(childScope, parentScope) === false;
    }
  },
  {
    remark: "父范围第一个事件不对应其 root 时返回 false",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      parentScope.root = document.createElement('section');
      return translate.group._isScanScopeCovered(childScope, parentScope) === false;
    }
  },
  {
    remark: "同一节点出现多段历史子流，只有后一次匹配时仍能找到覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      var first = parentScope.events[0], last = parentScope.events[parentScope.events.length - 1];
      var childEnter = childScope.events[0], childLeave = childScope.events[childScope.events.length - 1];
      parentScope.events = [first, childEnter, childLeave].concat(childScope.events, [last]);
      return translate.group._isScanScopeCovered(childScope, parentScope) === true;
    }
  },
  {
    remark: "合法嵌套重复 snapshot 按后进先出配平，内部完整子流仍可覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      var first = parentScope.events[0], last = parentScope.events[parentScope.events.length - 1];
      var childEnter = childScope.events[0], childLeave = childScope.events[childScope.events.length - 1];
      parentScope.events = [first, childEnter].concat(childScope.events, [childLeave, last]);
      return translate.group._isScanScopeCovered(childScope, parentScope) === true;
    }
  },
  {
    remark: "父范围记录后子节点移出，仍按历史事件认定覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div'), outside = document.createElement('div');
      root.innerHTML = '<p>原位置<b>内容</b></p>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', root);
      outside.append(child);
      translate.element.whileNodes('coverage', child);
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return root.contains(child) === false &&
        translate.group._isScanScopeCovered(scopes[1], scopes[0]) === true;
    }
  },
  {
    remark: "父范围记录后才移入子节点，不能用当前 contains 冒充历史覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div'), child = document.createElement('p');
      root.textContent = '先扫描父'; child.innerHTML = '后移入<b>内容</b>';
      translate.element.whileNodes('coverage', root);
      root.append(child);
      translate.element.whileNodes('coverage', child);
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return root.contains(child) === true &&
        translate.group._isScanScopeCovered(scopes[1], scopes[0]) === false;
    }
  },
  {
    remark: "父范围记录后子范围新增节点，事件不同而保留子范围",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<p>原内容<b>强调</b></p>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', root);
      var added = document.createElement('i'); added.textContent = '新增'; child.append(added);
      translate.element.whileNodes('coverage', child);
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return translate.group._isScanScopeCovered(scopes[1], scopes[0]) === false;
    }
  },
  {
    remark: "父范围记录后子范围删除节点，事件不同而保留子范围",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<p>原内容<b>删除</b></p>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', root);
      child.lastChild.remove();
      translate.element.whileNodes('coverage', child);
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return translate.group._isScanScopeCovered(scopes[1], scopes[0]) === false;
    }
  },
  {
    remark: "父范围记录后子范围交换后代顺序，事件顺序不同则不覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<p><b>第一</b><i>第二</i></p>';
      var child = root.firstChild;
      translate.element.whileNodes('coverage', root);
      child.insertBefore(child.lastChild, child.firstChild);
      translate.element.whileNodes('coverage', child);
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return translate.group._isScanScopeCovered(scopes[1], scopes[0]) === false;
    }
  },
  {
    remark: "同批次仅修改 nodeValue 仍复用首遇快照，判定不声称当前文字未变化",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<p>原文</p>';
      var child = root.firstChild, text = child.firstChild;
      translate.element.whileNodes('coverage', root);
      text.nodeValue = '现文';
      translate.element.whileNodes('coverage', child);
      var scan = translate.nodeQueue.coverage.scan;
      return scan.snapshots.get(text).text === '原文' && text.nodeValue === '现文' &&
        translate.group._isScanScopeCovered(scan.scopes[1], scan.scopes[0]) === true;
    }
  },
  {
    remark: "真实父扫描在匹配子流后遇到属性回调异常，未完成范围不能覆盖",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<p>完整<b>子范围</b></p><aside title="标题">失败位置</aside>';
      var failure = new Error('expected attribute condition failure'), caught = false;
      translate.element.whileNodes('coverage', root.firstChild);
      translate.element.tagAttribute.aside = { attribute: ['title'], condition: function () { throw failure; } };
      try { translate.element.whileNodes('coverage', root); } catch (error) { caught = error === failure; }
      var scopes = translate.nodeQueue.coverage.scan.scopes;
      return caught && scopes[0].complete === true && scopes[1].complete === false &&
        translate.group._isScanScopeCovered(scopes[0], scopes[1]) === false;
    }
  },
  {
    remark: "冻结全部记录并禁止实时 DOM、group 归属及 ignore 读取，判定仍成功且不修改引用",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '开头<p>我们<b>最好</b></p>末尾';
      var child = root.querySelector('p');
      translate.element.whileNodes('coverage', child);
      translate.element.whileNodes('coverage', root);
      var scan = translate.nodeQueue.coverage.scan;
      var childScope = scan.scopes[0], parentScope = scan.scopes[1];
      var originalScopes = scan.scopes.slice(), originalChildEvents = childScope.events, originalParentEvents = parentScope.events;
      scan.scopes.forEach(function (scope) {
        scope.events.forEach(function (event) { Object.freeze(event.snapshot); Object.freeze(event); });
        Object.freeze(scope.events); Object.freeze(scope);
      });
      Object.freeze(scan.scopes);
      var denied = function () { throw new Error('不能重新读取 DOM 或过滤配置'); };
      scan.snapshots.forEach(function (snapshot) {
        Object.defineProperties(snapshot.node, { contains: { get: denied }, parentNode: { get: denied }, childNodes: { get: denied } });
      });
      Object.defineProperties(translate.group, { elements: { get: denied }, inGroup: { get: denied }, analyze: { get: denied } });
      Object.defineProperty(translate, 'ignore', { get: denied });
      return translate.group._isScanScopeCovered(childScope, parentScope) === true &&
        translate.group._isScanScopeCovered(childScope, parentScope) === true &&
        scan.scopes[0] === originalScopes[0] && scan.scopes[1] === originalScopes[1] &&
        childScope.events === originalChildEvents && parentScope.events === originalParentEvents &&
        childScope.events.every(function (event) { return scan.snapshots.get(event.snapshot.node) === event.snapshot; });
    }
  },
  {
    "remark": "省略两个范围参数返回 false",
    "args": [],
    "expected": false
  },
  {
    "remark": "null 子范围返回 false",
    "args": [
      null,
      {
        "complete": true,
        "root": {},
        "events": [
          {}
        ]
      }
    ],
    "expected": false
  },
  {
    "remark": "null 父范围返回 false",
    "args": [
      {
        "complete": true,
        "root": {},
        "events": [
          {}
        ]
      },
      null
    ],
    "expected": false
  },
  {
    "remark": "子范围 events 不是数组时返回 false",
    "args": [
      {
        "complete": true,
        "root": {},
        "events": {}
      },
      {
        "complete": true,
        "root": {},
        "events": [
          {},
          {}
        ]
      }
    ],
    "expected": false
  },
  {
    "remark": "父范围 events 不是数组时返回 false",
    "args": [
      {
        "complete": true,
        "root": {},
        "events": [
          {}
        ]
      },
      {
        "complete": true,
        "root": {},
        "events": {}
      }
    ],
    "expected": false
  }
]);
