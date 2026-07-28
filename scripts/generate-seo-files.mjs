// Generates static sitemap.xml and robots.txt at build time, replicating
// the logic that used to live in server/routes.ts (/sitemap.xml, /robots.txt).
// Product data comes from the live-data snapshot bundled for Pages Functions.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "dist", "public");

const products = JSON.parse(
  fs.readFileSync(path.join(root, "functions", "_data", "products.json"), "utf-8")
);
const vendorResources = JSON.parse(
  fs.readFileSync(path.join(root, "functions", "_data", "vendor-resources.json"), "utf-8")
);
const resources = JSON.parse(
  fs.readFileSync(path.join(root, "functions", "_data", "resources.json"), "utf-8")
);

const baseUrl = "https://vantage-south.com";
const now = new Date().toISOString().split("T")[0];

const staticRoutes = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/products", priority: "0.9", changefreq: "weekly" },
  { url: "/dealers", priority: "0.7", changefreq: "monthly" },
  { url: "/resources", priority: "0.7", changefreq: "weekly" },
  { url: "/farming-guides", priority: "0.7", changefreq: "weekly" },
  { url: "/weather-updates", priority: "0.6", changefreq: "daily" },
  { url: "/schedule-field-demo", priority: "0.8", changefreq: "monthly" },
  { url: "/vendor-resources", priority: "0.7", changefreq: "weekly" },
];

const territoryHubs = [
  "/alabama-precision-agriculture",
  "/mississippi-precision-agriculture",
  "/northwest-florida-precision-agriculture",
  "/central-tennessee-precision-agriculture",
];

const services = [
  "/services/precision-ag-consulting",
  "/services/installation-calibration",
  "/services/rtk-gnss-setup",
  "/services/in-season-support",
  "/services/on-farm-training",
];

const crops = [
  "/crops/cotton-precision-ag",
  "/crops/peanut-precision-ag",
  "/crops/corn-precision-ag",
  "/crops/soybean-precision-ag",
  "/crops/row-crops-precision-ag",
];

const alabamaLocations = [
  "/alabama/houston-county/precision-agriculture",
  "/alabama/geneva-county/precision-agriculture",
  "/alabama/henry-county/precision-agriculture",
  "/alabama/coffee-county/precision-agriculture",
  "/alabama/dale-county/precision-agriculture",
  "/alabama/covington-county/precision-agriculture",
  "/alabama/escambia-county/precision-agriculture",
  "/alabama/baldwin-county/precision-agriculture",
  "/alabama/limestone-county/precision-agriculture",
  "/alabama/madison-county/precision-agriculture",
  "/alabama/lauderdale-county/precision-agriculture",
  "/alabama/dothan/precision-agriculture",
  "/alabama/ashford/precision-agriculture",
  "/alabama/rehobeth/precision-agriculture",
  "/alabama/geneva/precision-agriculture",
  "/alabama/hartford/precision-agriculture",
  "/alabama/slocomb/precision-agriculture",
  "/alabama/abbeville/precision-agriculture",
  "/alabama/headland/precision-agriculture",
  "/alabama/enterprise/precision-agriculture",
  "/alabama/elba/precision-agriculture",
  "/alabama/ozark/precision-agriculture",
  "/alabama/andalusia/precision-agriculture",
  "/alabama/atmore/precision-agriculture",
  "/alabama/brewton/precision-agriculture",
  "/alabama/robertsdale/precision-agriculture",
  "/alabama/foley/precision-agriculture",
  "/alabama/fairhope/precision-agriculture",
  "/alabama/athens/precision-agriculture",
  "/alabama/huntsville/precision-agriculture",
  "/alabama/florence/precision-agriculture",
];

const mississippiLocations = [
  "/mississippi/washington-county/precision-agriculture",
  "/mississippi/bolivar-county/precision-agriculture",
  "/mississippi/sunflower-county/precision-agriculture",
  "/mississippi/leflore-county/precision-agriculture",
  "/mississippi/coahoma-county/precision-agriculture",
  "/mississippi/humphreys-county/precision-agriculture",
  "/mississippi/sharkey-county/precision-agriculture",
  "/mississippi/tunica-county/precision-agriculture",
  "/mississippi/quitman-county/precision-agriculture",
  "/mississippi/issaquena-county/precision-agriculture",
  "/mississippi/greenville/precision-agriculture",
  "/mississippi/cleveland/precision-agriculture",
  "/mississippi/indianola/precision-agriculture",
  "/mississippi/ruleville/precision-agriculture",
  "/mississippi/greenwood/precision-agriculture",
  "/mississippi/clarksdale/precision-agriculture",
  "/mississippi/belzoni/precision-agriculture",
  "/mississippi/rolling-fork/precision-agriculture",
  "/mississippi/tunica/precision-agriculture",
  "/mississippi/marks/precision-agriculture",
  "/mississippi/mayersville/precision-agriculture",
];

