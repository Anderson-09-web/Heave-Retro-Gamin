import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const configTable = pgTable("config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  type: text("type").notNull().default("string"),
  description: text("description").notNull().default(""),
  isSecret: boolean("is_secret").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertConfigSchema = createInsertSchema(configTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertConfig = z.infer<typeof insertConfigSchema>;
export type Config = typeof configTable.$inferSelect;
