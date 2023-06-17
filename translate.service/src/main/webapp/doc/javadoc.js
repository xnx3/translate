wm.javadoc = {
	name:'translate.js 接口文档',		//文档名字
	outline:[{"author":null,"commentText":"ip接口","urlPath":"/","apiList":[{"getApiUrl":"/ip.json","methodName":"ip","html":"ip.json.html","commentText":"获取IP位置信息","urlFile":"ip.json"}]},{"author":null,"commentText":"翻译接口","urlPath":"/","apiList":[{"getApiUrl":"/language.json","methodName":"language","html":"language.json.html","commentText":"当前支持的语言","urlFile":"language.json"},{"getApiUrl":"/translate.json","methodName":"translate","html":"translate.json.html","commentText":"执行翻译操作","urlFile":"translate.json"}]}],	//大纲，菜单
	version:'2.20230104',//版本号
	default:{
		domain:'https://api.translate.zvo.cn',	//默认的domain域名
		token:''	//默认的token
	},
	domain:{
		set: function(text){
			localStorage.setItem('wm.javadoc.domain',text);
			msg.success('已保存',function(){
				//刷新
				location.reload();
			});
		},
		get: function(){
			var d = localStorage.getItem('wm.javadoc.domain');
			if(typeof(d) == 'undefined' || d == null || d.length < 1){
				d = wm.javadoc.default.domain;
			}
			return d;
		}
	},
	//点击请求按钮进行请求接口调试
	request: function(){
		msg.loading('请求中');
		var data = wm.getJsonObjectByForm($('#demoForm'));
		var url = wm.javadoc.domain.get()+document.getElementById('demoApiUrl').value;
		var startTime = new Date().getTime();

		//判断当前是否有文件上传
		if(document.getElementsByClassName('input_type_file').length > 0){
			//有文件上传

			var file = document.getElementsByClassName('input_type_file')[0];

			//post提交的参数
			var fd = new FormData();
			fd.append(file.name, file.files[0]);
			if(data != null){
				for(var index in data){
					fd.append(index, data[index]);
				}
			}
			
			var xhr=null;
			try{
				xhr=new XMLHttpRequest();
			}catch(e){
				xhr=new ActiveXObject("Microsoft.XMLHTTP");
			}
			//2.调用open方法（true----异步）
			xhr.open('POST',url,true);
			//设置headers
			//xhr.setRequestHeader('content-type','multipart/form-data');
			xhr.send(fd);
			//4.请求状态改变事件
			xhr.onreadystatechange=function(){
				msg.close();

			    if(xhr.readyState==4){
			        if(xhr.status==200){
			        	//请求正常，响应码 200
			        	var json = null;
			        	try{
			        		json = JSON.parse(xhr.responseText);

			        		var xiaohaoTime = new Date().getTime() - startTime;	//接口耗时
							document.getElementById('demoResponseResult').innerHTML="请求接口："+url+'\r\n接口耗时：'+xiaohaoTime+'ms\r\n返回响应：\r\n'+JSON.stringify(json, null, 4);

			        	}catch(e){
			        		console.log(e);
			        	}
			        }else{
		        		console.log(xhr);
		        		try{
		        			var json = JSON.parse(xhr.responseText);
							document.getElementById('demoResponseResult').innerHTML='响应异常，http 状态码:'+xhr.status+'\r\n响应:\r\n'+JSON.stringify(json, null, 4);
		        		}catch(e){
		        			console.log(e);
		        			document.getElementById('demoResponseResult').innerHTML='响应异常，http 状态码:'+xhr.status;
		        		}
						
			        }
			    }
			}

		}else{
			//无文件上传

			request.send(
				url,
				data,
				function(result){	//请求完成的回调
					msg.close();
					var xiaohaoTime = new Date().getTime() - startTime;	//接口耗时
					document.getElementById('demoResponseResult').innerHTML="请求接口："+url+'\r\n请求参数：\r\n'+JSON.stringify(data, null, 2).replaceAll('\{','').replaceAll('\}','').replaceAll('"','').replaceAll(':','=').replaceAll(',','').replaceAll(' ','')+'\r\n接口耗时：'+xiaohaoTime+'ms\r\n返回响应：\r\n'+JSON.stringify(result, null, 4);
					
					//判断一下当前接口是否是登录相关接口，如果是，还要自动设置token
					if(isLogin == 'true'){
						if(typeof(result.token) != 'string'){
							msg.failure('接口中未发现token字段返回，自动设置token失败');
						}else{
							wm.token.set(result.token);
						}
					}
				},
				'post',
				true,
				{'content-type':'application/x-www-form-urlencoded'},
				function(xhr){	//异常执行的方法
					msg.close();
					console.log(xhr);
					try{
	        			var json = JSON.parse(xhr.responseText);
						document.getElementById('demoResponseResult').innerHTML='响应异常，http 状态码:'+xhr.status+'\r\n响应:\r\n'+JSON.stringify(json, null, 4);
	        		}catch(e){
	        			console.log(e);
	        			document.getElementById('demoResponseResult').innerHTML='响应异常，http 状态码:'+xhr.status+'\r\n响应:\r\n'+xhr.response;
	        		}
					
				}
			);
			
		}

		
		return false;
	},
	//api请求的响应参数相关
	apiResponse:{
		html:'',
		//输出空格
		writeKongge: function(cengshu){
			var html = '';
			for(var i =0; i< (cengshu * 6); i++){
				html = html + ' ';
			}
			return html;
		},
		//组合返回值的表格，将组合好的赋予 this.html
		returnAssembly: function(obj, cengshu){
			for(var i=0,l=obj.list.length;i<l;i++){
				wm.javadoc.apiResponse.html = wm.javadoc.apiResponse.html + '<tr><td>' + wm.javadoc.apiResponse.writeKongge(cengshu) + obj.list[i].name + '</td><td>' + obj.list[i].type + '</td><td>' + obj.list[i].commentText + '</td></tr>';
				if(obj.list[i].sub != null && typeof(obj.list[i].sub) != 'undefined'){
					wm.javadoc.apiResponse.returnAssembly(obj.list[i].sub, cengshu+1);
				}
			}
		}
	},
	apiRequest:{
		html: '',
		//组合传入值的表格，将组合好的赋予 this.html
		requestParamAssembly:function(obj){
			var html = '';
			var arr = Object.keys(obj);
			if(arr.length == 0){
				wm.javadoc.apiRequest.html = '<div class="wenben">无</div>'
			}else{
				for(op in obj){
					wm.javadoc.apiRequest.html = wm.javadoc.apiRequest.html + '<tr><td>' + obj[op].name + '</td><td>' + obj[op].type + '</td><td>' + obj[op].defaultValue + '</td><td>' + obj[op].required + '</td><td>' + obj[op].commentText + '</td></tr>'
				}
				wm.javadoc.apiRequest.html = '<table rules="all" frame="border" cellpadding="10px"><thead><tr><th>参数名称</th><th>类型</th><th>示例值</th><th>必须</th><th>描述</th></tr></thead>' + wm.javadoc.apiRequest.html + '</tbody></table>'
			}
		}
	},
	//弹出域名输入框，修改域名
	popupDomainInput: function(){
		msg.input('请输入接口域名',function(value){
			wm.javadoc.domain.set(value);
			document.getElementById('domain').innerHTML = value;
		}, wm.javadoc.domain.get());
	},
	
	//渲染输出左侧的菜单列表
	renderOutline:function(){
		var outline = wm.javadoc.outline;
		var html = '';
		console.log(outline)
		for(var i=0,l=outline.length;i<l;i++){
			var first = outline[i];
			html = html + '<tr><td class="ate listutil" height="38"><span class="lkod" id="aimg' + i + '"><svg t="1641605732449" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2176" width="8" height="10"><path d="M204.58705 951.162088 204.58705 72.836889 819.41295 511.998977Z" p-id="2177"></path></svg></span><a onclick="javascript:ShowFLT(' + i + ')" href="javascript:void(null)" class="polpo">' + first.commentText + '</a></td></tr>';
			var lkli = ''
			if(typeof(first.apiList) != 'undefined' & first.apiList != null && first.apiList.length > 0){
				for(var s=0;s<first.apiList.length;s++){
					var api = first.apiList[s];
					lkli = lkli 
					+ '<tr>'
						+ '<td id="la' + i + 's' + s + '" class="ate listlit" height="38">'
							+ '<a class="lisla" title="文件夹" onclick="window.location.href = \''+api.html+'\';" href="#" target="_parent">' + api.commentText + '</a>'
						+ '</td>'
					+ '</tr>';
				}
			}
			var lksdop = '<tr id="LM' + i + '" style="display: none"><td><table cellSpacing="0" cellPadding="0" width="100%" border="0"><tbody>' + lkli + '</tbody></table></td></tr>';
			html = html + lksdop
		}
		var lkdos = '<table width="288" border="0" align="center" cellpadding="0" cellspacing="0"><tbody><tr><td align="center" valign="top"><table cellSpacing="0" cellPadding="0" width="100%" border="0"><tbody>' + html + '</tbody></table></td></tr></tbody></table>'
		document.getElementById('alllist').innerHTML = lkdos;
	}
};

