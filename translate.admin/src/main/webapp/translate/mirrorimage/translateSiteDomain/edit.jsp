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
		<label class="layui-form-label">对应</label>
		<div class="layui-input-block">
			<input type="text" id="id" name="id" class="layui-input" value="" />			
		</div>
	</div>
	
	<div class="layui-form-item" id="item_domain">
		<label class="layui-form-label" id="domain_table_fangwen">访问域名</label>
		<div class="layui-input-block">
			<input type="text" id="domain" name="domain" class="layui-input" value="" placeholder="填写如: english.zvo.cn" />			
		</div>
	</div>
	
	<div class="layui-form-item" id="item_language">
		<label class="layui-form-label">翻译语种</label>
		<div class="layui-input-block">
			<script type="text/javascript">writeSelectAllOptionForlanguage_('','请选择语种', 1);</script>
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
	
	wm.post("/translate/mirrorimage/translateSiteDomain/save.json?siteid=<%=request.getParameter("siteid") %>", param, function(data) {
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
	wm.post("/translate/mirrorimage/translateSiteDomain/details.json", {id : id}, function(data) {
		msg.close();
		if (data.result == '1') {
			// 将接口获取到的数据自动填充到 form 表单中
			wm.fillFormValues($('form'), data.translateSiteDomain);
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

//帮助，复制的 site/detail.jsp
msg.tip({
	id:'domain_table_fangwen',
	width:'320px',
	direction:'bottom',
	text:'生成这个翻译的新网站后，访问的域名（或路径）填写如：<br/>english.xxxxxx.com<br/>www.xxxxx.com/english/<br/>这里建议采用第一种，域名的方式。如果是采用第二种路径的方式，那么通过存储方式推送时，你应该考虑好要推送到哪里去才能被访问到<br/>这里如果你不好理解，你都可以填写个 123 都可以，都可以正常进行翻译。'
});
</script>

<jsp:include page="/wm/common/foot.jsp"></jsp:include>
