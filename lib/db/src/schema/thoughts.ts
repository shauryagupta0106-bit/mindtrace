import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const thoughtsTable = pgTable("thoughts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  context: text("context").notNull(),
  emotion: text("emotion").notNull(),
  intensity: integer("intensity").notNull().default(5),
  tags: text("tags").array().notNull().default([]),
  prediction: text("prediction"),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertThoughtSchema = createInsertSchema(thoughtsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertThought = z.infer<typeof insertThoughtSchema>;
export type Thought = typeof thoughtsTable.$inferSelect;
