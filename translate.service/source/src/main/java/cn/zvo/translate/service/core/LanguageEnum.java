package cn.zvo.translate.service.core;

/**
 * 网站管理后台的左侧菜单项的id唯一标示
 * @author 管雷鸣
 *
 */
public enum LanguageEnum {
	ENGLISH("english", "English", "英语"),
	CHINESE_SIMPLIFIED("chinese_simplified", "简体中文", "简体中文"),
	CHINESE_TRADITIONAL("chinese_traditional", "繁體中文", "繁体中文"),
	KOREAN("korean", "한어", "韩语"),
	JAPANESE("japanese", "しろうと", "日语"),
	RUSSIAN("russian","Русский язык", "俄语"),
	ARABIC("arabic", "بالعربية", "阿拉伯语"),

	GERMAN("german","deutsch","德语"),
	FRENCH("french", "Français", "法语"),
	PORTUGUESE("portuguese","português","葡萄牙语"),
	THAI("thai", "คนไทย", "泰语"),
	TURKISH("turkish", "Türkçe", "土耳其语"),
	VIETNAMESE("vietnamese", "Tiếng Việt", "越南语"),
	AFRIKAANS("afrikaans", "afrikaans", "南非荷兰语"),
	TWI("twi", "Ma frɛ", "契维语"),
	AMHARIC("amharic", "amharic", "阿姆哈拉语"),
	ASSAMESE("assamese", "assamese", "阿萨姆语"),
	AYMARA("aymara", "aymara.", "艾马拉语"),
	AZERBAIJANI("azerbaijani", "azerbaijani", "阿塞拜疆语"),
	BELARUSIAN("belarusian", "БеларускаяName", "白俄罗斯语"),
	BULGARIAN("bulgarian", "български", "保加利亚语"),
	BHOJPURI("bhojpuri", "हमार कपार दर्द करता।", "博杰普尔语"),
	BENGALI("bengali", "বেঙ্গালী", "孟加拉语"),
	BOSNIAN("bosnian", "bosnian", "波斯尼亚语"),
	CATALAN("catalan", "català", "加泰罗尼亚语"),
	CEBUANO("cebuano", "cebuano", "宿务语"),

	CORSICAN("corsican", "hinaassicurasol", "科西嘉语"),
	CZECH("czech", "český", "捷克语"),
	WELSH("welsh", "color name", "威尔士语"),
	DANISH("danish", "dansk", "丹麦语"),

	DHIVEHI("dhivehi", "ދިވާރީވް", "迪维希语"),

	GREEK("greek", "ελληνικά", "希腊语"),
	SPANISH("spanish", "Español", "西班牙语"),
	ESTONIAN("estonian", "eesti keel", "爱沙尼亚语"),
	BASQUE("basque", "baskoa", "巴斯克语"),
	PERSIAN("persian", "Persian", "波斯语"),
	FINNISH("finnish", "suomi", "芬兰语"),
	IRISH("irish", "Íris", "爱尔兰语"),

	GALICIAN("galician", "galico", "加利西亚语"),
	GUARANI("guarani", "ondoho", "瓜拉尼语"),

	GUJARATI("gujarati", "ગુજરાતી", "古吉拉特语"),
	HAUSA("hausa", "dictionary variant", "豪萨语"),
	HAWAIIAN("hawaiian", "panekeʻhaka", "夏威夷语"),
	HINDI("hindi", "हिन्दी", "印地语"),
	HMONG("hmong", "hmong", "苗语"),
	CROATIAN("croatian", "hrvatski", "克罗地亚语"),
	HUNGARIAN("hungarian", "magyar", "匈牙利语"),
	ARMENIAN("armenian", "Արմենյան", "亚美尼亚语"),
	DUTCH("dutch", "nederlands", "荷兰语"),
	ITALIAN("italian", "italiano", "意大利语"),

