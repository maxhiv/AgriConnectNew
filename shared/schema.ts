import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
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
  brand: text("brand").notNull().default('Precision Planting'),
  equipment: text("equipment").notNull(),
  category: text("category").notNull(),
  tagline: text("tagline").notNull(),
  shortDescription: text("short_description"),
  oemUrl: text("oem_url").notNull(),
  highlights: text("highlights").array().notNull(),
  keyFeatures: text("key_features").array(),
  specs: text("specs").array(),
  worksWith: text("works_with").array().notNull(),
  slug: text("slug").notNull().unique(),
  logoBlack: text("logo_black"),
  logoDarkGreen: text("logo_dark_green"),
  logoWhite: text("logo_white"),
  primaryImage: text("primary_image"),
  images: text("images").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  enrichedDescription: text("enriched_description"),
  detailedFeatures: text("detailed_features").array(),
  benefits: text("benefits").array(),
  researchFindings: text("research_findings"),
  compatibilityDetails: text("compatibility_details"),
  contentEnriched: boolean("content_enriched"),
  lastContentUpdate: timestamp("last_content_update"),
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
  brand: true,
  equipment: true,
  category: true,
  tagline: true,
  shortDescription: true,
  oemUrl: true,
  highlights: true,
  keyFeatures: true,
  specs: true,
  worksWith: true,
  slug: true,
  logoBlack: true,
  logoDarkGreen: true,
  logoWhite: true,
  primaryImage: true,
  images: true,
  enrichedDescription: true,
  detailedFeatures: true,
  benefits: true,
  researchFindings: true,
  compatibilityDetails: true,
  contentEnriched: true,
  lastContentUpdate: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Interfaces for enriched content (assuming these would be used in a frontend context)
// These are not directly part of the Drizzle schema but represent the data structure.

// export interface ProductImage {
//   url: string;
//   alt: string;
// }

// export interface Product {
//   id: string;
//   name: string;
//   slug: string;
//   equipment: string;
//   category: string;
//   tagline: string;
//   description?: string;
//   oemUrl?: string;
//   highlights: string[];
//   worksWith: string[];
//   primaryImage?: string;
//   images?: ProductImage[];
//   logoDarkGreen?: string;

//   // Enriched content fields
//   enrichedDescription?: string;
//   detailedFeatures?: string[];
//   benefits?: string[];
//   researchFindings?: ResearchFinding[];
//   compatibilityDetails?: CompatibilityDetails;
//   contentEnriched?: boolean;
//   lastContentUpdate?: string;
// }

// export interface ResearchFinding {
//   study: string;
//   details: string;
//   key_metrics?: string[];
// }

// export interface CompatibilityDetails {
//   details?: string;
//   works_with?: string[];
// }

// News Article schema (static content, no database)
export const newsArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  image: z.string(),
  date: z.string(),
  author: z.string().optional(),
  category: z.string().optional(),
});

export type NewsArticle = z.infer<typeof newsArticleSchema>;