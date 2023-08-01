package cn.zvo.translate.service.core.pluginManage.interfaces;

import javax.servlet.http.HttpServletRequest;

import cn.zvo.translate.tcdn.core.vo.TranslateResultVO;
import net.sf.json.JSONArray;

/**
 * 文章保存时，针对news、news_date 的预处理
 * @author 管雷鸣
 */
public interface TranslateInterface {
	
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
	public TranslateResultVO before(HttpServletRequest request, String from, String to, JSONArray textArray, long size, String refererDomain);
	
	
	
}