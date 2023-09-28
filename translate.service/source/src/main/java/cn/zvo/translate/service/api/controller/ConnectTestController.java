package cn.zvo.translate.service.api.controller;

import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.xnx3.BaseVO;
import com.xnx3.UrlUtil;

/**
 * 
 * 连接测试，速度检测
 * @author 管雷鸣
 */
@Controller
@RequestMapping("/")
public class ConnectTestController{
	
	/**
	 * 连接测试，测试接口是否能访问通，以及请求响应时间
	 */
	@ResponseBody
	@RequestMapping(value="connectTest.json")
	public BaseVO ip(HttpServletRequest request,
			@RequestParam(value = "host", required = false , defaultValue="") String host
			) {
		return BaseVO.success(host);
	}
	
}
