<%@page import="com.xnx3.j2ee.Global"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.xnx3.com/java_xnx3/xnx3_tld" prefix="x"%>
<jsp:include page="/wm/common/head.jsp">
	<jsp:param name="title" value="列表" />
</jsp:include>
<script src="/<%=Global.CACHE_FILE %>Site_language.js"></script>

<style>
.wm-icon-help{
	 color: #626262;font-size: 16px; cursor: pointer; margin-left: 10px;
}
</style>

<jsp:include page="/wm/common/list/formSearch_formStart.jsp"></jsp:include>
<!-- [tag-5] -->
<!-- 
<jsp:include page="/wm/common/list/formSearch_input.jsp">
	<jsp:param name="iw_label" value="主键" />
	<jsp:param name="iw_name" value="id" />
</jsp:include>
<jsp:include page="/wm/common/list/formSearch_input.jsp">
	<jsp:param name="iw_label" value="站点名字" />
	<jsp:param name="iw_name" value="name" />
</jsp:include>
 -->
<jsp:include page="/wm/common/list/formSearch_input.jsp">
	<jsp:param name="iw_label" value="源站网址" />
	<jsp:param name="iw_name" value="url" />
</jsp:include>
<jsp:include page="/wm/common/list/formSearch_input.jsp">
	<jsp:param name="iw_label" value="当前语种" />
	<jsp:param name="iw_name" value="language" />
	<jsp:param name="iw_type" value="select"/>
</jsp:include>

<a class="layui-btn" href="javascript:wm.list(1);" style="margin-left: 15px;">搜索</a>

<a href="javascript:editItem(0, '');" class="layui-btn layui-btn-normal" style="float: right; margin-right: 10px;">添加</a>
</form>

<table class="layui-table iw_table">
	<thead>
		<tr>
		    <!-- [tag-6] -->
			<!-- <th>主键</th>
			<th>站点名字</th> -->
			<th>源站网址 <i class="layui-icon wm-icon-help" onclick="showSourceUrl();">&#xe702;</i></th>
			<th>源站语种</th>
			<th>翻译语种</th>
			<th>翻译控制</th>
			<th>操作</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="item in list" id="list">
		    <!-- [tag-7] -->
			<!-- <td>{{item.id}}</td>
			<td>{{item.name}}</td> -->
			<td><a :href="'/translate/mirrorimage/translateSite/detail.jsp?siteid='+item.id">{{item.url}}</a></td>
			<td>{{language[item.language]}}</td>
			<td style="width: 60px;">
				<botton class="layui-btn layui-btn-sm" :onclick="'siteDomainList(\'' + item.id + '\', \'' + item.url + '\');'" style="margin-left: 3px;">管理</botton>
			</td>
			<td style="width: 60px;">
				<botton class="layui-btn layui-btn-sm" :onclick="'editSiteSet(\'' + item.id + '\', \'' + item.url + '\');'" style="margin-left: 3px;">编辑</botton>
			</td>
			<td style="width: 100px;">
				<botton class="layui-btn layui-btn-sm"
					:onclick="'editItem(\'' + item.id + '\', \''+item.url+'\');'" style="margin-left: 3px;">编辑</botton>
				<botton class="layui-btn layui-btn-sm"
					:onclick="'deleteItem(\'' + item.id + '\', \'' + item.url + '\');'" style="margin-left: 3px;">删除</botton>
			</td>
		</tr>
	</tbody>
</table>
<!-- 通用分页跳转 -->
<jsp:include page="/wm/common/page.jsp"></jsp:include>

<div style="padding: 20px;color: gray;">
	<div><b>提示</b>:</div>
	<div><b>源站</b> &nbsp;：你当前的网站，你已经做好的网站，也就是你要进行翻译的来源网站。</div>
	<div><b>源站语种</b> &nbsp;：你当前的网站的语种。当前只支持 简体中文、英文 两种！</div>
	<div><b>翻译语种</b> &nbsp;：比如你添加了一个中文的源站，然后你可以在创建一个英文的、并且指定英文绑定的域名是什么。当你访问这个的英文二级域名时，所出现的页面便是被翻译为英文的网页了。注意，您需要将域名进行解析才能访问到</div>
	<div><b>翻译控制</b> &nbsp;：对源站进行翻译时，可以通过此自定义翻译程度，比如那些标签或者class不被翻译、自定义翻译术语等；另外也可对翻译中的网页进行一些修改，具体想修改哪些，可以用javascript脚本非常方便的进行扩展。</div>
	
</div>

<script type="text/javascript">

// 刚进入这个页面，加载第一页的数据
wm.list(1, '/translate/mirrorimage/translateSite/list.json');

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
		content: '/translate/mirrorimage/translateSite/edit.jsp?id=' + id
	});
}

/**
 * 查看记录详情
 * @param {Object} id 要查看的记录的id
 * @param {Object} name 要查看记录的名称
 */
function detailsItem(id, name) {
	layer.open({
		type: 2, 
		title: '详情&nbsp;【' + name + '】', 
		area: ['450px', '460px'],
		shadeClose: true, // 开启遮罩关闭
		content: '/translate/mirrorimage/translateSite/details.jsp?id=' + id
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
		$.post('/translate/mirrorimage/translateSite/delete.json?id=' + id, function(data) {
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

/**
 * 编辑站点设置
 * @param {Object} id 要编辑的记录的id，为0代表添加
 * @param {Object} name 要编辑的记录的名称
 */
function editSiteSet(id, name) {
	layer.open({
		type: 2, 
		title: '编辑【' + name + '】站点详细设置', 
		area: ['750px', '660px'],
		shadeClose: false, // 关闭遮罩关闭
		content: '/translate/mirrorimage/translateSiteSet/edit.jsp?id=' + id
	});
}

/**
 * 域名管理
 * @param {Object} id 要编辑的记录的id，为0代表添加
 * @param {Object} name 要编辑的记录的名称
 */
function siteDomainList(id, name) {
	window.location.href = '/translate/mirrorimage/translateSite/detail.jsp?siteid=' + id;
	/* 
	layer.open({
		type: 2, 
		title: '【源网站：' + name + '】 翻译语种 - 域名管理', 
		area: ['100%', '100%'],
		shadeClose: false, // 禁止遮罩关闭
		//content: '/translate/mirrorimage/translateSiteDomain/list.jsp?siteid=' + id
		content: '/translate/mirrorimage/translateSite/detail.jsp?siteid=' + id
	});
	*/
}

 
function showSourceUrl(){
	msg.popups({
		text:'你当前的网站，你已经做好的网站，也就是你要进行翻译的来源网站。',
		width:'360px'
	});
} 
</script>

<jsp:include page="/wm/common/foot.jsp"></jsp:include>