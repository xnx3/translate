package cn.zvo.translate.service.core.util;

import org.lionsoul.ip2region.xdb.Searcher;
import com.xnx3.BaseVO;
import com.xnx3.Log;
import com.xnx3.StringUtil;
import com.xnx3.SystemUtil;

import cn.zvo.translate.tcdn.core.LanguageEnum;

import java.io.*;
import java.util.concurrent.TimeUnit;

/**
 * IP相关
 * @author 管雷鸣
 */
public class IpUtil{
	static String dbPath = "G:\\git\\translate_service\\src\\main\\java\\cn\\zvo\\translate\\core\\util\\ip2region.xdb";
	static Searcher searcher;
	
	public static Searcher getSearcher() {
		if(searcher == null) {
			String dbPath = getProjectPath()+"WEB-INF/lib/ip2region.xdb";
			System.out.println(dbPath);
			
			// 1、从 dbPath 中预先加载 VectorIndex 缓存，并且把这个得到的数据作为全局变量，后续反复使用。
	        byte[] vIndex;
	        try {
	            vIndex = Searcher.loadVectorIndexFromFile(dbPath);
	        } catch (Exception e) {
	            System.out.printf("failed to load vector index from `%s`: %s\n", dbPath, e);
	            return null;
	        }
	        
	        // 2、使用全局的 vIndex 创建带 VectorIndex 缓存的查询对象。
	        try {
	            searcher = Searcher.newWithVectorIndex(dbPath, vIndex);
	        } catch (Exception e) {
	            System.out.printf("failed to create vectorIndex cached searcher with `%s`: %s\n", dbPath, e);
	            return null;
	        }
		}
		return searcher;
	}
	
	/**
	 * 查询指定的ip在哪个国家
	 * @param ip ip地址，传入如 1.2.3.4
	 * @return
	 */
	public static BaseVO search(String ip) {
		// 3、查询
//        String ip = "156.236.74.70";
        try {
            long sTime = System.nanoTime();
            String region = getSearcher().search(ip);
            long cost = TimeUnit.NANOSECONDS.toMicros((long) (System.nanoTime() - sTime));
            //System.out.printf("{region: %s, ioCount: %d, took: %d μs}\n", region, searcher.getIOCount(), cost);
            return BaseVO.success(StringUtil.subString(region, null, "|", 2));
        } catch (Exception e) {
            System.out.printf("failed to search(%s): %s\n", ip, e);
            return BaseVO.failure(e.getMessage());
        }
	}
	
	/**
	 * 将国家名转为这个国家使用的语言
	 * @param country 传入如 中国
	 * @return 返回如chinese_simplified 如果没有匹配到，默认返回english
	 */
	public static String countryToLanguage(String country) {
		if(country == null) {
			return LanguageEnum.ENGLISH.id;
		}
		
		if(country.equals("中国") || country.equals("新加坡")) {
			return LanguageEnum.CHINESE_SIMPLIFIED.id;
		}else if(country.equals("美国")) {
			return LanguageEnum.ENGLISH.id;
//		}else if(country.equals("日本")) {
//			return LanguageEnum.JAPANESE.id;
		}else if(country.equals("韩国")) {
			return LanguageEnum.KOREAN.id;
		}
		
		
		/*
		 * 
		 * 待完善，具体语言参考 https://gitee.com/lionsoul/ip2region/blob/master/data/global_region.csv
		 * 
		 */
		
		
		return LanguageEnum.ENGLISH.id;
	}
	
	
	public static void main(String[] args) {
        
       

        // 3、查询
        String ip = "156.236.74.70";
        try {
            long sTime = System.nanoTime();
            String region = searcher.search(ip);
            long cost = TimeUnit.NANOSECONDS.toMicros((long) (System.nanoTime() - sTime));
            System.out.printf("{region: %s, ioCount: %d, took: %d μs}\n", region, searcher.getIOCount(), cost);
        } catch (Exception e) {
            System.out.printf("failed to search(%s): %s\n", ip, e);
        }
        
        // 4、关闭资源
        try {
            searcher.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
        

        // 备注：每个线程需要单独创建一个独立的 Searcher 对象，但是都共享全局的制度 vIndex 缓存。
    }
	
	
	private static String projectPath;
	/**
	 * 当前项目再硬盘的路径，绝对路径。
	 * <br/>返回格式如 /Users/apple/git/wangmarket/target/classes/  最后会加上 /
	 * <br/>如果是在编辑器中开发时运行，返回的是 /Users/apple/git/wangmarket/target/classes/ 这种，最后是有 /target/classes/ 的
	 * <br/>如果是在实际项目中运行，也就是在服务器的Tomcat中运行，返回的是 /mnt/tomcat8/webapps/ROOT/ 这样的，最后是结束到 ROOT/ 下
	 */
	public static String getProjectPath(){
		if(projectPath == null){
			String path = new IpUtil().getClass().getResource("/").getPath();
			projectPath = path.replace("WEB-INF/classes/", "");
			Log.info("projectPath : "+projectPath);
		}
		return projectPath;
	}
}
