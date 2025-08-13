<template>
	<view class="custom-tabbar">
		<view 
			v-for="(item, index) in tabList" 
			:key="index"
			class="tab-item"
			:class="{ active: currentTab === index }"
			@click="switchTab(index)"
		>
			<text class="tab-text">{{ item.text }}</text>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		current: {
			type: Number,
			default: 0
		}
	},
	data() {
		return {
			currentTab: 0,
			tabList: [
				{
					text: '首页',
					pagePath: '/pages/index/index'
				},
				{
					text: '我的',
					pagePath: '/pages/mine/mine'
				}
			]
		}
	},
	watch: {
		current(newVal) {
			this.currentTab = newVal
		}
	},
	mounted() {
		this.currentTab = this.current
		this.setCurrentTab()
	},
	methods: {
		switchTab(index) {
			if (this.currentTab === index) return
			
			const targetPage = this.tabList[index].pagePath
			
			uni.reLaunch({
				url: targetPage,
				success: () => {
					console.log('切换到:', targetPage)
				},
				fail: (err) => {
					console.error('页面跳转失败:', err)
				}
			})
		},
		setCurrentTab() {
			const pages = getCurrentPages()
			if (pages && pages.length > 0) {
				const currentPage = pages[pages.length - 1]
				const currentRoute = `/${currentPage.route}`
				
				const tabIndex = this.tabList.findIndex(item => item.pagePath === currentRoute)
				if (tabIndex !== -1) {
					this.currentTab = tabIndex
				}
			}
		}
	}
}
</script>

<style scoped>
.custom-tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 100rpx;
	background-color: #ffffff;
	border-top: 1rpx solid #e5e5e5;
	display: flex;
	z-index: 9999;
	padding-bottom: env(safe-area-inset-bottom);
}

.tab-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 10rpx 0;
	transition: all 0.3s ease;
}

.tab-item.active {
	color: #007AFF;
}

.tab-text {
	font-size: 24rpx;
	color: #666666;
}

.tab-item.active .tab-text {
	color: #007AFF;
	font-weight: bold;
}

.tab-item:active {
	background-color: #f5f5f5;
}
</style>