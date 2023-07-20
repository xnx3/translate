package cn.zvo.translate.tcdn.api.util;

import cn.zvo.fileupload.framework.springboot.FileUploadUtil;
import cn.zvo.http.Response;

/**
 * 缓存层
 * @author 管雷鸣
 */
public class CacheUtil {
	
	/**
	 * 向缓存中设置或更新
	 * @param domain 传入如 www.leimingyun.com
	 * @param hash 要翻译的内容文本的hash
	 * @param text 内容
	 */
	public static void set(String domain, String hash, String language, String text) {
		if(hash == null) {
			System.out.println("hash:null, "+text);
		}
//		System.out.println("cacheutil:"+language+", "+hash);
		FileUploadUtil.uploadString(domain+"/"+hash+"_"+language+".txt", text);
	}
	
	/**
	 * 通过对要翻译的内容文本的hash，取缓存中是否有存放这个结果。
	 * @param hash 要翻译的内容文本的hash
	 * @param language 要翻译的目标语种
	 * @return 如果有，返回 {@link Response} 直接将其返回响应， 如果没有，则返回null
	 */
	public static String get(String domain, String hash, String language) {
		//Object obj = com.xnx3.CacheUtil.get(hash+"_"+language);
		//System.out.println("cacheutil:"+language+", "+hash);
		String text = FileUploadUtil.getText(domain+"/"+hash+"_"+language+".txt");
		return text;
//		return null;
	}
	
	public static void remove(String hash, String language) {
		System.out.println("cacheutil: remove : "+language+", "+hash);
		FileUploadUtil.delete(hash+"_"+language+".txt");
	}
}
