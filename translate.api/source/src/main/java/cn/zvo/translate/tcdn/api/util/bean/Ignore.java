package cn.zvo.translate.tcdn.api.util.bean;

import java.util.ArrayList;
import java.util.List;

/**
 * 忽略不翻译的地方，同 translate.ignore.xxx
 * @author 管类名
 *
 */
public class Ignore {
	
	private List<String> tag;
	private List<String> className;
	private List<String> id;
	
	public List<String> getTag() {
		if(this.tag == null) {
			return new ArrayList<String>();
		}
		return tag;
	}
	public void setTag(List<String> tag) {
		this.tag = tag;
	}
	public List<String> getClassName() {
		if(this.className == null) {
			return new ArrayList<String>();
		}
		return className;
	}
	public void setClassName(List<String> className) {
		this.className = className;
	}
	public List<String> getId() {
		if(this.id == null) {
			return new ArrayList<String>();
		}
		return id;
	}
	public void setId(List<String> id) {
		this.id = id;
	}
	
	
}
