import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  service: text("service"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  equipment: text("equipment").notNull(),
  category: text("category").notNull(),
  tagline: text("tagline").notNull(),
  oemUrl: text("oem_url").notNull(),
  highlights: text("highlights").array().notNull(),
  worksWith: text("works_with").array().notNull(),
  slug: text("slug").notNull().unique(),
  logoBlack: text("logo_black"),
  logoDarkGreen: text("logo_dark_green"),
  logoWhite: text("logo_white"),
  primaryImage: text("primary_image"),
  images: text("images").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  service: true,
  message: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  equipment: true,
  category: true,
  tagline: true,
  oemUrl: true,
  highlights: true,
  worksWith: true,
  slug: true,
  logoBlack: true,
  logoDarkGreen: true,
  logoWhite: true,
  primaryImage: true,
  images: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;