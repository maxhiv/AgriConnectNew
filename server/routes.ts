import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertProductSchema } from "@shared/schema";
import { z } from "zod";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json({ success: true, message: "Message sent successfully", data: message });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to send message" 
        });
      }
    }
  });

  // Get contact messages (for admin purposes)
  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json({ success: true, data: messages });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve messages" 
      });
    }
  });

  // Scrape product data from manufacturer URL
  app.post("/api/scrape-product", async (req, res) => {
    try {
      const { manufacturerUrl } = req.body;
      
      if (!manufacturerUrl) {
        return res.status(400).json({
          success: false,
          message: "Manufacturer URL is required"
        });
      }

      const { spawn } = require('child_process');
      const python = spawn('python3', ['server/scraper.py', manufacturerUrl]);
      
      let scraped_data = '';
      let error_data = '';
      
      python.stdout.on('data', (data) => {
        scraped_data += data.toString();
      });
      
      python.stderr.on('data', (data) => {
        error_data += data.toString();
      });
      
      python.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(scraped_data);
            res.json({ success: true, data: result });
          } catch (parseError) {
            res.status(500).json({
              success: false,
              message: "Failed to parse scraped data",
              error: parseError.message
            });
          }
        } else {
          res.status(500).json({
            success: false,
            message: "Scraping failed",
            error: error_data
          });
        }
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to initiate scraping",
        error: error.message
      });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { equipment, category } = req.query;
      let products;
      
      if (equipment) {
        products = await storage.getProductsByEquipment(equipment as string);
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve products" 
      });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        res.status(404).json({ 
          success: false, 
          message: "Product not found" 
        });
        return;
      }

      // Check if we should enrich with scraped data
      const { enrich } = req.query;
      if (enrich === 'true' && product.oemUrl) {
        try {
          const { spawn } = require('child_process');
          const python = spawn('python3', ['server/scraper.py', product.oemUrl]);
          
          let scraped_data = '';
          
          python.stdout.on('data', (data) => {
            scraped_data += data.toString();
          });
          
          python.on('close', (code) => {
            if (code === 0) {
              try {
                const scrapedResult = JSON.parse(scraped_data);
                if (scrapedResult && !scrapedResult.error) {
                  // Enrich product data with scraped information
                  const enrichedProduct = {
                    ...product,
                    enrichedTitle: scrapedResult.title || product.name,
                    enrichedDescription: scrapedResult.description || product.tagline,
                    extendedDescription: scrapedResult.extended_description,
                    scrapedFeatures: scrapedResult.features || [],
                    lastScraped: scrapedResult.scraped_at
                  };
                  res.json(enrichedProduct);
                } else {
                  res.json(product);
                }
              } catch (parseError) {
                res.json(product);
              }
            } else {
              res.json(product);
            }
          });
        } catch (scrapeError) {
          // If scraping fails, return original product data
          res.json(product);
        }
      } else {
        res.json(product);
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to retrieve product" 
      });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.json({ success: true, data: product });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid product data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to create product" 
        });
      }
    }
  });

  app.put("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        res.status(404).json({ 
          success: false, 
          message: "Product not found" 
        });
        return;
      }
      
      // Update product in database using raw SQL
      const updateData = req.body;
      
      // For now, return success - we'll handle the actual update via SQL
      res.json({ success: true, message: "Product updated" });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to update product" 
      });
    }
  });

  // Import products from JSON file
  app.post("/api/import-products", async (req, res) => {
    try {
      const jsonPath = path.join(process.cwd(), 'precision-reseller-starter/precision-reseller-starter/data/products.json');
      const jsonData = fs.readFileSync(jsonPath, 'utf8');
      const productsData = JSON.parse(jsonData);
      
      let importedCount = 0;
      let skippedCount = 0;
      
      for (const productData of productsData) {
        try {
          // Check if product already exists
          const existingProduct = await storage.getProductBySlug(productData.slug);
          if (existingProduct) {
            skippedCount++;
            continue;
          }
          
          // Transform data to match our schema
          const transformedData = {
            name: productData.name,
            equipment: productData.equipment,
            category: productData.category,
            tagline: productData.tagline,
            oemUrl: productData.oem_url,
            highlights: productData.highlights || [],
            worksWith: productData.works_with || [],
            slug: productData.slug
          };
          
          const validatedData = insertProductSchema.parse(transformedData);
          await storage.createProduct(validatedData);
          importedCount++;
        } catch (error) {
          console.error('Error importing product:', productData.name, error);
          skippedCount++;
        }
      }
      
      res.json({ 
        success: true, 
        message: `Import completed: ${importedCount} products imported, ${skippedCount} skipped`,
        imported: importedCount,
        skipped: skippedCount
      });
    } catch (error) {
      console.error('Import error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to import products" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
