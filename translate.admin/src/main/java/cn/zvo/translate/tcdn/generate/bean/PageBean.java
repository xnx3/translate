package cn.zvo.translate.tcdn.generate.bean;

import com.xnx3.UrlUtil;

/**
 * 翻译的目标网页， 服务于 {@link LanguageBean}
 * @author 管雷鸣
 */
public class PageBean {
	private String path;	//翻译的目标网页的path，比如翻译的目标网页是  http://www.zbc.com/a/b.html ，那么这里便是 /a/b.html
	/**
	 * 是否已经被翻译。
	 * 默认是0，代表还未翻译。
	 * 1~3 代表翻译的次数，比如第一次翻译失败，那会进行第二次翻译，在失败会进行第三次翻译，这里是翻译的次数，第几次
	 * -1 代表翻译完成
	 */
	private int isTrans;
	private int time;		//如果已经被翻译，这里是翻译的时间，10位时间戳
	private String errorInfo; //如果 isTrans 翻译失败（连续几次都失败），则这里会留存失败原因，以便显示出来

	public PageBean() {
		this.isTrans = 0;
	}
	
	public PageBean(String path) {
		this.isTrans = 0;
		setPath(path);
	}
	
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		String p = UrlUtil.getRequestPath(path);
		if(!p.substring(0, 1).equals("/")) {
			p = "/"+p;
		}
		this.path = p;
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
	public String getErrorInfo() {
		return errorInfo;
	}
	public void setErrorInfo(String errorInfo) {
		this.errorInfo = errorInfo;
	}
	
	@Override
	public String toString() {
		return "PageBean [path=" + path + ", isTrans=" + isTrans + ", time=" + time + ", errorInfo=" + errorInfo + "]";
	}
	
}
