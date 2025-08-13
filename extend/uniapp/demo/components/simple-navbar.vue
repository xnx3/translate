<template>
	<view class="simple-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
		<view class="navbar-content">
			<!-- 返回按钮 -->
			<view class="back-btn" @click="goBack" v-if="showBack">
				<text class="back-icon">←</text>
			</view>
			
			<!-- 标题 -->
			<view class="navbar-title">
				<text class="title-text">{{ title }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: '标题'
		},
		showBack: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			statusBarHeight: 0
		}
	},
	mounted() {
		// 获取状态栏高度
		const systemInfo = uni.getSystemInfoSync()
		this.statusBarHeight = systemInfo.statusBarHeight || 0
		
		// #ifdef H5
		this.statusBarHeight = 0
		// #endif
	},
	methods: {
		goBack() {
			const pages = getCurrentPages()
			if (pages.length > 1) {
				uni.navigateBack()
			} else {
				// 如果是第一个页面，跳转到首页
				uni.reLaunch({
					url: '/pages/index/index'
				})
			}
		}
	}
}
</script>

<style scoped>
.simple-navbar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
	border-bottom: 1rpx solid #e5e5e5;
	z-index: 9999;
}

.navbar-content {
	height: 88rpx;
	display: flex;
	align-items: center;
	position: relative;
	padding: 0 30rpx;
}

.back-btn {
	width: 80rpx;
	height: 80rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	left: 10rpx;
	z-index: 10;
}

.back-icon {
	font-size: 40rpx;
	color: #333333;
	font-weight: bold;
}

.navbar-title {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}

.title-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.back-btn:active {
	opacity: 0.6;
}
</style>