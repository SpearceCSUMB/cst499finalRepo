-- CREATE DATABASE
DROP DATABASE IF EXISTS team_final;
CREATE DATABASE team_final;

-- SELECT DATABASE
USE team_final;

-- CREATE TABLES
CREATE TABLE `aircraft` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `year` int(4) NOT NULL,
 `manufacturer` varchar(255) NOT NULL,
 `model` varchar(255) NOT NULL,
 `price` int(11) NOT NULL,
 `serialNumber` varchar(100) NOT NULL,
 `totalTime` float NOT NULL,
 `engineType` varchar(4) NOT NULL,
 `smoh` int(11) NOT NULL,
 `inspection` varchar(4) NOT NULL,
 `numberSeats` int(3) NOT NULL,
 `imageURL` varchar(255) NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `order_status` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `status` varchar(6),
 PRIMARY Key (`id`)
 );

CREATE TABLE shopping_cart (
`orderID` int(11),
`product_id` int(11),
CONSTRAINT shopping_cart_fk_order_status
		FOREIGN KEY (orderID)
        REFERENCES order_status (id),
CONSTRAINT shopping_cart_fk_aircraft
		FOREIGN KEY (product_id)
        REFERENCES aircraft (id)
);
CREATE TABLE `users` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `firstName` varchar(100) NOT NULL,
 `lastName` varchar(100) NOT NULL,
 `agreeSpam` int(11) NOT NULL,
 `username` varchar(50) NOT NULL,
 `email` varchar(150) NOT NULL,
 `passwordHash` varchar(255) NOT NULL,
 `adminUser` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

  -- default username is nwtech with the password of nwtech  
  INSERT INTO `users` (`id`, `firstName`, `lastName`, `agreeSpam`, `username`, `email`, `passwordHash`,`adminUser`) VALUES
(1, 'admin', 'tech ', 0, 'nwtech', 'nwtech@csumb.edu', '$2a$10$B7wXUpVEvGpcm77kJgHnpu2aF/kKNwsJS3swo2wd3wDSbw/SFIIme',1),
(2, 'admin', 'tech', 0, 'admin', 'nwtech1@csumb.edu', '$2b$10$c5NCpQ79XNuIZzv7UNctRuPPW2aE.2h6.WJkP5u.hFNdSHGT3IH.K',1);
  
   INSERT INTO `users` (`id`, `firstName`, `lastName`, `agreeSpam`, `username`, `email`, `passwordHash`,`adminUser`) VALUES
(3,  'Joe', 'User', 0, 'nwuser', 'nwuser@csumb.edu', '$2a$10$B7wXUpVEvGpcm77kJgHnpu2aF/kKNwsJS3swo2wd3wDSbw/SFIIme',0);
  -- Insert into Aircraft --
