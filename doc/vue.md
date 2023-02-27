
# 简介
可在 vue 项目中的详细使用说明

# 使用

1. 打开终端，执行指令

   ```shell
   npm i i18n-jsautotranslate
   ```

   > npm仓库地址：[https://www.npmjs.com/package/i18n-jsautotranslate](https://www.npmjs.com/package/i18n-jsautotranslate)

2. 在需要的页面引入

   ```js
   import translate from 'i18n-jsautotranslate'
   ```

3. 页面模版写一个id标签，必须命名为`id="translate"`

   ```html
   <div id="translate"></div>
   ```

4. 在生命周期`mounted() `中载入

   ```js
   translate.setUseVersion2(); //设置使用v2.x 版本
   translate.language.setLocal('chinese_simplified'); //设置本地语种（当前网页的语种）。如果不设置，默认自动识别当前网页显示文字的语种。 可填写如 'english'、'chinese_simplified' 等，具体参见文档下方关于此的说明。
   translate.execute();//进行翻译
   ```



# 编写

本篇文档编写者：邓亚军

