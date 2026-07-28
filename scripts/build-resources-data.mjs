// Transforms the archived Precision Planting resource content
// (scripts source: scratchpad/archive/all-resources.json, real body text +
// metadata pulled directly from precisionplanting.com's CMS payload) into
// functions/_data/resources.json, matching related products against the
// site's existing product catalog by name.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "functions", "_data");

const archivePath = process.argv[2];
if (!archivePath) {
  console.error("Usage: node build-resources-data.mjs <path-to-all-resources.json>");
  process.exit(1);
}

const rawResources = JSON.parse(fs.readFileSync(archivePath, "utf-8"));
const products = JSON.parse(fs.readFileSync(path.join(dataDir, "products.json"), "utf-8"));

const CATEGORY_LABELS = {
  research: "Research",
  article: "Article",
  guide: "Guide",
  "farmer-story": "Farmer Story",
};

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sanitizeHtml(html) {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<object[^>]*application\/kenticocloud[\s\S]*?<\/object>\n?/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/href="javascript:[^"]*"/gi, 'href="#"')
    // Kontent.ai internal content-item links have empty href (resolved separately) -- unwrap them
    .replace(/<a\s+[^>]*href=""[^>]*>(.*?)<\/a>/gis, "$1")
    // Precision Planting internal links won't resolve on our domain; open externally instead
    .replace(/href="\//gi, 'target="_blank" rel="noopener noreferrer" href="https://www.precisionplanting.com/')
    .trim();
}

function keyPointsToList(text) {
  if (!text) return [];
  return text
    .split("\n")
    .map((l) => l.trim().replace(/^-\s*/, "").trim())
    .filter((l) => Boolean(l) && !/^key points?:?$/i.test(l));
}

// Build a lookup of product name (lowercased) -> slug for matching.
const productByName = new Map();
for (const p of products) {
  productByName.set(p.name.toLowerCase(), p.slug);
}

function matchRelatedProducts(relatedProductsRaw) {
  if (!Array.isArray(relatedProductsRaw)) return [];
  const slugs = new Set();
  for (const item of relatedProductsRaw) {
    const name = item?.elements?.Name?.value;
    if (!name) continue;
    const direct = productByName.get(name.toLowerCase());
    if (direct) {
      slugs.add(direct);
      continue;
    }
    // fallback: loose match (e.g. "vSet" vs "vSet2")
    const loose = products.find(
      (p) =>
        p.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(p.name.toLowerCase())
    );
    if (loose) slugs.add(loose.slug);
  }
  return [...slugs];
}

const existingSlugs = new Set();
function uniqueSlug(base) {
  let candidate = base;
  let i = 2;
  while (existingSlugs.has(candidate)) {
    candidate = `${base}-${i}`;
    i++;
  }
  existingSlugs.add(candidate);
  return candidate;
}

const resources = rawResources.map((r) => {
  const baseSlug = r.path.split("/").filter(Boolean).pop();
  const slug = uniqueSlug(slugify(baseSlug || r.title));
  return {
    id: slug,
    slug,
    category: r.category,
    categoryLabel: CATEGORY_LABELS[r.category] || r.category,
    title: r.title,
    description: r.description,
    keyPoints: keyPointsToList(r.keyPointsText),
    bodyHtml: sanitizeHtml(r.bodyHtml),
    tags: [
      ...(r.tagsCrops || []),
      ...(r.tagsEquipmentTypes || []),
      ...(r.tagsProductUse || []),
    ].filter((v, i, a) => a.indexOf(v) === i),
    relatedProductSlugs: matchRelatedProducts(r.relatedProductsRaw),
    featuredImage: r.featuredImage,
    sourceUrl: r.url,
    seoKeywords: r.seoKeywords,
  };
});

fs.writeFileSync(
  path.join(dataDir, "resources.json"),
  JSON.stringify(resources, null, 2)
);

const withProducts = resources.filter((r) => r.relatedProductSlugs.length > 0);
const byCategory = {};
for (const r of resources) byCategory[r.category] = (byCategory[r.category] || 0) + 1;

console.log(`Wrote ${resources.length} resources to functions/_data/resources.json`);
console.log(`By category:`, byCategory);
console.log(`With at least 1 matched related product: ${withProducts.length}/${resources.length}`);
