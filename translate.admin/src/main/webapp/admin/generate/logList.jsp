<%@page import="com.xnx3.j2ee.Global"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.xnx3.com/java_xnx3/xnx3_tld" prefix="x"%>
<jsp:include page="/wm/common/head.jsp">
	<jsp:param name="title" value="日志列表" />
</jsp:include>

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

<a class="layui-btn" href="javascript:wm.list(1);" style="margin-left: 15px;">搜索</a>

<a href="javascript:editItem(0, '');" class="layui-btn layui-btn-normal" style="float: right; margin-right: 10px;">添加</a>
</form>

<table class="layui-table iw_table">
	<thead>
		<tr>
		    <!-- [tag-6] -->
			<!-- <th>主键</th> -->
			<th>任务编号</th>
			<!-- <th>site.id</th> -->
			<th>domain.id</th>
			<!-- <th>源站语种</th> -->
			<th>翻译为</th>
			<th>翻译页面</th>
			<th>时间</th>
			<th>执行结果</th>
		</tr>
	</thead>
	<tbody>
		<tr v-for="item in list" id="list">
		    <!-- [tag-7] -->
		    <td>{{item.taskid}}</td>
			<!-- <td>{{item.siteid}}</td> -->
			<td>{{item.domainid}}</td>
			<!-- <td>{{item.local_language}}</td> -->
			<td>{{item.target_language}}</td>
			<td>{{item.page_path}}</td>
			<td>{{formatTime(item.time,'M-D h:m:s')}}</td>
			<td>{{item.result}}({{item.attempts_number}})</td>
		</tr>
	</tbody>
</table>
<!-- 通用分页跳转 -->
<jsp:include page="/wm/common/page.jsp"></jsp:include>

<div style="padding: 20px;color: gray;">
	<div><b>提示</b>:</div>
	<div><b>任务编号</b> &nbsp;：翻译任务的编号，比如对网站提交翻译任务时，便会创建任务唯一编号。这个任务内进行翻译的页面，都会记录上这个任务编号</div>
	<div><b>执行结果</b> &nbsp;：某个页面执行翻译的结果。 成功为 SUCCESS，失败为 FAILURE。 如果翻译失败，会自动进行重试，最多尝试三次，如果三次都不成功，则记录下失败原因。 其中 SUCCESS(1) 、 FAILURE(1) 括号中的数字便是当前是第几次翻译</div>
	
</div>

<script type="text/javascript">

// 刚进入这个页面，加载第一页的数据
wm.list(1, '/translate/generate/log.json?siteid=<%=request.getParameter("siteid") %>');

</script>

<jsp:include page="/wm/common/foot.jsp"></jsp:include>