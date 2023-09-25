package cn.zvo.translate.tcdn.plugin.phoneReg.controller;

import com.xnx3.StringUtil;
import com.xnx3.j2ee.entity.SmsLog;
import com.xnx3.j2ee.entity.User;
import com.xnx3.j2ee.pluginManage.controller.BasePluginController;
import com.xnx3.j2ee.service.SmsService;
import com.xnx3.j2ee.service.SqlService;
import com.xnx3.j2ee.service.UserService;
import com.xnx3.j2ee.util.ActionLogUtil;
import com.xnx3.j2ee.util.ConsoleUtil;
import com.xnx3.j2ee.vo.BaseVO;

import cn.zvo.translate.tcdn.superadmin.Global;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * 利用手机号自助开通客服
 * @author 管雷鸣
 */
@Controller(value="LeimingyunPhoneRegController")
@RequestMapping("/plugin/phoneReg/")
public class PhoneRegController extends BasePluginController{
	@Resource
	private SqlService sqlService;
	@Resource
	private UserService userService;
	@Resource
	private SmsService smsService;
	

	/**
	 * 通过手机验证注册开通
	 * @param inviteid 上级id，推荐者id，user.id
	 */
	@RequestMapping("reg.do")
	public String reg(HttpServletRequest request, Model model){
		if(getUser() != null){
			//已登陆
			return error(model, "您已登陆，不可再开通了。");
		}

		ActionLogUtil.insert(request, "phoneCreateKefu plugin 打开根据手机号注册页面");
		return "/plugin/phoneCreateStore/reg";
	}
	


	/**
	 * 利用短信通道发送手机号注册的验证码。在用户自行注册开通网站时使用
	 * @param request {@link HttpServletRequest}
	 * 			<br/>form表单需提交参数：phone(发送到的手机号)
	 */
	@RequestMapping(value="sendPhoneRegCode.json", method = RequestMethod.POST)
	@ResponseBody
	public BaseVO sendPhoneRegCode(HttpServletRequest request){
		if(!smsService.useSMS()){
			return error("系统未开启短信发送服务");
		}
		
		//判断手机号是否已被注册使用了
		String phone = filter(request.getParameter("phone"));
		if(phone == null){
			return error("请输入手机号");
		}
		phone = phone.trim();
		if(phone.length() != 11){
			return error("请输入11位手机号");
		}
		if(userService.findByPhone(phone) != null){
			return error("此手机号已注册过了！请更换一个手机号吧");
		}
		
		BaseVO vo = smsService.sendSms(request, phone, "您当前在TCDN平台注册的短信验证码为${code}", SmsLog.TYPE_REG);
		ActionLogUtil.insertUpdateDatabase(request, "phoneCreateSite 发送手机验证码"+(vo.getResult() - BaseVO.SUCCESS == 0 ? "成功":"失败"), "用户获取验证码的手机号："+phone);
		if(vo.getResult() - BaseVO.SUCCESS == 0){
			//成功，将info的验证码去掉
			vo.setInfo("获取成功！");
		}
		
		return vo;
	}

	/**
	 * 用户开通账户并创建客服平台，进行提交保存
	 * @param username 用户名
	 * @param password 密码
	 * @param phone 手机号
	 * @return 若成功，info返回后台登录成功的sessionid
	 */
	@RequestMapping(value="create.json", method = RequestMethod.POST)
	@ResponseBody
	public BaseVO create(HttpServletRequest request,
			@RequestParam(value = "username", required = false , defaultValue="") String username,
			@RequestParam(value = "password", required = false , defaultValue="") String password,
			@RequestParam(value = "phone", required = false , defaultValue="") String phone,
			@RequestParam(value = "code", required = false , defaultValue="") String code
			){
		username = StringUtil.filterXss(username);
		phone = filter(phone);

		//判断用户的短信验证码
		BaseVO verifyVO = smsService.verifyPhoneAndCode(phone, code, SmsLog.TYPE_REG, 300);
		if(verifyVO.getResult() - BaseVO.FAILURE == 0){
			return verifyVO;
		}
		
		User user = new User();
		user.setUsername(username);
		user.setPassword(password);
		user.setAuthority(Global.ROLE_ID_SITEADMIN+"");
		BaseVO vo = userService.createUser(user, request);
		if(vo.getResult() - BaseVO.FAILURE == 0){
			//创建用户失败
			return vo;
		}
		
		//创建用户成功
		ConsoleUtil.log(user.toString());
		ConsoleUtil.log("userid:"+vo.getInfo());
		
		//设置当前用户为登录用户
		userService.loginForUserId(request, user.getId());

		ActionLogUtil.insertUpdateDatabase(request, "通过手机号创建账户成功", user.toString());
		return success(request.getSession().getId());
	}
}
