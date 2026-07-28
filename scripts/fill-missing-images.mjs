// Downloads and self-hosts images for the catalog products that were
// missing images entirely (12 pre-existing Precision Planting products +
// XAG P150 Max), using the same SEO-filename + local-hosting convention as
// the vendor image sweep. Source list:
// functions/_data/vendor-research/precision-planting-missing-images.json
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "functions", "_data");
const outRoot = path.join(root, "client", "public", "assets", "vendor-images");

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
    const m = base.match(/\.(jpe?g|png|webp|gif|avif)$/i);
    if (m) return m[1].toLowerCase().replace("jpeg", "jpg");
  } catch {}
  if (contentType) {
    if (contentType.includes("jpeg")) return "jpg";
    if (contentType.includes("png")) return "png";
    if (contentType.includes("webp")) return "webp";
    if (contentType.includes("gif")) return "gif";
  }
  return "jpg";
}

async function downloadOne(url, destPathNoExt) {
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
    return { ok: true, destPath, bytes: buf.length };
  } catch (err) {
    return { ok: false, error: String(err.message || err) };
  }
}

async function main() {
  const entries = JSON.parse(
    fs.readFileSync(path.join(dataDir, "vendor-research", "precision-planting-missing-images.json"), "utf-8")
  );

  const productsPath = path.join(dataDir, "products.json");
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  let okCount = 0;
  let failCount = 0;

  for (const entry of entries) {
    const product = bySlug.get(entry.slug);
    if (!product) {
      console.log(`No catalog product found for slug ${entry.slug}, skipping`);
      continue;
    }
    const vendorSlug = slugify(entry.vendor || product.brand || "precision-planting");
    const productSlug = slugify(entry.name || product.name);
    const localImages = [];
    let n = 0;
    for (const url of entry.images) {
      n++;
      const destPathNoExt = path.join(outRoot, vendorSlug, `${vendorSlug}-${productSlug}-${n}`);
      const result = await downloadOne(url, destPathNoExt);
      if (result.ok) {
        okCount++;
        const rel = path.relative(path.join(root, "client", "public"), result.destPath);
        localImages.push("/" + rel.split(path.sep).join("/"));
      } else {
        failCount++;
        console.log(`  FAILED [${entry.slug}] ${url} -> ${result.error}`);
      }
    }
    if (localImages.length) {
      product.images = localImages;
      product.primaryImage = localImages[0];
      console.log(`${entry.slug}: ${localImages.length} images added`);
    } else {
      console.log(`${entry.slug}: no images downloaded successfully`);
    }
  }

  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  console.log(`\nDownloaded: ${okCount} ok, ${failCount} failed`);
}

main();
