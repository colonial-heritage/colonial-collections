ALTER TABLE `object_item` ADD `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `object_item` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `object_item` ADD PRIMARY KEY(`id`);