package cn.zvo.translate.tcdn.superadmin.controller;

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
import com.xnx3.j2ee.util.Page;
import com.xnx3.j2ee.util.Sql;
import com.xnx3.j2ee.vo.BaseVO;
import cn.zvo.translate.tcdn.admin.vo.TranslateSiteSetListVO;
import cn.zvo.translate.tcdn.admin.vo.TranslateSiteSetVO;
import cn.zvo.translate.tcdn.core.entity.TranslateSiteSet;
import cn.zvo.translate.tcdn.superadmin.Global;

/**
 * 用户相关
 * @author <a href="https://github.com/xnx3/writecode">WriteCode自动生成</a>
 */
@Controller(value = "TranslateSuperadminUserController")
@RequestMapping("/superadmin/user/")
public class UserController extends BaseController {

	@Resource
	private SqlService sqlService;
	@Resource
	private UserService userService;
	

	/**
	 * 添加网站管理员
	 * @param username 开通物业需要传入，开通的物业管理员登录的username
	 * @param password 开通物业需要传入，开通的物业管理员登录的password
	 */
	@RequiresPermissions("userAddSuperadmin")
	@ResponseBody
	@RequestMapping(value = "add.json", method = {RequestMethod.POST})
	public BaseVO save(
	        // TODO [tag-9]
			@RequestParam(value = "username", required = false, defaultValue = "") String username,
			@RequestParam(value = "password", required = false, defaultValue = "") String password,
			HttpServletRequest request) {
		
		//创建 User 用户
		User user = new User();
		user.setUsername(username);
		user.setPassword(password);
		user.setAuthority(""+Global.ROLE_ID_SITEADMIN);
		BaseVO userVO = userService.createUser(user, request);
		if(userVO.getResult() - BaseVO.FAILURE == 0){
			return error(userVO.getInfo());
		}

		ActionLogUtil.insertUpdateDatabase(request, "添加网站管理人员", user.toString());
		
		return success(user.getId()+"");
	}
	
}