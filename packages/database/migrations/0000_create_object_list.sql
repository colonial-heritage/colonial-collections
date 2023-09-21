CREATE TABLE `object_list` (
  `id` serial AUTO_INCREMENT NOT NULL,
  `name` varchar(256),
  `description` text,
  `community_id` varchar(50),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(256) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `object_list_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `community_id` ON `object_list` (`community_id`);