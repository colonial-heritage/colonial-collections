CREATE TABLE `object_item` (
  `id` serial AUTO_INCREMENT NOT NULL,
  `object_id` text NOT NULL,
  `object_list_id` int,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(50) NOT NULL,
  CONSTRAINT `object_item_id` PRIMARY KEY(`id`),
  CONSTRAINT `object_item_object_id_object_list_id_unique` UNIQUE(`object_id`,`object_list_id`)
);
--> statement-breakpoint
CREATE INDEX `object_id` ON `object_item` (`object_id`);--> statement-breakpoint
CREATE INDEX `object_list_id` ON `object_item` (`object_list_id`);