'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// 复用已经锁定版本的 Playwright 所带解析器，不新增测试依赖。
// 按语法树清点具名入口，避免把注释中的旧代码、局部函数和回调误算为方法。
const bundle = path.join(path.dirname(require.resolve('playwright/package.json')), 'lib/transform/babelBundle');
const { babelParse, traverse } = require(bundle);

function signature(name, kind, params) {
  const member = ['constructor', 'static', 'instance'].includes(kind) ? kind + ' ' : '';
  return member + name + '(' + params.join(', ') + ')';
}

module.exports = function methodInventory() {
  const source = fs.readFileSync(path.resolve(__dirname, '../translate.js/translate.js'), 'utf8');
  const ast = babelParse(source, 'translate.js', false);
  const methods = new Map();
  const owners = new WeakMap();
  const key = (node, computed) => {
    if (!node) return; // 类静态初始化块没有属性名。
    if (!computed && node.type === 'Identifier') return node.name;
    if (node.type === 'StringLiteral' || node.type === 'NumericLiteral') return String(node.value);
  };
  const parameters = node => node.params.map(param => source.slice(param.start, param.end));

  function add(pathName, node, kind, fn) {
    const name = pathName.slice(1);
    const params = fn ? parameters(fn) : [];
    if (!methods.has(name)) {
      methods.set(name, { name, line: node.loc.start.line, kind, params, file: name + '.js', signatures: [] });
    }
    // 同一路径只对应一个测试文件，覆盖、重载或静态/实例同名仍分别校验签名。
    const variants = methods.get(name).signatures;
    const current = signature(name, kind, params);
    if (!variants.includes(current)) variants.push(current);
  }

  function scan(object, prefix, scope) {
    for (const property of object.properties) {
      if (!['ObjectProperty', 'ObjectMethod'].includes(property.type)) continue;
      const propertyName = key(property.key, property.computed);
      if (propertyName === undefined) continue;
      const value = property.type === 'ObjectMethod' ? property : property.value;
      scanValue(value, prefix + '.' + propertyName, property, 'method', scope);
    }
  }

  function scanValue(value, name, node, kind, scope) {
    if (!value) return;
    if (value.type === 'Identifier') {
      // 支持 {convert} 和 translate.convert = convert，也尊重同名局部绑定。
      const binding = scope.getBinding(value.name);
      if (!binding?.constant) return;
      const declaration = binding.path.node;
      value = declaration.type === 'VariableDeclarator' ? declaration.init : declaration;
      if (!value || !['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(value.type)) return;
    }
    if (['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression', 'ObjectMethod', 'ClassMethod'].includes(value.type)) {
      add(name, node, kind, value);
      if (value.type !== 'ArrowFunctionExpression') {
        owners.set(value, { prefix: name.slice(0, name.lastIndexOf('.')), kind });
      }
    } else if (value.type === 'ObjectExpression') {
      scan(value, name, scope);
    } else if (value.type === 'ClassExpression') {
      const constructor = value.body.body.find(member => member.kind === 'constructor');
      add(name, node, 'constructor', constructor);
      if (constructor) owners.set(constructor, { prefix: name, kind: 'instance' });
      for (const member of value.body.body) {
        const memberName = key(member.key, member.computed);
        if (memberName === undefined || member.kind === 'constructor') continue;
        const fn = member.type === 'ClassMethod' ? member : member.value;
        // 数据字段（含对象默认值）不属于方法。
        if (fn && ['ClassMethod', 'FunctionExpression', 'ArrowFunctionExpression', 'Identifier'].includes(fn.type)) {
          scanValue(fn, name + '.' + memberName, member, member.static ? 'static' : 'instance', scope);
        }
      }
    }
  }

  traverse(ast, {
    VariableDeclarator(item) {
      const node = item.node;
      if (node.init?.type !== 'ObjectExpression' || !item.parentPath.parentPath.isProgram()) return;
      if (node.id.name === 'translate') scan(node.init, '', item.scope);
      // nodeuuid 是同一发布文件中的全局辅助对象，文件名保留 nodeuuid 前缀。
      if (node.id.name === 'nodeuuid') scan(node.init, '.nodeuuid', item.scope);
    },
    AssignmentExpression(item) {
      const node = item.node;
      if (node.operator !== '=') return;
      let owner = node.left;
      const parts = [];
      while (owner.type === 'MemberExpression') {
        const name = key(owner.property, owner.computed);
        if (name === undefined) return;
        parts.unshift(name);
        owner = owner.object;
      }
      if (!parts.length) return;
      let prefix;
      let kind = 'dynamic';
      if (owner.type === 'ThisExpression') {
        const enclosing = item.findParent(parent => parent.isFunction() && !parent.isArrowFunctionExpression());
        const receiver = owners.get(enclosing?.node);
        if (!receiver) return;
        prefix = receiver.prefix;
        if (receiver.kind === 'static' || receiver.kind === 'instance') kind = receiver.kind;
      } else if (owner.type === 'Identifier' && ['translate', 'nodeuuid'].includes(owner.name)) {
        if (!item.scope.getBinding(owner.name)?.scope.path.isProgram()) return;
        prefix = owner.name === 'translate' ? '' : '.nodeuuid';
      }
      if (prefix !== undefined) scanValue(node.right, prefix + '.' + parts.join('.'), node, kind, item.scope);
    }
  });

  return [...methods.values()].sort((a, b) => a.name.localeCompare(b.name));
};

if (require.main === module) {
  const entries = module.exports();
  const modules = path.join(__dirname, 'modules');
  const signatures = entries.flatMap(method => method.signatures);
  const reviewed = fs.readFileSync(path.join(__dirname, 'method-signatures.txt'), 'utf8').trimEnd().split(/\r?\n/);
  const sourceSet = new Set(signatures);
  const reviewedSet = new Set(reviewed);
  const added = signatures.filter(signature => !reviewedSet.has(signature));
  const removed = reviewed.filter(signature => !sourceSet.has(signature));

  // 从 Playwright 的实际发现结果清点。存在同名空文件时也能发现漏测，无需启动浏览器。
  const run = spawnSync(process.execPath, [require.resolve('@playwright/test/cli'), 'test', '--list',
    '--project=strict', '--reporter=json', 'modules'], {
    cwd: __dirname, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_FILE: '', PLAYWRIGHT_JSON_OUTPUT_NAME: '' }
  });
  if (run.error) throw run.error;
  if (run.status !== 0) {
    console.error(run.stderr || run.stdout);
    process.exit(1);
  }
  const cases = new Map();
  function collect(suite, moduleFile) {
    if (suite.file?.replaceAll('\\', '/').startsWith('modules/')) moduleFile = path.basename(suite.file);
    for (const spec of suite.specs || []) {
      // --list 中所有 status 都是 skipped；expectedStatus 才区分正常、跳过和预期失败。
      if (!spec.tests.some(test => test.expectedStatus === 'passed')) continue;
      if (!cases.has(moduleFile)) cases.set(moduleFile, []);
      cases.get(moduleFile).push(spec.title);
    }
    for (const child of suite.suites || []) collect(child, moduleFile);
  }
  collect(JSON.parse(run.stdout));
  const missing = entries.filter(method => !cases.has(method.file));
  const files = new Set(entries.map(method => method.file));
  const extra = fs.readdirSync(modules).filter(file => file.endsWith('.js') && !files.has(file));
  if (process.argv.includes('--cases')) {
    for (const method of entries) {
      console.log(method.signatures.join('\n'));
      for (const title of cases.get(method.file) || []) console.log('  ' + title);
    }
  }
  console.log(JSON.stringify({ total: entries.length, present: entries.length - missing.length,
    cases: entries.reduce((sum, method) => sum + (cases.get(method.file)?.length || 0), 0),
    missing: missing.map(method => method.name), extra, added, removed }, null, 2));
  if (missing.length || extra.length || added.length || removed.length) process.exitCode = 1;
}
