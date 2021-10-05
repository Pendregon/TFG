CREATE DATABASE IF NOT EXISTS `tfg`;
USE `tfg`;

CREATE TABLE IF NOT EXISTS `missions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description` text,
  `location` varchar(200) NOT NULL,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `is_public` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `mission_vehicle` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `mission_id` bigint(20) NOT NULL,
  `vehicle_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `mission_vehicle_mission` (`mission_id`),
  KEY `mission_vehicle_vehicle` (`vehicle_id`),
  CONSTRAINT `mission_vehicle_mission` FOREIGN KEY (`mission_id`) REFERENCES `missions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `mission_vehicle_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `type` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

INSERT INTO `permissions` (`id`, `name`, `type`) VALUES
	(1, 'show_missions', 'missions'),
	(2, 'show_vehicles', 'vehicles'),
	(3, 'show_users', 'users'),
	(4, 'show_admin_panel', '-'),
	(5, 'show_mission', 'missions'),
	(6, 'edit_mission', 'missions'),
	(7, 'create_mission', 'missions'),
	(8, 'delete_mission', 'missions'),
	(9, 'show_roles', 'roles'),
	(10, 'edit_role', 'roles'),
	(11, 'show_role', 'roles'),
	(12, 'create_role', 'roles'),
	(13, 'delete_role', 'roles'),
	(14, 'show_vehicle', 'vehicles'),
	(15, 'edit_vehicle', 'vehicles'),
	(16, 'create_vehicle', 'vehicles'),
	(17, 'delete_vehicle', 'vehicles'),
	(18, 'create_user', 'users'),
	(19, 'edit_user', 'users'),
	(20, 'delete_user', 'users');
  
CREATE TABLE IF NOT EXISTS `permission_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `permission_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `permission_role_permission` (`permission_id`),
  KEY `permission_role_role` (`role_id`),
  CONSTRAINT `permission_role_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `permission_role_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

INSERT INTO `permission_role` (`id`, `permission_id`, `role_id`) VALUES
	(1, 1, 1),
	(2, 2, 1),
	(3, 3, 1),
	(4, 4, 1),
	(5, 5, 1),
	(6, 6, 1),
	(7, 7, 1),
	(8, 8, 1),
	(9, 9, 1),
	(10, 10, 1),
	(11, 11, 1),
	(12, 12, 1),
	(13, 13, 1),
	(14, 14, 1),
	(15, 15, 1),
	(16, 16, 1),
	(17, 17, 1),
	(18, 18, 1),
	(19, 19, 1),
	(20, 20, 1);

CREATE TABLE IF NOT EXISTS `records` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `vehicle_id` bigint(20) NOT NULL,
  `mission_id` bigint(20) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `record_mission` (`mission_id`),
  KEY `record_vehicle` (`vehicle_id`),
  CONSTRAINT `record_mission` FOREIGN KEY (`mission_id`) REFERENCES `missions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `record_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `record_sensor` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `record_id` bigint(20) NOT NULL,
  `sensor_id` bigint(20) NOT NULL,
  `sensor_type` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `record_sensor_record` (`record_id`),
  CONSTRAINT `record_sensor_record` FOREIGN KEY (`record_id`) REFERENCES `records` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `display_name` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

INSERT INTO `roles` (`id`, `name`, `display_name`) VALUES
	(1, 'admin', 'Administrador');

CREATE TABLE IF NOT EXISTS `sensor_navigation` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `boat_time` timestamp NULL DEFAULT NULL,
  `reset_number` smallint(6) DEFAULT NULL,
  `channel` varchar(50) DEFAULT NULL,
  `raw_data` longtext,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `speed` double DEFAULT NULL,
  `heading` double DEFAULT NULL,
  `pitch` smallint(6) DEFAULT NULL,
  `roll` double DEFAULT NULL,
  `true_wind_angle` smallint(6) DEFAULT NULL,
  `true_wind_speed` smallint(6) DEFAULT NULL,
  `active_wp` smallint(6) DEFAULT NULL,
  `active_wp_latitude` double DEFAULT NULL,
  `active_wp_longitude` double DEFAULT NULL,
  `wasp_latitude` double DEFAULT NULL,
  `wasp_longitude` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `users_role` (`role_id`),
  CONSTRAINT `users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role_id`) VALUES
	(1, 'usuario 1', 'test@test.com', '$2b$10$CfxtwEqgP1CAV5lBvE6/UeYGxtuPD62v7jWUWqsF.hIbe0TR8Sura', 1);

CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `route_color` text NOT NULL,
  `boat_mark_color` text NOT NULL,
  `boat_waypoint_color` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `waypoints` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `mission_id` bigint(20) NOT NULL DEFAULT '0',
  `vehicle_id` bigint(20) NOT NULL DEFAULT '0',
  `sequence` smallint(6) NOT NULL DEFAULT '0',
  `latitude` double NOT NULL DEFAULT '0',
  `longitude` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `waypoint_mission` (`mission_id`),
  KEY `waypoint_vehicle` (`vehicle_id`),
  CONSTRAINT `waypoint_mission` FOREIGN KEY (`mission_id`) REFERENCES `missions` (`id`),
  CONSTRAINT `waypoint_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
