-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: sehir_sorun_bildir
-- ------------------------------------------------------
-- Server version	8.0.44

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
-- Table structure for table `authority_notes`
--

DROP TABLE IF EXISTS `authority_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authority_notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `authority_id` int NOT NULL,
  `note` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `report_id` (`report_id`),
  KEY `authority_id` (`authority_id`),
  CONSTRAINT `authority_notes_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`),
  CONSTRAINT `authority_notes_ibfk_2` FOREIGN KEY (`authority_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authority_notes`
--

LOCK TABLES `authority_notes` WRITE;
/*!40000 ALTER TABLE `authority_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `authority_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `category` enum('road','lighting','water','garbage','park','other') NOT NULL,
  `danger_level` enum('low','medium','high','critical') NOT NULL,
  `description` text,
  `photo_url` varchar(500) DEFAULT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `address` varchar(300) DEFAULT NULL,
  `status` enum('pending','in_progress','resolved','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (1,1,'Mahalle girişinde devasa çukur','road','high','Arabaların lastiklerini kesen çok derin bir çukur var, acil yama yapılması lazım.','/uploads/1772035553368-539739541.jpg',39.42417000,29.98333000,'Merkez Mahallesi, Cumhuriyet Caddesi','resolved','2026-02-25 16:05:53','2026-02-25 17:08:10'),(2,3,'BOZUK YOL','road','medium','Yollar çok bozuk ','/uploads/1772052242605-675119061.jpeg',39.48212290,29.91243530,'Haritadan seçilen konum','resolved','2026-02-25 20:44:02','2026-02-27 14:34:08'),(3,3,'Çukur ','road','medium','Yollar da çukurlar oluşmuş ','/uploads/1772054757900-320222826.jpeg',39.48211260,29.91247140,'Haritadan seçilen konum','resolved','2026-02-25 21:25:58','2026-02-27 14:34:11'),(4,4,'Köpek ölmüş ','road','medium','Köpeğe sokmuşlar','/uploads/1772104771126-590809124.jpeg',39.47804700,29.90089690,'Haritadan seçilen konum','resolved','2026-02-26 11:19:43','2026-02-27 14:34:29'),(5,5,'Patlamış su Borusu','road','medium','Tırların yoldan geçmesinden dolayı su borusu patlamış ','/uploads/1772203195444-14010073.jpeg',39.48209010,29.91240120,'Haritadan seçilen konum','resolved','2026-02-27 14:39:55','2026-02-27 14:40:43'),(6,5,'Cinayet Mami','road','medium','Tehlike barındırıyor','/uploads/1772205314039-648089901.jpeg',39.48211940,29.91240810,'Haritadan seçilen konum','resolved','2026-02-27 15:15:14','2026-02-27 17:03:39'),(7,6,'Nabermudur','road','medium','Nabermudur','/uploads/1772211858312-679334299.jpeg',39.48009550,29.91086820,'Haritadan seçilen konum','resolved','2026-02-27 17:04:18','2026-02-27 17:04:33'),(8,5,'Yol/Asfalt','road','medium','Merhaba','/uploads/1772213959719-57013687.jpeg',39.48008530,29.91084570,'Haritadan seçilen konum','resolved','2026-02-27 17:39:19','2026-02-27 17:58:54');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'citizen',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ahmet Yılmaz','ahmet@example.com','$2b$10$HhO0UcbyKYyH06tQoim24.78qTVfa.SQyBDHjgfrq3ndHrZE42HKO','citizen','2026-02-25 15:20:00'),(2,'Belediye Başkanı','Baskan@example.com','$2b$10$kYSdD3dpm2FyLA/BGFzwLOGWoZYSXJPlZjmEj.d04s1ounkjaivL.','authority','2026-02-25 17:04:52'),(3,'Hasan Hüseyin ','hgff50626@gmail.com','$2b$10$P6vzW8TLRyYhz/dBxo72MuUvpuUE2kUK6uvujf.c/pvHDqq.9N8mS','admin','2026-02-25 19:28:02'),(4,'Semanur ','Sema2@gmail.com','$2b$10$iwflP0oyJZP.9t8q0Ov0je5jQcZS0MTD1yRGwmmtdeknSJlW3.f9y','citizen','2026-02-25 21:34:02'),(5,'Muhammed Bilal ','Mbilal33@gmail.com','$2b$10$Ibd..YzIZSUe5aNwAMfuNekPRsYEErS4gHXfe3Z5GHr38fGSA4aUy','citizen','2026-02-27 14:38:40'),(6,'Muhammed ceylan','nabermudur@gmail.com','$2b$10$xaJ4kaBLbzYJV5gkWzaRZO8vvv6YD2XjHjHZVfFPEfJYz0lnGVoEa','citizen','2026-02-27 16:57:39');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-27 21:15:33
