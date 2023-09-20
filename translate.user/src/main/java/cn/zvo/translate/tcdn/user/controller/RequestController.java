package cn.zvo.translate.tcdn.user.controller;

import java.io.IOException;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnx3.BaseVO;
import com.xnx3.DateUtil;
import com.xnx3.Log;
import com.xnx3.j2ee.controller.BaseController;
import com.xnx3.j2ee.service.SqlCacheService;
import com.xnx3.j2ee.service.SqlService;
import com.xnx3.j2ee.util.ConsoleUtil;
import com.xnx3.j2ee.util.SpringUtil;

import cn.zvo.http.Http;
import cn.zvo.http.Response;
import cn.zvo.translate.tcdn.core.entity.TranslateSite;
import cn.zvo.translate.tcdn.core.entity.TranslateSiteSet;
import cn.zvo.translate.tcdn.core.util.HtmlCacheUtil;
import cn.zvo.translate.tcdn.core.util.TranslateApiRequestUtil;
import cn.zvo.translate.tcdn.user.util.DomainUtil;
import cn.zvo.translate.tcdn.user.vo.SiteVO;

/**
 * html翻译能力
 * @author 管雷鸣
 */
@Controller(value = "TranslateTcdnRequest")
@RequestMapping("/")
public class RequestController extends BaseController{
	@Resource
	private SqlService sqlService;
	@Resource
	private SqlCacheService sqlCacheService;
	
	static TranslateApiRequestUtil translateApiRequestUtil;
	static {
		translateApiRequestUtil = new TranslateApiRequestUtil();
	}
	
	//translate.js 的源码
	static String translatejs = null;
	/**
	 * 加载 translate.js
	 * @throws IOException
	 */
	@ResponseBody
	@RequestMapping(value="translate.js")
	public String translatejs(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setHeader("Content-Type", "text/javascript");
		if(translatejs == null){
			Response res = new Http().get("http://res.zvo.cn/translate/translate.js");
			if (res.getCode() == 200) {
				translatejs = res.getContent();
			}
		}
		return translatejs;
	}
	
	/**
	 * 接收所有请求
	 * @throws InterruptedException
	 * @throws IOException
	 */
	@RequestMapping(value="**")
	@ResponseBody
	public String all(HttpServletRequest request, HttpServletResponse response, Model model) throws IOException{
		//找到源站
		SiteVO vo = DomainUtil.getSite(request);
		ConsoleUtil.debug("site:"+vo.toString());
		if(vo.getResult() - SiteVO.FAILURE == 0) {
			return vo.getInfo();
		}
		TranslateSite site = SpringUtil.getSqlService().findById(TranslateSite.class, vo.getTranslateSiteDomain().getSiteid());
		if(site == null) {
			return "源站点未发现";
		}
		
		//网站本身的语种
		String localLanguage = site.getLanguage();
		//当前访问的域名要以什么语种显示出来
		String targetLanguage = vo.getTranslateSiteDomain().getLanguage();
		
		String sourceDomain = site.getUrl(); //源站点，格式如 "http://www.zbyjzb.com"
		String newDomain = vo.getDomain();
		
		Log.info("当前访问域名："+newDomain+", 源站："+sourceDomain+", 将 "+localLanguage+"转为"+targetLanguage);
		
		
		//如果是静态资源，不作处理，进行重定向操作
		String staticUrl = request.getRequestURI();
		if(TranslateApiRequestUtil.isStaticFile(staticUrl)) {
			response.sendRedirect(TranslateApiRequestUtil.targetUrl(sourceDomain, request));
			return "redirect";
		}
		
		
		
//		ConsoleUtil.info("uri: "+request.getServletPath());
//		ConsoleUtil.info("request.getRequestURI():"+request.getRequestURI());
//		请求的路径,比如 http://192.168.31.193/ab/b.html?a=3 那么这里便是 /ab/b.html
		String requestPath = request.getServletPath(); 
//		ConsoleUtil.info("requestPath:"+requestPath);
		if(request.getQueryString() != null && request.getQueryString().length() > 0) {
			requestPath = requestPath + "?" + request.getQueryString();
		}
		ConsoleUtil.info("requestPath:"+requestPath);
		
		String html;
		long startTime = DateUtil.timeForUnix13();
		
		html = HtmlCacheUtil.get(sourceDomain, targetLanguage, requestPath);
		
		//获取站点设置相关
		TranslateSiteSet siteSet = sqlService.findById(TranslateSiteSet.class, site.getId());
		if(siteSet == null) {
			siteSet = new TranslateSiteSet();
		}
		
		if(html == null) {

			//Log.info("target url : "+TranslateUtil.targetUrl(sourceDomain, request));
//			String staticUrl = request.getRequestURI();
//			Log.info("staticUrl："+staticUrl);
			
			//如果是静态资源，不作处理，直接返回
			//在当前应该还没有
//			if(TranslateUtil.isStaticFile(staticUrl)) {
//				return redirect(TranslateUtil.targetUrl(sourceDomain, request));
//			}
			
			BaseVO tvo = TranslateApiRequestUtil.trans(sourceDomain, newDomain, "", "true",targetLanguage, siteSet.getExecuteJs(), request);
			if(tvo.getResult() - BaseVO.FAILURE == 0) {
				//出错
				response.setStatus(500);
				return tvo.getInfo();
			}
			
			/*** 正常 ***/
			html = tvo.getInfo();
			
			//加入文件缓存
			HtmlCacheUtil.set(sourceDomain, targetLanguage, requestPath, html);
			
		}else {
			Log.info("从文件缓存中取出返回 - "+newDomain+""+requestPath);
			//return html;
		}
		
		long endTime = DateUtil.timeForUnix13();
		Log.info("time : "+(endTime-startTime)+"mm");
		
		//增加 htmlAppendJs
		if(siteSet.getHtmlAppendJs().length() > 0) {
			html = html + siteSet.getHtmlAppendJs();
		}
		return html;
	}
}
