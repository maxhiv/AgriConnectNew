// Finds every remaining externally-hotlinked image referenced directly in
// products.json / resources.json (regardless of whether it traces back to a
// vendor-research file), downloads it, optimizes it, and self-hosts it under
// client/public/assets/vendor-images/<brand>/, rewriting the JSON in place.
// Skips non-image embeds (e.g. Wistia video players).
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "functions", "_data");
const outRoot = path.join(root, "client", "public", "assets", "vendor-images");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const SKIP_HOSTS = new Set(["embed-ssl.wistia.com", "www.facebook.com"]);

function slugify(str) {
  return String(str).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function isExternal(url) {
  if (typeof url !== "string") return false;
  if (!/^https?:\/\//i.test(url)) return false;
  try {
    const h = new URL(url).host;
    if (SKIP_HOSTS.has(h)) return false;
    if (h.endsWith("r2.dev") || h === "vantage-south.com") return false;
    return true;
  } catch {
    return false;
  }
}

async function pool(items, limit, worker) {
  let idx = 0;
  async function run() {
    while (idx < items.length) {
      const i = idx++;
      await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: limit }, run));
}

async function downloadAndOptimize(url, destPathNoExt, attempt = 1) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "image/*,*/*;q=0.8" }, redirect: "follow", signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 200) throw new Error("suspiciously small response");
    fs.mkdirSync(path.dirname(destPathNoExt), { recursive: true });

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("svg") || url.toLowerCase().endsWith(".svg")) {
      const destPath = `${destPathNoExt}.svg`;
      fs.writeFileSync(destPath, buf);
      return { ok: true, destPath };
    }
    const destPath = `${destPathNoExt}.jpg`;
    await sharp(buf).resize(1600, 1600, { fit: "inside", withoutEnlargement: true }).flatten({ background: "#ffffff" }).jpeg({ quality: 82 }).toFile(destPath);
    return { ok: true, destPath };
  } catch (err) {
    if (attempt < 2) return downloadAndOptimize(url, destPathNoExt, attempt + 1);
    return { ok: false, error: String(err.message || err) };
  }
}

async function main() {
  const productsPath = path.join(dataDir, "products.json");
  const resourcesPath = path.join(dataDir, "resources.json");
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
  const resources = JSON.parse(fs.readFileSync(resourcesPath, "utf-8"));

  // Plan jobs: url -> { destPathNoExt }
  const plannedForUrl = new Map();
  const counters = new Map(); // vendorSlug -> n

  function planFor(url, vendorLabel) {
    if (plannedForUrl.has(url)) return;
    const vendorSlug = slugify(vendorLabel || "misc");
    const n = (counters.get(vendorSlug) || 0) + 1;
    counters.set(vendorSlug, n);
    const destPathNoExt = path.join(outRoot, vendorSlug, `${vendorSlug}-extra-${n}`);
    plannedForUrl.set(url, destPathNoExt);
  }

  for (const p of products) {
    const imgs = [p.primaryImage, ...(p.images || [])].filter(Boolean);
    for (const u of imgs) if (isExternal(u)) planFor(u, p.brand);
  }
  for (const r of resources) {
    const imgs = [r.featuredImage, ...(r.images || [])].filter(Boolean);
    for (const u of imgs) if (isExternal(u)) planFor(u, "resources");
  }

  const uniqueUrls = [...plannedForUrl.keys()];
  console.log(`Unique external images to self-host: ${uniqueUrls.length}`);

  const urlToWebPath = new Map();
  let okCount = 0, failCount = 0;
  const failures = [];

  await pool(uniqueUrls, 10, async (url) => {
    const destPathNoExt = plannedForUrl.get(url);
    const dir = path.dirname(destPathNoExt);
    const base = path.basename(destPathNoExt);
    if (fs.existsSync(dir)) {
      const existing = fs.readdirSync(dir).find((f) => f.startsWith(base + "."));
      if (existing) {
        okCount++;
        const rel = path.relative(path.join(root, "client", "public"), path.join(dir, existing));
        urlToWebPath.set(url, "/" + rel.split(path.sep).join("/"));
        return;
      }
    }
    const result = await downloadAndOptimize(url, destPathNoExt);
    if (result.ok) {
      okCount++;
      const rel = path.relative(path.join(root, "client", "public"), result.destPath);
      urlToWebPath.set(url, "/" + rel.split(path.sep).join("/"));
    } else {
      failCount++;
      failures.push({ url, error: result.error });
    }
  });

  console.log(`Downloaded: ${okCount} ok, ${failCount} failed`);
  failures.forEach((f) => console.log(`  FAIL: ${f.url} -> ${f.error}`));

  let productsRewritten = 0;
  for (const p of products) {
    let changed = false;
    if (Array.isArray(p.images)) {
      p.images = p.images.map((u) => (urlToWebPath.has(u) ? ((changed = true), urlToWebPath.get(u)) : u));
    }
    if (p.primaryImage && urlToWebPath.has(p.primaryImage)) {
      p.primaryImage = urlToWebPath.get(p.primaryImage);
      changed = true;
    }
    if (changed) productsRewritten++;
  }
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

  let resourcesRewritten = 0;
  for (const r of resources) {
    let changed = false;
    if (Array.isArray(r.images)) {
      r.images = r.images.map((u) => (urlToWebPath.has(u) ? ((changed = true), urlToWebPath.get(u)) : u));
    }
    if (r.featuredImage && urlToWebPath.has(r.featuredImage)) {
      r.featuredImage = urlToWebPath.get(r.featuredImage);
      changed = true;
    }
    if (changed) resourcesRewritten++;
  }
  fs.writeFileSync(resourcesPath, JSON.stringify(resources, null, 2));

  console.log(`Rewrote ${productsRewritten} products, ${resourcesRewritten} resources.`);
}

main();
