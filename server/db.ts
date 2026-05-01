import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { type InsertUser, users } from "../drizzle/schema";


let dbInstance: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
    if (!dbInstance && ENV.databaseUrl) {
        dbInstance = drizzle(ENV.databaseUrl);
    }

    return dbInstance;
}

export async function createUser(user: InsertUser) {
    const db = await getDb();

    if (!db) {
        throw new Error("Database is not available");
    }

    await db.insert(users).values(user);
}

export async function getUserByEmail(email: string) {
    const db = await getDb();

    if (!db) {
        return undefined;
    }

    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

    return result[0];
}