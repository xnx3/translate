package cn.zvo.translate.service.core.util;

import org.lionsoul.ip2region.xdb.Searcher;
import com.xnx3.BaseVO;
import com.xnx3.Log;
import com.xnx3.StringUtil;
import com.xnx3.SystemUtil;

import cn.zvo.translate.tcdn.core.LanguageEnum;

import java.io.*;
import java.util.concurrent.TimeUnit;

/**
 * IP相关
 * @author 管雷鸣
 */
public class IpUtil{
	static String dbPath = "G:\\git\\translate_service\\src\\main\\java\\cn\\zvo\\translate\\core\\util\\ip2region.xdb";
	static Searcher searcher;
	
	public static Searcher getSearcher() {
		if(searcher == null) {
			String dbPath = getProjectPath()+"WEB-INF/lib/ip2region.xdb";
			System.out.println(dbPath);
			
			// 1、从 dbPath 中预先加载 VectorIndex 缓存，并且把这个得到的数据作为全局变量，后续反复使用。
	        byte[] vIndex;
	        try {
	            vIndex = Searcher.loadVectorIndexFromFile(dbPath);
	        } catch (Exception e) {
	            System.out.printf("failed to load vector index from `%s`: %s\n", dbPath, e);
	            return null;
	        }
	        
	        // 2、使用全局的 vIndex 创建带 VectorIndex 缓存的查询对象。
	        try {
	            searcher = Searcher.newWithVectorIndex(dbPath, vIndex);
	        } catch (Exception e) {
	            System.out.printf("failed to create vectorIndex cached searcher with `%s`: %s\n", dbPath, e);
	            return null;
	        }
		}
		return searcher;
	}
	
	/**
	 * 查询指定的ip在哪个国家
	 * @param ip ip地址，传入如 1.2.3.4
	 * @return
	 */
	public static BaseVO search(String ip) {
		// 3、查询
//        String ip = "156.236.74.70";
        try {
            long sTime = System.nanoTime();
            String region = getSearcher().search(ip);
            long cost = TimeUnit.NANOSECONDS.toMicros((long) (System.nanoTime() - sTime));
            //System.out.printf("{region: %s, ioCount: %d, took: %d μs}\n", region, searcher.getIOCount(), cost);
            return BaseVO.success(StringUtil.subString(region, null, "|", 2));
        } catch (Exception e) {
            System.out.printf("failed to search(%s): %s\n", ip, e);
            return BaseVO.failure(e.getMessage());
        }
	}
	
