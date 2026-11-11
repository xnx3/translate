require('../helpers/module')(__filename, [
  { remark: '安装 fetch 包装后传递 URL 与初始化参数并保持 owner', test: async function () {
    const response = new Response('ok'); let received;
    translate.network.fetch.hookFetch = async function (...args) { received = { owner: this, args }; return response; };
    translate.network.fetch.use(); const init = { method: 'POST' }; const result = await fetch('/sample', init);
    return result === response && received.owner === translate.network.fetch && received.args[0] === '/sample' && received.args[1] === init;
  } },
  { remark: 'Request 对象作为参数时保持对象身份', test: async function () {
    const input = new Request(location.origin + '/sample'); let received;
    translate.network.fetch.hookFetch = async function (value) { received = value; return new Response('ok'); };
    translate.network.fetch.use(); await fetch(input);
    return received === input;
  } },
  { remark: '重复安装不会令一次 fetch 重复触发 hook', test: async function () {
    let calls = 0; translate.network.fetch.hookFetch = async function () { calls++; return new Response('ok'); };
    translate.network.fetch.use(); translate.network.fetch.use(); await fetch('/sample');
    return calls === 1;
  } },
  { remark: 'hook 的拒绝结果传递给调用者', test: async function () {
    const error = new Error('test failure'); translate.network.fetch.hookFetch = async function () { throw error; };
    translate.network.fetch.use(); try { await fetch('/sample'); return false; } catch (actual) { return actual === error; }
  } }
]);
