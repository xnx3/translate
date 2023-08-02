package cn.zvo.translate.service.core.pluginManage.interfaces.manage;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import com.xnx3.ScanClassUtil;

import cn.zvo.translate.tcdn.core.service.ServiceInterface;
import cn.zvo.translate.tcdn.core.vo.TranslateResultVO;
import net.sf.json.JSONArray;

/**
 * 文章保存时，针对news、news_date 的预处理插件
 * @author 管雷鸣
 *
 */
@Component(value="PluginManageForTranslate")
public class TranslateManage {
	//自动回复的插件，这里开启项目时，便将有关此的插件加入此处
	public static List<Class<?>> classList;
	static{
		if(classList == null) {
			classList = new ArrayList<Class<?>>();
			
			//当 controller 请求执行到这个类的方法时，才会创建
			List<Class<?>> cl = ScanClassUtil.getClasses("cn.zvo.translate.service.cloud");
			classList = ScanClassUtil.searchByInterfaceName(cl, "cn.zvo.translate.service.core.pluginManage.interfaces.TranslateInterface");
			
			for (int i = 0; i < classList.size(); i++) {
				System.out.println("装载 translate 插件："+classList.get(i).getName());
			}
		}
		
		
	}
	
	

	/**
	 * 获取当前在使用的翻译接口
	 * @return 如果返回null，则是没有使用
	 */
	public static ServiceInterface getServiceInterface(HttpServletRequest request) throws InstantiationException, IllegalAccessException, NoSuchMethodException, SecurityException, IllegalArgumentException, InvocationTargetException{
		for (int i = 0; i < classList.size(); i++) {
			Class<?> c = classList.get(i);
			Object invokeReply = null;
			invokeReply = c.newInstance();
			//运用newInstance()来生成这个新获取方法的实例
			Method m = c.getMethod("getServiceInterface",new Class[]{HttpServletRequest.class});	//获取要调用的init方法
			//动态构造的Method对象invoke委托动态构造的InvokeTest对象，执行对应形参的add方法
			Object o = m.invoke(invokeReply, new Object[]{request});
			if(o != null) {
				return (ServiceInterface) o;
			}
		}
		return null;
	}

	/**
	 * 翻译之前，在进行翻译之前触发
	 * @param from @param from 将什么语言进行转换。<required> 传入如 chinese_simplified 具体可传入有：
	 * 			<ul>
	 * 				<li>chinese_simplified : 简体中文</li>
	 * 				<li>chinese_traditional : 繁體中文</li>
	 * 				<li>english : English</li>
	 * 				<li>更多参见：<a href="language.json.html" target="_black">language.json</a></li>
	 * 			</ul>
	 * @param to 转换为什么语言输出。<required> 传入如 english 具体可传入有：
	 * 			<ul>
	 * 				<li>chinese_simplified : 简体中文</li>
	 * 				<li>chinese_traditional : 繁體中文</li>
	 * 				<li>english : English</li>
	 * 				<li>更多参见：<a href="language.json.html" target="_black">language.json</a></li>
	 * 			</ul>
	 * @param textArray 要进行翻译的内容，每个句子都是其中一条
	 * @param size 要翻译的字符数的统计，比如 10
	 * @param refererDomain 调用这个接口的来源域名，也就是哪个网页上调用的这个翻译接口，这里传入的如 abc.zvo.cn 域名格式
	 * @return TranslateResultVO 如果result= failure ，那么翻译接口不会再往下执行， 将这个 vo 返回。
	 */
	public static TranslateResultVO before(HttpServletRequest request, String from, String to, JSONArray textArray, long size, String refererDomain) throws InstantiationException, IllegalAccessException, NoSuchMethodException, SecurityException, IllegalArgumentException, InvocationTargetException{
		TranslateResultVO vo = new TranslateResultVO();
		for (int i = 0; i < classList.size(); i++) {
			Class<?> c = classList.get(i);
			Object invokeReply = null;
			invokeReply = c.newInstance();
			//运用newInstance()来生成这个新获取方法的实例
			Method m = c.getMethod("before",new Class[]{HttpServletRequest.class, String.class, String.class, JSONArray.class, long.class, String.class });	//获取要调用的init方法
			//动态构造的Method对象invoke委托动态构造的InvokeTest对象，执行对应形参的add方法
			m.invoke(invokeReply, new Object[]{request, from, to, textArray, size, refererDomain});
		}
		return vo;
	}
	

}
