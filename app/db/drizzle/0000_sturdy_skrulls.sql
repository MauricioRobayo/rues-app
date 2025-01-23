CREATE TABLE `chambers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` integer NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`address` text NOT NULL,
	`state` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chambers_code_unique` ON `chambers` (`code`);--> statement-breakpoint
CREATE TABLE `companies` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nit` integer NOT NULL,
	`name` text NOT NULL,
	`size` text,
	`state` text,
	`city` text,
	`address` text,
	`ruesSyncId` integer,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`ruesSyncId`) REFERENCES `rues_sync`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `companies_nit_unique` ON `companies` (`nit`);--> statement-breakpoint
CREATE INDEX `rues_sync_idx` ON `companies` (`ruesSyncId`);--> statement-breakpoint
CREATE TABLE `rues_sync` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`startedAtMs` integer NOT NULL,
	`status` text NOT NULL,
	`endedAtMs` integer,
	`syncStartDate` text(10),
	`syncEndDate` text(10),
	`totalRecords` integer,
	`syncFileUrl` text,
	`errorMessage` text
);
--> statement-breakpoint
CREATE TABLE `tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text NOT NULL,
	`timestamp` integer DEFAULT (unixepoch()) NOT NULL
);
