// Downloads every vendor product image referenced in the vendor-research
// sweep and self-hosts it under client/public/assets/vendor-images/<vendor>/,
// with SEO-friendly filenames (vendor-product-name-N.ext instead of opaque
// CDN hashes). Then rewrites functions/_data/products.json (the merged
// catalog) and functions/_data/vendor-resources.json (the resource library)
// to point at the local paths instead of hotlinking the vendor's CDN.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const researchDir = path.join(root, "functions", "_data", "vendor-research");
const outRoot = path.join(root, "client", "public", "assets", "vendor-images");
const dataDir = path.join(root, "functions", "_data");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function slugify(str) {
  return String(str)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function extFromUrlOrType(url, contentType) {
  try {
    const u = new URL(url);
    const base = u.pathname.split("/").pop() || "";
    const m = base.match(/\.(jpe?g|png|webp|gif|svg|avif)$/i);
    if (m) return m[1].toLowerCase().replace("jpeg", "jpg");
  } catch {}
  if (contentType) {
    if (contentType.includes("jpeg")) return "jpg";
    if (contentType.includes("png")) return "png";
    if (contentType.includes("webp")) return "webp";
    if (contentType.includes("gif")) return "gif";
    if (contentType.includes("svg")) return "svg";
    if (contentType.includes("avif")) return "avif";
  }
  return "jpg";
}

// Simple concurrency-limited pool.
async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let idx = 0;
  async function run() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: limit }, run));
  return results;
}

async function downloadOne(url, destPathNoExt, attempt = 1) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "image/*,*/*;q=0.8" },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") || "";
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 200) throw new Error("suspiciously small response");
    const ext = extFromUrlOrType(url, contentType);
    const destPath = `${destPathNoExt}.${ext}`;
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, buf);
    return { ok: true, destPath, bytes: buf.length, ext };
  } catch (err) {
    if (attempt < 2) return downloadOne(url, destPathNoExt, attempt + 1);
    return { ok: false, error: String(err.message || err) };
  }
}

async function main() {
  const files = fs.readdirSync(researchDir).filter((f) => f.endsWith(".json"));

  // Collect unique (url -> planned local web path) jobs, using per-product
  // sequential numbering for SEO filenames, first-seen-wins on duplicate URLs.
  const jobs = []; // { url, vendorSlug, destPathNoExt, webPathNoExt }
  const seenUrls = new Map(); // url -> webPath (once known, after download)
  const plannedForUrl = new Map(); // url -> { destPathNoExt, vendorSlug }

  for (const file of files) {
    const items = JSON.parse(fs.readFileSync(path.join(researchDir, file), "utf-8"));
    for (const item of items) {
      const vendorSlug = slugify(item.vendor);
      const productSlug = slugify(item.name);
      const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
      let n = 0;
      for (const url of images) {
        if (plannedForUrl.has(url)) continue; // dedupe identical URLs across products
        n++;
        const filenameBase = `${vendorSlug}-${productSlug}-${n}`;
        const destPathNoExt = path.join(outRoot, vendorSlug, filenameBase);
        plannedForUrl.set(url, { destPathNoExt, vendorSlug, filenameBase });
      }
    }
  }

  const uniqueUrls = [...plannedForUrl.keys()];
  console.log(`Unique images to download: ${uniqueUrls.length}`);

  let okCount = 0;
  let failCount = 0;
  let totalBytes = 0;
  const failures = [];
  const urlToWebPath = new Map();

  await pool(uniqueUrls, 12, async (url) => {
    const plan = plannedForUrl.get(url);
    // Idempotent: skip if we already have any file for this planned base
    // name (handles re-runs after optimize-vendor-images.mjs renamed extensions).
    const dir = path.dirname(plan.destPathNoExt);
    const base = path.basename(plan.destPathNoExt);
    if (fs.existsSync(dir)) {
      const existing = fs.readdirSync(dir).find((f) => f.startsWith(base + "."));
      if (existing) {
        okCount++;
        const rel = path.relative(path.join(root, "client", "public"), path.join(dir, existing));
        urlToWebPath.set(url, "/" + rel.split(path.sep).join("/"));
        return;
      }
    }
    const result = await downloadOne(url, plan.destPathNoExt);
    if (result.ok) {
      okCount++;
      totalBytes += result.bytes;
      const rel = path.relative(path.join(root, "client", "public"), result.destPath);
      const webPath = "/" + rel.split(path.sep).join("/");
      urlToWebPath.set(url, webPath);
    } else {
      failCount++;
      failures.push({ url, error: result.error, vendor: plan.vendorSlug });
    }
  });

  console.log(`Downloaded: ${okCount} ok, ${failCount} failed, ${(totalBytes / 1024 / 1024).toFixed(1)} MB total`);
  if (failures.length) {
    console.log("Failures:");
    for (const f of failures.slice(0, 50)) console.log(`  [${f.vendor}] ${f.url} -> ${f.error}`);
    if (failures.length > 50) console.log(`  ...and ${failures.length - 50} more`);
  }

  fs.writeFileSync(
    path.join(dataDir, "vendor-image-download-report.json"),
    JSON.stringify({ okCount, failCount, totalBytes, failures }, null, 2)
  );

  // Rewrite products.json (vendor-swept flagship entries) and
  // vendor-resources.json (full library) to use local paths where we have
  // them; leave the original hotlinked URL in place for anything that
  // failed to download so nothing breaks.
  const productsPath = path.join(dataDir, "products.json");
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
  let productsRewritten = 0;
  for (const p of products) {
    if (!p.isVendorSweep) continue;
    let changed = false;
    if (Array.isArray(p.images)) {
      p.images = p.images.map((u) => {
        if (urlToWebPath.has(u)) {
          changed = true;
          return urlToWebPath.get(u);
        }
        return u;
      });
    }
    if (p.primaryImage && urlToWebPath.has(p.primaryImage)) {
      p.primaryImage = urlToWebPath.get(p.primaryImage);
      changed = true;
    } else if (p.primaryImage && p.images && p.images.length) {
      // primaryImage might not have matched exactly if it came from a
      // different field ordering; fall back to the (possibly rewritten) first image.
    }
    if (changed) productsRewritten++;
  }
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

  const vendorResourcesPath = path.join(dataDir, "vendor-resources.json");
  const vendorResources = JSON.parse(fs.readFileSync(vendorResourcesPath, "utf-8"));
  let vendorProductsRewritten = 0;
  for (const group of vendorResources) {
    for (const p of group.products) {
      if (!Array.isArray(p.images)) continue;
      let changed = false;
      p.images = p.images.map((u) => {
        if (urlToWebPath.has(u)) {
          changed = true;
          return urlToWebPath.get(u);
        }
        return u;
      });
      if (changed) vendorProductsRewritten++;
    }
  }
  fs.writeFileSync(vendorResourcesPath, JSON.stringify(vendorResources, null, 2));

  console.log(`Rewrote image URLs in ${productsRewritten} catalog products and ${vendorProductsRewritten} vendor-resource products.`);
}

main();
