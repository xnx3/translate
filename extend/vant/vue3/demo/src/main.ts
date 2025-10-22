import { createApp } from 'vue'
import App from './App.vue'
import {translateJsVueUseModel} from './utils/translate.ts' // 多语言切换, 导入translate插件

const app = createApp(App)
app.use(translateJsVueUseModel);   //注释掉，即可停用多语言切换能力
app.mount('#app')
