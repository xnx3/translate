<%@page import="com.xnx3.j2ee.system.WMConfig"%>
<%@page import="com.xnx3.j2ee.Global"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<jsp:include page="/wm/common/head.jsp">
	<jsp:param name="title" value="编辑" />
</jsp:include>

<!-- 如果有id输入项，隐藏不显示出来 -->
<style>
#item_id{ display:none;}
</style>
<form id="form" class="layui-form"
	style="padding-top: 35px; margin-bottom: 10px; padding-right: 35px;">

	<div class="layui-form-item" id="item_username">
		<label class="layui-form-label">登录账号</label>
		<div class="layui-input-block">
			<input type="text" id="username" name="username" class="layui-input" value="" />			
		</div>
	</div>
	
	<div class="layui-form-item" id="item_password">
		<label class="layui-form-label">登录密码</label>
		<div class="layui-input-block">
			<input type="text" id="password" name="password" class="layui-input" value="" />			
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
	
/**
 * 保存
 */
function save() {
	msg.loading("保存中");
	// 表单序列化
	var param = wm.getJsonObjectByForm($("form"));
	
	wm.post("add.json", param, function(data) {
		msg.close();
		if (data.result == '1') {
			parent.msg.success("添加成功")
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
	wm.post("details.json", {id : id}, function(data) {
		msg.close();
		if (data.result == '1') {
			if(data.jbeWuye.id > 0){
				//如果是修改，那么不显示用户名跟密码的设置
				document.getElementById('item_username').style.display = 'none';
				document.getElementById('item_password').style.display = 'none';
			}
			
			// 将接口获取到的数据自动填充到 form 表单中
			wm.fillFormValues($('form'), data.jbeWuye);
			
			
			
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
