CREATE TABLE `analysis_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`repositoryUrl` varchar(255) NOT NULL,
	`repositoryName` varchar(255) NOT NULL,
	`repositoryOwner` varchar(255) NOT NULL,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `analysis_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `analysis_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analysisId` int NOT NULL,
	`titleSuggestion` text,
	`summaryImprovement` text,
	`suggestedTags` text,
	`suggestedCategories` text,
	`missingSections` text,
	`visualEnhancements` text,
	`readmeAnalysis` text,
	`codeStructureAnalysis` text,
	`overallScore` int,
	`rawAnalysisData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analysis_results_id` PRIMARY KEY(`id`)
);
