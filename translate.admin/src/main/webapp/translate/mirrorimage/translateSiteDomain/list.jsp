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
	<div>比如你在此绑定一个英文的二级域名，翻译语种的属性设置为英文，那么你访问这个绑定的英文二级域名时，所出现的页面便是被翻译为英文的网页。注意，域名绑定后，您需要将绑定的域名进行解析，访问时才能访问到</div>
	<div><b>绑定的域名</b>：您的被翻译后的语种进行访问使用的域名。
		<br/>[推荐]比如您的源站域名是 www.zvo.cn ，那么这里你可以根据翻译的语种不同，设置相应域名，比如 english.zvo.cn 
		<br/>又比如您想吧不同翻译的语种统一放到一个服务器空间，多个翻译语种并不采用二级域名的方式，而是使用追加路径的方式，比如这里设置为 www.zvo.cn/english ，那便可以访问 http://www.zvo.cn/english/index.html 打开翻译为英文的网站； 设置为 www.zvo.cn/japanese ，便可以访问 http://www.zvo.cn/japanese/index.html 打开翻译为日文的网站。（此种方式需要配合 “管理” 按钮中的存储方式配合，存储方式要设置为存放到相应路径下，这个需要懂运维方面知识）
		<br/>（后续翻译系统会根据这里您设置的域名，自动将您网站中出现的原本的网址替换为翻译后的域名，比如你源网站中，某个页面有个超链接为 &lt;a href="http://www.zvo.cn/abc.html"&gt;我是超链接&lt;/a&gt;，翻译系统会自动将超链接的href识别并更改为您这里所设置的域名，以使翻译之后的网站，点击超链接跳转时，跳转到的还是在翻译后的网站内，而不必跳转到源网站，当然此能力还在处于优化中）</div>
		<br/>
	<div><b>翻译语种</b>：要翻译为什的目标语种</div>
	<div><b>“管理”按钮</b>：功能都集中在这里，你可以使用调试预览，进行微调，这个可能用的比较多。当微调感觉满意了，就可以直接生成翻译整站了</div>
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