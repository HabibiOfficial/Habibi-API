import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const apikeysTable = pgTable("apikeys", {
  id: serial("id").primaryKey(),
  apikey: text("apikey").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  isValid: boolean("is_valid").notNull().default(true),
  requestCount: integer("request_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertApikeySchema = createInsertSchema(apikeysTable).omit({ id: true, createdAt: true, requestCount: true, isValid: true });
export type InsertApikey = z.infer<typeof insertApikeySchema>;
export type Apikey = typeof apikeysTable.$inferSelect;

export const requestLogsTable = pgTable("request_logs", {
  id: serial("id").primaryKey(),
  endpoint: text("endpoint").notNull(),
  apikey: text("apikey"),
  status: integer("status").notNull().default(200),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type RequestLog = typeof requestLogsTable.$inferSelect;
