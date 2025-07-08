package cn.zvo.translate.tcdn.core.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.xnx3.BaseVO;
import com.xnx3.Log;

import cn.zvo.translate.tcdn.core.LanguageEnum;
import cn.zvo.translate.tcdn.core.vo.LanguageListVO;
import cn.zvo.translate.tcdn.core.vo.bean.LanguageBean;


/**
 * 当前服务支持的语种，服务的语种与本系统的语种唯一标识之间的对应关系
 * @author 管雷鸣
 *
 */
public class Language {
	/**
	 * 2023.8.3 更新,更新为：
	 * key: 翻译源，值为 google、huawei、niutrans  也就是 cn.zvo.translate.service.niutrans 的包名
	 * value: map 翻译源下的具体语种对应
	 * 			key: 语种唯一标识，这个标识是本系统自定义的语种标识，来源于 LanguageEnum 枚举， 传入如 chinese_simplified
	 * 			value: map 这个语种所对应的一些信息，比如语种的名字、语种在翻译接口的标识等
	 * 					  key: 
	 * 						  name 语种的名字，比如韩语，那这个名字就是“韩语”使用韩文翻译之后的文本
	 * 						  serviceId 翻译接口服务的语种唯一标识，传入如 zh
	 */
	public static Map<String, Map<String, Map<String, String>>> map;
	
	/**
	 * 2025.3 增加
	 * 将某个翻译通道的  翻译通道的语种 转为 translate.js 的语言标识
	 * 服务于 {@link #channelLanguageToTranslateJS(String, String)} ，不能直接使用
	 * 
	 * key: 通道名字，如 google
	 * value: 通道的语种对应map
	 * 		key：通道的语言标识，如 en
	 * 		value: translate.js 的语言标识，如 english
	 */
	private static Map<String, Map<String, String>> serviceIdToTranslateJsLanguageMap;
	static {
		map = new HashMap<String, Map<String,Map<String, String>>>();
		serviceIdToTranslateJsLanguageMap = new HashMap<String, Map<String,String>>();
	}
	
	
	public String serviceName; //翻译源，值为 google、huawei、niutrans  也就是 cn.zvo.translate.service.niutrans 的包名， 这里也就是 map的第一个key
	/**
	 * 创建某个翻译源的
	 * @param serviceName 翻译源，值为 google、huawei、niutrans  也就是 cn.zvo.translate.service.niutrans 的包名， 这里也就是 map的第一个key
	 */
	public Language(String serviceName) {
		if(serviceName == null) {
			serviceName = "";
		}
		this.serviceName = serviceName;
	}
	
	/**
	 * 根据 翻译通道的名字来获取这个 翻译通道所支持的语种。
	 * <p>如果</p>
	 * @param serviceName 翻译通道的名字，传入如 google
	 */
	public static LanguageListVO getLanguageList(String serviceName) {
		Language lang = new Language(serviceName);
		return lang.getLanguageList(); 
	}
	
	/**
	 * 追加翻译服务的语种与本系统语种，唯一标识之间的对应
	 * @param currentId 本系统的语种唯一标识，传入如 chinese_simplified
	 * @param serviceId 翻译服务的语种唯一标识，传入如 zh-CN
	 * @param name 这个语种显示给用户观看的文字，如 简体中文
	 */
	public void append(String currentId, String serviceId, String name) {
		Map<String, String> valueMap = new HashMap<String, String>();
		valueMap.put("serviceId", serviceId);
		valueMap.put("name", name);
		
		if(map.get(this.serviceName) == null) {
			map.put(this.serviceName, new HashMap<String, Map<String, String>>());
		}
		map.get(this.serviceName).put(currentId, valueMap);
		//System.out.println(" -- "+this.serviceName+", put -- "+currentId);
	}
	

	/**
	 * 追加支持的语种
	 * @param languageEnum 语种的枚举
	 * @param serviceId 对应翻译平台的语种标识，比如谷歌翻译、小牛翻译 这个枚举语种在具体翻译平台中的标识，比如中文是 zh ，英文是 en
	 */
	public void append(LanguageEnum languageEnum, String serviceId) {
		append(languageEnum.id, serviceId, languageEnum.name);
	}

	
	/**
	 * 将当前所用的语种唯一标识转化为翻译平台的语种唯一标识
	 * @param id 当前平台所用的语种唯一标识，传入如 chinese_simplified
	 * @return {@link BaseVO} 如果成功，info中便是翻译服务的语种唯一标识，如 zh-CN
	 */
	public BaseVO currentToService(String id) {
		Object obj = map.get(this.serviceName).get(id);
		if(obj == null) {
			//未发现
			return BaseVO.failure("not find");
		}
		
		Map<String, String> valueMap = (Map<String, String>) obj;
		return BaseVO.success(valueMap.get("serviceId"));
	}
	
	/**
	 * 将当前translate.js所用的语种唯一标识转化为某个翻译通道的语种唯一标识
	 * @param serviceName 翻译通道名字，传入如 google 、 leimingyun、glm
	 * @param id 当前平台所用的语种唯一标识，传入如 chinese_simplified
	 * @return {@link BaseVO} 如果成功，info中便是翻译服务的语种唯一标识，如 zh-CN
	 */
	public static BaseVO translateJsToService(String serviceName, String id) {
		if(id == null || id.equalsIgnoreCase("auto")) {
			//属于自动识别语种的，那直接原样返回
			return BaseVO.success(id);
		}
		
		Object obj = map.get(serviceName).get(id);
		if(obj == null) {
			//未发现
			return BaseVO.failure("language not find");
		}
		
		Map<String, String> valueMap = (Map<String, String>) obj;
		return BaseVO.success(valueMap.get("serviceId"));
	}
	
	/**
	 * 将某个翻译通道的语种转化为translate.js翻译平台的语种唯一标识
	 * @param serviceName 翻译通道的名字，比如传入 google
	 * @param id 翻译通道的语种唯一标识，传入如 en
	 * @return {@link BaseVO} 如果成功，info中便是翻译服务的语种唯一标识，如 zh-CN
	 */
	public static String channelLanguageToTranslateJS(String serviceName, String id) {
		if(id == null || id.equalsIgnoreCase("auto")) {
			//属于自动识别语种的，那直接原样返回
			return "auto";
		}
		
		Map<String, String> channelLanguageMap = serviceIdToTranslateJsLanguageMap.get(serviceName);
		if(channelLanguageMap == null || channelLanguageMap.size() == 0) {
			
			channelLanguageMap = new HashMap<String, String>();
			for(Map.Entry<String, Map<String, String>> entry:map.get(serviceName).entrySet()){  
	        	channelLanguageMap.put(entry.getValue().get("serviceId"), entry.getKey());
	        }
			Log.info("translate channel "+serviceName+" number : "+channelLanguageMap.size());
			serviceIdToTranslateJsLanguageMap.put(serviceName, channelLanguageMap);
		}
		
		return channelLanguageMap.get(id);			
	}
	
	
	
	/**
	 * 获取当前的语种列表
	 */
	public LanguageListVO getLanguageList() {
		LanguageListVO vo = new LanguageListVO();
		List<LanguageBean> list = new ArrayList<LanguageBean>();
		for(Map.Entry<String, Map<String, String>> entry:map.get(this.serviceName).entrySet()){  
			LanguageBean bean = new LanguageBean();
        	bean.setId(entry.getKey());
        	bean.setName(entry.getValue().get("name"));
        	bean.setServiceId(entry.getValue().get("serviceId"));
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
