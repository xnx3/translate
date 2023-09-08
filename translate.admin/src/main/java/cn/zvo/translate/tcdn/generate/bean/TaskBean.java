package cn.zvo.translate.tcdn.generate.bean;

import java.util.ArrayList;
import java.util.List;

/**
 * 任务
 * @author 管雷鸣
 *
 */
public class TaskBean {
	private List<SiteBean> waitList;	//排队，等待进行的任务
	private List<SiteBean> inProgressList;	//进行中的任务
	private List<SiteBean> finishList;	//已完成的任务
	
	public TaskBean() {
		this.waitList = new ArrayList<SiteBean>();
		this.inProgressList = new ArrayList<SiteBean>();
		this.finishList = new ArrayList<SiteBean>();
	}
	
	public List<SiteBean> getWaitList() {
		return waitList;
	}
	public void setWaitList(List<SiteBean> waitList) {
		this.waitList = waitList;
	}
	public List<SiteBean> getInProgressList() {
		return inProgressList;
	}
	public void setInProgressList(List<SiteBean> inProgressList) {
		this.inProgressList = inProgressList;
	}
	public List<SiteBean> getFinishList() {
		return finishList;
	}
	public void setFinishList(List<SiteBean> finishList) {
		this.finishList = finishList;
	}
	
}
