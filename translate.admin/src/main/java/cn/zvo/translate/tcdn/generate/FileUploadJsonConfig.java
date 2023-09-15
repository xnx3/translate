package cn.zvo.translate.tcdn.generate;

import com.xnx3.BaseVO;
import com.xnx3.j2ee.util.SpringUtil;

import cn.zvo.fileupload.config.Config;
import cn.zvo.fileupload.config.ConfigStorageInterface;
import cn.zvo.translate.tcdn.generate.entity.TranslateFileuploadConfig;

/**
 * 文件存储json config相关
 * @author 管雷鸣
 */
public class FileUploadJsonConfig {
	//创建 Config 对象
	public static Config config;
	static {
		config = new Config();
		
		//设置 json 配置存放的方式，比如用户a选择使用华为云存储，华为云ak相关的是啥，进行的持久化存储相关，也就是保存、取得这个。 这里用于演示所以使用一个简单的以文件方式进行存储的
		config.setConfigStorageInterface(new ConfigStorageInterface() {
			public BaseVO save(String key, String json) {
				TranslateFileuploadConfig tfc = new TranslateFileuploadConfig();
				tfc.setId(key);
				tfc.setConfig(json);
				SpringUtil.getSqlService().save(tfc);
				return BaseVO.success();
			}
			public BaseVO get(String key) {
				TranslateFileuploadConfig tfc = SpringUtil.getSqlService().findById(TranslateFileuploadConfig.class, key);
				if(tfc != null) {
					return BaseVO.success(tfc.getConfig());
				}
				return null;
			}
		});
	}

}
