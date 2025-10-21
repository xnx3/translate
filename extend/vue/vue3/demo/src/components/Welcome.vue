<script setup>
import LanguageSelect from 'i18n-jsautotranslate/vue/vue3/LanguageSelect.vue';
</script>

<template>
  <p>
    欢迎使用 <span class="ignore">translate.js</span>
  </p>
  <p>
    AI i18n，两行js实现html全自动翻译，页面无需改动，无语言配置文件，无API Key，对SEO友好！
  </p>
  <p>
    开源仓库： 
    <a href="https://gitee.com/mail_osc/translate" target="_blank">Gitee</a>
     | 
    <a href="https://github.com/xnx3/translate" target="_blank">Github</a>
  </p>
  <p>
    VUE3中的使用说明： 
    <a href="https://gitee.com/mail_osc/translate/blob/master/extend/vue/vue3/README.md" target="_blank">Gitee</a>
     | 
    <a href="https://github.com/xnx3/translate/blob/master/extend/vue/vue3/README.md" target="_blank">Github</a>
  </p>
  <p>
    <LanguageSelect/>
  </p>
</template>