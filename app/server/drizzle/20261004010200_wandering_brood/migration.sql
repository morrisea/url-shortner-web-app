ALTER TABLE `two_factor` DROP CONSTRAINT `two_factor_user_fk_users_id_fkey`;--> statement-breakpoint
DROP INDEX `two_factor_user_fk_users_id_fkey` ON `two_factor`--> statement-breakpoint
ALTER TABLE `two_factor` ADD `email` varchar(255) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `email_unique` ON `two_factor` (`email`);--> statement-breakpoint
ALTER TABLE `two_factor` DROP COLUMN `user_fk`;