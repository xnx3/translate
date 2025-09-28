import {translateJsVueUseModel, translate} from './translateVue3TS' // 导入 translate 的 VUE3 的 ts 插件

/*
    
    translate.js AI 多语言切换模块的自定义配置。
    如果不想启用，你可以通过以下方式中的任何一种进行禁用
        1. 直接将所有配置全部注释掉
        2. 将 /src/main.ts 中的这一行 app.use(translateJsVueUseModel) 注释掉即可。

*/

//打印包含具体执行时间的debug日志
//translate.time.use = true;
//window.translate.time.printTime = 100;

// 针对翻译动作的性能监控 https://translate.zvo.cn/549733.html
translate.time.execute.start(); 

// 设置当前切换所支持的语言 http://translate.zvo.cn/4056.html
window.translate.selectLanguageTag.languages = 'chinese_simplified,english,korean,latin,french,russian'; 

// 设置本地语种（当前网页的语种） ，如果你网页语种很多，比如国际化论坛，哪个国家发言的都有，那这里你可以不用设置，交给 translate.js 自动去识别当前网页语种 http://translate.zvo.cn/4066.html
window.translate.language.setLocal('chinese_simplified');

// 本地语种也进行强制翻译 http://translate.zvo.cn/289574.html
//translate.language.translateLocal = true;

// 翻译时忽略指定的文字不翻译 http://translate.zvo.cn/283381.html
translate.ignore.text.push('ContiNew Admin'); 

// 网页打开时自动隐藏文字，翻译完成后显示译文 http://translate.zvo.cn/549731.html
// 注意，如果不启用本多语言切换能力，这个要注释掉，不然你网页的文本是会被隐藏的
//window.translate.visual.webPageLoadTranslateBeforeHiddenText({inHeadTip: false});

// 启用翻译中的遮罩层 http://translate.zvo.cn/407105.html
window.translate.progress.api.startUITip();

// 设置采用开源免费的 client.edge 无服务端翻译服务通道，无需任何注册接入即可直接使用 http://translate.zvo.cn/4081.html
translate.service.use('client.edge');

// 网页ajax请求触发自动翻译 http://translate.zvo.cn/4086.html
translate.request.listener.start();

// 开启页面元素动态监控，js改变的内容也会被翻译，参考文档： http://translate.zvo.cn/4067.html
translate.listener.start();

// 元素的内容整体翻译能力配置 ，提高翻译的语义 http://translate.zvo.cn/4078.html
translate.whole.enableAll();

//触发翻译执行，有关这个的说明可参考 http://translate.zvo.cn/547814.html
translate.execute(); 

//导出，其中translateJsVueUseModel为vue插件，translate为js函数
export { translateJsVueUseModel, translate };