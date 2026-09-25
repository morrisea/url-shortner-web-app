ALTER TABLE `users` ADD `firstName` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastName` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `isEmailVerified` boolean DEFAULT false NOT NULL;