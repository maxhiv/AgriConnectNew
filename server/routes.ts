import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertProductSchema } from "@shared/schema";
import { z } from "zod";
import fs from "fs";
import path from "path";
import crypto from 'crypto';
import { ObjectStorageService } from "./objectStorage";
import { WordPressService } from "./wordpressService";
import { catalogProducts, getAllBrands, getAllCategories } from "./productCatalogSeed";
import { getAllNewsArticles, getNewsArticle } from "./newsArticlesSeed";

async function autoSeedProducts() {
  try {
    const existingProducts = await storage.getProducts();
    if (existingProducts.length === 0) {
      console.log('No products found in database. Auto-seeding catalog...');
      let importedCount = 0;
      for (const productData of catalogProducts) {
        try {
          await storage.createProduct(productData as any);
          importedCount++;
        } catch (error) {
          console.error('Error importing product:', productData.name, error);
        }
      }
      console.log(`Auto-seeded ${importedCount} products into database`);
    } else {
      console.log(`Database already has ${existingProducts.length} products`);
    }
  } catch (error) {
    console.error('Error during auto-seed:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  await autoSeedProducts();
  // Initialize WordPress service
  const wordpressService = new WordPressService();

  // WordPress API endpoints
  app.get("/api/wordpress/posts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const posts = await wordpressService.getPosts(limit);
      res.json({ success: true, data: posts });
    } catch (error) {
      console.error("Error fetching WordPress posts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch posts from WordPress"
      });
    }
  });

  app.get("/api/wordpress/posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await wordpressService.getPost(slug);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found"
        });
      }
      res.json({ success: true, data: post });
    } catch (error) {
      console.error("Error fetching WordPress post:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch post from WordPress"
      });
    }
  });

  app.get("/api/wordpress/pages", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const pages = await wordpressService.getPages(limit);
      res.json({ success: true, data: pages });
    } catch (error) {
      console.error("Error fetching WordPress pages:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch pages from WordPress"
      });
    }
  });

  app.get("/api/wordpress/pages/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const page = await wordpressService.getPage(slug);
      if (!page) {
        return res.status(404).json({
          success: false,
          message: "Page not found"
        });
      }
      res.json({ success: true, data: page });
    } catch (error) {
      console.error("Error fetching WordPress page:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch page from WordPress"
      });
    }
  });

  // Public object storage endpoint for serving video and other assets
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      console.log(`Searching for public object: ${filePath}`);
      console.log(`PUBLIC_OBJECT_SEARCH_PATHS: ${process.env.PUBLIC_OBJECT_SEARCH_PATHS || 'NOT SET'}`);
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        console.log(`File not found in object storage: ${filePath}`);
        return res.status(404).json({ error: "File not found", path: filePath });
      }
      console.log(`Found file, streaming: ${file.name}`);
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return res.status(500).json({ error: "Internal server error", details: errorMessage });
    }
  });

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

  // Get catalog metadata (brands and categories)
  app.get("/api/catalog/meta", async (_req, res) => {
    try {
      res.json({
        brands: getAllBrands(),
        categories: getAllCategories(),
        totalProducts: catalogProducts.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve catalog metadata"
      });
    }
  });

  // Seed catalog products into database
  app.post("/api/seed-catalog", async (_req, res) => {
    try {
      let importedCount = 0;
      let skippedCount = 0;

      for (const productData of catalogProducts) {
        try {
          const existingProduct = await storage.getProductBySlug(productData.slug);
          if (existingProduct) {
            skippedCount++;
            continue;
          }

          await storage.createProduct(productData as any);
          importedCount++;
        } catch (error) {
          console.error('Error importing catalog product:', productData.name, error);
          skippedCount++;
        }
      }

      res.json({
        success: true,
        imported: importedCount,
        skipped: skippedCount,
        total: catalogProducts.length,
        message: `Successfully imported ${importedCount} products, skipped ${skippedCount}`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to seed catalog products"
      });
    }
  });

  // News article routes
  app.get("/api/news", async (_req, res) => {
    try {
      const articles = getAllNewsArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve news articles"
      });
    }
  });

  app.get("/api/news/:slug", async (req, res) => {
    try {
      const article = getNewsArticle(req.params.slug);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve news article"
      });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { equipment, category, brand } = req.query;
      let products;

      if (brand) {
        products = await storage.getProductsByBrand(brand as string);
      } else if (equipment) {
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

  // Patch update product by slug (for partial updates like images)
  app.patch("/api/products/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const updateData = req.body;

      const existingProduct = await storage.getProductBySlug(slug);
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      const updated = await storage.updateProduct(existingProduct.id, updateData);
      res.json(updated);
    } catch (error) {
      console.error("Error patching product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // Enrich a single product by fetching metadata from manufacturer URL
  app.post("/api/products/:slug/enrich", async (req, res) => {
    try {
      const { enrichProduct } = await import("./productScraper");
      const { slug } = req.params;
      
      const product = await storage.getProductBySlug(slug);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      const result = await enrichProduct(product.id);
      res.json(result);
    } catch (error) {
      console.error("Error enriching product:", error);
      res.status(500).json({ error: "Failed to enrich product" });
    }
  });

  // Enrich all products (batch operation)
  app.post("/api/enrich-all-products", async (req, res) => {
    try {
      const { enrichAllProducts } = await import("./productScraper");
      const results = await enrichAllProducts();
      res.json(results);
    } catch (error) {
      console.error("Error enriching all products:", error);
      res.status(500).json({ error: "Failed to enrich products" });
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

  // Sitemap.xml generation
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = "https://vantagesouth.com";
      const now = new Date().toISOString().split('T')[0];
      
      // Static routes
      const staticRoutes = [
        { url: "/", priority: "1.0", changefreq: "weekly" },
        { url: "/products", priority: "0.9", changefreq: "weekly" },
        { url: "/dealers", priority: "0.7", changefreq: "monthly" },
        { url: "/resources", priority: "0.7", changefreq: "weekly" },
        { url: "/farming-guides", priority: "0.7", changefreq: "weekly" },
        { url: "/weather-updates", priority: "0.6", changefreq: "daily" },
        { url: "/schedule-field-demo", priority: "0.8", changefreq: "monthly" },
      ];

      // Territory hubs
      const territoryHubs = [
        "/alabama-precision-agriculture",
        "/mississippi-precision-agriculture",
        "/northwest-florida-precision-agriculture",
        "/central-tennessee-precision-agriculture"
      ];

      // Services
      const services = [
        "/services/precision-ag-consulting",
        "/services/installation-calibration",
        "/services/rtk-gnss-setup",
        "/services/in-season-support",
        "/services/on-farm-training"
      ];

      // Crops
      const crops = [
        "/crops/cotton-precision-ag",
        "/crops/peanut-precision-ag",
        "/crops/corn-precision-ag",
        "/crops/soybean-precision-ag",
        "/crops/row-crops-precision-ag"
      ];

      // Alabama counties and cities
      const alabamaLocations = [
        "/alabama/houston-county/precision-agriculture",
        "/alabama/geneva-county/precision-agriculture",
        "/alabama/henry-county/precision-agriculture",
        "/alabama/coffee-county/precision-agriculture",
        "/alabama/dale-county/precision-agriculture",
        "/alabama/covington-county/precision-agriculture",
        "/alabama/escambia-county/precision-agriculture",
        "/alabama/baldwin-county/precision-agriculture",
        "/alabama/limestone-county/precision-agriculture",
        "/alabama/madison-county/precision-agriculture",
        "/alabama/lauderdale-county/precision-agriculture",
        "/alabama/dothan/precision-agriculture",
        "/alabama/ashford/precision-agriculture",
        "/alabama/rehobeth/precision-agriculture",
        "/alabama/geneva/precision-agriculture",
        "/alabama/hartford/precision-agriculture",
        "/alabama/slocomb/precision-agriculture",
        "/alabama/abbeville/precision-agriculture",
        "/alabama/headland/precision-agriculture",
        "/alabama/enterprise/precision-agriculture",
        "/alabama/elba/precision-agriculture",
        "/alabama/ozark/precision-agriculture",
        "/alabama/andalusia/precision-agriculture",
        "/alabama/atmore/precision-agriculture",
        "/alabama/brewton/precision-agriculture",
        "/alabama/robertsdale/precision-agriculture",
        "/alabama/foley/precision-agriculture",
        "/alabama/fairhope/precision-agriculture",
        "/alabama/athens/precision-agriculture",
        "/alabama/huntsville/precision-agriculture",
        "/alabama/florence/precision-agriculture"
      ];

      // Mississippi counties and cities
      const mississippiLocations = [
        "/mississippi/washington-county/precision-agriculture",
        "/mississippi/bolivar-county/precision-agriculture",
        "/mississippi/sunflower-county/precision-agriculture",
        "/mississippi/leflore-county/precision-agriculture",
        "/mississippi/coahoma-county/precision-agriculture",
        "/mississippi/humphreys-county/precision-agriculture",
        "/mississippi/sharkey-county/precision-agriculture",
        "/mississippi/tunica-county/precision-agriculture",
        "/mississippi/quitman-county/precision-agriculture",
        "/mississippi/issaquena-county/precision-agriculture",
        "/mississippi/greenville/precision-agriculture",
        "/mississippi/cleveland/precision-agriculture",
        "/mississippi/indianola/precision-agriculture",
        "/mississippi/ruleville/precision-agriculture",
        "/mississippi/greenwood/precision-agriculture",
        "/mississippi/clarksdale/precision-agriculture",
        "/mississippi/belzoni/precision-agriculture",
        "/mississippi/rolling-fork/precision-agriculture",
        "/mississippi/tunica/precision-agriculture",
        "/mississippi/marks/precision-agriculture",
        "/mississippi/mayersville/precision-agriculture"
      ];

      // Florida counties and cities
      const floridaLocations = [
        "/florida/jackson-county/precision-agriculture",
        "/florida/calhoun-county/precision-agriculture",
        "/florida/holmes-county/precision-agriculture",
        "/florida/washington-county-fl/precision-agriculture",
        "/florida/marianna/precision-agriculture",
        "/florida/blountstown/precision-agriculture",
        "/florida/bonifay/precision-agriculture",
        "/florida/chipley/precision-agriculture"
      ];

      // Tennessee counties and cities
      const tennesseeLocations = [
        "/tennessee/giles-county/precision-agriculture",
        "/tennessee/lincoln-county/precision-agriculture",
        "/tennessee/bedford-county/precision-agriculture",
        "/tennessee/maury-county/precision-agriculture",
        "/tennessee/coffee-county-tn/precision-agriculture",
        "/tennessee/franklin-county/precision-agriculture",
        "/tennessee/marshall-county/precision-agriculture",
        "/tennessee/pulaski/precision-agriculture",
        "/tennessee/fayetteville/precision-agriculture",
        "/tennessee/shelbyville/precision-agriculture",
        "/tennessee/columbia/precision-agriculture",
        "/tennessee/manchester/precision-agriculture",
        "/tennessee/tullahoma/precision-agriculture",
        "/tennessee/winchester/precision-agriculture",
        "/tennessee/lewisburg/precision-agriculture"
      ];

      // Get products from database
      const products = await storage.getProducts();

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      // Add static routes
      for (const route of staticRoutes) {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}${route.url}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
        xml += `    <priority>${route.priority}</priority>\n`;
        xml += `  </url>\n`;
      }

      // Add territory hubs
      for (const url of territoryHubs) {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}${url}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.9</priority>\n`;
        xml += `  </url>\n`;
      }

      // Add services
      for (const url of services) {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}${url}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }

      // Add crops
      for (const url of crops) {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}${url}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }

      // Add location pages
      const allLocations = [...alabamaLocations, ...mississippiLocations, ...floridaLocations, ...tennesseeLocations];
      for (const url of allLocations) {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}${url}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }

      // Add products
      for (const product of products) {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/product/${product.slug}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.6</priority>\n`;
        xml += `  </url>\n`;
      }

      xml += '</urlset>';

      res.set('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // robots.txt
  app.get("/robots.txt", (req, res) => {
    const baseUrl = "https://vantagesouth.com";
    const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin and API routes
Disallow: /api/
`;
    res.set('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  const httpServer = createServer(app);
  return httpServer;
}