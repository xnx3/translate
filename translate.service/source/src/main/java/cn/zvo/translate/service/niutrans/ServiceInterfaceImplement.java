package cn.zvo.translate.service.niutrans;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import cn.zvo.http.Https;
import cn.zvo.http.Response;
import cn.zvo.translate.service.core.util.JSONUtil;
import cn.zvo.translate.tcdn.core.LanguageEnum;
import cn.zvo.translate.tcdn.core.service.Language;
import cn.zvo.translate.tcdn.core.service.ServiceInterface;
import cn.zvo.translate.tcdn.core.vo.TranslateResultVO;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
/**
 * 对接小牛翻译提供的翻译服务
 * @author 管雷鸣
 *
 */
public class ServiceInterfaceImplement implements ServiceInterface{
	static Https https; //http请求工具类，使用参考 https://github.com/xnx3/http.java
	static {
		https = new Https();
	}
	// 文本翻译请求地址
	private static final String TRANS_API_URL = "https://api.niutrans.com/NiuTransServer/translation";
	
	
	// apikey  
	private String apikey;
	
	public ServiceInterfaceImplement(Map<String, String> config) {
		if(config == null) {
			return;
		}
		this.apikey = config.get("apikey");
	}
	

	public static void main(String[] args) {

		Map<String, String> config = new HashMap<String, String>();
		config.put("apikey", "1234");

		ServiceInterfaceImplement service = new ServiceInterfaceImplement(config);
		service.setLanguage();

		JSONArray array = new JSONArray();
		array.add("你好");
		array.add("世界");

		TranslateResultVO vo = service.api("zh", "en", array);
		System.out.println("vo === "+vo);
		
		
	}

	@Override
	public TranslateResultVO api(String from, String to, JSONArray array) {
		TranslateResultVO vo = new TranslateResultVO();
		vo.setText(new JSONArray());
		
		List<JSONArray> list = JSONUtil.split(array, 5000); //长度不能超过5000字符，所以针对5000进行截取
		for (int i = 0; i < list.size(); i++) {
			TranslateResultVO vf = requestApi(from, to, list.get(i));
			if(vf.getResult() - TranslateResultVO.FAILURE == 0) {
				return vf;
			}
//			System.out.println(i+", "+vf.toString());
			
			vo.getText().addAll(vf.getText());
		}
		
		vo.setFrom(from);
		vo.setTo(to);
		return vo;
	}

