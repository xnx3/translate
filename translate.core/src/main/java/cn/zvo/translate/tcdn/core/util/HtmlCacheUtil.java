package cn.zvo.translate.tcdn.core.util;

import java.io.File;

import com.xnx3.MD5Util;
import com.xnx3.UrlUtil;
import cn.zvo.fileupload.FileUpload;
import cn.zvo.fileupload.storage.local.LocalStorage;
import cn.zvo.http.Response;

/**
 * 访问的html页面缓存
 * @author 管雷鸣
 */
public class HtmlCacheUtil {
	//html缓存文件存在于服务器的那个路径下
	public static String HtmlCachePath = "/mnt/user/htmlCache/";
	public static FileUpload fileUpload;
	static {
		fileUpload = new FileUpload();
		LocalStorage storage = new LocalStorage();
		//这里先写死，省事点
		storage.setLocalFilePath(HtmlCachePath);
		fileUpload.setStorage(storage);
	}
	
	/**
	 * 向缓存中设置或更新，将置顶访问页面的翻译结果进行缓存
	 * @param sourcedomain 源站域名，传入如 www.leimingyun.com ，翻译之前的网站，本身就有的网站
	 * @param language 语种，格式如 chinese_simplified ，对应 http://api.translate.zvo.cn/doc/language.json.html
	 * @param path 访问的文件的path，比如访问的是 http://english.xxx.com/a/b/c.html?a=1 ，那么这里传入 /a/b/c.html?a=1
	 * @param text 内容
	 */
	public static void set(String sourcedomain, String language, String path, String text) {
		if((path == null || path.length() == 0) && (text == null || text.length() == 0)) {
			System.out.println("path 、 text 都为空！ sourcedomain:"+sourcedomain+", language:"+language);
		}
		sourcedomain = UrlUtil.getDomain(sourcedomain);
		
//		System.out.println("cacheutil:"+language+", "+hash);
//		FileUploadUtil.uploadString(, text, true);
		fileUpload.uploadString(sourcedomain+"/"+language+"/"+pathToHash(path)+".html", text, true);
	}
	
	/**
	 * 通过访问的文件名，取缓存中是否有存放这个文件翻译的结果。
	 * @param sourcedomain 源站域名，传入如 www.leimingyun.com ，翻译之前的网站，本身就有的网站
	 * @param language 语种，格式如 chinese_simplified ，对应 http://api.translate.zvo.cn/doc/language.json.html
	 * @param path 访问的文件的path，比如访问的是 http://english.xxx.com/a/b/c.html?a=1 ，那么这里传入 /a/b/c.html?a=1
	 * @return 如果有，返回 {@link Response} 直接将其返回响应， 如果没有，则返回null
	 */
	public static String get(String sourcedomain, String language, String path) {
		//Object obj = com.xnx3.CacheUtil.get(hash+"_"+language);
		//System.out.println("cacheutil:"+language+", "+hash);
		sourcedomain = UrlUtil.getDomain(sourcedomain);
		String text = fileUpload.getText(sourcedomain+"/"+language+"/"+pathToHash(path)+".html");
		return text;
//		return null;
	}
	
	/**
	 * 根据翻译的语种，删除该语种的翻译缓存的html
	 * @param sourcedomain 源站域名
	 * @param language 语种，传入如 chinese_simplified
	 */
	public static void removeByLanguage(String sourcedomain, String language) {
		sourcedomain = UrlUtil.getDomain(sourcedomain);
		//fileUpload.delete(sourcedomain+"/"+language+"/");
		String path = HtmlCachePath+sourcedomain+"/"+language+"/";
		File file = new File(path);
		//ConsoleUtil.debug("remove path:"+path);
		delete(file);
	}
	
	/**
	 * 根据访问的具体url，来删除这个url的翻译缓存的html
	 * @param sourcedomain 源站域名
	 * @param language 语种，传入如 chinese_simplified
	 * @param path 访问的文件的path，比如访问的是 http://english.xxx.com/a/b/c.html?a=1 ，那么这里传入 /a/b/c.html?a=1
	 */
	public static void removeByUrl(String sourcedomain, String language, String path) {
		sourcedomain = UrlUtil.getDomain(sourcedomain);
		//System.out.println("cacheutil: remove : "+language+", "+pathToHash(path));
		fileUpload.delete(sourcedomain+"/"+language+"/"+pathToHash(path)+".html");
	}
	
	/**
	 * 将 path 转为 hash
	 * @param path 访问的文件的path，比如访问的是 http://english.xxx.com/a/b/c.html?a=1 ，那么这里传入 /a/b/c.html?a=1
	 * @return md5加密后的字符串
	 */
	public static String pathToHash(String path) {
		if(path == null || path.equals("") || path.equals("/")) {
			//如果没有加路径，只是通过域名访问，那默认是访问了index.html吧
			path = "index.html"; 
		}
		String hash = MD5Util.MD5(path);
		return hash;
	}
	
	public static void delete(File file) {
	    if (file.isDirectory()) {
	      File[] files = file.listFiles();
	      if (files != null && files.length > 0) {
	        for (File f : files) {
	          delete(f);
	        }
	      }
	      file.delete();
	    } else {
	      file.delete();
	    }
	}
}
