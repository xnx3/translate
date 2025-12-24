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
	
	/**
	 * 翻译精确度。
	 *	取值为0~100 ，数值越大说明对翻译精准度要求越高。  
	 *	注意，设置的数值越高，对精确度要求越高。
	 *	如果不设置，默认是普通的翻译质量 50
	 */
	private int accuracy;
	
	/**
	 * 大模型进行翻译，是否启用思考能力，来提高翻译质量
	 * 默认不设置，则是 false，不启用思考能力。 可以设置为 true 则是启用思考能力
	 */
	private boolean think;
	
	public Set() {
		useRepair = true;
		contain = false;
		accuracy = 50;
		think = false;
	}
	
	/**
	 * 相当于通过传入的 set，克隆一个新的出来
	 * @param cloneSet 要克隆的 Set
	 */
	public Set(Set cloneSet) {
		this.useRepair = cloneSet.isUseRepair();
		this.contain = cloneSet.isContain();
		this.accuracy = cloneSet.getAccuracy();
		this.think = cloneSet.isThink();
		this.requestParams = cloneSet.getRequestParams();
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

	public int getAccuracy() {
		return accuracy;
	}

	public void setAccuracy(int accuracy) {
		this.accuracy = accuracy;
	}
	
	
	public boolean isThink() {
		return think;
	}

	public void setThink(boolean think) {
		this.think = think;
	}
	
	/**
	 * 通过配置文件读取到的字符串格式的值
	 * @param think 
	 */
	public void setThink(String think) {
		if(think == null || think.trim().length() == 0) {
			this.think = false;
		}else{
			if(think.trim().equalsIgnoreCase("true")){
				this.think = true;
			}else {
				this.think = false;
			}
		}
	}
	
	@Override
	public String toString() {
		return "Set [useRepair=" + useRepair + ", contain=" + contain + ", requestParams=" + requestParams
				+ ", accuracy=" + accuracy + "]";
	}
	
}
