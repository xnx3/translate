package cn.zvo.translate.tcdn.generate.bean;

import java.util.ArrayList;
import java.util.List;
import cn.zvo.fileupload.StorageInterface;

/**
 * 翻译的语种， {@link SiteBean}的下级
 * @author 管雷鸣
 *
 */
public class LanguageBean {
//	private TranslateSiteDomain language;
	private String language; //要生成什么语种的
	private List<PageBean> pageList; //翻译的页面列表 
	private StorageInterface storage;	//翻译之后的页面的存储方式
	/**
	 * 是否已经被翻译。
	 * 默认是0，代表还未翻译。
	 * -1 代表翻译完成
	 */
	private int isTrans;
	private int time;		//如果已经被翻译，这里是翻译完成的时间，10位时间戳
	
	public LanguageBean() {
		this.isTrans = 0;
		this.pageList = new ArrayList<PageBean>();
	}
	
	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	public List<PageBean> getPageList() {
		return pageList;
	}
	public void setPageList(List<PageBean> pageList) {
		this.pageList = pageList;
	}
	public StorageInterface getStorage() {
		return storage;
	}
	public void setStorage(StorageInterface storage) {
		this.storage = storage;
	}
	public int getIsTrans() {
		return isTrans;
	}
	public void setIsTrans(int isTrans) {
		this.isTrans = isTrans;
	}
	public int getTime() {
		return time;
	}
	public void setTime(int time) {
		this.time = time;
	}
	@Override
	public String toString() {
		return "LanguageBean [language=" + language + ", pageList=" + pageList + ", storage=" + storage + ", isTrans="
				+ isTrans + ", time=" + time + "]";
	}

}
