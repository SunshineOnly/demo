/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 60011
Source Host           : localhost:3306
Source Database       : require_system

Target Server Type    : MYSQL
Target Server Version : 60011
File Encoding         : 65001

Date: 2016-11-24 14:00:04
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for xr_detail
-- ----------------------------
DROP TABLE IF EXISTS `xr_detail`;
CREATE TABLE `xr_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `casename` varchar(255) DEFAULT NULL,
  `involvemodule` varchar(255) DEFAULT NULL COMMENT '涉及模块',
  `involveuser` varchar(255) DEFAULT NULL COMMENT '涉及用户',
  `scencedescription` varchar(255) DEFAULT '' COMMENT '场景描述',
  `precondition` varchar(255) DEFAULT '' COMMENT '前置条件',
  `backcondition` varchar(255) DEFAULT '' COMMENT '后置条件',
  `requiredescription` text COMMENT '需求描述',
  `acceptstandard` text COMMENT '验证标准 ',
  `constraintrule` varchar(255) DEFAULT NULL COMMENT '约束规则',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注说明',
  `requireid` int(11) DEFAULT NULL,
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updatetime` datetime DEFAULT NULL,
  `status` int(5) unsigned zerofill DEFAULT '00000' COMMENT '0正常 1删除 ',
  `fileid` varchar(55) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xr_detail
-- ----------------------------

-- ----------------------------
-- Table structure for xr_determine
-- ----------------------------
DROP TABLE IF EXISTS `xr_determine`;
CREATE TABLE `xr_determine` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `determinename` varchar(55) DEFAULT NULL,
  `status` int(8) unsigned zerofill DEFAULT NULL COMMENT '0 可用 1禁用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xr_determine
-- ----------------------------
INSERT INTO `xr_determine` VALUES ('1', 'bug', '00000000');
INSERT INTO `xr_determine` VALUES ('2', '新需求', '00000000');
INSERT INTO `xr_determine` VALUES ('3', '改进性需求', '00000000');
INSERT INTO `xr_determine` VALUES ('4', '建议', '00000000');

-- ----------------------------
-- Table structure for xr_file
-- ----------------------------
DROP TABLE IF EXISTS `xr_file`;
CREATE TABLE `xr_file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `originalfilename` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL COMMENT '路径',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `type` varchar(255) DEFAULT NULL COMMENT '文件类型',
  `size` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xr_file
-- ----------------------------

-- ----------------------------
-- Table structure for xr_operatingrecord
-- ----------------------------
DROP TABLE IF EXISTS `xr_operatingrecord`;
CREATE TABLE `xr_operatingrecord` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(5) DEFAULT NULL COMMENT '类型 1.更新需求 2 添加子任务 3.更改需求用例',
  `operator` int(11) DEFAULT NULL COMMENT '操作用户id',
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `requireid` int(5) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xr_operatingrecord
-- ----------------------------
INSERT INTO `xr_operatingrecord` VALUES ('1', '1', '4', '2016-11-22 16:33:10', '244');
INSERT INTO `xr_operatingrecord` VALUES ('2', '1', '4', '2016-11-22 16:45:03', '244');
INSERT INTO `xr_operatingrecord` VALUES ('3', '2', '6', '2016-11-23 10:06:45', '243');
INSERT INTO `xr_operatingrecord` VALUES ('4', '2', '4', '2016-11-23 10:23:16', '243');

-- ----------------------------
-- Table structure for xr_product
-- ----------------------------
DROP TABLE IF EXISTS `xr_product`;
CREATE TABLE `xr_product` (
  `id` int(16) NOT NULL AUTO_INCREMENT COMMENT '产品id',
  `productName` varchar(255) NOT NULL COMMENT '产品名',
  `priority` int(16) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xr_product
-- ----------------------------
INSERT INTO `xr_product` VALUES ('1', '效果图版', '1');
INSERT INTO `xr_product` VALUES ('2', 'asd', '2');
INSERT INTO `xr_product` VALUES ('7', '影视版', '3');
INSERT INTO `xr_product` VALUES ('8', '效果图', '4');
INSERT INTO `xr_product` VALUES ('9', '效果图11', '5');

-- ----------------------------
-- Table structure for xr_product_project
-- ----------------------------
DROP TABLE IF EXISTS `xr_product_project`;
CREATE TABLE `xr_product_project` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `productId` int(16) NOT NULL,
  `projectId` varchar(255) NOT NULL,
  `priority` int(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  KEY `projectId1` (`projectId`(191)) USING BTREE,
  CONSTRAINT `productId` FOREIGN KEY (`productId`) REFERENCES `xr_product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xr_product_project
