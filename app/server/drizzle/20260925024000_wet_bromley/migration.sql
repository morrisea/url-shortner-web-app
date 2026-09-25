CREATE TABLE `users` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	CONSTRAINT `email_unique` UNIQUE INDEX(`email`)
);
