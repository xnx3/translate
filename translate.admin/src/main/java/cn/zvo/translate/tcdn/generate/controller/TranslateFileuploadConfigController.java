package cn.zvo.translate.tcdn.generate.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.xnx3.j2ee.controller.BaseController;
import com.xnx3.j2ee.service.SqlService;
import com.xnx3.j2ee.util.ActionLogUtil;
import com.xnx3.j2ee.vo.BaseVO;
import cn.zvo.translate.tcdn.generate.entity.TranslateFileuploadConfig;
import cn.zvo.translate.tcdn.generate.vo.TranslateFileuploadConfigVO;

/**
 * fileupload的config配置表
 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
 */
@Controller(value = "TranslateFileuploadConfigController")
@RequestMapping("/translate/generate/translateFileuploadConfig/")
public class TranslateFileuploadConfigController extends BaseController {

	@Resource
	private SqlService sqlService;
	
	/**
	 * 获取某条的数据
	 * @param token 当前操作用户的登录标识 <required>
	 * 			<a href="xxxxx.html">/xxxx/login.json</a> 取得</p>
	 * @param id 主键
	 * @return 若成功，则可获取此条信息
	 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
	 */
	@ResponseBody
	@RequestMapping(value = "details.json", method = {RequestMethod.POST})
	public TranslateFileuploadConfigVO details(HttpServletRequest request,
			@RequestParam(value = "id", required = false, defaultValue = "") String id) {
		TranslateFileuploadConfigVO vo = new TranslateFileuploadConfigVO();

		if(id != null && id.length() > 0) {
			TranslateFileuploadConfig entity = sqlService.findById(TranslateFileuploadConfig.class, id);
			if(entity == null){
				entity = new TranslateFileuploadConfig();
				entity.setId(id);
				entity.setConfig("");
				sqlService.save(entity);
			}
			vo.setTranslateFileuploadConfig(entity);
			ActionLogUtil.insert(request, "获取 translate_fileupload_config.id 为 " + id + " 的信息", entity.toString());
		}else {
			vo.setBaseVO(BaseVO.FAILURE, "请传入id");
			return vo;
		}
		
		return vo;
	}
	
	/**
	 * 添加或修改一条记录
	 * @param token 当前操作用户的登录标识 <required>
	 * 			<a href="xxxxx.html">/xxxx/login.json</a> 取得</p>
	 * TODO [tag-8] 
	 * @param id 站点id，对应 translate_site.id 
	 * @param config fileupload的config配置 
	 * @return 保存结果
	 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
	 */
	@ResponseBody
	@RequestMapping(value = "save.json", method = {RequestMethod.POST})
	public BaseVO save(
	        // TODO [tag-9]
			@RequestParam(value = "id", required = false, defaultValue = "") String id,
			@RequestParam(value = "config", required = false, defaultValue = "") String config,
			HttpServletRequest request) {

        /**
         * TODO 添加编辑功能调整
         * 说明：
         * 	1.根据实际需求，调整要传递的参数，以及保存的数据
         * 		* 详见 tag-8，tag-9，tag-10
         * 	2.根据实际需求，在添加或编辑时，主动设置部分字段的值
         * 		* 例如：添加时设置创建时间 entity.setCreateTime(nowTime);
         *  3.根据实际需求，调整jsp页面内容
         *  	* 例如：删除不需要保存的字段；不能编辑的字段，将其input隐藏。
         *  	* 页面位置：src/main/webapp/translate/generate/translateFileuploadConfig/edit.jsp
         *  	* 详见页面中 tag-11
         */

		// 创建一个实体
		TranslateFileuploadConfig entity = sqlService.findById(TranslateFileuploadConfig.class, id);
		if(entity == null) {
			return error("根据id，没查到该信息");
		}
		
		// TODO [tag-10] 给实体赋值 
		entity.setConfig(config);
		// 保存实体
		sqlService.save(entity);
		
		// 日志记录
		ActionLogUtil.insertUpdateDatabase(request, "修改 translate_fileupload_config.id 为 " + id + " 的记录", entity.toString());
		
		return success(entity.getId()+"");
	}
	
}