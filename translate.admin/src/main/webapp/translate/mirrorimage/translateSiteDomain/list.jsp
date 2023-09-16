<%@page import="com.xnx3.j2ee.Global"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.xnx3.com/java_xnx3/xnx3_tld" prefix="x"%>
<jsp:include page="/wm/common/head.jsp">
	<jsp:param name="title" value="列表" />
</jsp:include>
<script src="/<%=Global.CACHE_FILE %>Site_language.js"></script>


<jsp:include page="/wm/common/list/formSearch_formStart.jsp"></jsp:include>
<!-- [tag-5] -->
<jsp:include page="/wm/common/list/formSearch_input.jsp">
	<jsp:param name="iw_label" value="绑定的域名" />
	<jsp:param name="iw_name" value="domain" />
</jsp:include>
<jsp:include page="/wm/common/list/formSearch_input.jsp">
	<jsp:param name="iw_label" value="翻译语种" />
	<jsp:param name="iw_name" value="language" />
	<jsp:param name="iw_type" value="select"/>
</jsp:include>
<input type="hidden" name="siteid" value="<%=request.getParameter("siteid") %>" />
<a class="layui-btn" href="javascript:wm.list(1);" style="margin-left: 15px;">搜索</a>

<a href="javascript:editItem(0, '');" class="layui-btn layui-btn-normal" style="float: right; margin-right: 10px;">添加</a>
</form>

<table class="layui-table iw_table">
	<thead>
		<tr>
		    <!-- [tag-6] -->
			<th>编号</th>
			<th>绑定的域名</th>
			<th>翻译语种</th>
			<th>操作</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="item in list" id="list">
		    <!-- [tag-7] -->
			<td>{{item.id}}</td>
			<td>{{item.domain}}</td>
			<td>{{language[item.language]}}</td>
			<td style="width: 160px;">
				<botton class="layui-btn layui-btn-sm"
					:onclick="'guanli(\'' + item.id + '\', \'id=' + item.id + '\');'" style="margin-left: 3px;">管理</botton>
				<botton class="layui-btn layui-btn-sm"
					:onclick="'editItem(\'' + item.id + '\', \'id=' + item.id + '\');'" style="margin-left: 3px;">编辑</botton>
				
				<botton class="layui-btn layui-btn-sm"
					:onclick="'deleteItem(\'' + item.id + '\', \'id=' + item.id + '\');'" style="margin-left: 3px;">删除</botton>
			</td>
			
		</tr>
		
	</tbody>
</table>
<!-- 通用分页跳转 -->
<jsp:include page="/wm/common/page.jsp"></jsp:include>

<div style="padding: 20px;color: gray;">
	<div>提示:</div>
	<div>比如你在此绑定一个英文的二级域名，翻译语种的属性设置为英文，那么你访问这个绑定的英文二级域名时，所出现的页面便是被翻译为英文的网页。注意，域名绑定后，您需要将绑定的域名解析到本服务器ip，访问时才能访问到</div>
</div>

<script type="text/javascript">

// 刚进入这个页面，加载第一页的数据
wm.list(1, '/translate/mirrorimage/translateSiteDomain/list.json');

/**
 * 添加、编辑记录信息
 * @param {Object} id 要编辑的记录的id，为0代表添加
 * @param {Object} name 要编辑的记录的名称
 */
function editItem(id, name) {
	layer.open({
		type: 2, 
		title: id > 0 ? '编辑【' + name + '】' : '添加', 
		area: ['450px', '460px'],
		shadeClose: true, // 开启遮罩关闭
		content: '/translate/mirrorimage/translateSiteDomain/edit.jsp?id=' + id +'&siteid=<%=request.getParameter("siteid") %>'
	});
}

/**
 * 管理
 * @param {Object} id domain.id
 * @param {Object} name 名称
 */
function guanli(id, name) {
	layer.open({
		type: 2, 
		title: '翻译管理【' + name + '】', 
		area: ['550px', '760px'],
		content: './guanli.jsp?id=' + id+'&name='+name
	});
}

/**
 * 根据id删除一条记录
 * @param {Object} id 要删除的记录id
 * @param {Object} name 要删除的记录的名称
 */
function deleteItem(id, name) {
	msg.confirm('是否删除【' + name + '】？', function() {
		// 显示“删除中”的等待提示
		parent.msg.loading("删除中");
		$.post('/translate/mirrorimage/translateSiteDomain/delete.json?id=' + id, function(data) {
			// 关闭“删除中”的等待提示
			parent.msg.close();
			if(data.result == '1') {
				parent.msg.success('操作成功');
				// 刷新当前页
				window.location.reload();
			} else if(data.result == '0') {
				parent.msg.failure(data.info);
			} else { 
				parent.msg.failure();
			}
		});
	}, function() {
		
	});
}

</script>

<jsp:include page="/wm/common/foot.jsp"></jsp:include>