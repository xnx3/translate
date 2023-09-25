<%@page import="com.xnx3.wangmarket.Authorization"%>
<%@page import="com.xnx3.j2ee.Global"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://www.xnx3.com/java_xnx3/xnx3_tld" prefix="x" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<jsp:include page="/wm/common/head.jsp">
	<jsp:param name="title" value="免费开通"/>
</jsp:include>
<script src="<%=Global.get("STATIC_RESOURCE_PATH") %>js/admin/commonedit.js?v=<%=Global.VERSION %>"></script>

<link rel="stylesheet" href="<%=Global.get("STATIC_RESOURCE_PATH") %>plugin/login/css/style.css" type="text/css" media="all" />
<link rel="stylesheet" href="<%=Global.get("STATIC_RESOURCE_PATH") %>plugin/login/css/font-awesome.min.css" type="text/css" media="all">

<style>
	#block{overflow: hidden}
	.codeBox{
		display: flex;
		align-items: center;
		justify-content: center;
		background: #ff6d00;
		color: #fff !important;
	}
	.workinghny-form-grid{
		top: 11%;
	}
	@media (max-width: 568px){
		.workinghny-form-grid {
			top: 5%;
		}
	}
	@media (max-width: 800px){
		.workinghny-form-grid {
			top: 8%;
		}
	}


</style>
<%--新的手机号开通页面--%>

<div id="block" class="w3lvide-content" data-vide-bg="${STATIC_RESOURCE_PATH}plugin/login/images/freelan" data-vide-options="position: 0% 50%">
	<!-- /form -->
	<div class="workinghny-form-grid">
		<div class="main-hotair">
			<div class="content-wthree">
				<h1><span style="
					font-family: 'Pacifico', cursive;
					font-size: 3rem;
					color: #fff;
					letter-spacing: 5px;
					text-align: center;
				">免费开通</span></h1>
				<form action="#" method="post" action="/plugin/phoneReg/create.json">
					<input type="text" class="text" name="username" placeholder="请输入用户名" required="" autofocus>
					<input type="password" class="password" name="password" placeholder="请输入您的密码" required="" autofocus>
					<input type="text" class="text" id="phone" name="phone" placeholder="请输入您的手机号" required="" autofocus>
					<div style="position: relative">
						<input type="text" class="text" name="code" placeholder="右侧获取手机验证码"  required  lay-verify="required" autocomplete="off" style="display: block">
						<div class="layui-word-aux codeBox" onclick="getPhoneCode();" style="cursor: pointer">获取验证码</div>
					</div>
					<button class="btn" type="submit" lay-submit lay-filter="formDemo" href="javascript:;">免费开通</button>
				</form>
				<p class="continue"><span><a href="/login.do" style="color: #fff !important;">如有账号？去登陆</a></span></p>
			</div>
		</div>
	</div>
</div>

<%--新的手机号开通页面end--%>

<script src="<%=Global.get("STATIC_RESOURCE_PATH") %>plugin/login/js/jquery.min.js"></script>
<!-- //js -->
<script>
	var STATIC_RESOURCE_PATH = '<%=Global.get("STATIC_RESOURCE_PATH") %>';
</script>
<script src="<%=Global.get("STATIC_RESOURCE_PATH") %>plugin/login/js/jquery.vide.js"></script>

<script>
//Demo
layui.use('form', function(){
  var form = layui.form;
  
  //监听提交
  form.on('submit(formDemo)', function(data){
	msg.loading('开通中');
    var d=$("form").serialize();
	$.post("/plugin/phoneReg/create.json", d, function (result) { 
		msg.close();
       	var obj = JSON.parse(result);
       	if(obj.result == '1'){
       		wm.token.set(obj.info);
       		msg.success('创建成功', function(){
       			window.location.href='/login.do';
       		});
       	}else if(obj.result == '0'){
       		msg.failure(obj.info);
       	}else{
       		msg.failure('操作失败');
       	}
	}, "text");
    return false;
  });
});

//重新加载验证码
function reloadCode(){
var code=document.getElementById('imgCodeImage');
//这里必须加入随机数不然地址相同我发重新加载
code.setAttribute('src','/captcha.do?'+Math.random());
}

//获取手机验证码
function getPhoneCode(){
	//判断手机号是否是11位
	if(document.getElementById('phone').value.length!=11){
		layer.tips('请输入您的11位手机号', '#phone', {
		  tips: [1, '#3595CC'],
		  time: 3000
		});
		return;
	}
	
	msg.loading('发送中');
	$.post("/plugin/phoneReg/sendPhoneRegCode.json?&phone="+document.getElementById('phone').value, function(data){
		msg.close();
		if(data.result == '1'){
			layer.closeAll();
			msg.success('已发送');
	 	}else if(data.result == '0'){
	 		msg.failure(data.info);
	 	}else{
	 		msg.failure('操作失败');
	 	}
	});
	
	if(true){
		return;
	}
	
}


//右侧弹出提示
function rightTip(){
	layer.open({
	  title: '问题反馈',offset: 'rb', shadeClose:true, shade:0
	  ,content: '您有什么不懂的，或者自助开通时，遇到什么问题导致您无法操作、不知如何进行，或者无法开通，任何问题都可反馈给我们，反馈QQ群181781514。也可以关注我们微信公众号"wangmarket"随时接收最新消息通知'
	});
}
setTimeout("rightTip()",2000);
</script>


<jsp:include page="/wm/common/foot.jsp"></jsp:include>