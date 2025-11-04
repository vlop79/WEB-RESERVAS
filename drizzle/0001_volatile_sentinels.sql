CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slotId` int NOT NULL,
	`companyId` int NOT NULL,
	`serviceTypeId` int NOT NULL,
	`volunteerName` varchar(255) NOT NULL,
	`volunteerEmail` varchar(320) NOT NULL,
	`volunteerPhone` varchar(50),
	`status` enum('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
	`googleCalendarEventId` varchar(255),
	`googleMeetLink` text,
	`zohoRecordId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`logoUrl` text,
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`),
	CONSTRAINT `companies_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `service_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`startHour` int NOT NULL,
	`endHour` int NOT NULL,
	`maxVolunteersPerSlot` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `service_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `service_types_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `slots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`serviceTypeId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`startTime` varchar(5) NOT NULL,
	`endTime` varchar(5) NOT NULL,
	`maxVolunteers` int NOT NULL DEFAULT 1,
	`currentVolunteers` int NOT NULL DEFAULT 0,
	`active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `slots_id` PRIMARY KEY(`id`)
);
