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
import cn.zvo.log.vo.LogListVO;
import cn.zvo.translate.tcdn.core.entity.TranslateSite;
import cn.zvo.translate.tcdn.core.entity.TranslateSiteDomain;
import cn.zvo.translate.tcdn.generate.Log;
import cn.zvo.translate.tcdn.generate.Task;
import cn.zvo.translate.tcdn.generate.bean.PageBean;
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
		BaseVO vo = new BaseVO();
		
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
		
		TranslateSite site = sqlService.findById(TranslateSite.class, domain.getSiteid());
		
		//取 sitemap.xml
//		if(false) {
		boolean sitemapFind = false;
		
		Http http = new Http();
		Response res = null;
		try {
			res = http.get(site.getUrl() + "/sitemap.xml");
			if(res.getCode() != 200) {
				sitemapFind = false;
				//return error("响应异常，http code:"+res.getCode()+", content:"+res.getContent());
			}else {
				sitemapFind = true;
			}
		} catch (IOException e) {
			e.printStackTrace();
			sitemapFind = false;
			//return error("未发现 http://www.wang.market/sitemap.xml 存在，错误代码："+e.getMessage());
		}
		
		
		if(sitemapFind) {
			//true，存在这个文件，从这个文件取数据
			
			List<String> urlList = SitemapUtil.analysis(res.getContent());
			if(urlList.size() == 0) {
				return error("sitemap.xml 中未发现url");
			}
			
			if(urlList.size() > 100) {
				return error("异常，您的sitemap.xml中的页面超过了100，可以联系官方放开限制");
			}
			
			List<PageBean> pageList = new ArrayList<PageBean>();
			for (int i = 0; i < urlList.size(); i++) {
				String url = urlList.get(i);
				pageList.add(new PageBean(url));
			}
			
			Task.add(site, domain, pageList);
			vo.setBaseVO(BaseVO.SUCCESS, "检测到您网站有 sitemap.xml 存在，已根据其自动取得"+pageList.size()+"个页面，已提交翻译任务进行排队，可关注翻译日志查看翻译情况");
		}else {
			//不存在，只是翻译首页吧
			List<TranslateSiteDomain> domainList = new ArrayList<TranslateSiteDomain>();
			domainList.add(domain);
			
			Task.add(site, domainList);
			vo.setBaseVO(BaseVO.SUCCESS, "检测到您网站没有 sitemap.xml ，本次将只是进行翻译网站首页进行测试，已将网站首页提交翻译任务进行排队，可关注翻译日志查看翻译情况");
		}
		
		ActionLogUtil.insert(request, "翻译生成并推送到自定义存储", domainid+"");
		return vo;
	}
	
	/**
	 * 查看翻译日志
	 * @param domainid translate_site_domain.id
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value = "log.json", method = {RequestMethod.POST})
	public LogListVO log(
	        // TODO [tag-9]
			@RequestParam(value = "domainid", required = false, defaultValue = "0") int domainid,
			@RequestParam(value = "currentPage", required = false, defaultValue = "1") int currentPage,
			HttpServletRequest request) {
		
		String query = "userid="+getUserId();
		query = "";
		LogListVO vo = Log.log.list(query, 25, currentPage);
		
		return vo;
	}
	
}