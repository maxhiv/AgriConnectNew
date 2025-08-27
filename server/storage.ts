import { users, contactMessages, products, type User, type InsertUser, type ContactMessage, type InsertContactMessage, type Product, type InsertProduct } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  getProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getProductsByEquipment(equipment: string): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined>;
  updateProductBySlug(slug: string, data: Partial<InsertProduct>): Promise<Product | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactMessages: Map<string, ContactMessage>;
  private products: Map<string, Product>;

  constructor() {
    this.users = new Map();
    this.contactMessages = new Map();
    this.products = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = {
      ...insertMessage,
      id,
      phone: insertMessage.phone || null,
      service: insertMessage.service || null,
      createdAt: new Date()
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.slug === slug);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      logoBlack: insertProduct.logoBlack || null,
      logoDarkGreen: insertProduct.logoDarkGreen || null,
      logoWhite: insertProduct.logoWhite || null,
      primaryImage: insertProduct.primaryImage || null,
      images: insertProduct.images || null,
      createdAt: new Date(),
      updatedAt: null
    };
    this.products.set(id, product);
    return product;
  }

  async getProductsByEquipment(equipment: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.equipment === equipment);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) {
      return undefined;
    }
    const updatedProduct: Product = { ...product, ...data, updatedAt: new Date() };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async updateProductBySlug(slug: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = Array.from(this.products.values()).find(p => p.slug === slug);
    if (!existingProduct) {
      return undefined;
    }
    const updatedProduct: Product = { ...existingProduct, ...data, updatedAt: new Date() };
    this.products.set(existingProduct.id, updatedProduct);
    return updatedProduct;
  }
}

// DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values({
        ...insertMessage,
        phone: insertMessage.phone || null,
        service: insertMessage.service || null
      })
      .returning();
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(contactMessages.createdAt);
    return messages.reverse(); // Most recent first
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(products.name);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    try {
      const [updated] = await db
        .update(products)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning();

      return updated || undefined;
    } catch (error) {
      console.error("Error updating product:", error);
      return undefined;
    }
  }

  async updateProductBySlug(slug: string, data: Partial<InsertProduct>): Promise<Product | undefined> {
    try {
      const [updated] = await db
        .update(products)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(products.slug, slug))
        .returning();

      return updated || undefined;
    } catch (error) {
      console.error("Error updating product by slug:", error);
      return undefined;
    }
  }

  async getProductsByEquipment(equipment: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.equipment, equipment));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }
}

export const storage = new DatabaseStorage();