// Resizes selected Ag Leader Canto assets (downloaded to the local archive
// folder) to web-friendly JPEGs, uploads them to the public vantage-south-media
// R2 bucket, and adds the 10 Ag Leader products that had zero catalog presence
// (and therefore zero images) as new products.json entries.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";
import sharp from "sharp";

const SRC_DIR = "C:\\Users\\hanse\\AppData\\Local\\Temp\\claude\\C--Users-hanse-OneDrive-Desktop\\b6a72788-6386-4bb0-a520-4e5130f40498\\scratchpad\\agleader-assets";
const OUT_DIR = "C:\\Users\\hanse\\AppData\\Local\\Temp\\claude\\C--Users-hanse-OneDrive-Desktop\\b6a72788-6386-4bb0-a520-4e5130f40498\\scratchpad\\agleader-web";
const PUBLIC_BASE = "https://pub-a0f4340d0f0e4281b36892845a9483d2.r2.dev/images/ag-leader/";
const dataDir = "C:\\Users\\hanse\\OneDrive\\Desktop\\AgriConnectNew\\functions\\_data";

fs.mkdirSync(OUT_DIR, { recursive: true });

function slugify(str) {
  return str.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const products = JSON.parse(fs.readFileSync(path.join(dataDir, "products.json"), "utf-8"));
const existingSlugs = new Set(products.map((p) => p.slug));
function uniqueSlug(base) {
  let candidate = base, i = 2;
  while (existingSlugs.has(candidate)) { candidate = `${base}-${i}`; i++; }
  existingSlugs.add(candidate);
  return candidate;
}

// name -> { equipment, category, tagline, description, files: [source filenames] (first = primary) }
const NEW_PRODUCTS = {
  CartACE: {
    equipment: "Combines",
    category: "CartACE",
    tagline: "Grain cart automation and weighing system",
    description: "CartACE automates grain cart weighing and unloading, syncing with Ag Leader yield monitors to give accurate, real-time load data during harvest.",
    files: ["Ag Leader - Cart Ace - 11-2-23-16.jpg", "Ag Leader - Cart Ace - 11-2-23-26.jpg", "Ag Leader - Cart Ace - 11-2-23-27.jpg", "Ag Leader - Cart Ace - 11-2-23-4.jpg"],
  },
  "Yield Monitor": {
    equipment: "Combines",
    category: "Yield Monitoring",
    tagline: "Accurate, real-time yield data collection",
    description: "Ag Leader's Yield Monitor system delivers accurate, real-time grain flow and yield data during harvest, displayed through InCommand Go displays with satellite imagery and multi-map views.",
    files: ["Harvest - Corn Yield TDV Satellite Imagery [IC Go 16v2.0].png", "Harvest - Corn Yield Monitoring w_ Reference Layer [IC Go 16v2.0].png", "Harvest - Corn Yield - Z-Row - Curve - CartACE [IC Go 16v2.0].png", "Harvest - Multiple Maps - Live Stats TDV + Yield [IC Go 16v2.0].png"],
  },
  "Z-Row": {
    equipment: "Combines",
    category: "Yield Monitoring",
    tagline: "Row-specific yield data for planter performance insight",
    description: "Z-Row captures row-by-row yield data during harvest, letting growers tie yield outcomes back to specific planter rows and hybrids for precise performance analysis.",
    files: ["Z-Row Logo_RGB_Ag Leader Blue.png", "Harvest - Corn Yield - Z-Row - Curve - CartACE [IC Go 16v2.0].png", "Harvest - Corn Yield - Z-Row - Multiple Maps - Satellite Imagery [IC Go 16v2.0].png"],
  },
  AgFiniti: {
    equipment: "Data Management",
    category: "Data Management",
    tagline: "Cloud-based farm data management and connectivity",
    description: "AgFiniti connects Ag Leader displays to the cloud, giving growers and dealers real-time access to field data, live equipment stats, and agronomic records from any phone, tablet, or computer.",
    files: ["High Res AgFiniti-logo.png", "General - 3rd Party Connections [AgF 2025].png", "Harvest - Corn - CartACE Live Stats - iPad [AgF 2025].png", "Planting - Corn Hybrids - iPhone [AgF 2024].png"],
  },
  SMS: {
    equipment: "Data Management",
    category: "Data Management",
    tagline: "Desktop farm data management software",
    description: "SMS (Strategic Farming System) is Ag Leader's desktop software for managing, analyzing, and mapping farm data — from yield and application maps to terrain analysis.",
    files: ["SMS Desktop_1.jpg", "SMS Terrain Analysis LowRes.png", "SMS w blur.png", "Low Res SMS.png"],
  },
  DualTrac: {
    equipment: "Machine Guidance",
    category: "Steering Systems",
    tagline: "Dual-tractor guided steering system",
    description: "DualTrac links two tractors together for synchronized, guided steering — one leading, one following — ideal for grain cart and implement pairing operations.",
    files: ["DualTrac_installed1.jpg", "Low Res DualTrac.png", "DualTrac Logo_RGB_Ag Leader Blue.png"],
  },
  "GPS 7000": {
    equipment: "Machine Guidance",
    category: "GNSS Receivers",
    tagline: "Entry-level GNSS guidance receiver",
    description: "The GPS 7000 is Ag Leader's entry-level GNSS receiver, delivering reliable sub-inch guidance accuracy for planting, spraying, and tillage operations.",
    files: ["GPS 7000.png", "Low Res GPS7000.png"],
  },
  "GPS 7500": {
    equipment: "Machine Guidance",
    category: "GNSS Receivers",
    tagline: "High-accuracy GNSS guidance receiver",
    description: "The GPS 7500 is Ag Leader's flagship GNSS receiver, offering the highest accuracy guidance signal options for the most demanding precision ag applications, including base station correction.",
    files: ["GPS7500_1.jpg", "GPS7500_2.jpg", "High Res GPS 7500_base_station.png", "Low Res GPS7500 web.png"],
  },
  Intellislope: {
    equipment: "Tile Plow",
    category: "Water Management",
    tagline: "Subsurface drainage design and installation guidance",
    description: "Intellislope plans, surveys, and guides subsurface tile drainage installation, helping growers design efficient water management systems directly from field elevation data.",
    files: ["Intellislope_Plan.png", "Intellislope_Survey.png", "Water Management - Intellislope [IC Go 16v2.0].png", "Intellislope Logo_RGB_Ag Leader Blue.png"],
  },
  "Granular Application": {
    equipment: "Applicator",
    category: "Application Control",
    tagline: "Granular product application rate control",
    description: "Ag Leader's granular application control automatically manages spreader rate and section control for dry fertilizer and seed products, displayed through InCommand Go displays.",
    files: ["Granular Spreader_ Application 1.jpg", "Granular Spreader_ Application 2.jpg", "Granular Spreader_Application 3.jpg", "Application - Granular [IC Go 10v2.0].png"],
  },
};

async function processImage(filename) {
  const srcPath = path.join(SRC_DIR, filename);
  if (!fs.existsSync(srcPath)) {
    console.warn(`  MISSING: ${filename}`);
    return null;
  }
  const outName = slugify(path.parse(filename).name) + ".jpg";
  const outPath = path.join(OUT_DIR, outName);
  await sharp(srcPath)
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 82 })
    .toFile(outPath);
  return { outName, outPath };
}

