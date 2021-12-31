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
-- Table structure for table `avatar`
--

DROP TABLE IF EXISTS `avatar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avatar` (
  `id` int NOT NULL,
  `filename` varchar(64) NOT NULL,
  `info` varchar(300) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `tsinsert` datetime NOT NULL,
  `tsupdate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avatar`
--

LOCK TABLES `avatar` WRITE;
/*!40000 ALTER TABLE `avatar` DISABLE KEYS */;
/*!40000 ALTER TABLE `avatar` ENABLE KEYS */;
UNLOCK TABLES;

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
  `tsupdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`gameid`,`ownerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_dev`
--

LOCK TABLES `game_dev` WRITE;
/*!40000 ALTER TABLE `game_dev` DISABLE KEYS */;
INSERT INTO `game_dev` VALUES (6796538598029000704,149293855324246016,0,'FBC4864251084B188F1A6E63F70C38D3','2021-12-20 17:56:38','2021-12-20 17:56:38'),(6812169007416737792,149293855324246016,0,'05481F209C7F46298267AE36B3179FA3','2021-12-20 17:57:32','2021-12-20 17:57:32'),(6878850439647854592,149293855324246016,0,'5EABE9FC44984574B08576F204E50818','2021-12-21 00:15:47','2021-12-21 00:15:47'),(6878850838484221952,149293855324246016,0,'CC848CB23AB64D4FB98C83D14860AF70','2021-12-21 00:17:22','2021-12-21 00:17:22'),(6878850941739597824,149293855324246016,0,'75E79D0CEC704DC49A17C89F9120731C','2021-12-21 00:17:47','2021-12-21 00:17:47'),(6878851140797071360,149293855324246016,0,'20D6EC5C066441F089842AAF071CD3D9','2021-12-21 00:18:34','2021-12-21 00:18:34'),(6878851498453762048,149293855324246016,0,'EF1B9E98E0D94FD59DC2B9495058EAFE','2021-12-21 00:20:00','2021-12-21 00:20:00'),(6878851711604097024,149293855324246016,0,'31ABCDB9E1214BB184A6CC57E48FF194','2021-12-21 00:20:50','2021-12-21 00:20:50');
/*!40000 ALTER TABLE `game_dev` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `game_error` VALUES (6796538598029000704,37,8,'TypeError','Cannot read property \'length\' of undefined','    at Object.onPick (vm.js:1:3281)\n    at vm.js:1:4954\n    at Object.on (vm.js:1:1053)\n    at vm.js:1:4938\n    at vm.js:1:4978\n    at Script.runInContext (vm.js:144:12)\n    at Script.runInContext (vm.js:144:12)','2021-11-24 06:28:28','2021-11-24 06:21:52'),(6796538598029000704,37,4,'TypeError','Cannot read properties of undefined (reading \'length\')','    at Object.onPick (vm.js:1:3281)\n    at vm.js:1:4954\n    at Object.on (vm.js:1:1053)\n    at vm.js:1:4938\n    at vm.js:1:4978','2021-12-04 05:46:34','2021-12-04 05:46:34'),(6812169007416737792,2,0,'TypeError','Cannot read properties of undefined (reading \'length\')','    at Object.processNextQuestion (vm.js:1:3748)\n    at Object.nextRound (vm.js:1:3488)\n    at Object.checkStartGame (vm.js:1:3279)\n    at Object.onJoin (vm.js:1:2940)\n    at vm.js:1:4592\n    at Object.on (vm.js:1:1077)\n    at vm.js:1:4576\n    at vm.js:1:4678','2021-12-18 03:00:58','2021-12-18 03:00:58'),(6812169007416737792,1,0,'TypeError','Cannot read properties of undefined (reading \'length\')','    at Object.processNextQuestion (vm.js:1:3614)\n    at Object.nextRound (vm.js:1:3354)\n    at Object.checkStartGame (vm.js:1:3145)\n    at Object.onJoin (vm.js:1:2806)\n    at vm.js:1:4458\n    at Object.on (vm.js:1:1017)\n    at vm.js:1:4442\n    at vm.js:1:4544','2021-12-18 03:01:41','2021-12-18 03:01:41'),(6812169007416737792,2,0,'TypeError','Cannot read properties of undefined (reading \'q\')','    at Object.processNextQuestion (vm.js:1:3855)\n    at Object.nextRound (vm.js:1:3488)\n    at Object.checkStartGame (vm.js:1:3279)\n    at Object.onJoin (vm.js:1:2940)\n    at vm.js:1:4592\n    at Object.on (vm.js:1:1077)\n    at vm.js:1:4576\n    at vm.js:1:4678','2021-12-18 03:01:42','2021-12-18 03:01:42'),(6796538598029000704,37,1,'TypeError','Cannot read properties of undefined (reading \'q\')','    at Object.processNextQuestion (vm.js:1:3855)\n    at Object.nextRound (vm.js:1:3488)\n    at Object.checkStartGame (vm.js:1:3279)\n    at Object.onJoin (vm.js:1:2940)\n    at vm.js:1:4592\n    at Object.on (vm.js:1:1077)\n    at vm.js:1:4576\n    at vm.js:1:4678','2021-12-18 03:02:48','2021-12-18 03:02:48'),(6796538598029000704,36,0,'TypeError','Cannot read properties of undefined (reading \'q\')','    at Object.processNextQuestion (vm.js:1:3855)\n    at Object.nextRound (vm.js:1:3488)\n    at Object.checkStartGame (vm.js:1:3279)\n    at Object.onJoin (vm.js:1:2940)\n    at vm.js:1:4592\n    at Object.on (vm.js:1:1077)\n    at vm.js:1:4576\n    at vm.js:1:4678','2021-12-18 03:03:29','2021-12-18 03:03:29'),(6796538598029000704,53,0,'SyntaxError','Invalid or unexpected token','vm.js:1','2021-12-20 07:25:17','2021-12-20 07:25:17'),(6796538598029000704,64,0,'TypeError','Cannot read properties of undefined (reading \'maxPlayers\')','    at Object.rules (vm.js:1:2031)\n    at Object.checkNewRound (vm.js:1:2919)\n    at Object.onNewGame (vm.js:1:2684)\n    at vm.js:1:4745\n    at Object.on (vm.js:1:1133)\n    at vm.js:1:4726\n    at vm.js:1:4894','2021-12-25 22:32:27','2021-12-25 22:32:27'),(6796538598029000704,66,7,'TypeError','Cannot read properties of undefined (reading \'length\')','    at Object.onPick (vm.js:1:2996)\n    at vm.js:1:4617\n    at Object.on (vm.js:1:930)\n    at vm.js:1:4601\n    at vm.js:1:4641','2021-12-26 05:21:30','2021-12-26 05:21:30'),(6796538598029000704,67,0,'TypeError','Cannot read properties of undefined (reading \'length\')','    at Object.onPick (vm.js:1:2996)\n    at vm.js:1:4617\n    at Object.on (vm.js:1:930)\n    at vm.js:1:4601\n    at vm.js:1:4641','2021-12-26 06:16:08','2021-12-26 06:16:08');
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
  `name` varchar(64) NOT NULL,
  `version` int DEFAULT NULL,
  `db` tinyint DEFAULT NULL,
  `latest_version` int DEFAULT NULL,
  `ownerid` bigint NOT NULL,
  `minplayers` int NOT NULL DEFAULT '2',
  `maxplayers` int NOT NULL DEFAULT '2',
  `teams` varchar(255) DEFAULT NULL,
  `shortdesc` varchar(120) DEFAULT NULL,
  `longdesc` varchar(5000) DEFAULT NULL,
  `opensource` tinyint DEFAULT NULL,
  `preview_images` varchar(255) DEFAULT NULL,
  `videourl` varchar(255) DEFAULT NULL,
  `genre` varchar(45) DEFAULT NULL,
  `votes` int NOT NULL DEFAULT '0',
  `status` int NOT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  PRIMARY KEY (`gameid`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `idversion_UNIQUE` (`gameid`,`version`),
  UNIQUE KEY `game_slug_UNIQUE` (`game_slug`),
  KEY `game_slug_INDEX` (`game_slug`) /*!80000 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_info`
--

LOCK TABLES `game_info` WRITE;
/*!40000 ALTER TABLE `game_info` DISABLE KEYS */;
INSERT INTO `game_info` VALUES (6772719162612514816,'texas-holdem','Texas Holdem',0,NULL,0,6772002117809864704,2,6,NULL,'asdf','asdf',NULL,NULL,NULL,NULL,0,1,'2021-03-03 03:27:59','2021-03-03 03:27:59'),(6796538598029000704,'tictactoe','TicTacToe',84,0,84,149293855324246016,2,2,NULL,'Classic game of X and O on a 9 square grid','**asdfasdf** jkhkjh\n\n\n| Syntax | Description |\n| --- | ----------- |\n| Header | Title |\n| Paragraph | Text |\n\n<a onClick=\"alert(\'hello\')\">This is a test</a>\n\n~~Lorem~~ ~~ipsum~~ dolor sit amet, consectetur adipiscing elit. Integer vitae turpis sit amet metus tincidunt varius quis in orci. Duis blandit ex eget felis ultricies ultrices. Mauris faucibus diam massa, non elementum lectus tristique ac. Proin sit amet mi lacinia, lobortis tortor a, pharetra ex. Vivamus accumsan eleifend varius. Ut sem quam, bibendum in nulla quis, maximus ultrices sapien. Vestibulum ut nisl leo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Pellentesque accumsan pretium nulla, eu imperdiet risus gravida sed. Donec luctus ante sed arcu bibendum mattis. Suspendisse potenti. Aliquam non malesuada felis, id tincidunt augue. Donec accumsan lacus ex, non malesuada neque tincidunt at. Donec gravida elit sit amet ex lacinia, vitae malesuada lorem gravida. In et interdum arcu, ut iaculis ante.\n1234\n\nQuisque nibh erat, mattis maximus urna at, aliquet fermentum neque. Mauris sagittis odio risus, vel pulvinar justo eleifend et. Fusce rutrum placerat arcu id accumsan. Nunc aliquet quis turpis commodo bibendum. Suspendisse id libero lorem. Proin luctus placerat ipsum, a volutpat turpis sagittis et. Nulla maximus pellentesque ipsum, sit amet feugiat nunc tincidunt nec. Nullam vitae mattis ex.\n\nNunc viverra ligula quis eleifend aliquam. Quisque pharetra massa a dolor euismod gravida. Suspendisse libero ante, commodo sed velit in, consectetur vestibulum augue. Praesent sem libero, vestibulum nec justo sit amet, pellentesque dictum ante. Vestibulum accumsan odio eget aliquet vehicula. Nunc in augue libero. Donec vulputate felis eget vulputate laoreet. Sed consequat eleifend efficitur. Nunc sagittis tempor tellus. Aenean dapibus mi sed lacus viverra consequat. Quisque eu felis eu neque pretium eleifend. Vivamus ut nulla lacinia libero laoreet venenatis sed eget justo. Phasellus blandit magna diam, vel egestas sapien varius at.\n\nQuisque quam ex, venenatis sit amet urna eu, euismod consectetur ex. Sed quis arcu in risus fermentum porta non ut turpis. Nullam felis justo, posuere eget auctor vel, laoreet ac dolor. Morbi nisi mi, cursus ut elementum eu, imperdiet ut mi. Pellentesque ut nibh eget lectus laoreet mattis. Nullam interdum, quam sed iaculis pellentesque, justo tortor convallis odio, ac tincidunt nisi diam a augue. Aenean accumsan odio ut augue laoreet, non pellentesque ex rutrum. Vestibulum sed tortor id sem ornare laoreet id rhoncus nisl. Fusce non rutrum sem.\n\nAenean sit amet mollis justo, et faucibus lacus. Sed convallis volutpat dolor ut aliquam. Sed tristique sem eget pulvinar blandit. Etiam eleifend sagittis dolor, sit amet vulputate diam fringilla ac. Fusce a ornare erat, eu convallis nulla. Nulla bibendum posuere hendrerit. Fusce orci felis, consectetur eget porta at, rhoncus eget elit. Curabitur finibus vel augue quis aliquet.\n\nFusce nulla risus, vulputate vel lectus mattis, tincidunt dapibus diam. Praesent tristique ex id leo convallis, et fermentum nulla vestibulum. Aliquam tristique fringilla scelerisque. Aliquam non justo sit amet dui faucibus lobortis in sed est. Phasellus at placerat tellus. Aliquam rutrum ante vitae nisi auctor sodales. Proin sodales metus et hendrerit vulputate. Nunc volutpat pharetra ultrices. Vestibulum vestibulum, diam non venenatis rutrum, massa mauris rhoncus lorem, bibendum feugiat erat enim quis neque. Nunc a elit vel magna tempor vehicula id vel nisi.',0,'1.png',NULL,NULL,0,3,'2021-12-30 22:18:21','2021-05-07 20:57:55'),(6812169007416737792,'trivia','Trivia',1,NULL,2,149293855324246016,2,6,NULL,'asdf','asdf',0,'1.png',NULL,NULL,0,3,'2021-12-21 06:18:12','2021-06-20 00:07:40'),(6865515196689940480,'test-game-1','Test Game 1',0,NULL,0,6772002117809864704,2,2,NULL,'short desc','long description',NULL,NULL,NULL,NULL,0,1,'2021-11-14 05:06:25','2021-11-14 05:06:25'),(6866234719101517824,'test-game-2','Test game 2',0,NULL,0,149293855324246016,2,2,'Blue, Orange','test game 2','asdfasd fasdfasdf',NULL,'1.png',NULL,NULL,0,2,'2021-11-16 05:25:32','2021-11-16 04:45:25'),(6874520486118686720,'test-1','test 1',0,NULL,0,6771111937385168896,2,2,NULL,'test','test',NULL,NULL,NULL,NULL,0,1,'2021-12-09 01:30:06','2021-12-09 01:30:06'),(6875707160756486144,'asdf','asdfsad',0,NULL,0,149293855324246016,2,2,NULL,'asdf','adasdfasdf\n',NULL,'1.jpg',NULL,NULL,0,1,'2021-12-12 08:14:18','2021-12-12 08:05:31'),(6878850439647854592,'test-4','Test 4',1,NULL,1,149293855324246016,2,2,NULL,'tealjdslkfjasdf asdf asdfas dfas fasd fasdf asdf','asdfasdfsa',0,'1.jpg',NULL,NULL,0,2,'2021-12-21 04:34:40','2021-12-21 00:15:47'),(6878850838484221952,'test-5','Test 5',0,NULL,0,149293855324246016,2,2,NULL,'tealjdslkfjasdf asdf asdfas dfas fasd fasdf asdf',NULL,NULL,NULL,NULL,NULL,0,1,'2021-12-21 00:17:22','2021-12-21 00:17:22'),(6878850941739597824,'test-6','Test 6',0,NULL,0,149293855324246016,2,2,NULL,'tealjdslkfjasdf asdf asdfas dfas fasd fasdf asdf',NULL,NULL,NULL,NULL,NULL,0,1,'2021-12-21 00:17:47','2021-12-21 00:17:47'),(6878851140797071360,'test-7','Test 7',0,NULL,0,149293855324246016,2,2,NULL,'tealjdslkfjasdf asdf asdfas dfas fasd fasdf asdf',NULL,NULL,NULL,NULL,NULL,0,1,'2021-12-21 00:18:34','2021-12-21 00:18:34'),(6878851498453762048,'test-8','Test 8',0,NULL,0,149293855324246016,2,2,NULL,'tealjdslkfjasdf asdf asdfas dfas fasd fasdf asdf',NULL,NULL,NULL,NULL,NULL,0,1,'2021-12-21 00:20:00','2021-12-21 00:20:00'),(6878851711604097024,'test-9','Test 9',0,NULL,0,149293855324246016,2,2,NULL,'lkaj sdflkajsd lfkasdlkfj lkasdlkfjasdf',NULL,NULL,NULL,NULL,NULL,0,1,'2021-12-21 00:20:50','2021-12-21 00:20:50');
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
INSERT INTO `game_modes` VALUES (0,'experimental',NULL,'2021-09-23 02:40:36','2021-09-23 02:40:36'),(1,'rank','{\"threshold\":400, \"delta\":50, \"retryDelay\":1000}','2021-09-23 02:40:36','2021-09-23 02:40:36'),(2,'public',NULL,'2021-09-23 02:40:36','2021-09-23 02:40:36'),(3,'private',NULL,'2021-09-23 02:40:36','2021-09-23 02:40:36');
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
  `vote` tinyint DEFAULT NULL,
  `report` int DEFAULT NULL,
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  PRIMARY KEY (`game_slug`,`shortid`),
  KEY `reporttype_index` (`game_slug`,`shortid`,`report`),
  KEY `game_slug_index` (`game_slug`),
  KEY `game_like_index` (`game_slug`,`vote`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_review`
--

LOCK TABLES `game_review` WRITE;
/*!40000 ALTER TABLE `game_review` DISABLE KEYS */;
INSERT INTO `game_review` VALUES ('test-game-2','8CCkf',1,NULL,'2021-12-18 22:29:20','2021-12-18 22:29:19'),('tictactoe','8CCkf',1,1,'2021-12-31 01:24:16','2021-12-17 04:33:08'),('tictactoe','manC6',1,NULL,'2021-12-28 21:36:53','2021-12-20 07:25:08'),('trivia','8CCkf',1,1,'2021-12-18 02:13:06','2021-12-17 06:06:10');
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
  `version` int DEFAULT NULL,
  `db` tinyint DEFAULT '0',
  `scaled` tinyint NOT NULL DEFAULT '0',
  `screentype` int NOT NULL DEFAULT '3',
  `resow` int NOT NULL DEFAULT '4',
  `resoh` int NOT NULL DEFAULT '4',
  `screenwidth` int NOT NULL DEFAULT '1920',
  `status` int NOT NULL,
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
INSERT INTO `game_version` VALUES (6796538598029000704,34,0,0,3,4,4,1920,2,'2021-08-14 21:35:27','2021-05-24 01:02:30'),(6796538598029000704,33,0,0,3,4,4,1920,2,'2021-08-14 21:35:27','2021-05-24 01:02:30'),(6796538598029000704,35,0,0,3,4,4,1920,2,'2021-08-14 21:35:27','2021-05-25 01:04:01'),(6812169007416737792,1,1,0,3,4,4,1920,2,'2021-08-14 21:34:11','2021-06-20 00:16:00'),(6796538598029000704,36,0,0,3,4,4,1920,2,'2021-08-15 04:00:44','2021-08-07 19:20:51'),(6812169007416737792,2,1,0,3,4,4,1920,2,'2021-11-16 04:44:12','2021-08-07 19:32:42'),(6796538598029000704,37,0,0,3,4,4,1920,2,'2021-12-20 04:24:48','2021-09-20 01:23:50'),(6866234719101517824,1,0,0,3,4,4,1920,2,'2021-11-16 05:05:11','2021-11-16 04:45:53'),(6796538598029000704,38,0,0,3,4,4,1920,2,'2021-12-20 04:51:26','2021-12-20 04:51:26'),(6796538598029000704,39,0,0,3,4,4,1920,2,'2021-12-20 04:52:29','2021-12-20 04:52:29'),(6796538598029000704,40,0,0,3,4,4,1920,2,'2021-12-20 06:23:20','2021-12-20 06:23:20'),(6796538598029000704,41,0,0,3,4,4,1920,2,'2021-12-20 06:25:07','2021-12-20 06:25:07'),(6796538598029000704,42,0,0,3,4,4,1920,2,'2021-12-20 06:28:22','2021-12-20 06:28:22'),(6796538598029000704,43,0,0,3,4,4,1920,2,'2021-12-20 06:29:00','2021-12-20 06:29:00'),(6796538598029000704,44,0,0,3,4,4,1920,2,'2021-12-20 06:34:30','2021-12-20 06:34:30'),(6796538598029000704,45,0,0,3,4,4,1920,2,'2021-12-20 06:37:40','2021-12-20 06:37:40'),(6796538598029000704,46,0,0,3,4,4,1920,2,'2021-12-20 06:38:45','2021-12-20 06:38:45'),(6796538598029000704,47,0,0,3,4,4,1920,2,'2021-12-20 06:41:05','2021-12-20 06:41:05'),(6796538598029000704,48,0,0,3,4,4,1920,2,'2021-12-20 06:42:15','2021-12-20 06:42:15'),(6796538598029000704,49,0,0,3,4,4,1920,2,'2021-12-20 06:51:56','2021-12-20 06:51:56'),(6796538598029000704,50,0,1,3,4,4,1920,2,'2021-12-20 06:55:20','2021-12-20 06:55:20'),(6796538598029000704,51,0,1,3,4,4,1920,2,'2021-12-20 07:05:13','2021-12-20 07:05:13'),(6796538598029000704,52,0,1,3,4,4,1920,2,'2021-12-20 07:20:34','2021-12-20 07:20:34'),(6796538598029000704,53,0,1,3,4,4,1920,2,'2021-12-20 07:23:07','2021-12-20 07:23:07'),(6878850439647854592,1,0,1,3,4,4,1920,2,'2021-12-21 01:37:34','2021-12-21 01:37:34'),(6796538598029000704,54,0,1,3,4,4,1920,2,'2021-12-21 06:36:49','2021-12-21 06:36:49'),(6796538598029000704,55,0,1,3,4,4,1920,2,'2021-12-21 07:30:08','2021-12-21 07:30:08'),(6796538598029000704,56,0,1,3,4,4,1920,2,'2021-12-21 07:44:08','2021-12-21 07:44:08'),(6796538598029000704,57,0,1,3,4,4,1920,2,'2021-12-21 07:55:42','2021-12-21 07:55:42'),(6796538598029000704,58,0,1,3,4,4,1920,2,'2021-12-21 07:56:46','2021-12-21 07:56:46'),(6796538598029000704,59,0,1,3,4,4,1920,2,'2021-12-21 08:05:29','2021-12-21 08:05:29'),(6796538598029000704,60,0,1,3,4,4,1920,2,'2021-12-21 08:10:11','2021-12-21 08:10:11'),(6796538598029000704,61,0,1,3,4,4,1920,2,'2021-12-21 08:13:56','2021-12-21 08:13:56'),(6796538598029000704,62,0,1,3,4,4,1920,2,'2021-12-21 08:15:31','2021-12-21 08:15:31'),(6796538598029000704,63,0,1,3,4,4,1920,2,'2021-12-21 17:36:38','2021-12-21 17:36:38'),(6796538598029000704,64,0,1,3,4,4,1920,2,'2021-12-25 22:19:46','2021-12-25 22:19:46'),(6796538598029000704,65,0,1,3,4,4,1920,2,'2021-12-25 22:33:14','2021-12-25 22:33:14'),(6796538598029000704,66,0,1,3,4,4,1920,2,'2021-12-26 03:08:06','2021-12-26 03:08:06'),(6796538598029000704,67,0,1,3,4,4,1920,2,'2021-12-26 06:14:50','2021-12-26 06:14:50'),(6796538598029000704,68,0,1,3,4,4,1920,2,'2021-12-26 21:01:30','2021-12-26 21:01:30'),(6796538598029000704,69,0,1,3,4,4,1920,2,'2021-12-26 21:03:50','2021-12-26 21:03:50'),(6796538598029000704,70,0,1,3,4,4,1920,2,'2021-12-26 21:51:07','2021-12-26 21:51:07'),(6796538598029000704,71,0,1,3,4,4,1920,2,'2021-12-27 07:48:16','2021-12-27 07:48:16'),(6796538598029000704,72,0,1,3,4,4,1920,2,'2021-12-28 03:52:17','2021-12-28 03:52:17'),(6796538598029000704,73,0,1,3,4,4,1920,2,'2021-12-28 07:45:55','2021-12-28 07:45:55'),(6796538598029000704,74,0,1,3,4,4,1920,2,'2021-12-28 19:21:42','2021-12-28 19:21:42'),(6796538598029000704,75,0,1,3,4,4,1920,2,'2021-12-29 04:55:59','2021-12-29 04:55:59'),(6796538598029000704,76,0,1,3,4,4,1920,2,'2021-12-29 06:31:52','2021-12-29 06:31:52'),(6796538598029000704,77,0,1,3,4,4,1920,2,'2021-12-29 07:32:34','2021-12-29 07:32:34'),(6796538598029000704,78,0,1,3,4,4,1920,2,'2021-12-29 07:36:26','2021-12-29 07:36:26'),(6796538598029000704,79,0,1,3,4,4,1920,2,'2021-12-29 07:39:09','2021-12-29 07:39:09'),(6796538598029000704,80,0,1,3,4,4,1920,2,'2021-12-29 07:41:40','2021-12-29 07:41:40'),(6796538598029000704,81,0,1,3,4,4,1200,2,'2021-12-30 03:02:41','2021-12-30 03:02:41'),(6796538598029000704,82,0,1,3,4,4,1920,2,'2021-12-30 20:32:13','2021-12-30 20:32:13'),(6796538598029000704,83,0,1,3,4,4,1920,2,'2021-12-30 21:31:15','2021-12-30 21:31:15'),(6796538598029000704,84,0,1,3,4,4,1920,2,'2021-12-30 22:18:18','2021-12-30 22:18:18');
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
INSERT INTO `person` VALUES (149293855324246016,'8CCkf','joe','joelruiz2@gmail.com','C96899B1BEC943DFB972B919132B3D52',NULL,1,'joetex',NULL,NULL,'2021-02-03 23:20:28','2021-02-03 23:22:33','2021-02-03 23:20:28',NULL,NULL),(6771111937385168896,'manC6','5SG','five.second.games@gmail.com','D82EFEF03854428EB0A9B99A9BD3DBDE',NULL,0,'5SG',NULL,NULL,'2021-02-26 17:01:27','2021-02-26 19:25:04','2021-02-26 17:01:27',NULL,NULL),(6772002117809864704,'4HFuz','JoeOfTexas','hya_oej@hotmail.com','CBA4F713378A403780C39AA3A0AF243D',NULL,1,'JoeOfTexas',79773707,4568407,'2021-03-01 03:58:42','2021-03-01 03:59:16','2021-03-01 03:58:42',NULL,NULL),(6779261168264413184,'Oi7qt','SERVER','server@fivesecondgames.com','A8043B576A9D42A286666065866F0F72',NULL,0,NULL,NULL,NULL,'2021-03-04 04:24:32','2021-03-04 04:24:43','2021-03-04 04:24:32',NULL,NULL),(6875929993071820800,'uddvI','JoeFacebook','10158402857617920','426DBBB5867E4E4DB84C97DC3B2CC623',NULL,0,NULL,NULL,NULL,'2021-12-12 22:51:02','2021-12-12 23:40:26','2021-12-12 22:51:02',NULL,NULL),(6876230425522470912,'odqL8','JoeYahoo','joel196@yahoo.com','3845C54C1AAE49A4908A786EA1EA9B01',NULL,1,'JoTexas',80021840,NULL,'2021-12-13 18:44:47','2021-12-13 23:09:48','2021-12-13 18:44:47',NULL,NULL);
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
  `season` int NOT NULL DEFAULT '0',
  `rating` int NOT NULL DEFAULT '1200',
  `mu` double NOT NULL DEFAULT '25',
  `sigma` double NOT NULL DEFAULT '5',
  `win` int NOT NULL DEFAULT '0',
  `loss` int NOT NULL DEFAULT '0',
  `tie` int NOT NULL DEFAULT '0',
  `played` int NOT NULL DEFAULT '1',
  `tsupdate` datetime NOT NULL,
  `tsinsert` datetime NOT NULL,
  PRIMARY KEY (`shortid`,`game_slug`,`season`),
  KEY `game_slug_index` (`game_slug`),
  KEY `shortid_index` (`shortid`),
  KEY `sorted_index` (`rating` DESC),
  KEY `gameuserseason_index` (`shortid`,`game_slug`,`season`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `person_rank`
--

LOCK TABLES `person_rank` WRITE;
/*!40000 ALTER TABLE `person_rank` DISABLE KEYS */;
INSERT INTO `person_rank` VALUES ('8CCkf','test-game-2',0,1000,10,1.5,0,0,0,0,'2021-12-18 03:16:24','2021-12-18 03:16:24'),('8CCkf','tictactoe',0,2983,29.833198315958544,1.0499866565700091,120,128,3,249,'2021-12-31 02:09:47','2021-11-23 05:21:27'),('8CCkf','trivia',0,3200,32,1.5,0,0,0,0,'2021-12-18 03:00:41','2021-12-18 03:00:41'),('manC6','tictactoe',0,3017,30.166801684041477,1.0499866565700091,128,120,3,256,'2021-12-31 02:09:47','2021-11-23 05:21:27'),('manC6','trivia',0,1200,12,1.5,0,0,0,0,'2021-12-18 03:00:41','2021-12-18 03:00:41');
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
INSERT INTO `server` VALUES (1234,'mq-cluster-1',0,5,0,0,'127.0.0.1:5672','127.0.0.1:5672',NULL,'2021-05-09 15:29:50','2021-03-21 04:34:07'),(6779144424308867072,'redis-cluster-1',0,2,0,0,'127.0.0.1:6379','127.0.0.1:6379',NULL,'2021-04-29 22:44:01','2021-03-20 20:59:41'),(6779156509063380992,'wsnode',0,1,0,0,'127.0.0.1:9002',':9002',NULL,'2021-12-30 22:30:34','2021-03-20 21:47:42'),(6779258786507915264,'gameserver',0,3,0,0,'127.0.0.1:9100','192.168.0.9:9100',NULL,'2021-05-15 19:59:29','2021-03-21 04:34:07'),(6799740688205348864,'gameserver-1',0,3,0,0,'127.0.0.1:','192.168.1.117',NULL,'2021-09-19 05:08:33','2021-05-16 17:01:53');
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

-- Dump completed on 2021-12-31  0:41:51
