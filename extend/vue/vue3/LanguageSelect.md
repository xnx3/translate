# VUE3

## 接入 vue3 方式使用 translate.js
http://translate.zvo.cn/4041.html

## 页面上出现语言切换的Select下拉切换菜单

### 效果
见下图右上角的多语言切换  
![](./resource/preview.png)  
这个多语言切换的 Select 很原始，你可以对它使用CSS进行美化、或自定义其html显示方式。具体可参考本文档后面的css美化及自定义html。  
另外如果你用其他UI框架，如 ArcoDesign、 naiveUI ... 等等，也可以直接进行引入对应UI框架的切换语言模块进行使用。[具体可点此查看](./README.md)

### 代码

比如要在 index.vue 页面上显示切换语言的 select 下拉菜单，那么 index.vue 页面中，要进行的操作：  
先在 index.vue 中，加入一行，导入此UI框架的多语言切换Select 
````import LanguageSelect from 'i18n-jsautotranslate/vue/vue3/LanguageSelect.vue';````  
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
import LanguageSelect from 'i18n-jsautotranslate/vue/vue3/LanguageSelect.vue';
</script>

<style scoped>
.LanguageSelect {
  position: fixed;
  top: 20px;
  right: 80px;
}
</style>
````

### 自定义切换语言的html代码
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
  <!-- 使用作用域插槽，直接使用子组件传递过来的数据和方法 -->
  <template #default="{ LanguageSelectLanguageList, LanguageSelectOnChange }">
      <select
        v-model="language"
        @change="LanguageSelectOnChange"
        class="ignore LanguageSelect"
      >
        <option value="" disabled>Please select language</option>
        <option v-for="option in LanguageSelectLanguageList" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </select>
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
      <!-- 使用作用域插槽，直接使用子组件传递过来的数据和方法 -->
      <template #default="{ LanguageSelectLanguageList, LanguageSelectOnChange }">
          <select
            v-model="language"
            @change="LanguageSelectOnChange"
            class="ignore LanguageSelect"
          >
            <option value="" disabled>Please select language</option>
            <option v-for="option in LanguageSelectLanguageList" :key="option.id" :value="option.id">
              {{ option.name }}
            </option>
          </select>
      </template>
    </LanguageSelect>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import LanguageSelect from 'i18n-jsautotranslate/vue/vue3/LanguageSelect.vue';

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
