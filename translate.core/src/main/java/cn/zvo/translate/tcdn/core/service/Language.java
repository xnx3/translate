package cn.zvo.translate.tcdn.core.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.xnx3.BaseVO;
import cn.zvo.translate.tcdn.core.vo.LanguageListVO;
import cn.zvo.translate.tcdn.core.vo.bean.LanguageBean;


/**
 * 当前服务支持的语种，服务的语种与本系统的语种唯一标识之间的对应关系
 * @author 管雷鸣
 *
 */
public class Language {
	static Map<String, Map<String, String>> map;
	static {
		map = new HashMap<String, Map<String,String>>();
	}
	
	/**
	 * 追加翻译服务的语种与本系统语种，唯一标识之间的对应
	 * @param currentId 本系统的语种唯一标识，传入如 chinese_simplified
	 * @param serviceId 翻译服务的语种唯一标识，传入如 zh-CN
	 * @param name 这个语种显示给用户观看的文字，如 简体中文
	 */
	public static void append(String currentId, String serviceId, String name) {
		Map<String, String> valueMap = new HashMap<String, String>();
		valueMap.put("serviceId", serviceId);
		valueMap.put("name", name);
		
		map.put(currentId, valueMap);
	}
	
	/**
	 * 将当前所用的语种唯一标识转化为翻译平台的语种唯一标识
	 * @param id 当前平台所用的语种唯一标识，传入如 chinese_simplified
	 * @return {@link BaseVO} 如果成功，info中便是翻译服务的语种唯一标识，如 zh-CN
	 */
	public static BaseVO currentToService(String id) {
		Object obj = map.get(id);
		if(obj == null) {
			//未发现
			return BaseVO.failure("not find");
		}
		
		Map<String, String> valueMap = (Map<String, String>) obj;
		return BaseVO.success(valueMap.get("serviceId"));
	}
	
	/**
	 * 获取当前的语种列表
	 */
	public static LanguageListVO getLanguageList() {
		LanguageListVO vo = new LanguageListVO();
		List<LanguageBean> list = new ArrayList<LanguageBean>();
		for(Map.Entry<String, Map<String, String>> entry:map.entrySet()){  
			LanguageBean bean = new LanguageBean();
        	bean.setId(entry.getKey());
        	bean.setName(entry.getValue().get("name"));
        	list.add(bean);
	    }
		vo.setList(list);
		
		if(list.size() == 0) {
			//没有语种，可能在开发状态下，手动加入两个
			System.out.println("cn.zvo.translate.tcdn.core.service 手动增加简体中文、英语 两个语种 (开发环境下才会出现这个情况，如果是线上环境，出现这个，请检查是否加入了 tcdn.service)");
			
			LanguageBean englishBean = new LanguageBean();
			englishBean.setId("english");
			englishBean.setName("English");
			vo.getList().add(englishBean);
			
			LanguageBean chineseBean = new LanguageBean();
			chineseBean.setId("chinese_simplified");
			chineseBean.setName("简体中文");
			vo.getList().add(chineseBean);
		}
		
		
       
        return vo;
	}
}
