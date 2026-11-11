'use strict';

require('../helpers/module')(__filename, [
  {
    remark: '单条相对图片映射加入队列并返回 undefined',
    test: function () {
      const result = translate.images.add({ '/before.png': 'https://images.example/after_{language}.png' });
      return result === undefined && translate.images.queues['/before.png'] === 'https://images.example/after_{language}.png';
    }
  },
  {
    remark: '同一对象中的多条图片映射全部加入',
    test: function () {
      translate.images.add({ '/one.png': '/new-one.png', '/two.png': '/new-two.png' });
      return translate.images.queues['/one.png'] === '/new-one.png' && translate.images.queues['/two.png'] === '/new-two.png';
    }
  },
  {
    remark: '绝对 URL 键保持原始值，不裁剪查询参数',
    test: function () {
      translate.images.add({ 'https://images.example/old.png?v=1': 'https://images.example/new.png?v=2' });
      return translate.images.queues['https://images.example/old.png?v=1'] === 'https://images.example/new.png?v=2';
    }
  },
  {
    remark: '重复追加相同旧图片键时采用最后映射',
    test: function () {
      translate.images.add({ '/same.png': '/first.png' });
      translate.images.add({ '/same.png': '/last.png' });
      return translate.images.queues['/same.png'] === '/last.png';
    }
  },
  {
    remark: '连续追加不同图片时保留已有映射',
    test: function () {
      translate.images.add({ '/first.png': '/new-first.png' });
      translate.images.add({ '/second.png': '/new-second.png' });
      return translate.images.queues['/first.png'] === '/new-first.png' && translate.images.queues['/second.png'] === '/new-second.png';
    }
  },
  {
    remark: '空对象不会清空已配置队列',
    test: function () {
      translate.images.add({ '/first.png': '/new-first.png' });
      translate.images.add({});
      return translate.images.queues['/first.png'] === '/new-first.png';
    }
  },
  {
    remark: '继承的图片属性不会加入队列',
    test: function () {
      const input = Object.create({ '/inherited.png': '/excluded.png' });
      input['/own.png'] = '/included.png';
      translate.images.add(input);
      return translate.images.queues['/own.png'] === '/included.png' &&
        !Object.prototype.hasOwnProperty.call(translate.images.queues, '/inherited.png');
    }
  },
  {
    remark: 'Unicode 路径与多个语种占位符原样保存',
    test: function () {
      translate.images.add({ '/图片😀.png': 'https://images.example/{language}/图片_{language}.png' });
      return translate.images.queues['/图片😀.png'] === 'https://images.example/{language}/图片_{language}.png';
    }
  },
  {
    remark: '配置对象本身不被增加或修改属性',
    test: function () {
      const input = { '/before.png': '/after.png' };
      translate.images.add(input);
      return Object.keys(input).length === 1 && input['/before.png'] === '/after.png';
    }
  }
]);