INSERT INTO aircraft VALUES
(1,2002,'Cessna Citation','Bravo',814100,'550-1007',3533.8,'Jet',200,'Pass',10,'https://upload.wikimedia.org/wikipedia/commons/2/25/Cessna_550b_citation_bravo_cs-dhr_arp.jpg'),
(2,2006,'Gulfstream','G550',17950000,'5102',3059,'Jet',800,'Pass',18,'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/GULFSTREAM_G550_-_SBPA_%2834341121750%29.jpg/800px-GULFSTREAM_G550_-_SBPA_%2834341121750%29.jpg'),
(3,2017,'Beechcraft','King Air 250',1250000,'BY 278',380,'Prop',380,'Pass',8,'https://live.staticflickr.com/5533/18664834920_e435a069fd_b.jpg'),
(4,2001,'Cessna','Caravan 208B Grand',800000,'208B-0877',12323,'Prop',1200,'Fail',4,'https://live.staticflickr.com/7871/40482759913_0916c79d00_b.jpg'),
(5,1942,'Boeing','Stearman',1200000,'75-4299',4198,'Prop',200,'Pass',2,'https://upload.wikimedia.org/wikipedia/commons/c/c9/Boeing_Stearman_PT13D_Kaydet_N1731B_716_%288708314438%29.jpg'),
(6,1972,'Cessna','414 Chancellor',700000,'414-0354',6885,'Prop',100,'Fail',4,'https://live.staticflickr.com/4705/25674301697_8498d68d87_b.jpg'),
(7,2010,'Bombardier','Learjet 40XR',1700000,'2119',5042,'Jet',600,'Pass',8,'https://upload.wikimedia.org/wikipedia/commons/8/82/Bombardier_Learjet_40_%E2%80%98N700KG%E2%80%99_%2841197845854%29.jpg'),
(8,2004,'Cessna','182T Skylane G1000',400000,'18281363',1231,'Prop',200,'Pass',4,'https://upload.wikimedia.org/wikipedia/commons/e/e1/Cessna_182T_Skylane_AN1597806.jpg'),
(9,2001,'Diamond','DA-40',230000,'5642335',580,'Prop',88,'Pass',4,'https://upload.wikimedia.org/wikipedia/commons/c/c1/Diamond_DA40_%288736184864%29.jpg'),
(10,1984,'Slingsby','Firefly',200000,'5684257',6636,'Prop',6636,'Pass',2,'https://farm4.staticflickr.com/3892/15195106166_db232aaf88_b.jpg'),
(11,2015,'Airbus','ACJ320',2559000,'4388',596,'Jet',1000,'Pass',30,'https://upload.wikimedia.org/wikipedia/commons/4/4b/OE-LUX_ACJ318-112_Elite_Tyrolean_Jet_Svc_MAN_10MAR14_%2813065509424%29.jpg'),
(12,1994,'BAe','Avro RJ70',4500000,'E1258',23368,'Jet',1500,'Pass',26,'https://s0.geograph.org.uk/geophotos/03/73/64/3736423_6672af37.jpg'),
(13,2008,'Bombardier','Challenger 605',27500000,'5716',3923.2,'Jet',600,'Pass',18,'https://live.staticflickr.com/4361/36742408201_7e8f489587_b.jpg'),
(14,2015,'Bombardier','Challenger 350',14995000,'20583',1031,'Jet',550,'Pass',10,'https://upload.wikimedia.org/wikipedia/commons/e/e1/CS-CHD_Bombardier_Challenger_350_Netjets_Europe_%2828130835924%29.jpg'),
(15,2019,'Aerospool','WT-9 Dynamic',140000,'DY-K96',300,'Prop',300,'Pass',1,'https://upload.wikimedia.org/wikipedia/commons/2/25/AirExpo_2016_-_Dynamic_WT9_%281%29.jpg'),
(16,2009,'Flight Design','CTSW',75000,'568947',600,'Prop',200,'Pass',2,'https://upload.wikimedia.org/wikipedia/commons/6/65/Flight-Design_CTSW_D-MFGN.jpg'),
(17,2004,'Piper','Seneca V',425000,'3449304',2100,'Prop',300,'Pass',6,'https://upload.wikimedia.org/wikipedia/commons/8/85/Piper_PA-34-220T_Seneca_V_YU-VGI_RV_i_PVO_VS.jpg'),
(18,1964,'Piper','Aztec',256000,'27-2743',4457,'Prop',100,'Pass',6,'https://upload.wikimedia.org/wikipedia/commons/0/08/Piper_PA-23_Aztec_%28D-IMKU%29_00.jpg'),
(19,2010,'Vulcanair','P68-R',600000,'457R',771,'Prop',68,'Pass',4,'https://upload.wikimedia.org/wikipedia/commons/7/7d/Vulcanair_P.68R_Salon_du_Bourget_2009-06-19_081.jpg'),
(20,1982,'Mooney','201SE',200000,'24-1267',2032,'Prop',200,'Fail',4,'https://farm6.staticflickr.com/5554/15325775001_0b3aa6f9ef_b.jpg'),
(21,1982,'Fairchild','Merlin IVC',270000,'427',7489,'Prop',800,'Pass',12,'https://upload.wikimedia.org/wikipedia/commons/2/20/VH-UZA.JPG'),
(22,2019,'Cirrus','Vision SF50',320000,'9586',100,'Jet',100,'Pass',5,'https://live.staticflickr.com/963/40191341450_979f5e1437_b.jpg'),
(23,2007,'Dassault Falcon','900EX EASy',27500000,'181',5446,'Jet',2000,'Pass',15,'https://live.staticflickr.com/7105/7404379152_e9bf9d213c_b.jpg'),
(24,2011,'Dassault Falcon','7X',23500000,'118',1973,'Jet',1000,'Pass',24,'https://upload.wikimedia.org/wikipedia/commons/4/4a/HZ-SPAH_Dassault_Falcon_7X.JPG'),
(25,1989,'McDonnell Douglas','MD-87 VIP',45000000,'49777',25258,'Jet',2500,'Pass',30,'https://upload.wikimedia.org/wikipedia/commons/6/6d/EC-KSF-Aerofan-McDonnell-Douglas-MD-87.jpg');
