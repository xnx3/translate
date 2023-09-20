package cn.zvo.translate.tcdn.generate.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.xnx3.StringUtil;

import cn.zvo.http.Http;
import cn.zvo.http.Response;

/**
 * 根据sitemap.xml ，取出里面的url
 * @author Administrator
 *
 */
public class SitemapUtil {
	
	public static void main(String[] args) throws IOException {
		Http http = new Http();
		Response res = http.get("http://www.wang.market/sitemap.xml");
		List<String> urlList = analysis(res.getContent());
		System.out.println(urlList.size());
	}
	
	
	
	public static List<String> analysis(String xml) {
		Map<String, String> map = new HashMap<String, String>();
		
		//如果 {var.xxx} 存在，则需要替换
		if(xml.indexOf("<loc>") > -1){
			Pattern p = Pattern.compile("<loc>(.*?)</loc>");
			Matcher m = p.matcher(xml);
			while (m.find()) {
				String url = m.group(1).trim();	//url
				System.out.println(url);
				map.put(url, url);
			}
		}

		List<String> list = new ArrayList<String>();
		for (Map.Entry<String, String> entry : map.entrySet()) {
			String url = entry.getKey();
		    list.add(url);
		}
		return list;
	}
	
}
