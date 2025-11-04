ALTER TABLE `companies` ADD `description` text;--> statement-breakpoint
ALTER TABLE `companies` ADD `priority` enum('alta','normal','baja') DEFAULT 'normal' NOT NULL;