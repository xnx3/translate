package cn.zvo.translate.tcdn.generate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.xnx3.BaseVO;
import com.xnx3.DateUtil;
import com.xnx3.Log;
import com.xnx3.j2ee.util.ConsoleUtil;

import cn.zvo.fileupload.FileUpload;
import cn.zvo.fileupload.config.Config;
import cn.zvo.fileupload.config.vo.StorageVO;
import cn.zvo.fileupload.storage.local.LocalStorage;
import cn.zvo.fileupload.vo.UploadFileVO;
import cn.zvo.translate.tcdn.core.entity.TranslateSite;
import cn.zvo.translate.tcdn.core.entity.TranslateSiteDomain;
import cn.zvo.translate.tcdn.core.util.TranslateApiRequestUtil;
import cn.zvo.translate.tcdn.generate.bean.LanguageBean;
import cn.zvo.translate.tcdn.generate.bean.PageBean;
import cn.zvo.translate.tcdn.generate.bean.SiteBean;
import cn.zvo.translate.tcdn.generate.bean.TaskBean;

/**
 * 翻译页面生成的入口
 * @author 管雷鸣
 *
 */
public class Task {
	public static TaskBean taskBean;
	public static boolean isTasking; //当前是否正在翻译中，有翻译正在进行，则是true
	
	static{
		taskBean = new TaskBean();
		isTasking = false;
		
		new Thread(new Runnable() {
			
			@Override
			public void run() {
				
				while(true) {
					
					try {
						Thread.sleep(10000);
					} catch (InterruptedException e1) {
						e1.printStackTrace();
					}
					
					try {
						BaseVO vo = Task.execute();
						ConsoleUtil.info(vo.toString()+" - Task Thread");
					} catch (Exception e) {
						e.printStackTrace();
					}
					
				}
				
				
			}
		}).start();
	}
	
	public static void main(String[] args) {
		
	}
	
	public static void add(TranslateSite site, List<TranslateSiteDomain> domainList) {
		SiteBean siteBean = new SiteBean();
		siteBean.setSite(site);
		
		for (int i = 0; i < domainList.size(); i++) {
			LanguageBean languageBean = new LanguageBean();
			languageBean.setDomain(domainList.get(i));
			languageBean.getPageList().add(new PageBean("/")); //index.html
//			languageBean.setStorage(storage);
			siteBean.getLanguageList().add(languageBean);
		}
		
		//加入翻译的任务队列
		Global.taskList.add(siteBean);
	}
	
	public static void add(TranslateSite site, TranslateSiteDomain domain, List<PageBean> pageList) {
		SiteBean siteBean = new SiteBean();
		siteBean.setSite(site);
		
		LanguageBean languageBean = new LanguageBean();
		languageBean.setDomain(domain);
		languageBean.setPageList(pageList);
//			languageBean.getPageList().add(new PageBean("/")); //index.html
//			languageBean.setStorage(storage);
		siteBean.getLanguageList().add(languageBean);
		
		//加入翻译的任务队列
		Global.taskList.add(siteBean);
	}
	
	
	/**
	 * 当前是否有等待进行翻译的任务（尚未翻译、翻译中还没完成）
	 * @return true 有，  false没有
	 */
	public static boolean isHaveWaitTask() {
//		for (int i = 0; i < Global.taskList.size(); i++) {
//			SiteBean siteBean = Global.taskList.get(i);
//			if(siteBean.getIsTrans() != -1) {
//				return true;
//			}
//		}
		
//		return false;
		return isTasking;
	}
	
	/**
	 * 获取某个 siteBean 的翻译执行日志
	 * @param siteUrl
	 */
	public static void log(String siteUrl) {
		SiteBean siteBean = null;
		for (int i = 0; i < Global.taskList.size(); i++) {
			siteBean = Global.taskList.get(i);
			if(siteBean.getSite().getUrl().equalsIgnoreCase(siteUrl)) {
				//找到了，跳出循环
				continue;
			}
		}
		
		if(siteBean == null) {
			//未找到，未赋值
			return;
		}
		
		//System.out.println(siteBean);
	}
	
