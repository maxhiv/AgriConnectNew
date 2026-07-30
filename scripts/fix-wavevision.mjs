import fs from "fs";
import path from "path";
import sharp from "sharp";

const SRC = "C:\\Users\\hanse\\AppData\\Local\\Temp\\claude\\C--Users-hanse-OneDrive-Desktop\\b6a72788-6386-4bb0-a520-4e5130f40498\\scratchpad\\brochures\\wavevision";
const outDir = "C:\\Users\\hanse\\OneDrive\\Desktop\\AgriConnectNew\\client\\public\\assets\\vendor-images\\precision-planting";
const productsPath = "C:\\Users\\hanse\\OneDrive\\Desktop\\AgriConnectNew\\functions\\_data\\products.json";

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const files = [
    ["main.jpg", "precision-planting-wavevision-main"],
    ["hero.jpg", "precision-planting-wavevision-hero"],
    ["avoidwear.jpg", "precision-planting-wavevision-avoidwear"],
  ];
  const webPaths = [];
  for (const [f, name] of files) {
    const srcFile = path.join(SRC, f);
    const dest = path.join(outDir, name + ".jpg");
    await sharp(srcFile).resize(1600, 1600, { fit: "inside", withoutEnlargement: true }).flatten({ background: "#ffffff" }).jpeg({ quality: 85 }).toFile(dest);
    webPaths.push("/assets/vendor-images/precision-planting/" + name + ".jpg");
  }
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
  const p = products.find((x) => x.slug === "wavevision");
  p.images = webPaths;
  p.primaryImage = webPaths[0];
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  console.log("WaveVision images:", webPaths);
}

main();
