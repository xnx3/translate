<%@page import="com.xnx3.j2ee.system.WMConfig"%>
<%@page import="com.xnx3.j2ee.Global"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<jsp:include page="/wm/common/head.jsp">
	<jsp:param name="title" value="编辑" />
</jsp:include>
<link rel="stylesheet" href="https://res.zvo.cn/module/editor/css/editormd.css" />
<script src="https://res.zvo.cn/module/editor/editormd.js"></script>
<script src="https://res.weiunity.com/msg/msg.js"></script>

<!-- 如果有id输入项，隐藏不显示出来 -->
<style>
html{overflow-x: hidden;}
#item_id{ display:none;}
</style>
<form id="form" class="layui-form"
	style="margin-right: 2px;">

    <!-- [tag-11] -->
	<div class="layui-form-item" id="item_id">
		<label class="layui-form-label">对应</label>
		<div class="layui-input-block">
			<input type="text" id="id" name="id" class="layui-input" value="" />			
		</div>
	</div>
	
	<div class="layui-form-item">
		<label class="layui-form-label" style=" width: 100%;float: left;display: flex;">翻译前执行的JavaScript代码 <i class="layui-icon" style=" color: #626262;font-size: 16px; cursor: pointer; margin-left: 10px;" onclick="showExecuteJs()">&#xe702;</i> &nbsp;：</label>
		<div class="layui-input-block" id="executeJs_div">
			<textarea name="executeJs" id="executeJs_textarea" style="height:350px;" placeholder="请输入 JavaScript 代码" class="layui-textarea" style="height: 300px"></textarea>
		</div>
	</div>
	
	<div class="layui-form-item">
		<label class="layui-form-label" style=" width: 100%;float: left;display: flex;">在完成翻译后的html页面的末尾追加的代码 <i class="layui-icon" style=" color: #626262;font-size: 16px; cursor: pointer; margin-left: 10px;" onclick="showHtmlAppendJs()">&#xe702;</i> &nbsp; ： </label>
		<div class="layui-input-block" id="htmlAppendJs_div">
			<textarea name="htmlAppendJs" id="htmlAppendJs_textarea" style="height:350px;" placeholder="请输入 JavaScript 代码" class="layui-textarea" style="height: 300px"></textarea>
		</div>
	</div>
	
	<div class="layui-form-item">
		<div class="layui-input-block" style="text-align: center; margin-left: 0px;">
			<a class="layui-btn" onclick="save()">立即保存</a>
		</div>
	</div>
</form>

<script>
// 获取窗口索引
var index = parent.layer.getFrameIndex(window.name); 
// 获取记录id
var id = getUrlParams('id');
	


//在加载完数据后，进行加载编辑器
function loadExecuteJsEditor(){
	//代码编辑器
	executeJsEditor = editormd("executeJs_div", {
		width			: "100%",
		height			: "350px",
		watch			: false,
		toolbar			: false,
		codeFold		: true,
		searchReplace	: true,
		placeholder		: "请输入 JavaScript 代码",
		value			: document.getElementById("executeJs_textarea").value,
		theme			: "default",
		mode			: "text/html",
		path			: 'https://res.zvo.cn/module/editor/lib/'
	});
}

//在加载完数据后，进行加载编辑器
function loadHtmlAppendJsEditor(){
	//代码编辑器
	htmlAppendJsEditor = editormd("htmlAppendJs_div", {
		width			: "100%",
		height			: "350px",
		watch			: false,
		toolbar			: false,
		codeFold		: true,
		searchReplace	: true,
		placeholder		: "请输入HTML源码最末尾追加的代码",
		value			: document.getElementById("htmlAppendJs_textarea").value,
		theme			: "default",
		mode			: "text/html",
		path			: 'https://res.zvo.cn/module/editor/lib/'
	});
}	
	
/**
 * 保存
 */
function save() {
	msg.loading("保存中");
	// 表单序列化
	var param = wm.getJsonObjectByForm($("form"));
	
	wm.post("/translate/mirrorimage/translateSiteSet/save.json", param, function(data) {
		msg.close();
		if (data.result == '1') {
			parent.msg.success("操作成功")
			parent.layer.close(index);
			// 刷新父窗口
			//parent.location.reload();
		} else if (data.result == '0') {
			msg.failure(data.info);
		} else {
			msg.failure(result);
		}
	}, "text");

	return false;
}

/**
 * 加载数据
 */
function loadData() {
	msg.loading("加载中");
	wm.post("/translate/mirrorimage/translateSiteSet/details.json", {id : id}, function(data) {
		msg.close();
		if (data.result == '1') {
			// 将接口获取到的数据自动填充到 form 表单中
			wm.fillFormValues($('form'), data.translateSiteSet);
			loadExecuteJsEditor();
			//如果一起执行诡异错误， executeJs 会被 htmlAppendJs覆盖
			setTimeout(function(){ loadHtmlAppendJsEditor(); }, 200); 
		} else if (data.result == '0') {
			msg.failure(data.info);
		} else {
			msg.failure(result);
		}
	}, "text");
}
if(id != null && id > 0){
	//编辑
	loadData();
}else{
	//新增
	
}


function showExecuteJs(){
	msg.popups({
		text:'翻译前执行的JavaScript代码。这个只是在翻译的过程中进行执行，它会在整个网页已经打开、translate.js 都已经正常加载完毕后，执行这里设置的js，在之后会再执行 translate.execute() 进行翻译。像是自定义图片了、自定义术语库了、又或者用js操作某个网页增加个div、删除个什么原本网页中的元素了，也都可以在这里加。',
		width:'360px'
	});
}


function showHtmlAppendJs(){
	msg.popups({
		text:'翻译完成后，在翻译后的html页面中追加的代码。 这个会在翻译后的html最末尾追加，也就是在 &lt;/html&gt; 之后追加。<br/>比如你可以追加js脚本、css样式等等。',
		width:'360px'
	});
}

</script>

<jsp:include page="/wm/common/foot.jsp"></jsp:include>
