DROP INDEX `redirect_unique` ON `urls`;--> statement-breakpoint
ALTER TABLE `saved_urls` ADD `redirect` varchar(16) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `redirect_unique` ON `saved_urls` (`redirect`);--> statement-breakpoint
ALTER TABLE `urls` DROP COLUMN `redirect`;