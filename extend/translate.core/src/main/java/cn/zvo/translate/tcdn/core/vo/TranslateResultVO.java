package cn.zvo.translate.tcdn.core.vo;

import java.util.List;
import com.xnx3.BaseVO;

/**
 * 翻译结果
 * @author 管雷鸣
 *
 */
public class TranslateResultVO extends BaseVO implements java.io.Serializable{
	private String from; //将什么语言进行转换
	private String to;  //转换为什么语言输出
	private List<String> text;	//转换的结果的json数组。<br/>跟传入的数组一一对应。如果 result = 0，响应失败，那这里会将文本原样返回，并不会进行任何翻译
	private List<String> original; //翻译的原文的json数组，跟 text 对应
	
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
	public List<String> getText() {
		return text;
	}
	public void setText(List<String> text) {
		this.text = text;
	}
	
	public List<String> getOriginal() {
		return original;
	}
	public void setOriginal(List<String> original) {
		this.original = original;
	}
	@Override
	public String toString() {
		return "TranslateResultVO [from=" + from + ", to=" + to + ", text=" + text + ", original=" + original
				+ ", getResult()=" + getResult() + ", getInfo()=" + getInfo() + "]";
	}
	
	
	
}
