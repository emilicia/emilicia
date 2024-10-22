CREATE TABLE `clients` (
	`clientId` integer PRIMARY KEY NOT NULL,
	`clientName` text NOT NULL,
	`clientAddress` text NOT NULL,
	`clientContact` text NOT NULL,
	`pseudo` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `equipments` (
	`equipmentId` integer PRIMARY KEY NOT NULL,
	`equipmentName` text DEFAULT '',
	`equipmentAmount` text DEFAULT '',
	`positionId` integer
);
--> statement-breakpoint
CREATE TABLE `positions` (
	`positionId` integer PRIMARY KEY NOT NULL,
	`positionName` text DEFAULT '',
	`positionLocation` text DEFAULT '',
	`positionCapacity` integer DEFAULT 0,
	`positionDailyRenting` real DEFAULT 0,
	`positionAvailable` integer DEFAULT 1,
	`positionImageUrl` text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE `products` (
	`productId` integer PRIMARY KEY NOT NULL,
	`productName` text,
	`productReference` text,
	`productUP` real,
	`productStock` integer
);
--> statement-breakpoint
CREATE TABLE `rentings` (
	`rentingId` integer PRIMARY KEY NOT NULL,
	`rentingStartDate` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`rentingEndDate` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`rentingStatus` text DEFAULT 'nouvelle',
	`userId` integer,
	`positionId` integer
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`salesId` integer PRIMARY KEY NOT NULL,
	`salesDate` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`salesAmount` real,
	`productId` real,
	`clientId` real,
	`salesPersonId` real
);
--> statement-breakpoint
CREATE TABLE `salesPersons` (
	`salesPersonId` integer PRIMARY KEY NOT NULL,
	`salesPersonName` text,
	`salesPersonContact` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`userId` integer PRIMARY KEY NOT NULL,
	`userName` text DEFAULT '',
	`userType` text DEFAULT 'client',
	`userImageUrl` text DEFAULT '',
	`userEmail` text NOT NULL,
	`userPassword` text NOT NULL
);
