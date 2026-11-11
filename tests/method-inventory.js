'use strict';

const fs = require('fs');
const path = require('path');

// 复用已经锁定版本的 Playwright 所带解析器，不新增测试依赖。
// 按语法树清点具名入口，避免把注释中的旧代码、局部函数和回调误算为方法。
const bundle = path.join(path.dirname(require.resolve('playwright/package.json')), 'lib/transform/babelBundle');
const { babelParse, traverse } = require(bundle);

module.exports = function methodInventory() {
  const source = fs.readFileSync(path.resolve(__dirname, '../translate.js/translate.js'), 'utf8');
  const ast = babelParse(source, 'translate.js', false);
  const methods = [];
  const classes = [];
  const dynamic = [];
  const key = node => node.name === undefined ? node.value : node.name;
  const parameters = node => node.params.map(param => source.slice(param.start, param.end));

  function add(name, node, kind, fn = node) {
    methods.push({ name, line: node.loc.start.line, kind, params: parameters(fn) });
  }

  function scan(object, prefix) {
    for (const property of object.properties) {
      if (!['ObjectProperty', 'ObjectMethod'].includes(property.type) || property.computed) continue;
      const name = prefix + '.' + key(property.key);
      const value = property.type === 'ObjectMethod' ? property : property.value;
      if (['FunctionExpression', 'ArrowFunctionExpression', 'ObjectMethod'].includes(value.type)) {
        add(name, property, 'method', value);
      } else if (value.type === 'ObjectExpression') {
        scan(value, name);
      } else if (value.type === 'ClassExpression') {
        const constructor = value.body.body.find(member => member.kind === 'constructor');
        classes.push({ name, line: property.loc.start.line, kind: 'constructor',
          params: constructor ? parameters(constructor) : [] });
        for (const member of value.body.body) {
          if (member.computed || member.kind === 'constructor') continue;
          const fn = member.type === 'ClassMethod' ? member : member.value;
          if (member.type !== 'ClassMethod' && (!fn || !['FunctionExpression', 'ArrowFunctionExpression'].includes(fn.type))) continue;
          add(name + '.' + key(member.key), member, member.static ? 'static' : 'instance', fn);
        }
      }
    }
  }

  traverse(ast, {
    VariableDeclarator(item) {
      const node = item.node;
      if (node.init?.type !== 'ObjectExpression') return;
      if (node.id.name === 'translate') scan(node.init, '');
      // nodeuuid 是同一发布文件中的全局辅助对象，文件名保留 nodeuuid 前缀。
      if (node.id.name === 'nodeuuid') scan(node.init, '.nodeuuid');
    },
    AssignmentExpression(item) {
      const node = item.node;
      if (!['FunctionExpression', 'ArrowFunctionExpression'].includes(node.right.type)) return;
      let owner = node.left;
      const parts = [];
      while (owner.type === 'MemberExpression' && !owner.computed) {
        parts.unshift(key(owner.property));
        owner = owner.object;
      }
      if (owner.type === 'Identifier' && owner.name === 'translate') {
        dynamic.push({ name: '.' + parts.join('.'), line: node.loc.start.line,
          kind: 'dynamic', params: parameters(node.right) });
      }
    }
  });

  // 覆盖已有方法的赋值不产生第二个入口；动态创建的方法单独列出。
  const names = new Set(methods.map(method => method.name));
  return [...methods, ...classes, ...dynamic.filter(method => !names.has(method.name))]
    .map(method => ({ ...method, name: method.name.slice(1), file: method.name.slice(1) + '.js' }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

if (require.main === module) {
  const entries = module.exports();
  const modules = path.join(__dirname, 'modules');
  const missing = entries.filter(method => !fs.existsSync(path.join(modules, method.file)));
  console.log(JSON.stringify({ total: entries.length, present: entries.length - missing.length,
    missing: missing.map(method => ({ method: method.name, params: method.params })) }, null, 2));
  // 新增源码方法或误删模块时，让启动器能够阻止漏测，不能只打印清单后仍报告成功。
  if (missing.length) process.exitCode = 1;
}
