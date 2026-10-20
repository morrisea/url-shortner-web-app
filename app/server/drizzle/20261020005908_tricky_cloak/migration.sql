CREATE TABLE `saved_urls` (
	`user_id` int NOT NULL,
	`url_id` int NOT NULL,
	`creation_date` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_urls_user_url_idx` UNIQUE INDEX(`user_id`,`url_id`)
);
--> statement-breakpoint
CREATE TABLE `urls` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`address` varchar(2048) NOT NULL,
	`address_hash` varchar(64) NOT NULL,
	`redirect` varchar(16) NOT NULL,
	`creation_date` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `address_hash_unique` UNIQUE INDEX(`address_hash`),
	CONSTRAINT `redirect_unique` UNIQUE INDEX(`redirect`)
);
--> statement-breakpoint
ALTER TABLE `saved_urls` ADD CONSTRAINT `saved_urls_user_id_users_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `saved_urls` ADD CONSTRAINT `saved_urls_url_id_urls_id_fkey` FOREIGN KEY (`url_id`) REFERENCES `urls`(`id`) ON DELETE CASCADE;