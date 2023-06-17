<%@page import="com.xnx3.j2ee.system.WMConfig"%>
<%@page import="com.xnx3.j2ee.Global"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<jsp:include page="/wm/common/head.jsp">
	<jsp:param name="title" value="清理缓存" />
</jsp:include>

<!-- clear By Url -->
<form id="form" class="layui-form"
	style="padding-top: 35px; margin-bottom: 10px; padding-right: 35px;">
	<div class="layui-form-item" id="item_url">
		<label class="layui-form-label">站点网址</label>
		<div class="layui-input-block" style="width: 500px">
			<input type="text" id="url" name="url" class="layui-input" value="" placeholder="填写格式如 http://english.cms.zvo.cn/40828.html" />			
			<a class="layui-btn" onclick="clearByUrl()" style=" float: right;margin-top: -38px;">立即清除</a>
			<div style="color: gray;font-size: 8px;">根据具体的网址，来清除访问缓存。</div>
		</div>
	</div>
</form>
<script>
/**
 * 清理
 */
function clearByUrl() {
	msg.loading("清理中");
	// 表单序列化
	var param = wm.getJsonObjectByForm($("form"));
	
	wm.post("/admin/cache/clearByUrl.json", param, function(data) {
		msg.close();
		if (data.result == '1') {
			msg.success("已清理")
		} else if (data.result == '0') {
			msg.failure(data.info);
		} else {
			msg.failure(result);
		}
	}, "text");

	return false;
}
</script>



<!-- clear By bindDomain -->
<form id="form" class="layui-form"
	style="padding-top: 35px; margin-bottom: 10px; padding-right: 35px;">
	<div class="layui-form-item" id="item_url">
		<label class="layui-form-label">绑定域名</label>
		<div class="layui-input-block" style="width: 500px">
			<input type="text" id="bindDomain" name="bindDomain" class="layui-input" value="" placeholder="填写格式如 english.cms.zvo.cn" />			
			<a class="layui-btn" onclick="clearByBindDomain()" style=" float: right;margin-top: -38px;">立即清除</a>
			<div style="color: gray;font-size: 8px;">根据语种所绑定的域名，来清除这个域名访问下所有的访问缓存。</div>
		</div>
	</div>
</form>
<script>
/**
 * 清理
 */
function clearByBindDomain() {
	msg.loading("清理中");
	// 表单序列化
	var param = wm.getJsonObjectByForm($("form"));
	
	wm.post("/admin/cache/clearByBindDomain.json", param, function(data) {
		msg.close();
		if (data.result == '1') {
			msg.success("已清理")
		} else if (data.result == '0') {
			msg.failure(data.info);
		} else {
			msg.failure(result);
		}
	}, "text");

	return false;
}
</script>

<jsp:include page="/wm/common/foot.jsp"></jsp:include>