-- ----------------------------
INSERT INTO `xr_product_project` VALUES ('1', '1', '1', '8');
INSERT INTO `xr_product_project` VALUES ('2', '1', '2', '1');
INSERT INTO `xr_product_project` VALUES ('3', '1', '3', null);
INSERT INTO `xr_product_project` VALUES ('4', '1', '4', null);
INSERT INTO `xr_product_project` VALUES ('5', '1', '5', '8');
INSERT INTO `xr_product_project` VALUES ('18', '1', '6', '5');
INSERT INTO `xr_product_project` VALUES ('19', '1', '7', '8');
INSERT INTO `xr_product_project` VALUES ('20', '1', '8', '8');
INSERT INTO `xr_product_project` VALUES ('21', '1', '9', '8');
INSERT INTO `xr_product_project` VALUES ('22', '1', '20', '8');
INSERT INTO `xr_product_project` VALUES ('23', '1', '21', '8');
INSERT INTO `xr_product_project` VALUES ('24', '1', '22', '1');
INSERT INTO `xr_product_project` VALUES ('25', '2', '1', '1');
INSERT INTO `xr_product_project` VALUES ('26', '2', '2', '1');
INSERT INTO `xr_product_project` VALUES ('27', '2', '3', '1');
INSERT INTO `xr_product_project` VALUES ('28', '1', '28', null);

-- ----------------------------
-- Table structure for xr_project
-- ----------------------------
DROP TABLE IF EXISTS `xr_project`;
CREATE TABLE `xr_project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectname` varchar(55) DEFAULT NULL,
  `projecturl` varchar(255) DEFAULT NULL,
  `supproject` int(11) DEFAULT NULL,
  `versions` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xr_project
-- ----------------------------
INSERT INTO `xr_project` VALUES ('1', '渲云', null, null, '1');
INSERT INTO `xr_project` VALUES ('2', '超级服务', null, null, '');
INSERT INTO `xr_project` VALUES ('3', '渲云英文版', null, null, '');
INSERT INTO `xr_project` VALUES ('4', '影视版', null, '2', '');
INSERT INTO `xr_project` VALUES ('5', '效果图版', null, '2', '');
INSERT INTO `xr_project` VALUES ('6', '测试项目1', null, null, '');
INSERT INTO `xr_project` VALUES ('7', '测试项目2', null, null, '');
INSERT INTO `xr_project` VALUES ('8', '测试项目3', null, '7', '');
INSERT INTO `xr_project` VALUES ('9', '测试项目4', null, '7', '');

-- ----------------------------
-- Table structure for xr_project_priority
-- ----------------------------
DROP TABLE IF EXISTS `xr_project_priority`;
CREATE TABLE `xr_project_priority` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `productId` int(16) NOT NULL,
  `projectId` varchar(255) NOT NULL,
  `priority` int(16) DEFAULT NULL,
  `projectName` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xr_project_priority
-- ----------------------------
INSERT INTO `xr_project_priority` VALUES ('1', '1', '1,5,7,8,9', '1', '价格服务');
INSERT INTO `xr_project_priority` VALUES ('2', '1', '2,24,25,26,27', '2', '监控中心');

-- ----------------------------
-- Table structure for xr_project_publish
-- ----------------------------
DROP TABLE IF EXISTS `xr_project_publish`;
CREATE TABLE `xr_project_publish` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `projectName` varchar(255) NOT NULL,
  `updateInfo` varchar(255) DEFAULT NULL,
  `updateTime` datetime DEFAULT NULL,
  `status` int(2) DEFAULT NULL COMMENT '0为开发中，1为已发布,2为需求整理中',
  `version` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xr_project_publish
