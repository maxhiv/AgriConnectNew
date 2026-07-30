// Resizes/recompresses every downloaded vendor image in place (max 1600px
// on the long edge, sensible quality). Images with real alpha transparency
// stay PNG/WEBP; everything else converts to JPEG for much better
// compression. Extension can change (png -> jpg), so this produces a
// rename map that's applied to functions/_data/products.json and
// functions/_data/vendor-resources.json afterward.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const imagesRoot = path.join(root, "client", "public", "assets", "vendor-images");
const dataDir = path.join(root, "functions", "_data");
const MAX_DIM = 1600;
const MIN_SIZE_TO_TOUCH = 400 * 1024; // skip files already reasonably small

function walk(dir) {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}

const files = walk(imagesRoot).filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f));
console.log(`Scanning ${files.length} images...`);

let beforeTotal = 0;
let afterTotal = 0;
let convertedToJpg = 0;
let resized = 0;
let skipped = 0;
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
  if (before < MIN_SIZE_TO_TOUCH) {
    afterTotal += before;
    skipped++;
    continue;
  }

  try {
    const buf = fs.readFileSync(file);
    const meta = await sharp(buf).metadata();
    const needsResize = meta.width > MAX_DIM || meta.height > MAX_DIM;
    const ext = path.extname(file).toLowerCase();
    const alpha = (ext === ".png" || ext === ".webp") && !!meta.hasAlpha;

    let pipeline = sharp(buf);
    if (needsResize) {
      pipeline = pipeline.resize(MAX_DIM, MAX_DIM, { fit: "inside", withoutEnlargement: true });
      resized++;
    }

    let targetFile = file;
    let outBuf;
    if (alpha) {
      outBuf = ext === ".webp" ? await pipeline.webp({ quality: 85 }).toBuffer() : await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer();
    } else {
      if (ext !== ".jpg" && ext !== ".jpeg") {
        targetFile = file.slice(0, -ext.length) + ".jpg";
        convertedToJpg++;
      }
      outBuf = await pipeline.flatten({ background: "#ffffff" }).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
    }

    if (outBuf.length >= before) {
      afterTotal += before;
      skipped++;
      continue;
    }

    fs.writeFileSync(targetFile, outBuf);
    if (targetFile !== file) {
      fs.unlinkSync(file);
      const newRel = path.relative(path.join(root, "client", "public"), targetFile);
      const newWebPath = "/" + newRel.split(path.sep).join("/");
      renameMap.set(oldWebPath, newWebPath);
    }
    afterTotal += outBuf.length;
  } catch (err) {
    errors++;
    afterTotal += before;
    console.error(`  error on ${file}: ${err.message.split("\n")[0]}`);
  }
}

console.log(`Before: ${(beforeTotal / 1024 / 1024).toFixed(1)} MB`);
console.log(`After:  ${(afterTotal / 1024 / 1024).toFixed(1)} MB`);
console.log(`Converted to JPEG: ${convertedToJpg}, Resized: ${resized}, Skipped (already small): ${skipped}, Errors: ${errors}`);
console.log(`Extension renames: ${renameMap.size}`);

// Apply renames (extension changes) to the two data files.
function applyRenames(images) {
  return images.map((u) => renameMap.get(u) || u);
}

const productsPath = path.join(dataDir, "products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
for (const p of products) {
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
