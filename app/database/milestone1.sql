CREATE TABLE `multi_factor` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`code` varchar(8) NOT NULL,
	`email` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	CONSTRAINT `code_unique` UNIQUE INDEX(`code`),
	CONSTRAINT `email_unique` UNIQUE INDEX(`email`)
);

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
