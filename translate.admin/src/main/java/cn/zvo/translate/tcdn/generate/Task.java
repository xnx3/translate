package cn.zvo.translate.tcdn.generate;

import com.xnx3.BaseVO;
import com.xnx3.DateUtil;

import cn.zvo.fileupload.FileUpload;
import cn.zvo.fileupload.storage.local.LocalStorage;
import cn.zvo.fileupload.vo.UploadFileVO;
import cn.zvo.translate.tcdn.core.entity.TranslateSite;
import cn.zvo.translate.tcdn.core.util.TranslateApiRequestUtil;
import cn.zvo.translate.tcdn.generate.bean.LanguageBean;
import cn.zvo.translate.tcdn.generate.bean.PageBean;
import cn.zvo.translate.tcdn.generate.bean.SiteBean;

/**
 * 翻译页面生成的入口
 * @author 管雷鸣
 *
 */
public class Task {
	
	public static void main(String[] args) {
		
	}
	
	public static void add(String siteUrl) {
		LocalStorage storage = new LocalStorage();
		storage.setLocalFilePath("G:\\git\\translate\\translate.admin\\target\\");
		
		
		
		
		
		
		LanguageBean languageBean = new LanguageBean();
		languageBean.setLanguage("english");
		languageBean.setStorage(storage);
		languageBean.getPageList().add(new PageBean("/index.html"));
//		languageBean.getPageList().add(new PageBean("/plugin.html"));
		
		SiteBean siteBean = new SiteBean();
		TranslateSite site = new TranslateSite();
		site.setUrl(siteUrl);
		siteBean.setSite(site);
		siteBean.getLanguageList().add(languageBean);
		
		//加入翻译的任务队列
		Global.taskList.add(siteBean);
	}
	
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
		
		System.out.println(siteBean);
	}
	
	//执行翻译任务
	public static void execute() {
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
				FileUpload fileupload = new FileUpload();
				fileupload.setStorage(languageBean.getStorage());
				
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
					BaseVO vo = TranslateApiRequestUtil.trans(domian, domian+"/english", domian+pageBean.getPath(), "false", languageBean.getLanguage(), null, null);
//					System.out.println(vo);
					
					if(vo.getResult() - BaseVO.FAILURE == 0) {
						pageBean.setIsTrans(pageBean.getIsTrans()+1);
					
						//翻译失败，在尝试一次本次翻译
						k--;
						pageBean.setErrorInfo(vo.getInfo());
						continue;
					}
					
					//成功
					pageBean.setIsTrans(-1);
					pageBean.setTime(DateUtil.timeForUnix10());
					
					//存储
					UploadFileVO uploadVO = fileupload.uploadString(languageBean.getLanguage() + pageBean.getPath(), vo.getInfo(), true);
					System.out.println(uploadVO.toString());
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
	}
}
