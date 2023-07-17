package com.xnx3.j2ee.system;

import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import com.xnx3.j2ee.pluginManage.interfaces.manage.SpringMVCInterceptorPluginManage;
import com.xnx3.j2ee.util.ConsoleUtil;
import com.xnx3.j2ee.util.SystemUtil;

/**
 * WebMvcConfigurer
 * @author 管雷鸣
 *
 */
@Configuration
public class WebMvcConfigurer_ implements WebMvcConfigurer {
	
	/**
	 * 注册jsp视图解析器
	 * @description: 以viewResolver命名。阻止ContentNegotiatingViewResolver注入I0C容器，可当做jsp视图解析器
	 * 为什么要阻止ContentNegotiatingViewResolver注入呢，因为这个视图解析器的默认order特别小，总放在集合最前面，它会选择最优视图解折器
	 * @return
	 */
	@Bean
	public ViewResolver viewResolver() {
		InternalResourceViewResolver resolver = new InternalResourceViewResolver();
		resolver.setPrefix("/WEB-INF/view/");
		resolver.setSuffix(".jsp");
		//当控制器返回的viewName符合规则时才使用这个视图解析器 如["jsp/*",""]，是个数组（controller 返回的时候可以写成jsp/test）返回的真实视图名就是 prefix +"jsp/test.jsp"
//		resolver.setViewNames("jsp/*");
		resolver.setOrder(1);//设置优先级,数值越小优先级越高
		return resolver;
	}
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		for (int i = 0; i < SpringMVCInterceptorPluginManage.handlerInterceptorList.size(); i++) {
			Map<String, Object> map = SpringMVCInterceptorPluginManage.handlerInterceptorList.get(i);
			HandlerInterceptor handler = (HandlerInterceptor) map.get("class");
			List<String> pathPatterns = (List<String>) map.get("pathPatterns");
			registry.addInterceptor(handler).addPathPatterns(pathPatterns);
		}
	}
//
//	public void addResourceHandlers(ResourceHandlerRegistry registry) {
//		if(SystemUtil.isJarRun()){
//			//如果是以jar方式运行，则要虚拟路径
//			registry.addResourceHandler("/site/**").addResourceLocations("classpath:/site/");
////			registry.addResourceHandler("/site/**").addResourceLocations("src/main/webapp/site/");
//			registry.addResourceHandler("/cache/**").addResourceLocations("classpath:/cache/");
//			registry.addResourceHandler("/kefu/**").addResourceLocations("classpath:/kefu/");
//			registry.addResourceHandler("/plugin_data/**").addResourceLocations("classpath:/plugin_data/");
//			registry.addResourceHandler("/head/**").addResourceLocations("classpath:/head/");
//			registry.addResourceHandler("/websiteTemplate/**").addResourceLocations("classpath:/websiteTemplate/");	//v4.7增加
//			ConsoleUtil.info("jar包方式运行，配置虚拟路径 /site、   /cache 、 /head");
//		}
//		
//	}
//
//	public void addViewControllers(ViewControllerRegistry registry) {
//		registry.addViewController( "/" ).setViewName("forward:/index.html" );
//		registry.setOrder( Ordered.HIGHEST_PRECEDENCE );
//	}
	
	
}