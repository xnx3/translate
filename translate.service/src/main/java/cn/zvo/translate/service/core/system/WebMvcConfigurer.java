package cn.zvo.translate.service.core.system;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;

/**
 * mvc 相关
 * @author 管雷鸣
 */
@Configuration
public class WebMvcConfigurer implements org.springframework.web.servlet.config.annotation.WebMvcConfigurer{
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new ApiInterceptor()).addPathPatterns("/**");
	}
	
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController( "/" ).setViewName("forward:/index.html" );
		registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
	}
}
