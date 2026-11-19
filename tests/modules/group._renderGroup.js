'use strict';

function checkGroupRender(change) {
  translate.language.setLocal('chinese_simplified');
  translate.to = 'english';
  const article = document.createElement('article');
  article.innerHTML = '<p><b>我们</b>是<b>全世界</b>最好的</p>';
  document.body.append(article);
  const paragraph = article.firstChild;
  const first = paragraph.firstChild, second = paragraph.querySelectorAll('b')[1];
  translate.group.addElements(paragraph);
  translate.element.whileNodes('group-render', article);
  const [group] = translate.group._prepareGroups('group-render');
  const response = { words: ['We', ' are', ' world', ' the best in the'].map(text => ({ text })), order: [0,1,3,2] };

  // 这些改动发生在准备请求之后、开始回填之前；同一段落内的其他片段必须一起接受或一起放弃。
  switch (change) {
    case 'removed': translate.group.elements = []; break;
    case 'filter': translate.group.addElements(paragraph, el => el !== second); break;
    case 'translate-no': second.setAttribute('translate', 'NO'); break;
    case 'outer-hidden': article.hidden = true; break;
    case 'ignore-class': translate.ignore.class.push('keep-source'); second.className = 'keep-source'; break;
    case 'edited': second.firstChild.nodeValue = '网页已修改'; break;
    case 'target-changed': translate.to = 'french'; break;
    case 'ancestor-moved': {
      const newContainer = document.body.appendChild(document.createElement('main'));
      newContainer.append(article);
      break;
    }
    case 're-enabled':
      translate.group.addElements(paragraph, el => el !== second);
      translate.group.addElements(second);
      break;
  }
  const before = paragraph.innerHTML;
  const rendered = translate.group._renderGroup(group, response);
  if (change !== 'allowed' && change !== 're-enabled') return rendered === false && paragraph.innerHTML === before;
  return rendered === true && paragraph.textContent === 'We are the best in the world' &&
    paragraph.firstChild === first && first.textContent === 'We' &&
    paragraph.lastChild === second && second.textContent === ' world';
}

require('../helpers/module')(__filename, [
  ['四片段按 order 调整顺序并保留两个加粗节点', 'allowed'],
  ['撤销区域登记后保留原段落', 'removed'],
  ['登记回调改为排除后代时整段停止回填', 'filter'],
  ['内层新增 translate=no 时保留整个原段落', 'translate-no'],
  ['登记根外的祖先变为隐藏时保留整个原段落', 'outer-hidden'],
  ['新加入的全局忽略 class 在回填前生效', 'ignore-class'],
  ['响应到达前页面自行修改的文字保持最新状态', 'edited'],
  ['外层过滤后仍由独立登记的内层允许翻译', 're-enabled'],
  ['参数组合：请求期间切换目标语种，旧响应不回写也不调序', 'target-changed'],
  ['参数组合：完整段落连同直属父级搬入新容器后，旧布局不得写回', 'ancestor-moved']
].map(([remark, input]) => ({ remark, input, test: checkGroupRender })));
