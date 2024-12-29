CREATE TABLE `chamber` (
	`code` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`address` text NOT NULL,
	`state` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`nit` integer PRIMARY KEY NOT NULL,
	`documentType` text NOT NULL,
	`businessName` text NOT NULL,
	`category` text NOT NULL,
	`legalEntity` text NOT NULL,
	`registrationDate` integer NOT NULL,
	`businessAddress` text NOT NULL,
	`companySize` integer NOT NULL,
	`economicActivity1` text NOT NULL,
	`registrationId` integer,
	`economicActivity2` text,
	`economicActivity3` text,
	`economicActivity4` text,
	`chamberCode` integer,
	`registrationNumber` integer,
	`legalOrganization` text,
	`lastRenewedYear` integer,
	`isActive` integer,
	`city` text,
	`state` text,
	FOREIGN KEY (`chamberCode`) REFERENCES `chamber`(`code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text NOT NULL,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL
);
