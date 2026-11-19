# 同源 iframe 翻译

在页面执行翻译前启用同源 iframe 翻译。旧的脚本地址字符串用法继续支持：

```js
translate.element.iframe.use('/translate.js');
```

也可以传入配置对象，`url` 为注入子页的 translate.js 地址：

```js
translate.element.iframe.use({
    url: '/translate.js',
    setConfig: function(config, iframeWindow) {
        // 子页使用自己的翻译范围，不继承父页中的 DOM 节点。
        delete config.documents;

        // 或者指定子页中的区域：
        // config.documents = [iframeWindow.document.querySelector('#content')];
    }
});
```

`setConfig(config, iframeWindow)` 在自动注入成功后及已加载的无 src 子页重新同步配置时调用。`config` 是本次将传给子页 `translate.config.set()` 的配置，`iframeWindow` 是目标子页窗口。

钩子同步执行，直接修改 `config`，无需返回值，不等待 Promise。钩子抛出异常时，本次配置传递停止，异常保留。未提供钩子时保持原有配置传递行为，包括 `documents`；库不会自动删除父页范围。

配置外层对象由 `config.get()` 新建，删除其 `documents` 字段不会删除父实例的范围。内部数组、对象仍按现有接口共享引用，修改其中的元素可能影响父实例。

每次调用 `use()` 会替换当前选项。因此再次使用字符串形式会清除之前的钩子。选项作用于当前实例负责注入或同步的 iframe，不会自动启用更深层 iframe 的翻译。
