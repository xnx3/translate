package cn.zvo.translate.service.core.util;

import javax.servlet.http.HttpServletRequest;

import com.xnx3.UrlUtil;

public class RequestUtil {
	
	/**
	 * 获取 request 中 referer中 的域名
	 * @param request
	 * @return 返回如 www.zvo.cn ，如果未发现，返回 unknow ,这种就是不是在网页中请求的，比如用程序直接调用接口请求的
	 */
	public static String getRefererDomain(HttpServletRequest request) {
		String referer = request.getHeader("referer"); 
		if(referer == null) {
			referer = "";
		}
		//取这个来源网页的domain
		String domain = UrlUtil.getDomain(referer);
		if(domain == null || domain.length() < 1) {
			domain = "unknow";
		}
		return domain;
	}
}