const now = new Date().toISOString();
const newEntries = [];

for (const [name, cfg] of Object.entries(NEW_PRODUCTS)) {
  console.log(`Processing ${name}...`);
  const images = [];
  for (const file of cfg.files) {
    const result = await processImage(file);
    if (result) {
      execSync(`npx wrangler r2 object put "vantage-south-media/images/ag-leader/${result.outName}" --file="${result.outPath}" --content-type=image/jpeg --remote`, {
        cwd: "C:\\Users\\hanse\\OneDrive\\Desktop\\AgriConnectNew",
        stdio: "pipe",
      });
      images.push(PUBLIC_BASE + result.outName);
      console.log(`  uploaded ${result.outName}`);
    }
  }
  if (images.length === 0) {
    console.warn(`  SKIPPED ${name}: no images found`);
    continue;
  }
  const slug = uniqueSlug(slugify(name));
  newEntries.push({
    id: crypto.randomUUID(),
    name,
    brand: "Ag Leader",
    equipment: cfg.equipment,
    category: cfg.category,
    tagline: cfg.tagline,
    shortDescription: cfg.description,
    oemUrl: "https://www.agleader.com/",
    highlights: [],
    keyFeatures: null,
    specs: null,
    worksWith: [],
    slug,
    logoBlack: null,
    logoDarkGreen: null,
    logoWhite: null,
    primaryImage: images[0],
    images,
    createdAt: now,
    updatedAt: now,
    enrichedDescription: cfg.description,
    detailedFeatures: null,
    benefits: null,
    researchFindings: null,
    compatibilityDetails: null,
    contentEnriched: true,
    lastContentUpdate: now,
  });
}

const merged = [...products, ...newEntries];
fs.writeFileSync(path.join(dataDir, "products.json"), JSON.stringify(merged, null, 2));

const brands = [...new Set(merged.map((p) => p.brand))].sort();
const categories = [...new Set(merged.map((p) => p.category))].sort();
fs.writeFileSync(path.join(dataDir, "catalog-meta.json"), JSON.stringify({ brands, categories, totalProducts: merged.length }, null, 2));

console.log(`\nAdded ${newEntries.length} products. Total catalog: ${merged.length}`);
newEntries.forEach((p) => console.log(`- ${p.name} (${p.slug}): ${p.images.length} images`));
