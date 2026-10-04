CREATE TABLE `multi_factor` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`code` varchar(8) NOT NULL,
	`email` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	CONSTRAINT `code_unique` UNIQUE INDEX(`code`),
	CONSTRAINT `email_unique` UNIQUE INDEX(`email`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`isEmailVerified` boolean NOT NULL DEFAULT false,
	CONSTRAINT `email_unique` UNIQUE INDEX(`email`)
);
