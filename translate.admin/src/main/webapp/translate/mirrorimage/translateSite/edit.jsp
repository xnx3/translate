<%@page import="com.xnx3.j2ee.system.WMConfig"%>
<%@page import="com.xnx3.j2ee.Global"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<jsp:include page="/wm/common/head.jsp">
	<jsp:param name="title" value="编辑" />
</jsp:include>
<script src="/<%=Global.CACHE_FILE %>Site_language.js"></script>

<!-- 如果有id输入项，隐藏不显示出来 -->
<style>
#item_id{ display:none;}
</style>
<form id="form" class="layui-form"
	style="padding-top: 35px; margin-bottom: 10px; padding-right: 35px;">

    <!-- [tag-11] -->
	<div class="layui-form-item" id="item_id">
		<label class="layui-form-label">主键</label>
		<div class="layui-input-block">
			<input type="text" id="id" name="id" class="layui-input" value="" />			
		</div>
	</div>
	
	<div class="layui-form-item" id="item_name" style="display:none;">
		<label class="layui-form-label">站点名字</label>
		<div class="layui-input-block">
			<input type="text" id="name" name="name" class="layui-input" value="" />			
		</div>
	</div>
	
	<div class="layui-form-item" id="item_url">
		<label class="layui-form-label">源站网址</label>
		<div class="layui-input-block">
			<input type="text" id="url" name="url" class="layui-input" value="" placeholder="填写如: http://cms.zvo.cn" />			
			<div style="font-size: 10px;color: gray;">注意，填写时要带上协议，格式注意域名后面不要带 / 
				<br/>强烈推荐填写http协议的网址，如果是https协议的，可能会因为证书配置异常问题导致无法翻译
			</div>
		</div>
	</div>
	
	<div class="layui-form-item" id="item_language">
		<label class="layui-form-label">当前语种</label>
		<div class="layui-input-block">
			<script type="text/javascript">writeSelectAllOptionForlanguage_('','请选择语种', 1);</script>
			<div style="font-size: 10px;color: gray;">当前网站是什么语种的。<b>注意，这里暂时只支持中文、英文 两种语种的网站。</b></div>
		</div>
	</div>
	
	<div class="layui-form-item">
		<div class="layui-input-block">
			<a class="layui-btn" onclick="save()">立即保存</a>
			<button type="reset" class="layui-btn layui-btn-primary">重置</button>
		</div>
	</div>
</form>

<script>
// 获取窗口索引
var index = parent.layer.getFrameIndex(window.name); 
// 获取记录id
var id = getUrlParams('id');


function validateUrl(url) {
	var reg = /^(https?:\/\/)[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+([a-zA-Z0-9_\/?%&=]*[^\/])?$/;
	// 获取要检查的字符串
	var str = "https://www.bing.com/";
	// 使用test方法，返回一个布尔值，表示字符串是否匹配正则表达式
	var result = reg.test(url);
	return result;
}

	
/**
 * 保存
 */
function save() {
	// 表单序列化
	var param = wm.getJsonObjectByForm($("form"));
	if(!validateUrl(param.url)){
		msg.alert('源站网址填写格式错误！<br/>格式如：http://www.xxx.com');
		return;
	}
	//console.log(param);
	
	msg.loading("保存中");
	wm.post("/translate/mirrorimage/translateSite/save.json", param, function(data) {
		msg.close();
		if (data.result == '1') {
			parent.msg.success("操作成功")
			parent.layer.close(index);
			// 刷新父窗口
			parent.location.reload();
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
	wm.post("/translate/mirrorimage/translateSite/details.json", {id : id}, function(data) {
		msg.close();
		if (data.result == '1') {
			// 将接口获取到的数据自动填充到 form 表单中
			wm.fillFormValues($('form'), data.translateSite);
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
	
</script>

<jsp:include page="/wm/common/foot.jsp"></jsp:include>
