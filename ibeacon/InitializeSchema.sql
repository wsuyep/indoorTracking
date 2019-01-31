drop database beacons;
CREATE DATABASE beacons;
use beacons;

CREATE TABLE `maps` (
  `MapId` varchar(36) NOT NULL,
  `address` varchar(45) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  `version` int(11) NOT NULL,
  PRIMARY KEY (`MapId`)
) ENGINE=InnoDB;

CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `password` varchar(45) NOT NULL,
  `role` varchar(45) NOT NULL,
  PRIMARY KEY (`username`),
  UNIQUE KEY `idusers_UNIQUE` (`username`)
) ENGINE=InnoDB;

CREATE TABLE `subscriptions` (
  `subscriptions_id` varchar(10) NOT NULL,
  `expire_date` datetime NOT NULL,
  `owned_by` varchar(45) NOT NULL,
  PRIMARY KEY (`subscriptions_id`),
  KEY `owned_by_fk_idx` (`owned_by`),
  CONSTRAINT `owned_by_fk` FOREIGN KEY (`owned_by`) REFERENCES `users` (`username`) ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE `beacons` (
  `UUID` varchar(36) NOT NULL,
  `Major` int(11) NOT NULL,
  `Minor` int(11) DEFAULT NULL,
  `MapId` varchar(36) NOT NULL,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `subscription_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`UUID`,`Major`),
  KEY `mapid_fk_idx` (`MapId`),
  KEY `subs_fk_idx` (`subscription_id`),
  CONSTRAINT `maps_fk` FOREIGN KEY (`MapId`) REFERENCES `maps` (`mapid`) ON UPDATE CASCADE,
  CONSTRAINT `subs_fk` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`subscriptions_id`) ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO `beacons`.`maps` (`MapId`, `address`, `level`, `url`, `version`) VALUES ('9999', 'Mckenzie Ave', '3', '/map.com', '1');
INSERT INTO `beacons`.`users` (`username`, `password`, `role`) VALUES ('wsu49', 'wsu49', 'admin');
INSERT INTO `beacons`.`subscriptions` (`subscriptions_id`, `expire_date`, `owned_by`) VALUES ('sub000', '2099-12-31', 'wsu49');
INSERT INTO `beacons`.`beacons` (`UUID`, `Major`, `Minor`, `MapId`, `x`, `y`, `subscription_id`) VALUES ('b000', '112', '3', '9999', '111', '23', 'sub000');
INSERT INTO `beacons`.`beacons` (`UUID`, `Major`, `Minor`, `MapId`, `x`, `y`, `subscription_id`) VALUES ('b001', '112', '3', '9999', '222', '43', 'sub000');



