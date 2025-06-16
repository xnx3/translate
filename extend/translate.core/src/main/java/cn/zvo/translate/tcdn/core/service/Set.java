package cn.zvo.translate.tcdn.core.service;

import java.util.Map;

/**
 * service翻译通道的其他设置参数
 */
public class Set {
	/**
	 * 如果翻译结果的精确度打分不达标，是否启用修复通道进行翻译。 
	 * true启用； false不启用
	 * 比如这里是修复通道触发的，那肯定就是不启用了，免得死循环
	 * 大模型翻译才会用到这个参数
	 * 默认不设置是true
	 */
	private boolean useRepair;
	
	/**
	 * 翻译时，译文的文本中包含有原文时，是否直接将原文返回
	 * true是；  false否
	 * 译文中包含原文，可能译文对原文进行解释，也可能小模型无法翻译原样返回。
	 * 大模型翻译才会用到这个参数
	 * 默认不设置是false
	 */
	private boolean contain;
	
	/**
	 * translate.json 请求的其他参数
	 * 1. 这里只限字符串文本格式的参数
	 * 2. 这里会忽略translate.json接口本身向翻译通道传递的定义参数：
	 * 			from
	 * 			to
	 * 			texts
	 * 		这几个参数将不会透传，除了这几个之外的参数都会透传
	 * 3. 只有leimingyun 这个通道才会使用透传的能力
	 */
	private Map<String, String> requestParams;
	
	public Set() {
		useRepair = true;
		useRepair = false;
	}
	
	public boolean isUseRepair() {
		return useRepair;
	}

	public void setUseRepair(boolean useRepair) {
		this.useRepair = useRepair;
	}

	public boolean isContain() {
		return contain;
	}

	public void setContain(boolean contain) {
		this.contain = contain;
	}

	public Map<String, String> getRequestParams() {
		return requestParams;
	}

	public void setRequestParams(Map<String, String> requestParams) {
		this.requestParams = requestParams;
	}
	
}