//加载必要的js文件
wm.load.synchronizesLoadJs('https://res.zvo.cn/msg/msg.js');
wm.load.synchronizesLoadJs('https://res.zvo.cn/request/request.js');
wm.load.synchronizesLoadJs('https://res.zvo.cn/jquery/jquery-2.1.4.js');

/**** 初始化数据模拟请求demo ****/
function initApiDocRequestDemo(){
	if (typeof(document.getElementById('domain')) != 'undefined') {
		//域名
		document.getElementById('domain').innerHTML = wm.javadoc.domain.get();
	};
	
	if (typeof(document.getElementById('demoApiUrl')) != 'undefined') {
		//请求url
		document.getElementById('demoApiUrl').value = document.getElementById('api.url').innerHTML.trim();
	};

	if (typeof(document.getElementById('demoRequestParams')) != 'undefined') {
		//传递参数
		var requestParamsHtml = '';
		for(op in requestParam){
			if(requestParam[op].name.toLowerCase() == 'token'){
				//是token，那么可以有保存按钮，进行全局更新
				requestParamsHtml = requestParamsHtml + '<div class="csli"><div class="csbox">'+requestParam[op].name+(requestParam[op].required? '<span>*</span>':'')+'</div><input type="text" name="'+requestParam[op].name+'" id="tokenInput" value="'+wm.token.get()+'" /><button class="btnsz" onclick="wm.token.set(document.getElementById(\'tokenInput\').value); msg.success(\'已保存\');">保存</button></div>';
			}else{
				var type = "text";
				console.log(requestParam[op]);
				if(requestParam[op].type == '文件'){
					type = "file";
				}
				requestParamsHtml = requestParamsHtml + '<div class="csli"><div class="csbox">'+requestParam[op].name+(requestParam[op].required? '<span>*</span>':'')+'</div><input type="'+type+'" class="input_type_'+type+'" name="'+requestParam[op].name+'" value="'+requestParam[op].defaultValue+'" /></div>';
			}
		}
		document.getElementById('demoRequestParams').innerHTML = requestParamsHtml;
	};
	
}

