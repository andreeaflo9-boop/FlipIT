import { int, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
    id: int("id").autoincrement().primaryKey(),

    name: text("name"),

    email: varchar("email", { length: 320 })
        .notNull()
        .unique(),

    passwordHash: varchar("passwordHash", { length: 255 })
        .notNull(),

    createdAt: timestamp("createdAt")
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updatedAt")
        .defaultNow()
        .onUpdateNow()
        .notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;