-- ----------------------------
INSERT INTO `xr_project_publish` VALUES ('1', '价格服务', '1.调整价格翻倍限制大小123//', '2016-10-26 00:00:00', '1', 'V3213');
INSERT INTO `xr_project_publish` VALUES ('2', '监控中心', ' 新版监控中心//', '2016-12-17 00:00:00', '2', 'V5.1');
INSERT INTO `xr_project_publish` VALUES ('3', '网站', 'asd', '2016-11-02 09:16:18', '3', 'V5.2');
INSERT INTO `xr_project_publish` VALUES ('4', '客户端及插件', 'asd11', '2016-11-02 09:16:20', '3', 'V4.5.3.23');
INSERT INTO `xr_project_publish` VALUES ('5', '价格服务', '阿萨德//', '2016-10-31 00:00:00', '1', 'V1.10');
INSERT INTO `xr_project_publish` VALUES ('6', '客户端1', 'asfsdf', '2016-11-02 10:27:54', '1', 'V2');
INSERT INTO `xr_project_publish` VALUES ('7', '价格服务', '阿萨德1', '2016-11-08 10:28:22', '1', '11');
INSERT INTO `xr_project_publish` VALUES ('8', '价格服务', '阿萨德2', '2016-11-08 10:28:22', '1', '11');
INSERT INTO `xr_project_publish` VALUES ('9', '价格服务', '阿萨德3', '2016-11-08 10:28:22', '1', '11');
INSERT INTO `xr_project_publish` VALUES ('10', '客户端', '阿萨德4', '2016-11-03 17:48:06', '1', '11');
INSERT INTO `xr_project_publish` VALUES ('11', 'asd', 'asda', '2016-11-03 00:00:00', '1', 'V12');
INSERT INTO `xr_project_publish` VALUES ('15', '阿萨德', null, '2016-11-09 00:00:00', '2', 'V23');
INSERT INTO `xr_project_publish` VALUES ('16', '阿萨德', null, '2016-11-09 00:00:00', '2', 'V23');
INSERT INTO `xr_project_publish` VALUES ('17', '阿萨德', null, '2016-11-09 00:00:00', '2', 'V23');
INSERT INTO `xr_project_publish` VALUES ('18', '阿萨德', null, '2016-11-09 00:00:00', '2', 'V23');
INSERT INTO `xr_project_publish` VALUES ('19', 'web', '1阿萨德//2个梵蒂冈//3按时发送方//4高富帅的广东富豪//', '2016-11-03 00:00:00', '1', 'V5.2.3');
INSERT INTO `xr_project_publish` VALUES ('20', '价格服务', '1阿斯达嘎嘎嘎//2asdasd//3梵蒂冈和风格//', '2016-11-30 00:00:00', '2', 'V123');
INSERT INTO `xr_project_publish` VALUES ('21', '价格服务', '1阿斯达嘎嘎嘎//2asdasd//3梵蒂冈和风格//', '2016-11-30 00:00:00', '2', 'V123');
INSERT INTO `xr_project_publish` VALUES ('22', '监控中心', '1阿斯达嘎嘎嘎111//2asdasd222//3梵蒂冈和风格111//fsafa//', '2016-11-30 00:00:00', '2', 'V123');
INSERT INTO `xr_project_publish` VALUES ('23', 'asasf', '1asfasf//asfasfasf//3sdfgsg//', '2016-11-10 00:00:00', '2', 'V1.22');
INSERT INTO `xr_project_publish` VALUES ('24', '监控中心', '1阿萨德//244444//', '2016-11-25 00:00:00', '2', '123');
INSERT INTO `xr_project_publish` VALUES ('25', '监控中心', '1.发发//', '2016-11-15 00:00:00', '0', '12');
INSERT INTO `xr_project_publish` VALUES ('26', '监控中心', '1.发发电饭锅电饭锅//', '2016-11-15 00:00:00', '1', '12');
INSERT INTO `xr_project_publish` VALUES ('27', '监控中心', '1.//', '2016-11-15 00:00:00', '2', '1111');
INSERT INTO `xr_project_publish` VALUES ('28', '监控中心', '1.撒就几句//', '2016-11-17 00:00:00', '2', '1');

-- ----------------------------
-- Table structure for xr_require
-- ----------------------------
DROP TABLE IF EXISTS `xr_require`;
CREATE TABLE `xr_require` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL COMMENT '主题',
  `introducer` varchar(55) DEFAULT NULL COMMENT '提出人',
  `description` text COMMENT '描述',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `classify` int(11) DEFAULT NULL COMMENT '所在项目',
  `status` int(11) DEFAULT NULL,
  `chargeperson` int(11) DEFAULT NULL COMMENT '负责人',
  `priority` int(11) DEFAULT NULL COMMENT '优先级 0 普通 1 高 2 紧急',
  `process` varchar(255) DEFAULT '0',
  `prversion` int(11) DEFAULT NULL COMMENT '预计实现版本',
  `reversion` varchar(55) DEFAULT NULL COMMENT '实际实现版本',
  `prtime` datetime DEFAULT NULL COMMENT '预计实现时间',
  `retime` datetime DEFAULT NULL COMMENT '实际实现时间',
  `subtask` varchar(255) DEFAULT NULL COMMENT '子任务 id',
  `supid` int(11) DEFAULT NULL COMMENT '父任务id',
  `fileid` varchar(55) DEFAULT NULL COMMENT '附件id',
  `determineid` int(11) DEFAULT NULL COMMENT '需求定性',
  `reason` text COMMENT '完成原因',
  `relevanceid` int(11) DEFAULT NULL COMMENT '被关联需求id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=248 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xr_require
-- ----------------------------

