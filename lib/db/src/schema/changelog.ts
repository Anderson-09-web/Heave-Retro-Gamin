import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const changelogTable = pgTable("changelog", {
  id: serial("id").primaryKey(),
  version: text("version").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull().default("feature"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertChangelogSchema = createInsertSchema(changelogTable).omit({ id: true, createdAt: true });
export type InsertChangelog = z.infer<typeof insertChangelogSchema>;
export type Changelog = typeof changelogTable.$inferSelect;
