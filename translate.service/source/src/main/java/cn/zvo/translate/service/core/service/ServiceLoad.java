package cn.zvo.translate.service.core.service;

import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import com.xnx3.Log;
import com.xnx3.ScanClassUtil;

import cn.zvo.translate.service.google.ServiceInterfaceImplement;
import cn.zvo.translate.tcdn.core.service.Language;
import cn.zvo.translate.tcdn.core.service.Service;
import cn.zvo.translate.tcdn.core.service.ServiceInterface;
import net.sf.json.JSONObject;

/**
 * 翻译服务核心
 * @author 管雷鸣
 */
//@Component(value="translateService")
@EnableConfigurationProperties(ApplicationConfig.class)
@Configuration
public class ServiceLoad implements CommandLineRunner{
	@Resource
	private ApplicationConfig translateServiceApplicationConfig;

	public void run(String... args) throws Exception {
		
		//搜索继承ServiceInterface接口的,以便执行设置语种
		List<Class<?>> classList = ScanClassUtil.getClasses("cn.zvo.translate.service");
		List<Class<?>> logClassList = ScanClassUtil.searchByInterfaceName(classList, "cn.zvo.translate.tcdn.core.service.ServiceInterface");
		for (int i = 0; i < logClassList.size(); i++) {
			Class logClass = logClassList.get(i);
			//com.xnx3.Log.debug("translate service : "+logClass.getName());
			try {
				Object newInstance = logClass.getDeclaredConstructor(Map.class).newInstance(new HashMap<String,String>());
				Service.serviceInterface = (ServiceInterface) newInstance;
				Service.serviceInterface.setLanguage(); //初始化设置语种
				//System.out.println("-----setlanguage:"+ServiceInterface.class.getName());
			} catch (InstantiationException | IllegalAccessException | IllegalArgumentException| InvocationTargetException  | NoSuchMethodException | SecurityException e) {
				e.printStackTrace();
			}
		}
		Log.info("language : \n"+JSONObject.fromObject(Language.map));
		
		//从application.properties中获取设置的默认翻译源
		com.xnx3.Log.debug("load translate config by application.properties / yml : "+this.translateServiceApplicationConfig);
		if(translateServiceApplicationConfig == null) {
			System.err.println("未发现application配置");
			return;
		}
    	loadConfig(this.translateServiceApplicationConfig); //加载application配置
	}
	
	/**
     * 加载配置 {@link ApplicationConfig} （aplication.properties/yml）文件的配置数据，通过其属性来决定使用何种配置。
     * <br>这个其实就相当于用java代码来动态决定配置
     * @param config
     */
    public void loadConfig(ApplicationConfig config) {
    	if(config == null) {
    		return;
    	}

		if(config.getService() != null) {
			for (Map.Entry<String, Map<String, String>> entry : config.getService().entrySet()) {
				//拼接，取该插件在哪个包
				String datasourcePackage = "cn.zvo.translate.service."+entry.getKey();
				List<Class<?>> classList = ScanClassUtil.getClasses(datasourcePackage);
				if(classList.size() == 0) {
					System.err.println("====================");
					System.err.println(" 【【【 ERROR 】】】    ");
					System.err.println(" translate service 未发现 "+datasourcePackage +" 这个包存在，请确认pom.xml是否加入了这个 service 支持模块");
					System.err.println("====================");
					continue;
				}else {
					for (int i = 0; i < classList.size(); i++) {
						com.xnx3.Log.debug("class list item : "+classList.get(i).getName());
						
						try {
							Class serviceClass = classList.get(i);
							Object newInstance = serviceClass.getDeclaredConstructor(Map.class).newInstance(entry.getValue());
							Service.serviceInterface = (ServiceInterface) newInstance;
							Service.serviceInterface.setLanguage(); //初始化设置语种
							com.xnx3.Log.info("service use "+serviceClass.getName());
							return;
						} catch (InstantiationException | IllegalAccessException | IllegalArgumentException| InvocationTargetException  | NoSuchMethodException | SecurityException e) {
							e.printStackTrace();
						}
						
					}
				}
				
			}
		}else {
			System.out.println("未配置 translate.service.xxx.xxx ，使用默认的google翻译");
			Service.serviceInterface = new ServiceInterfaceImplement();
			Service.serviceInterface.setLanguage();
		}
    }
	
}