	INDONESIAN("indonesian", "IndonesiaName", "印尼语"),
	IGBO("igbo", "igbo", "伊博语"),
	ICELANDIC("Icelandic", "ÍslandName", "冰岛语"),
	HEBREW("Hebrew", "היברית", "希伯来语"),
	GEORGIAN("Georgian", "ჯორჯიანიName", "格鲁吉亚语"),
	KHMER("Khmer", "ខ្មែរKCharselect unicode block name", "高棉语"),
	KANNADA("Kannada", "ಕನ್ನಡ್Name", "卡纳达语"),
	CREOLE("Creole", "a n:n", "克里奥尔语"),
	KURDISH("Kurdish", "Kurdî", "库尔德语（库尔曼吉语）"),
	KYRGYZ("Kyrgyz", "Кыргыз тили", "吉尔吉斯语"),
	LATIN("Latin", "Latina", "拉丁语"),
	LUXEMBOURGISH("Luxembourgish", "LëtzebuergeschName", "卢森堡语"),
	LUGANDA("luganda", "luganda", "卢干达语"),
	LAO("Lao", "ກະຣຸນາ", "老挝语"),
	LITHUANIAN("Lithuanian", "Lietuva", "立陶宛语"),
	LATVIAN("latvian", "latviešu", "拉脱维亚语"),
	MAITHILI("Maithili", "मरातिलीName", "迈蒂利语"),
	MAORI("Maori", "Maori", "毛利语"),
	MACEDONIAN("Macedonian", "Македонски", "马其顿语"),
	MALAYALAM("malayalam", "മലമാലം", "马拉雅拉姆语"),
	MARATHI("Marathi", "मराठीName", "马拉地语"),
	MALAY("Malay", "Malay", "马来语"),
	MALTESE("Maltese", "Malti", "马耳他语"),
	BURMESE("Burmese", "ဗာရမ်", "缅甸语"),
	NEPALI("Nepali", "नेपालीName", "尼泊尔语"),
	NORWEGIAN("Norwegian", "Norge", "挪威语"),
	NYANJA("Nyanja", "potakuyan", "齐切瓦语"),
	OROMO("Oromo", "adeta", "奥罗莫语"),
	PUNJABI("Punjabi", "ਪੰਜਾਬੀName", "旁遮普语"),
	POLISH("Polish", "Polski", "波兰语"),
	PASHTO("Pashto", "پښتوName", "普什图语"),
	QUECHUA("Quechua", "Quechua", "克丘亚语"),
	ROMANIAN("Romanian", "Română", "罗马尼亚语"),
	KINYARWANDA("Kinyarwanda", "Kinyarwanda", "卢旺达语"),
	SANSKRIT("Sanskrit", "Sanskrit", "梵语"),
	SINDHI("Sindhi", "سنڌي", "信德语"),
	SINGAPORE("Singapore", "සිංගාපුර්", "僧伽罗语"),
	SLOVAK("Slovak", "Slovenská", "斯洛伐克语"),
	SLOVENE("Slovene", "slovenščina", "斯洛文尼亚语"),
	SAMOAN("Samoan", "lifiava", "萨摩亚语"),
	SHONA("Shona", "Shona", "修纳语"),
	SOMALI("Somali", "Soomaali", "索马里语"),
	ALBANIAN("albanian", "albanian", "阿尔巴尼亚语"),
	SWEDISH("Swedish", "Svenska", "瑞典语"),
	SWAHILI("Swahili", "Kiswahili", "斯瓦希里语"),
	TAMIL("Tamil", "தாமில்", "泰米尔语"),
	TELUGU("Telugu", "తెలుగుQFontDatabase", "泰卢固语"),
	TAJIK("Tajik", "ТаjikӣName", "塔吉克语"),
	TURKMEN("Turkmen", "Türkmençe", "土库曼语"),
	FILIPINO("Filipino", "Pilipino", "菲律宾语"),
	TATAR("Tatar", "Татар", "鞑靼语"),
	UKRAINIAN("Ukrainian", "УкраїнськаName", "乌克兰语"),
	URDU("Urdu", "اوردو", "乌尔都语"),
	YIDDISH("Yiddish", "ייַדיש", "意第绪语"),
	YORUBA("Yoruba", "Yoruba", "约鲁巴语");

	
//	FRISIAN("frisian", "fy", "Frysk"),	//TODO 弗里西语-----百度搜不出来
//	SCOTTISH-GAELIC("scottish-gaelic", "gd", "Gàidhlig na h-Alba"),	//TODO 苏格兰盖尔语-----百度搜不出来
//	EWE("ewe", "ee", "Eʋegbe"),	//TODO 埃维语-----百度搜不出来
//	DOGRID("dogrid", "doi", "डोग्रिड ने दी"),	//TODO 多格来语-----百度搜不出来
//	KURDISH_SORANI("kurdish_sorani", "kurdî_sorî", "库尔德语（索拉尼"),	//TODO 库尔德语（索拉尼）----百度只有库尔德语
//	GONGEN("gongen", "gom", "गोंगेन हें नांव"),	//TODO 贡根语-----百度搜不出来
//	BAMBARA("bambara", "bm", "Bamanankan"),	//TODO 班巴拉语----百度搜不出来
//	HAITIAN_CREOLE("haitian_creole", "ht", "Kreyòl ayisyen"),	//TODO 海地克里奥尔语-----百度搜不出来
//	MIZO("Mizo", "", "米佐语"),	//TODO 米佐语---百度搜不出该语种
	
//	SERBIAN("Serbian", "", "塞尔维亚语"),	//TODO 塞尔维亚语   ---有（拉丁文）/（西里尔文） 此处用的第一种
//	ILOCANO("Ilocano", "", "伊洛卡诺语"),	//TODO 伊洛卡诺语---百度搜不出该语种/谷歌只有 伊洛卡诺文
//	ORIYA("Oriya", "", "奥利亚语"),	//TODO 奥利亚语---百度没有奥利亚语--》有奥里亚语
//	XHOSA("Xhosa, South Africa", "", "南非科萨语"),	//TODO 南非科萨语  ---百度有科萨语没有南非科萨语
//	SOUTH_AFRICAN_ZULU("South African Zulu", "", "南非祖鲁语"),	//TODO 南非祖鲁语  ---百度有祖鲁语没有南非祖鲁语
//	UZBEK("Uzbek", "", "乌兹别克语"),	//TODO 乌兹别克语--百度搜不出该语种
//	JAVANESE("Javanese", "", "印尼爪哇语"),	//TODO 印尼爪哇语---百度搜不出该语种/谷歌也没
//	KAZAKH("Kazakh", "", "哈萨克语"),	//TODO 哈萨克语---百度搜不出该语种
//	LINGALA("Lingala", "", "林格拉语"),	//TODO 林格拉语---百度搜不出该语种/谷歌也无
//	MALAGASY("Malagasy", "", "马尔加什语"),	//TODO 马尔加什语---百度搜不出该语种
//	MONGOLIAN("Mongolian", "", "蒙古语"),	//TODO 蒙古语---百度搜不出该语种
//	MEITEI("Meitei", "", "梅泰语（曼尼普尔语）"),	//TODO 梅泰语（曼尼普尔语）---百度搜不出该语种
//	SEPETI("Sepeti", "", "塞佩蒂语"),	//TODO 塞佩蒂语---百度搜不出该语种
//	SESOTHO("sesotho", "", "塞索托语"),	//TODO 塞索托语---百度搜不出该语种
//	SUNDANESE("Sundanese", "", "印尼巽他语"),	//TODO 印尼巽他语--百度搜不出该语种
//	TIGRI("Tigri", "", "蒂格尼亚语"),	//TODO 蒂格尼亚语--百度搜不出该语种
//	UYGHUR("Uyghur", "", "维吾尔语"),	//TODO 维吾尔语--百度搜不出该语种
//	ZONGJIA("Zongjia", "", "宗加语"),	//TODO 宗加语-百度搜不出该语种
//	MIZO("Mizo", "", "米佐语");	//TODO 米佐语---百度搜不出该语种
	/*
	 
	 	待补充
	 	内容参考 cn.zvo.translate.service.google.ServiceInterfaceImplement
	 	语种(语种Key)
	  
	 */
	
	
	
	
	
	
	
	
	public final String id;		//语言名，如 english、chinese_simplified、chinese_traditional
	public final String name;		//文字说明，对应语种的文字说明，如 english、简体中文、繁体中文、한어
	public final String chinese_name;	//中文的说明，以中文方式的语种说明
	
	private LanguageEnum(String id, String name, String chinese_name) { 
		this.name = name;
		this.id = id;
		this.chinese_name = chinese_name;
	}
	
	public static void main(String[] args) {

		LanguageEnum[] languages = LanguageEnum.values();
        for (int i = 0; i < languages.length; i++) {
        	System.out.println(languages[i].id +" - "+languages[i].name);
        }
		
	}
}
