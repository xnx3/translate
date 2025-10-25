VUE3 中 使用 translate.js

## 第一步：修改 package.json 文件 
dependencies 中增加
````
"i18n-jsautotranslate": "^3.18.77",
````
然后执行 ````npm install```` (或 ````yarn install```` 或 ````pnpm install```` 等等)

## 第二步：增加 translate.js (或ts) 文件
比如，在你项目的 utils 目录（或其他什么目录都行）下，新增 translate.js (或.ts 只是后缀自己改一下就行) 文件。  
[此文件源码点此查看](./translate.ts)  
这个文件也是你当前项目对翻译进行各种自定义微调所在。  
有什么要设置的，比如设置使用你私有部署的翻译服务器提供翻译服务、设置哪些文字不进行翻译、设置自定义术语 ……等等

## 第三步：修改 main.js (或ts) 文件
首先导入 上一步新建的文件，也就是新增一行 import : 
````
import {translateJsVueUseModel} from './utils/translate' // 多语言切换, 导入translate插件
````
  
然后在 ````const app = createApp(App)```` 跟 ````app.mount('#app')```` 的中间，新增 ````app.use(translateJsVueUseModel);````  

改好的 main.js 文件如下图所示：  
````
import { createApp } from 'vue'
import App from './App.vue'
import {translateJsVueUseModel} from './utils/translate' // 多语言切换, 导入translate插件

const app = createApp(App);
app.use(translateJsVueUseModel);   //注释掉，即可停用多语言切换能力
app.mount('#app');
````

## 第四步：在页面上出现Select下拉切换语言菜单

文档参见： [./LanguageSelect.md](./LanguageSelect.md)
  

另外，我们针对部分UI框架，进行了适配，你可以直接快速使用
*  [ArcoDesign](../../ArcoDesign/Vue3/README.md)
*  [naiveUI](../../naiveUI/README.md)
  
如果你使用的别的UI框架，可以 [联系我](http://translate.zvo.cn/4030.html) 沟通，目前正在增加其他主流UI框架的，没准你要的就恰好有了，或者直接针对你当前使用的进行新适配。  

## 第五步：DEMO参考示例
参见： [demo/README.md](./demo/README.md)

## 注意
比如你vue页面中有个按钮，点击后触发切换为某种语言，正常使用是 `translate.changeLanguage('english');`  而在vue代码中如果提示 `translate not find` ，那么你触发时前面额外加个windows.即可 ： `window.translate.changeLanguage('english');`
