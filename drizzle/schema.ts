import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Analysis history table - tracks all repository analyses performed by users
 */
export const analysisHistory = mysqlTable("analysis_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  repositoryUrl: varchar("repositoryUrl", { length: 255 }).notNull(),
  repositoryName: varchar("repositoryName", { length: 255 }).notNull(),
  repositoryOwner: varchar("repositoryOwner", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AnalysisHistory = typeof analysisHistory.$inferSelect;
export type InsertAnalysisHistory = typeof analysisHistory.$inferInsert;

/**
 * Analysis results table - stores detailed improvement suggestions for each analysis
 */
export const analysisResults = mysqlTable("analysis_results", {
  id: int("id").autoincrement().primaryKey(),
  analysisId: int("analysisId").notNull(),
  titleSuggestion: text("titleSuggestion"),
  summaryImprovement: text("summaryImprovement"),
  suggestedTags: text("suggestedTags"), // JSON array stored as text
  suggestedCategories: text("suggestedCategories"), // JSON array stored as text
  missingSections: text("missingSections"), // JSON array stored as text
  visualEnhancements: text("visualEnhancements"), // JSON array stored as text
  readmeAnalysis: text("readmeAnalysis"),
  codeStructureAnalysis: text("codeStructureAnalysis"),
  overallScore: int("overallScore"),
  rawAnalysisData: text("rawAnalysisData"), // Full JSON response from agents
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnalysisResults = typeof analysisResults.$inferSelect;
export type InsertAnalysisResults = typeof analysisResults.$inferInsert;