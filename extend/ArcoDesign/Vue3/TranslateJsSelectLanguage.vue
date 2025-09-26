<template>
  <div class="TranslateJsSelectLanguage ignore">
    <!-- Arco Design 选择器组件 -->
    <a-select
      v-model="language"
      value-key="id"
      @change="TranslateJsSelectLanguageOnChange"
      popup-class="ignore"
      placeholder="请选择语言"
      style="width: 200px"
    >
      <!-- 语言选项列表（使用Select的子组件Option） -->
      <a-select-option
        class="ignore"
        v-for="item in languageList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </a-select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'; 
// 需要同时导入Select和Option组件
import { Select as ASelect, Option as ASelectOption } from '@arco-design/web-vue';
import translate from 'i18n-jsautotranslate'

// 定义语言选项类型
interface LanguageOption {
  id: string;
  name: string;
}

// 选中的语言ID（双向绑定值）
const language = ref<string | null>(null);
/* 
  语言选项列表
  其中的值为：
  { id: 'zh-CN', name: '简体中文' },
  { id: 'en-US', name: 'English' },
*/
const languageList = ref<LanguageOption[]>([]);

// 处理语言选择变化
const TranslateJsSelectLanguageOnChange = (value: string) => {
  window.translate.selectLanguageTag.selectOnChange({
      target: {
        value: value
      }
  });
};

// 组件挂载时初始化（可选）
onMounted(() => {
  var translate = window.translate;
  
    //languageList 便是当前支持的能切换的语种，你可以 console.log(languageList); 打印出来看看
    translate.selectLanguageTag.customUI = function(externalLanguageList){
        //整理允许显示的语种 
        var allowLanguageList: LanguageOption[] = [];
        
         //判断 selectLanguageTag.languages 中允许使用哪些
        if(translate.selectLanguageTag.languages.length > 0){
            //设置了自定义显示的语言
            //都转小写判断
            var langs_indexof = (','+translate.selectLanguageTag.languages+',').toLowerCase();
            
            for(var i = 0; i<externalLanguageList.length; i++){
              if(langs_indexof.indexOf(','+externalLanguageList[i].id.toLowerCase()+',') < 0){
                //没发现，那不显示这个语种，调出
                continue
              }
              allowLanguageList.push(externalLanguageList[i]);
             }
          
        }else{
          //显示所有
          allowLanguageList = externalLanguageList;
        }

        //赋予带渲染到界面的语言列表数据
        languageList.value = allowLanguageList;
    }

    //渲染语言下拉列表出现
    window.translate.selectLanguageTag.refreshRender();
    //显示上一次切换后的语种
    language.value = translate.language.getCurrent();
});
</script>

<style scoped>
/* 避免被遮挡无法操作，设置z-index较高 */
.TranslateJsSelectLanguage {
  z-index: 2147483583;
}
</style>
    