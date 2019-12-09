-- MySQL dump 10.13  Distrib 5.7.28, for Linux (x86_64)
--
-- Host: localhost    Database: fleaMarket
-- ------------------------------------------------------
-- Server version	5.7.28-0ubuntu0.18.04.4

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AR`
--

DROP TABLE IF EXISTS `AR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `AR` (
  `R_id` char(11) DEFAULT NULL,
  `A_id` int(20) DEFAULT NULL,
  KEY `fk_AR_Root` (`R_id`),
  KEY `fk_AR_Announce` (`A_id`),
  CONSTRAINT `fk_AR_Announce` FOREIGN KEY (`A_id`) REFERENCES `Announce` (`A_id`),
  CONSTRAINT `fk_AR_Root` FOREIGN KEY (`R_id`) REFERENCES `Root` (`R_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AR`
--

LOCK TABLES `AR` WRITE;
/*!40000 ALTER TABLE `AR` DISABLE KEYS */;
/*!40000 ALTER TABLE `AR` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Announce`
--

DROP TABLE IF EXISTS `Announce`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Announce` (
  `A_id` int(20) NOT NULL AUTO_INCREMENT,
  `A_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`A_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Announce`
--

LOCK TABLES `Announce` WRITE;
/*!40000 ALTER TABLE `Announce` DISABLE KEYS */;
/*!40000 ALTER TABLE `Announce` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Deallog`
--

DROP TABLE IF EXISTS `Deallog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Deallog` (
  `buyer_id` char(11) DEFAULT NULL,
  `seller_id` char(11) DEFAULT NULL,
  `G_id` int(20) DEFAULT NULL,
  `deal_time` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Deallog`
--

LOCK TABLES `Deallog` WRITE;
/*!40000 ALTER TABLE `Deallog` DISABLE KEYS */;
/*!40000 ALTER TABLE `Deallog` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`haozl`@`localhost`*/ /*!50003 trigger Deal_complete
after insert on Deallog
for each row   
begin  
    DELETE FROM SG_good WHERE SG_id=new.G_id;
    DELETE FROM WG_good WHERE WG_id=new.G_id;
end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Root`
--

DROP TABLE IF EXISTS `Root`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Root` (
  `R_id` char(11) NOT NULL,
  `R_password` char(50) DEFAULT NULL,
  PRIMARY KEY (`R_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Root`
--

LOCK TABLES `Root` WRITE;
/*!40000 ALTER TABLE `Root` DISABLE KEYS */;
/*!40000 ALTER TABLE `Root` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SG_response`
--

DROP TABLE IF EXISTS `SG_response`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SG_response` (
  `U_id` char(11) NOT NULL,
  `SG_id` int(20) NOT NULL,
  `SG_response_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`U_id`,`SG_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SG_response`
--

LOCK TABLES `SG_response` WRITE;
/*!40000 ALTER TABLE `SG_response` DISABLE KEYS */;
INSERT INTO `SG_response` VALUES ('12197350111',1000000000,'2019-12-09 14:23:05');
/*!40000 ALTER TABLE `SG_response` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Salegood`
--

DROP TABLE IF EXISTS `Salegood`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Salegood` (
  `SG_id` int(20) NOT NULL AUTO_INCREMENT,
  `SG_name` char(50) DEFAULT NULL,
  `SG_info` varchar(500) DEFAULT NULL,
  `SG_type` tinyint(4) DEFAULT NULL,
  `SG_price` decimal(7,2) DEFAULT NULL,
  `image` mediumblob,
  `U_id` char(11) DEFAULT NULL,
  `SG_publish_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SG_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000000001 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Salegood`
--

LOCK TABLES `Salegood` WRITE;
/*!40000 ALTER TABLE `Salegood` DISABLE KEYS */;
INSERT INTO `Salegood` VALUES (1000000000,'black glasses','magic glasses belongs to the time elder',1,5.00,_binary 'kjlsadhlkashdjdalks','12197350111','2019-12-09 14:23:05');
/*!40000 ALTER TABLE `Salegood` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`haozl`@`localhost`*/ /*!50003 trigger Delete_SG_good 
after delete on Salegood
for each row   
begin  
    DELETE FROM SG_response WHERE SG_id=old.SG_id;
end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `User` (
  `U_id` char(11) NOT NULL,
  `U_name` char(20) DEFAULT NULL,
  `U_password` char(50) DEFAULT NULL,
  `U_info` char(200) DEFAULT NULL,
  PRIMARY KEY (`U_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('12197350111','haozl','123456','i am the root, i am the god');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WG_response`
--

DROP TABLE IF EXISTS `WG_response`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `WG_response` (
  `U_id` char(11) NOT NULL,
  `WG_id` int(20) NOT NULL,
  `WG_response_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `WG_response_price` char(10) DEFAULT NULL,
  PRIMARY KEY (`U_id`,`WG_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WG_response`
--

LOCK TABLES `WG_response` WRITE;
/*!40000 ALTER TABLE `WG_response` DISABLE KEYS */;
INSERT INTO `WG_response` VALUES ('12197350111',1,'2019-12-09 14:23:05','5.00');
/*!40000 ALTER TABLE `WG_response` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Wantedgood`
--

DROP TABLE IF EXISTS `Wantedgood`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Wantedgood` (
  `WG_id` int(20) NOT NULL AUTO_INCREMENT,
  `WG_name` char(50) DEFAULT NULL,
  `WG_info` varchar(500) DEFAULT NULL,
  `WG_type` tinyint(4) DEFAULT NULL,
  `U_id` char(11) DEFAULT NULL,
  `WG_publish_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`WG_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Wantedgood`
--

LOCK TABLES `Wantedgood` WRITE;
/*!40000 ALTER TABLE `Wantedgood` DISABLE KEYS */;
INSERT INTO `Wantedgood` VALUES (1,'black glasses','magic glasses belongs to the time elder',1,'12197350111','2019-12-09 14:23:05');
/*!40000 ALTER TABLE `Wantedgood` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`haozl`@`localhost`*/ /*!50003 trigger Delete_WG_good 
after delete on  Wantedgood
for each row   
begin  
    DELETE FROM WG_response WHERE WG_id=old.WG_id;
end */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-12-09 14:25:47
