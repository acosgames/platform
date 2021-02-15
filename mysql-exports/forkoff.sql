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
-- Table structure for table `dev_game`
--

DROP TABLE IF EXISTS `dev_game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dev_game` (
  `gameid` bigint NOT NULL,
  `shortid` varchar(32) DEFAULT NULL,
  `name` varchar(60) NOT NULL,
  `version` int NOT NULL,
  `shortdesc` varchar(80) NOT NULL,
  `longdesc` varchar(1200) NOT NULL,
  `clientgit` varchar(45) DEFAULT NULL,
  `servergit` varchar(45) DEFAULT NULL,
  `playercount` int NOT NULL DEFAULT '0',
  `serverbuild` mediumblob,
  `serverrules` mediumblob,
  `ownerid` bigint NOT NULL,
  `status` varchar(32) DEFAULT NULL,
  `tspublished` datetime DEFAULT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  `image_previews` tinyint(1) DEFAULT '0',
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `idversion_UNIQUE` (`gameid`,`version`),
  UNIQUE KEY `shortid_UNIQUE` (`shortid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dev_game`
--

LOCK TABLES `dev_game` WRITE;
/*!40000 ALTER TABLE `dev_game` DISABLE KEYS */;
INSERT INTO `dev_game` VALUES (6764280514070183936,NULL,'Texas Holdem',1,'asdf','asdf','asdf','asdf',0,NULL,NULL,149293855324246016,NULL,NULL,'2021-02-08 02:53:44','2021-02-07 20:35:48',0);
/*!40000 ALTER TABLE `dev_game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game` (
  `id` bigint NOT NULL,
  `shortid` varchar(32) NOT NULL,
  `name` varchar(60) NOT NULL,
  `version` int NOT NULL,
  `shortdesc` varchar(80) NOT NULL,
  `longdesc` varchar(1200) NOT NULL,
  `clientgit` varchar(45) DEFAULT NULL,
  `servergit` varchar(45) DEFAULT NULL,
  `playercount` int NOT NULL DEFAULT '0',
  `serverbuild` blob,
  `serverrules` blob,
  `ownerid` bigint NOT NULL,
  `status` varchar(32) DEFAULT NULL,
  `tspublished` datetime DEFAULT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shortid_UNIQUE` (`shortid`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
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
  `tsinsert` datetime NOT NULL,
  `tsupdate` datetime DEFAULT NULL,
  `tsapikey` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `apikey_UNIQUE` (`apikey`),
  UNIQUE KEY `displayname_UNIQUE` (`displayname`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person`
--

LOCK TABLES `person` WRITE;
/*!40000 ALTER TABLE `person` DISABLE KEYS */;
INSERT INTO `person` VALUES (148616769831964672,'tim','hya_oej@hotmail.com','784327250AC644399DE629DE18AE27C8',NULL,0,NULL,'2021-02-02 02:29:59','2021-02-02 02:29:59','2021-02-02 02:29:59'),(149293855324246016,'joe','joelruiz2@gmail.com','C96899B1BEC943DFB972B919132B3D52',NULL,1,'joetex','2021-02-03 23:20:28','2021-02-03 23:22:33','2021-02-03 23:20:28');
/*!40000 ALTER TABLE `person` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `server`
--

DROP TABLE IF EXISTS `server`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `server` (
  `id` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `playercount` int DEFAULT NULL,
  `gamecount` int DEFAULT NULL,
  `tsupdate` datetime DEFAULT NULL,
  `tsinsert` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `server`
--

LOCK TABLES `server` WRITE;
/*!40000 ALTER TABLE `server` DISABLE KEYS */;
/*!40000 ALTER TABLE `server` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'forkoff'
--

--
-- Dumping routines for database 'forkoff'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-13 12:59:52
