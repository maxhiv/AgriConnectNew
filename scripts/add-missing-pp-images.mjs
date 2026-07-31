// The 12 Precision Planting products below had products.json image
// references that were never actually downloaded (paths pointing to files
// that don't exist on disk). Sourced real photos directly from
// precisionplanting.com's live product pages (cdn.bfldr.com), resized and
// self-hosted the same way as every other vendor image on the site.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "client", "public", "assets", "vendor-images", "precision-planting");
const productsPath = path.join(root, "functions", "_data", "products.json");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// Also fix 2 stale oemUrls discovered while sourcing these images.
const OEM_URL_FIXES = {
  "cornerstone-planting-system": "https://www.precisionplanting.com/products/cornerstone-planting-system",
  "keeton-seed-firmer": "https://www.precisionplanting.com/products/planters/keeton",
};

const JOBS = {
  vdrive: [
    ["https://cdn.bfldr.com/7M6SII1K/as/qfbs23-cvyp2g-g38xv7/vDrive?auto=webp&width=1600", "precision-planting-vdrive-1"],
    ["https://cdn.bfldr.com/7M6SII1K/as/qfbs2p-1yncyg-d8atq7/vDrive_Insecticide?auto=webp&width=1600", "precision-planting-vdrive-2"],
    ["https://cdn.bfldr.com/7M6SII1K/as/555knq5vtm5w5hm96qtqr7/vDrive_hero_1050x600?auto=webp&width=1050", "precision-planting-vdrive-3"],
  ],
  vset: [
    ["https://cdn.bfldr.com/7M6SII1K/as/qfbs3o-8ef7tc-2zf9qy/vSet?auto=webp&width=1600", "precision-planting-vset-1"],
    ["https://cdn.bfldr.com/7M6SII1K/as/ws4rvs7nbcmf97569g8qc9/vSet_hero_1050x600?auto=webp&width=1050", "precision-planting-vset-2"],
    ["https://cdn.bfldr.com/7M6SII1K/as/gcrp2mmwghmxpbhqhv983sx/vSet_buildyoursystem_1050x600?auto=webp&width=1050", "precision-planting-vset-3"],
    ["https://cdn.bfldr.com/7M6SII1K/as/3krk2sr3fvbg9t88nrcmkqv/Text_vSet_Corn_27_Hole_Singuated_16x9?auto=webp&width=1600", "precision-planting-vset-4"],
    ["https://cdn.bfldr.com/7M6SII1K/as/r56pcsp5c78q96gk8m853mn/Text_vSet_Soybean_56_Hole__Soybean_Singulator_16x9?auto=webp&width=1600", "precision-planting-vset-5"],
  ],
  eset: [
    ["https://cdn.bfldr.com/7M6SII1K/as/qfbrx6-ap4a74-2vvkw1/eSet_Pro_Series?auto=webp&width=1600", "precision-planting-eset-1"],
    ["https://cdn.bfldr.com/7M6SII1K/as/qdzdmv-7k8lrc-es1b93/PP_2013_Spring_Planting_1?auto=webp&width=1050", "precision-planting-eset-2"],
    ["https://cdn.bfldr.com/7M6SII1K/as/qmc94jxxw9fwtjhg9bnzq59/John_Deere_Front_Fold_24_Row_-_LBeck_-_Close_Ups_1?auto=webp&width=1050", "precision-planting-eset-3"],
  ],
  mset: [
    ["https://cdn.bfldr.com/7M6SII1K/as/qfbryi-fr53fk-2tbfr9/mSet?auto=webp&width=1600", "precision-planting-mset-1"],
    ["https://cdn.bfldr.com/7M6SII1K/as/htw3m7hmbsrb3crw7m5vfmz/mSet_Aerial_View_of_Multi-Hybrids?auto=webp&width=1050", "precision-planting-mset-2"],
    ["https://cdn.bfldr.com/7M6SII1K/as/v8678b6fkxfgk46r334k7/mSet_20_20_Mockup_Website?auto=webp&width=1600", "precision-planting-mset-3"],
  ],
  "vset-select": [
    ["https://cdn.bfldr.com/7M6SII1K/as/jbh356vjmx85mmvs369g75/vSet_Select?auto=webp&width=1600", "precision-planting-vset-select-1"],
    ["https://cdn.bfldr.com/7M6SII1K/as/qdzdua-1uayk0-79s7bm/PrecisionPlanting_0415_PPDI_1711?auto=webp&width=1050", "precision-planting-vset-select-2"],
    ["https://cdn.bfldr.com/7M6SII1K/as/trh78cfr5c975r45572mfrn9/vSetSelect_impressiveresults_1050x600?auto=webp&width=1050", "precision-planting-vset-select-3"],
  ],
  vapplyhd: [
    ["https://cdn.bfldr.com/7M6SII1K/as/qfbs23-cvyp2g-dkyjzl/vApplyHD?auto=webp&width=1600", "precision-planting-vapplyhd-1"],
    ["https://cdn.bfldr.com/7M6SII1K/as/3ztp8jms45x65xbb57f7mcwh/vApplyHD_comparison_1050x600?auto=webp&width=1050", "precision-planting-vapplyhd-2"],
    ["https://cdn.bfldr.com/7M6SII1K/as/t4sgfcqgsk4t7rnc69rtm9g3/Morton_Operations_Erie_-_89?auto=webp&width=1050", "precision-planting-vapplyhd-3"],
  ],
  "cornerstone-planting-system": [
    ["https://cdn.bfldr.com/7M6SII1K/as/tpb9rkwk4wfksb57js43tpkg/CornerStone_Green_MiniHopper_SRM_LiquidSystem_Front_2025?auto=webp&width=1600", "precision-planting-cornerstone-1"],
    ["https://cdn.bfldr.com/7M6SII1K/as/4wx9pkjhkk78ff335c3nx6/CornerStone_Green_16BushelHopperSRM_LiquidSystem_Front?auto=webp&width=1600", "precision-planting-cornerstone-2"],
    ["https://cdn.bfldr.com/7M6SII1K/as/mqk6mw3gk8rgsbfb9bstb8gb/CornerStone_Green_3BushelHopper_SRM_LiquidSystem_Front_2025?auto=webp&width=1600", "precision-planting-cornerstone-3"],
    ["https://cdn.bfldr.com/7M6SII1K/as/x75s96g38wfcsmbrwn5cbcn3/ReadyBar-050525?auto=webp&width=1600", "precision-planting-cornerstone-4"],
  ],
  "keeton-seed-firmer": [
    ["https://cdn.bfldr.com/7M6SII1K/as/qfbryi-fr53fk-8rhulv/Keeton_Seed_Firmer?auto=webp&width=1600", "precision-planting-keeton-1"],
    ["https://cdn.bfldr.com/7M6SII1K/as/3mkfnj8gkk2hqb7wptv92wsq/Keeton_Low_Stick?auto=webp&width=1600", "precision-planting-keeton-2"],
    ["https://cdn.bfldr.com/7M6SII1K/as/r66b3jc6mx4t97h875x3v76/Keeton_hero_1050x600?auto=webp&width=1050", "precision-planting-keeton-3"],
  ],
  "ready-row-unit": [
    ["https://cdn.bfldr.com/7M6SII1K/as/qfbryi-fr53fk-ai8ly2/Ready_Row_Unit?auto=webp&width=1600", "precision-planting-ready-row-unit-1"],
    ["https://cdn.bfldr.com/7M6SII1K/as/f82pp527xv5xmw99tbg38gqq/IMG_4283?auto=webp&width=1050", "precision-planting-ready-row-unit-2"],
    ["https://cdn.bfldr.com/7M6SII1K/as/rzk9hjcjjjj6jhwng2n4j/CASEIH_-_Frontfold_-_24_Row_-_SNienohmer_4?auto=webp&width=1050", "precision-planting-ready-row-unit-3"],
  ],
  swathmodule: [
    ["https://cdn.bfldr.com/7M6SII1K/as/qsrxbqjfczcjmgpr9h9bc9z/SwathModule_left_2024?auto=webp&width=1600", "precision-planting-swathmodule-1"],
    ["https://cdn.bfldr.com/7M6SII1K/as/67nk3vmvk6gkmrtqpsvfgm3/Swath_Rate_Modules_004?auto=webp&width=1050", "precision-planting-swathmodule-2"],
  ],
  symphonynozzle: [
    ["https://cdn.bfldr.com/7M6SII1K/as/pmrvv33g7mxcjfnf96h2vb9/SymphonyNozzle_2023?auto=webp&width=1600", "precision-planting-symphonynozzle-1"],
    ["https://cdn.bfldr.com/7M6SII1K/as/fv7btcjvgnsrk8c7mfmmkw9p/Hagie_Sprayer_-_Stoller_2?auto=webp&width=1050", "precision-planting-symphonynozzle-2"],
    ["https://cdn.bfldr.com/7M6SII1K/as/jkxsf8g7tr85h7239k5jbzgq/Symphony202333?auto=webp&width=1050", "precision-planting-symphonynozzle-3"],
    ["https://cdn.bfldr.com/7M6SII1K/as/mg4rq6ksgx59hmbzvc9kqv96/NozzleSplitter?auto=webp&width=1600", "precision-planting-symphonynozzle-4"],
  ],
  yieldsense: [
    ["https://cdn.bfldr.com/7M6SII1K/as/qfbs3o-8ef7tc-5rybp0/YieldSense?auto=webp&width=1600", "precision-planting-yieldsense-1"],
    ["https://cdn.bfldr.com/7M6SII1K/as/skqwcqsnftvgs2wwknvfw53/Screen_Shot_2020-02-11_at_32845_PM?auto=webp&width=1050", "precision-planting-yieldsense-2"],
    ["https://cdn.bfldr.com/7M6SII1K/as/87pbkg7f33mj9gbjr5pwfcbb/YieldSense_spatialaccuracy_1050x600?auto=webp&width=1050", "precision-planting-yieldsense-3"],
    ["https://cdn.bfldr.com/7M6SII1K/as/mjtn49bsq3h4gkhtjf7vqbhf/YieldSense_2020_Gen3?auto=webp&width=1050", "precision-planting-yieldsense-4"],
  ],
};

async function download(url, destPathNoExt) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "image/*,*/*;q=0.8" }, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const destPath = `${destPathNoExt}.jpg`;
  await sharp(buf)
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(destPath);
  return destPath;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
  let totalDownloaded = 0;

  for (const [slug, jobs] of Object.entries(JOBS)) {
    const p = products.find((x) => x.slug === slug);
    if (!p) {
      console.log(`SKIP: no product ${slug}`);
      continue;
    }
    const webPaths = [];
    for (const [url, name] of jobs) {
      const destPathNoExt = path.join(outDir, name);
      try {
        const destPath = await download(url, destPathNoExt);
        totalDownloaded++;
        const rel = path.relative(path.join(root, "client", "public"), destPath);
        webPaths.push("/" + rel.split(path.sep).join("/"));
        console.log(`  ${slug}: ${name}.jpg`);
      } catch (err) {
        console.error(`  FAIL ${slug} ${name}: ${err.message}`);
      }
    }
    if (webPaths.length) {
      p.images = webPaths;
      p.primaryImage = webPaths[0];
    }
    if (OEM_URL_FIXES[slug]) p.oemUrl = OEM_URL_FIXES[slug];
  }

  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  console.log(`Downloaded ${totalDownloaded} images. products.json updated.`);
}

main();
