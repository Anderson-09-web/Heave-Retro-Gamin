import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const apiEndpointsTable = pgTable("api_endpoints", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  method: text("method").notNull().default("GET"),
  description: text("description").notNull().default(""),
  active: boolean("active").notNull().default(true),
  categoryId: integer("category_id").notNull(),
  requestCount: integer("request_count").notNull().default(0),
  responseJson: text("response_json").notNull().default("{}"),
  requiresAuth: boolean("requires_auth").notNull().default(false),
  rateLimit: integer("rate_limit"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertApiEndpointSchema = createInsertSchema(apiEndpointsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertApiEndpoint = z.infer<typeof insertApiEndpointSchema>;
export type ApiEndpoint = typeof apiEndpointsTable.$inferSelect;
