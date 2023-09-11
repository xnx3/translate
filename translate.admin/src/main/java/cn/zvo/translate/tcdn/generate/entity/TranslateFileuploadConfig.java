package cn.zvo.translate.tcdn.generate.entity;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * fileupload的config配置表
 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
 */
@Entity()
@Table(name = "translate_fileupload_config")
public class TranslateFileuploadConfig implements java.io.Serializable{

	private String id;	//站点的翻译域名id，对应 translate_site_domain.id 
	private String config;	//fileupload的config配置 

	@Id
	@Column(name = "id", columnDefinition="char(32) COMMENT '站点的翻译域名id，对应 translate_site_domain.id'")
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	@Column(name = "config", columnDefinition="text(65535) COMMENT 'fileupload的config配置'")
	public String getConfig() {
		return config;
	}
	public void setConfig(String config) {
		this.config = config;
	}

	@Override
	public String toString() {
		return "{id : "+this.id+", config : "+this.config+"}";
	}
}