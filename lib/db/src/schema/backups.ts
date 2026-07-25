import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const backupsTable = pgTable("backups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  size: text("size").notNull().default("0 KB"),
  status: text("status").notNull().default("completed"),
  restoredAt: timestamp("restored_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBackupSchema = createInsertSchema(backupsTable).omit({ id: true, createdAt: true });
export type InsertBackup = z.infer<typeof insertBackupSchema>;
export type Backup = typeof backupsTable.$inferSelect;
