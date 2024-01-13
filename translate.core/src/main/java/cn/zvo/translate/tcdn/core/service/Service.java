package cn.zvo.translate.tcdn.core.service;

import com.xnx3.j2ee.util.ConsoleUtil;

/**
 * 翻译服务核心
 * @author 管雷鸣
 */
public class Service{
	//当前使用的翻译服务，使用时请用 getService() 获取
	public static ServiceInterface serviceInterface;
	
	/**
	 * 获取当前使用的翻译服务
	 * @return
	 */
	public static ServiceInterface getService() {
		if(serviceInterface == null) {
			System.err.println("未配置短信通道，请在application.propeties 中进行配置。可参考 http://translate.zvo.cn/41160.html");
		}
		return serviceInterface;
	}
}
