CREATE TABLE `object_list_item` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`object_id` varchar(256) NOT NULL,
	`list_id` int,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`created_by` varchar(256) NOT NULL,
	CONSTRAINT `object_list_item_id` PRIMARY KEY(`id`),
	CONSTRAINT `object_list_item_object_id_list_id_unique` UNIQUE(`object_id`,`list_id`)
);
--> statement-breakpoint
CREATE TABLE `object_list` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(256),
	`description` text,
	`community_id` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`created_by` varchar(256) NOT NULL,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `object_list_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `object_id` ON `object_list_item` (`object_id`);--> statement-breakpoint
CREATE INDEX `list_id` ON `object_list_item` (`list_id`);--> statement-breakpoint
CREATE INDEX `community_id` ON `object_list` (`community_id`);