	@Override
	public void setLanguage() {
//		if(Language.map.get("niutrans") != null) {
//			return;
//		}
		
		Language lang = new Language("niutrans");
		/*
		 * 向语种列表中追加支持的语种，以下注意只需要改第二个参数为对接的翻译服务中，人家的api语种标识即可
		 */
		
		//	--------------------------小牛start（386条小牛数据）---------------------------------
		//	----------------------------------------------------------------------------------
		//	----------------------------------------------------------------------------------
		//	----------------------------------------------------------------------------------
		//	----------------------------------------------------------------------------------
		//	----------------------------------------------------------------------------------
		//	----------------------------------------------------------------------------------


		lang.append(LanguageEnum.ALBANIAN, "sq");//阿尔巴尼亚语
		lang.append(LanguageEnum.ARABIC, "ar");//阿拉伯语
		lang.append(LanguageEnum.AMHARIC, "am");//阿姆哈拉语
		lang.append(LanguageEnum.AZERBAIJANI, "az");//阿塞拜疆语
		lang.append(LanguageEnum.IRISH, "ga");//爱尔兰语
		lang.append(LanguageEnum.ESTONIAN, "et");//爱沙尼亚语
		lang.append(LanguageEnum.EWE, "ee");//埃维语
		lang.append(LanguageEnum.OROMO, "om");//奥罗莫语
		lang.append(LanguageEnum.ORIYA, "or");//奥利亚语
		lang.append(LanguageEnum.AYMARA, "aym");//艾马拉语
		lang.append(LanguageEnum.BASHKIR, "ba");//巴什基尔语
		lang.append(LanguageEnum.BASQUE, "eu");//巴斯克语
		lang.append(LanguageEnum.BELARUSIAN, "be");//白俄罗斯语
		lang.append(LanguageEnum.HMONG, "mww");//白苗文
		lang.append(LanguageEnum.BERBER, "ber");//柏柏尔语
		lang.append(LanguageEnum.BULGARIAN, "bg");//保加利亚语
		lang.append(LanguageEnum.ICELANDIC, "is");//冰岛语
		lang.append(LanguageEnum.BISLAMA, "bi");//比斯拉马语
		lang.append(LanguageEnum.POLISH, "pl");//波兰语
		lang.append(LanguageEnum.BOSNIAN, "bs");//波斯尼亚语
		lang.append(LanguageEnum.PERSIAN, "fa");//波斯语
		lang.append(LanguageEnum.BRETON, "br");//布列塔尼语
		lang.append(LanguageEnum.BAMBARA, "bam");//班巴拉语
		lang.append(LanguageEnum.CHUVASH, "cv");//楚瓦什语
		lang.append(LanguageEnum.XITSONGA, "ts");//聪加语
		lang.append(LanguageEnum.TATAR, "tt");//鞑靼语
		lang.append(LanguageEnum.DANISH, "da");//丹麦语
		lang.append(LanguageEnum.DEUTSCH, "de");//德语
		lang.append(LanguageEnum.TETUN, "tet");//德顿语
		lang.append(LanguageEnum.DHIVEHI, "dv");//迪维希语
		lang.append(LanguageEnum.RUSSIAN, "ru");//俄语
		lang.append(LanguageEnum.FRENCH, "fr");//法语
		lang.append(LanguageEnum.FAROESE, "fo");//法罗语
		lang.append(LanguageEnum.FILIPINO, "fil");//菲律宾语
		lang.append(LanguageEnum.FINNISH, "fi");//芬兰语
		lang.append(LanguageEnum.KHMER, "km");//高棉语
		lang.append(LanguageEnum.KIKONGO, "kg");//刚果语
		lang.append(LanguageEnum.FRISIAN, "fy");//弗里西语
		lang.append(LanguageEnum.GEORGIAN, "jy");//格鲁吉亚语
		lang.append(LanguageEnum.GUJARATI, "gu");//古吉拉特语
		lang.append(LanguageEnum.KAZAKH, "ka");//哈萨克语
		lang.append(LanguageEnum.HAITIAN_CREOLE, "ht");//海地克里奥尔语
		lang.append(LanguageEnum.KOREAN, "ko");//韩语
		lang.append(LanguageEnum.HAUSA, "ha");//豪萨语
		lang.append(LanguageEnum.DUTCH, "nl");//荷兰语
		lang.append(LanguageEnum.MONTENEGRIN, "me");//黑山语
		lang.append(LanguageEnum.HAKHA_CHIN, "cnh");//哈卡钦语
		lang.append(LanguageEnum.KYRGYZ, "ky");//吉尔吉斯语
		lang.append(LanguageEnum.GALICIAN, "gl");//加利西亚语
		lang.append(LanguageEnum.CATALAN, "ca");//加泰罗尼亚语
		lang.append(LanguageEnum.CZECH, "cs");//捷克语
		lang.append(LanguageEnum.KABYLE, "kab");//卡拜尔语
		lang.append(LanguageEnum.KANNADA, "kn");//卡纳达语
		lang.append(LanguageEnum.CORSICAN, "co");//科西嘉语
		lang.append(LanguageEnum.CROATIAN, "hr");//克罗地亚语
		lang.append(LanguageEnum.KURDISH_SORANI, "ckb");//库尔德语(索拉尼语)
		lang.append(LanguageEnum.CRIMEAN_TATAR, "crh");//克里米亚鞑靼语
		lang.append(LanguageEnum.KINYARWANDA, "rw");//卢旺达语
		lang.append(LanguageEnum.LATIN, "la");//拉丁语
		lang.append(LanguageEnum.LATVIAN, "lv");//拉脱维亚语
		lang.append(LanguageEnum.LAO, "lo");//老挝语
		lang.append(LanguageEnum.LITHUANIAN, "lt");//立陶宛语
		lang.append(LanguageEnum.LINGALAJIA, "ln");//林加拉语
		lang.append(LanguageEnum.LUGANDA, "lg");//卢干达语
		lang.append(LanguageEnum.LUXEMBOURGISH, "lb");//卢森堡语
		lang.append(LanguageEnum.ROMANIAN, "ro");//罗马尼亚语
		lang.append(LanguageEnum.ROMANI, "rmn");//罗姆语
		lang.append(LanguageEnum.MALAGASY, "mg");//马尔加什语
		lang.append(LanguageEnum.MALTESE, "mt");//马耳他语
		lang.append(LanguageEnum.MARATHI, "mr");//马拉地语
		lang.append(LanguageEnum.MALAYALAM, "ml");//马拉雅拉姆语
		lang.append(LanguageEnum.MALAY, "ms");//马来语
		lang.append(LanguageEnum.MACEDONIAN, "mk");//马其顿语
		lang.append(LanguageEnum.MAORI, "mi");//毛利语
		lang.append(LanguageEnum.MONGOLIAN, "mo");//蒙古语
		lang.append(LanguageEnum.BURMESE, "my");//缅甸语
		lang.append(LanguageEnum.BENGALI, "bn");//孟加拉语
		lang.append(LanguageEnum.MARSHALLESE, "mah");//马绍尔语
		lang.append(LanguageEnum.MIZO, "lus");//米佐语
		lang.append(LanguageEnum.MAURITIAN_CREOLE, "mfe");//毛里求斯克里奥尔语
		lang.append(LanguageEnum.AFRIKAANS, "af");//南非荷兰语
		lang.append(LanguageEnum.AFRIKAANS_XHOSA, "xh");//南非科萨语
		lang.append(LanguageEnum.SOUTH_AFRICAN_ZULU, "zu");//南非祖鲁语
		lang.append(LanguageEnum.NEPALI, "ne");//尼泊尔语
		lang.append(LanguageEnum.NORWEGIAN, "no");//挪威语
		lang.append(LanguageEnum.PAPIAMENTO, "pap");//帕皮阿门托语
		lang.append(LanguageEnum.PUNJABI, "pa");//旁遮普语
		lang.append(LanguageEnum.PORTUGUESE, "pt");//葡萄牙语
		lang.append(LanguageEnum.PASHTO, "ps");//普什图语
		lang.append(LanguageEnum.NYANJA, "ny");//齐切瓦语
		lang.append(LanguageEnum.TWI, "tw");//契维语
		lang.append(LanguageEnum.JAPANESE, "ja");//日语
		lang.append(LanguageEnum.SWEDISH, "sv");//瑞典语
		lang.append(LanguageEnum.SAMOAN, "sm");//萨摩亚语
		lang.append(LanguageEnum.SERBIAN, "sr");//塞尔维亚语
		lang.append(LanguageEnum.SESOTHO, "st");//塞索托语
		lang.append(LanguageEnum.SINGAPORE, "si");//僧伽罗语
		lang.append(LanguageEnum.ESPERANTO, "eo");//世界语
		lang.append(LanguageEnum.SLOVAK, "sk");//斯洛伐克语
		lang.append(LanguageEnum.SLOVENE, "sl");//斯洛文尼亚语
		lang.append(LanguageEnum.SWAHILI, "sw");//斯瓦希里语
		lang.append(LanguageEnum.SCOTTISH_GAELIC, "gd");//苏格兰盖尔语
		lang.append(LanguageEnum.SOMALI, "so");//索马里语
		lang.append(LanguageEnum.TAJIK, "tg");//塔吉克语
		lang.append(LanguageEnum.TELUGU, "te");//泰卢固语
		lang.append(LanguageEnum.TAMIL, "ta");//泰米尔语
		lang.append(LanguageEnum.THAI, "th");//泰语
		lang.append(LanguageEnum.TURKISH, "tr");//土耳其语
		lang.append(LanguageEnum.TURKMEN, "tk");//土库曼语
		lang.append(LanguageEnum.TAGALOG, "tgl");//他加禄语
		lang.append(LanguageEnum.UYGHUR, "uy");//维吾尔语
		lang.append(LanguageEnum.VENDA, "ve");//文达语
		lang.append(LanguageEnum.WOLOF, "wol");//沃洛夫语
		lang.append(LanguageEnum.URDU, "ur");//乌尔都语
		lang.append(LanguageEnum.UKRAINIAN, "uk");//乌克兰语
		lang.append(LanguageEnum.UZBEK, "uz");//乌兹别克语
		lang.append(LanguageEnum.WELSH, "cy");//威尔士语
		lang.append(LanguageEnum.SPANISH, "es");//西班牙语
		lang.append(LanguageEnum.HEBREW, "he");//希伯来语
		lang.append(LanguageEnum.GREEK, "el");//希腊语
		lang.append(LanguageEnum.HAWAIIAN, "haw");//夏威夷语
		lang.append(LanguageEnum.SINDHI, "sd");//信德语
		lang.append(LanguageEnum.HUNGARIAN, "hu");//匈牙利语
		lang.append(LanguageEnum.SHONA, "sn");//修纳语
		lang.append(LanguageEnum.CEBUANO, "ceb");//宿务语
		lang.append(LanguageEnum.SYRIAC, "syc");//叙利亚语
		lang.append(LanguageEnum.HILIGAYNON, "hil");//希利盖农语
		lang.append(LanguageEnum.ARMENIAN, "hy");//亚美尼亚语
		lang.append(LanguageEnum.ACEH, "ace");//亚齐语
		lang.append(LanguageEnum.IGBO, "ig");//伊博语
		lang.append(LanguageEnum.ITALIAN, "it");//意大利语
		lang.append(LanguageEnum.YIDDISH, "yi");//意第绪语
		lang.append(LanguageEnum.HINDI, "hi");//印地语
		lang.append(LanguageEnum.SUNDANESE, "su");//印尼巽他语
		lang.append(LanguageEnum.INDONESIAN, "id");//印尼语
		lang.append(LanguageEnum.JAVANESE, "jv");//印尼爪哇语
		lang.append(LanguageEnum.ENGLISH, "en");//英语
		lang.append(LanguageEnum.YORUBA, "yo");//约鲁巴语
		lang.append(LanguageEnum.VIETNAMESE, "vi");//越南语
		lang.append(LanguageEnum.CANTONESE, "yue");//粤语
		lang.append(LanguageEnum.ILOCANO, "ilo");//伊洛卡诺语
		lang.append(LanguageEnum.CHINESE_SIMPLIFIED, "zh");//中文(简体)
		lang.append(LanguageEnum.CHINESE_TRADITIONAL, "cht");//中文(繁体)


		//	-----------------------2023/11/3放开没有的枚举类-------------------------------------
		//	----------------------------------------------------------------------------------
		//	----------------------------------------------------------------------------------

		lang.append(LanguageEnum.ACHUAR, "acu");//阿丘雅语
		lang.append(LanguageEnum.AGUARUNA, "agr");//阿瓜鲁纳语
		lang.append(LanguageEnum.AKAWAIO, "ake");//阿卡瓦伊语
		lang.append(LanguageEnum.AMUZGO, "amu");//阿穆斯戈语
		lang.append(LanguageEnum.OJIBWA, "ojb");//奥吉布瓦语
		lang.append(LanguageEnum.OSSETIC, "os");//奥赛梯语
		lang.append(LanguageEnum.AYANGAN_IFUGAO, "ifb");//阿雅安伊富高语
		lang.append(LanguageEnum.ACATECO, "knj");//阿卡特克语
		lang.append(LanguageEnum.ANTIPOLO_IFUGAO, "ify");//安蒂波洛伊富高语
		lang.append(LanguageEnum.ACHI, "acr");//阿奇语
		lang.append(LanguageEnum.AMBAI, "amk");//安拜语
		lang.append(LanguageEnum.OROKO, "bdu");//奥罗科语
		lang.append(LanguageEnum.ADHOLA, "adh");//阿多拉语
		lang.append(LanguageEnum.AGNI_SANVI, "any");//阿格尼桑维语
		lang.append(LanguageEnum.ASHENINKA, "cpb");//阿舍宁卡语
		lang.append(LanguageEnum.EFIK, "efi");//埃菲克语
		lang.append(LanguageEnum.ACHOLI, "ach");//阿乔利语
		lang.append(LanguageEnum.ESAN, "ish");//埃桑语
		lang.append(LanguageEnum.EDO, "bin");//埃多语
		lang.append(LanguageEnum.TOK_PISIN, "tpi");//巴布亚皮钦语
		lang.append(LanguageEnum.BARASANA, "bsn");//巴拉萨纳语
		lang.append(LanguageEnum.BEMBA, "bem");//别姆巴语
		lang.append(LanguageEnum.POTAWATOMI, "pot");//波塔瓦托米语
		lang.append(LanguageEnum.BOKONQI, "poh");//波孔奇语
		lang.append(LanguageEnum.NORTHERN_MAM, "map");//北部马姆语
		lang.append(LanguageEnum.BARIBA, "bba");//巴里巴语
		lang.append(LanguageEnum.BOKOBARU, "bus");//博科巴鲁语
		lang.append(LanguageEnum.BUSA, "bqp");//布萨语
		lang.append(LanguageEnum.BOLA, "bnp");//波拉语
		lang.append(LanguageEnum.BARIAI, "bch");//巴里亚语
		lang.append(LanguageEnum.BANTOANON, "bno");//班通安隆语
		lang.append(LanguageEnum.BANDIAL, "bqj");//班迪亚勒语
		lang.append(LanguageEnum.BAKA, "bdh");//巴卡语
		lang.append(LanguageEnum.BAMBAM, "ptu");//邦邦语
		lang.append(LanguageEnum.BARI, "bfa");//巴里语
		lang.append(LanguageEnum.BUALKHAW_CHIN, "cbl");//布阿尔考钦语
		lang.append(LanguageEnum.NORTHERN_GREBO, "gbo");//北部格雷博语
		lang.append(LanguageEnum.BASAA, "bas");//巴萨语
		lang.append(LanguageEnum.BULU, "bum");//布卢语
		lang.append(LanguageEnum.PANGASINAN, "pag");//邦阿西楠语
		lang.append(LanguageEnum.BAOLE, "bci");//鲍勒语
		lang.append(LanguageEnum.BIAK, "bhw");//比亚克语
		lang.append(LanguageEnum.BATAK_KARO, "btx");//巴塔克卡罗语
		lang.append(LanguageEnum.POHNPEIAN, "pon");//波纳佩语
		lang.append(LanguageEnum.BELIZEAN_CREOLE, "bzj");//伯利兹克里奥尔语
		lang.append(LanguageEnum.PARAGUAYAN_GUARANÍ, "gug");//巴拉圭瓜拉尼语
		lang.append(LanguageEnum.CHAMORRO, "cha");//查莫罗语
		lang.append(LanguageEnum.TSWANA, "tn");//茨瓦纳语
		lang.append(LanguageEnum.CHECHEN, "che");//车臣语
		lang.append(LanguageEnum.CHAKMA, "ccp");//查克玛语
		lang.append(LanguageEnum.CHIRU, "cdf");//茨鲁语
		lang.append(LanguageEnum.TSWA, "tsc");//茨瓦语
		lang.append(LanguageEnum.DINKA, "dik");//丁卡语
		lang.append(LanguageEnum.DYULA, "dyu");//迪尤拉语
		lang.append(LanguageEnum.DITAMMARI, "tbz");//迪塔马利语
		lang.append(LanguageEnum.DADIBI, "mps");//达迪比语
		lang.append(LanguageEnum.TIMUGON_MURUT, "tih");//蒂穆贡-穆鲁特语
		lang.append(LanguageEnum.EASTERN_CAGAYAN_AGTA, "duo");//东部卡加延-阿格塔语
		lang.append(LanguageEnum.DANGME, "ada");//丹美语
		lang.append(LanguageEnum.DUALA, "dua");//杜阿拉语
		lang.append(LanguageEnum.TETUN_DILI, "tdt");//帝力德顿语
		lang.append(LanguageEnum.DREHU, "dhv");//德鲁语
		lang.append(LanguageEnum.TIV, "tiv");//蒂夫语
		lang.append(LanguageEnum.NDYUKA, "djk");//恩都卡语
		lang.append(LanguageEnum.ENXET, "enx");//恩舍特语
		lang.append(LanguageEnum.NZEMA, "nzi");//恩泽马语
		lang.append(LanguageEnum.NGAJU, "nij");//恩加朱语
		lang.append(LanguageEnum.NKORE, "nyn");//恩科里语
		lang.append(LanguageEnum.NDAU, "ndc");//恩道语
		lang.append(LanguageEnum.NDONGA, "ndo");//恩敦加语
		lang.append(LanguageEnum.FIJIAN, "fj");//斐济语
		lang.append(LanguageEnum.FALAM_CHIN, "cfm");//法兰钦语
		lang.append(LanguageEnum.FRAFRA, "gur");//法拉法拉语
		lang.append(LanguageEnum.CAPE_VERDEAN_CREOLE, "kea");//佛得角克里奥尔语
		lang.append(LanguageEnum.QUICHUA, "quw");//盖丘亚语
		lang.append(LanguageEnum.GUAJARA, "gub");//瓜哈哈拉语
		lang.append(LanguageEnum.GOFFA, "gof");//果发语
		lang.append(LanguageEnum.KASEM, "xsm");//格森语
		lang.append(LanguageEnum.GBAYA, "krs");//格巴亚语
		lang.append(LanguageEnum.GUN, "guw");//龚语
		lang.append(LanguageEnum.CONGO_SWAHILI, "swc");//刚果斯瓦希里语
		lang.append(LanguageEnum.GUIMI, "gym");//圭米语
		lang.append(LanguageEnum.KAZAKH_CYRILLIC, "kk");//哈萨克语(西里尔)
		lang.append(LanguageEnum.HULI, "hui");//胡里语
		lang.append(LanguageEnum.HALBI, "hlb");//亥比语
		lang.append(LanguageEnum.HERERO, "her");//赫雷罗语
		lang.append(LanguageEnum.KICHE, "quc");//基切语
		lang.append(LanguageEnum.GALELA, "gbi");//加莱拉语
		lang.append(LanguageEnum.KIRIBATI, "gil");//基里巴斯语
		lang.append(LanguageEnum.JINGPHO, "kac");//景颇语
		lang.append(LanguageEnum.GA, "gaa");//加语
		lang.append(LanguageEnum.KIKUYU, "kik");//基库尤语
		lang.append(LanguageEnum.KIMBUNDU, "kmb");//金邦杜语
		lang.append(LanguageEnum.GARIFUNA, "cab");//加利富纳语
		lang.append(LanguageEnum.CABECAR, "cjp");//卡韦卡尔语
		lang.append(LanguageEnum.CAKCHIQUEL, "cak");//卡克奇克尔语
		lang.append(LanguageEnum.QEQCHI, "kek");//凯克其语
		lang.append(LanguageEnum.CAMPA, "cni");//坎帕语
		lang.append(LanguageEnum.COPTIC, "cop");//科普特语
		lang.append(LanguageEnum.CAMSA, "kbh");//科奇语
		lang.append(LanguageEnum.QUERETARO_OTOMI, "otq");//克雷塔罗奥托米语
		lang.append(LanguageEnum.KURDISH_KURMANJI, "ku");//库尔德语(库尔曼奇语)
		lang.append(LanguageEnum.KUANUA, "ksd");//库阿努阿语
		lang.append(LanguageEnum.CUSCO_QUECHUA, "quz");//库斯科克丘亚语
		lang.append(LanguageEnum.KAPINGAMARANGI, "kpg");//卡平阿马朗伊语
		lang.append(LanguageEnum.KALMYK_OIRAT, "xal");//卡尔梅克卫拉特语
		lang.append(LanguageEnum.KELIKO, "kbo");//克利科语
		lang.append(LanguageEnum.KAKWA, "keo");//卡库瓦语
		lang.append(LanguageEnum.KAQCHIKEL, "cki");//喀克其奎语
		lang.append(LanguageEnum.KAULONG, "pss");//卡乌龙语
		lang.append(LanguageEnum.KULUNG, "kle");//库隆语
		lang.append(LanguageEnum.KANAR_HIGHLAND_QUICHUA, "qxr");//卡纳尔高地-基丘亚语
		lang.append(LanguageEnum.COOK_ISLANDS_MAORI, "rar");//库克群岛毛利语
		lang.append(LanguageEnum.KABIYE, "kbp");//卡比耶语
		lang.append(LanguageEnum.KAMBA, "kam");//卡姆巴语
		lang.append(LanguageEnum.KAONDE, "kqn");//卡昂多语
		lang.append(LanguageEnum.CAMEROONIAN_PIDGIN, "wes");//喀麦隆皮钦语
		lang.append(LanguageEnum.KIRUNDI, "rn");//隆迪语
		lang.append(LanguageEnum.LUKPA, "dop");//卢克帕语
		lang.append(LanguageEnum.LOMWE, "ngl");//隆韦语
		lang.append(LanguageEnum.ROVIANA, "rug");//罗维那语
		lang.append(LanguageEnum.LACID, "lsi");//勒期语
		lang.append(LanguageEnum.LINGAO, "ond");//临高语
		lang.append(LanguageEnum.LOZI, "loz");//罗子语
		lang.append(LanguageEnum.LUBA_KASAI, "lua");//卢巴开赛语
		lang.append(LanguageEnum.LUBA_KATANGA, "lub");//卢巴-加丹加语
		lang.append(LanguageEnum.LUNDA, "lun");//隆打语
		lang.append(LanguageEnum.RUUND, "rnd");//卢乌德语
		lang.append(LanguageEnum.LUVALE, "lue");//卢瓦来语
		lang.append(LanguageEnum.MANX, "gv");//马恩岛语
		lang.append(LanguageEnum.MARI, "mhr");//马里语
		lang.append(LanguageEnum.MAM, "mam");//马姆语
		lang.append(LanguageEnum.MONGOLIAN_CYRILLIC, "mn");//蒙古语(西里尔)
		lang.append(LanguageEnum.MEITEI, "mni");//曼尼普尔语---------------枚举有：梅泰语（曼尼普尔语）
		lang.append(LanguageEnum.MOTU, "meu");//摩图语
		lang.append(LanguageEnum.MARANAO, "mrw");//马拉瑙语
		lang.append(LanguageEnum.MAALE, "mdy");//马勒语
		lang.append(LanguageEnum.MADURESE, "mad");//马都拉语
		lang.append(LanguageEnum.MOSSI, "mos");//莫西语
		lang.append(LanguageEnum.MUTHUVAN, "muv");//穆图凡语
		lang.append(LanguageEnum.UMBUNDU, "umb");//姆班杜语
		lang.append(LanguageEnum.MAPUCHE, "arn");//马普切语
		lang.append(LanguageEnum.NAHUATL, "nhg");//纳瓦特尔语
		lang.append(LanguageEnum.SOUTH_AZERBAIJANI, "azb");//南阿塞拜疆语
		lang.append(LanguageEnum.SOUTH_BOLIVIAN_QUECHUA, "quh");//南玻利维亚克丘亚语
		lang.append(LanguageEnum.LUN_BAWANG, "lnd");//弄巴湾语
		lang.append(LanguageEnum.NIGERIAN_FULFULDE, "fuv");//尼日利亚富拉语
		lang.append(LanguageEnum.NUMANGGANG, "nop");//努曼干语
		lang.append(LanguageEnum.NATENI, "ntm");//纳特尼语
		lang.append(LanguageEnum.NYAKYUSA, "nyy");//尼亚库萨语
		lang.append(LanguageEnum.NIUEAN, "niu");//纽埃语
		lang.append(LanguageEnum.NIAS, "nia");//尼亚斯语
		lang.append(LanguageEnum.NYEMBA, "nba");//涅姆巴语
		lang.append(LanguageEnum.NYUNGWE, "nyu");//尼荣圭语
		lang.append(LanguageEnum.NAVAJO, "nav");//纳瓦霍语
		lang.append(LanguageEnum.NYANEKA, "nyk");//尼亚内卡语
		lang.append(LanguageEnum.NIGERIAN_PIDGIN, "pcm");//尼日利亚皮钦语
		lang.append(LanguageEnum.PAITE, "pck");//派特语
		lang.append(LanguageEnum.PELE_ATA, "ata");//佩勒-阿塔语
		lang.append(LanguageEnum.PIJIN, "pis");//皮京语
		lang.append(LanguageEnum.CHEROKEE, "chr");//切诺基语
		lang.append(LanguageEnum.CHINANTEC, "chq");//奇南特克语
		lang.append(LanguageEnum.ZIMANE, "cas");//齐马内语
		lang.append(LanguageEnum.CHOKWE, "cjk");//乔奎语
		lang.append(LanguageEnum.CHOPI, "cce");//乔皮语
		lang.append(LanguageEnum.CHUUKESE, "chk");//丘克语
		lang.append(LanguageEnum.SEYCHELLES_CREOLE, "crs");//塞舌尔克里奥尔语
		lang.append(LanguageEnum.SANGO, "sg");//桑戈语
		lang.append(LanguageEnum.HILL_MARI, "mrj");//山地马里语
		lang.append(LanguageEnum.SHUAR, "jiv");//舒阿尔语
		lang.append(LanguageEnum.SUAU, "swp");//苏奥语
		lang.append(LanguageEnum.SAMBERIGI, "ssx");//桑贝里吉语
		lang.append(LanguageEnum.SABAOT, "spy");//萨鲍特语
		lang.append(LanguageEnum.SAN_MATEO_DEL_MAR_HUAVE, "huv");//圣马特奥德马尔-瓦维语
		lang.append(LanguageEnum.KISIHA, "jmc");//斯哈语
		lang.append(LanguageEnum.SARAMACCAN, "srm");//萨拉马坎语
		lang.append(LanguageEnum.SANGIR, "sxn");//桑格语
		lang.append(LanguageEnum.SENA, "seh");//塞纳语
		lang.append(LanguageEnum.SAN_SALVADOR_KONGO, "kwy");//圣萨尔瓦多刚果语
		lang.append(LanguageEnum.SONGE, "sop");//松格语
		lang.append(LanguageEnum.TZOTZIL, "tzo");//索西语
		lang.append(LanguageEnum.TAHITIAN, "ty");//塔希提语
		lang.append(LanguageEnum.TONGAN, "to");//汤加语
		lang.append(LanguageEnum.TIGRE, "tig");//提格雷语
		lang.append(LanguageEnum.TAMAJAQ, "tmh");//图阿雷格语
		lang.append(LanguageEnum.TAMPULMA, "tpm");//坦普尔马语
		lang.append(LanguageEnum.TEDIM_CHIN, "ctd");//特丁钦语
		lang.append(LanguageEnum.TUVAN, "tyv");//图瓦语
		lang.append(LanguageEnum.TUMA_IRUMU, "iou");//图马伊鲁穆语
		lang.append(LanguageEnum.TENNET, "tex");//腾内特语
		lang.append(LanguageEnum.TUNGAG, "lcm");//通加格语
		lang.append(LanguageEnum.TESO, "teo");//特索语
		lang.append(LanguageEnum.TUVALUAN, "tvl");//图瓦卢语
		lang.append(LanguageEnum.TETELA, "tll");//特特拉语
		lang.append(LanguageEnum.TUMBUKA, "tum");//通布卡语
		lang.append(LanguageEnum.TOJOLABAL, "toj");//托霍拉瓦尔语
		lang.append(LanguageEnum.TOORO, "ttj");//土柔语
		lang.append(LanguageEnum.WOLAYTTA, "wal");//瓦拉莫语
		lang.append(LanguageEnum.WARAY, "war");//瓦瑞语
		lang.append(LanguageEnum.UDMURT, "udm");//乌德穆尔特语
		lang.append(LanguageEnum.UMA, "ppk");//乌玛语
		lang.append(LanguageEnum.USPANTECO, "usp");//乌斯潘坦语
		lang.append(LanguageEnum.WALI, "wlx");//瓦利语
		lang.append(LanguageEnum.WA, "prk");//佤语
		lang.append(LanguageEnum.WASKIA, "wsk");//瓦吉语
		lang.append(LanguageEnum.WARIS, "wrs");//瓦里斯语
		lang.append(LanguageEnum.VUNJO, "vun");//文约语
		lang.append(LanguageEnum.WALLISIAN, "wls");//瓦利斯语
		lang.append(LanguageEnum.URHOBO, "urh");//乌尔霍博语
		lang.append(LanguageEnum.HUAUTLA_MAZATEC, "mau");//瓦乌特拉马萨特克语
		lang.append(LanguageEnum.WAYUU, "guc");//瓦尤语
		lang.append(LanguageEnum.TACHELHIT, "shi");//希尔哈语
		lang.append(LanguageEnum.HAWAIIAN_CREOLE_ENGLISH, "hwc");//夏威夷克里奥尔英语
		lang.append(LanguageEnum.HIRI_MOTU, "hmo");//希里莫图语
		lang.append(LanguageEnum.WESTERN_LAWA, "lcp");//西部拉威语
		lang.append(LanguageEnum.SIDAMO, "sid");//锡达莫语
		lang.append(LanguageEnum.WESTERN_BUKIDNON_MANOBO, "mbb");//西布基农马诺布语
		lang.append(LanguageEnum.SHIPIBO, "shp");//西皮沃语
		lang.append(LanguageEnum.SIROI, "ssd");//西罗伊语
		lang.append(LanguageEnum.WESTERN_BOLIVIAN_GUARANI, "gnw");//西部玻利维亚瓜拉尼语
		lang.append(LanguageEnum.WESTERN_KAYAH, "kyu");//西部克耶语
		lang.append(LanguageEnum.JAKALTEKO, "jac");//雅加达语
		lang.append(LanguageEnum.YUCATEC_MAYA, "yua");//尤卡坦玛雅语
		lang.append(LanguageEnum.IKA, "ikk");//伊卡语
		lang.append(LanguageEnum.IZI, "izz");//伊兹语
		lang.append(LanguageEnum.YOM, "pil");//约姆语
		lang.append(LanguageEnum.YABEM, "jae");//雅比姆语
		lang.append(LanguageEnum.YONGKOM, "yon");//永贡语
		lang.append(LanguageEnum.YONGBEI_ZHUANG, "zyb");//邕北壮语
		lang.append(LanguageEnum.YIPMA, "byr");//伊普马语
		lang.append(LanguageEnum.ISOKO, "iso");//伊索科语
		lang.append(LanguageEnum.IBAN, "iba");//伊班语
		lang.append(LanguageEnum.IBANAG, "ibg");//伊巴纳格语
		lang.append(LanguageEnum.YAPESE, "yap");//雅浦语
		lang.append(LanguageEnum.TIBETAN, "ti");//藏语
		lang.append(LanguageEnum.ZARMA, "dje");//哲尔马语
		lang.append(LanguageEnum.DZONGKHA, "dz");//宗喀语
		lang.append(LanguageEnum.CENTRAL_IFUGAO, "ifa");//中部伊富高语
		lang.append(LanguageEnum.ZOTUNG_CHIN, "czt");//佐通钦语
		lang.append(LanguageEnum.CENTRAL_DUSUN, "dtp");//中部杜顺语
		lang.append(LanguageEnum.CENTRAL_BIKOL, "bcl");//中比科尔语
		lang.append(LanguageEnum.TZELTAL, "tzh");//泽塔尔语
		lang.append(LanguageEnum.ZANDE, "zne");//赞德语


		//	--------------------------------小牛end-------------------------------------------
		//	----------------------------------------------------------------------------------
		//	----------------------------------------------------------------------------------
		//	----------------------------------------------------------------------------------
		//	----------------------------------------------------------------------------------
		//	----------------------------------------------------------------------------------
		//	----------------------------------------------------------------------------------
		
	}

