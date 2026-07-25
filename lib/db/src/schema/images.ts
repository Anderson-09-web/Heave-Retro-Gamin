import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const imagesTable = pgTable("images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  type: text("type").notNull().default("image"),
  categoryId: integer("category_id").notNull(),
  tags: text("tags").notNull().default(""),
  requestCount: integer("request_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertImageSchema = createInsertSchema(imagesTable).omit({ id: true, createdAt: true });
export type InsertImage = z.infer<typeof insertImageSchema>;
export type Image = typeof imagesTable.$inferSelect;
