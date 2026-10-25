CREATE TABLE `multi_factor` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`code` varchar(8) NOT NULL,
	`email` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	CONSTRAINT `code_unique` UNIQUE INDEX(`code`),
	CONSTRAINT `email_unique` UNIQUE INDEX(`email`)
);
--> statement-breakpoint
CREATE TABLE `saved_urls` (
	`user_id` int NOT NULL,
	`url_id` int NOT NULL,
	`redirect` varchar(16) NOT NULL,
	`creation_date` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `redirect_unique` UNIQUE INDEX(`redirect`),
	CONSTRAINT `saved_urls_user_url_idx` UNIQUE INDEX(`user_id`,`url_id`,`redirect`)
);
--> statement-breakpoint
CREATE TABLE `urls` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`address` varchar(2048) NOT NULL,
	`address_hash` varchar(64) NOT NULL,
	`creation_date` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `address_hash_unique` UNIQUE INDEX(`address_hash`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`is_email_verified` boolean NOT NULL DEFAULT false,
	`creation_date` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_unique` UNIQUE INDEX(`email`)
);
--> statement-breakpoint
ALTER TABLE `saved_urls` ADD CONSTRAINT `saved_urls_user_id_users_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `saved_urls` ADD CONSTRAINT `saved_urls_url_id_urls_id_fkey` FOREIGN KEY (`url_id`) REFERENCES `urls`(`id`) ON DELETE CASCADE;