package cn.zvo.translate.tcdn.user.util;

import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;

import com.xnx3.j2ee.util.SpringUtil;

import cn.zvo.translate.tcdn.core.entity.TranslateSiteDomain;
import cn.zvo.translate.tcdn.user.vo.SiteVO;

/**
 * 域名相关
 * @author 管雷鸣
 *
 */
public class DomainUtil {
	/*
	 * 使用绑定后的域名访问，这里只有绑定域名后才会加入此处,持久缓存
	 * key:访问域名，如 english.leimingyun.com
	 * value: siteVO
	 */
//	public static Map<String, SiteVO> domainMap = new HashMap<String, SiteVO>();
	
	/**
	 * 获取当前用户访问的域名对应的站点
	 * @param request 可get传入 domain 模拟访问的域名。可传入自己绑定的域名，也可传入二级域名。如传入leiwen.wang.market
	 * @return
	 */
	public static SiteVO getSite(HttpServletRequest request){
		//取得要访问的域名
		String serverName = request.getParameter("domain");	//get传入的域名，如 pc.wang.market
		if(serverName == null || serverName.length() == 0){
			//get没传入，那么取当前访问的url的域名
			serverName = request.getServerName();	//访问域名，如 pc.wang.market
		}
		
//		SiteVO vo = (SiteVO) request.getSession().getAttribute("translate_site");
		//如果session缓存中有，直接将session的返回
//		if(vo != null) {
//			return vo;
//		}
		
		/****** session中没有，那么从map中读取 ******/
		SiteVO vo = new SiteVO();
		vo.setDomain(serverName);
		
		//内部调试使用，本地
//		if(serverName.equals("localhost") || serverName.equals("127.0.0.1")){
//			//如果session缓存中有，直接将session的返回
//			if(vo != null) {
//				vo.setBySession(true);
//			}else {
//				vo = new SiteVO();
//				vo.setBaseVO(SiteVO.FAILURE, "网站没发现，过会在来看看吧");	//默认是没找到
//			}
//			return vo;
//			
//		}else{
			//正常使用，从域名缓存中找到对应的网站
			
			//如果没有使用二级域名、或者是二级域名，但在二级域名里面，没找到，那么就从自己绑定的域名里面找
//			vo = domainMap.get(serverName);
			//TranslateSiteDomain domain = SpringUtil.getSqlCacheService().findAloneByProperty(TranslateSiteDomain.class, "domain", serverName);
			TranslateSiteDomain domain = SpringUtil.getSqlService().findAloneByProperty(TranslateSiteDomain.class, "domain", serverName);
			if(domain == null) {
				vo.setBaseVO(SiteVO.FAILURE, "访问的域名未发现");
				return vo;
			}
			
			vo = new SiteVO();
			vo.setDomain(serverName);
			vo.setTranslateSiteDomain(domain);
//		}
		
		if(vo == null){
			vo.setBaseVO(SiteVO.FAILURE, "网站没发现");
			return vo;
		}
		
		//将获取到的加入Session
		//request.getSession().setAttribute("translate_site", vo);
		return vo;
	}
	
}
