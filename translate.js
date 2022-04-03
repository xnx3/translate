/**
 * 国际化，网页自动翻译。
 * 整理人：管雷鸣
 */
var translate = {
	/*
	 * 当前的版本
	 */
	version:1.0,
	/*
	 * 资源文件url的路径
 	 */
	resourcesUrl:'//res.zvo.cn.obs.cn-north-4.myhuaweicloud.com/translate',
	/*
	 * 当前的版本
	 */
	//localLanguage:'zh-CN',
	localLanguage:'en',
	
	/**
	 * 加载js、css等相关资源
	 */
	loadResource:function(){
		
	},
	/**
	 * google翻译执行的
	 */
	googleTranslateElementInit:function(){
		var trans = new google.translate.TranslateElement(
			{
				//这参数没用，请忽略
				//pageLanguage: 'zh-CN',
				//一共80种语言选择，这个是你需要翻译的语言，比如你只需要翻译成越南和英语，这里就只写en,vi
				//includedLanguages: 'de,hi,lt,hr,lv,ht,hu,zh-CN,hy,uk,mg,id,ur,mk,ml,mn,af,mr,uz,ms,el,mt,is,it,my,es,et,eu,ar,pt-PT,ja,ne,az,fa,ro,nl,en-GB,no,be,fi,ru,bg,fr,bs,sd,se,si,sk,sl,ga,sn,so,gd,ca,sq,sr,kk,st,km,kn,sv,ko,sw,gl,zh-TW,pt-BR,co,ta,gu,ky,cs,pa,te,tg,th,la,cy,pl,da,tr',
	            includedLanguages: 'zh-CN,zh-TW,en',
				//选择语言的样式，这个是面板，还有下拉框的样式，具体的记不到了，找不到api~~  
				layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
				//自动显示翻译横幅，就是翻译后顶部出现的那个，有点丑，设置这个属性不起作用的话，请看文章底部的其他方法
				//autoDisplay: false, 
				//disableAutoTranslation:false,
				//还有些其他参数，由于原插件不再维护，找不到详细api了，将就了，实在不行直接上dom操作
			}, 
			'translate'//触发按钮的id
		);
	},
	
	/**
	 * 初始化
	 */
	init:function(){
		/****** 先判断当前协议，定义资源路径  ******/
		var protocol = window.location.protocol;
		if(window.location.protocol == 'file:'){
			//本地的，那就用http
			protocol = 'http:';
		}
		this.resourcesUrl = protocol + this.resourcesUrl;
		
		
		/*********** 判断translate 的id是否存在，不存在就创建一个  */
		if(document.getElementById('translate') == null){
			document.write('<div id="translate"></div>');
		}
		
		/****** 先加载资源  ******/
		var head0 = document.getElementsByTagName('head')[0];
		var script = document.createElement("script");  //创建一个script标签
		script.type = "text/javascript";
		script.async = true;
		script.src = this.resourcesUrl+'/js/element.js';
		head0.appendChild(script);
	}
}


try{
	
	
	translate.init();
}catch(e){ console.log(e); }