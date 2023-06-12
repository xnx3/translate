/*
 Navicat Premium Data Transfer

 Source Server         : 192.168.31.242-novel
 Source Server Type    : MySQL
 Source Server Version : 50741
 Source Host           : 192.168.31.242
 Source Database       : translate_mirrorImage

 Target Server Type    : MySQL
 Target Server Version : 50741
 File Encoding         : utf-8

 Date: 06/12/2023 16:35:31 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `permission`
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` char(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '描述信息，备注，只是给后台设置权限的人看的',
  `url` char(80) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '资源url',
  `name` char(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '名字，菜单的名字，显示给用户的',
  `parent_id` int(11) DEFAULT NULL COMMENT '上级资源的id',
  `percode` char(80) COLLATE utf8_unicode_ci DEFAULT NULL,
  `menu` smallint(6) DEFAULT NULL,
  `rank` int(11) DEFAULT '0' COMMENT '排序，数字越小越靠前',
  `icon` char(100) COLLATE utf8_unicode_ci DEFAULT '' COMMENT '图标字符，这里是layui 的图标 ， https://www.layui.com/doc/element/icon.html ，这里存的是 unicode  字符，如  &#xe60c;',
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`,`name`,`percode`),
  KEY `parent_id` (`parent_id`),
  KEY `suoyin_index` (`menu`,`rank`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='Shiro权限管理中的资源';

-- ----------------------------
--  Records of `permission`
-- ----------------------------
BEGIN;
INSERT INTO `permission` VALUES ('12', '后台的用户管理', '/admin/user/list.do', '用户管理', '0', 'adminUser', '0', '1', '&#xe612;'), ('13', '后台用户管理下的菜单', '/admin/user/list.do', '用户列表', '12', 'adminUserList', null, '0', ''), ('14', '后台用户管理下的菜单', '/admin/user/delete.do', '删除用户', '12', 'adminUserDelete', null, '0', ''), ('15', '管理后台－系统管理栏目', '/admin/system/index.do', '系统管理', '0', 'adminSystem', '1', '4', '&#xe614;'), ('16', '管理后台－系统管理－系统参数、系统变量', '/admin/system/variableList.do', '系统变量', '15', 'adminSystemVariable', '1', '0', ''), ('18', '退出登陆，注销登陆状态', '/user/logout.do', '退出登陆', '0', 'userLogout', '1', '20', '&#xe633;'), ('21', '更改当前登陆的密码', 'javascript:updatePassword();', '更改密码', '0', 'adminUserUpdatePassword', '1', '19', '&#xe642;'), ('44', '后台，权限管理', '/admin/role/roleList.do', '权限管理', '0', 'adminRole', '1', '3', '&#xe628;'), ('46', '后台，权限管理，新增、编辑角色', '/admin/role/editRole.do', '编辑角色', '44', 'adminRoleRole', null, '101', ''), ('48', '后台，权限管理，角色列表', '/admin/role/roleList.do', '角色管理', '44', 'adminRoleRoleList', '1', '1', ''), ('49', '后台，权限管理，删除角色', '/admin/role/deleteRole.do', '删除角色', '44', 'adminRoleDeleteRole', null, '102', ''), ('51', '后台，权限管理，资源Permission的添加、编辑功能', '/admin/role/editPermission.do', '编辑资源', '44', 'adminRolePermission', null, '103', ''), ('53', '后台，权限管理，资源Permission列表', '/admin/role/permissionList.do', '资源管理', '44', 'adminRolePermissionList', '1', '2', ''), ('54', '后台，权限管理，删除资源Permission', '/admin/role/deletePermission.do', '删除资源', '44', 'adminRoleDeletePermission', null, '104', ''), ('55', '后台，权限管理，编辑角色下资源', '/admin/role/editRolePermission.do', '编辑角色下资源', '44', 'adminRoleEditRolePermission', null, '105', ''), ('56', '后台，权限管理，编辑用户所属角色', '/admin/role/editUserRole.do', '编辑用户所属角色', '44', 'adminRoleEditUserRole', null, '106', ''), ('71', '后台，日志管理', '/admin/log/list.do', '日志统计', '0', 'adminLog', '1', '5', '&#xe62c;'), ('72', '后台，日志管理，用户动作的日志列表', '/admin/log/list.do', '用户动作', '71', 'adminLogList', '1', '1', ''), ('74', '管理后台－系统管理，新增、修改系统的全局变量', '/admin/system/variable.do', '修改变量', '15', 'adminSystemVariable', null, '0', ''), ('80', '后台，用户管理，查看用户详情', '/admin/user/view.do', '用户详情', '12', 'adminUserView', null, '0', ''), ('81', '后台，用户管理，冻结、解除冻结会员。冻结后用户将不能登陆', '/admin/user/updateFreeze.do', '冻结用户', '12', 'adminUserUpdateFreeze', null, '0', ''), ('82', '后台，历史发送的短信验证码', '/admin/smslog/list.do', '短信验证', '0', 'adminSmsLogList', '0', '2', '&#xe63a;'), ('114', '后台管理首页，登陆后台的话，需要授权此项，不然登陆成功后仍然无法进入后台，被此页给拦截了', null, '管理后台', '0', 'adminIndex', null, '0', ''), ('115', '管理后台首页', '', '后台首页', '114', 'adminIndexIndex', null, '0', ''), ('116', '删除系统变量', 'admin/system/deleteVariable.do', '删除变量', '15', 'adminSystemDeleteVariable', null, '0', ''), ('117', '后台，日志管理，所有动作的日志图表', '/admin/log/cartogram.do', '动作统计', '71', 'adminLogCartogram', '0', '2', ''), ('120', '可以将某个资源设置为菜单是菜单项', '/admin/role/editPermissionMenu.do', '设为菜单', '44', 'adminRoleEditPermissionMenu', '0', '107', ''), ('121', '对资源进行排序', '/admin/role/savePermissionRank.do', '资源排序', '44', 'adminRoleEditPermissionRank', '0', '108', ''), ('122', '', '/translate/mirrorimage/translateSite/list.jsp', '翻译站点', '0', '', '1', '0', '&#xe7ae;');
COMMIT;

-- ----------------------------
--  Table structure for `role`
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(30) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '角色名',
  `description` char(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '角色说明',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='Shiro权限管理中的角色表';

-- ----------------------------
--  Records of `role`
-- ----------------------------
BEGIN;
INSERT INTO `role` VALUES ('9', '总管理', '总后台管理，超级管理员');
COMMIT;

-- ----------------------------
--  Table structure for `role_permission`
-- ----------------------------
DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleid` int(11) DEFAULT NULL COMMENT '角色id，role.id，一个角色可以拥有多个permission资源',
  `permissionid` int(11) DEFAULT NULL COMMENT '资源id，permission.id，一个角色可以拥有多个permission资源',
  PRIMARY KEY (`id`),
  KEY `roleid` (`roleid`)
) ENGINE=InnoDB AUTO_INCREMENT=217 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='Shiro权限管理中，角色所拥有哪些资源的操作权限';

-- ----------------------------
--  Records of `role_permission`
-- ----------------------------
BEGIN;
INSERT INTO `role_permission` VALUES ('6', '1', '1'), ('7', '1', '2'), ('8', '1', '4'), ('9', '1', '3'), ('10', '1', '7'), ('11', '1', '9'), ('12', '9', '12'), ('13', '9', '13'), ('17', '9', '15'), ('18', '9', '16'), ('20', '9', '18'), ('23', '9', '21'), ('30', '9', '14'), ('49', '9', '44'), ('51', '9', '46'), ('53', '9', '48'), ('54', '9', '49'), ('56', '9', '51'), ('58', '9', '53'), ('59', '9', '54'), ('60', '9', '55'), ('61', '9', '56'), ('75', '9', '71'), ('76', '9', '72'), ('77', '9', '74'), ('85', '1', '18'), ('86', '1', '19'), ('87', '1', '20'), ('88', '1', '21'), ('89', '1', '22'), ('90', '1', '75'), ('91', '1', '28'), ('92', '1', '29'), ('93', '1', '30'), ('94', '1', '10'), ('95', '1', '11'), ('96', '1', '23'), ('97', '1', '24'), ('98', '1', '25'), ('99', '1', '26'), ('100', '1', '27'), ('101', '9', '80'), ('104', '9', '81'), ('109', '10', '1'), ('110', '10', '2'), ('111', '10', '18'), ('112', '10', '20'), ('113', '10', '21'), ('114', '10', '22'), ('115', '10', '75'), ('116', '10', '24'), ('117', '10', '25'), ('118', '10', '26'), ('119', '10', '27'), ('120', '10', '88'), ('121', '10', '89'), ('122', '10', '90'), ('123', '10', '91'), ('124', '11', '1'), ('125', '11', '2'), ('126', '11', '18'), ('127', '11', '19'), ('128', '11', '20'), ('129', '11', '21'), ('130', '11', '22'), ('131', '11', '75'), ('132', '11', '7'), ('133', '11', '9'), ('134', '11', '10'), ('135', '11', '11'), ('136', '11', '23'), ('137', '11', '24'), ('138', '11', '25'), ('139', '11', '26'), ('140', '11', '27'), ('141', '11', '88'), ('142', '11', '89'), ('143', '11', '90'), ('144', '11', '91'), ('145', '12', '1'), ('146', '12', '2'), ('147', '12', '18'), ('148', '12', '19'), ('149', '12', '20'), ('150', '12', '21'), ('151', '12', '22'), ('152', '12', '75'), ('153', '12', '88'), ('154', '12', '89'), ('155', '12', '90'), ('156', '12', '91'), ('162', '12', '4'), ('163', '12', '3'), ('164', '12', '28'), ('165', '12', '29'), ('166', '12', '30'), ('167', '12', '7'), ('168', '12', '9'), ('169', '12', '10'), ('170', '12', '11'), ('171', '12', '23'), ('172', '12', '24'), ('173', '12', '25'), ('174', '12', '26'), ('175', '12', '27'), ('176', '10', '19'), ('177', '10', '4'), ('178', '10', '3'), ('179', '10', '28'), ('180', '10', '29'), ('181', '10', '30'), ('182', '10', '7'), ('183', '10', '9'), ('184', '10', '10'), ('185', '10', '11'), ('186', '10', '23'), ('187', '10', '97'), ('195', '10', '105'), ('196', '10', '106'), ('197', '10', '107'), ('198', '10', '108'), ('199', '10', '109'), ('200', '10', '110'), ('201', '10', '111'), ('202', '10', '112'), ('203', '10', '113'), ('204', '9', '114'), ('205', '9', '115'), ('206', '10', '114'), ('207', '10', '115'), ('208', '9', '117'), ('209', '9', '116'), ('210', '10', '118'), ('211', '10', '119'), ('212', '9', '120'), ('213', '9', '121'), ('214', '9', '82'), ('216', '9', '122');
COMMIT;

-- ----------------------------
--  Table structure for `sms_log`
-- ----------------------------
DROP TABLE IF EXISTS `sms_log`;
CREATE TABLE `sms_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` char(6) CHARACTER SET utf8 DEFAULT NULL COMMENT '发送的验证码，6位数字',
  `userid` int(11) DEFAULT NULL COMMENT '使用此验证码的用户编号，user.id',
  `used` tinyint(2) DEFAULT '0' COMMENT '是否使用，0未使用，1已使用',
  `type` tinyint(3) DEFAULT NULL COMMENT '验证码所属功能类型，  1:登陆  ； 2:找回密码',
  `addtime` int(11) DEFAULT NULL COMMENT '创建添加时间，linux时间戳10位',
  `phone` char(11) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '接收短信的手机号',
  `ip` char(15) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '触发发送操作的客户ip地址',
  PRIMARY KEY (`id`),
  KEY `code` (`code`,`userid`,`used`,`type`,`addtime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='短信验证码发送的日志记录';

-- ----------------------------
--  Table structure for `system`
-- ----------------------------
DROP TABLE IF EXISTS `system`;
CREATE TABLE `system` (
  `name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '参数名,程序内调用',
  `description` char(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '说明描述',
  `value` varchar(2000) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '值',
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lasttime` int(11) DEFAULT '0' COMMENT '最后修改时间，10位时间戳',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10001 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='系统变量，系统的一些参数相关，比如系统名字等';

-- ----------------------------
--  Records of `system`
-- ----------------------------
BEGIN;
INSERT INTO `system` VALUES ('USER_REG_ROLE', '用户注册后的权限，其值对应角色 role.id', '1', '6', '1506333513'), ('SITE_NAME', '网站名称', 'TCDN Admin', '7', '1686384759'), ('SITE_KEYWORDS', '网站SEO搜索的关键字，首页根内页没有设置description的都默认用此', 'Translate CDN', '8', '1686384767'), ('SITE_DESCRIPTION', '网站SEO描述，首页根内页没有设置description的都默认用此', '管雷鸣', '9', null), ('CURRENCY_NAME', '站内货币名字', '仙玉', '10', null), ('INVITEREG_AWARD_ONE', '邀请注册后奖励给邀请人多少站内货币（一级下线，直接推荐人，值必须为整数）', '5', '11', null), ('INVITEREG_AWARD_TWO', '邀请注册后奖励给邀请人多少站内货币（二级下线，值必须为整数）', '2', '12', null), ('INVITEREG_AWARD_THREE', '邀请注册后奖励给邀请人多少站内货币（三级下线，值必须为整数）', '1', '13', null), ('INVITEREG_AWARD_FOUR', '邀请注册后奖励给邀请人多少站内货币（四级下线，值必须为整数）', '1', '14', null), ('ROLE_USER_ID', '普通用户的角色id，其值对应角色 role.id', '1', '15', '1506333544'), ('ROLE_SUPERADMIN_ID', '超级管理员的角色id，其值对应角色 role.id', '9', '16', '1506333534'), ('BBS_DEFAULT_PUBLISH_CLASSID', '论坛中，如果帖子发布时，没有指明要发布到哪个论坛板块，那么默认选中哪个板块(分类)，这里便是分类的id，即数据表中的 post_class.id', '3', '20', '1506478724'), ('USER_HEAD_PATH', '用户头像(User.head)上传OSS或服务器进行存储的路径，存储于哪个文件夹中。<br/><b>注意</b><br/>1.这里最前面不要加/，最后要带/，如 head/<br/>2.使用中时，中途最好别改动，不然改动之前的用户设置好的头像就都没了', 'head/', '21', '1506481173'), ('ALLOW_USER_REG', '是否允许用户自行注册。<br/>1：允许用户自行注册<br/>0：禁止用户自行注册', '1', '22', '1507537911'), ('LIST_EVERYPAGE_NUMBER', '所有列表页面，每页显示的列表条数。', '15', '23', '1507538582'), ('SERVICE_MAIL', '网站管理员的邮箱。<br/>当网站出现什么问题，或者什么提醒时，会自动向管理员邮箱发送提示信息', '123456@qq.com', '24', '1511934294'), ('AGENCY_ROLE', '代理商得角色id', '10', '25', '1511943731'), ('ALIYUN_ACCESSKEYID', '阿里云平台的accessKeyId。<br/>若/src下的配置文件中有关此参数为空，则参数变会从这里赋值。<br/>可从这里获取 https://ak-console.aliyun.com', 'null', '26', '1512626213'), ('ALIYUN_ACCESSKEYSECRET', '阿里云平台的accessKeySecret。<br/>若/src下的配置文件中有关此参数为空，则参数变会从这里赋值。<br/>可从这里获取 https://ak-console.aliyun.com', 'null', '27', '1512616421'), ('ALIYUN_OSS_BUCKETNAME', '其实就是xnx3Config配置文件中配置OSS节点进行文件上传的OSS配置。若xml文件中没有配置，那么会自动从这里读取。<br/>若值为auto，则会自动创建。建议值不必修改，默认即可。它可自动给你赋值。', 'auto', '28', '1512626183'), ('IW_AUTO_INSTALL_USE', '是否允许通过访问/install/目录进行可视化配置参数。<br/>true：允许使用<br/>false:不允许使用<br/>建议不要动此处。执行完/install 配置完后，此处会自动变为false', 'true', '29', '1512616421'), ('ALIYUN_LOG_SITESIZECHANGE', '站币变动的日志记录。此项无需改动', 'sitemoneychange', '30', '1512700960'), ('AUTO_ASSIGN_DOMAIN', '网站生成后，会自动分配给网站一个二级域名。这里便是泛解析的主域名。<br/>如果分配有多个二级域名，则用,分割。并且第一个是作为主域名会显示给用户看到。后面的其他的域名用户不会看到，只可以使用访问网站。', '', '31', '1512717500'), ('MASTER_SITE_URL', '设置当前建站系统的域名。如建站系统的登陆地址为 http://wang.market/login.do ，那么就将 http://wang.market/  填写到此处。', '', '134', '1515401613'), ('ATTACHMENT_FILE_URL', '设置当前建站系统中，上传的图片、附件的访问域名。若后续想要将附件转到云上存储、或开通CDN加速，可平滑上云使用。', '', '135', '1515401592'), ('ATTACHMENT_FILE_MODE', '当前文件附件存储使用的模式，用的阿里云oss，还是服务器本身磁盘进行存储。<br/>可选一：aliyunOSS：阿里云OSS模式存储<br/>可选二：localFile：服务器本身磁盘进行附件存储', 'localFile', '136', '1515395510'), ('SITEUSER_FIRST_USE_EXPLAIN_URL', '网站建站用户第一天登陆网站管理后台时，在欢迎页面会自动通过iframe引入的入门使用说明的视频，这里便是播放的视频的页面网址', '//video.leimingyun.com/sitehelp/sitehelp.html', '137', '1533238686'), ('AGENCYUSER_FIRST_USE_EXPLAIN_URL', '代理用户前15天登陆代理后台时，会自动弹出使用教程的提示。这里便是教程的链接地址', '//www.wscso.com/jianzhanDemo.html', '138', '1533238686'), ('SITE_TEMPLATE_DEVELOP_URL', '模版开发说明，模版开发入门', '//tag.wscso.com/4192.html', '139', '1540972613'), ('FORBID_DOMAIN', '保留不给用户申请的二级域名。多个用|分割，且填写字符必须小写，格式如 admin|domain|m|wap|www  如果留空不填则无保留域名', 'admin|domain', '149', '1566269940'), ('STATIC_RESOURCE_PATH', '系统静态资源如css、js等调用的路径。填写如:  //res.weiunity.com/   默认是/ 则是调取当前项目的资源，以相对路径调用', '/', '150', '1540972613'), ('ROLE_ADMIN_SHOW', '总管理后台中，是否显示权限管理菜单。1为显示，0为不显示', '0', '151', '1540972613'), ('FEN_GE_XIAN', '分割线，系统变量，若您自己添加，请使用id为 10000以后的数字。 10000以前的数字为系统预留。', '10000', '10000', '1540972613');
COMMIT;

-- ----------------------------
--  Table structure for `translate_site`
-- ----------------------------
DROP TABLE IF EXISTS `translate_site`;
CREATE TABLE `translate_site` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,自动编号',
  `name` char(20) COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '站点名字，只是给自己看的，方便辨别',
  `language` char(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '当前语种，当前站点的语种是什么，如 english ，跟 http://api.translate.zvo.cn/doc/language.json.html 这里的值对应',
  `url` char(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '站点网址，格式如 http://www.zvo.cn 注意一定要带上前面的协议',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='翻译的站点';

-- ----------------------------
--  Records of `translate_site`
-- ----------------------------
BEGIN;
INSERT INTO `translate_site` VALUES ('1', '中兵测试网站', 'chinese_simplified', 'http://www.zhongbing.zvo.cn'), ('3', '英文小说', 'english', 'http://qiye9.wang.market');
COMMIT;

-- ----------------------------
--  Table structure for `translate_site_domain`
-- ----------------------------
DROP TABLE IF EXISTS `translate_site_domain`;
CREATE TABLE `translate_site_domain` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '编号，自动编号',
  `domain` char(50) DEFAULT NULL COMMENT '绑定的域名，比如 english.xxxxxx.com',
  `language` char(20) DEFAULT NULL COMMENT '翻译语种，要翻译为的语种,该域名访问看到的语种。如 english ，跟 http://api.translate.zvo.cn/doc/language.json.html 这里的值对应',
  `siteid` int(11) DEFAULT NULL COMMENT '对应 translateSite.id',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='翻译站点绑定域名相关';

-- ----------------------------
--  Records of `translate_site_domain`
-- ----------------------------
BEGIN;
INSERT INTO `translate_site_domain` VALUES ('5', '192.168.31.193', 'english', '1'), ('2', '1', '2', '2');
COMMIT;

-- ----------------------------
--  Table structure for `translate_site_set`
-- ----------------------------
DROP TABLE IF EXISTS `translate_site_set`;
CREATE TABLE `translate_site_set` (
  `id` int(11) NOT NULL COMMENT '对应 translateSite.id',
  `js` text COLLATE utf8mb4_unicode_ci COMMENT '对应的js设置',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='翻译站点的相关设置';

-- ----------------------------
--  Records of `translate_site_set`
-- ----------------------------
BEGIN;
INSERT INTO `translate_site_set` VALUES ('1', 'alert(\'1234\');'), ('2', ''), ('3', '');
COMMIT;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户id编号',
  `username` char(40) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户名',
  `email` char(40) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `password` char(32) COLLATE utf8_unicode_ci NOT NULL COMMENT '加密后的密码',
  `head` char(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '头像',
  `nickname` char(32) COLLATE utf8_unicode_ci NOT NULL COMMENT '姓名、昵称',
  `authority` char(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户权限,主要纪录表再user_role表，一个用户可以有多个权限。多个权限id用,分割，如2,3,5',
  `regtime` int(10) unsigned NOT NULL COMMENT '注册时间,时间戳',
  `lasttime` int(10) unsigned NOT NULL COMMENT '最后登陆时间,时间戳',
  `regip` char(15) COLLATE utf8_unicode_ci NOT NULL COMMENT '注册ip',
  `salt` char(6) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'shiro加密使用',
  `phone` char(11) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '手机号,11位',
  `currency` int(11) DEFAULT '0' COMMENT '资金，可以是积分、金币、等等站内虚拟货币',
  `referrerid` int(11) DEFAULT '0' COMMENT '推荐人的用户id。若没有推荐人则默认为0',
  `freezemoney` int(11) DEFAULT '0' COMMENT '账户冻结余额，金钱,RMB，单位：分',
  `lastip` char(15) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '最后一次登陆的ip',
  `isfreeze` tinyint(2) DEFAULT '0' COMMENT '是否已冻结，1已冻结（拉入黑名单），0正常',
  `money` int(11) DEFAULT '0' COMMENT '账户可用余额，金钱,RMB，单位：分',
  `sign` char(80) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '个人签名',
  `sex` char(4) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '男、女、未知',
  `version` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`,`username`,`phone`) USING BTREE,
  KEY `username` (`username`,`email`,`phone`,`isfreeze`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户信息表。系统登陆的用户信息都在此处';

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('1', 'admin', '', '94940b4491a87f15333ed68cc0cdf833', 'default.png', '总管理', '9', '1512818402', '1686390052', '127.0.0.1', '9738', '17000000002', '0', '0', '0', '192.168.31.95', '0', '0', null, null, '0');
COMMIT;

-- ----------------------------
--  Table structure for `user_role`
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) DEFAULT NULL COMMENT '用户的id，user.id,一个用户可以有多个角色',
  `roleid` int(11) DEFAULT NULL COMMENT '角色的id，role.id ，一个用户可以有多个角色',
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=414 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='用户拥有哪些角色';

-- ----------------------------
--  Records of `user_role`
-- ----------------------------
BEGIN;
INSERT INTO `user_role` VALUES ('413', '1', '9');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
