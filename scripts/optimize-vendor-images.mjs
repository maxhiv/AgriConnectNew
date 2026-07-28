// Resizes/recompresses every downloaded vendor image in place (max 1600px
// on the long edge, stripped metadata, sensible quality). Images with real
// alpha transparency stay PNG/WEBP; everything else converts to JPEG for
// much better compression. Extension can change (png -> jpg), so this
// produces a rename map that's applied to functions/_data/products.json and
// functions/_data/vendor-resources.json afterward.
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const imagesRoot = path.join(root, "client", "public", "assets", "vendor-images");
const dataDir = path.join(root, "functions", "_data");
const MAX_DIM = 1600;

function walk(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}

function hasAlpha(file) {
  try {
    const res = execFileSync("identify", ["-format", "%A", file], { encoding: "utf-8" });
    return res.trim() === "True" || res.trim() === "Blend";
  } catch {
    return false;
  }
}

function dims(file) {
  try {
    const res = execFileSync("identify", ["-format", "%w %h", file], { encoding: "utf-8" });
    const [w, h] = res.trim().split(" ").map(Number);
    return { w, h };
  } catch {
    return null;
  }
}

const files = walk(imagesRoot).filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f));
console.log(`Processing ${files.length} images...`);

let beforeTotal = 0;
let afterTotal = 0;
let convertedToJpg = 0;
let resized = 0;
let errors = 0;
const renameMap = new Map(); // old web path -> new web path

for (const file of files) {
  const relFromPublic = path.relative(path.join(root, "client", "public"), file);
  const oldWebPath = "/" + relFromPublic.split(path.sep).join("/");
  const before = fs.statSync(file).size;
  beforeTotal += before;

  if (/\.gif$/i.test(file)) {
    afterTotal += before; // leave animated/simple gifs untouched
    continue;
  }

  try {
    const d = dims(file);
    const needsResize = d && (d.w > MAX_DIM || d.h > MAX_DIM);
    const alpha = /\.png$/i.test(file) || /\.webp$/i.test(file) ? hasAlpha(file) : false;
    const ext = path.extname(file).toLowerCase();

    let targetFile = file;
    let newExt = ext;

    if (!alpha && ext !== ".jpg" && ext !== ".jpeg") {
      // No transparency needed -> convert to JPEG for much better compression.
      newExt = ".jpg";
      targetFile = file.slice(0, -ext.length) + ".jpg";
      convertedToJpg++;
    }

    const args = [file];
    if (needsResize) {
      args.push("-resize", `${MAX_DIM}x${MAX_DIM}>`);
      resized++;
    }
    args.push("-strip");
    if (newExt === ".jpg") {
      args.push("-quality", "85", "-sampling-factor", "4:2:0", "-interlace", "Plane");
    } else if (newExt === ".png") {
      args.push("-quality", "90", "-define", "png:compression-level=9");
    } else if (newExt === ".webp") {
      args.push("-quality", "85");
    }
    args.push(targetFile === file ? file : targetFile);

    execFileSync("convert", args, { stdio: ["ignore", "ignore", "pipe"] });

    if (targetFile !== file) {
      fs.unlinkSync(file);
      const newRel = path.relative(path.join(root, "client", "public"), targetFile);
      const newWebPath = "/" + newRel.split(path.sep).join("/");
      renameMap.set(oldWebPath, newWebPath);
      afterTotal += fs.statSync(targetFile).size;
    } else {
      afterTotal += fs.statSync(file).size;
    }
  } catch (err) {
    errors++;
    afterTotal += before;
    console.error(`  error on ${file}: ${err.message.split("\n")[0]}`);
  }
}

console.log(`Before: ${(beforeTotal / 1024 / 1024).toFixed(1)} MB`);
console.log(`After:  ${(afterTotal / 1024 / 1024).toFixed(1)} MB`);
console.log(`Converted to JPEG: ${convertedToJpg}, Resized: ${resized}, Errors: ${errors}`);
console.log(`Extension renames: ${renameMap.size}`);

// Apply renames (extension changes) to the two data files.
function applyRenames(images) {
  return images.map((u) => renameMap.get(u) || u);
}

const productsPath = path.join(dataDir, "products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
for (const p of products) {
  // Apply to every product with locally-hosted images, not just the
  // original vendor-sweep entries (later passes also self-host images for
  // pre-existing catalog products, e.g. the missing-image backfill).
  if (Array.isArray(p.images)) p.images = applyRenames(p.images);
  if (p.primaryImage && renameMap.has(p.primaryImage)) p.primaryImage = renameMap.get(p.primaryImage);
}
fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

const vendorResourcesPath = path.join(dataDir, "vendor-resources.json");
const vendorResources = JSON.parse(fs.readFileSync(vendorResourcesPath, "utf-8"));
for (const group of vendorResources) {
  for (const p of group.products) {
    if (Array.isArray(p.images)) p.images = applyRenames(p.images);
  }
}
fs.writeFileSync(vendorResourcesPath, JSON.stringify(vendorResources, null, 2));

console.log("Data files updated with renamed extensions.");
