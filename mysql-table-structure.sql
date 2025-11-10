CREATE DATABASE  IF NOT EXISTS `forkoff` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `forkoff`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: forkoff
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `achievement_definition`
--

DROP TABLE IF EXISTS `achievement_definition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `achievement_definition` (
  `game_slug` varchar(45) NOT NULL,
  `achievement_slug` varchar(45) NOT NULL,
  `achievement_name` varchar(32) NOT NULL,
  `achivement_description` varchar(45) DEFAULT NULL,
  `achievement_icon` varchar(45) DEFAULT NULL,
  `stat_slug1` varchar(32) DEFAULT NULL,
  `goal1_valueINT` int DEFAULT NULL,
  `goal1_valueFLOAT` float DEFAULT NULL,
  `goal1_valueSTRING` varchar(45) DEFAULT NULL,
  `stat_slug2` varchar(32) DEFAULT NULL,
  `goal2_valueINT` int DEFAULT NULL,
  `goal2_valueFLOAT` float DEFAULT NULL,
  `goal2_valueSTRING` varchar(45) DEFAULT NULL,
  `stat_slug3` varchar(32) DEFAULT NULL,
  `goal3_valueINT` int DEFAULT NULL,
  `goal3_valueFLOAT` float DEFAULT NULL,
  `goal3_valueSTRING` varchar(45) DEFAULT NULL,
  `all_required` tinyint DEFAULT NULL,
  `within_one_match` tinyint DEFAULT NULL,
  `times_in_a_row` int DEFAULT NULL,
  `award_item` int DEFAULT NULL,
  `award_xp` int NOT NULL,
  `award_gamepoints` int DEFAULT NULL,
  `award_badge` int DEFAULT NULL,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`game_slug`,`achievement_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `achievement_icons`
--

