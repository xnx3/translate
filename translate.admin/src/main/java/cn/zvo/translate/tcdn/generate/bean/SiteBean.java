package cn.zvo.translate.tcdn.generate.bean;

import java.util.ArrayList;
import java.util.List;

import com.xnx3.DateUtil;
import com.xnx3.StringUtil;

import cn.zvo.translate.tcdn.core.entity.TranslateSite;
import cn.zvo.translate.tcdn.generate.Global;

/**
 * 翻译的网站 ，服务于 {@link Global#taskList}
 * @author 管雷鸣
 */
public class SiteBean {
	private String taskid;	//任务编号，本次任务的编号。 采用时间戳+siteid 进行32进制方式
	private TranslateSite site;
	private List<LanguageBean> languageList;
	
	/**
	 * 是否已经被翻译。
	 * 默认是0，代表还未翻译。
	 * -1 代表翻译完成
	 */
	private int isTrans;
	private int time;		//如果已经被翻译，这里是翻译完成的时间，10位时间戳
	
	public SiteBean() {
		this.isTrans = 0;
		this.time = 0;
		this.languageList = new ArrayList<LanguageBean>();
	}
	
	public TranslateSite getSite() {
		return site;
	}
	public void setSite(TranslateSite site) {
		this.site = site;
	}
	public List<LanguageBean> getLanguageList() {
		return languageList;
	}
	public void setLanguageList(List<LanguageBean> languageList) {
		this.languageList = languageList;
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
	
	public String getTaskid() {
		if(taskid == null) {
			taskid = StringUtil.intTo36(site.getId())+"_"+StringUtil.intTo36(DateUtil.timeForUnix10());
		}
		
		return taskid;
	}

	public void setTaskid(String taskid) {
		this.taskid = taskid;
	}

	@Override
	public String toString() {
		return "SiteBean [taskid=" + taskid + ", site=" + site + ", languageList=" + languageList + ", isTrans="
				+ isTrans + ", time=" + time + "]";
	}

	
}
