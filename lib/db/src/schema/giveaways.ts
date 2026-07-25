import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const giveawaysTable = pgTable("giveaways", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  prize: text("prize").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"),
  participantCount: integer("participant_count").notNull().default(0),
  winnerUserId: integer("winner_user_id"),
  winnerName: text("winner_name"),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertGiveawaySchema = createInsertSchema(giveawaysTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGiveaway = z.infer<typeof insertGiveawaySchema>;
export type Giveaway = typeof giveawaysTable.$inferSelect;
