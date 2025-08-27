import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { sql } from "drizzle-orm/sql";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import crypto from "crypto";


neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

export const products = sqliteTable("products", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  equipment: text("equipment").notNull(),
  category: text("category").notNull(),
  tagline: text("tagline"),
  oemUrl: text("oem_url"),
  highlights: text("highlights", { mode: "json" }).$type<string[]>().default([]),
  worksWith: text("works_with", { mode: "json" }).$type<string[]>().default([]),
  slug: text("slug").notNull().unique(),
  primaryImage: text("primary_image"),
  images: text("images", { mode: "json" }).$type<Array<{filename: string, path: string, type?: string}>>().default([]),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});