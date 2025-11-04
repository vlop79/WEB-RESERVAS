CREATE TABLE `resourceDownloads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`resourceId` varchar(100) NOT NULL,
	`resourceName` varchar(255) NOT NULL,
	`volunteerId` int,
	`volunteerEmail` varchar(320),
	`downloadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `resourceDownloads_id` PRIMARY KEY(`id`)
);
