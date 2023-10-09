<%@page import="com.xnx3.j2ee.Global"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.xnx3.com/java_xnx3/xnx3_tld" prefix="x"%>
<jsp:include page="/wm/common/head.jsp">
	<jsp:param name="title" value="详情-也就是点开某个网站进入的更多设置页面" />
</jsp:include>
<script src="https://res.zvo.cn/from.js/from.js"></script> <!-- 表单信息自动填充、获取 https://gitee.com/mail_osc/from.js  -->
<script src="/<%=Global.CACHE_FILE %>Site_language.js"></script>
<script>
//获取源站id
var siteid = getUrlParams('siteid');
</script>

<!-- 顶部导航 - start -->
<div>
	<fieldset class="layui-elem-field layui-field-title" style="margin-top: 30px;">
		<legend><a href="/translate/mirrorimage/translateSite/list.jsp">源站管理</a><span class="siteurl" style="margin-left: 5px"> loading...</span></legend>
	</fieldset>
</div>
<!-- 顶部导航 - end -->

<!-- 源站本身相关 - start -->
<style>
	.flex-sb{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.layui-card {
		position: relative;
		border-width: 1px;
		border-style: solid;
		border-radius: 2px;
		box-shadow: 1px 1px 4px rgb(0 0 0 / 8%);
		background-color: #fff;
		color: #5f5f5f;
		border-color: #eee;
		width: 98%;
		margin: 0 auto 10px;
	}
	.layui-col-md3 {
		width:30%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.layui-form-label{
		display: inline-block;
	}
	#site input{ border-style: hidden; }
</style>
<div class="layui-card" id="site">
	<div class="layui-card-header flex-sb">
		<div id="sourceSite_title">
			<h3>
				源站信息
			</h3>
		</div>
		<div><botton class="layui-btn layui-btn-sm" onclick="editSourceSite();" style="margin-left: 3px;">编辑</botton></div>
	</div>
	<div class="layui-card-body">
		<div class="layui-row flex-sb">
			<div class="layui-col-md3">
				<label class="layui-form-label">源站id:</label>
				<input type="text" value="加载中..." readonly class="layui-input" name="id" />
			</div>
			<div class="layui-col-md3">
				<label class="layui-form-label" id="sourceSite_url_label">网址:</label>
				<input type="text" value="加载中..." readonly class="layui-input" name="url" />
			</div>
			<div class="layui-col-md3">
				<label class="layui-form-label" id="sourceSite_language_label">语言:</label>
				<input type="text" value="加载中..." readonly class="layui-input" name="language" />
			</div>
		</div>
	</div>
</div>
<script>
var site; //源站信息
/**
 * 加载源站数据
 */
function loadSiteData() {
	//msg.loading("加载中");
	wm.post("/translate/mirrorimage/translateSite/details.json", {id : siteid}, function(data) {
		//msg.close();
		if (data.result == '1') {
			site = data.translateSite;
			// 将接口获取到的数据自动填充到 div 中的输入框中
			from.fill('site',data.translateSite);
		} else if (data.result == '0') {
			msg.failure(data.info);
		} else {
			msg.failure(result);
		}
	}, "text");
}
loadSiteData();

/**
 * 编辑源站信息
 */
function editSourceSite() {
	layer.open({
		type: 2, 
		title: '编辑源站信息', 
		area: ['450px', '460px'],
		shadeClose: true, // 开启遮罩关闭
		content: '/translate/mirrorimage/translateSite/edit.jsp?id=' + siteid
	});
}
//显示帮助
msg.tip({
	id:'sourceSite_title',
	text:'你当前的网站，你已经做好的网站，也就是你要进行翻译的来源网站。'
});
msg.tip({
	id:'sourceSite_url_label',
	text:'源站url。注意格式，要带上协议，域名后面不要带 / <br/>强烈推荐填写http协议的网址，如果是https协议的，可能会因为证书配置异常问题导致无法翻译'
});
msg.tip({
	id:'sourceSite_language_label',
	text:'源站的语种。当前网站是什么语种的。注意，这里暂时只支持中文、英文 两种语种的网站。'
});

</script>
<!-- 源站本身相关 - end -->

<!-- 翻译控制 - start -->
<div class="layui-card" id="site">
	<div class="layui-card-header flex-sb">
		<div id="translateSiteSet_title">
			<h3>
				翻译控制
			</h3>
		</div>
		<div>
			<botton class="layui-btn layui-btn-sm" onclick="editSiteSet();">编辑</botton>
		</div>
	</div>
	<div class="layui-card-body">
		<div id="translateSiteSet-executeJs-label">
			执行的JavaScript：
		</div>
		<div>
			<pre class="layui-code" id="translateSiteSet-executeJs">
			加载中...
			</pre>
		</div>
		<div id="translateSiteSet-htmlAppendJs-label">
			执行的JavaScript：
		</div>
		<div>
			<pre class="layui-code" id="translateSiteSet-htmlAppendJs">
			加载中...
			</pre>
		</div>
	</div>
</div>
<script>
/**
 * 加载数据
 */
function loadSiteSetData() {
	wm.post("/translate/mirrorimage/translateSiteSet/details.json", {id : siteid}, function(data) {
		if (data.result == '1') {
			// 将接口获取到的数据自动填充到 form 表单中
			
			document.getElementById('translateSiteSet-executeJs').innerHTML = data.translateSiteSet.executeJs;
			document.getElementById('translateSiteSet-htmlAppendJs').innerHTML = data.translateSiteSet.htmlAppendJs;
		} else if (data.result == '0') {
			msg.failure(data.info);
		} else {
			msg.failure(result);
		}
	}, "text");
}
loadSiteSetData();

/**
 * 编辑翻译控制
 */
function editSiteSet() {
	layer.open({
		type: 2, 
		title: '翻译控制', 
		area: ['750px', '660px'],
		shadeClose: false, // 关闭遮罩关闭
		content: '/translate/mirrorimage/translateSiteSet/edit.jsp?id=' + siteid
	});
}

//帮助
msg.tip({
	id:'translateSiteSet_title',
	text:'对源站进行翻译时，可以通过此自定义翻译程度，比如那些标签或者class不被翻译、自定义翻译术语等；另外也可对翻译中的网页进行一些修改，具体想修改哪些，可以用javascript脚本非常方便的进行扩展。'
});
msg.tip({
	id:'translateSiteSet-executeJs-label',
	direction:'bottom',
	width:'450px',
	text:'翻译前执行的JavaScript代码。这个只是在翻译的过程中进行执行，它会在整个网页已经打开、translate.js 都已经正常加载完毕后，执行这里设置的js，在之后会再执行 translate.execute() 进行翻译。像是自定义图片了、自定义术语库了、又或者用js操作某个网页增加个div、删除个什么原本网页中的元素了，也都可以在这里加。<br/>比如翻译时，网页其中id为abc的元素不进行翻译，那么这里可以填入:<br/><pre class="layui-code">translate.ignore.id.push(\'abc\');</pre>'
});
msg.tip({
	id:'translateSiteSet-htmlAppendJs-label',
	direction:'bottom',
	text:'翻译完成后，在翻译后的html页面中追加的代码。 这个会在翻译后的html最末尾追加，也就是在 </html> 之后追加。比如你可以追加js脚本、css样式等等。'
});
</script>
<!-- 翻译控制 - end -->


<!-- 翻译队列排队情况 - start -->
<div class="layui-card" id="site">
	<div class="layui-card-header flex-sb">
		<div id="waitingProgress_title">
			<h3>
				翻译任务排队情况
			</h3>
		</div>
	</div>
	<div class="layui-card-body">
		<div id="waitingProgress"></div>
	</div>
</div>
<%--<h2>翻译任务排队情况</h2>--%>
<%--<div id="waitingProgress"></div>--%>
<script>
/**
 * 加载数据
 */
function loadWaitingProgressData() {
	wm.post("/translate/generate/waitingProgress.json", {siteid : siteid}, function(data) {
		if (data.result == '1') {
			// 将接口获取到的数据自动填充到 form 表单中
			
			var html = '';
			if(data.allnumber < 1){
				html = '当前没有排队中的执行任务。';
			}else{
				html = '当前有'+data.allnumber+'个网站任务正在排队执行。';
			}
			
			if(data.rank < 0){
				html = html+'其中尚未有您的任务';
			}else if(data.rank - 0 == 0){
				html = html + '您的任务正在被执行中';
			}else{
				html = html+'前面还有'+data.rank+'个网站任务，执行完前面的就到您了';
			}
			document.getElementById('waitingProgress').innerHTML = html;
		} else if (data.result == '0') {
			msg.failure(data.info);
		} else {
			msg.failure(result);
		}
	}, "text");
}
loadWaitingProgressData();

//帮助
msg.tip({
	id:'waitingProgress_title',
	width:'300px',
	text:'翻译任务的排队情况。<br/>整个系统中，所有需要进行翻译的任务都会按照提交任务的先后顺序进行翻译。如果同一时间有多个任务提交，那会进入排队状态，先提交的任务先执行，执行完毕后再由下一个任务执行。<br/>需要注意的是，如果您提交了一个任务，此任务在排队，那您将无法继续提交翻译任务！除非您的翻译任务执行完了，才能继续提交新的翻译任务。'
});
</script>
<!-- 翻译队列排队情况 - end -->


<!-- 翻译语种 - start -->
<style>
#page{ display:none; }
.toubu_xnx3_search_form{ display:none; }
</style>
<div class="layui-card" id="site">
	<div class="layui-card-header flex-sb">
		<div id="domain_title">
			<h3>
				翻译语种
			</h3>
		</div>
		<div><botton class="layui-btn layui-btn-sm" onclick="javascript:editItem(0, '');">添加</botton></div>
	</div>
	<div class="layui-card-body">
		<%--<h2>翻译语种</h2>--%>
		<%--<a href="javascript:editItem(0, '');" class="layui-btn layui-btn-normal" style="float: right; margin-right: 10px;">添加</a>--%>

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
		</form>
		<table class="layui-table iw_table">
			<thead>
				<tr>
					<th>编号</th>
					<th>翻译语种</th>
					<th id="domain_table_fangwen">访问域名</th>
					<th id="domain_table_preview">调试预览</th>
					<th id="domain_table_set" style="text-align: center" width="220">设置</th>
					<th style="text-align: center" id="domain_table_caozuo" width="100">操作</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item in list" id="list">
					<td>{{item.id}}</td>
					<td>{{language[item.language]}} ({{item.language}})</td>
					<td>{{item.domain}}</td>
					<td>
						<span class="siteurl">loading...</span>
						<input type="text" style="border-style: inherit; width: 80px;" value="/" :id="'tiaoshiyulan_path_'+item.id" title="您可在次填写调试预览的网页，比如填写 / 那会直接访问首页，填写比如 /a.html 、 /a/b/123.html" />
						<botton class="layui-btn layui-btn-sm"
								:onclick="'preview(\''+item.id+'\');'" style="margin-left: 3px;">调试预览</botton>
					</td>
					<td style="text-align: center">
						<botton class="layui-btn layui-btn-sm"
								:onclick="'fileuploadConfig(\''+item.id+'\', \''+language[item.language]+'\');'" style="margin-left: 3px;">存储设置</botton>
						<botton class="layui-btn layui-btn-sm"
								:onclick="'generate(\''+item.id+'\', \''+language[item.language]+'\');'" style="margin-left: 3px;">执行翻译</botton>
						<a class="layui-btn layui-btn-sm"
						   :href="'/admin/generate/logList.jsp?siteid='+item.siteid" target="_black" style="margin-left: 3px;">查看日志</a>
					</td>
					<td style="text-align: center">
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
	</div>
</div>
<!-- 设置的说明 -->
<div style="display:none" id="domain_table_set_text">
	<div><b>存储设置</b>：配置这个语种翻译之后的网页，是要存储在什么地方。比如，翻译的语种是日本，您可以在华为云OBS开通一个日本的OBS云存储，配置上，然后将日本这个语种的访问域名绑定到华为云OBS，如此当日本的用户访问时，访问到的是本国的存储节点，达到秒开。
		<br/>
		存储方式支持SFTP、FTP、华为云OBS、阿里云OSS、七牛云Kodo……多种存储方式，您可以选择您最熟悉的存储方式配置上。 
		<br/>
		（存储能力有开源项目 https://gitee.com/mail_osc/FileUpload 提供支持）
	</div>
	<br/>
	<div><b>执行翻译</b>：
		进行翻译，执行翻译，将原本网站翻译为指定语种，并存储到上面您自己设置的存储位置进行存储。
		<br/>
		【注意】
		<br/>1. 执行翻译时，会自动读取您源站根路径下的 sitemap.xml 文件，根据此文件中存在的页面进行翻译。 如果您源站没有 sitemap.xml 文件，则只是会翻译首页提供效果测试
		<br/>2. 当前因使用人数众多，所以增加了一个限制，sitemap.xml 中不超过100个页面，才会进行翻译，如果超过了100个页面了，需要与我们联系后才能放开限制，以防止有人故意提交页面非常多的网站，占用计算资源，导致其他人排队等待会非常漫长。
		<br/>2. 点击执行后，会创建一个翻译任务，翻译任务并不会立即执行，而是进入排队期，前面排队的任务（包括别人的）都执行完后才会执行您此次的翻译任务。您可以通过“查看日志”来时时查看任务执行情况
	</div>
	<br/>
	<div><b>查看日志</b>：
		执行翻译任务后，每翻译一个页面，都会将翻译的页面进行写日志。您可以通过此处日志记录，来查看翻译的执行情况。
	</div>
</div>
<script src="/fileupload-config.js"></script>
<script type="text/javascript">
// 刚进入这个页面，加载第一页的数据
wm.list(1, '/translate/mirrorimage/translateSiteDomain/list.json', function(){
	setTimeout(function(){
		var elements = document.getElementsByClassName("siteurl");
		for (var i = 0; i < elements.length; i++) {
		  elements[i].textContent = site.url;
		}
	}, 500);
});

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

/**
 * 调试预览
 * @param id domain.id
 */
function preview(id) {
	var path = document.getElementById('tiaoshiyulan_path_'+id).value;
	if(path.length == ''){
		path = '/';
	}
	window.open('/translate/mirrorimage/translateSiteDomain/preview.jsp?domainid='+id+'&path='+path);
}

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
  * 根据id,生成这个站点的html  - 提交翻译任务
  * @param {Object} id 要删除的记录id
  * @param {Object} name 要删除的记录的名称
  */
 function generate(id, name) {
 	msg.confirm('是否生成【' + name + '】的翻译html？ 翻译后的html文件会推送到您指定的存储', function() {
 		// 显示“删除中”的等待提示
 		msg.loading("提交中");
 		$.post('/translate/generate/generate.json?domainid=' + id, function(data) {
 			// 关闭“删除中”的等待提示
 			msg.close();
 			msg.close();
 			if(data.result == '1') {
 				msg.alert(data.info);
 				// 刷新当前页
 				//window.location.reload();
 			} else if(data.result == '0') {
 				msg.alert(data.info);
 			} else { 
 				msg.failure();
 			}
 		});
 	}, function() {
 		
 	});
 }
  
//帮助
msg.tip({
	id:'domain_title',
	width:'400px',
	text:'比如你添加了一个中文的源站，然后你可以在此创建一个英文的翻译语种配置、并且指定英文语种翻译好后访问的域名（或路径）是什么。当你访问这个英文访问域名时，所出现的页面便是被翻译为英文的网页了（如果查看其网页源代码，会发现源代码中就已经是英文的）'
});
msg.tip({
	id:'domain_table_preview',
	width:'400px',
	direction:'top',
	text:'对某个页面进行翻译预览。它的作用是进行精细的调控，比如翻译之后的页面感觉某个地方不合适，或者某个图片没翻译好，可以通过此来进行调试，因为它可以针对某一个具体的页面进行调试预览，速度会很快，十来秒就能取得翻译的结果，而不需要生成整个网站后在取查看某个页面的翻译结果。<br/>当这个调试的页面感觉翻译没问题后，您就可以放心的对整站进行翻译了。<br/>可以这么理解，您再生成整站前，可以将您网站的某些页面在这里调试预览，提前试一下，看是否有要进行调整的'
});
msg.tip({
	id:'domain_table_set',
	width:'380px',
	direction:'top',
	text:document.getElementById('domain_table_set_text').innerHTML
});
msg.tip({
	id:'domain_table_fangwen',
	width:'320px',
	direction:'top',
	text:'生成这个翻译的新网站后，访问的域名（或路径）填写如：<br/>english.xxxxxx.com<br/>www.xxxxx.com/english/<br/>这里建议采用第一种，域名的方式。如果是采用第二种路径的方式，那么通过存储方式推送时，你应该考虑好要推送到哪里去才能被访问到<br/>这里如果你不好理解，你都可以填写个 123 都可以，都可以正常进行翻译。'
});
</script>
<!-- 翻译语种 - end -->



<jsp:include page="/wm/common/foot.jsp"></jsp:include>