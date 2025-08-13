<template>
	<view class="page">
		<!-- 头部导航栏 -->
		<simple-navbar title="首页" :show-back="false"></simple-navbar>
		
		<view class="content">
			<view class="text-switch"><switch-language /></view>
			<view class="text-area">
				<text class="title">点击上方图标切换语言</text>
			</view>
		</view>
		<!-- 翻译 -->
		<translate />
		
		<!-- 底部导航栏 -->
		<custom-tabbar :current="0"></custom-tabbar>
	</view>
</template>

<script>
	import simpleNavbar from '@/components/simple-navbar.vue'
	import customTabbar from '@/components/custom-tabbar.vue'
	import switchLanguage from '@/components/switch-language.vue'
	export default {
		components: {
			simpleNavbar,
			customTabbar,
			switchLanguage
		},
		data() {
			return {
				
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
.page {
	min-height: 100vh;
}

.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 120rpx;
	padding-bottom: 120rpx;
	min-height: calc(100vh - 240rpx);
}

.text-switch{
	height:100rpx;
	width:100rpx;
	margin:200rpx 30rpx;
}

.text-area {
	padding:0rpx 20rpx;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
