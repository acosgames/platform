-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: forkoff
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
-- Table structure for table `game_client`
--

DROP TABLE IF EXISTS `game_client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_client` (
  `id` bigint NOT NULL,
  `gameid` bigint NOT NULL,
  `clientversion` int DEFAULT NULL,
  `serverversion` int DEFAULT NULL,
  `ownerid` bigint NOT NULL,
  `build_client` varchar(255) DEFAULT NULL,
  `env` tinyint(1) DEFAULT NULL,
  `status` int DEFAULT '1',
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_client`
--

LOCK TABLES `game_client` WRITE;
/*!40000 ALTER TABLE `game_client` DISABLE KEYS */;
INSERT INTO `game_client` VALUES (6772719162688012288,6772719162612514816,1,1,6772002117809864704,NULL,0,1,'2021-03-03 03:27:59','2021-03-03 03:27:59'),(6796538598091915264,6796538598029000704,1,1,149293855324246016,NULL,0,1,'2021-05-07 20:57:55','2021-05-07 20:57:55');
/*!40000 ALTER TABLE `game_client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_client_mod`
--

DROP TABLE IF EXISTS `game_client_mod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_client_mod` (
  `id` bigint NOT NULL,
  `gameid` bigint NOT NULL,
  `clientversion` int DEFAULT NULL,
  `serverversion` int DEFAULT NULL,
  `ownerid` bigint NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` varchar(400) DEFAULT NULL,
  `preview_images` varchar(255) DEFAULT NULL,
  `git_client` varchar(255) DEFAULT NULL,
  `build_client` varchar(255) DEFAULT NULL,
  `status` int DEFAULT '1',
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_client_mod`
--

LOCK TABLES `game_client_mod` WRITE;
/*!40000 ALTER TABLE `game_client_mod` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_client_mod` ENABLE KEYS */;
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
  `ownerid` bigint NOT NULL,
  `name` varchar(64) NOT NULL,
  `maxplayers` int DEFAULT '2',
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
INSERT INTO `game_info` VALUES (6772719162612514816,'texas-holdem',NULL,6772002117809864704,'Texas Holdem',6,'asdf','asdf',NULL,NULL,1,NULL,'2021-03-03 03:27:59','2021-03-03 03:27:59',NULL,NULL),(6796538598029000704,'tictactoe',35,149293855324246016,'TicTacToe',2,'asdf','asdf',NULL,'1.jpg',1,'6394232D38D14DB2AC5B09E329CFD00E','2021-05-23 23:09:18','2021-05-07 20:57:55',NULL,NULL);
/*!40000 ALTER TABLE `game_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_room`
--

DROP TABLE IF EXISTS `game_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_room` (
  `room_slug` varchar(32) NOT NULL,
  `game_slug` varchar(32) NOT NULL,
  `version` int NOT NULL,
  `rating` int DEFAULT NULL,
  `owner` bigint DEFAULT NULL,
  `isfull` tinyint NOT NULL,
  `isprivate` tinyint NOT NULL DEFAULT '0',
  `private_key` varchar(16) DEFAULT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  PRIMARY KEY (`room_slug`),
  KEY `game_room_index` (`room_slug`,`game_slug`) /*!80000 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_room`
--

LOCK TABLES `game_room` WRITE;
/*!40000 ALTER TABLE `game_room` DISABLE KEYS */;
INSERT INTO `game_room` VALUES ('W76CW','tictactoe',36,10,NULL,0,0,NULL,'2021-05-09 15:43:17','2021-05-09 15:43:17');
/*!40000 ALTER TABLE `game_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_room_meta`
--

DROP TABLE IF EXISTS `game_room_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_room_meta` (
  `room_slug` varchar(32) NOT NULL,
  `player_count` int NOT NULL,
  `max_player_count` int DEFAULT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  `state` varchar(6500) DEFAULT NULL,
  `rank` int DEFAULT NULL,
  PRIMARY KEY (`room_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_room_meta`
--

LOCK TABLES `game_room_meta` WRITE;
/*!40000 ALTER TABLE `game_room_meta` DISABLE KEYS */;
INSERT INTO `game_room_meta` VALUES ('d2V2aF',0,NULL,'2021-05-09 15:35:28','2021-05-09 15:35:28',NULL,NULL),('W76CW',0,NULL,'2021-05-09 15:43:17','2021-05-09 15:43:17',NULL,NULL);
/*!40000 ALTER TABLE `game_room_meta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_server`
--

DROP TABLE IF EXISTS `game_server`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_server` (
  `id` bigint NOT NULL,
  `gameid` varchar(45) NOT NULL,
  `serverversion` int NOT NULL,
  `build_server` mediumblob,
  `build_rules` mediumblob,
  `status` varchar(45) DEFAULT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_server`
--

LOCK TABLES `game_server` WRITE;
/*!40000 ALTER TABLE `game_server` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_server` ENABLE KEYS */;
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
INSERT INTO `game_version` VALUES (6796538598029000704,0,34,0,'2021-05-24 01:02:30','2021-05-24 01:02:30'),(6796538598029000704,1,33,0,'2021-05-24 01:02:30','2021-05-24 01:02:30'),(6796538598029000704,0,35,0,'2021-05-25 01:04:01','2021-05-25 01:04:01'),(6796538598029000704,0,36,0,'2021-05-28 14:39:27','2021-05-28 14:39:27');
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `apikey_UNIQUE` (`apikey`),
  UNIQUE KEY `displayname_UNIQUE` (`displayname`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `github_id_UNIQUE` (`github_id`),
  UNIQUE KEY `github_teamid_UNIQUE` (`github_teamid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES (149293855324246016,'joe','joelruiz2@gmail.com','C96899B1BEC943DFB972B919132B3D52',NULL,1,'joetex',NULL,NULL,'2021-02-03 23:20:28','2021-02-03 23:22:33','2021-02-03 23:20:28'),(6771111937385168896,'5SG','five.second.games@gmail.com','D82EFEF03854428EB0A9B99A9BD3DBDE',NULL,0,'5SG',NULL,NULL,'2021-02-26 17:01:27','2021-02-26 19:25:04','2021-02-26 17:01:27'),(6772002117809864704,'JoeOfTexas','hya_oej@hotmail.com','CBA4F713378A403780C39AA3A0AF243D',NULL,1,'JoeOfTexas',79773707,4568407,'2021-03-01 03:58:42','2021-03-01 03:59:16','2021-03-01 03:58:42'),(6773095780560404480,'JoTexas','joel196@yahoo.com','1284DC728E354CCE965145D0A54D7A2D',NULL,1,'JoTexas',80021840,4583177,'2021-03-04 04:24:32','2021-03-04 04:24:43','2021-03-04 04:24:32'),(6779261168264413184,'SERVER','server@fivesecondgames.com','A8043B576A9D42A286666065866F0F72',NULL,0,NULL,NULL,NULL,'2021-03-04 04:24:32','2021-03-04 04:24:43','2021-03-04 04:24:32');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
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
INSERT INTO `server` VALUES (1234,'mq-cluster-1',0,5,0,0,'127.0.0.1:5672','127.0.0.1:5672',NULL,'2021-05-09 15:29:50','2021-03-21 04:34:07'),(6779144424308867072,'redis-cluster-1',0,2,0,0,'127.0.0.1:6379','127.0.0.1:6379',NULL,'2021-04-29 22:44:01','2021-03-20 20:59:41'),(6779156509063380992,'wsnode',0,1,0,0,'127.0.0.1:9002','192.168.0.9:9002',NULL,'2021-05-29 02:39:48','2021-03-20 21:47:42'),(6779258786507915264,'gameserver',0,3,0,0,'127.0.0.1:9100','192.168.0.9:9100',NULL,'2021-05-15 19:59:29','2021-03-21 04:34:07'),(6799740688205348864,'gameserver-1',0,3,0,0,'127.0.0.1:','192.168.0.9',NULL,'2021-05-29 03:02:19','2021-05-16 17:01:53');
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
INSERT INTO `server_type` VALUES (1,'Node'),(2,'Cluster'),(3,'Game Server'),(4,'API'),(5,'MQ');
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

-- Dump completed on 2021-05-28 22:07:37
