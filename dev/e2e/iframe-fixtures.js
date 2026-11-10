'use strict';

// These pages exercise real iframe discovery and injection. They never call the
// injector directly or copy translate configuration into a child themselves.

function documentPage(title, head, body) {
  return `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><title>${title}</title>${head}</head><body>${body}</body></html>`;
}

function config(port, build, owner, middle = false) {
  return `<script src="/${build}"></script><script>
    translate.request.api.host = ['http://127.0.0.1:${port}/'];
    translate.request.api.connectTest = '';
    translate.request.api.init = '';
    translate.request.api.language = 'language.json';
    translate.request.api.translate = 'translate.json';
    translate.request.appendParams.__e2e_owner = ${JSON.stringify(owner)};
    translate.language.setLocal('chinese_simplified');
    translate.language.setDefaultTo('english');
    translate.selectLanguageTag.show = ${!middle};
    ${middle ? "translate.ignore.text.push('忽略我TEXT');" : ''}
  </script>`;
}

function childBody(marker = '') {
  return `<div id="translate"></div>
    <h1 id="frame-title">你好世界</h1>
    <p id="frame-p">这是一个测试。</p>
    <p id="frame-ignored">忽略我TEXT</p>
    <div id="frame-dynamic-host"></div>
    <button id="add-content">Add content</button>
    <div id="frame-marker">${marker.replace(/[&<>"']/g, '')}</div>
    <script>
      document.getElementById('add-content').addEventListener('click', function () {
        const node = document.createElement('p');
        node.id = 'frame-dynamic';
        node.textContent = '动态内容';
        document.getElementById('frame-dynamic-host').appendChild(node);
      });
      window.__frameReady = true;
    </script>`;
}

function childPage(port, build, preloaded, marker) {
  return documentPage('iframe suite child', preloaded ? config(port, build, 'child', true) : '',
    childBody(marker) + (preloaded ? '<script>translate.listener.start(); translate.execute();</script>' : ''));
}

function start(build) {
  return `translate.element.iframe.use('/${build}');
    translate.listener.start();
    translate.execute();
    window.__suiteReady = true;`;
}

function middlePage(port, build, scenario) {
  return documentPage('iframe suite middle', config(port, build, 'middle', true),
    `<div id="translate"></div><h1 id="suite-title">中文段落。</h1>
    <button id="add-inner">Add inner frame</button><div id="inner-host"></div>
    <script>${start(build)}
      document.getElementById('add-inner').addEventListener('click', function () {
        const frame = document.createElement('iframe');
        frame.id = 'inner';
        frame.src = '/iframe-suite-child.html?marker=inner';
        document.getElementById('inner-host').appendChild(frame);
      });
    </script>`);
}

