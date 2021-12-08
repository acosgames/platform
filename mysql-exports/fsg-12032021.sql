-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: forkoff
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `game_error`
--

DROP TABLE IF EXISTS `game_error`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_error` (
  `gameid` bigint NOT NULL,
  `version` int NOT NULL,
  `count` int NOT NULL DEFAULT '0',
  `type` varchar(64) DEFAULT NULL,
  `title` varchar(512) DEFAULT NULL,
  `body` varchar(1000) DEFAULT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  UNIQUE KEY `body_index` (`body`,`version`,`gameid`),
  KEY `gameid_version_index` (`gameid`,`version`) /*!80000 INVISIBLE */,
  KEY `gameid_index` (`gameid`),
  KEY `primary_index` (`gameid`,`version`,`body`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_error`
--

LOCK TABLES `game_error` WRITE;
/*!40000 ALTER TABLE `game_error` DISABLE KEYS */;
INSERT INTO `game_error` VALUES (6796538598029000704,37,8,'TypeError','Cannot read property \'length\' of undefined','    at Object.onPick (vm.js:1:3281)\n    at vm.js:1:4954\n    at Object.on (vm.js:1:1053)\n    at vm.js:1:4938\n    at vm.js:1:4978\n    at Script.runInContext (vm.js:144:12)\n    at Script.runInContext (vm.js:144:12)','2021-11-24 06:28:28','2021-11-24 06:21:52');
/*!40000 ALTER TABLE `game_error` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_info`
--

DROP TABLE IF EXISTS `game_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_info` (
  `gameid` bigint NOT NULL,
  `game_slug` varchar(32) DEFAULT NULL,
  `version` int DEFAULT NULL,
  `db` tinyint DEFAULT NULL,
  `latest_version` int DEFAULT NULL,
  `latest_db` tinyint DEFAULT NULL,
  `latest_tsupdate` varchar(45) DEFAULT NULL,
  `ownerid` bigint NOT NULL,
  `name` varchar(64) NOT NULL,
  `minplayers` int NOT NULL DEFAULT '2',
  `maxplayers` int NOT NULL DEFAULT '2',
  `teams` varchar(255) DEFAULT NULL,
  `shortdesc` varchar(80) DEFAULT NULL,
  `longdesc` varchar(1200) DEFAULT NULL,
  `git` varchar(500) DEFAULT NULL,
  `preview_images` varchar(255) DEFAULT NULL,
  `status` int NOT NULL,
  `apikey` varchar(32) DEFAULT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  `tspublishedinfo` datetime DEFAULT NULL,
  `tspublishedversion` datetime DEFAULT NULL,
  `votes` int NOT NULL DEFAULT '0',
  `videourl` varchar(255) DEFAULT NULL,
  `genre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`gameid`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `idversion_UNIQUE` (`gameid`,`version`),
  UNIQUE KEY `shortid_UNIQUE` (`game_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_info`
--

LOCK TABLES `game_info` WRITE;
/*!40000 ALTER TABLE `game_info` DISABLE KEYS */;
INSERT INTO `game_info` VALUES (6772719162612514816,'texas-holdem',NULL,NULL,NULL,NULL,NULL,6772002117809864704,'Texas Holdem',2,6,NULL,'asdf','asdf',NULL,NULL,1,NULL,'2021-03-03 03:27:59','2021-03-03 03:27:59',NULL,NULL,0,NULL,NULL),(6796538598029000704,'tictactoe',36,0,37,0,'2021-11-16 05:19:45',149293855324246016,'TicTacToe',2,2,NULL,'asdf','asdf',NULL,'1.jpg',3,'6394232D38D14DB2AC5B09E329CFD00E','2021-11-16 05:19:45','2021-05-07 20:57:55',NULL,NULL,0,NULL,NULL),(6812169007416737792,'trivia',1,NULL,2,1,'2021-11-16 04:44:12',149293855324246016,'Trivia',2,6,NULL,'asdf','asdf',NULL,'1.png',3,'F94659296D5E434988300A74E716C023','2021-11-16 04:44:12','2021-06-20 00:07:40',NULL,NULL,0,NULL,NULL),(6865515196689940480,'test-game-1',NULL,NULL,NULL,NULL,NULL,6772002117809864704,'Test Game 1',2,2,NULL,'short desc','long description',NULL,NULL,1,'86E85219465D4870AFC612E5D373E5C2','2021-11-14 05:06:25','2021-11-14 05:06:25',NULL,NULL,0,NULL,NULL),(6866234719101517824,'test-game-2',NULL,NULL,NULL,NULL,'2021-11-16 05:05:14',149293855324246016,'Test game 2',2,2,'Blue, Orange','test game 2','asdfasd fasdfasdf',NULL,'1.png',2,'B72A3B666E084F93948F3A467D93B7FE','2021-11-16 05:25:32','2021-11-16 04:45:25',NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `game_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_modes`
--

DROP TABLE IF EXISTS `game_modes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_modes` (
  `mode_id` int NOT NULL,
  `name` varchar(45) NOT NULL,
  `data` varchar(255) DEFAULT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  PRIMARY KEY (`mode_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_modes`
--

LOCK TABLES `game_modes` WRITE;
/*!40000 ALTER TABLE `game_modes` DISABLE KEYS */;
INSERT INTO `game_modes` VALUES (0,'beta',NULL,'2021-09-23 02:40:36','2021-09-23 02:40:36'),(1,'rank','{\"threshold\":400, \"delta\":50, \"retryDelay\":1000}','2021-09-23 02:40:36','2021-09-23 02:40:36'),(2,'public',NULL,'2021-09-23 02:40:36','2021-09-23 02:40:36'),(3,'private',NULL,'2021-09-23 02:40:36','2021-09-23 02:40:36');
/*!40000 ALTER TABLE `game_modes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_review`
--

DROP TABLE IF EXISTS `game_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_review` (
  `game_slug` varchar(32) NOT NULL,
  `shortid` varchar(10) NOT NULL,
  `rating` int DEFAULT NULL,
  `review` varchar(255) DEFAULT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  PRIMARY KEY (`game_slug`,`shortid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_review`
--

LOCK TABLES `game_review` WRITE;
/*!40000 ALTER TABLE `game_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_room`
--

DROP TABLE IF EXISTS `game_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_room` (
  `room_slug` varchar(32) CHARACTER SET utf8 NOT NULL,
  `game_slug` varchar(32) CHARACTER SET utf8 NOT NULL,
  `gameid` bigint NOT NULL,
  `version` int NOT NULL,
  `db` tinyint DEFAULT NULL,
  `latest_tsupdate` datetime DEFAULT NULL,
  `minplayers` int NOT NULL DEFAULT '2',
  `maxplayers` int NOT NULL DEFAULT '2',
  `teams` varchar(255) DEFAULT NULL,
  `mode` int DEFAULT '0',
  `istest` tinyint NOT NULL DEFAULT '0',
  `rating` int DEFAULT '0',
  `owner` varchar(32) DEFAULT NULL,
  `isfull` tinyint NOT NULL DEFAULT '0',
  `isprivate` tinyint NOT NULL DEFAULT '0',
  `private_key` varchar(16) CHARACTER SET utf8 DEFAULT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  PRIMARY KEY (`room_slug`),
  KEY `room_slug_index` (`room_slug`) /*!80000 INVISIBLE */,
  KEY `game_slug_index` (`game_slug`),
  KEY `gameid_index` (`gameid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_room`
--

LOCK TABLES `game_room` WRITE;
/*!40000 ALTER TABLE `game_room` DISABLE KEYS */;
INSERT INTO `game_room` VALUES ('9K6RRH','tictactoe',6796538598029000704,37,0,'2021-11-16 05:19:45',2,2,NULL,0,0,0,'manC6',0,0,NULL,'2021-11-28 02:10:30','2021-11-28 02:10:30');
/*!40000 ALTER TABLE `game_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_status`
--

DROP TABLE IF EXISTS `game_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_status` (
  `id` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_status`
--

LOCK TABLES `game_status` WRITE;
/*!40000 ALTER TABLE `game_status` DISABLE KEYS */;
INSERT INTO `game_status` VALUES (1,'Draft'),(2,'Test'),(3,'Production'),(4,'Archive'),(5,'Suspended');
/*!40000 ALTER TABLE `game_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_version`
--

DROP TABLE IF EXISTS `game_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_version` (
  `gameid` bigint NOT NULL,
  `status` int NOT NULL,
  `db` tinyint DEFAULT '0',
  `version` int DEFAULT NULL,
  `gamesplayed` int DEFAULT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  UNIQUE KEY `gameid_version_unique` (`gameid`,`version`),
  KEY `gameid_version_index` (`gameid`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_version`
--

LOCK TABLES `game_version` WRITE;
/*!40000 ALTER TABLE `game_version` DISABLE KEYS */;
INSERT INTO `game_version` VALUES (6796538598029000704,2,0,34,0,'2021-08-14 21:35:27','2021-05-24 01:02:30'),(6796538598029000704,2,0,33,0,'2021-08-14 21:35:27','2021-05-24 01:02:30'),(6796538598029000704,2,0,35,0,'2021-08-14 21:35:27','2021-05-25 01:04:01'),(6812169007416737792,2,1,1,0,'2021-08-14 21:34:11','2021-06-20 00:16:00'),(6796538598029000704,2,0,36,0,'2021-08-15 04:00:44','2021-08-07 19:20:51'),(6812169007416737792,2,1,2,0,'2021-11-16 04:44:12','2021-08-07 19:32:42'),(6796538598029000704,2,0,37,0,'2021-11-16 05:19:45','2021-09-20 01:23:50'),(6866234719101517824,2,0,1,0,'2021-11-16 05:05:11','2021-11-16 04:45:53');
/*!40000 ALTER TABLE `game_version` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person`
--

DROP TABLE IF EXISTS `person`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person` (
  `id` bigint NOT NULL,
  `shortid` varchar(10) DEFAULT NULL,
  `displayname` varchar(32) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `apikey` varchar(64) NOT NULL,
  `prevapikey` varchar(45) DEFAULT NULL,
  `isdev` tinyint unsigned NOT NULL DEFAULT '0',
  `github` varchar(255) DEFAULT NULL,
  `github_id` int DEFAULT NULL,
  `github_teamid` int DEFAULT NULL,
  `tsinsert` datetime NOT NULL,
  `tsupdate` datetime DEFAULT NULL,
  `tsapikey` datetime NOT NULL,
  `logintoken` varchar(64) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `apikey_UNIQUE` (`apikey`),
  UNIQUE KEY `displayname_UNIQUE` (`displayname`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `github_id_UNIQUE` (`github_id`),
  UNIQUE KEY `github_teamid_UNIQUE` (`github_teamid`),
  UNIQUE KEY `shortid_UNIQUE` (`shortid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES (149293855324246016,'8CCkf','joe','joelruiz2@gmail.com','C96899B1BEC943DFB972B919132B3D52',NULL,1,'joetex',NULL,NULL,'2021-02-03 23:20:28','2021-02-03 23:22:33','2021-02-03 23:20:28',NULL,NULL),(6771111937385168896,'manC6','5SG','five.second.games@gmail.com','D82EFEF03854428EB0A9B99A9BD3DBDE',NULL,0,'5SG',NULL,NULL,'2021-02-26 17:01:27','2021-02-26 19:25:04','2021-02-26 17:01:27',NULL,NULL),(6772002117809864704,'4HFuz','JoeOfTexas','hya_oej@hotmail.com','CBA4F713378A403780C39AA3A0AF243D',NULL,1,'JoeOfTexas',79773707,4568407,'2021-03-01 03:58:42','2021-03-01 03:59:16','2021-03-01 03:58:42',NULL,NULL),(6773095780560404480,'47Scu','JoTexas','joel196@yahoo.com','1284DC728E354CCE965145D0A54D7A2D',NULL,1,'JoTexas',80021840,4583177,'2021-03-04 04:24:32','2021-03-04 04:24:43','2021-03-04 04:24:32',NULL,NULL),(6779261168264413184,'Oi7qt','SERVER','server@fivesecondgames.com','A8043B576A9D42A286666065866F0F72',NULL,0,NULL,NULL,NULL,'2021-03-04 04:24:32','2021-03-04 04:24:43','2021-03-04 04:24:32',NULL,NULL);
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person_rank`
--

DROP TABLE IF EXISTS `person_rank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person_rank` (
  `shortid` varchar(32) NOT NULL,
  `game_slug` varchar(32) NOT NULL,
  `rating` int NOT NULL DEFAULT '1200',
  `mu` double NOT NULL DEFAULT '12',
  `sigma` double NOT NULL DEFAULT '1.5',
  `win` int NOT NULL DEFAULT '0',
  `loss` int NOT NULL DEFAULT '0',
  `tie` int NOT NULL DEFAULT '0',
  `played` int NOT NULL DEFAULT '0',
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  PRIMARY KEY (`shortid`,`game_slug`),
  KEY `game_slug_index` (`game_slug`),
  KEY `shortid_index` (`shortid`),
  KEY `sorted_index` (`rating` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person_rank`
--

LOCK TABLES `person_rank` WRITE;
/*!40000 ALTER TABLE `person_rank` DISABLE KEYS */;
INSERT INTO `person_rank` VALUES ('8CCkf','tictactoe',2905,29.054165373566224,1.3112215224249981,0,0,0,0,'2021-11-28 02:02:26','2021-11-23 05:21:27'),('manC6','tictactoe',3095,30.945834626433783,1.3112215224249981,0,0,0,0,'2021-11-28 02:02:26','2021-11-23 05:21:27');
/*!40000 ALTER TABLE `person_rank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `person_room`
--

DROP TABLE IF EXISTS `person_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person_room` (
  `shortid` varchar(32) NOT NULL,
  `game_slug` varchar(32) DEFAULT NULL,
  `room_slug` varchar(32) NOT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  `mode` varchar(32) DEFAULT NULL,
  `version` int DEFAULT NULL,
  PRIMARY KEY (`shortid`,`room_slug`),
  KEY `shortid_index` (`shortid`),
  KEY `room_slug_index` (`room_slug`) /*!80000 INVISIBLE */,
  KEY `game_slug_index` (`game_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person_room`
--

LOCK TABLES `person_room` WRITE;
/*!40000 ALTER TABLE `person_room` DISABLE KEYS */;
INSERT INTO `person_room` VALUES ('8CCkf','tictactoe','9K6RRH','2021-11-28 02:10:30','2021-11-28 02:10:30','beta',37),('manC6','tictactoe','9K6RRH','2021-11-28 02:10:30','2021-11-28 02:10:30','beta',37);
/*!40000 ALTER TABLE `person_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `server`
--

DROP TABLE IF EXISTS `server`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `server` (
  `id` bigint NOT NULL,
  `hostname` varchar(45) NOT NULL,
  `zone` int NOT NULL,
  `instance_type` int NOT NULL,
  `player_count` int DEFAULT '0',
  `game_count` int DEFAULT '0',
  `public_addr` varchar(24) DEFAULT NULL,
  `private_addr` varchar(24) DEFAULT NULL,
  `connect_addr` varchar(45) DEFAULT NULL,
  `tsupdate` datetime DEFAULT NULL,
  `tsinsert` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `public_addr_UNIQUE` (`public_addr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `server`
--

LOCK TABLES `server` WRITE;
/*!40000 ALTER TABLE `server` DISABLE KEYS */;
INSERT INTO `server` VALUES (1234,'mq-cluster-1',0,5,0,0,'127.0.0.1:5672','127.0.0.1:5672',NULL,'2021-05-09 15:29:50','2021-03-21 04:34:07'),(6779144424308867072,'redis-cluster-1',0,2,0,0,'127.0.0.1:6379','127.0.0.1:6379',NULL,'2021-04-29 22:44:01','2021-03-20 20:59:41'),(6779156509063380992,'wsnode',0,1,0,0,'127.0.0.1:9002','192.168.1.117:9002',NULL,'2021-12-02 02:32:24','2021-03-20 21:47:42'),(6779258786507915264,'gameserver',0,3,0,0,'127.0.0.1:9100','192.168.0.9:9100',NULL,'2021-05-15 19:59:29','2021-03-21 04:34:07'),(6799740688205348864,'gameserver-1',0,3,0,0,'127.0.0.1:','192.168.1.117',NULL,'2021-09-19 05:08:33','2021-05-16 17:01:53');
/*!40000 ALTER TABLE `server` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `server_type`
--

DROP TABLE IF EXISTS `server_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `server_type` (
  `id` int NOT NULL,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `server_type`
--

LOCK TABLES `server_type` WRITE;
/*!40000 ALTER TABLE `server_type` DISABLE KEYS */;
INSERT INTO `server_type` VALUES (1,'Node'),(2,'Redis'),(3,'Game Server'),(4,'API'),(5,'MQ');
/*!40000 ALTER TABLE `server_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-03 20:50:41
