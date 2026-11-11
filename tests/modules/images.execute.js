'use strict';

require('../helpers/module')(__filename, [
  { remark: '无图片替换配置时返回 undefined', args: [], expected: undefined },
  {
    remark: '匹配 img 原始 src 后替换语种占位符',
    test: function () {
      translate.to = 'english';
      const image = document.createElement('img');
      image.setAttribute('src', '/favicon.ico?old=1');
      document.body.appendChild(image);
      translate.images.add({ '/favicon.ico?old=1': location.origin + '/favicon.ico?language={language}' });
      translate.images.execute();
      return image.getAttribute('src') === location.origin + '/favicon.ico?language=english';
    }
  },
  {
    remark: '同一映射中的多个占位符全部替换',
    test: function () {
      translate.to = 'spanish';
      const image = document.createElement('img');
      image.setAttribute('src', '/favicon.ico?old=1');
      document.body.appendChild(image);
      translate.images.add({ '/favicon.ico?old=1': location.origin + '/favicon.ico?a={language}&b={language}' });
      translate.images.execute();
      return image.getAttribute('src') === location.origin + '/favicon.ico?a=spanish&b=spanish';
    }
  },
  {
    remark: '映射没有占位符时仍使用固定新 URL',
    test: function () {
      const image = document.createElement('img');
      image.setAttribute('src', '/favicon.ico?old=1');
      document.body.appendChild(image);
      const next = location.origin + '/favicon.ico?fixed=1';
      translate.images.add({ '/favicon.ico?old=1': next });
      translate.images.execute();
      return image.getAttribute('src') === next;
    }
  },
  {
    remark: '没有匹配到的图片保持原 src',
    test: function () {
      const image = document.createElement('img');
      image.setAttribute('src', '/favicon.ico?unmatched=1');
      document.body.appendChild(image);
      translate.images.add({ '/favicon.ico?other=1': location.origin + '/favicon.ico?new=1' });
      translate.images.execute();
      return image.getAttribute('src') === '/favicon.ico?unmatched=1';
    }
  },
  {
    remark: '匹配时使用完整原始 src，不把相似查询参数当成同一图片',
    test: function () {
      const image = document.createElement('img');
      image.setAttribute('src', '/favicon.ico?id=12');
      document.body.appendChild(image);
      translate.images.add({ '/favicon.ico?id=1': location.origin + '/favicon.ico?new=1' });
      translate.images.execute();
      return image.getAttribute('src') === '/favicon.ico?id=12';
    }
  },
  {
    remark: '多个匹配图片全部处理，不遗漏后续节点',
    test: function () {
      translate.to = 'english';
      const first = document.createElement('img');
      const second = document.createElement('img');
      first.setAttribute('src', '/favicon.ico?old=1');
      second.setAttribute('src', '/favicon.ico?old=1');
      document.body.append(first, second);
      const next = location.origin + '/favicon.ico?language=english';
      translate.images.add({ '/favicon.ico?old=1': location.origin + '/favicon.ico?language={language}' });
      translate.images.execute();
      return first.getAttribute('src') === next && second.getAttribute('src') === next;
    }
  },
  {
    remark: '按计算样式中的绝对背景 URL 替换 CSS 背景图',
    test: function () {
      translate.to = 'english';
      const element = document.createElement('div');
      const before = location.origin + '/favicon.ico?background=old';
      element.style.backgroundImage = 'url("' + before + '")';
      document.body.appendChild(element);
      const next = location.origin + '/favicon.ico?background=english';
      translate.images.add({ [before]: location.origin + '/favicon.ico?background={language}' });
      translate.images.execute();
      return element.style.backgroundImage === 'url("' + next + '")';
    }
  },
  {
    remark: '没有映射的 CSS 背景图保持不变',
    test: function () {
      const element = document.createElement('div');
      const before = location.origin + '/favicon.ico?background=old';
      element.style.backgroundImage = 'url("' + before + '")';
      document.body.appendChild(element);
      translate.images.add({ '/other.png': '/new.png' });
      translate.images.execute();
      return element.style.backgroundImage === 'url("' + before + '")';
    }
  }
]);
