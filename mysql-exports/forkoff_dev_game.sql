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
  `serverbuild` blob,
  `serverrules` blob,
  `ownerid` bigint NOT NULL,
  `status` varchar(32) DEFAULT NULL,
  `tspublished` datetime DEFAULT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
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
INSERT INTO `dev_game` VALUES (150063154863280128,NULL,'Texas Holdem',1,'aaaa','bbbbbbb','cccc','dddd',0,NULL,NULL,149293855324246016,NULL,NULL,'2021-02-06 02:17:24','2021-02-06 02:17:24'),(150087331452293120,NULL,'Texas Holdem2',1,'aaaa','bbbb','cccc','dddd',0,NULL,NULL,149293855324246016,NULL,NULL,'2021-02-06 03:53:28','2021-02-06 03:53:28');
/*!40000 ALTER TABLE `dev_game` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-05 22:00:39
