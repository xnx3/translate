package cn.zvo.translate.tcdn.generate.controller;

import java.util.Map;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.xnx3.Lang;
import com.xnx3.j2ee.controller.BaseController;
import com.xnx3.j2ee.service.SqlService;
import com.xnx3.j2ee.util.SpringUtil;
import com.xnx3.j2ee.vo.BaseVO;
import cn.zvo.fileupload.config.Config;
import cn.zvo.fileupload.config.ConfigStorageInterface;
import cn.zvo.fileupload.config.vo.ConfigVO;
import cn.zvo.translate.tcdn.core.entity.TranslateSiteDomain;
import cn.zvo.translate.tcdn.generate.entity.TranslateFileuploadConfig;
import net.sf.json.JSONObject;

/**
 * fileupload的config配置表
 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
 */
@Controller(value = "TranslateFileuploadConfigController")
@RequestMapping("/translate/generate/translateFileuploadConfig/")
public class TranslateFileuploadConfigController extends BaseController {
	@Resource
	private SqlService sqlService;
	
	static {
		//设置 json 配置存放的方式，比如用户a选择使用华为云存储，华为云ak相关的是啥，进行的持久化存储相关，也就是保存、取得这个。 这里用于演示所以使用一个简单的以文件方式进行存储的
		Config.setConfigStorageInterface(new ConfigStorageInterface() {
			public BaseVO save(String key, String json) {
				SqlService sqlService = SpringUtil.getSqlService();
				TranslateFileuploadConfig tfc = sqlService.findById(TranslateFileuploadConfig.class, key);
				if(tfc == null) {
					tfc = new TranslateFileuploadConfig();
					tfc.setId(key);
				}
				tfc.setConfig(json);
				sqlService.save(tfc);
				return BaseVO.success();
			}
			public BaseVO get(String key) {
				SqlService sqlService = SpringUtil.getSqlService();
				TranslateFileuploadConfig tfc = sqlService.findById(TranslateFileuploadConfig.class, key);
				if(tfc == null) {
					return BaseVO.success("");
				}else {
					return BaseVO.success(tfc.getConfig());
				}
			}
		});
	}


	/**
	 * 获取配置
	 */
	@ResponseBody
	@RequestMapping(value = "config.json")
	public ConfigVO config(
			@RequestParam(value = "key", required = false, defaultValue = "0") String key,
			@RequestParam(value = "config", required = false, defaultValue = "") String config,
			HttpServletRequest request, HttpServletResponse response) {
		response.setHeader("Access-Control-Allow-Origin", "*");
		
		//判断key - 也就是 site_domain.id 是否属于这个用户
		int siteDomainId = Lang.stringToInt(key, 0);
		TranslateSiteDomain domain = sqlService.findById(TranslateSiteDomain.class, siteDomainId);
		if(domain == null) {
			ConfigVO vo = new ConfigVO();
			vo.setBaseVO(ConfigVO.FAILURE, "域名翻译记录不存在");
			return vo;
		}
		if(domain.getUserid() - getUserId() != 0) {
			ConfigVO vo = new ConfigVO();
			vo.setBaseVO(ConfigVO.FAILURE, "域名翻译记录不属于您，无权操作");
			return vo;
		}
		
		//获取当前所有的存储方式
		ConfigVO vo = Config.getAllStorage(key);
		
		int deleteIndex = -1;
		for (int i = 0; i < vo.getStorageList().size(); i++) {
			if(vo.getStorageList().get(i).getId().equalsIgnoreCase("cn.zvo.fileupload.storage.local.LocalStorage")) {
				deleteIndex = i;
				break;
			}
		}
		if(deleteIndex > -1) {
			vo.getStorageList().remove(deleteIndex);
		}
		
		
		return vo;
	}
	
	/**
	 * 保存配置
	 */
	@ResponseBody
	@RequestMapping(value = "save.json")
	public BaseVO save(
			HttpServletRequest request, HttpServletResponse response) {
		response.setHeader("Access-Control-Allow-Origin", "*");
		
		String key = request.getParameter("key");
		
		//判断key - 也就是 site_domain.id 是否属于这个用户
		int siteDomainId = Lang.stringToInt(key, 0);
		TranslateSiteDomain domain = sqlService.findById(TranslateSiteDomain.class, siteDomainId);
		if(domain == null) {
			return error("域名翻译记录不存在");
		}
		if(domain.getUserid() - getUserId() != 0) {
			return error("域名翻译记录不属于您，无权操作");
		}
		
		
		//取 config
		JSONObject config = new JSONObject();
		Map<String, String[]> params = request.getParameterMap();
		for (Map.Entry<String, String[]> entry : params.entrySet()) {
		    //System.out.println(entry.getKey() + ": " + entry.getValue()[0]);
		    config.put(entry.getKey(), entry.getValue()[0]);
		}
		//删除storage
		config.remove("storage");
		
		//当前保存的storage
		String storage = request.getParameter("storage");
		
		JSONObject json = new JSONObject();
		json.put("storage", storage);
		json.put("config", config);
		
		com.xnx3.BaseVO vo = Config.save(key, json.toString());
		if(vo.getResult() - BaseVO.FAILURE == 0) {
			return error(vo.getInfo());
		}
		return success();
	}
}