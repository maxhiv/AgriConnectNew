import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertProductSchema } from "@shared/schema";
import { z } from "zod";
import fs from "fs";
import path from "path";
import crypto from 'crypto';

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

    // Import CSV products endpoint
  app.post("/api/import-csv-products", async (req, res) => {
    try {
      const enrichedProductsFile = 'enriched_products_from_csv.json';

      if (!fs.existsSync(enrichedProductsFile)) {
        return res.status(400).json({
          success: false,
          message: "No enriched products file found. Run enrich-products-csv.py first."
        });
      }

      const enrichedProducts = JSON.parse(fs.readFileSync(enrichedProductsFile, 'utf8'));

      let importedCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;

      for (const productData of enrichedProducts) {
        try {
          const existingProduct = await storage.getProductBySlug(productData.slug);

          if (existingProduct) {
            // Update existing product with enriched data
            await storage.updateProduct(existingProduct.id, productData);
            updatedCount++;
          } else {
            // Create new product
            await storage.createProduct(productData);
            importedCount++;
          }
        } catch (error) {
          console.error(`Error processing product ${productData.name}:`, error);
          skippedCount++;
        }
      }

      res.json({
        success: true,
        message: `Product import complete`,
        stats: {
          imported: importedCount,
          updated: updatedCount,
          skipped: skippedCount,
          total: enrichedProducts.length
        }
      });

    } catch (error) {
      console.error('CSV import error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to import CSV products",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Import detailed product content endpoint
  app.post("/api/import-detailed-content", async (req, res) => {
    try {
      const detailedProductsFile = 'enriched_products_detailed.json';

      if (!fs.existsSync(detailedProductsFile)) {
        return res.status(400).json({
          success: false,
          message: "No detailed products file found. Run enrich-products-from-document.py first."
        });
      }

      const detailedProducts = JSON.parse(fs.readFileSync(detailedProductsFile, 'utf8'));

      let updatedCount = 0;
      let skippedCount = 0;
      let errors = [];

      for (const [productName, enrichedData] of Object.entries(detailedProducts)) {
        try {
          // Map product name to existing slug
          const slugMapping: { [key: string]: string } = {
            '20|20': '2020',
            'AirForce': 'airforce',
            'Clarity': 'clarity',
            'CleanSweep': 'cleansweep',
            'Conceal': 'conceal',
            'vSet Seed Meters': 'vset',
            'DeltaForce': 'deltaforce',
            'DuraWear Parallel Arms': 'durawear',
            'DuraWear Gauge Wheel Arms': 'durawear',
            'FurrowForce': 'furrowforce',
            'FurrowJet': 'furrowjet',
            'HeadSight': 'headsight',
            'MeterMax Ultra': 'metermax-ultra',
            'Panorama': 'panorama',
            'ReClaim': 'reclaim',
            'Ready Row Unit': 'ready-row-unit',
            'ReconBlockage': 'reconblockage',
            'ReconSpreader': 'reconspreader',
            'Reveal': 'reveal',
            'CornerStone Planting System': 'cornerstone-planting-system',
            'SeederForce': 'seederforce',
            'SmartDepth': 'smartdepth',
            'SmartFirmer': 'smartfirmer',
            'SpeedTube': 'speedtube',
            'SymphonyNozzle': 'symphonynozzle',
            'SymphonyVision': 'symphonyvision',
            'TrueSense': 'truesense',
            'TrueSight': 'truesight',
            'WaveVision': 'wavevision',
            'YieldSense': 'yieldsense',
            'mSet': 'mset',
            'vApplyHD': 'vapplyhd',
            'vDrive': 'vdrive',
            'vDrive Insecticide': 'vdrive-insecticide'
          };

          const targetSlug = (enrichedData as any).slug || slugMapping[productName];
          const existingProduct = await storage.getProductBySlug(targetSlug);

          if (existingProduct) {
            // Update existing product with detailed content
            const updateData = {
              enrichedDescription: (enrichedData as any).enrichedDescription,
              detailedFeatures: (enrichedData as any).detailedFeatures || [],
              benefits: (enrichedData as any).benefits || [],
              researchFindings: (enrichedData as any).researchFindings,
              compatibilityDetails: (enrichedData as any).compatibilityDetails,
              contentEnriched: (enrichedData as any).contentEnriched || true,
              lastContentUpdate: new Date((enrichedData as any).lastContentUpdate || '2025-08-27')
            };

            await storage.updateProduct(existingProduct.id, updateData);
            updatedCount++;
          } else {
            skippedCount++;
            errors.push(`Product not found: ${productName} (${targetSlug})`);
          }
        } catch (error) {
          console.error(`Error processing detailed content for ${productName}:`, error);
          skippedCount++;
          errors.push(`Error processing ${productName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      res.json({
        success: true,
        message: `Detailed content import complete`,
        stats: {
          updated: updatedCount,
          skipped: skippedCount,
          total: Object.keys(detailedProducts).length,
          errors: errors.slice(0, 10) // Limit errors shown
        }
      });

    } catch (error) {
      console.error('Detailed content import error:', error);
      res.status(500).json({
        success: false,
        message: "Failed to import detailed content",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}