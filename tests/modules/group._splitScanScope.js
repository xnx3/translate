'use strict';

// 用固定段落预期核对切分；路径回归独立按原事件位置还原扫描栈，不复制切分算法。
require('../helpers/module')(__filename, [
  {
    remark: "多级块容器在进入和离开时分段，前中后正文不混合",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '前<section>甲<p><b>中</b>间</p>乙</section>后';
      translate.element.whileNodes('split', root);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      var originalEvents = scope.events.slice();
      var paragraphs = translate.group._splitScanScope(scope);
      var texts = paragraphs.map(function (paragraph) {
        return paragraph.events.filter(function (event) { return event.type === 'text'; })
          .map(function (event) { return event.snapshot.text; }).join('');
      });
      return JSON.stringify(texts) === "[\"前\",\"甲\",\"中间\",\"乙\",\"后\"]" && paragraphs !== translate.group._splitScanScope(scope) &&
        paragraphs.every(function (paragraph) {
          return Array.isArray(paragraph.ancestors) && paragraph.events !== scope.events &&
            paragraph.events.every(function (event) { return originalEvents.indexOf(event) >= 0; });
        }) && scope.events.length === originalEvents.length &&
        scope.events.every(function (event, index) { return event === originalEvents[index]; });
    }
  },
  {
    remark: "多层行内标签与普通文字保持在同一完整句子",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '我们<b>是<strong>全世界</strong></b>最好的';
      translate.element.whileNodes('split', root);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      var originalEvents = scope.events.slice();
      var paragraphs = translate.group._splitScanScope(scope);
      var texts = paragraphs.map(function (paragraph) {
        return paragraph.events.filter(function (event) { return event.type === 'text'; })
          .map(function (event) { return event.snapshot.text; }).join('');
      });
      return JSON.stringify(texts) === "[\"我们是全世界最好的\"]" && paragraphs !== translate.group._splitScanScope(scope) &&
        paragraphs.every(function (paragraph) {
          return Array.isArray(paragraph.ancestors) && paragraph.events !== scope.events &&
            paragraph.events.every(function (event) { return originalEvents.indexOf(event) >= 0; });
        }) && scope.events.length === originalEvents.length &&
        scope.events.every(function (event, index) { return event === originalEvents[index]; });
    }
  },
  {
    remark: "行内祖先跨越块级子节点时，用每段上下文回放还原所有 Text 原事件路径",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      var inline = document.createElement('span'), block = document.createElement('p');
      block.innerHTML = '<b>中</b>间';
      inline.append(document.createTextNode('前'), block, document.createTextNode('后')); root.append(inline);
      translate.element.whileNodes('split', root);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      var originalEvents = scope.events.slice(), paths = [], stack = [], expectedTextPositions = [];
      scope.events.forEach(function (event, index) {
        paths[index] = stack.slice();
        if (event.type === 'enter') stack.push(event.snapshot);
        else if (event.type === 'leave') {
          if (stack.pop() !== event.snapshot) throw new Error('原测试流不配平');
        } else if (/\S/.test(event.snapshot.text)) expectedTextPositions.push(index);
      });
      if (stack.length) return false;
      var denied = function () { throw new Error('不能读取实时 DOM/CSS、首遇 parent 或过滤配置'); };
      var snapshots = new Set(scope.events.map(function (event) { return event.snapshot; })), nodes = new Set();
      snapshots.forEach(function (snapshot) {
        nodes.add(snapshot.node);
        Object.defineProperty(snapshot, 'parent', { get: denied });
        Object.freeze(snapshot);
      });
      nodes.forEach(function (node) {
        Object.defineProperties(node, { contains: { get: denied }, parentNode: { get: denied }, childNodes: { get: denied }, textContent: { get: denied } });
      });
      scope.events.forEach(function (event) { Object.freeze(event); });
      Object.freeze(scope.events); Object.freeze(scope);
      Object.defineProperty(window, 'getComputedStyle', { get: denied });
      Object.defineProperties(translate.group, { elements: { get: denied }, inGroup: { get: denied }, analyze: { get: denied } });
      Object.defineProperty(translate, 'ignore', { get: denied });
      var paragraphs = translate.group._splitScanScope(scope), cursor = 0, actualTextPositions = [];
      var samePath = function (left, right) {
        return left.length === right.length && left.every(function (snapshot, index) { return snapshot === right[index]; });
      };
      var valid = paragraphs.every(function (paragraph) {
        var firstPosition = originalEvents.indexOf(paragraph.events[0], cursor);
        if (firstPosition < 0 || !samePath(paragraph.ancestors, paths[firstPosition])) return false;
        var replay = paragraph.ancestors.slice();
        return paragraph.events.every(function (event) {
          var position = originalEvents.indexOf(event, cursor);
          if (position < 0 || !samePath(replay, paths[position])) return false;
          cursor = position + 1;
          if (event.type === 'enter') replay.push(event.snapshot);
          else if (event.type === 'leave') {
            if (replay.pop() !== event.snapshot) return false;
          } else if (/\S/.test(event.snapshot.text)) actualTextPositions.push(position);
          return true;
        });
      });
      var texts = paragraphs.map(function (paragraph) {
        return paragraph.events.filter(function (event) { return event.type === 'text'; })
          .map(function (event) { return event.snapshot.text; }).join('');
      });
      return valid && JSON.stringify(texts) === "[\"前\",\"中间\",\"后\"]" &&
        JSON.stringify(actualTextPositions) === JSON.stringify(expectedTextPositions) &&
        scope.events.every(function (event, index) { return event === originalEvents[index]; });
    }
  },
  {
    remark: "连续 BR 和 HR 分隔正文，不生成空段落",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '甲<br><br><hr>乙<hr><br>丙';
      translate.element.whileNodes('split', root);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      var originalEvents = scope.events.slice();
      var paragraphs = translate.group._splitScanScope(scope);
      var texts = paragraphs.map(function (paragraph) {
        return paragraph.events.filter(function (event) { return event.type === 'text'; })
          .map(function (event) { return event.snapshot.text; }).join('');
      });
      return JSON.stringify(texts) === "[\"甲\",\"乙\",\"丙\"]" && paragraphs !== translate.group._splitScanScope(scope) &&
        paragraphs.every(function (paragraph) {
          return Array.isArray(paragraph.ancestors) && paragraph.events !== scope.events &&
            paragraph.events.every(function (event) { return originalEvents.indexOf(event) >= 0; });
        }) && scope.events.length === originalEvents.length &&
        scope.events.every(function (event, index) { return event === originalEvents[index]; });
    }
  },
  {
    remark: "空块容器仍分隔两侧正文，不因为没有 Text 而把两侧拼接",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '甲<div></div>乙<p></p>丙';
      translate.element.whileNodes('split', root);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      var originalEvents = scope.events.slice();
      var paragraphs = translate.group._splitScanScope(scope);
      var texts = paragraphs.map(function (paragraph) {
        return paragraph.events.filter(function (event) { return event.type === 'text'; })
          .map(function (event) { return event.snapshot.text; }).join('');
      });
      return JSON.stringify(texts) === "[\"甲\",\"乙\",\"丙\"]" && paragraphs !== translate.group._splitScanScope(scope) &&
        paragraphs.every(function (paragraph) {
          return Array.isArray(paragraph.ancestors) && paragraph.events !== scope.events &&
            paragraph.events.every(function (event) { return originalEvents.indexOf(event) >= 0; });
        }) && scope.events.length === originalEvents.length &&
        scope.events.every(function (event, index) { return event === originalEvents[index]; });
    }
  },
  {
    remark: "含正文的段落完整保留首尾空白、制表符和换行",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = ' \n<b>甲</b>\t<i>乙</i>  ';
      translate.element.whileNodes('split', root);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      var originalEvents = scope.events.slice();
      var paragraphs = translate.group._splitScanScope(scope);
      var texts = paragraphs.map(function (paragraph) {
        return paragraph.events.filter(function (event) { return event.type === 'text'; })
          .map(function (event) { return event.snapshot.text; }).join('');
      });
      return JSON.stringify(texts) === "[\" \\n甲\\t乙  \"]" && paragraphs !== translate.group._splitScanScope(scope) &&
        paragraphs.every(function (paragraph) {
          return Array.isArray(paragraph.ancestors) && paragraph.events !== scope.events &&
            paragraph.events.every(function (event) { return originalEvents.indexOf(event) >= 0; });
        }) && scope.events.length === originalEvents.length &&
        scope.events.every(function (event, index) { return event === originalEvents[index]; });
    }
  },
  {
    remark: "纯空白候选段丢弃，含正文段正常保留",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<p> \n</p><p>正文</p><div>\t </div>';
      translate.element.whileNodes('split', root);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      var originalEvents = scope.events.slice();
      var paragraphs = translate.group._splitScanScope(scope);
      var texts = paragraphs.map(function (paragraph) {
        return paragraph.events.filter(function (event) { return event.type === 'text'; })
          .map(function (event) { return event.snapshot.text; }).join('');
      });
      return JSON.stringify(texts) === "[\"正文\"]" && paragraphs !== translate.group._splitScanScope(scope) &&
        paragraphs.every(function (paragraph) {
          return Array.isArray(paragraph.ancestors) && paragraph.events !== scope.events &&
            paragraph.events.every(function (event) { return originalEvents.indexOf(event) >= 0; });
        }) && scope.events.length === originalEvents.length &&
        scope.events.every(function (event, index) { return event === originalEvents[index]; });
    }
  },
  {
    remark: "Text 顶层范围返回单段，第一事件前没有祖先上下文",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var text = document.createTextNode('独立段落');
      translate.element.whileNodes('split', text);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      var paragraphs = translate.group._splitScanScope(scope);
      return paragraphs.length === 1 && paragraphs[0].ancestors.length === 0 &&
        paragraphs[0].events.length === 1 && paragraphs[0].events[0] === scope.events[0] &&
        paragraphs[0].events[0].snapshot.text === '独立段落';
    }
  },
  {
    remark: "DocumentFragment 的直接 Text 与块内 Text 按原顺序分别成段",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var fragment = document.createDocumentFragment(), p = document.createElement('p'); p.textContent = '中';
      fragment.append(document.createTextNode('前'), p, document.createTextNode('后'));
      translate.element.whileNodes('split', fragment);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      var originalEvents = scope.events.slice();
      var paragraphs = translate.group._splitScanScope(scope);
      var texts = paragraphs.map(function (paragraph) {
        return paragraph.events.filter(function (event) { return event.type === 'text'; })
          .map(function (event) { return event.snapshot.text; }).join('');
      });
      return JSON.stringify(texts) === "[\"前\",\"中\",\"后\"]" && paragraphs !== translate.group._splitScanScope(scope) &&
        paragraphs.every(function (paragraph) {
          return Array.isArray(paragraph.ancestors) && paragraph.events !== scope.events &&
            paragraph.events.every(function (event) { return originalEvents.indexOf(event) >= 0; });
        }) && scope.events.length === originalEvents.length &&
        scope.events.every(function (event, index) { return event === originalEvents[index]; });
    }
  },
  {
    remark: "当前步骤保留非正文、隐藏分支和无文字控件的结构标记，留给后续过滤",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '甲<input><script type="application/json">未过滤脚本</script><img><span hidden class="ignore">隐藏</span>乙';
      translate.element.whileNodes('split', root);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      var paragraphs = translate.group._splitScanScope(scope), events = paragraphs.reduce(function (result, paragraph) {
        return result.concat(paragraph.events);
      }, []);
      var texts = events.filter(function (event) { return event.type === 'text'; })
        .map(function (event) { return event.snapshot.text; }).join('');
      var markers = scope.events.filter(function (event) {
        return event.snapshot.nodeName === 'INPUT' || event.snapshot.nodeName === 'SCRIPT' ||
          event.snapshot.nodeName === 'IMG' || event.snapshot.nodeName === 'SPAN';
      });
      return paragraphs.length === 1 && texts === '甲未过滤脚本隐藏乙' && markers.length === 8 &&
        markers.every(function (event) { return events.indexOf(event) >= 0; });
    }
  },
  {
    remark: "节点移动后祖先路径以本次事件为准，冻结输入且禁读旧 parent、DOM 和过滤规则仍正确",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '<section><b>首遇</b></section><p>目标</p>';
      var oldParent = root.firstChild, moved = oldParent.firstChild;
      translate.element.whileNodes('split', moved);
      root.lastChild.append(moved);
      translate.element.whileNodes('split', root);
      var scan = translate.nodeQueue.split.scan, scope = scan.scopes[1];
      if (scan.snapshots.get(moved).parent !== oldParent || moved.parentNode === oldParent) return false;
      var originalEvents = scope.events.slice(), paths = [], stack = [], expectedTextPositions = [];
      scope.events.forEach(function (event, index) {
        paths[index] = stack.slice();
        if (event.type === 'enter') stack.push(event.snapshot);
        else if (event.type === 'leave') {
          if (stack.pop() !== event.snapshot) throw new Error('原测试流不配平');
        } else if (/\S/.test(event.snapshot.text)) expectedTextPositions.push(index);
      });
      if (stack.length) return false;
      var denied = function () { throw new Error('不能读取实时 DOM/CSS、首遇 parent 或过滤配置'); };
      var snapshots = new Set(scope.events.map(function (event) { return event.snapshot; })), nodes = new Set();
      snapshots.forEach(function (snapshot) {
        nodes.add(snapshot.node);
        Object.defineProperty(snapshot, 'parent', { get: denied });
        Object.freeze(snapshot);
      });
      nodes.forEach(function (node) {
        Object.defineProperties(node, { contains: { get: denied }, parentNode: { get: denied }, childNodes: { get: denied }, textContent: { get: denied } });
      });
      scope.events.forEach(function (event) { Object.freeze(event); });
      Object.freeze(scope.events); Object.freeze(scope);
      Object.defineProperty(window, 'getComputedStyle', { get: denied });
      Object.defineProperties(translate.group, { elements: { get: denied }, inGroup: { get: denied }, analyze: { get: denied } });
      Object.defineProperty(translate, 'ignore', { get: denied });
      var paragraphs = translate.group._splitScanScope(scope), cursor = 0, actualTextPositions = [];
      var samePath = function (left, right) {
        return left.length === right.length && left.every(function (snapshot, index) { return snapshot === right[index]; });
      };
      var valid = paragraphs.every(function (paragraph) {
        var firstPosition = originalEvents.indexOf(paragraph.events[0], cursor);
        if (firstPosition < 0 || !samePath(paragraph.ancestors, paths[firstPosition])) return false;
        var replay = paragraph.ancestors.slice();
        return paragraph.events.every(function (event) {
          var position = originalEvents.indexOf(event, cursor);
          if (position < 0 || !samePath(replay, paths[position])) return false;
          cursor = position + 1;
          if (event.type === 'enter') replay.push(event.snapshot);
          else if (event.type === 'leave') {
            if (replay.pop() !== event.snapshot) return false;
          } else if (/\S/.test(event.snapshot.text)) actualTextPositions.push(position);
          return true;
        });
      });
      var texts = paragraphs.map(function (paragraph) {
        return paragraph.events.filter(function (event) { return event.type === 'text'; })
          .map(function (event) { return event.snapshot.text; }).join('');
      });
      return valid && JSON.stringify(texts) === "[\"目标首遇\"]" &&
        JSON.stringify(actualTextPositions) === JSON.stringify(expectedTextPositions) &&
        scope.events.every(function (event, index) { return event === originalEvents[index]; });
    }
  },
  {
    remark: "重复 snapshot 和重复事件对象合法嵌套时，按每个事件位置回放路径",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('span'); root.innerHTML = '<b>正文</b>';
      translate.element.whileNodes('split', root);
      var source = translate.nodeQueue.split.scan.scopes[0];
      var scope = { root: root, complete: true,
        events: [source.events[0]].concat(source.events, [source.events[source.events.length - 1]]) };
      var originalEvents = scope.events.slice(), paths = [], stack = [], expectedTextPositions = [];
      scope.events.forEach(function (event, index) {
        paths[index] = stack.slice();
        if (event.type === 'enter') stack.push(event.snapshot);
        else if (event.type === 'leave') {
          if (stack.pop() !== event.snapshot) throw new Error('原测试流不配平');
        } else if (/\S/.test(event.snapshot.text)) expectedTextPositions.push(index);
      });
      if (stack.length) return false;
      var denied = function () { throw new Error('不能读取实时 DOM/CSS、首遇 parent 或过滤配置'); };
      var snapshots = new Set(scope.events.map(function (event) { return event.snapshot; })), nodes = new Set();
      snapshots.forEach(function (snapshot) {
        nodes.add(snapshot.node);
        Object.defineProperty(snapshot, 'parent', { get: denied });
        Object.freeze(snapshot);
      });
      nodes.forEach(function (node) {
        Object.defineProperties(node, { contains: { get: denied }, parentNode: { get: denied }, childNodes: { get: denied }, textContent: { get: denied } });
      });
      scope.events.forEach(function (event) { Object.freeze(event); });
      Object.freeze(scope.events); Object.freeze(scope);
      Object.defineProperty(window, 'getComputedStyle', { get: denied });
      Object.defineProperties(translate.group, { elements: { get: denied }, inGroup: { get: denied }, analyze: { get: denied } });
      Object.defineProperty(translate, 'ignore', { get: denied });
      var paragraphs = translate.group._splitScanScope(scope), cursor = 0, actualTextPositions = [];
      var samePath = function (left, right) {
        return left.length === right.length && left.every(function (snapshot, index) { return snapshot === right[index]; });
      };
      var valid = paragraphs.every(function (paragraph) {
        var firstPosition = originalEvents.indexOf(paragraph.events[0], cursor);
        if (firstPosition < 0 || !samePath(paragraph.ancestors, paths[firstPosition])) return false;
        var replay = paragraph.ancestors.slice();
        return paragraph.events.every(function (event) {
          var position = originalEvents.indexOf(event, cursor);
          if (position < 0 || !samePath(replay, paths[position])) return false;
          cursor = position + 1;
          if (event.type === 'enter') replay.push(event.snapshot);
          else if (event.type === 'leave') {
            if (replay.pop() !== event.snapshot) return false;
          } else if (/\S/.test(event.snapshot.text)) actualTextPositions.push(position);
          return true;
        });
      });
      var texts = paragraphs.map(function (paragraph) {
        return paragraph.events.filter(function (event) { return event.type === 'text'; })
          .map(function (event) { return event.snapshot.text; }).join('');
      });
      return valid && JSON.stringify(texts) === "[\"正文\"]" &&
        JSON.stringify(actualTextPositions) === JSON.stringify(expectedTextPositions) &&
        scope.events.every(function (event, index) { return event === originalEvents[index]; });
    }
  },
  {
    remark: "未完成范围整体返回空数组",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '前<p>正文</p>后';
      translate.element.whileNodes('split', root);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      scope.complete = false;
      var result = translate.group._splitScanScope(scope);
      return Array.isArray(result) && result.length === 0;
    }
  },
  {
    remark: "前面已有有效段落但末尾缺少闭合事件，仍整体返回空数组",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '前<p>正文</p>后';
      translate.element.whileNodes('split', root);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      scope.events.pop();
      var result = translate.group._splitScanScope(scope);
      return Array.isArray(result) && result.length === 0;
    }
  },
  {
    remark: "leave 与进入快照不配对时整体返回空数组",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '前<p>正文</p>后';
      translate.element.whileNodes('split', root);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      scope.events[scope.events.length - 1] = { type: 'leave', snapshot: scope.events[1].snapshot };
      var result = translate.group._splitScanScope(scope);
      return Array.isArray(result) && result.length === 0;
    }
  },
  {
    remark: "未知事件类型使整个范围无效，不返回之前累计的段落",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '前<p>正文</p>后';
      translate.element.whileNodes('split', root);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      scope.events.splice(2, 0, { type: 'invalid', snapshot: scope.events[0].snapshot });
      var result = translate.group._splitScanScope(scope);
      return Array.isArray(result) && result.length === 0;
    }
  },
  {
    remark: "第一事件不对应范围根节点时整体返回空数组",
    test: function () {
      translate.addNodeToQueue = function () { return []; };
      var root = document.createElement('div');
      root.innerHTML = '前<p>正文</p>后';
      translate.element.whileNodes('split', root);
      var scope = translate.nodeQueue.split.scan.scopes[0];
      scope.root = document.createElement('article');
      var result = translate.group._splitScanScope(scope);
      return Array.isArray(result) && result.length === 0;
    }
  },
  {
    remark: "Text 事件快照正文不是字符串时返回空数组",
    test: function () {
      var text = document.createTextNode('正文');
      var scope = { root: text, complete: true, events: [
        { type: 'text', snapshot: { node: text, nodeType: 3, nodeName: '#text', parent: null, text: null } }
      ] };
      var result = translate.group._splitScanScope(scope);
      return Array.isArray(result) && result.length === 0;
    }
  }
]);
