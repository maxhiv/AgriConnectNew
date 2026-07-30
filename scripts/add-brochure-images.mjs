// Wires in images extracted from PTx Trimble brochure PDFs and freshly
// re-sourced XAG P100 Pro photos for products that ended up with zero
// working images after the ctfassets.net/xag.cn cleanup pass.
import fs from "fs";
import path from "path";
import sharp from "sharp";

const SRC = "C:\\Users\\hanse\\AppData\\Local\\Temp\\claude\\C--Users-hanse-OneDrive-Desktop\\b6a72788-6386-4bb0-a520-4e5130f40498\\scratchpad\\brochures";
const outRoot = "C:\\Users\\hanse\\OneDrive\\Desktop\\AgriConnectNew\\client\\public\\assets\\vendor-images";
const productsPath = "C:\\Users\\hanse\\OneDrive\\Desktop\\AgriConnectNew\\functions\\_data\\products.json";

async function toWeb(srcFile, vendorSlug, name) {
  const destDir = path.join(outRoot, vendorSlug);
  fs.mkdirSync(destDir, { recursive: true });
  const destPath = path.join(destDir, `${name}.jpg`);
  await sharp(srcFile).resize(1600, 1600, { fit: "inside", withoutEnlargement: true }).flatten({ background: "#ffffff" }).jpeg({ quality: 85 }).toFile(destPath);
  const rel = path.relative(path.join(outRoot, "..", ".."), destPath); // relative to client/public
  return "/" + path.relative("C:\\Users\\hanse\\OneDrive\\Desktop\\AgriConnectNew\\client\\public", destPath).split(path.sep).join("/");
}

const JOBS = {
  "ptx-truetracker": {
    vendor: "ptx-trimble",
    files: [
      ["truetracker-imgs/img-000.jpg", "ptx-truetracker-hero"],
      ["truetracker-imgs/img-002.jpg", "ptx-truetracker-tractor"],
      ["truetracker-imgs/img-004.jpg", "ptx-truetracker-implement"],
      ["truetracker-imgs/img-005.jpg", "ptx-truetracker-incab"],
    ],
  },
  "ptx-field-iq-crop-input": {
    vendor: "ptx-trimble",
    files: [["fieldiq-imgs/img-000.jpg", "ptx-fieldiq-cropinput-planter"]],
  },
  "ptx-weedseeker-2": {
    vendor: "ptx-trimble",
    files: [
      ["weedseeker-imgs/img-000.jpg", "ptx-weedseeker2-hero"],
      ["weedseeker-imgs/img-002.jpg", "ptx-weedseeker2-field"],
    ],
  },
  "ptx-field-iq-isobus-liquid": {
    vendor: "ptx-trimble",
    files: [
      ["isobus-liquid-imgs/img-001.jpg", "ptx-fieldiq-isobus-liquid-tanker"],
      ["isobus-liquid-imgs/img-003.jpg", "ptx-fieldiq-isobus-liquid-orchard"],
    ],
  },
  "xag-p100-pro": {
    vendor: "xag",
    files: [
      ["xag-p100pro/head-photo.png", "xag-p100pro-hero"],
      ["xag-p100pro/fly1.png", "xag-p100pro-flying-1"],
      ["xag-p100pro/fly2.png", "xag-p100pro-flying-2"],
    ],
  },
};

async function main() {
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
  for (const [slug, job] of Object.entries(JOBS)) {
    const p = products.find((x) => x.slug === slug);
    if (!p) {
      console.log(`SKIP: no product with slug ${slug}`);
      continue;
    }
    const webPaths = [];
    for (const [file, name] of job.files) {
      const webPath = await toWeb(path.join(SRC, file), job.vendor, name);
      webPaths.push(webPath);
      console.log(`  ${slug}: ${webPath}`);
    }
    p.images = webPaths;
    p.primaryImage = webPaths[0];
  }

  // Fix WaveVision's "[object Object]" bug: drop the bad entries, keep the rest.
  const wv = products.find((p) => p.slug === "wavevision");
  if (wv && Array.isArray(wv.images)) {
    const before = wv.images.length;
    wv.images = wv.images.filter((u) => typeof u === "string" && u !== "[object Object]");
    if (wv.primaryImage === "[object Object]") wv.primaryImage = wv.images[0] || null;
    console.log(`WaveVision: removed ${before - wv.images.length} bad image entries, ${wv.images.length} remain`);
  }

  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  console.log("Done.");
}

main();