function suitePage(port, build, scenario) {
  const alternatePort = port === 8123 ? 8124 : 8123;
  const title = '<div id="translate"></div><h1 id="suite-title">中文段落。</h1>';
  if (scenario === 'nested-empty') {
    return documentPage('iframe suite empty ancestor', '', title +
      '<iframe id="middle" src="/iframe-suite-middle.html?scenario=nested-empty"></iframe><script>window.__suiteReady = true;</script>');
  }
  if (scenario === 'deep-empty') {
    return documentPage('iframe suite deep empty ancestor', '', title +
      '<iframe id="wrapper" src="/iframe-suite-wrapper.html"></iframe><script>window.__suiteReady = true;</script>');
  }
  if (scenario === 'cross-ancestor') {
    return documentPage('iframe suite cross-origin ancestor', '', title +
      `<iframe id="middle" src="http://127.0.0.1:${alternatePort}/iframe-suite-middle.html?scenario=cross-ancestor"></iframe><script>window.__suiteReady = true;</script>`);
  }

  let frames = '';
  let setup = '';
  if (scenario === 'static' || scenario === 'loaded') {
    frames = '<iframe id="child" src="/iframe-suite-child.html?marker=initial"></iframe>';
    if (scenario === 'loaded') {
      setup = `document.getElementById('child').addEventListener('load', function () { ${start(build)} }, { once: true });`;
    }
  } else if (scenario === 'disabled') {
    frames = '<div id="frame-host"></div>';
    setup = `const frame = document.createElement('iframe');
      frame.id = 'child';
      frame.src = '/iframe-suite-child.html?marker=disabled';
      document.getElementById('frame-host').appendChild(frame);`;
  } else if (scenario === 'dynamic' || scenario === 'existing') {
    frames = '<button id="add-frame">Add frame</button><div id="frame-host"></div>';
    setup = `document.getElementById('add-frame').addEventListener('click', function () {
      const frame = document.createElement('iframe');
      frame.id = 'child';
      frame.src = ${JSON.stringify(scenario === 'existing' ? '/iframe-suite-child.html?preloaded=1&marker=existing' : '/iframe-suite-child.html?marker=dynamic')};
      document.getElementById('frame-host').appendChild(frame);
    });`;
  } else if (scenario === 'blank') {
    frames = '<div id="frame-host"></div>';
    setup = `const frame = document.createElement('iframe');
      frame.id = 'child';
      document.getElementById('frame-host').appendChild(frame);
      frame.contentDocument.open();
      frame.contentDocument.write(${JSON.stringify(documentPage('iframe suite about blank', '', childBody('blank'))).replace(/<\/script/gi, '<\\/script')});
      frame.contentDocument.close();`;
  } else if (scenario === 'srcdoc') {
    frames = '<iframe id="child"></iframe>';
    setup = `const frame = document.getElementById('child');
      function startAfterSrcdocLoad() {
        if (frame.contentDocument.URL !== 'about:srcdoc') return;
        frame.removeEventListener('load', startAfterSrcdocLoad);
        ${start(build)}
      }
      frame.addEventListener('load', startAfterSrcdocLoad);
      frame.srcdoc = ${JSON.stringify(documentPage('iframe suite srcdoc', '', childBody('srcdoc'))).replace(/<\/script/gi, '<\\/script')};`;
  } else if (scenario === 'siblings') {
    frames = '<div id="frame-host"></div>';
    setup = `for (const [id, marker] of [['child', 'first'], ['child-2', 'second']]) {
      const frame = document.createElement('iframe');
      frame.id = id;
      frame.src = '/iframe-suite-child.html?marker=' + marker;
      document.getElementById('frame-host').appendChild(frame);
    }`;
  } else if (scenario === 'nested-config') {
    frames = '<iframe id="middle" src="/iframe-suite-middle.html?scenario=nested-config"></iframe>';
  } else if (scenario === 'cross-child') {
    frames = `<iframe id="child" src="http://127.0.0.1:${alternatePort}/iframe-suite-child.html?marker=cross-child"></iframe>`;
    setup = `document.getElementById('child').addEventListener('load', function () {
      ${start(build)}
      window.__suiteReady = false;
      this.addEventListener('load', function () { window.__suiteReady = true; }, { once: true });
      this.setAttribute('src', this.getAttribute('src'));
    }, { once: true });`;
  } else {
    return null;
  }

  // srcdoc is scanned after its document has loaded, so the case measures the
  // actual about:srcdoc origin decision instead of racing the initial blank page.
  const initialization = scenario === 'disabled'
    ? 'translate.listener.start(); translate.execute(); window.__suiteReady = true;' + setup
    : ['srcdoc', 'loaded', 'cross-child'].includes(scenario) ? setup : start(build) + setup;
  return documentPage('iframe suite ' + scenario, config(port, build, 'outer'),
    title + frames + `<script>${initialization}</script>`);
}

function renderIframeFixture(url, { port, build }) {
  if (url.pathname === '/iframe-suite.html') {
    return suitePage(port, build, url.searchParams.get('scenario') || 'static');
  }
  if (url.pathname === '/iframe-suite-child.html') {
    return childPage(port, build, url.searchParams.get('preloaded') === '1', url.searchParams.get('marker') || '');
  }
  if (url.pathname === '/iframe-suite-middle.html') {
    return middlePage(port, build, url.searchParams.get('scenario') || 'nested-empty');
  }
  if (url.pathname === '/iframe-suite-wrapper.html') {
    return documentPage('iframe suite empty wrapper', '',
      '<iframe id="middle" src="/iframe-suite-middle.html?scenario=deep-empty"></iframe><script>window.__suiteReady = true;</script>');
  }
  return null;
}

module.exports = { renderIframeFixture };
