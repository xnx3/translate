package cn.zvo.translate.tcdn.core.vo;

import com.xnx3.BaseVO;
import net.sf.json.JSONArray;

/**
 * 翻译结果
 * @author 管雷鸣
 *
 */
public class TranslateResultVO extends BaseVO implements java.io.Serializable{
	private String from; //将什么语言进行转换
	private String to;  //转换为什么语言输出
	private JSONArray text;	//转换的结果的json数组。<br/>跟传入的数组一一对应。如果 result = 0，响应失败，那这里会将文本原样返回，并不会进行任何翻译
	
	public String getFrom() {
		return from;
	}
	public void setFrom(String from) {
		this.from = from;
	}
	public String getTo() {
		return to;
	}
	public void setTo(String to) {
		this.to = to;
	}
	public JSONArray getText() {
		return text;
	}
	public void setText(JSONArray text) {
		this.text = text;
	}
	@Override
	public String toString() {
		return "TranslateResultVO [from=" + from + ", to=" + to + ", text=" + text + ", getResult()=" + getResult()
				+ ", getInfo()=" + getInfo() + "]";
	}
	
	
}
