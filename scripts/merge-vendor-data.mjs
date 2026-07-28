// Merges the vendor-research JSON files (produced by research agents) into
// the site's product catalog (functions/_data/products.json) and a separate
// vendor resources/brochure library (functions/_data/vendor-resources.json).
//
// Flagship ("priority": true) vendor products become full catalog entries,
// indistinguishable in shape from the original 82 products, so they get
// real /product/:slug pages, show up in search/brand/category filters, and
// are included in the sitemap. ALL vendor products (priority or not) also
// go into the vendor-resources library grouped by vendor, since that's
// where brochures/spec-sheets live and where a dealer would browse "what
// does this vendor make" rather than search the whole catalog.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "functions", "_data");
const researchDir = path.join(dataDir, "vendor-research");

const productsPath = path.join(dataDir, "products.json");
const existingProducts = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
const existingSlugs = new Set(existingProducts.map((p) => p.slug));

// Normalize a couple of vendor names so brand filtering lines up with what's
// already in products.json (e.g. "Amazone" research output -> "AMAZONE").
const BRAND_NORMALIZE = {
  Amazone: "AMAZONE",
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Short vendor prefixes for de-duplicating slugs across vendors/existing catalog.
const VENDOR_PREFIX = {
  "PTx Trimble": "ptx",
  "Ag Leader": "al",
  "SurePoint Ag": "sp",
  Salford: "sal",
  Amazone: "amz",
  "360 Yield Center": "360",
  XAG: "xag",
  CapstanAg: "cap",
  "Harvest International": "hi",
};

function uniqueSlug(name, vendor) {
  let base = slugify(name);
  if (!base) base = slugify(vendor + "-product");
  let candidate = base;
  if (existingSlugs.has(candidate)) {
    candidate = `${VENDOR_PREFIX[vendor] || slugify(vendor)}-${base}`;
  }
  let i = 2;
  while (existingSlugs.has(candidate)) {
    candidate = `${VENDOR_PREFIX[vendor] || slugify(vendor)}-${base}-${i}`;
    i++;
  }
  existingSlugs.add(candidate);
  return candidate;
}

const now = new Date().toISOString();

const vendorFiles = fs
  .readdirSync(researchDir)
  .filter((f) => f.endsWith(".json"));

const newCatalogEntries = [];
const vendorGroups = {}; // vendor -> { vendor, products: [...] }

for (const file of vendorFiles) {
  const items = JSON.parse(fs.readFileSync(path.join(researchDir, file), "utf-8"));
  for (const item of items) {
    const brand = BRAND_NORMALIZE[item.vendor] || item.vendor;
    const slug = uniqueSlug(item.name, item.vendor);
    const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
    const specs = Array.isArray(item.specs) ? item.specs.filter(Boolean) : [];
    const brochures = Array.isArray(item.brochures) ? item.brochures.filter(Boolean) : [];

    const catalogEntry = {
      id: crypto.randomUUID(),
      name: item.name,
      brand,
      equipment: item.equipment || item.category || "Hardware",
      category: item.category || item.equipment || "Other",
      tagline: item.tagline || item.description?.slice(0, 140) || item.name,
      shortDescription: item.description ? item.description.slice(0, 300) : null,
      oemUrl: item.sourceUrl || null,
      highlights: specs.slice(0, 4),
      keyFeatures: specs.length ? specs : null,
      specs: specs.length ? specs : null,
      worksWith: [],
      slug,
      logoBlack: null,
      logoDarkGreen: null,
      logoWhite: null,
      primaryImage: images[0] || null,
      images,
      createdAt: now,
      updatedAt: now,
      enrichedDescription: item.description || null,
      detailedFeatures: null,
      benefits: null,
      researchFindings: null,
      compatibilityDetails: null,
      contentEnriched: null,
      lastContentUpdate: now,
      brochures,
      isVendorSweep: true,
      vendorPriority: !!item.priority,
    };

    // Only flagship/priority products become full catalog product pages.
    if (item.priority) {
      newCatalogEntries.push(catalogEntry);
    }

    if (!vendorGroups[brand]) {
      vendorGroups[brand] = { vendor: brand, products: [] };
    }
    vendorGroups[brand].products.push({
      name: item.name,
      model: item.model || null,
      category: item.category || null,
      equipment: item.equipment || null,
      sourceUrl: item.sourceUrl || null,
      tagline: item.tagline || null,
      description: item.description || null,
      specs,
      images,
      brochures,
      priority: !!item.priority,
      catalogSlug: item.priority ? slug : null,
    });
  }
}

const mergedProducts = [...existingProducts, ...newCatalogEntries];
fs.writeFileSync(productsPath, JSON.stringify(mergedProducts, null, 2));

const vendorResources = Object.values(vendorGroups)
  .map((g) => ({
    vendor: g.vendor,
    slug: slugify(g.vendor),
    productCount: g.products.length,
    brochureCount: g.products.reduce((n, p) => n + p.brochures.length, 0),
    products: g.products,
  }))
  .sort((a, b) => a.vendor.localeCompare(b.vendor));

fs.writeFileSync(
  path.join(dataDir, "vendor-resources.json"),
  JSON.stringify(vendorResources, null, 2)
);

// Regenerate catalog meta from the merged product list (brands/categories/count).
const brands = [...new Set(mergedProducts.map((p) => p.brand))].sort();
const categories = [...new Set(mergedProducts.map((p) => p.category))].sort();
const catalogMeta = { brands, categories, totalProducts: mergedProducts.length };
fs.writeFileSync(
  path.join(dataDir, "catalog-meta.json"),
  JSON.stringify(catalogMeta, null, 2)
);

console.log(`Existing products: ${existingProducts.length}`);
console.log(`New flagship catalog entries added: ${newCatalogEntries.length}`);
console.log(`Merged total products: ${mergedProducts.length}`);
console.log(`Vendor resource groups: ${vendorResources.length}`);
console.log(
  `Total vendor-swept products (priority + non-priority) across all vendors: ${vendorResources.reduce(
    (n, g) => n + g.productCount,
    0
  )}`
);
console.log(`Brands: ${brands.join(", ")}`);