const floridaLocations = [
  "/florida/jackson-county/precision-agriculture",
  "/florida/calhoun-county/precision-agriculture",
  "/florida/holmes-county/precision-agriculture",
  "/florida/washington-county-fl/precision-agriculture",
  "/florida/marianna/precision-agriculture",
  "/florida/blountstown/precision-agriculture",
  "/florida/bonifay/precision-agriculture",
  "/florida/chipley/precision-agriculture",
];

const tennesseeLocations = [
  "/tennessee/giles-county/precision-agriculture",
  "/tennessee/lincoln-county/precision-agriculture",
  "/tennessee/bedford-county/precision-agriculture",
  "/tennessee/maury-county/precision-agriculture",
  "/tennessee/coffee-county-tn/precision-agriculture",
  "/tennessee/franklin-county/precision-agriculture",
  "/tennessee/marshall-county/precision-agriculture",
  "/tennessee/pulaski/precision-agriculture",
  "/tennessee/fayetteville/precision-agriculture",
  "/tennessee/shelbyville/precision-agriculture",
  "/tennessee/columbia/precision-agriculture",
  "/tennessee/manchester/precision-agriculture",
  "/tennessee/tullahoma/precision-agriculture",
  "/tennessee/winchester/precision-agriculture",
  "/tennessee/lewisburg/precision-agriculture",
];

// Combined service + location pages - Alabama and Mississippi only, mirroring
// the ServiceLocationPage routes in App.tsx. Derived from the existing
// alabamaLocations/mississippiLocations + services arrays so the two stay in
// sync automatically (52 locations x 5 services = 260 URLs).
const serviceSlugs = services.map((s) => s.split("/").pop());
const buildServiceLocationUrls = (locationUrls) =>
  locationUrls.flatMap((url) => {
    const base = url.replace(/\/precision-agriculture$/, "");
    return serviceSlugs.map((slug) => `${base}/services/${slug}`);
  });
const alabamaServiceLocations = buildServiceLocationUrls(alabamaLocations);
const mississippiServiceLocations = buildServiceLocationUrls(mississippiLocations);
const serviceLocationUrls = [...alabamaServiceLocations, ...mississippiServiceLocations];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

const urlEntry = (url, changefreq, priority) =>
  `  <url>\n    <loc>${baseUrl}${url}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;

for (const route of staticRoutes) xml += urlEntry(route.url, route.changefreq, route.priority);
for (const url of territoryHubs) xml += urlEntry(url, "weekly", "0.9");
for (const url of services) xml += urlEntry(url, "monthly", "0.8");
for (const url of crops) xml += urlEntry(url, "monthly", "0.8");
const allLocations = [...alabamaLocations, ...mississippiLocations, ...floridaLocations, ...tennesseeLocations];
for (const url of allLocations) xml += urlEntry(url, "monthly", "0.7");
for (const url of serviceLocationUrls) xml += urlEntry(url, "monthly", "0.6");
for (const product of products) xml += urlEntry(`/product/${product.slug}`, "weekly", "0.6");
for (const vendor of vendorResources) xml += urlEntry(`/vendor-resources/${vendor.slug}`, "weekly", "0.6");
for (const resource of resources) xml += urlEntry(`/resources/${resource.slug}`, "monthly", resource.category === "research" ? "0.7" : "0.6");

xml += "</urlset>";

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml);

const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin and API routes
Disallow: /api/
`;
fs.writeFileSync(path.join(outDir, "robots.txt"), robotsTxt);

console.log(
  `Generated sitemap.xml (${staticRoutes.length + territoryHubs.length + services.length + crops.length + allLocations.length + serviceLocationUrls.length + products.length + vendorResources.length + resources.length} urls) and robots.txt`
);
