<%@page import="com.xnx3.j2ee.Global"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.xnx3.com/java_xnx3/xnx3_tld" prefix="x"%>
<jsp:include page="/wm/common/head.jsp">
	<jsp:param name="title" value="管理" />
</jsp:include>
<script src="https://res.zvo.cn/from.js/from.js"></script>
<script src="/fileupload-config.js"></script>
<%
String id = request.getParameter("id");
String name = request.getParameter("name");
%>

<hr/>
<div>
	<botton class="layui-btn layui-btn-sm" onclick="preview('<%=id %>', '<%=name %>');" style="margin-left: 3px;">调试预览</botton>
	<div>
		对某个页面进行翻译预览。它的作用是进行精细的调控，比如翻译之后的页面感觉某个地方不合适，或者某个图片没翻译好，可以通过此来进行调试，因为它可以针对某一个具体的页面进行调试预览，速度会很快，十来秒就能取得翻译的结果，而不需要生成整个网站后在取查看某个页面的翻译结果。
		<br/>
		当这个调试的页面感觉翻译没问题后，您就可以放心的对整站进行翻译了
	</div>
</div>

<hr/>
<div>
	<botton class="layui-btn layui-btn-sm" onclick="fileuploadConfig('<%=id %>', '<%=name %>');" style="margin-left: 3px;">存储设置</botton>
	<div>
		配置这个语种翻译之后的网页，是要存储在什么地方。比如，翻译的语种是日本，您可以在华为云OBS开通一个日本的OBS云存储，配置上，然后将日本这个语种的访问域名绑定到华为云OBS，如此当日本的用户访问时，访问到的是本国的存储节点，达到秒开。
		<br/>
		存储方式支持SFTP、FTP、华为云OBS、阿里云OSS、七牛云Kodo……多种存储方式，您可以选择您最熟悉的存储方式配置上。 
		<br/>
		（自定义存储能力扩展有开源项目 <a href="https://gitee.com/mail_osc/FileUpload" target="_black" />FileUpload</a> 提供支持）
	</div>
	
</div>

<hr/>
<div>
	<botton class="layui-btn layui-btn-sm" onclick="generate('<%=id %>', '<%=name %>');" style="margin-left: 3px;">执行翻译</botton>
	<div>
		进行翻译，执行翻译，将原本网站翻译为指定语种，并存储到上面您自己设置的存储位置进行存储。
		<br/>
		【注意，测试阶段，当前只是将首页进行了翻译，如果您感觉整体没问题了，要真正对全站进行翻译，可以喊我，给你放开】
	</div>
</div>

<script>


/**
 * 存储源的配置
 * @param {Object} id domain.id
 * @param {Object} name 名称
 */
function fileuploadConfig(id, name) {

	fileupload.config.quick.use({
		configUrl:'/translate/generate/translateFileuploadConfig/config.json?key='+id,
		submitUrl:"/translate/generate/translateFileuploadConfig/save.json",	//提交保存的url
		key:id
	});
	
}

/**
 * 根据id,生成这个站点的html 
 * @param {Object} id 要删除的记录id
 * @param {Object} name 要删除的记录的名称
 */
function generate(id, name) {
	msg.confirm('是否生成【' + name + '】的翻译html？ 翻译后的html文件会推送到您指定的存储', function() {
		// 显示“删除中”的等待提示
		parent.msg.loading("提交中");
		$.post('/translate/generate/generate.json?domainid=' + id, function(data) {
			// 关闭“删除中”的等待提示
			parent.msg.close();
			if(data.result == '1') {
				parent.msg.success('操作成功');
				// 刷新当前页
				//window.location.reload();
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
 * 预览翻译结果
 * @param {Object} id domain.id
 */
function preview(id) {
	window.open('preview.jsp?domainid='+id);
}
</script>

<jsp:include page="/wm/common/foot.jsp"></jsp:include>