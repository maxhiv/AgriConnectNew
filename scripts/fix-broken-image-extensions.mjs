// Fixes image references in products.json / vendor-resources.json where the
// JSON points to the wrong file extension (e.g. "...-1.jpg" in the data but
// the actual downloaded file on disk is "...-1.webp"). These 404 silently in
// the browser, which reads as "no image" even though the data isn't null.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicRoot = path.join(root, "client", "public");
const EXTS = [".webp", ".jpg", ".jpeg", ".png", ".svg", ".gif"];

function resolveFixedUrl(u) {
  if (typeof u !== "string" || !u.startsWith("/assets/")) return u;
  if (fs.existsSync(path.join(publicRoot, u))) return u;
  const ext = path.extname(u);
  const base = u.slice(0, -ext.length);
  for (const e of EXTS) {
    if (e === ext) continue;
    if (fs.existsSync(path.join(publicRoot, base + e))) return base + e;
  }
  return u; // genuinely missing, leave as-is (handled separately)
}

function fixProduct(p) {
  let changed = false;
  if (p.primaryImage) {
    const fixed = resolveFixedUrl(p.primaryImage);
    if (fixed !== p.primaryImage) {
      p.primaryImage = fixed;
      changed = true;
    }
  }
  if (Array.isArray(p.images)) {
    const fixedImages = p.images.map(resolveFixedUrl);
    if (JSON.stringify(fixedImages) !== JSON.stringify(p.images)) {
      p.images = fixedImages;
      changed = true;
    }
  }
  return changed;
}

const productsPath = path.join(root, "functions", "_data", "products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
let productsFixed = 0;
for (const p of products) if (fixProduct(p)) productsFixed++;
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
console.log(`products.json: ${productsFixed} products with extension fixes`);

const vendorResourcesPath = path.join(root, "functions", "_data", "vendor-resources.json");
const vendorResources = JSON.parse(fs.readFileSync(vendorResourcesPath, "utf-8"));
let vrFixed = 0;
for (const group of vendorResources) {
  for (const p of group.products) if (fixProduct(p)) vrFixed++;
}
fs.writeFileSync(vendorResourcesPath, JSON.stringify(vendorResources, null, 2));
console.log(`vendor-resources.json: ${vrFixed} products with extension fixes`);

const resourcesPath = path.join(root, "functions", "_data", "resources.json");
const resources = JSON.parse(fs.readFileSync(resourcesPath, "utf-8"));
let resFixed = 0;
for (const r of resources) {
  let changed = false;
  if (r.featuredImage) {
    const fixed = resolveFixedUrl(r.featuredImage);
    if (fixed !== r.featuredImage) {
      r.featuredImage = fixed;
      changed = true;
    }
  }
  if (Array.isArray(r.images)) {
    const fixedImages = r.images.map(resolveFixedUrl);
    if (JSON.stringify(fixedImages) !== JSON.stringify(r.images)) {
      r.images = fixedImages;
      changed = true;
    }
  }
  if (changed) resFixed++;
}
fs.writeFileSync(resourcesPath, JSON.stringify(resources, null, 2));
console.log(`resources.json: ${resFixed} resources with extension fixes`);
