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
  `istest` tinyint NOT NULL DEFAULT '0',
  `rating` int DEFAULT '0',
  `owner` bigint DEFAULT NULL,
  `isfull` tinyint NOT NULL DEFAULT '0',
  `isprivate` tinyint NOT NULL DEFAULT '0',
  `private_key` varchar(16) CHARACTER SET utf8 DEFAULT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  PRIMARY KEY (`room_slug`),
  KEY `room_slug_index` (`room_slug`) /*!80000 INVISIBLE */,
  KEY `game_slug_index` (`game_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf32;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  PRIMARY KEY (`room_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  PRIMARY KEY (`shortid`,`game_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  PRIMARY KEY (`shortid`,`room_slug`),
  KEY `shortid_index` (`shortid`),
  KEY `room_slug_index` (`room_slug`) /*!80000 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-20 23:58:45
