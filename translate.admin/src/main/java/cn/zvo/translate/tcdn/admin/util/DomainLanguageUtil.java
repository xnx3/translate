package cn.zvo.translate.tcdn.admin.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import com.xnx3.j2ee.util.ApplicationPropertiesUtil;
import com.xnx3.j2ee.util.ConsoleUtil;
import cn.zvo.http.Http;
import cn.zvo.http.Response;
import cn.zvo.translate.tcdn.core.vo.bean.LanguageBean;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 二级域名跟语种对应关系
 * @author 管雷鸣
 */
public class DomainLanguageUtil {
	public static List<LanguageBean> languageList; //当前支持的语种列表
	
	/**
	 * 根据当前翻译支持的语种，来生成泛解析域名的前缀。 比如 english、chinesesimplified等。注意如果语种中间有下划线，会自动去掉
	 * @return
	 */
	public static List<LanguageBean> generateDomain() {
		//缓存中有，就直接返回缓存的
		if(languageList != null && languageList.size() > 0) {
			return languageList;
		}
		
		List<LanguageBean> list = new ArrayList<LanguageBean>();
		Http http = new Http();
		String serviceDomain = ApplicationPropertiesUtil.getProperty("translate.tcdn.service.domain");
		if(serviceDomain == null || serviceDomain.length() < 1) {
			ConsoleUtil.error("请配置 application.properties 中的 translate.tcdn.service.domain ");
			list.add(new LanguageBean("", "请配置 application.properties 中的 translate.tcdn.service.domain "));
			return list;
		}
		
		try {
			Response res = http.post(serviceDomain+"language.json?source=tcdn.core", null);
			if(res.getCode() != 200) {
				//不正常
				ConsoleUtil.error(res.toString());
				list.add(new LanguageBean("", "http code:"+res.getCode()+", content:"+res.getContent()));
				return list;
			}
			
			JSONObject json = JSONObject.fromObject(res.getContent());
			JSONArray array = json.getJSONArray("list");
			
			for (int i = 0; i < array.size(); i++) {
				JSONObject item = array.getJSONObject(i);
				
				LanguageBean bean = new LanguageBean();
				bean.setId(item.getString("id"));
				bean.setName(item.getString("name"));
				if(bean.getId().indexOf("_") > 0) {
					//将language.id 中有下划线_ 的去掉
					bean.setId(bean.getId().replace("_", ""));
				}
				list.add(bean);
			}
			
			//缓存，以后直接从缓存取，就不走这里了
			if(list.size() > 0) {
				languageList = list;
			}
			return list;
		} catch (IOException e) {
			e.printStackTrace();
			list.add(new LanguageBean("", e.getMessage()));
			return list;
		}
	}
	
	public static void main(String[] args) {
		System.out.println(generateDomain());
	}
	
}