//左侧菜单列表点击显示隐藏
var number = wm.javadoc.outline.length - 1;
function ShowFLT(i) {
	lbmc = eval('LM' + i);
	var klis = "#aimg" + i;
	//treePic = eval('treePic' + i)
	if (lbmc.style.display == 'none') {
		//treePic.src = 'images/nofile.gif';
		lbmc.style.display = '';
		console.log(klis)
		$(klis).addClass("imgss")
	}
	else {
		//treePic.src = 'images/file.gif';
		lbmc.style.display = 'none';
		console.log(klis)
		$(klis).removeClass("imgss")
	}
}
//页面加载完成执行
window.onload = function(){

	//判断是首页还是在普通内页
	if(window.location.href.indexOf('index.html') == -1){
	initApiDocRequestDemo();
		//不是首页

		//渲染左侧菜单
		wm.javadoc.renderOutline();

		//渲染传入参数
		//testReturn(responseReturn, 0);
		wm.javadoc.apiRequest.requestParamAssembly(requestParam);
		document.getElementById("api.params").innerHTML = wm.javadoc.apiRequest.html;
		
		//渲染返回参数
		wm.javadoc.apiResponse.returnAssembly(responseReturn, 0);
		document.getElementById("responseTable").innerHTML = '<table rules="all" frame="border" cellpadding="10px"><thead><tr><th>参数</th><th>类型</th><th>描述</th></tr></thead>' + wm.javadoc.apiResponse.html + '</tbody></table>';
		
		//自动展开当前列表
		for(a = 0; a < wm.javadoc.outline.length;a++){
			for(s = 0; s < wm.javadoc.outline[a].apiList.length;s++){
				if(wm.javadoc.outline[a].apiList[s].getApiUrl == document.getElementById('api.url').innerHTML.trim()){
					ShowFLT(a);
					var lkida = "#la" + a + "s" + s
					console.log(lkida)
					$(lkida).addClass("olkod")
			   }
			}
		}
		
	}else{
		//是首页
		//渲染左侧菜单
		wm.javadoc.renderOutline();
		//自动列表第一项
		ShowFLT(0);
	}
}
