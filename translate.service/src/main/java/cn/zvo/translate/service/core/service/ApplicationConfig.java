package cn.zvo.translate.service.core.service;

import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * application.properties / yml 中的一些相关配置项目
 * @author 管雷鸣
 */
@Component(value = "translateServiceApplicationConfig")
@ConfigurationProperties(prefix = "translate")
public class ApplicationConfig {
	//自定义翻译的初始化相关参数
	private Map<String, Map<String, String>> service;

	public Map<String, Map<String, String>> getService() {
		return service;
	}

	public void setService(Map<String, Map<String, String>> service) {
		this.service = service;
	}
	
}