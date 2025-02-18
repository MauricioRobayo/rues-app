DROP INDEX "chambers_code_unique";--> statement-breakpoint
DROP INDEX "companies_nit_unique";--> statement-breakpoint
DROP INDEX "rues_sync_idx";--> statement-breakpoint
ALTER TABLE `chambers` ALTER COLUMN "code" TO "code" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `chambers_code_unique` ON `chambers` (`code`);--> statement-breakpoint
CREATE UNIQUE INDEX `companies_nit_unique` ON `companies` (`nit`);--> statement-breakpoint
CREATE INDEX `rues_sync_idx` ON `companies` (`ruesSyncId`);