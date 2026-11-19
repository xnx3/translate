package cn.zvo.translate.tcdn.core.vo;

import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.xnx3.BaseVO;

/**
 * 翻译结果。普通文本和整组任务共用此响应类。
 * <p>text、original 外层均为数组，元素可以是字符串或整组对象。
 * 成功整组只包含 words 和可选 order；原始 context、weight 保留在 original 中。</p>
 * @author 管雷鸣
 */
public class TranslateResultVO<T> extends BaseVO implements java.io.Serializable{
	/**
	 * giteeai 添加，当还未购买按量套餐时，返回这个提示，表示账户未激活
	 */
	public final static int ERROR_ACCOUNT_NOT_ACTIVATED=401;
	
	private String from; //将什么语言进行转换
	private String to;  //转换为什么语言输出
	// 与输入任务等长、顺序一致；普通项为字符串，整组项为对象。
	// 成功组的 words 仍按源节点下标排列，仅重排时在该组内附带 order，不增加顶层 order。
	// 失败项在原下标回显原文；整批失败时全部回显，单项失败不覆盖其他项的译文。
	private List<T> text;
	// 原样保存解码后的完整任务，包含 context、words、原始 weight，不注入默认值。
	// 接受普通字符串列表或混合列表，直接保留传入列表，不复制。
	private List<?> original;
	// prompt_tokens、completion_tokens、total_tokens 三个非负整数；最后一项等于前两项之和。
	// 由执行流程按普通文本及 words[].text 的 Unicode 码点计算，不计 context 或 JSON 结构。
	// 此类仅承载计数，不自行计算；旧流程未填充时省略 usage，保留原有响应格式。
	private Map<String, Long> usage;
	
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
	public List<T> getText() {
		return text;
	}
	public void setText(List<T> text) {
		this.text = text;
	}
	
	public List<?> getOriginal() {
		return original;
	}
	public void setOriginal(List<?> original) {
		this.original = original;
	}
	/**
	 * 可选的字符用量统计。只省略未赋值的 usage，不改变其他字段原有的 null 输出规则。
	 */
	@JsonInclude(JsonInclude.Include.NON_NULL)
	public Map<String, Long> getUsage() {
		return usage;
	}
	public void setUsage(Map<String, Long> usage) {
		this.usage = usage;
	}
	@Override
	public String toString() {
		return "TranslateResultVO [from=" + from + ", to=" + to + ", text=" + text + ", original=" + original
				+ ", getResult()=" + getResult() + ", getInfo()=" + getInfo() + "]";
	}
	
	
	
}
