'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '用户示例按 DOM 顺序返回四段，内部 b 标签的文字权重为 1',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '<b>我们</b>是<b>全世界</b>最好的';
      return JSON.stringify(translate.group.analyze(root)) === JSON.stringify([
        { text: '我们', weight: 1 }, { text: '是', weight: 0 },
        { text: '全世界', weight: 1 }, { text: '最好的', weight: 0 }
      ]);
    }
  },
  {
    remark: '无需登记 elements 即可分析，传入根自身的文字以 weight 0 为基准',
    test: function () {
      var root = document.createElement('strong');
      root.textContent = '完整的一段';
      translate.group.elements = [];
      return JSON.stringify(translate.group.analyze(root)) === '[{"text":"完整的一段","weight":0}]' &&
        translate.group.inGroup(root) === false;
    }
  },
  {
    remark: '嵌套内联标签继承权重 1，不累计深度，离开标签后恢复普通权重',
    test: function () {
      var root = document.createElement('p');
      root.innerHTML = 'Please <a>read <strong>the <span>docs</span></strong> now</a>.';
      return JSON.stringify(translate.group.analyze(root)) === JSON.stringify([
        { text: 'Please ', weight: 0 }, { text: 'read ', weight: 1 },
        { text: 'the ', weight: 1 }, { text: 'docs', weight: 1 },
        { text: ' now', weight: 1 }, { text: '.', weight: 0 }
      ]);
    }
  },
  {
    remark: '原样保留首尾空格、换行、纯空白节点和实体解码后的字符，仅跳过空字符串',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '  Hello <b>world&nbsp;&amp;</b>\n\t ';
      root.append(document.createTextNode(''));
      return JSON.stringify(translate.group.analyze(root)) === JSON.stringify([
        { text: '  Hello ', weight: 0 }, { text: 'world\u00a0&', weight: 1 },
        { text: '\n\t ', weight: 0 }
      ]);
    }
  },
  {
    remark: '重复文字和相邻同权重 TextNode 仍各占一项，不合并也不去重',
    test: function () {
      var root = document.createElement('div');
      root.append(document.createTextNode('相同'), document.createTextNode('相同'));
      var span = document.createElement('span');
      span.append(document.createTextNode('相同'), document.createTextNode('相同'));
      root.append(span);
      return JSON.stringify(translate.group.analyze(root)) === JSON.stringify([
        { text: '相同', weight: 0 }, { text: '相同', weight: 0 },
        { text: '相同', weight: 1 }, { text: '相同', weight: 1 }
      ]);
    }
  },
  {
    remark: '内部块容器不额外加权也不丢文字，已存在的内联权重可以穿过块容器继承',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '<section><p>普通<b>强调</b></p><div>另一段</div></section>';
      var span = document.createElement('span'), block = document.createElement('div');
      block.textContent = '继承强调';
      span.append(block);
      root.append(span);
      return JSON.stringify(translate.group.analyze(root)) === JSON.stringify([
        { text: '普通', weight: 0 }, { text: '强调', weight: 1 },
        { text: '另一段', weight: 0 }, { text: '继承强调', weight: 1 }
      ]);
    }
  },
  {
    remark: '只提取正文 TextNode，跳过注释和非正文子树，属性不作为段落片段',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '正文<!--注释--><script>脚本</script><style>样式</style><template>模板</template><noscript>备用</noscript><iframe>框架</iframe><object>对象</object><canvas>画布</canvas><svg><text>矢量</text></svg><math><mi>公式</mi></math><img alt="图片说明"><span title="标题">结尾</span>';
      return JSON.stringify(translate.group.analyze(root)) === '[{"text":"正文","weight":0},{"text":"结尾","weight":1}]';
    }
  },
  {
    remark: '遵守 translate.ignore.tag，自定义忽略标签的整个后代文本不参与分析',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '保留<em>忽略<span>内部</span></em><b>结尾</b>';
      translate.ignore.tag.push('em');
      return JSON.stringify(translate.group.analyze(root)) === '[{"text":"保留","weight":0},{"text":"结尾","weight":1}]';
    }
  },
  {
    remark: '遵守 translate.ignore.class，对命中 class 的后代文字一并忽略',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '<span class="excluded"><b>忽略</b></span><span>保留</span>';
      translate.ignore.class.push('excluded', null);
      return JSON.stringify(translate.group.analyze(root)) === '[{"text":"保留","weight":1}]';
    }
  },
  {
    remark: 'class 条件函数接收当前 TextNode 和空字符串属性名，仅忽略符合条件的正文',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '<span class="conditional-group-ignore">忽略</span><span class="conditional-group-ignore">保留</span>';
      var ignoredText = root.firstChild.firstChild, keptText = root.lastChild.firstChild;
      var ignoredSeen = false, keptSeen = false, validArguments = true;
      translate.ignore.class.push('conditional-group-ignore', function (element, data) {
        validArguments = validArguments && data.attribute === '' &&
          data.node.nodeType === 3 && data.node.parentNode === element;
        if (data.node === ignoredText) ignoredSeen = true;
        if (data.node === keptText) keptSeen = true;
        return data.node === ignoredText && data.attribute === '';
      });
      var result = translate.group.analyze(root);
      return validArguments && ignoredSeen && keptSeen &&
        JSON.stringify(result) === '[{"text":"保留","weight":1}]';
    }
  },
  {
    remark: '遵守 translate.ignore.id，命中的分析根返回空数组',
    test: function () {
      var root = document.createElement('div');
      root.id = 'group-excluded';
      root.innerHTML = '普通<b>强调</b>';
      translate.ignore.id.push('group-excluded');
      return JSON.stringify(translate.group.analyze(root)) === '[]';
    }
  },
  {
    remark: 'hidden、translate=no 和 notranslate 子树均跳过，近似 class 名不被误判',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '<span hidden>隐藏<b>内部</b></span><span translate="NO">禁用</span><span class="other notranslate extra">不翻译</span><span class="notranslate-more">保留</span>';
      return JSON.stringify(translate.group.analyze(root)) === '[{"text":"保留","weight":1}]';
    }
  },
  {
    remark: '传入根的祖先设置 hidden、translate=no 或 notranslate 也生效，解除后可正常分析',
    test: function () {
      var ancestor = document.createElement('div'), root = document.createElement('p');
      root.textContent = '正文';
      ancestor.append(root);
      ancestor.hidden = true;
      var hidden = translate.group.analyze(root).length;
      ancestor.hidden = false;
      ancestor.setAttribute('translate', 'no');
      var disabled = translate.group.analyze(root).length;
      ancestor.removeAttribute('translate');
      ancestor.className = 'notranslate';
      var excluded = translate.group.analyze(root).length;
      ancestor.className = '';
      return hidden === 0 && disabled === 0 && excluded === 0 &&
        JSON.stringify(translate.group.analyze(root)) === '[{"text":"正文","weight":0}]';
    }
  },
  { remark: 'null 不能作为分析根，返回空数组', args: [null], expected: [] },
  { remark: '省略分析根返回空数组', args: [], expected: [] },
  {
    remark: 'TextNode 不能代替 Element 作为分析根',
    test: function () {
      return JSON.stringify(translate.group.analyze(document.createTextNode('正文'))) === '[]';
    }
  },
  {
    remark: '没有文字的元素返回空数组',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '<span></span><!--空段落-->';
      return JSON.stringify(translate.group.analyze(root)) === '[]';
    }
  },
  {
    remark: '重复分析不改文字、标签、登记数组和翻译队列，返回的数组和条目各自独立',
    test: function () {
      var root = document.createElement('div');
      root.innerHTML = '普通<span title="标题">强调</span>';
      translate.group.elements = [root];
      var elements = translate.group.elements, html = root.innerHTML;
      var queueKeys = Object.keys(translate.nodeQueue).join(',');
      var first = translate.group.analyze(root), second = translate.group.analyze(root);
      var expected = '[{"text":"普通","weight":0},{"text":"强调","weight":1}]';
      var same = JSON.stringify(first) === expected && JSON.stringify(second) === expected;
      first[0].text = '调用方修改';
      return same && first !== second && first[0] !== second[0] &&
        JSON.stringify(second) === expected && root.innerHTML === html &&
        translate.group.elements === elements && elements.length === 1 && elements[0] === root &&
        Object.keys(translate.nodeQueue).join(',') === queueKeys;
    }
  }
]);