	/**
	 * 将国家名转为这个国家使用的语言
	 * @param country 传入如 中国
	 * @return 返回如chinese_simplified 如果没有匹配到，默认返回english
	 */
	public static String countryToLanguage(String country) {
		if(country == null) {
			return LanguageEnum.ENGLISH.id;
		}
		
		if(country.equals("中国") || country.equals("新加坡")) {
			return LanguageEnum.CHINESE_SIMPLIFIED.id;
		}else if(country.equals("美国")) {
			return LanguageEnum.ENGLISH.id;
//		}else if(country.equals("日本")) {
//			return LanguageEnum.JAPANESE.id;
		}else if(country.equals("韩国")) {
			return LanguageEnum.KOREAN.id;
		}
		else if(country.equals("澳大利亚")){
			return LanguageEnum.KOREAN.id;
		}

		else if(country.equals("日本")) {return LanguageEnum.JAPANESE.id;}
		else if(country.equals("泰国")) {return LanguageEnum.THAI.id;}
		else if(country.equals("印度")) {return LanguageEnum.ENGLISH.id;}
		else if(country.equals("马来西亚")) {return LanguageEnum.MALAY.id;}//马来语
		else if(country.equals("韩国")) {return LanguageEnum.KOREAN.id;}
//		else if(country.equals("柬埔寨")) {return LanguageEnum.柬埔寨.id;}
		else if(country.equals("菲律宾")) {return LanguageEnum.FILIPINO.id;}
		else if(country.equals("越南")) {return LanguageEnum.VIETNAMESE.id;}
		else if(country.equals("法国")) {return LanguageEnum.FRENCH.id;}
		else if(country.equals("波兰")) {return LanguageEnum.POLISH.id;}
		else if(country.equals("捷克")) {return LanguageEnum.CZECH.id;}
		else if(country.equals("德国")) {return LanguageEnum.GERMAN.id;}
		else if(country.equals("荷兰")) {return LanguageEnum.DUTCH.id;}
		else if(country.equals("西班牙")) {return LanguageEnum.SPANISH.id;}
//		else if(country.equals("奥地利")) {return LanguageEnum.奥地利.id;}
//		else if(country.equals("瑞士")) {return LanguageEnum.瑞士.id;}
		else if(country.equals("英国")) {return LanguageEnum.ENGLISH.id;}
//		else if(country.equals("巴西")) {return LanguageEnum.巴西.id;}
		else if(country.equals("意大利")) {return LanguageEnum.ITALIAN.id;}
		else if(country.equals("希腊")) {return LanguageEnum.GREEK.id;}
		else if(country.equals("爱尔兰")) {return LanguageEnum.IRISH.id;}
		else if(country.equals("丹麦")) {return LanguageEnum.DANISH.id;}
		else if(country.equals("葡萄牙")) {return LanguageEnum.PORTUGUESE.id;}
		else if(country.equals("瑞典")) {return LanguageEnum.SWEDISH.id;}
//		else if(country.equals("加纳")) {return LanguageEnum.加纳.id;}
		else if(country.equals("土耳其")) {return LanguageEnum.TURKISH.id;}
		else if(country.equals("俄罗斯")) {return LanguageEnum.BELARUSIAN.id;}//白俄罗斯
//		else if(country.equals("欧洲")) {return LanguageEnum.欧洲.id;}
//		else if(country.equals("喀麦隆")) {return LanguageEnum.喀麦隆.id;}
		else if(country.equals("南非")) {return LanguageEnum.AFRIKAANS.id;}//南非荷兰语
		else if(country.equals("芬兰")) {return LanguageEnum.FINNISH.id;}
//		else if(country.equals("阿联酋")) {return LanguageEnum.阿联酋.id;}
//		else if(country.equals("约旦")) {return LanguageEnum.约旦.id;}
//		else if(country.equals("比利时")) {return LanguageEnum.比利时.id;}
		else if(country.equals("罗马尼亚")) {return LanguageEnum.ROMANIAN.id;}
		else if(country.equals("卢森堡")) {return LanguageEnum.LUXEMBOURGISH.id;}
//		else if(country.equals("阿根廷")) {return LanguageEnum.阿根廷.id;}
//		else if(country.equals("乌干达")) {return LanguageEnum.乌干达.id;}
		else if(country.equals("亚美尼亚")) {return LanguageEnum.ARMENIAN.id;}
//		else if(country.equals("坦桑尼亚")) {return LanguageEnum.坦桑尼亚.id;}
//		else if(country.equals("布隆迪")) {return LanguageEnum.布隆迪.id;}
//		else if(country.equals("乌拉圭")) {return LanguageEnum.乌拉圭.id;}
//		else if(country.equals("智利")) {return LanguageEnum.智利.id;}
		else if(country.equals("保加利亚")) {return LanguageEnum.BULGARIAN.id;}
		else if(country.equals("乌克兰")) {return LanguageEnum.UKRAINIAN.id;}
//		else if(country.equals("加拿大")) {return LanguageEnum.加拿大.id;}
//		else if(country.equals("以色列")) {return LanguageEnum.以色列.id;}
//		else if(country.equals("卡塔尔")) {return LanguageEnum.卡塔尔.id;}
//		else if(country.equals("摩尔多瓦")) {return LanguageEnum.摩尔多瓦.id;}
//		else if(country.equals("伊拉克")) {return LanguageEnum.伊拉克.id;}
		else if(country.equals("拉脱维亚")) {return LanguageEnum.LATVIAN.id;}
		else if(country.equals("挪威")) {return LanguageEnum.NORWEGIAN.id;}
		else if(country.equals("克罗地亚")) {return LanguageEnum.CROATIAN.id;}
		else if(country.equals("爱沙尼亚")) {return LanguageEnum.ESTONIAN.id;}
//		else if(country.equals("巴勒斯坦")) {return LanguageEnum.巴勒斯坦.id;}
		else if(country.equals("匈牙利")) {return LanguageEnum.HUNGARIAN.id;}
		else if(country.equals("立陶宛")) {return LanguageEnum.LITHUANIAN.id;}
//		else if(country.equals("哥伦比亚")) {return LanguageEnum.哥伦比亚.id;}
//		else if(country.equals("哥斯达黎加")) {return LanguageEnum.哥斯达黎加.id;}
		else if(country.equals("哈萨克斯坦")) {return LanguageEnum.KAZAKH.id;}//哈萨克语
//		else if(country.equals("沙特阿拉伯")) {return LanguageEnum.沙特阿拉伯.id;}
//		else if(country.equals("伊朗")) {return LanguageEnum.伊朗.id;}
//		else if(country.equals("巴林")) {return LanguageEnum.巴林.id;}
//		else if(country.equals("牙买加")) {return LanguageEnum.牙买加.id;}
		else if(country.equals("斯洛文尼亚")) {return LanguageEnum.SLOVENE.id;}
//		else if(country.equals("美属维尔京群岛")) {return LanguageEnum.美属维尔京群岛.id;}
//		else if(country.equals("巴拿马")) {return LanguageEnum.巴拿马.id;}
//		else if(country.equals("墨西哥")) {return LanguageEnum.墨西哥.id;}
		else if(country.equals("叙利亚")) {return LanguageEnum.SYRIAC.id;}
//		else if(country.equals("科威特")) {return LanguageEnum.科威特.id;}
//		else if(country.equals("黎巴嫩")) {return LanguageEnum.黎巴嫩.id;}
//		else if(country.equals("阿曼")) {return LanguageEnum.阿曼.id;}
		else if(country.equals("格鲁吉亚")) {return LanguageEnum.GEORGIAN.id;}
		else if(country.equals("阿塞拜疆")) {return LanguageEnum.AZERBAIJANI.id;}
//		else if(country.equals("赞比亚")) {return LanguageEnum.赞比亚.id;}
		else if(country.equals("刚果金")) {return LanguageEnum.KIKONGO.id;}//刚果语
//		else if(country.equals("安哥拉")) {return LanguageEnum.安哥拉.id;}
		else if(country.equals("斯洛伐克")) {return LanguageEnum.SLOVAK.id;}
		else if(country.equals("塞尔维亚")) {return LanguageEnum.SERBIAN.id;}
		else if(country.equals("冰岛")) {return LanguageEnum.ICELANDIC.id;}
		else if(country.equals("马其顿")) {return LanguageEnum.MACEDONIAN.id;}
//		else if(country.equals("列支敦士登")) {return LanguageEnum.列支敦士登.id;}
//		else if(country.equals("泽西岛")) {return LanguageEnum.泽西岛.id;}
//		else if(country.equals("波黑")) {return LanguageEnum.波黑.id;}
//		else if(country.equals("吉尔吉斯斯坦")) {return LanguageEnum.吉尔吉斯斯坦.id;}
//		else if(country.equals("留尼旺")) {return LanguageEnum.留尼旺.id;}
		else if(country.equals("塔吉克斯坦")) {return LanguageEnum.TAJIK.id;}//塔吉克语
//		else if(country.equals("马恩岛")) {return LanguageEnum.马恩岛.id;}
//		else if(country.equals("直布罗陀")) {return LanguageEnum.直布罗陀.id;}
//		else if(country.equals("利比亚")) {return LanguageEnum.利比亚.id;}
//		else if(country.equals("也门")) {return LanguageEnum.也门.id;}
		else if(country.equals("白俄罗斯")) {return LanguageEnum.BELARUSIAN.id;}
//		else if(country.equals("马约特")) {return LanguageEnum.马约特.id;}
//		else if(country.equals("瓜德罗普")) {return LanguageEnum.瓜德罗普.id;}
//		else if(country.equals("圣马丁")) {return LanguageEnum.圣马丁.id;}
//		else if(country.equals("马提尼克")) {return LanguageEnum.马提尼克.id;}
//		else if(country.equals("圭亚那")) {return LanguageEnum.圭亚那.id;}
//		else if(country.equals("塞浦路斯")) {return LanguageEnum.塞浦路斯.id;}
		else if(country.equals("阿尔巴尼亚")) {return LanguageEnum.ALBANIAN.id;}
//		else if(country.equals("乌兹别克斯坦")) {return LanguageEnum.乌兹别克斯坦.id;}
//		else if(country.equals("科索沃")) {return LanguageEnum.科索沃.id;}
//		else if(country.equals("古巴")) {return LanguageEnum.古巴.id;}
//		else if(country.equals("印度尼西亚")) {return LanguageEnum.印度尼西亚.id;}
//		else if(country.equals("不丹")) {return LanguageEnum.不丹.id;}
//		else if(country.equals("关岛")) {return LanguageEnum.关岛.id;}
//		else if(country.equals("委内瑞拉")) {return LanguageEnum.委内瑞拉.id;}
//		else if(country.equals("波多黎各")) {return LanguageEnum.波多黎各.id;}
		else if(country.equals("蒙古")) {return LanguageEnum.MONGOLIAN.id;}
//		else if(country.equals("新西兰")) {return LanguageEnum.新西兰.id;}
		else if(country.equals("孟加拉")) {return LanguageEnum.BENGALI.id;}
//		else if(country.equals("巴基斯坦")) {return LanguageEnum.巴基斯坦.id;}
//		else if(country.equals("巴布亚新几内亚")) {return LanguageEnum.巴布亚新几内亚.id;}
//		else if(country.equals("特立尼达和多巴哥")) {return LanguageEnum.特立尼达和多巴哥.id;}
//		else if(country.equals("莱索托")) {return LanguageEnum.莱索托.id;}
//		else if(country.equals("厄瓜多尔")) {return LanguageEnum.厄瓜多尔.id;}
//		else if(country.equals("斯里兰卡")) {return LanguageEnum.斯里兰卡.id;}
//		else if(country.equals("埃及")) {return LanguageEnum.埃及.id;}
//		else if(country.equals("秘鲁")) {return LanguageEnum.秘鲁.id;}
//		else if(country.equals("北美地区")) {return LanguageEnum.北美地区.id;}
//		else if(country.equals("尼日利亚")) {return LanguageEnum.尼日利亚.id;}
//		else if(country.equals("格林纳达")) {return LanguageEnum.格林纳达.id;}
//		else if(country.equals("库拉索")) {return LanguageEnum.库拉索.id;}
//		else if(country.equals("巴巴多斯")) {return LanguageEnum.巴巴多斯.id;}
//		else if(country.equals("巴哈马")) {return LanguageEnum.巴哈马.id;}
//		else if(country.equals("圣卢西亚")) {return LanguageEnum.圣卢西亚.id;}
		else if(country.equals("尼泊尔")) {return LanguageEnum.NEPALI.id;}
//		else if(country.equals("托克劳群岛")) {return LanguageEnum.托克劳群岛.id;}
//		else if(country.equals("马尔代夫")) {return LanguageEnum.马尔代夫.id;}
//		else if(country.equals("阿富汗")) {return LanguageEnum.阿富汗.id;}
//		else if(country.equals("新喀里多尼亚")) {return LanguageEnum.新喀里多尼亚.id;}
//		else if(country.equals("斐济")) {return LanguageEnum.斐济.id;}
//		else if(country.equals("瓦利斯和富图纳群岛")) {return LanguageEnum.瓦利斯和富图纳群岛.id;}
//		else if(country.equals("阿尔及利亚")) {return LanguageEnum.阿尔及利亚.id;}
//		else if(country.equals("圣马力诺")) {return LanguageEnum.圣马力诺.id;}
		else if(country.equals("黑山")) {return LanguageEnum.MONTENEGRIN.id;}
//		else if(country.equals("格陵兰")) {return LanguageEnum.格陵兰.id;}
//		else if(country.equals("摩纳哥")) {return LanguageEnum.摩纳哥.id;}
//		else if(country.equals("几内亚")) {return LanguageEnum.几内亚.id;}
//		else if(country.equals("根西岛")) {return LanguageEnum.根西岛.id;}
		else if(country.equals("马耳他")) {return LanguageEnum.MALTESE.id;}
		else if(country.equals("缅甸")) {return LanguageEnum.BURMESE.id;}
//		else if(country.equals("百慕大")) {return LanguageEnum.百慕大.id;}
//		else if(country.equals("圣文森特和格林纳丁斯")) {return LanguageEnum.圣文森特和格林纳丁斯.id;}
//		else if(country.equals("安提瓜和巴布达")) {return LanguageEnum.安提瓜和巴布达.id;}
//		else if(country.equals("津巴布韦")) {return LanguageEnum.津巴布韦.id;}
//		else if(country.equals("利比里亚")) {return LanguageEnum.利比里亚.id;}
//		else if(country.equals("肯尼亚")) {return LanguageEnum.肯尼亚.id;}
//		else if(country.equals("博茨瓦纳")) {return LanguageEnum.博茨瓦纳.id;}
//		else if(country.equals("莫桑比克")) {return LanguageEnum.莫桑比克.id;}
//		else if(country.equals("突尼斯")) {return LanguageEnum.突尼斯.id;}
//		else if(country.equals("马达加斯加")) {return LanguageEnum.马达加斯加.id;}
//		else if(country.equals("纳米比亚")) {return LanguageEnum.纳米比亚.id;}
//		else if(country.equals("科特迪瓦")) {return LanguageEnum.科特迪瓦.id;}
//		else if(country.equals("苏丹")) {return LanguageEnum.苏丹.id;}
//		else if(country.equals("马拉维")) {return LanguageEnum.马拉维.id;}
//		else if(country.equals("加蓬")) {return LanguageEnum.加蓬.id;}
//		else if(country.equals("马里")) {return LanguageEnum.马里.id;}
//		else if(country.equals("贝宁")) {return LanguageEnum.贝宁.id;}
//		else if(country.equals("乍得")) {return LanguageEnum.乍得.id;}
//		else if(country.equals("佛得角")) {return LanguageEnum.佛得角.id;}
		else if(country.equals("卢旺达")) {return LanguageEnum.KINYARWANDA.id;}
		else if(country.equals("刚果布")) {return LanguageEnum.KIKONGO.id;}//刚果语
//		else if(country.equals("冈比亚")) {return LanguageEnum.冈比亚.id;}
		else if(country.equals("毛里求斯")) {return LanguageEnum.MAURITIAN_CREOLE.id;}//毛里求斯克里奥尔语
//		else if(country.equals("斯威士兰")) {return LanguageEnum.斯威士兰.id;}
//		else if(country.equals("布基纳法索")) {return LanguageEnum.布基纳法索.id;}
		else if(country.equals("索马里")) {return LanguageEnum.SOMALI.id;}
//		else if(country.equals("塞拉利昂")) {return LanguageEnum.塞拉利昂.id;}
//		else if(country.equals("尼日尔")) {return LanguageEnum.尼日尔.id;}
//		else if(country.equals("中非")) {return LanguageEnum.中非.id;}
//		else if(country.equals("多哥")) {return LanguageEnum.多哥.id;}
//		else if(country.equals("南苏丹")) {return LanguageEnum.南苏丹.id;}
//		else if(country.equals("赤道几内亚")) {return LanguageEnum.赤道几内亚.id;}
//		else if(country.equals("塞舌尔")) {return LanguageEnum.塞舌尔.id;}
//		else if(country.equals("塞内加尔")) {return LanguageEnum.塞内加尔.id;}
//		else if(country.equals("吉布提")) {return LanguageEnum.吉布提.id;}
//		else if(country.equals("摩洛哥")) {return LanguageEnum.摩洛哥.id;}
//		else if(country.equals("毛里塔尼亚")) {return LanguageEnum.毛里塔尼亚.id;}
//		else if(country.equals("科摩罗")) {return LanguageEnum.科摩罗.id;}
//		else if(country.equals("英属印度洋领地")) {return LanguageEnum.英属印度洋领地.id;}
		else if(country.equals("老挝")) {return LanguageEnum.LAO.id;}
//		else if(country.equals("瑙鲁")) {return LanguageEnum.瑙鲁.id;}
//		else if(country.equals("多米尼加")) {return LanguageEnum.多米尼加.id;}
//		else if(country.equals("瓦努阿图")) {return LanguageEnum.瓦努阿图.id;}
//		else if(country.equals("北马里亚纳群岛")) {return LanguageEnum.北马里亚纳群岛.id;}
//		else if(country.equals("密克罗尼西亚")) {return LanguageEnum.密克罗尼西亚.id;}
//		else if(country.equals("法属波利尼西亚")) {return LanguageEnum.法属波利尼西亚.id;}
//		else if(country.equals("东帝汶")) {return LanguageEnum.东帝汶.id;}
//		else if(country.equals("汤加")) {return LanguageEnum.汤加.id;}
//		else if(country.equals("洪都拉斯")) {return LanguageEnum.洪都拉斯.id;}
//		else if(country.equals("玻利维亚")) {return LanguageEnum.玻利维亚.id;}
//		else if(country.equals("伯利兹")) {return LanguageEnum.伯利兹.id;}
//		else if(country.equals("文莱")) {return LanguageEnum.文莱.id;}
//		else if(country.equals("巴拉圭")) {return LanguageEnum.巴拉圭.id;}
//		else if(country.equals("萨尔瓦多")) {return LanguageEnum.萨尔瓦多.id;}
//		else if(country.equals("危地马拉")) {return LanguageEnum.危地马拉.id;}
//		else if(country.equals("尼加拉瓜")) {return LanguageEnum.尼加拉瓜.id;}
//		else if(country.equals("安道尔")) {return LanguageEnum.安道尔.id;}
//		else if(country.equals("法罗群岛")) {return LanguageEnum.法罗群岛.id;}
//		else if(country.equals("纽埃")) {return LanguageEnum.纽埃.id;}
//		else if(country.equals("厄立特里亚")) {return LanguageEnum.厄立特里亚.id;}
//		else if(country.equals("埃塞俄比亚")) {return LanguageEnum.埃塞俄比亚.id;}
//		else if(country.equals("圣多美和普林西比")) {return LanguageEnum.圣多美和普林西比.id;}
//		else if(country.equals("土库曼斯坦")) {return LanguageEnum.土库曼斯坦.id;}
//		else if(country.equals("多米尼克")) {return LanguageEnum.多米尼克.id;}
		else if(country.equals("海地")) {return LanguageEnum.HAITIAN_CREOLE.id;}//海地克里奥尔语
//		else if(country.equals("圣基茨和尼维斯")) {return LanguageEnum.圣基茨和尼维斯.id;}
//		else if(country.equals("阿鲁巴")) {return LanguageEnum.阿鲁巴.id;}
//		else if(country.equals("特克斯和凯科斯群岛")) {return LanguageEnum.特克斯和凯科斯群岛.id;}
//		else if(country.equals("开曼群岛")) {return LanguageEnum.开曼群岛.id;}
//		else if(country.equals("马绍尔群岛")) {return LanguageEnum.马绍尔群岛.id;}
//		else if(country.equals("美属萨摩亚")) {return LanguageEnum.美属萨摩亚.id;}
//		else if(country.equals("荷属圣马丁")) {return LanguageEnum.荷属圣马丁.id;}
//		else if(country.equals("英属维尔京群岛")) {return LanguageEnum.英属维尔京群岛.id;}
//		else if(country.equals("安圭拉")) {return LanguageEnum.安圭拉.id;}
//		else if(country.equals("圣皮埃尔和密克隆群岛")) {return LanguageEnum.圣皮埃尔和密克隆群岛.id;}
//		else if(country.equals("奥兰群岛")) {return LanguageEnum.奥兰群岛.id;}
//		else if(country.equals("福克兰群岛")) {return LanguageEnum.福克兰群岛.id;}
//		else if(country.equals("法属圭亚那")) {return LanguageEnum.法属圭亚那.id;}
//		else if(country.equals("法国南部领地")) {return LanguageEnum.法国南部领地.id;}
		else if(country.equals("梵蒂冈")) {return LanguageEnum.SANSKRIT.id;}//梵语
//		else if(country.equals("所罗门群岛")) {return LanguageEnum.所罗门群岛.id;}
//		else if(country.equals("非洲地区")) {return LanguageEnum.非洲地区.id;}
//		else if(country.equals("南乔治亚岛和南桑威奇群岛")) {return LanguageEnum.南乔治亚岛和南桑威奇群岛.id;}
//		else if(country.equals("基里巴斯")) {return LanguageEnum.基里巴斯.id;}
//		else if(country.equals("帕劳")) {return LanguageEnum.帕劳.id;}
//		else if(country.equals("诺福克岛")) {return LanguageEnum.诺福克岛.id;}
		else if(country.equals("萨摩亚")) {return LanguageEnum.SAMOAN.id;}
//		else if(country.equals("亚太地区")) {return LanguageEnum.亚太地区.id;}
//		else if(country.equals("图瓦卢")) {return LanguageEnum.图瓦卢.id;}
//		else if(country.equals("几内亚比绍")) {return LanguageEnum.几内亚比绍.id;}
//		else if(country.equals("苏里南")) {return LanguageEnum.苏里南.id;}
//		else if(country.equals("朝鲜")) {return LanguageEnum.朝鲜.id;}
//		else if(country.equals("南极洲")) {return LanguageEnum.南极洲.id;}
//		else if(country.equals("圣巴泰勒米")) {return LanguageEnum.圣巴泰勒米.id;}
//		else if(country.equals("阿森松岛")) {return LanguageEnum.阿森松岛.id;}
//		else if(country.equals("蒙塞拉特岛")) {return LanguageEnum.蒙塞拉特岛.id;}
//		else if(country.equals("安的列斯")) {return LanguageEnum.安的列斯.id;}
//		else if(country.equals("库克群岛")) {return LanguageEnum.库克群岛.id;}
//		else if(country.equals("圣诞岛")) {return LanguageEnum.圣诞岛.id;}



		/*
		 * 
		 * 待完善，具体语言参考 https://gitee.com/lionsoul/ip2region/blob/master/data/global_region.csv
		 * 
		 */
		
		
		return LanguageEnum.ENGLISH.id;
	}
	
	
	public static void main(String[] args) {
        
       

        // 3、查询
        String ip = "156.236.74.70";
        try {
            long sTime = System.nanoTime();
            String region = searcher.search(ip);
            long cost = TimeUnit.NANOSECONDS.toMicros((long) (System.nanoTime() - sTime));
            System.out.printf("{region: %s, ioCount: %d, took: %d μs}\n", region, searcher.getIOCount(), cost);
        } catch (Exception e) {
            System.out.printf("failed to search(%s): %s\n", ip, e);
        }
        
        // 4、关闭资源
        try {
            searcher.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
        

        // 备注：每个线程需要单独创建一个独立的 Searcher 对象，但是都共享全局的制度 vIndex 缓存。
    }
	
	
	private static String projectPath;
	/**
	 * 当前项目再硬盘的路径，绝对路径。
	 * <br/>返回格式如 /Users/apple/git/wangmarket/target/classes/  最后会加上 /
	 * <br/>如果是在编辑器中开发时运行，返回的是 /Users/apple/git/wangmarket/target/classes/ 这种，最后是有 /target/classes/ 的
	 * <br/>如果是在实际项目中运行，也就是在服务器的Tomcat中运行，返回的是 /mnt/tomcat8/webapps/ROOT/ 这样的，最后是结束到 ROOT/ 下
	 */
	public static String getProjectPath(){
		if(projectPath == null){
			String path = new IpUtil().getClass().getResource("/").getPath();
			projectPath = path.replace("WEB-INF/classes/", "");
			Log.info("projectPath : "+projectPath);
		}
		return projectPath;
	}
}
