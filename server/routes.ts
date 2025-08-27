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

      const { spawn } = await import('node:child_process');
      const python = spawn('python3', ['server/scraper.py', manufacturerUrl]);

      let scraped_data = '';
      let error_data = '';

      python.stdout.on('data', (data: Buffer) => {
        scraped_data += data.toString();
      });

      python.stderr.on('data', (data: Buffer) => {
        error_data += data.toString();
      });

      python.on('close', (code: number | null) => {
        if (code === 0) {
          try {
            const result = JSON.parse(scraped_data);
            res.json({ success: true, data: result });
          } catch (parseError) {
            res.status(500).json({
              success: false,
              message: "Failed to parse scraped data",
              error: parseError instanceof Error ? parseError.message : 'Unknown error'
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
        error: error instanceof Error ? error.message : 'Unknown error'
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
    const product = await storage.getProductBySlug(req.params.slug);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if enhanced content is requested
    const enrich = req.query.enrich === 'true';

    if (enrich && product.oemUrl) {
      try {
        // Call Python content enhancer
        const { spawn } = await import('node:child_process');
        const python = spawn('python3', ['server/scraper.py', product.oemUrl]);

        let output = '';
        let responseSent = false;

        python.stdout.on('data', (data: Buffer) => {
          output += data.toString();
        });

        python.on('close', (code: number) => {
          if (responseSent) return;
          responseSent = true;

          if (code === 0 && output.trim()) {
            try {
              const scrapedData = JSON.parse(output);

              // Enhance product with scraped data
              const enrichedProduct = {
                ...product,
                enrichedTitle: scrapedData.title || product.name,
                enrichedDescription: scrapedData.description || product.tagline,
                extendedDescription: scrapedData.extended_description,
                scrapedFeatures: scrapedData.features || [],
                lastScraped: scrapedData.scraped_at
              };

              res.json(enrichedProduct);
            } catch (parseError) {
              console.error('Error parsing scraped data:', parseError);
              res.json(product);
            }
          } else {
            res.json(product);
          }
        });

        python.on('error', (error: Error) => {
          if (responseSent) return;
          responseSent = true;
          console.error('Error running scraper:', error);
          res.json(product);
        });

      } catch (error) {
        console.error('Error enhancing product:', error);
        res.json(product);
      }
    } else {
      res.json(product);
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

  // Update product by slug
  app.put("/api/products/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const validatedData = insertProductSchema.parse(req.body);

      const updated = await storage.updateProductBySlug(slug, validatedData);
      if (!updated) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
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
          imported: importedCount,
          skipped: skippedCount,
          message: `Successfully imported ${importedCount} products, skipped ${skippedCount} with errors`
        });

      } catch (error) {
        console.error('CSV Import error:', error);
        res.status(500).json({
          success: false,
          message: "Failed to import CSV products: " + (error instanceof Error ? error.message : 'Unknown error')
        });
      }
    });

    // Import enriched products from CSV
    app.post("/api/import-csv-products", async (req, res) => {
      try {
        const csvEnrichedPath = path.join(process.cwd(), 'enriched_products_from_csv.json');

        if (!fs.existsSync(csvEnrichedPath)) {
          return res.status(400).json({
            success: false,
            message: "Enriched CSV data not found. Please run the enrichment script first."
          });
        }

        const jsonData = fs.readFileSync(csvEnrichedPath, 'utf8');
        const productsData = JSON.parse(jsonData);

        let importedCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;

        for (const productData of productsData) {
          try {
            // Check if product already exists
            const existingProduct = await storage.getProductBySlug(productData.slug);

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

            if (existingProduct) {
              // Update existing product with enriched data
              await storage.updateProduct(existingProduct.id, validatedData);
              updatedCount++;
            } else {
              // Create new product
              await storage.createProduct(validatedData);
              importedCount++;
            }
          } catch (error) {
            console.error('Error processing product:', productData.name, error);
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