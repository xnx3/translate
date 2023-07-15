package cn.zvo.translate.service.core.util;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * String 工具类
 * @author 管雷鸣
 *
 */
public class StringUtil extends com.xnx3.StringUtil{
	
	public static String stringToUrl(String str) {
//		System.out.println("原始："+str);
		try {
			str = URLEncoder.encode(str, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			return e.getMessage();
		}
		
		//空格会被替换为+号，所以将+进行替换（原本+会变为%2B所以不担心替换错）
		str = str.replaceAll("\\+", "%20");
//		System.out.println("结果："+str);
		return str;
	}
}
