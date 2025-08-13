<template>
  <view class="fanyi">
    <!-- #ifndef MP-WEIXIN -->
    <view class="translate">
      <view class="custom-picker-trigger" @click="showCustomPicker">
        <image
          src="@/static/image/translate.png"
          mode="widthFix"
          style="width: 100%"
        ></image>
      </view>
      
      <!-- 自定义picker弹窗 -->
      <view v-if="pickerVisible" class="custom-picker-modal">
        <view class="picker-mask" @click="hideCustomPicker"></view>
        <view class="picker-content">
          <view class="picker-title">选择语言</view>
          <view class="picker-body no-translation">
            <view 
              class="picker-option" 
              v-for="(item, i) in array" 
              :key="i"
			  :data-index="i"
              @click="dd.bindPickerChange"
            >
              {{ item }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      array: ["中文", "English"],
      index: 0,
      pickerVisible: false,
    };
  },
  props: {
    navbarData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {},
    },
  },
  methods: {
    showCustomPicker() {
      this.pickerVisible = true;
    },
    
    hideCustomPicker() {
      this.pickerVisible = false;
    },
    
    serviceClick(e) {
      const { index } = e;
      this.index = index;
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const currentUrl = `/${currentPage.route}`;
      uni.reLaunch({
        url: currentUrl,
      });
    },
  },
  mounted() {

  },
};
</script>

<script module="dd" lang="renderjs">
export default {
	mounted() {
		if (typeof window.translate === 'function') {
			this.init()
		} else {
			const script = document.createElement('script')
			script.src = 'static/translate.js'
			script.onload = this.init.bind(this)
			document.head.appendChild(script)
		}
	},
	methods: {
		init(){
			translate.setUseVersion2();
			translate.listener.start();
			translate.language.setLocal('chinese_simplified');
			translate.selectLanguageTag.languages = 'chinese_simplified,english,spanish';
			translate.selectLanguageTag.show = false;
			translate.ignore.class.push('no-translation');
			translate.execute();
		},
		bindPickerChange(e, ownerInstance){
			const {index}=e.currentTarget.dataset
			console.log(index)
			ownerInstance.callMethod('serviceClick', {
				index: index
			})
			switch (index){
				case 0:
					translate.changeLanguage('chinese_simplified');
					break;
				case 1:
					translate.changeLanguage('english');
					break;
			}
		}
	}
}
</script>

<style scoped>
.fanyi {
  height: 100rpx;
  width: 100rpx;
  background: #296fe1;
}

.translate {
  width: 100rpx;
  height: 100rpx;
}

.custom-picker-trigger {
  width: 100%;
  height: 100%;
}

.custom-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
}

.picker-mask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.picker-content {
  position: absolute;
  bottom: 100rpx;
  left: 0;
  width: 100%;
  background: white;
  border-radius: 20rpx 20rpx 0 0;
}

.picker-title {
  padding: 30rpx 40rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.picker-body {
  padding: 0;
  max-height: 600rpx; 
  overflow-y: auto; 
}

.picker-option {
  padding: 30rpx 40rpx;
  font-size: 32rpx;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.picker-option:last-child {
  border-bottom: none;
}
</style>