package cn.zvo.translate.tcdn.generate.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.xnx3.j2ee.controller.BaseController;
import com.xnx3.j2ee.entity.User;
import com.xnx3.j2ee.service.SqlService;
import com.xnx3.j2ee.service.UserService;
import com.xnx3.j2ee.util.ActionLogUtil;
import com.xnx3.j2ee.vo.BaseVO;

import cn.zvo.fileupload.config.vo.StorageVO;
import cn.zvo.http.Http;
import cn.zvo.http.Response;
import cn.zvo.translate.tcdn.core.entity.TranslateSite;
import cn.zvo.translate.tcdn.core.entity.TranslateSiteDomain;
import cn.zvo.translate.tcdn.generate.Task;
import cn.zvo.translate.tcdn.generate.entity.TranslateFileuploadConfig;
import cn.zvo.translate.tcdn.generate.util.SitemapUtil;
import cn.zvo.translate.tcdn.superadmin.Global;
import net.sf.json.JSONArray;

/**
 * 用户相关
 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
 */
@Controller(value = "TranslateGenerateController")
@RequestMapping("/translate/generate/")
public class GenerateController extends BaseController {

	@Resource
	private SqlService sqlService;
	@Resource
	private UserService userService;
	
	/**
	 * 添加网站管理员
	 * @param domainid TranslateSiteDomain.id 要生成的是哪个 TranslateSiteDomain
	 */
	@ResponseBody
	@RequestMapping(value = "generate.json", method = {RequestMethod.POST})
	public BaseVO generate(
	        // TODO [tag-9]
			@RequestParam(value = "domainid", required = false, defaultValue = "0") int domainid,
			HttpServletRequest request) {
		TranslateSiteDomain domain = sqlService.findById(TranslateSiteDomain.class, domainid);
		if(domain == null) {
			return error("根据id，没查到该翻译域名");
		}
		if(domain.getUserid() - getUserId() != 0) {
			return error("记录不属于您，无权操作");
		}
		
		//检测是否配置了fileupload
		TranslateFileuploadConfig config = sqlService.findById(TranslateFileuploadConfig.class, domain.getId()+"");
		if(config == null || config.getConfig().length() < 5) {
			return error("请先设置存储配置");
		}
		
		//取 sitemap.xml
		if(false) {
			Http http = new Http();
			Response res;
			try {
				res = http.get("http://www.wang.market/sitemap.xml");
			} catch (IOException e) {
				e.printStackTrace();
				return error("未发现 http://www.wang.market/sitemap.xml 存在，错误代码："+e.getMessage());
			}
			if(res.getCode() != 200) {
				return error("响应异常，http code:"+res.getCode()+", content:"+res.getContent());
			}
			
			List<String> urlList = SitemapUtil.analysis(res.getContent());
			if(urlList.size() == 0) {
				return error("sitemap.xml 中未发现url");
			}
			
			
			
		}
		
		
		
		TranslateSite site = sqlService.findById(TranslateSite.class, domain.getSiteid());
		List<TranslateSiteDomain> domainList = new ArrayList<TranslateSiteDomain>();
		domainList.add(domain);
		
		Task.add(site, domainList);
		com.xnx3.BaseVO taskVO = Task.execute();
		if(taskVO.getResult() - BaseVO.FAILURE == 0) {
			return error(taskVO.getInfo());
		}
		Task.log(site.getUrl());
		
		ActionLogUtil.insert(request, "翻译生成并推送到自定义存储", domainid+"");
		return success();
	}
	
	/**
	 * 查看翻译日志
	 * @param domainid translate_site_domain.id
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "log.json", method = {RequestMethod.GET})
	public BaseVO log(
	        // TODO [tag-9]
			@RequestParam(value = "domainid", required = false, defaultValue = "0") int domainid,
			HttpServletRequest request) {
		
		System.out.println(JSONArray.fromObject(cn.zvo.translate.tcdn.generate.Global.taskList).toString());
		
		return success();
	}
	
}