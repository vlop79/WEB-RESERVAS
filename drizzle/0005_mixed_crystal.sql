ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','empresa') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `companyId` int;