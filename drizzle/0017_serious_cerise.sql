CREATE TABLE `emailNotificationSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`notificationType` varchar(100) NOT NULL,
	`enabled` int NOT NULL DEFAULT 1,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailNotificationSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailNotificationSettings_notificationType_unique` UNIQUE(`notificationType`)
);
