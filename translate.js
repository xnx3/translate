/**
 * 国际化，网页自动翻译。
 * 整理人：管雷鸣
 */
var translate = {
	/*
	 * 当前的版本
	 */
	version:'2.1.4.20230104',
	useVersion:'v1',	//当前使用的版本，默认使用v1. 可使用 setUseVersion2(); //来设置使用v2
	setUseVersion2:function(){
		this.useVersion = 'v2';
	},
	/*
	 * 翻译的对象，也就是 new google.translate.TranslateElement(...)
	 */
	translate:null,
	/*
	 * 支持哪些语言切换，包括：de,hi,lt,hr,lv,ht,hu,zh-CN,hy,uk,mg,id,ur,mk,ml,mn,af,mr,uz,ms,el,mt,is,it,my,es,et,eu,ar,pt-PT,ja,ne,az,fa,ro,nl,en-GB,no,be,fi,ru,bg,fr,bs,sd,se,si,sk,sl,ga,sn,so,gd,ca,sq,sr,kk,st,km,kn,sv,ko,sw,gl,zh-TW,pt-BR,co,ta,gu,ky,cs,pa,te,tg,th,la,cy,pl,da,tr
	 * 已废弃，请使用 translate.selectLanguageTag.languages 
	 */
	includedLanguages:'zh-CN,zh-TW,en',
	/*
	 * 资源文件url的路径
 	 */
	resourcesUrl:'//res.zvo.cn/translate',

	/**
	 * 默认出现的选择语言的 select 选择框，可以通过这个选择切换语言。
	 */
	selectLanguageTag:{
		/* 是否显示 select选择语言的选择框，true显示； false不显示。默认为true */
		show:true,
		/* 支持哪些语言切换，包括：de,hi,lt,hr,lv,ht,hu,zh-CN,hy,uk,mg,id,ur,mk,ml,mn,af,mr,uz,ms,el,mt,is,it,my,es,et,eu,ar,pt-PT,ja,ne,az,fa,ro,nl,en-GB,no,be,fi,ru,bg,fr,bs,sd,se,si,sk,sl,ga,sn,so,gd,ca,sq,sr,kk,st,km,kn,sv,ko,sw,gl,zh-TW,pt-BR,co,ta,gu,ky,cs,pa,te,tg,th,la,cy,pl,da,tr */
		languages:'zh-CN,zh-TW,en',
		render:function(){ //v2增加
				
			//判断如果不显示select选择语言，直接就隐藏掉
			if(!translate.selectLanguageTag.show){
				return;
			}
			
			//判断translate 的id是否存在，不存在就创建一个
			if(document.getElementById('translate') == null){
				var body_trans = document.getElementsByTagName('body')[0];
				var div = document.createElement("div");  //创建一个script标签
				div.id="translate";
				body_trans.appendChild(div);
			}else{
				//存在，那么判断一下 select是否存在，要是存在就不重复创建了
				if(document.getElementById('translateSelectLanguage') != null){
					//select存在了，就不重复创建了
					return;
				}
			}
			
			//从服务器加载支持的语言库
			translate.request.post('https://api.translate.zvo.cn/language.json', {}, function(data){
				if(data.result == 0){
					console.log('load language list error : '+data.info);
					return;
				}
			
				//select的onchange事件
				var onchange = function(event){
					var language = event.target.value;
					translate.changeLanguage(language);
				}
				
				//创建 select 标签
				var selectLanguage = document.createElement("select"); 
				selectLanguage.id = 'translateSelectLanguage';
				selectLanguage.className = 'translateSelectLanguage';
				for(var i = 0; i<data.list.length; i++){
					var option = document.createElement("option"); 
				    option.setAttribute("value",data.list[i].id);
				    if(translate.to != null && typeof(translate.to) != 'undefined' && translate.to == data.list[i].id){
				    	option.setAttribute("selected",'selected');
				    }
			
				    option.appendChild(document.createTextNode(data.list[i].name)); 
				    selectLanguage.appendChild(option);
				}
				//增加 onchange 事件
				if(window.addEventListener){ // Mozilla, Netscape, Firefox 
					selectLanguage.addEventListener('change', onchange,false); 
				}else{ // IE 
					selectLanguage.attachEvent('onchange',onchange); 
				} 
				//将select加入进网页显示
				document.getElementById('translate').appendChild(selectLanguage);
			});
			
			
		}
	},
	
	/*
	 * 当前本地语言
	 */
	//localLanguage:'zh-CN',
	localLanguage:'zh-CN',
	
	/**
	 * google翻译执行的
	 */
	googleTranslateElementInit:function(){
		var selectId = '';
		if(document.getElementById('translate') != null){	// && document.getElementById('translate').innerHTML.indexOf('translateSelectLanguage') > 0
			//已经创建过了,存在
			selectId = 'translate';
		}
		
		translate.translate = new google.translate.TranslateElement(
			{
				//这参数没用，请忽略
				pageLanguage: 'zh-CN',
				//一共80种语言选择，这个是你需要翻译的语言，比如你只需要翻译成越南和英语，这里就只写en,vi
				//includedLanguages: 'de,hi,lt,hr,lv,ht,hu,zh-CN,hy,uk,mg,id,ur,mk,ml,mn,af,mr,uz,ms,el,mt,is,it,my,es,et,eu,ar,pt-PT,ja,ne,az,fa,ro,nl,en-GB,no,be,fi,ru,bg,fr,bs,sd,se,si,sk,sl,ga,sn,so,gd,ca,sq,sr,kk,st,km,kn,sv,ko,sw,gl,zh-TW,pt-BR,co,ta,gu,ky,cs,pa,te,tg,th,la,cy,pl,da,tr',
	            includedLanguages: translate.selectLanguageTag.languages,
				//选择语言的样式，这个是面板，还有下拉框的样式，具体的记不到了，找不到api~~  
				layout: 0,
				//自动显示翻译横幅，就是翻译后顶部出现的那个，有点丑，设置这个属性不起作用的话，请看文章底部的其他方法
				//autoDisplay: false, 
				//disableAutoTranslation:false,
				//还有些其他参数，由于原插件不再维护，找不到详细api了，将就了，实在不行直接上dom操作
			}, 
			selectId //触发按钮的id
		);
	},
	
	/**
	 * 初始化，如加载js、css资源
	 */
	init:function(){
		/****** 先判断当前协议，定义资源路径  ******/
		var protocol = window.location.protocol;
		if(window.location.protocol == 'file:'){
			//本地的，那就用http
			protocol = 'http:';
		}
		if(this.resourcesUrl.indexOf('://') == -1){
			//还没设置过，进行设置
			this.resourcesUrl = protocol + this.resourcesUrl;
		}
		
		//this.resourcesUrl = 'file://G:/git/translate';
		
	},
	/**
	 * 执行翻译操作
	 */
	execute_v1:function(){
		/*********** 判断translate 的id是否存在，不存在就创建一个  */
		if(document.getElementById('translate') == null){
			if(translate.selectLanguageTag.show){
				var body_trans = document.getElementsByTagName('body')[0];
				var div = document.createElement("div");  //创建一个script标签
				div.id="translate";
				body_trans.appendChild(div);
			}
		}
		
		/* 处理1.0 - 1.1 升级的 */
		if(translate.includedLanguages != 'zh-CN,zh-TW,en'){
			/* 用户1.0版本设置过这个，那么就以这个为主 */
			translate.selectLanguageTag.languages = translate.includedLanguages;
			console.log('translate.js tip: translate.includedLanguages obsolete, please use the translate.selectLanguageTag.languages are set');
		}
		
		
		/****** 先加载资源  ******/
		var head0 = document.getElementsByTagName('head')[0];
		var script = document.createElement("script");  //创建一个script标签
		script.type = "text/javascript";
		//script.async = true;
		script.src = this.resourcesUrl+'/js/element.js';
		head0.appendChild(script);
	},
	
	/**
	 * 设置Cookie，失效时间一年。
	 * @param name
	 * @param value
	 */
	setCookie:function (name,value){
		var cookieString=name+"="+escape(value); 
		document.cookie=cookieString; 
	},

	//获取Cookie。若是不存再，返回空字符串
	getCookie:function (name){ 
		var strCookie=document.cookie; 
		var arrCookie=strCookie.split("; "); 
		for(var i=0;i<arrCookie.length;i++){ 
			var arr=arrCookie[i].split("="); 
			if(arr[0]==name){
				return unescape(arr[1]);
			}
		}
		return "";
	},
	
	/**
	 * 获取当前页面采用的是什么语言
	 * 返回值如 en、zh-CN、zh-TW （如果是第一次用，没有设置过，那么返回的是 translate.localLanguage 设置的值）		
	 */
	currentLanguage:function(){
		translate.check();
		var cookieValue = translate.getCookie('googtrans');
		if(cookieValue.length > 0){
			return cookieValue.substr(cookieValue.lastIndexOf('/')+1,cookieValue.length-1);
		}else{
			return translate.localLanguage;
		}
	},
	
	/**
	 * 切换语言，比如切换为英语、法语
 	 * @param languageName 要切换的语言语种。传入如 en、zh-CN
	 * 				会自动根据传入的语言来判断使用哪种版本。比如传入 en、zh-CN 等，则会使用v1.x版本
	 * 														传入 chinese_simplified 、english 等，则会使用 v2.x版本
	 */
	changeLanguage:function(languageName){
		//判断使用的是否是v1.x
		var v1 = ',en,de,hi,lt,hr,lv,ht,hu,zh-CN,hy,uk,mg,id,ur,mk,ml,mn,af,mr,uz,ms,el,mt,is,it,my,es,et,eu,ar,pt-PT,ja,ne,az,fa,ro,nl,en-GB,no,be,fi,ru,bg,fr,bs,sd,se,si,sk,sl,ga,sn,so,gd,ca,sq,sr,kk,st,km,kn,sv,ko,sw,gl,zh-TW,pt-BR,co,ta,gu,ky,cs,pa,te,tg,th,la,cy,pl,da,tr,';
		if(v1.indexOf(','+languageName+',') > -1){
			//用的是v1.x
			
			translate.check();
			
			var googtrans = '/'+translate.localLanguage+'/'+languageName;
			
			//先清空泛解析域名的设置
			var s = document.location.host.split('.');
			if(s.length > 2){
				var fanDomain = s[s.length-2]+'.'+s[s.length-1];
				document.cookie = 'googtrans=;expires='+(new Date(1))+';domain='+fanDomain+';path=/';
				document.cookie = 'googtrans='+googtrans+';domain='+fanDomain+';path=/';
			}
			
			translate.setCookie('googtrans', ''+googtrans);
			location.reload();
			return;
		}
		
		//用的是v2.x或更高
		this.setUseVersion2();
		this.to = languageName;
		translate.storage.set('to',languageName);	//设置目标翻译语言
		location.reload(); //刷新页面
	},
	
	/**
	 * 自检提示，适用于 v1.x， 在 v2.x中已废弃
	 */
	check:function(){
		if(window.location.protocol == 'file:'){
			console.log('\r\n---WARNING----\r\ntranslate.js 主动翻译组件自检异常，当前协议是file协议，翻译组件要在正常的线上http、https协议下才能正常使用翻译功能\r\n------------');
		}
	},
	
	
	/**************************** v2.0 */
	to:'', //翻译为的目标语言，如 english 、chinese_simplified
	//用户第一次打开网页时，自动判断当前用户所在国家使用的是哪种语言，来自动进行切换为用户所在国家的语种。
	//如果使用后，第二次在用，那就优先以用户所选择的为主，这个就不管用了
	//默认是false，不使用，可设置true：使用
	//使用 setAutoDiscriminateLocalLanguage 进行设置
	autoDiscriminateLocalLanguage:false,
	documents:[], //指定要翻译的元素的集合,可设置多个，如设置： document.getElementsByTagName('DIV')
	//翻译时忽略的一些东西，比如忽略某个tag、某个class等
	ignore:{
		tag:['style', 'script', 'img', 'head', 'link', 'i', 'pre', 'code'],
		class:['ignore','translateSelectLanguage']
	},
	setAutoDiscriminateLocalLanguage:function(){
		this.autoDiscriminateLocalLanguage = true;
	},
	//待翻译的页面的node队列，key为 english、chinese  value[ hash，value为node对象的数组 ]
	nodeQueue:{},
	//指定要翻译的元素的集合,可传入一个元素或多个元素
	//如设置一个元素，可传入如： document.getElementsById('test')
	//如设置多个元素，可传入如： document.getElementsByTagName('DIV')
	setDocuments:function(documents){
		if (documents == null || typeof(documents) == 'undefined') {
			return;
		}
		
		if(typeof(documents.length) == 'undefined'){
			//不是数组，是单个元素
			this.documents[0] = documents;
		}else{
			//是数组，直接赋予
			this.documents = documents;
		}
		//清空翻译队列，下次翻译时重新检索
		this.nodeQueue = {};
	},

	//执行翻译操作。翻译的是 nodeQueue 中的
	execute:function(){
		if(this.useVersion == 'v1'){
		//if(this.to == null || this.to == ''){
			//采用1.x版本的翻译，使用google翻译
			this.execute_v1();
			return;
		}
		
		//采用 2.x 版本的翻译，使用自有翻译算法
		
		//如果页面打开第一次使用，先判断缓存中有没有上次使用的语种，从缓存中取出
		if(this.to == null || this.to == ''){
			var to_storage = this.storage.get('to');
			if(to_storage != null && typeof(to_storage) != 'undefined' && to_storage.length > 0){
				this.to = to_storage;
			}
		}
		
		//渲染select选择语言
		try{
			this.selectLanguageTag.render();	
		}catch(e){
			console.log(e);
		}
		
		//判断是否还未指定翻译的目标语言
		if(this.to == null || typeof(this.to) == 'undefined' || this.to.length == 0){
			//未指定，判断如果指定了自动获取用户本国语种了，那么进行获取
			if(this.autoDiscriminateLocalLanguage){
				this.executeByLocalLanguage();
			}
			
			//没有指定翻译目标语言、又没自动获取用户本国语种，则不翻译
			return;
		}
		
		//进行翻译操作
		
		//检索当前是否已经检索过翻译目标了
		if(this.nodeQueue == null || typeof(this.nodeQueue.length) == 'undefined' || this.nodeQueue.length == 0){
			var all;
			if(this.documents == null || this.documents.length == 0){
				all = document.all; //如果未设置，那么翻译所有的
			}else{
				//设置了翻译指定的元素，那么赋予
				all = this.documents;
			}
			
			for(var i = 0; i< all.length & i < 20; i++){
				var node = all[i];
				this.whileNodes(node);	
			}
		}
		
		//translateTextArray[lang][0]
		var translateTextArray = {};	//要翻译的文本的数组，格式如 ["你好","欢迎"]
		var translateHashArray = {};	//要翻译的文本的hash,跟上面的index是一致的，只不过上面是存要翻译的文本，这个存hash值
			
		
		for(var lang in this.nodeQueue){ //一维数组，取语言
			//console.log('lang:'+lang); //lang为english这种语言标识
			if(lang == null || typeof(lang) == 'undefined' || lang.length == 0 || lang == 'undefined'){
				//console.log('lang is null : '+lang);
				continue;
			}

			translateTextArray[lang] = [];
			translateHashArray[lang] = [];

			//二维数组，取hash、value
			for(var hash in this.nodeQueue[lang]){	
				//取原始的词，还未经过翻译的，需要进行翻译的词
				var originalWord = this.nodeQueue[lang][hash]['original'];	
				//根据hash，判断本地是否有缓存了
				var cache = this.storage.get('hash_'+translate.to+'_'+hash);
				//console.log(key+', '+cache);
				if(cache != null && cache.length > 0){
					//有缓存了
					//console.log('find cache：'+cache);
					console.log(this.nodeQueue[lang][hash]['nodes']);
					//直接将缓存赋予
					//for(var index = 0; index < this.nodeQueue[lang][hash].length; index++){
						//this.nodeQueue[lang][hash][index].nodeValue = cache;
						
						for(var node_index = 0; node_index < this.nodeQueue[lang][hash]['nodes'].length; node_index++){
							//this.nodeQueue[lang][hash]['nodes'][node_index].nodeValue = cache;
							console.log(originalWord);
							this.nodeQueue[lang][hash]['nodes'][node_index].nodeValue = this.nodeQueue[lang][hash]['nodes'][node_index].nodeValue.replace(new RegExp(originalWord,'g'), cache);
						}
					//}

					continue;	//跳出，不用在传入下面的翻译接口了
				}
				
				/*
				//取出数组
				var queueNodes = this.nodeQueue[lang][hash];
				if(queueNodes.length > 0){
					//因为在这个数组中的值都是一样的，那么只需要取出第一个就行了
					var valueStr = queueNodes[0].nodeValue;
					valueStr = this.util.charReplace(valueStr);

					translateTextArray[lang].push(valueStr);
					translateHashArray[lang].push(hash);
				}
				*/
				
				//加入待翻译数组
				translateTextArray[lang].push(originalWord);
				translateHashArray[lang].push(hash);
			}

			if(translateTextArray[lang].length < 1){
				return;
			}

			/*** 翻译开始 ***/
			var url = 'https://api.translate.zvo.cn/translate.json';
			var data = {
				from:lang,
				to:this.to,
				//text:JSON.stringify(translateTextArray[lang])
				text:encodeURIComponent(JSON.stringify(translateTextArray[lang]))
			};
			this.request.post(url, data, function(data){
				console.log(data); 
				if(data.result == 0){
					console.log('=======ERROR START=======');
					console.log(translateTextArray[data.from]);
					//console.log(encodeURIComponent(JSON.stringify(translateTextArray[data.from])));
					
					console.log('response : '+data.info);
					console.log('=======ERROR END  =======');
					return;
				}


				//遍历 translateHashArray
				for(var i=0; i<translateHashArray[data.from].length; i++){
					//翻译后的内容
					var text = data.text[i];	
					//翻译前的hash对应下标
					var hash = translateHashArray[data.from][i];	
					//翻译前的语种，如 english
					var lang = data.from;	
					//取原始的词，还未经过翻译的，需要进行翻译的词
					var originalWord = translate.nodeQueue[lang][hash]['original'];	
					
					//赋予翻译后的内容
					//for(var index = 0; index < translate.nodeQueue[lang][hash].length; index++){
						for(var node_index = 0; node_index < translate.nodeQueue[lang][hash]['nodes'].length; node_index++){
							translate.nodeQueue[lang][hash]['nodes'][node_index].nodeValue = translate.nodeQueue[lang][hash]['nodes'][node_index].nodeValue.replace(new RegExp(originalWord,'g'), text);
						}
					//}
					/*
					for(var index = 0; index < translate.nodeQueue[data.from][hash].length; index++){
						translate.nodeQueue[data.from][hash][index].nodeValue = text;
					}
					*/
					
					//将翻译结果以 key：hash  value翻译结果的形式缓存
					translate.storage.set('hash_'+data.to+'_'+hash,text);
				}

			});
			/*** 翻译end ***/


		}

	},

	//向下遍历node
	whileNodes:function(node){
		if(node == null || typeof(node) == 'undefined'){
			return;
		}
		var childNodes = node.childNodes;
		if(childNodes.length > 0){
			for(var i = 0; i<childNodes.length; i++){
				this.whileNodes(childNodes[i]);
			}
		}else{
			//单个了
			this.findNode(node);
		}
	},


	findNode:function(node){
		if(node == null || typeof(node) == 'undefined'){
			return;
		}
		if(node.parentNode == null){
			return;
		}
		var parentNodeName = node.parentNode.nodeName;
		if(parentNodeName == null){
			return;
		}
		if(this.ignore.tag.indexOf(parentNodeName.toLowerCase()) > -1){
			//忽略tag
			//console.log('忽略tag：'+parentNodeName);
			return;
		}

		/****** 判断忽略的class ******/
		var ignoreClass = false;	//是否是被忽略的class，true是
		var parentNode = node.parentNode;
		while(node != parentNode && parentNode != null){
			//console.log('node:'+node+', parentNode:'+parentNode);
			if(parentNode.className != null){
				if(this.ignore.class.indexOf(parentNode.className) > -1){
					//发现ignore.class 当前是处于被忽略的 class
					ignoreClass = true;
				}
			}
			
			parentNode = parentNode.parentNode;
		}
		if(ignoreClass){
			//console.log('ignore class :  node:'+node.nodeValue);
			return;
		}
		/**** 判断忽略的class结束 ******/
		
		//console.log(node.nodeName+', '+node.nodeValue);
		if(node.nodeName == 'INPUT' || node.nodeName == 'TEXTAREA'){
			//input 输入框，要对 placeholder 做翻译
			console.log('input---'+node.attributes);
			if(node.attributes == null || typeof(node.attributes) == 'undefined'){
				return;
			}

			if(typeof(node.attributes['placeholder']) != 'undefined'){
				console.log(node.attributes['placeholder'].nodeValue);
				//加入要翻译的node队列
				//translate.nodeQueue[translate.hash(node.nodeValue)] = node.attributes['placeholder'];
				//加入要翻译的node队列
				//translate.addNodeToQueue(translate.hash(node.attributes['placeholder'].nodeValue), node.attributes['placeholder']);
				this.addNodeToQueue(node.attributes['placeholder']);
			}
			
			//console.log(node.getAttribute("placeholder"));
		}else if(node.nodeValue != null && node.nodeValue.trim().length > 0){

			//过滤掉无效的值
			if(node.nodeValue != null && typeof(node.nodeValue) == 'string' && node.nodeValue.length > 0){
			}else{
				return;
			}

			//console.log(node.nodeValue+' --- ' + translate.language.get(node.nodeValue));
			
			//console.log(node.nodeName);
			//console.log(node.parentNode.nodeName);
			//console.log(node.nodeValue);
			//加入要翻译的node队列
			this.addNodeToQueue(node);	
			//translate.addNodeToQueue(translate.hash(node.nodeValue), node);
			//translate.nodeQueue[translate.hash(node.nodeValue)] = node;
			//translate.nodeQueue[translate.hash(node.nodeValue)] = node.nodeValue;
			//node.nodeValue = node.nodeValue+'|';

		}
	},
	//将发现的元素节点加入待翻译队列
	addNodeToQueue:function(node){
		var key = this.util.hash(node.nodeValue);
		if(this.util.findTag(node.nodeValue)){
			console.log('find tag ignore : '+node.nodeValue);
			return;
		}

		//获取当前是什么语种
		var langs = this.language.get(node.nodeValue);
		console.log('langs');
		console.log(langs);
		
		//过滤掉要转换为的目标语种，比如要转为英语，那就将本来是英语的部分过滤掉，不用再翻译了
		if(typeof(langs[translate.to]) != 'undefined'){
			delete langs[translate.to];
		}
		
		/* if(this.nodeQueue[lang] == null || typeof(this.nodeQueue[lang]) == 'undefined'){
			this.nodeQueue[lang] = new Array();
		} 
		//创建二维数组
		if(this.nodeQueue[lang][key] == null || typeof(this.nodeQueue[lang][key]) == 'undefined'){
			this.nodeQueue[lang][key] = new Array();
		}
		*/
		
		for(var lang in langs) {
			
			//创建一维数组， key为语种，如 english
			if(this.nodeQueue[lang] == null || typeof(this.nodeQueue[lang]) == 'undefined'){
				this.nodeQueue[lang] = new Array();
			}
			
			//遍历出该语种下有哪些词需要翻译
			for(var word_index = 0; word_index < langs[lang].length; word_index++){
				var word = langs[lang][word_index]; //要翻译的词
				var hash = this.util.hash(word); 	//要翻译的词的hash
				
				
				//创建二维数组， key为要通过接口翻译的文本词或句子的 hash （注意并不是node的文本，而是node拆分后的文本）
				if(this.nodeQueue[lang][hash] == null || typeof(this.nodeQueue[lang][hash]) == 'undefined'){
					this.nodeQueue[lang][hash] = new Array();
					
					/*
					 * 创建三维数组，存放具体数据
					 * key: nodes 包含了这个hash的node元素的数组集合，array 多个
					 * key: original 原始的要翻译的词或句子，html加载完成但还没翻译前的文本，用于支持当前页面多次语种翻译切换而无需跳转
					 */
					this.nodeQueue[lang][hash]['nodes'] = new Array();
					this.nodeQueue[lang][hash]['original'] = word;
					
					//其中key： nodes 是第四维数组，里面存放具体的node元素对象
					
				}
				
				//往四维数组nodes中追加node元素
				this.nodeQueue[lang][hash]['nodes'][this.nodeQueue[lang][hash]['nodes'].length]=node; 
			}
			
		}
		
		
		
		//this.nodeQueue[lang][key][this.nodeQueue[lang][key].length]=node; //往数组中追加
	},

	language:{
		//获取当前字符是什么语种。返回值是一个语言标识，有  chinese_simplified简体中文、japanese日语、korean韩语、
		// //会自动将特殊字符、要翻译的目标语种给过滤掉
		get:function(str){
			//将str拆分为单个char进行判断

			var langs = new Array(); //当前字符串包含哪些语言的数组，其内如 english
			var langStrs = new Array();	//存放不同语言的文本，格式如 ['english'][0] = 'hello'
			
			var upLangs = ''; //上一个字符的语种是什么，格式如 english
			for(var i=0; i<str.length; i++){
				var charstr = str.charAt(i);
				
				var lang = translate.language.getCharLanguage(charstr);
				if(lang == ''){
					//未获取到，未发现是什么语言
					//continue;
					lang = 'unidentification';
				}
				
				langStrs = translate.language.analyse(lang, langStrs, upLangs, charstr);
				upLangs = lang;
				langs.push(lang);
			}
			
			//console.log(langs);
			console.log(langStrs);

/*
			//从数组中取出现频率最高的
			var newLangs = translate.util.arrayFindMaxNumber(langs);
			
			//移除当前翻译目标的语言。因为已经是目标预言了，不需要翻译了
			var index = newLangs.indexOf(translate.to);
			if(index > -1){
				newLangs.splice(index,1); //移除
			}

			//移除特殊字符
			var index = newLangs.indexOf('specialCharacter');
			if(index > -1){
				newLangs.splice(index,1); //移除数组中的特殊字符
			}

			if(newLangs.length > 0){
				//还剩一个或多个，（如果是多个，那应该是这几个出现的频率一样，所以取频率最高的时返回了多个）
				return newLangs[0];
			}else{
				//没找到，直接返回空字符串
				return '';
			}
			*/
			
			
			//去除特殊符号
			//for(var i = 0; i<langStrs.length; i++){
			/*
			var i = 0;
			for(var item in langStrs) {
				if(item == 'unidentification' || item == 'specialCharacter'){
					//langStrs.splice(i,1); //移除
					delete langStrs[item];
				}
				console.log(item);
				i++;
			}
			*/
			
			if(typeof(langStrs['unidentification']) != 'undefined'){
				delete langStrs['unidentification'];
			}
			if(typeof(langStrs['specialCharacter']) != 'undefined'){
				delete langStrs['specialCharacter'];
			}
			
			return langStrs;
		},
		// 传入一个char，返回这个char属于什么语种，返回如 chinese_simplified、english  如果返回空字符串，那么表示未获取到是什么语种
		getCharLanguage:function(charstr){
			if(charstr == null || typeof(charstr) == 'undefined'){
				return '';
			}
			
			if(this.specialCharacter(charstr)){
				return 'specialCharacter';
			}else if(this.chinese_simplified(charstr)){
				return 'chinese_simplified';
			}else if(this.english(charstr)){
				return 'english';
			}else if(this.japanese(charstr)){
				return 'japanese';
			}else if(this.korean(charstr)){
				return 'korean';
			}else{
				console.log('not find is language , char : '+charstr);
				return '';
			}
		},
		//对字符串进行分析，分析字符串是有哪几种语言组成。  language 传入如 english  ， langStrs 操作的，如 langStrs['english'][0] = '你好'   upLangs 上次char替换的，如 english ， chatstr char文本
		analyse:function(language, langStrs, upLangs, charstr){
			if(typeof(langStrs[language]) == 'undefined'){
				langStrs[language] = new Array();
			}
			var index = 0; //当前要存入的数组下标
			if(upLangs == ''){
				//第一次，那么还没存入值，index肯定为0
			}else{
				if(upLangs == language){
					//跟上次语言一样，那么直接拼接
					index = langStrs[language].length-1; 
				}else{
					//不一样，那么再开个数组存放
					index = langStrs[language].length;
				}
			}
			if(typeof(langStrs[language][index]) == 'undefined'){
				langStrs[language][index] = '';
			}
			
			langStrs[language][index] = langStrs[language][index] + charstr;
			
			return langStrs
		},
		//是否包含中文，true:包含
		chinese_simplified:function(str){
			if(/.*[\u4e00-\u9fa5]+.*$/.test(str)){ 
				return true
			} else {
				return false;
			}
		},
		//是否包含英文，true:包含
		english:function(str){
			if(/.*[\u0041-\u005a]+.*$/.test(str)){ 
				return true;
			} else if(/.*[\u0061-\u007a]+.*$/.test(str)){
				return true;
			} else {
				return false;
			}
		},
		//是否包含日语，true:包含
		japanese:function(str){
			if(/.*[\u0800-\u4e00]+.*$/.test(str)){ 
				return true
			} else {
				return false;
			}
		},
		//是否包含韩语，true:包含
		korean:function(str){
			if(/.*[\uAC00-\uD7AF]+.*$/.test(str)){ 
				return true
			} else {
				return false;
			}
		},
		//是否包含特殊字符
		specialCharacter:function(str){
			//如：① ⑴ ⒈ 
			if(/.*[\u2460-\u24E9]+.*$/.test(str)){ 
				return true
			}

			//如：┊┌┍ ▃ ▄ ▅
			if(/.*[\u2500-\u25FF]+.*$/.test(str)){ 
				return true
			}

			//如：㈠  ㎎ ㎏ ㎡
			if(/.*[\u3200-\u33FF]+.*$/.test(str)){ 
				return true
			}
			
			//如：与ANSI对应的全角字符
			if(/.*[\uFF00-\uFF5E]+.*$/.test(str)){ 
				return true
			}

			//其它特殊符号
			if(/.*[\u2000-\u22FF]+.*$/.test(str)){ 
				return true
			}

			// 、><等符号
			if(/.*[\u3001-\u3036]+.*$/.test(str)){
				return true;
			}
			
			return false;
		}
	},
	//用户第一次打开网页时，自动判断当前用户所在国家使用的是哪种语言，来自动进行切换为用户所在国家的语种。
	//如果使用后，第二次在用，那就优先以用户所选择的为主
	executeByLocalLanguage:function(){
		this.request.post('https://api.translate.zvo.cn/ip.json', {}, function(data){
			console.log(data); 
			if(data.result == 0){
				console.log('==== ERROR 获取当前用户所在区域异常 ====');
				console.log(data.info);
				console.log('==== ERROR END ====');
			}else{
				translate.setUseVersion2();
				translate.storage.set('to',data.language);	//设置目标翻译语言
				translate.to = data.language; //设置目标语言
				translate.selectLanguageTag
				translate.execute(); //执行翻译
			}
		});
	},
	
	util:{
		//判断字符串中是否存在tag标签。 true存在
		findTag:function(str) {
			var reg = /<[^>]+>/g;
			return reg.test(str);
		},
		//传入一个数组，从数组中找出现频率最多的一个返回。 如果多个频率出现的次数一样，那会返回多个
		arrayFindMaxNumber:function(arr){

			// 储存每个元素出现的次数
			var numbers = {}

			// 储存出现最多次的元素
			var maxStr = []

			// 储存最多出现的元素次数
			var maxNum = 0

			for(var i =0,len=arr.length;i<len;i++){
			    if(!numbers[arr[i]]){
			          numbers[arr[i]] = 1  
			    }else{
			        numbers[arr[i]]++
			    }

			    if(numbers[arr[i]]>maxNum){
			        maxNum = numbers[arr[i]]
			    }
			}

			for(let item in numbers){
			    if(numbers[item]===maxNum){
			        maxStr.push(item)
			    }
			}
			
			return maxStr;
		},
		//对字符串进行hash化，目的取唯一值进行标识
		hash:function(str){
			if(str == null || typeof(str) == 'undefined'){
				return str;
			}
			var hash = 0, i, chr;
			if (str.length === 0){
				return hash;
			}

			for (i = 0; i < str.length; i++) {
				chr   = str.charCodeAt(i);
				hash  = ((hash << 5) - hash) + chr;
				hash |= 0; // Convert to 32bit integer
			}
			return hash+'';
		},
		//去除一些指定字符，如换行符。 如果传入的是null，则返回空字符串
		charReplace(str){

			if(str == null){
				return '';
			}
			str = str.trim();
			str = str.replace(/\t|\n|\v|\r|\f/g,'');	//去除换行符等
			//str = str.replace(/&/g, "%26"); //因为在提交时已经进行了url编码了
			return str;
		},
	},
	//request请求来源于 https://github.com/xnx3/request
	request:{
		/**
		 * post请求
		 * @param url 请求的接口URL，传入如 http://www.xxx.com/a.php
		 * @param data 请求的参数数据，传入如 {"goodsid":"1", "author":"管雷鸣"}
		 * @param func 请求完成的回调，传入如 function(data){ console.log(data); }
		 */
		post:function(url, data, func){
			var headers = {
				'content-type':'application/x-www-form-urlencoded'
			};
			this.send(url, data, func, 'post', true, headers, null);
		},
		/**
		 * 发送请求
		 * url 请求的url
		 * data 请求的数据，如 {"author":"管雷鸣",'site':'www.guanleiming.com'} 
		 * func 请求完成的回调，传入如 function(data){}
		 * method 请求方式，可传入 post、get
		 * isAsynchronize 是否是异步请求， 传入 true 是异步请求，传入false 是同步请求
		 * headers 设置请求的header，传入如 {'content-type':'application/x-www-form-urlencoded'};
		 * abnormalFunc 响应异常所执行的方法，响应码不是200就会执行这个方法 ,传入如 function(xhr){}
		 */
		send:function(url, data, func, method, isAsynchronize, headers, abnormalFunc){
			//post提交的参数
			var params = '';
			if(data != null){
				for(var index in data){
					if(params.length > 0){
						params = params + '&';
					}
					params = params + index + '=' + data[index];
				}
			}
			
			var xhr=null;
			try{
				xhr=new XMLHttpRequest();
			}catch(e){
				xhr=new ActiveXObject("Microsoft.XMLHTTP");
			}
			//2.调用open方法（true----异步）
			xhr.open(method,url,isAsynchronize);
			//设置headers
			if(headers != null){
				for(var index in headers){
					xhr.setRequestHeader(index,headers[index]);
				}
			}
			xhr.send(params);
			//4.请求状态改变事件
			xhr.onreadystatechange=function(){
			    if(xhr.readyState==4){
			        if(xhr.status==200){
			        	//请求正常，响应码 200
			        	var json = null;
			        	try{
			        		json = JSON.parse(xhr.responseText);
			        	}catch(e){
			        		console.log(e);
			        	}
			        	if(json == null){
			        		func(xhr.responseText);
			        	}else{
			        		func(json);
			        	}
			        }else{
			        	if(abnormalFunc != null){
			        		abnormalFunc(xhr);
			        	}
			        }
			    }
			}
		}
	},
	//存储，本地缓存
	storage:{
		set(key,value){
			localStorage.setItem(key,value);
		},
		get(key){
			return localStorage.getItem(key);
		}
	}


	
	/**************************** v2.0 end */
	
}


//这个只是v1使用到
try{
	translate.init();
	//translate.execute();
}catch(e){ console.log(e); }