CREATE TABLE `two_factor` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`code` varchar(8) NOT NULL,
	`user_fk` int NOT NULL,
	`expires_at` timestamp NOT NULL,
	CONSTRAINT `code_unique` UNIQUE INDEX(`code`),
	CONSTRAINT `two_factor_user_fk_users_id_fkey` FOREIGN KEY (`user_fk`) REFERENCES `users`(`id`)
);