	private TranslateResultVO requestApi(String from, String to, JSONArray array) {
		TranslateResultVO vo = new TranslateResultVO();
		
		//要翻译的原字符串
		StringBuffer payload = new StringBuffer();
		payload.append(array.get(0));
		if (array.size() > 1) {
			for (int i = 1; i < array.size(); i++) {
				payload.append("\n" + array.get(i));
			}
		}
		String sourceText = payload.toString();
		
		try {
			String encode = URLEncoder.encode(sourceText,"utf-8");
			
			Map<String, String> params = new HashMap<String, String>();
			params.put("from", from);
			params.put("to", to);
			params.put("apikey", apikey);
			params.put("src_text", encode);
			params.put("source", "translate-js");
			
			Map<String, String> heardlers = new HashMap<String, String>();
			heardlers.put("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
			
			Response response = https.post(TRANS_API_URL,params,heardlers);
			
			
			if (response.getCode() == 200) {
				String content = response.getContent();
				JSONObject fromObject = JSONObject.fromObject(content);
				if (fromObject.get("tgt_text") != null) {
					String string = fromObject.getString("tgt_text");
					String[] texts = string.split("\n");

					vo.setText(JSONArray.fromObject(texts));
					vo.setFrom(from);
					vo.setTo(to);
					vo.setBaseVO(TranslateResultVO.SUCCESS, "SUCCESS");
				}else {
					vo.setBaseVO(TranslateResultVO.FAILURE, "http response code : " + fromObject.getString("error_code")+", content: "+ fromObject.getString("error_msg"));
				}
			}

		} catch (IOException e) {
			e.printStackTrace();
			vo.setBaseVO(TranslateResultVO.FAILURE, e.getMessage());
		}
		
		return vo;
	}
}