-- ----------------------------
-- Table structure for xr_status
-- ----------------------------
DROP TABLE IF EXISTS `xr_status`;
CREATE TABLE `xr_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `statusname` varchar(55) DEFAULT NULL,
  `status` int(5) unsigned zerofill DEFAULT '00000' COMMENT '0正常 1删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xr_status
-- ----------------------------
INSERT INTO `xr_status` VALUES ('1', '需求收集', '00000');
INSERT INTO `xr_status` VALUES ('2', '需求归类', '00000');
INSERT INTO `xr_status` VALUES ('3', '评估确认', '00001');
INSERT INTO `xr_status` VALUES ('4', '需求暂缓', '00001');
INSERT INTO `xr_status` VALUES ('5', '研发中', '00001');
INSERT INTO `xr_status` VALUES ('6', '内测中', '00001');
INSERT INTO `xr_status` VALUES ('7', '已完成', '00000');
INSERT INTO `xr_status` VALUES ('8', '合并', '00001');
INSERT INTO `xr_status` VALUES ('9', '拒绝', '00000');

-- ----------------------------
-- Table structure for xr_subtask
-- ----------------------------
DROP TABLE IF EXISTS `xr_subtask`;
CREATE TABLE `xr_subtask` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `requireid` int(11) DEFAULT NULL,
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xr_subtask
-- ----------------------------

-- ----------------------------
-- Table structure for xr_user
-- ----------------------------
DROP TABLE IF EXISTS `xr_user`;
CREATE TABLE `xr_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(80) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `nickname` varchar(40) DEFAULT NULL,
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatetime` datetime DEFAULT NULL,
  `headerpic` varchar(200) DEFAULT NULL,
  `age` int(3) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `email` varchar(80) DEFAULT NULL,
  `male` int(1) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `privilege` int(3) DEFAULT '0' COMMENT '0 普通用户 1管理员',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xr_user
-- ----------------------------
INSERT INTO `xr_user` VALUES ('1', 'shenzuanyi', '123456', 'Mr Shen', '2014-10-16 22:34:28', '2014-10-16 22:34:34', '/images/pic.jpg', '18', '北京', '2312421@qq.com', '1', '123456778890', '0');
INSERT INTO `xr_user` VALUES ('2', 'luhen', '123456', ' 陆恒', '2014-10-16 22:37:38', null, null, null, null, null, null, null, '0');
INSERT INTO `xr_user` VALUES ('3', 'szy', '123456', '沈躜毅', '2016-08-08 11:04:00', null, null, '13', '江苏常州', '5454@qq.com', '1', '12321321321', '0');
INSERT INTO `xr_user` VALUES ('4', 'szy2', 'szy2', '沈', '2016-08-08 11:39:53', null, null, '21', '中国', '5454@qq.com', '1', '31321321312', '1');
INSERT INTO `xr_user` VALUES ('5', 'zhao', '123456', '赵元清', '2016-10-24 13:09:14', null, null, null, null, null, null, null, '1');
INSERT INTO `xr_user` VALUES ('6', 'luo', '123456', '罗文静', '2016-10-24 13:09:14', null, null, null, '', null, null, '', '1');
INSERT INTO `xr_user` VALUES ('7', 'admin', '123456', '管理员', '2016-11-09 10:26:22', null, null, null, null, null, null, null, '1');

-- ----------------------------
-- Table structure for xr_version
-- ----------------------------
DROP TABLE IF EXISTS `xr_version`;
CREATE TABLE `xr_version` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `version` varchar(55) DEFAULT NULL,
  `theme` varchar(255) DEFAULT NULL,
  `project` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xr_version
-- ----------------------------
INSERT INTO `xr_version` VALUES ('1', '3.0.1', '测试主题', '1');
INSERT INTO `xr_version` VALUES ('2', '3.0.2', '测试主题2', '1');
INSERT INTO `xr_version` VALUES ('3', '2.0.2', '测试主题项目2', '2');
INSERT INTO `xr_version` VALUES ('4', '2.0.3', '测试主题项目3', '2');
INSERT INTO `xr_version` VALUES ('5', '1.0.3', '测试主题项目3', '3');
INSERT INTO `xr_version` VALUES ('6', '1.0.4', '测试主题项目3', '3');
INSERT INTO `xr_version` VALUES ('7', '4.0.3', '测试主题2', '4');
INSERT INTO `xr_version` VALUES ('8', '4.0.4', '测试主题2', '4');
INSERT INTO `xr_version` VALUES ('9', '2.0.3', '测试主题2', '5');
INSERT INTO `xr_version` VALUES ('10', '2.0.4', '测试主题2', '5');
INSERT INTO `xr_version` VALUES ('11', '6.0.4', '测试主题2 ', '6');
INSERT INTO `xr_version` VALUES ('12', '6.0.5', '测试主题2', '6');
