package cn.zvo.translate.tcdn.generate.vo;

import com.xnx3.BaseVO;

/**
 * 等待进度
 * @author 管雷鸣
 *
 */
public class WaitingProgressVO extends BaseVO{
	
	private int allnumber;	//总数量
	private int rank;	//我的排名，如果为-1则是没有找到，没有在里面. 为0则是正在执行着了， 为1则是前面还有1个网站
	
	public WaitingProgressVO() {
		this.rank = -1;
	}

	public int getAllnumber() {
		return allnumber;
	}

	public void setAllnumber(int allnumber) {
		this.allnumber = allnumber;
	}

	public int getRank() {
		return rank;
	}

	public void setRank(int rank) {
		this.rank = rank;
	}

	@Override
	public String toString() {
		return "WaitingProgressVO [allnumber=" + allnumber + ", rank=" + rank + "]";
	}
	
}
