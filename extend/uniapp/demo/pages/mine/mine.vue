<template>
	<view class="page">
		<!-- 头部导航栏 -->
		<simple-navbar title="我的" :show-back="false"></simple-navbar>
		
		<view class="content">
			<view class="user-info">
				<text class="username">我的简介</text>
				<text class="user-desc">
					使用极其简单。 直接加入几行 JavaScript 代码即可让其拥有上百种语言切换能力。
					不增加工作量。 无需改造页面本身植入大量垃圾代码变得臃肿，也不需要配置各种语种的语言文件，因为它会直接扫描你的DOM自动识别并翻译显示，它不需要你到某某网站登录去申请什么key，它是开源开放的，拿来就能用。
				</text>
			</view>
		</view>
		<!-- 翻译 -->
		<translate />
		
		<!-- 自定义底部导航栏 -->
		<custom-tabbar :current="1" ></custom-tabbar>
	</view>
</template>

<script>
import simpleNavbar from '@/components/simple-navbar.vue'
import customTabbar from '@/components/custom-tabbar.vue'

export default {
	components: {
		simpleNavbar,
		customTabbar
	},
	data() {
		return {
			
		}
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
	padding-top: 120rpx;
	padding-bottom: 120rpx;
	min-height: calc(100vh - 240rpx);
}

.user-info {
	background-color: #ffffff;
	padding: 60rpx 30rpx;
}

.username {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 20rpx;
}

.user-desc {
	font-size: 28rpx;
	color: #666;
}
</style>