DROP TABLE IF EXISTS `achievement_icons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `achievement_icons` (
  `iconid` int NOT NULL,
  `on_filename` varchar(45) DEFAULT NULL,
  `off_filename` varchar(45) DEFAULT NULL,
  `isactive` tinyint DEFAULT '1',
  `tsinsert` datetime NOT NULL,
  `tsupdate` datetime NOT NULL,
  PRIMARY KEY (`iconid`),
  UNIQUE KEY `active_UNIQUE` (`on_filename`),
  UNIQUE KEY `inactive_UNIQUE` (`off_filename`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `division`
--

DROP TABLE IF EXISTS `division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `division` (
  `game_slug` varchar(32) NOT NULL,
  `season` int NOT NULL,
  `division_id` int NOT NULL,
  `division_name` varchar(64) DEFAULT NULL,
  `player_count` int DEFAULT '0',
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`game_slug`,`season`,`division_id`),
  UNIQUE KEY `gameslug_id_name` (`game_slug`,`division_name`,`season`),
  KEY `gameslug_season` (`game_slug`,`season`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `friend_status_type`
--

DROP TABLE IF EXISTS `friend_status_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friend_status_type` (
  `status` int NOT NULL,
  `statusname` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_dev`
--

DROP TABLE IF EXISTS `game_dev`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_dev` (
  `gameid` bigint NOT NULL,
  `ownerid` bigint NOT NULL,
  `role` int NOT NULL DEFAULT '0',
  `apikey` varchar(64) NOT NULL,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`gameid`,`ownerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_error`
--

DROP TABLE IF EXISTS `game_error`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_error` (
  `game_slug` varchar(32) NOT NULL,
  `version` int NOT NULL,
  `count` int NOT NULL DEFAULT '0',
  `type` varchar(64) DEFAULT NULL,
  `title` varchar(512) DEFAULT NULL,
  `body` varchar(1000) DEFAULT NULL,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `body_index` (`body`,`version`),
  KEY `primary_index` (`version`,`body`),
  KEY `gameid_version_index` (`version`) /*!80000 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_info`
--

DROP TABLE IF EXISTS `game_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_info` (
  `gameid` bigint NOT NULL,
  `game_slug` varchar(32) NOT NULL,
  `name` varchar(64) NOT NULL,
  `version` int DEFAULT NULL,
  `db` tinyint DEFAULT NULL,
  `season` int DEFAULT '0',
  `visible` int NOT NULL DEFAULT '1',
  `latest_version` int DEFAULT NULL,
  `ownerid` bigint NOT NULL,
  `minplayers` int NOT NULL DEFAULT '2',
  `maxplayers` int NOT NULL DEFAULT '2',
  `lbscore` tinyint NOT NULL DEFAULT '0',
  `maxteams` int DEFAULT '0',
  `minteams` int DEFAULT '0',
  `shortdesc` varchar(120) DEFAULT NULL,
  `longdesc` varchar(5000) DEFAULT NULL,
  `opensource` tinyint DEFAULT NULL,
  `template` varchar(32) DEFAULT NULL,
  `preview_images` varchar(255) DEFAULT NULL,
  `videourl` varchar(255) DEFAULT NULL,
  `genre` varchar(45) DEFAULT NULL,
  `votes` int NOT NULL DEFAULT '0',
  `status` int NOT NULL,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`game_slug`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `gameid_UNIQUE` (`gameid`),
  UNIQUE KEY `idversion_UNIQUE` (`gameid`,`version`),
  KEY `ownerid_index` (`ownerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_items`
--

DROP TABLE IF EXISTS `game_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_items` (
  `item_name` varchar(64) NOT NULL,
  `item_desc` varchar(255) DEFAULT NULL,
  `item_slug` varchar(32) DEFAULT NULL,
  `item_order` int DEFAULT NULL,
  `icon` varchar(64) DEFAULT NULL,
  `max_uses` int DEFAULT NULL,
  `expire_days` int DEFAULT NULL,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`item_name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mode_id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_review`
--

DROP TABLE IF EXISTS `game_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_review` (
  `game_slug` varchar(32) NOT NULL,
  `shortid` varchar(10) NOT NULL,
  `vote` tinyint DEFAULT NULL,
  `report` int DEFAULT NULL,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`game_slug`,`shortid`),
  KEY `reporttype_index` (`game_slug`,`shortid`,`report`) /*!80000 INVISIBLE */,
  KEY `game_slug_index` (`game_slug`),
  KEY `game_like_index` (`game_slug`,`vote`),
  KEY `shortid_index` (`shortid`) /*!80000 INVISIBLE */,
  KEY `game_slug_shortid_index` (`game_slug`,`shortid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_room`
--

DROP TABLE IF EXISTS `game_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_room` (
  `room_slug` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `game_slug` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `season` int DEFAULT NULL,
  `version` int NOT NULL,
  `mode` int DEFAULT '0',
  `rating` int DEFAULT '0',
  `owner` varchar(32) DEFAULT NULL,
  `status` int NOT NULL DEFAULT '0',
  `private_key` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`room_slug`),
  KEY `room_slug_index` (`room_slug`) /*!80000 INVISIBLE */,
  KEY `game_slug_index` (`game_slug`),
  KEY `roomslug_gameslug` (`room_slug`,`game_slug`),
  KEY `roomid_gameslug` (`game_slug`) /*!80000 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf32;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_team`
--

DROP TABLE IF EXISTS `game_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_team` (
  `game_slug` varchar(32) NOT NULL,
  `team_slug` varchar(32) NOT NULL,
  `team_order` int DEFAULT NULL,
  `team_name` varchar(64) NOT NULL,
  `minplayers` int NOT NULL DEFAULT '1',
  `maxplayers` int NOT NULL DEFAULT '1',
  `color` varchar(45) DEFAULT NULL,
  `icon` varchar(32) DEFAULT NULL,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`game_slug`,`team_slug`),
  UNIQUE KEY `game_slug_team_slug_unique` (`game_slug`,`team_slug`),
  KEY `game_slug_index` (`game_slug`),
  KEY `team_slug_index` (`team_slug`),
  KEY `game_slug_team_slug_index` (`game_slug`,`team_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_version`
--

DROP TABLE IF EXISTS `game_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_version` (
  `gameid` bigint NOT NULL,
  `version` int DEFAULT NULL,
  `db` tinyint DEFAULT '0',
  `css` tinyint DEFAULT '0',
  `scaled` tinyint NOT NULL DEFAULT '0',
  `screentype` int NOT NULL DEFAULT '3',
  `resow` int NOT NULL DEFAULT '4',
  `resoh` int NOT NULL DEFAULT '4',
  `screenwidth` int NOT NULL DEFAULT '1920',
  `status` int NOT NULL,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `gameid_version_unique` (`gameid`,`version`),
  KEY `gameid_version_index` (`gameid`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
  `logintoken` varchar(64) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `webpush` varchar(1000) DEFAULT NULL,
  `portraitid` int DEFAULT NULL,
  `countrycode` varchar(2) DEFAULT 'US',
  `points` int DEFAULT '0',
  `level` float DEFAULT '1',
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tsupdate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsapikey` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `apikey_UNIQUE` (`apikey`),
  UNIQUE KEY `displayname_UNIQUE` (`displayname`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `github_id_UNIQUE` (`github_id`),
  UNIQUE KEY `github_teamid_UNIQUE` (`github_teamid`),
  UNIQUE KEY `shortid_UNIQUE` (`shortid`),
  UNIQUE KEY `shortid_countrycode` (`shortid`,`countrycode`) /*!80000 INVISIBLE */,
  UNIQUE KEY `displayname_shortid` (`shortid`,`displayname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `person_achievement`
--

DROP TABLE IF EXISTS `person_achievement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person_achievement` (
  `achievement_slug` varchar(32) NOT NULL,
  `game_slug` varchar(32) NOT NULL,
  `shortid` varchar(12) NOT NULL,
  `stat1_valueINT` int DEFAULT NULL,
  `stat1_valueFLOAT` float DEFAULT NULL,
  `stat1_valueSTRING` varchar(32) DEFAULT NULL,
  `stat2_valueINT` int DEFAULT NULL,
  `stat2_valueFLOAT` float DEFAULT NULL,
  `stat2_valueSTRING` varchar(32) DEFAULT NULL,
  `stat3_valueINT` int DEFAULT NULL,
  `stat3_valueFLOAT` float DEFAULT NULL,
  `stat3_valueSTRING` varchar(32) DEFAULT NULL,
  `wins` int DEFAULT NULL,
  `played` int DEFAULT NULL,
  `tournament_played` int DEFAULT NULL,
  `tournament_wins` int DEFAULT NULL,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`achievement_slug`,`game_slug`,`shortid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `person_friend`
--

DROP TABLE IF EXISTS `person_friend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person_friend` (
  `personid` varchar(10) NOT NULL,
  `friendid` varchar(10) NOT NULL,
  `initiated` tinyint DEFAULT NULL,
  `statusid` int DEFAULT '0',
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tsupdate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`personid`,`friendid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
  `season` int NOT NULL DEFAULT '0',
  `rating` int NOT NULL DEFAULT '2500',
  `mu` double NOT NULL DEFAULT '25',
  `sigma` double NOT NULL DEFAULT '1.33',
  `win` int NOT NULL DEFAULT '0',
  `loss` int NOT NULL DEFAULT '0',
  `tie` int NOT NULL DEFAULT '0',
  `played` int NOT NULL DEFAULT '1',
  `highscore` int NOT NULL DEFAULT '0',
  `division` int DEFAULT NULL,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`shortid`,`game_slug`,`season`),
  UNIQUE KEY `gameslug_season_shortid` (`shortid`,`game_slug`,`season`),
  KEY `game_slug_index` (`game_slug`),
  KEY `shortid_index` (`shortid`),
  KEY `sorted_index` (`rating` DESC),
  KEY `gameslug_season` (`game_slug`,`season`) /*!80000 INVISIBLE */,
  KEY `gameslug_division_season_index` (`game_slug`,`season`,`division`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `person_room`
--

DROP TABLE IF EXISTS `person_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person_room` (
  `shortid` varchar(12) NOT NULL,
  `room_slug` varchar(12) NOT NULL,
  `score` int DEFAULT NULL,
  `winloss` tinyint DEFAULT NULL,
  `place` smallint DEFAULT NULL,
  `tsupdate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`shortid`,`room_slug`),
  KEY `shortid_index` (`shortid`),
  KEY `shortid_gameslug` (`shortid`),
  KEY `shortid_roomslug` (`shortid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `person_stat_global`
--

DROP TABLE IF EXISTS `person_stat_global`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person_stat_global` (
  `stat_slug` varchar(32) NOT NULL,
  `shortid` varchar(45) NOT NULL,
  `game_slug` varchar(45) NOT NULL,
  `season` int NOT NULL,
  `valueINT` int DEFAULT NULL,
  `valueFLOAT` float DEFAULT NULL,
  `valueSTRING` varchar(45) DEFAULT NULL,
  `tsupdate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`stat_slug`,`shortid`,`game_slug`,`season`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `person_stat_match`
--

DROP TABLE IF EXISTS `person_stat_match`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `person_stat_match` (
  `stat_slug` varchar(32) NOT NULL,
  `room_slug` varchar(12) NOT NULL,
  `shortid` varchar(12) NOT NULL,
  `valueINT` int DEFAULT NULL,
  `valueFLOAT` float DEFAULT NULL,
  `valueSTRING` varchar(45) DEFAULT NULL,
  `tsupdate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`stat_slug`,`room_slug`,`shortid`),
  KEY `match_shortid` (`room_slug`,`shortid`) /*!80000 INVISIBLE */,
  KEY `shortid_definition_id` (`stat_slug`,`shortid`) /*!80000 INVISIBLE */,
  KEY `shortid` (`shortid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `platform_versions`
--

DROP TABLE IF EXISTS `platform_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platform_versions` (
  `type` int NOT NULL,
  `version` int NOT NULL DEFAULT '0',
  `tsupdate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `portrait`
--

DROP TABLE IF EXISTS `portrait`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `portrait` (
  `portraitid` int NOT NULL,
  `category` varchar(64) NOT NULL,
  `ext` varchar(4) NOT NULL,
  `isactive` tinyint DEFAULT NULL,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`portraitid`,`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `room_status`
--

DROP TABLE IF EXISTS `room_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_status` (
  `room_status_id` int NOT NULL,
  `status` varchar(64) DEFAULT NULL,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`room_status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
  `tsupdate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `public_addr_UNIQUE` (`public_addr`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stat_algorithm`
--

DROP TABLE IF EXISTS `stat_algorithm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stat_algorithm` (
  `algorithm_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `algorithm` varchar(64) DEFAULT NULL,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`algorithm_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stat_definition`
--

DROP TABLE IF EXISTS `stat_definition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stat_definition` (
  `stat_slug` varchar(32) NOT NULL,
  `algorithm_id` int DEFAULT NULL,
  `game_slug` varchar(32) NOT NULL,
  `stat_name` varchar(64) DEFAULT NULL,
  `stat_abbreviation` varchar(3) DEFAULT NULL,
  `stat_desc` varchar(1024) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `valueTYPE` int DEFAULT '0',
  `isactive` tinyint DEFAULT NULL,
  `scoreboard` tinyint DEFAULT NULL,
  `stat_order` smallint DEFAULT NULL,
  `tsinsert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`stat_slug`,`game_slug`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stat_type`
--

DROP TABLE IF EXISTS `stat_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stat_type` (
  `type_name` varchar(32) NOT NULL,
  `valueTYPE` int NOT NULL,
  `type_column` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`valueTYPE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-09 18:16:59
