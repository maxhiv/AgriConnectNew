// Adds the 29 PTx Trimble product manuals/guides (pulled from ptxag.com's
// public Product Resources library, PDFs mirrored to our own R2 bucket) as
// "manual" category entries in functions/_data/resources.json, alongside the
// Precision Planting research/articles/guides/farmer-stories already there.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "functions", "_data");

const resourcesPath = path.join(dataDir, "resources.json");
const resources = JSON.parse(fs.readFileSync(resourcesPath, "utf-8"));
const products = JSON.parse(fs.readFileSync(path.join(dataDir, "products.json"), "utf-8"));

const PDF_BASE = "https://pub-a0f4340d0f0e4281b36892845a9483d2.r2.dev/docs/ptx-trimble/";

function slugify(str) {
  return str.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const existingSlugs = new Set(resources.map((r) => r.slug));
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

function findProductSlugs(names) {
  const slugs = new Set();
  for (const name of names) {
    const matches = products.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()));
    matches.forEach((m) => slugs.add(m.slug));
  }
  return [...slugs];
}

// filename -> { title, description, relatedProductNames }
const manuals = [
  { file: "GFX-Series-Display-User-Guide.pdf", title: "GFX Series Display User Guide", description: "Complete user guide covering setup, navigation, and operation of the GFX-350, GFX-1060, and GFX-1260 displays running Precision-IQ.", related: ["GFX-350", "GFX-1060", "GFX-1260"] },
  { file: "TRACK-Guide-III-Display-System-Installation-and-Operating-Instructions.pdf", title: "TRACK-Guide III Display System: Installation and Operating Instructions", description: "Installation and operating instructions for the TRACK-Guide III guidance display system.", related: [] },
  { file: "TRACK-Leader-Operating-Instructions.pdf", title: "TRACK-Leader Operating Instructions", description: "Operating instructions for the TRACK-Leader guidance and steering system.", related: [] },
  { file: "Precision-IQ-Managing-Fields-and-Guidance-Patterns-User-Guide.pdf", title: "Precision-IQ: Managing Fields and Guidance Patterns", description: "User guide for setting up fields and guidance patterns in Precision-IQ, the software platform running on GFX displays.", related: ["GFX-350", "GFX-1060", "GFX-1260"] },
  { file: "Precision-IQ-Managing-Implements-User-Guide.pdf", title: "Precision-IQ: Managing Implements User Guide", description: "User guide for configuring and managing implements within Precision-IQ.", related: ["GFX-350", "GFX-1060", "GFX-1260"] },
  { file: "remote-output-user-guide.pdf", title: "Remote Output User Guide", description: "User guide for configuring remote output functionality on PTx Trimble display systems.", related: [] },
  { file: "GFX-Displays--EU-Declaration-of-Conformity.pdf", title: "GFX Displays: EU Declaration of Conformity", description: "Regulatory EU Declaration of Conformity documentation for the GFX display series.", related: ["GFX-350", "GFX-1060", "GFX-1260"] },
  { file: "Nav-960-EU-Declaration-of-Conformity.pdf", title: "NAV-960: EU Declaration of Conformity", description: "Regulatory EU Declaration of Conformity documentation for the NAV-960 guidance controller.", related: ["NAV-960"] },
  { file: "FarmEngage-AGCO-Equipment-Operations-Activation.pdf", title: "FarmENGAGE: AGCO Equipment Operations Activation", description: "Guide for activating AGCO equipment operations data within FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "FarmENGAGE-AGCO-ID.pdf", title: "FarmENGAGE: AGCO ID", description: "Guide for linking and managing an AGCO ID within FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "FarmENGAGE-Analytics.pdf", title: "FarmENGAGE: Analytics", description: "Guide to the analytics and reporting features in FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "FarmENGAGE-Autosync.pdf", title: "FarmENGAGE: Autosync", description: "Guide to Autosync data synchronization in FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "FarmENGAGE-Crop-Rotation-Planning.pdf", title: "FarmENGAGE: Crop Rotation Planning", description: "Guide to planning and managing crop rotations in FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "FarmENGAGE-Crop-Zone-Activities.pdf", title: "FarmENGAGE: Crop Zone Activities", description: "Guide to managing crop zone activities in FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "FarmENGAGE-Crops-and-Crop-Seasons.pdf", title: "FarmENGAGE: Crops and Crop Seasons", description: "Guide to setting up crops and crop seasons in FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "FarmENGAGE-Direct-Send-and-Exporting-Resources.pdf", title: "FarmENGAGE: Direct Send and Exporting Resources", description: "Guide to direct-send data transfer and exporting resources from FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "FarmEngage-Data-Inbox.pdf", title: "FarmENGAGE: Data Inbox", description: "Guide to managing incoming data through the FarmENGAGE Data Inbox.", related: ["FarmENGAGE"] },
  { file: "FarmEngage-Equipment-Activity-and-Crop-Zone-Activities.pdf", title: "FarmENGAGE: Equipment Activity & Crop Zone Activity", description: "Guide to tracking equipment activity alongside crop zone activities in FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "FarmEngage-Equipment.pdf", title: "FarmENGAGE: Equipment", description: "Guide to managing equipment records in FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "FarmEngage-Farm-Map.pdf", title: "FarmENGAGE: Farm Map", description: "Guide to using the Farm Map feature in FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "FarmEngage-Field-Manager.pdf", title: "FarmENGAGE: Field Manager", description: "Guide to managing fields using the FarmENGAGE Field Manager.", related: ["FarmENGAGE"] },
  { file: "FarmEngage-Materials.pdf", title: "FarmENGAGE: Materials", description: "Guide to managing materials (seed, fertilizer, chemical products) in FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "FarmEngage-Mobile.pdf", title: "FarmENGAGE: Mobile", description: "Guide to using the FarmENGAGE mobile app.", related: ["FarmENGAGE"] },
  { file: "FarmEngage-OEM-APIs.pdf", title: "FarmENGAGE: OEM APIs", description: "Reference guide to FarmENGAGE's OEM API integrations.", related: ["FarmENGAGE"] },
  { file: "FarmEngage-People.pdf", title: "FarmENGAGE: People", description: "Guide to managing people and user access in FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "FarmEngage-Prescriptions.pdf", title: "FarmENGAGE: Prescriptions", description: "Guide to creating and managing prescriptions in FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "FarmEngage-Word-Orders.pdf", title: "FarmENGAGE: Work Orders", description: "Guide to creating and managing work orders in FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "farmengage-connectivity-center.pdf", title: "FarmENGAGE: Connectivity Center", description: "Guide to the Connectivity Center for managing device and data connections in FarmENGAGE.", related: ["FarmENGAGE"] },
  { file: "farmengage-initial-organization-creation-management.pdf", title: "FarmENGAGE: Initial Organization Creation & Management", description: "Guide to setting up and managing an organization in FarmENGAGE for the first time.", related: ["FarmENGAGE"] },
];

const now = new Date().toISOString();
const newResources = manuals.map((m) => {
  const slug = uniqueSlug(slugify(m.title));
  const pdfUrl = PDF_BASE + m.file;
  return {
    id: slug,
    slug,
    category: "manual",
    categoryLabel: "Technical Manual",
    title: m.title,
    description: m.description,
    keyPoints: [],
    bodyHtml: `<p>${m.description}</p><p><a href="${pdfUrl}" target="_blank" rel="noopener noreferrer">Download PDF</a></p>`,
    tags: ["PTx Trimble"],
    relatedProductSlugs: findProductSlugs(m.related),
    featuredImage: null,
    sourceUrl: pdfUrl,
    seoKeywords: null,
    pdfUrl,
  };
});

const merged = [...resources, ...newResources];
fs.writeFileSync(resourcesPath, JSON.stringify(merged, null, 2));

const withProducts = newResources.filter((r) => r.relatedProductSlugs.length > 0);
console.log(`Added ${newResources.length} manuals. Total resources now: ${merged.length}`);
console.log(`Manuals with matched related product: ${withProducts.length}/${newResources.length}`);
