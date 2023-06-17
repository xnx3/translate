package cn;


import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import com.xnx3.j2ee.util.ConsoleUtil;

/**
 * 放到Tomcat中时用
 * @author 管雷鸣
 *
 */
@ServletComponentScan
public class ServletInitializer extends SpringBootServletInitializer {
	
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		ConsoleUtil.debug = true;
		ConsoleUtil.info = true;
		ConsoleUtil.error = true;
		com.xnx3.j2ee.Global.isJarRun = false;	//自行放到tomcat中运行
		application.allowCircularReferences(true);
		
		Application.startFinish();//当项目启动完毕后，控制台打印启动成功的说明指引
		
		return application.sources(Application.class);
	}
}
