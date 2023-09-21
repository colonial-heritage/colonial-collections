CREATE TABLE `object_item` (
  `object_hash` varchar(32) NOT NULL,
  `object_id` text NOT NULL,
  `object_list_id` int,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(50) NOT NULL,
  CONSTRAINT `object_item_object_hash` PRIMARY KEY(`object_hash`),
  CONSTRAINT `object_item_object_hash_object_list_id_unique` UNIQUE(`object_hash`,`object_list_id`)
);
--> statement-breakpoint
CREATE INDEX `object_hash` ON `object_item` (`object_hash`);--> statement-breakpoint
CREATE INDEX `object_list_id` ON `object_item` (`object_list_id`);