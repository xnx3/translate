package cn.zvo.translate.tcdn.core.vo.bean;

/**
 * 具体语言
 * @author 管雷鸣
 */
public class LanguageBean {
	private String id; 	//在translate.js中的唯一语言标识，无论使用什么翻译通道，这个语言标识是固定的，比如简体中文是 "chinese_simplified" 不论是用谷歌翻译还是小牛翻译，简体中文的唯一标识都是 "chinese_simplified" ，不会随着翻译通道的改变有什么变化
	private String name;	//语言的文字描述
	private String serviceId; //目标翻译服务的唯一语言标识，不同的翻译通道，这个语言标识也不一样，比如谷歌翻译通道中文是zh，微软edge翻译通道的中文是 zh-CHS 
	
	public LanguageBean() {
		// TODO Auto-generated constructor stub
	}
	public LanguageBean(String id, String name) {
		this.id = id;
		this.name = name;
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getServiceId() {
		return serviceId;
	}
	public void setServiceId(String serviceId) {
		this.serviceId = serviceId;
	}
	@Override
	public String toString() {
		return "LanguageBean [id=" + id + ", name=" + name + ", serviceId=" + serviceId + "]";
	}
	
}