	//执行翻译任务
	public static BaseVO execute() {
		isTasking = false;
		if(isTasking) {
			return BaseVO.failure("执行失败，当前正在有翻译任务在执行");
		}
		
		isTasking = true;
		for (int i = 0; i < Global.taskList.size(); i++) {
			SiteBean siteBean = Global.taskList.get(i);
			if(siteBean.getIsTrans() == -1) {
				//已翻译完，跳过
				continue;
			}
			
			for (int j = 0; j < siteBean.getLanguageList().size(); j++) {
				LanguageBean languageBean = siteBean.getLanguageList().get(j);
				if(languageBean.getIsTrans() == -1) {
					//已翻译完，跳过
					continue;
				}
				
				//文件存储
				StorageVO storageVO = Config.get(languageBean.getDomain().getId()+"");
				if(storageVO.getResult() - StorageVO.FAILURE == 0) {
					//获取文件存储失败
					Log.error("获取文件存储失败："+storageVO.getInfo()+", domainid:"+languageBean.getDomain().getId());
					continue;
				}
				FileUpload fileupload = storageVO.getFileupload();
				
				for (int k = 0; k < languageBean.getPageList().size(); k++) {
					PageBean pageBean = languageBean.getPageList().get(k);
					if(pageBean.getIsTrans() == -1) {
						//已翻译完，跳过
						continue;
					}
					if(pageBean.getIsTrans() >= 3) {
						//已尝试了三次了还没成功，那么直接就不翻译了
						continue;
					}
					
					
//					System.out.println("execute---"+pageBean.toString());
					
					String domian = siteBean.getSite().getUrl();
					BaseVO vo = TranslateApiRequestUtil.trans(domian, languageBean.getDomain().getDomain(), domian+pageBean.getPath(), "false", languageBean.getDomain().getLanguage(), null, null);
//					System.out.println(vo);
					
					/**** Log ****/
					Map<String, Object> map = new HashMap<String, Object>();
					map.put("siteid", siteBean.getSite().getId());
					map.put("userid", siteBean.getSite().getId());
					map.put("taskid", siteBean.getTaskid());
					map.put("local_language", siteBean.getSite().getLanguage()); //本地语种
					map.put("time", DateUtil.timeForUnix10());	//完成时间，13位时间戳
					map.put("attempts_number", pageBean.getIsTrans()+1); //当前的尝试次数，当前是第几次， 1~3
					map.put("target_language", languageBean.getDomain().getLanguage()); //翻译为的语种
					map.put("domainid", languageBean.getDomain().getId());	//site_domain.id
					map.put("page_path", pageBean.getPath());	//当前翻译的页面，比如 / 可能是首页， 又或者 /ab/c.html
					
					if(vo.getResult() - BaseVO.FAILURE == 0) {
						pageBean.setIsTrans(pageBean.getIsTrans()+1);
					
						//翻译失败，在尝试一次本次翻译
						pageBean.setErrorInfo(vo.getInfo());
						Log.error(domian+pageBean.getPath()+"翻译失败："+vo.getInfo());
						
						/** log **/
						map.put("result", "FAILURE"); //翻译结果-翻译成功，  SUCCESS 成功， FAILURE 失败
						map.put("failure_info",vo.getInfo()); //如果result为失败，这里是失败的原因
						cn.zvo.translate.tcdn.generate.Log.log.add(map);
						/****** end ******/
						
						k--;
						continue;
					}
					
					//成功
					pageBean.setIsTrans(-1);
					pageBean.setTime(DateUtil.timeForUnix10());
					
					
					/**** Log ****/
					map.put("result", "SUCCESS"); //翻译结果-翻译成功，  SUCCESS 成功， FAILURE 失败
					map.put("failure_info",""); //如果result为失败，这里是失败的原因
					cn.zvo.translate.tcdn.generate.Log.log.add(map);
					/****** end ******/
					
					
					//存储
					String uploadPath = pageBean.getPath();
					
					//如果第一个字符是 / ，那么去掉
					if(uploadPath.indexOf("/") == 0) {
						uploadPath = uploadPath.substring(1, uploadPath.length());
					}
					if(uploadPath.lastIndexOf("/") == uploadPath.length()-1) {
						//最后一个字符是 "/" ，那么追加上 index.html
						uploadPath = uploadPath + "index.html";
					}
					UploadFileVO uploadVO = fileupload.uploadString(uploadPath, vo.getInfo(), true);
					System.out.println("存储结果："+uploadVO.toString());
					if(uploadVO.getResult() - UploadFileVO.FAILURE == 0) {
						//存储失败，后面的也就不用翻译了
						k = languageBean.getPageList().size() + 1;
						pageBean.setErrorInfo("翻译成功，但将翻译之后的网页存储时失败:"+uploadVO.getInfo());
						continue;
					}
				}
				
				languageBean.setIsTrans(-1);
				languageBean.setTime(DateUtil.timeForUnix10());
			}
			siteBean.setIsTrans(-1);
			siteBean.setTime(DateUtil.timeForUnix10());
			
		}
		
		isTasking = false; //标记没有正在翻译的了
		return BaseVO.success();
	}
}
