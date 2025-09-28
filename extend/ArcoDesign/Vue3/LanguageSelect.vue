<template>
  <div class="LanguageSelect ignore">
    <!-- Arco Design 选择器组件 -->
    <a-select
      v-model="language"
      value-key="id"
      @change="LanguageSelectOnChange"
      popup-class="ignore"
      placeholder="请选择语言"
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
import { ref, onMounted  } from 'vue'; 
// 需要同时导入Select和Option组件
import { Select as ASelect, Option as ASelectOption } from '@arco-design/web-vue';
//import translate from 'i18n-jsautotranslate'

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
const LanguageSelectOnChange = (value: string) => {
  window.translate.selectLanguageTag.selectOnChange({
      target: {
        value: value
      }
  });
};

onMounted(() => {
  //重写渲染语言下拉列表出现时的函数，这里是为了把默认创建的 <div id="translate" 这个给去掉，其他无改变
  translate.selectLanguageTag.render = function(){ //v2增加
    if(translate.selectLanguageTag.alreadyRender){
      return;
    }
    translate.selectLanguageTag.alreadyRender = true;
    
    //判断如果不显示select选择语言，直接就隐藏掉
    if(!translate.selectLanguageTag.show){
      return;
    }
    
    //从服务器加载支持的语言库
    if(typeof(translate.request.api.language) == 'string' && translate.request.api.language.length > 0){
      //从接口加载语种
      translate.request.post(translate.request.api.language, {}, function(data){
        if(data.result == 0){
          console.log('load language list error : '+data.info);
          return;
        }
        translate.request.api.language = data.list; //进行缓存，下一次切换语言渲染的时候直接从缓存取，就不用在通过网络加载了
        translate.selectLanguageTag.customUI(data.list);
      }, null);
    }else if(typeof(translate.request.api.language) == 'object'){
      //无网络环境下，自定义显示语种
      translate.selectLanguageTag.customUI(translate.request.api.language);
    }

    //显示切换语言
    var TranslateJsSelectLanguages = document.getElementsByClassName('LanguageSelect');
    TranslateJsSelectLanguages[0].style.display = 'block';
  }

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

      //显示上一次切换后的语种
      language.value = translate.language.getCurrent();
      //setTimeout(function(){
        //language.value = translate.language.getCurrent();
      //}, 100);
  }

  const refreshLanguage = function(){
    //渲染语言下拉列表出现
    window.translate.selectLanguageTag.refreshRender();
    //显示上一次切换后的语种
    language.value = translate.language.getCurrent();
  };


  // 当用户打开页面后，第一次过了初始化正式进行执行 translate.execute() 时，进行触发
  translate.lifecycle.execute.start.push(function(data){
      if(translate.selectLanguageTag.show === true && translate.selectLanguageTag.alreadyRender === false){
          //console.log('这是打开页面后，第一次触发 translate.execute() ，因为translate.executeNumber 记录的是translate.execute() 执行完的次数。');
          // 触发语言下拉列表出现
          //渲染语言下拉列表出现
          refreshLanguage();
      }
  });
  //如果已经触发了 translate.execute() 那么直接就渲染
  //console.log(translate.executeNumber+ ', '+translate.state)
  if(translate.executeNumber > 0 || translate.state > 0){
    refreshLanguage();
  }

});


</script>

<style scoped>
/* 避免被遮挡无法操作，设置z-index较高 */
.LanguageSelect {
  z-index: 2147483583;
  display:none;
}
</style>
    