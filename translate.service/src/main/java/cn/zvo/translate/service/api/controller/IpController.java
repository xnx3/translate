package cn.zvo.translate.service.api.controller;

import java.util.regex.Pattern;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import com.xnx3.BaseVO;
import com.xnx3.Lang;
import cn.zvo.translate.service.core.util.IpUtil;
import cn.zvo.translate.tcdn.core.vo.IpVO;

/**
 * 
 * ip接口
 * @author 管雷鸣
 */
@Controller
@RequestMapping("/")
public class IpController{
	
	/**
	 * 获取IP位置信息
	 * @return 位置及其使用的语种
	 * @author 管雷鸣
	 * 注意，这个要放到服务器中才能用，本地测试会找不到ip2region.xdb
	 */
	@ResponseBody
	@RequestMapping(value="ip.json", method = RequestMethod.POST)
	public IpVO ip(HttpServletRequest request) {
		String ip = getIpAddress(request);
//		String ip = request.getRemoteAddr();
//		System.out.println("ip:\t"+ip);
//		System.out.println(request.getHeader("x-forwarded-for"));
//		System.out.println(request.getHeader("host"));
		IpVO vo = new IpVO();
		
		//不为空
		if(ip.length() == 0) {
			vo.setBaseVO(BaseVO.FAILURE, "请传入IP");
			return vo;
		}
		
		//判断是否是ip
		Pattern pattern = Pattern.compile("^((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]"
				+ "|[*])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]|[*])$");
		if(!pattern.matcher(ip).matches()) {
			vo.setBaseVO(BaseVO.FAILURE, "传入的"+ip+"不是一个有效的ip");
			return vo;
		}
		
		BaseVO resultVO = IpUtil.search(ip);
		vo.setBaseVO(resultVO);
		if(resultVO.getResult() - BaseVO.SUCCESS == 0) {
			vo.setBaseVO(BaseVO.SUCCESS, "SUCCESS");
			vo.setCountry(resultVO.getInfo());
			vo.setLanguage(IpUtil.countryToLanguage(vo.getCountry()));
		}else {
			vo.setBaseVO(BaseVO.FAILURE, resultVO.getInfo());
		}
		
		return vo;
	}
	

	/**
	 * 获取IP地址，只会返回一个IP
	 * @param request
	 * @return <li>成功：返回一个ip
	 * 			<li>失败：返回null
	 */
	public static String getIpAddress(HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
		if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if(ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		
		//如果有多个ip，拿最前面的
		if(ip.indexOf(",")>0){
			ip=Lang.subString(ip, null, ",", 2);
		}
		
		if(ip.equals("0:0:0:0:0:0:0:1")){
			ip = "127.0.0.1";
		}
		return ip;
	} 
	
}
