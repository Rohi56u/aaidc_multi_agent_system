import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, analysisHistory, analysisResults, InsertAnalysisResults } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createAnalysis(
  userId: number,
  repositoryUrl: string,
  repositoryName: string,
  repositoryOwner: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(analysisHistory).values({
    userId,
    repositoryUrl,
    repositoryName,
    repositoryOwner,
    status: "pending",
  });

  return result;
}

export async function updateAnalysisStatus(
  analysisId: number,
  status: "pending" | "processing" | "completed" | "failed",
  errorMessage?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(analysisHistory)
    .set({ status, errorMessage: errorMessage || null, updatedAt: new Date() })
    .where(eq(analysisHistory.id, analysisId));
}

export async function saveAnalysisResults(
  analysisId: number,
  results: Omit<InsertAnalysisResults, 'analysisId'>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(analysisResults).values({
    analysisId,
    ...(results as any),
  });
}

export async function getAnalysisById(analysisId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const analysis = await db
    .select()
    .from(analysisHistory)
    .where(eq(analysisHistory.id, analysisId))
    .limit(1);

  return analysis.length > 0 ? analysis[0] : null;
}

export async function getAnalysisResults(analysisId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const results = await db
    .select()
    .from(analysisResults)
    .where(eq(analysisResults.analysisId, analysisId))
    .limit(1);

  return results.length > 0 ? results[0] : null;
}

export async function getUserAnalysisHistory(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(analysisHistory)
    .where(eq(analysisHistory.userId, userId))
    .orderBy(analysisHistory.createdAt);
}

export async function deleteAnalysis(analysisId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(analysisResults).where(eq(analysisResults.analysisId, analysisId));
  await db.delete(analysisHistory).where(eq(analysisHistory.id, analysisId));
}

// Re-export types for use in routers
export type AnalysisHistory = typeof analysisHistory.$inferSelect;
export type AnalysisResults = typeof analysisResults.$inferSelect;
