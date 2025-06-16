package cn.zvo.translate.tcdn.core.service;

import java.util.List;
import cn.zvo.translate.tcdn.core.vo.TranslateResultVO;

/**
 * 翻译服务。如百度翻译、谷歌翻译
 * @author 管雷鸣
 */
public interface ServiceInterface {
	
	/**
	 * 设置前服务支持的语种，服务的语种与本系统的语种唯一标识之间的对应关系
	 */
	public void setLanguage();
	
	/**
	 * 通过翻译接口执行翻译操作。
	 * 注意，网络请求使用 https://github.com/xnx3/http.java ，避免引入翻译服务的SDK导致引入一大堆jar包进入
	 * @param from 将什么语言进行转换。<required> 传入如 chinese_simplified 具体可传入有：
	 * 			<ul>
	 * 				<li>auto : 自动识别传入的语言。这个要根据具体翻译服务来判断，如果翻译服务本身不支持，要把这个以报错形式拦截返回提示</li>
	 * 				<li>chinese_simplified : 简体中文</li>
	 * 				<li>chinese_traditional : 繁體中文</li>
	 * 				<li>english : English</li>
	 * 				<li>...... 具体可传入哪些，还要看该服务api接口支持哪些</li>
	 * 			</ul>
	 * @param to 转换为什么语言输出。<required> 传入如 english 具体可传入有：
	 * 			<ul>
	 * 				<li>chinese_simplified : 简体中文</li>
	 * 				<li>chinese_traditional : 繁體中文</li>
	 * 				<li>english : English</li>
	 * 				<li>...... 具体可传入哪些，还要看该服务api接口支持哪些</li>
	 * 			</ul>
	 * @param textArray 要转换的语言的json数组，传入的如 ["你好","探索星辰大海"] 
	 * @param set 更多自定义参数。 注意不要进行set，只获取，免得影响了其他的同步翻译
	 * @return 翻译结果
	 */
	public TranslateResultVO api(String from, String to, List<String> textArray, Set set);
	
	
}
