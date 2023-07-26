package cn.zvo.translate.tcdn.core.entity;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 翻译站点的相关设置
 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
 */
@Entity()
@Table(name = "translate_site_set")
public class TranslateSiteSet implements java.io.Serializable{


	private Integer id;	//对应 translateSite.id 
	private String executeJs;	//在执行页面翻译的操作时，额外执行的js。这个只是在翻译的过程中进行执行，影响的是输出的翻译结果html。它本身并不会追加到输出的html上
	private String htmlAppendJs; //翻译完成后，在html页面中追加的js。 这个会在html最末尾追加

	@Id
	@Column(name = "id", columnDefinition="int(11) COMMENT '对应 translateSite.id'")
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	
	@Column(name = "execute_js", columnDefinition="mediumtext COLLATE utf8mb4_unicode_ci COMMENT '对应的js设置。在执行页面翻译的操作时，额外执行的js。这个只是在翻译的过程中进行执行，影响的是输出的翻译结果html。它本身并不会追加到输出的html上'")
	public String getExecuteJs() {
		if(executeJs == null) {
			return "";
		}
		return executeJs;
	}
	public void setExecuteJs(String executeJs) {
		this.executeJs = executeJs;
	}
	
	@Column(name = "html_append_js", columnDefinition="mediumtext COLLATE utf8mb4_unicode_ci COMMENT '翻译完成后，在html页面中追加的js。 这个会在html最末尾追加'")
	public String getHtmlAppendJs() {
		if(htmlAppendJs == null) {
			return "";
		}
		return htmlAppendJs;
	}
	public void setHtmlAppendJs(String htmlAppendJs) {
		this.htmlAppendJs = htmlAppendJs;
	}
	@Override
	public String toString() {
		return "TranslateSiteSet [id=" + id + ", executeJs=" + executeJs + ", htmlAppendJs=" + htmlAppendJs + "]";
	}
	
}