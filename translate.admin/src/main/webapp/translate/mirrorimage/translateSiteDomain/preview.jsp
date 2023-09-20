<%@page import="com.xnx3.j2ee.Global"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.xnx3.com/java_xnx3/xnx3_tld" prefix="x"%>
<jsp:include page="/wm/common/head.jsp">
	<jsp:param name="title" value="翻译预览" />
</jsp:include>
<script>
msg.loading('自动翻译中...<br/>注意，翻译过程会比较慢，您可能会等待半分钟');
</script>
<style>
body{
    overflow: hidden;
}
iframe{
	width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
}
</style>

<iframe src="preview.do?domainid=<%=request.getParameter("domainid") %>&path=<%=request.getParameter("path") %>" style="width:100%; height:100%;" onload="msg.close();" frameborder="0"></iframe>

<jsp:include page="/wm/common/foot.jsp"></jsp:include>