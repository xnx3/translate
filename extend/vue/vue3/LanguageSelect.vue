<template>
  <div class="LanguageSelect ignore">
    <!-- 使用作用域插槽，将组件内部的数据和方法传递给父组件 -->
    <slot 
      :LanguageSelectLanguageList="LanguageSelectLanguageList"
      :LanguageSelectOnChange="LanguageSelectOnChange"
    >
      <!-- 原生 select 实现 -->
      <select
        v-model="language"
        @change="LanguageSelectOnChange"
        class="ignore"
      >
        <option value="" disabled>Please select language</option>
        <option v-for="option in LanguageSelectLanguageList" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </select>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue';

// 定义语言选项类型
interface LanguageOption {
  id: string;
  name: string;
}

// 选中的语言ID（双向绑定值）
const language = ref<string | null>(null);

// 语言选项列表
const LanguageSelectLanguageList = ref<LanguageOption[]>([]);

// 处理语言选择变化
const LanguageSelectOnChange = (event: Event) => {
  // 从事件对象中获取选中的值
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  
  language.value = value;
  window.translate.selectLanguageTag.selectOnChange({
    target: {
      value: value
    }
  });
};

onMounted(() => {
  // 保留原有的初始化逻辑
  if (typeof (translate) == 'object' && typeof (translate.vue3) == 'object' && typeof (translate.vue3.isUse) == 'boolean' && translate.vue3.isUse == true) {
    // 正常，需要的，需要加载多语言切换Select
  } else {
    // 不需要显示
    return;
  }

  translate.time.log(translate.vue3.isUse);

  // 重写渲染语言下拉列表出现时的函数
  translate.selectLanguageTag.render = function () {
    if (translate.selectLanguageTag.alreadyRender) {
      return;
    }
    translate.selectLanguageTag.alreadyRender = true;

    // 判断如果不显示select选择语言，直接就隐藏掉
    if (!translate.selectLanguageTag.show) {
      return;
    }

    // 从服务器加载支持的语言库
    if (typeof (translate.request.api.language) == 'string' && translate.request.api.language.length > 0) {
      // 从接口加载语种
      translate.request.post(translate.request.api.language, {}, function (data) {
        if (data.result == 0) {
          console.log('load language list error : ' + data.info);
          return;
        }
        translate.request.api.language = data.list; // 进行缓存
        translate.selectLanguageTag.customUI(data.list);
      }, null);
    } else if (typeof (translate.request.api.language) == 'object') {
      // 无网络环境下，自定义显示语种
      translate.selectLanguageTag.customUI(translate.request.api.language);
    }

    // 显示切换语言
    const TranslateJsSelectLanguages = document.getElementsByClassName('LanguageSelect');
    for (let li = 0; li < TranslateJsSelectLanguages.length; li++) {
      TranslateJsSelectLanguages[li].style.display = 'block';
    }
  }

  // 处理语言列表数据
  translate.selectLanguageTag.customUI = function (externalLanguageList) {
    // 整理允许显示的语种
    const allowLanguageList: LanguageOption[] = [];

    // 判断 selectLanguageTag.languages 中允许使用哪些
    if (translate.selectLanguageTag.languages.length > 0) {
      // 设置了自定义显示的语言
      // 都转小写判断
      const langs_indexof = (',' + translate.selectLanguageTag.languages + ',').toLowerCase();

      for (let i = 0; i < externalLanguageList.length; i++) {
        if (langs_indexof.indexOf(',' + externalLanguageList[i].id.toLowerCase() + ',') < 0) {
          // 没发现，那不显示这个语种，调出
          continue;
        }
        allowLanguageList.push(externalLanguageList[i]);
      }

    } else {
      // 显示所有
      allowLanguageList.push(...externalLanguageList);
    }
    // 赋予带渲染到界面的语言列表数据
    LanguageSelectLanguageList.value = allowLanguageList;

    // 显示上一次切换后的语种
    language.value = translate.language.getCurrent();
  }

  // 渲染语言下拉列表出现
  translate.selectLanguageTag.refreshRender();
});
</script>

<style scoped>
/* 避免被遮挡无法操作，设置z-index较高 */
.LanguageSelect {
  z-index: 2147483583;
  display: none;
}
</style>
