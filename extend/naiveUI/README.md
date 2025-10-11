# Naive UI

## 接入 vue3 方式使用 translate.js
http://translate.zvo.cn/4041.html

## 页面上出现语言切换的Select下拉切换菜单

#### 效果
见下图右上角的多语言切换  
![](./resource/preview.png)

#### 代码

比如要在 index.vue 页面上显示切换语言的 select 下拉菜单，那么 index.vue 页面中，要进行的操作：  
先在 index.vue 中，加入一行，导入此UI框架的多语言切换Select 
````import LanguageSelect from 'i18n-jsautotranslate/naiveUI/LanguageSelect.vue';````  
然后在要显示select菜单的位置，直接加入  
````<LanguageSelect/>````  
即可。  
最后，可以使用css样式来进行自定义美化，比如要将这个语言切换放到页面的右上角：
````
/* 多语言切换Select */
.LanguageSelect {
	position: fixed;
	top: 20px;
	right: 80px;
}
````
注意，这个多语言切换的 select ，它的class 名字为 LanguageSelect  

完整的示例代码如下：
````
<template>
  <div class="login">
    <h3 class="login-logo">
      Logo
    </h3>

    <!-- 多语言切换的 Select 下拉选择 -->
    <LanguageSelect/>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import LanguageSelect from 'i18n-jsautotranslate/naiveUI/LanguageSelect.vue';
</script>

<style scoped>
.LanguageSelect {
  position: fixed;
  top: 20px;
  right: 80px;
}
</style>
````

#### 自定义切换语言的html代码
修改
````
<LanguageSelect/>
````
为：
````
<script setup>
//获取该用户之前是否有切换过语言，获取其最后一次切换的是什么语种，详细参考： http://translate.zvo.cn/4074.html
const language = window.translate.language.getCurrent(); 
</script>
<LanguageSelect>
  <template #default="{ LanguageSelectLanguageList, LanguageSelectOnChange, LanguageSelectRenderLabel }">
    <n-select
      v-model:value="language"
      @update:value="LanguageSelectOnChange"
      :options="LanguageSelectLanguageList"
      label-field="name"
      value-field="id"
      class="ignore"
      placeholder="请选择语言"
      :render-label="LanguageSelectRenderLabel"
    />
  </template>
</LanguageSelect>
````

完整的示例代码如下：
````
<template>
  <div class="login">
    <h3 class="login-logo">
      Logo
    </h3>

    <!-- 多语言切换的 Select 下拉选择 -->
    <LanguageSelect>
    <template #default="{ LanguageSelectLanguageList, LanguageSelectOnChange, LanguageSelectRenderLabel }">
      <n-select
        v-model:value="language"
        @update:value="LanguageSelectOnChange"
        :options="LanguageSelectLanguageList"
        label-field="name"
        value-field="id"
        class="ignore"
        placeholder="请选择语言"
        :render-label="LanguageSelectRenderLabel"
      />
    </template>
  </LanguageSelect>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import LanguageSelect from 'i18n-jsautotranslate/naiveUI/LanguageSelect.vue';

//获取该用户之前是否有切换过语言，获取其最后一次切换的是什么语种，详细参考： http://translate.zvo.cn/4074.html
const language = window.translate.language.getCurrent(); 
</script>

<style scoped>
.LanguageSelect {
  position: fixed;
  top: 20px;
  right: 80px;
}
</style>
````
