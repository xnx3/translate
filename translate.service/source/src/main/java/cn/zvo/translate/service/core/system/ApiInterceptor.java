package cn.zvo.translate.service.core.system;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

/**
 * API接口的拦截器
 * @author 管雷鸣
 *
 */
@Component
public class ApiInterceptor implements HandlerInterceptor {

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
//		response.setHeader("Access-Control-Allow-Origin", "*"); //增加跨域支持
//		response.setHeader("Author", "www.guanleiming.com");
		HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		response.setHeader("Access-Control-Allow-Origin", "*"); //增加跨域支持
		response.setHeader("author", "www.guanleiming.com");
		return HandlerInterceptor.super.preHandle(request, response, handler);
	}
	
	
}
