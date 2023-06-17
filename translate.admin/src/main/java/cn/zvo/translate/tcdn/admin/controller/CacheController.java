package cn.zvo.translate.tcdn.admin.controller;

import java.util.Iterator;
import java.util.List;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.xnx3.UrlUtil;
import com.xnx3.j2ee.controller.BaseController;
import com.xnx3.j2ee.service.SqlCacheService;
import com.xnx3.j2ee.service.SqlService;
import com.xnx3.j2ee.util.ActionLogUtil;
import com.xnx3.j2ee.util.ConsoleUtil;
import com.xnx3.j2ee.util.Page;
import com.xnx3.j2ee.util.Sql;
import com.xnx3.j2ee.vo.BaseVO;

import cn.zvo.translate.tcdn.admin.vo.TranslateSiteDomainListVO;
import cn.zvo.translate.tcdn.admin.vo.TranslateSiteDomainVO;
import cn.zvo.translate.tcdn.core.entity.TranslateSite;
import cn.zvo.translate.tcdn.core.entity.TranslateSiteDomain;
import cn.zvo.translate.tcdn.core.util.HtmlCacheUtil;

/**
 * tcdn缓存相关
 * @author 管雷鸣
 */
@Controller(value = "CacheTcdnController")
@RequestMapping("/admin/cache/")
public class CacheController extends BaseController {

	@Resource
	private SqlService sqlService;
	@Resource
	private SqlCacheService sqlCacheService;
	
	
	/**
	 * 清空缓存，通过传入源站域名 sourceDomain 
	 * <p>会将这个源站相关的翻译站点全部清空缓存</p>
	 * @param sourceDomain
	 */
	@ResponseBody
	@RequestMapping(value = "clearBySourceDomain.json", method = {RequestMethod.POST})
	public BaseVO clearBySourceDomain(HttpServletRequest request,
			@RequestParam(value = "sourceDomain", required = false, defaultValue = "") String sourceDomain) {
		if(sourceDomain.length() < 1) {
			return error("请传入清除缓存的源站域名");
		}
		
		//获取源站 - http://
		TranslateSite site = sqlService.findAloneByProperty(TranslateSite.class, "url", "http://"+sourceDomain);
		if(site == null) {
			//获取源站 - https://
			site = sqlService.findAloneByProperty(TranslateSite.class, "url", "https://"+sourceDomain);
			if(site == null) {
				return error("源站["+sourceDomain+"]未找到！请在网站管理中确认是否有此源站的");
			}
		}
		
		//获取这个domain的实体类
		List<TranslateSiteDomain> domainList = sqlService.findByProperty(TranslateSiteDomain.class, "siteid", site.getId());
		if(domainList.size() == 0) {
			return error("源站["+sourceDomain+"]尚未绑定翻译域名，请在网站管理中，找到此源站，给其绑定某翻译语种的域名");
		}
		
		//刷新缓存
		for(int i = 0; i < domainList.size(); i++) {
			HtmlCacheUtil.removeByLanguage(site.getUrl(), domainList.get(i).getLanguage());
		}
		
		ActionLogUtil.insert(request, "清空缓存", "通过源站 "+sourceDomain+" 清空缓存");
		return success();
	}
	

	/**
	 * 清空缓存，通过传入翻译的网站绑定的域名 bindDomain 
	 * <p>会将这个指定语种站点全部清空缓存。比如传入的是 english.zvo.cn ，则将这个英文翻译站缓存清空</p>
	 * @param bindDomain
	 */
	@ResponseBody
	@RequestMapping(value = "clearByBindDomain.json", method = {RequestMethod.POST})
	public BaseVO clearByBindDomain(HttpServletRequest request,
			@RequestParam(value = "bindDomain", required = false, defaultValue = "") String bindDomain) {
		if(bindDomain.length() < 1) {
			return error("请传入清除缓存的目标域名");
		}
		
		//获取这个domain的实体类
		TranslateSiteDomain siteDomain = sqlService.findAloneByProperty(TranslateSiteDomain.class, "domain", bindDomain);
		if(siteDomain == null) {
			return error("域名["+bindDomain+"]未绑定本系统，请在网站管理中，查看其是否绑定到某个网站下的翻译语种");
		}
		
		//获取源站
		TranslateSite site = sqlService.findById(TranslateSite.class, siteDomain.getSiteid());
		if(site == null) {
			return error("域名["+bindDomain+"]未找到源站！请在站点管理中确认是否有源站的翻译语种绑定了此域名");
		}
		
		ConsoleUtil.debug("site:"+site.toString()+", bindDomain："+bindDomain);
		//存在，刷新缓存
		HtmlCacheUtil.removeByLanguage(site.getUrl(), siteDomain.getLanguage());
		
		ActionLogUtil.insert(request, "清空缓存", "通过访问域名 "+bindDomain+" 清空缓存");
		return success();
	}
	

	/**
	 * 清空缓存，通过传入具体的访问网址
	 * <p>会将这个访问网址进行清空缓存。比如传入的是一个英文翻译站的网址 http://english.zvo.cn/a/b/c.html 那么只是将这个网址的缓存清空</p>
	 * @param url 要清空缓存的url，传入如 http://english.zvo.cn/a/b/c.html
	 * 				<p>注意，这个url的域名是要在这里绑定过添加网站的某个语种的</p>
	 */
	@ResponseBody
	@RequestMapping(value = "clearByUrl.json", method = {RequestMethod.POST})
	public BaseVO clearByUrl(HttpServletRequest request,
			@RequestParam(value = "url", required = false, defaultValue = "") String url) {
		if(url.length() < 1) {
			return error("请传入清除缓存的目标URL");
		}
		
		//获取domain
		String domain = UrlUtil.getDomain(url);
		ConsoleUtil.debug("domain:"+domain);
		
		//获取这个domain的实体类
		TranslateSiteDomain siteDomain = sqlService.findAloneByProperty(TranslateSiteDomain.class, "domain", domain);
		if(siteDomain == null) {
			return error("域名["+domain+"]未绑定本系统，请在网站管理中，查看其是否绑定到某个网站下的翻译语种");
		}
		
		//获取源站
		TranslateSite site = sqlService.findById(TranslateSite.class, siteDomain.getSiteid());
		if(site == null) {
			return error("域名["+domain+"]未找到源站！请在站点管理中确认是否有源站的翻译语种绑定了此域名");
		}
		
		String path = UrlUtil.getRequestPath(url);
		ConsoleUtil.log("path:"+path);
		//存在，刷新缓存
		HtmlCacheUtil.removeByUrl(site.getUrl(), siteDomain.getLanguage(), path);
		
		ActionLogUtil.insert(request, "清空缓存", "通过访问URL "+url+" 清空缓存");
		return success();
	}
}