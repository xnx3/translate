if(typeof(fileupload) == 'undefined'){
	fileupload = {};
}
fileupload.config = {
	paramTemplate:null,
	
	templateReplace:function(item){
		var paramHtml = fileupload.config.paramTemplate;
		return paramHtml.replace(/\{id\}/g, item.id)
					.replace(/\{name\}/g, item.name)
					.replace(/\{value\}/g, item.value)
					.replace(/\{require\}/g, item.require)
					.replace(/\{description\}/g, item.description)
					.replace(/\{defaultValue\}/g, item.defaultValue)
					;
	},
	configData:null, //通过 config.json接口获取到的数据
	
	//初始化，赋予配置信息
	initConfigData:function(configData){
		fileupload.config.configData = configData;
		
		if(fileupload.config.paramTemplate == null){
			fileupload.config.paramTemplate = document.getElementById("storage_param").innerHTML
		}
	},
	
	storageSelectAddOption:function(value, text){
		var select = document.getElementById("storageSelect");
		var option = document.createElement("option");
		option.value = value;
		option.text = text;
		select.appendChild(option);
	},
	
	/**
	 * 渲染显示具体某个存储方式的输入
	 * storageId 传入存储方式，显示这个存储方式的输入方式
	 * key 这个存储方式对应的key唯一标识
	 */
	renderStorageParam:function(storageId, key){
		if(typeof(fileupload.config.configData) == 'undefined'){
			msg.failure('请等待接口加载config配置数据');
			return;
		}
		
		//寻找 storage
		var storage;
		for(var index in fileupload.config.configData.storageList){
			fileupload.config.storageSelectAddOption(fileupload.config.configData.storageList[index].id, fileupload.config.configData.storageList[index].name); //给存储方式 select 增加属性
			if(storageId == fileupload.config.configData.storageList[index].id){
				storage = fileupload.config.configData.storageList[index];
				break;
			}
		}
		
		var html = '';
		for(var index in storage.paramList){
			html = html + fileupload.config.templateReplace(storage.paramList[index]);
		}
		
		document.getElementById("storage_param").innerHTML = html;
		
		document.getElementById("storage_key").value = key;
	},
	
	/*快速使用*/
	quick:{
		configUrl:'http://xxxxx.com/getConfig.json', //获取fileupload config 的 json配置
		submitUrl:"http://xxxxx.com/save.json",	//提交保存的url
		key:"", //当前存储方式的唯一标识
		//显示出来的html页面内容
		html: `
			<style>
				#from{padding: 10px 0 5px 0;box-sizing: border-box;}
				/* select选择框 */
				.storageSelectDiv{margin-bottom:12px}
				/* input输入框前面的文字 */
				.storage_label{ width:5rem; display: inline-block;font-size:14px;text-align: right;padding-right: 10px;box-sizing: border-box; }
				/* input输入框所在的div */
				#storage_param .storage_param_input_div{  padding-top: 8px; }
				/* input输入框 */
				#storage_param .storage_param_input_div input,#storageSelect {width: calc(100% - 7rem);height: 25px;box-sizing: border-box;outline: 0;border: 2px solid #ebebeb;font-size: 14px;line-height: 25px;border-radius:3px;margin-bottom:3px }
				/* input是否必填 - 非必填 */
				#storage_param div .storage_param_false{ display:none; }
				/* input输入框下面跟随的填写说明 */
				#storage_param .storage_param_info{ margin-left: 85px;color: #9e9e9e;font-size: 12px;width: calc(100% - 7rem);line-height:1rem}
				/* input是否必填 - 必填 */
				.storage_param_true{ color:red; }
				/* 提交按钮所在的div */
				.storage_submit_div{ margin-top:0.8rem; text-align: center; padding-right: 2rem;margin-left: 5rem;}
				/* 提交按钮 */
				.storage_submit_div button{ padding: 2px 15px;cursor: pointer;width: 60%;}
			</style>
			<div id="from">
				<div class="storageSelectDiv">
					<label class="storage_label">存储方式:</label>
					<select id="storageSelect" name="storage" onchange="fileupload.config.renderStorageParam(this.value);">
						<!-- 这里面的值是动态赋予的,这里先写死模拟 storageList.id -->
					</select>
				</div>
				<input type="hidden" id="storage_key" name="key" value="" />
				<div id="storage_param">
					<div class="storage_param_input_div">
						<label class="storage_label" title="{description}">{name}:</label>
						<input type="text" name="{id}" value="{defaultValue}" placeholder="" title="{description}" class="storage_param_{id}" />
						<span class="storage_param_{require}">*</span>
					</div>
					<div class="storage_param_info">{description}</div>
				</div>
				
				<div class="storage_submit_div"><button onclick="fileupload.config.quick.submit();">提交</button></div>
			</div>
		`,
		//提交按钮
		submit:function(){
			var postData = from.getJsonData('from');
			console.log(JSON.stringify(postData, null, 4));
			//alert(data);
			msg.loading('正在测试是否能连通，请稍后...');
			request.post(fileupload.config.quick.submitUrl, postData, function(data){
				msg.close();  //关闭保存中
				//alert(data.info);
				if(data.result == '0'){
					msg.info(data.info);
					return;
				}
				
				msg.close();	//关闭弹出设置的窗口
				
				msg.success('保存成功');
			});
		},
		//加载
		load:function(){
			msg.loading('加载中');
			//接口请求，获取 FileUpload 的所有配置参数
			request.get(fileupload.config.quick.configUrl, {}, function(data){
				msg.close();
				//初始化配置信息
				
				msg.popups({
					text:fileupload.config.quick.html,
					width: '360px',
					top:'16%'
				});
				fileupload.config.initConfigData(data);
				console.log(data);
				
				//这里默认让它显示第一个存储方式
				var firstStorageId = data.storageList[0].id;
				if(typeof(data.custom) != 'undefined' && data.custom != null && typeof(data.custom.storage) != 'undefined'){
					//用户之前有设置过了，那么显示用户自己设置的
					firstStorageId = data.custom.storage
				}
				
				fileupload.config.renderStorageParam(firstStorageId, fileupload.config.quick.key);
				
				if(typeof(data.custom) != 'undefined' && data.custom != null && typeof(data.custom.storage) != 'undefined'){
					//用户之前有设置过了，那么显示用户自己设置的信息，进行填充
					from.fill('storage_param', data.custom.config);
				}
				
			});
		},
		/**
			{
				configUrl:"http://xxxxx.com/getConfig.json?key=123" //获取fileupload config 的 json配置
				submitUrl:"http://xxxxx.com/save.json",	//提交保存的url
			}
		 */
		use:function(options){
			fileupload.config.quick.configUrl = options.configUrl;
			fileupload.config.quick.submitUrl = options.submitUrl;
			fileupload.config.quick.key = options.key;
			fileupload.config.quick.load();
		}
	}
}