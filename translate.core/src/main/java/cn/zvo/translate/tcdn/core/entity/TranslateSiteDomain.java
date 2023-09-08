package cn.zvo.translate.tcdn.core.entity;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

/**
 * 翻译站点绑定域名相关
 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
 */
@Entity()
@Table(name = "translate_site_domain", indexes={@Index(name="suoyin_index",columnList="userid,name,language,siteid")})
public class TranslateSiteDomain implements java.io.Serializable{


	private Integer id;	//自动编号
	private Integer siteid;	//对应 translateSite.id 
	private String domain;	//绑定的域名，比如 english.xxxxxx.com 
	private String language;	//翻译语种，要翻译为的语种,该域名访问看到的语种。如 english ，跟 http://api.translate.zvo.cn/doc/language.json.html 这里的值对应 
	private Integer userid;	//此条记录属于哪个用户,user.id
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "id", columnDefinition="int(11) COMMENT '自动编号'")
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	@Column(name = "domain", columnDefinition="char(50) COMMENT '绑定的域名，比如 english.xxxxxx.com'")
	public String getDomain() {
		return domain;
	}
	public void setDomain(String domain) {
		this.domain = domain;
	}
	@Column(name = "language", columnDefinition="char(20) COMMENT '翻译语种，要翻译为的语种,该域名访问看到的语种。如 english ，跟 http://api.translate.zvo.cn/doc/language.json.html 这里的值对应'")
	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	@Column(name = "siteid", columnDefinition="int(11) COMMENT '对应 translateSite.id '")
	public Integer getSiteid() {
		return siteid;
	}
	public void setSiteid(Integer siteid) {
		this.siteid = siteid;
	}
	@Column(name = "userid", columnDefinition="int(11) COMMENT '此条记录属于哪个用户,user.id'")
	public Integer getUserid() {
		return userid;
	}
	public void setUserid(Integer userid) {
		this.userid = userid;
	}
	@Override
	public String toString() {
		return "TranslateSiteDomain [id=" + id + ", siteid=" + siteid + ", domain=" + domain + ", language=" + language
				+ ", userid=" + userid + "]";
	}
	
	
}