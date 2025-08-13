<template>
	<view class="translate">
		<!-- #ifndef MP-WEIXIN -->
		<view class="translateId" :translateId="translateId" :change:translateId="dd.loadtranslateId">{{translateId}}</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default{
		data(){
			return{

			}
		},
		props: {
			translateId: { 
				type: Number,
				default:0,
				observer: function(newVal, oldVal) {}
			}
		},
		mounted() {

		},
		methods:{
		}
	}
</script>
<!-- #ifndef MP-WEIXIN -->
<script module="dd" lang="renderjs">
	export default {
		mounted() {
			this.$nextTick(function(){
				if (typeof window.translate === 'function') {
					this.init()
				} else {
					console.log("无translate，先引入")
					// 动态引入较大类库避免影响页面展示
					const script = document.createElement('script')
					script.src = 'static/translate.js'
					script.onload = this.init.bind(this)
					document.head.appendChild(script)
				}
			})
		},
		methods: {
			init(){
				translate.setUseVersion2();
				translate.listener.start();	//开启html页面变化的监控
				translate.selectLanguageTag.show = false;
				translate.ignore.class.push('no-translation');
				translate.execute();
			},
			loadtranslateId(newValue, oldValue, ownerInstance, instance){
				this.init()
			}
		}
	}
</script>
<!-- #endif-->
<style scoped>
	.translateId{display: none;}
</style>