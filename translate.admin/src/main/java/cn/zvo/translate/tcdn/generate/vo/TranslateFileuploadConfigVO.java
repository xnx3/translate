package cn.zvo.translate.tcdn.generate.vo;

import cn.zvo.translate.tcdn.generate.entity.TranslateFileuploadConfig;
import com.xnx3.j2ee.system.responseBody.ResponseBodyManage;
import com.xnx3.j2ee.vo.BaseVO;

/**
 * fileupload的config配置表 详情
 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
 */
@ResponseBodyManage(ignoreField = {}, nullSetDefaultValue = true)
public class TranslateFileuploadConfigVO extends BaseVO {
	private TranslateFileuploadConfig translateFileuploadConfig;	// fileupload的config配置表
	
	public TranslateFileuploadConfig getTranslateFileuploadConfig() {
		return translateFileuploadConfig;
	}
	public void setTranslateFileuploadConfig(TranslateFileuploadConfig translateFileuploadConfig) {
		this.translateFileuploadConfig = translateFileuploadConfig;
	}
	
	@Override
	public String toString() {
		return "TranslateFileuploadConfigVO [translateFileuploadConfig=" + translateFileuploadConfig + "]";
	}
	
}
