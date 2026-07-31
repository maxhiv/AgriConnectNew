// Uses real text extracted from the 29 PTx Trimble manual PDFs (pdftotext) to:
//  1. Merge 5 duplicate PTx product pairs (older ptx-* slug kept as canonical,
//     since it has been live since Dec 2025; richer content from the newer
//     July 2026 duplicate is merged in, then the duplicate is deleted).
//  2. Add real detailedFeatures/benefits pulled from the manuals to the
//     products those manuals actually document.
//  3. Replace the thin, generic manual resource summaries with real
//     keyPoints + bodyHtml written from the actual manual content.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const productsPath = path.join(root, "functions", "_data", "products.json");
const resourcesPath = path.join(root, "functions", "_data", "resources.json");

const products = JSON.parse(fs.readFileSync(productsPath, "utf-8"));
const resources = JSON.parse(fs.readFileSync(resourcesPath, "utf-8"));

// ---------------------------------------------------------------------------
// 1. Dedupe: [survivingOldSlug, duplicateNewSlug]
// ---------------------------------------------------------------------------
const DEDUPE_PAIRS = [
  ["ptx-farmengage", "ptx-ptx-farmengage"],
  ["ptx-truetracker", "truetracker-implement-steering-system"],
  ["ptx-field-iq-crop-input", "field-iq-crop-input-control-system"],
  ["ptx-field-iq-isobus-liquid", "field-iq-isobus-solutions"],
  ["ptx-weedseeker-2", "weedseeker-2-spot-spray-system"],
];

const slugRemap = new Map(); // duplicateSlug -> survivingSlug

for (const [oldSlug, newSlug] of DEDUPE_PAIRS) {
  const oldP = products.find((p) => p.slug === oldSlug);
  const newP = products.find((p) => p.slug === newSlug);
  if (!oldP || !newP) {
    console.log(`SKIP dedupe ${oldSlug}/${newSlug}: one side missing`);
    continue;
  }
  slugRemap.set(newSlug, oldSlug);

  const richFields = ["tagline", "shortDescription", "highlights", "keyFeatures", "specs", "worksWith", "enrichedDescription"];
  for (const f of richFields) {
    const newVal = newP[f];
    const isEmpty = newVal === null || newVal === undefined || (Array.isArray(newVal) && newVal.length === 0) || newVal === "";
    if (!isEmpty) oldP[f] = newVal;
  }
  if (!oldP.oemUrl && newP.oemUrl) oldP.oemUrl = newP.oemUrl;

  const seen = new Set([oldP.primaryImage, ...(oldP.images || [])].filter(Boolean));
  const mergedExtra = [newP.primaryImage, ...(newP.images || [])].filter((u) => u && !seen.has(u));
  for (const u of mergedExtra) seen.add(u);
  oldP.images = [...(oldP.images || []), ...mergedExtra];
  if (!oldP.primaryImage && newP.primaryImage) oldP.primaryImage = newP.primaryImage;

  oldP.updatedAt = new Date().toISOString();
  console.log(`Merged ${newSlug} -> ${oldSlug} (+${mergedExtra.length} images)`);
}

const dedupedSlugs = new Set(DEDUPE_PAIRS.map(([, newSlug]) => newSlug));
const productsAfterDedupe = products.filter((p) => !dedupedSlugs.has(p.slug));
console.log(`Products: ${products.length} -> ${productsAfterDedupe.length} after dedupe`);

// ---------------------------------------------------------------------------
// 2. Real detailedFeatures/benefits from manual content
// ---------------------------------------------------------------------------
const PRODUCT_ENRICHMENT = {
  "gfx-350-display": {
    detailedFeatures: [
      "Built-in Wi-Fi and Bluetooth on every GFX display for wireless connectivity without add-on hardware",
      "App Central marketplace for browsing and installing licensed third-party apps, plus over-the-air (OTA) firmware updates",
      "Precision-IQ Home and Run screens unify guidance, resource management, and application control in one interface",
      "AutoSync wirelessly syncs fields, boundaries, guidance lines, vehicles, implements, and as-applied task data with FarmENGAGE",
      "Dedicated Ethernet/power port for connecting and powering a NAV-family GNSS guidance controller",
      "Aux-N auxiliary input passthrough and single external camera support",
    ],
    benefits: [
      "One display handles guidance, mapping, and application control instead of running separate systems",
      "Wireless AutoSync eliminates manual USB file transfers between the field and the office",
      "App Central and OTA updates keep the display current without a dealer visit",
    ],
  },
  "gfx-1060-display": {
    detailedFeatures: [
      "Built-in Wi-Fi and Bluetooth, App Central app marketplace, and over-the-air firmware updates",
      "Precision-IQ Home and Run screens for guidance, resource management, and application control",
      "AutoSync wirelessly syncs fields, boundaries, guidance lines, vehicles, implements, and as-applied data with FarmENGAGE",
      "Supports Remote Output (with a NAV-900 receiver, RTK-class correction, and a Field-IQ Rate and Section Control module) for triggering third-party equipment off a grid pattern or field feature",
      "Dedicated Ethernet/power ports for NAV-family GNSS guidance controllers, plus Aux-N passthrough and external camera support",
    ],
    benefits: [
      "Larger high-definition screen than the GFX-350 for more on-screen guidance and application detail",
      "Remote Output support opens up precision activation of third-party implements the display wasn't originally wired for",
      "Wireless AutoSync keeps FarmENGAGE records current without manual file transfers",
    ],
  },
  "gfx-1260-display": {
    detailedFeatures: [
      "Built-in Wi-Fi and Bluetooth, App Central app marketplace, and over-the-air firmware updates",
      "Precision-IQ Home and Run screens for guidance, resource management, and application control",
      "AutoSync wirelessly syncs fields, boundaries, guidance lines, vehicles, implements, and as-applied data with FarmENGAGE",
      "Supports Remote Output (with a NAV-900 receiver, RTK-class correction, and a Field-IQ Rate and Section Control module) for triggering third-party equipment off a grid pattern or field feature",
      "Dual Ethernet/power ports for connecting two NAV-family GNSS guidance controllers, plus Aux-N passthrough and external camera support",
    ],
    benefits: [
      "The largest screen in the GFX lineup for operators running complex, multi-channel application jobs",
      "Remote Output support opens up precision activation of third-party implements the display wasn't originally wired for",
      "Dual GNSS controller ports support advanced guidance setups other GFX models can't run",
    ],
  },
  "ptx-field-iq-crop-input": {
    detailedFeatures: [
      "Configures Field-IQ implements with sensors, implement switches, and a signal input module for planting or spraying application control",
      "Section Master status widgets and live rate/section detail on the Precision-IQ Run screen",
      "Field-IQ channel calibration plus module unlock/upgrade paths for adding capability to an existing module",
      "Compatible with Master Switch Box (MSB) and 12-section switch box hardware, including multichannel fence-row handling",
      "Automatic coverage logging tied to the Engage function, with editable coverage layers",
    ],
    benefits: [
      "Row-by-row and section-level control reduces input overlap and waste on planters and sprayers",
      "Works alongside Serial VR/TUVR and ISOBUS application control on the same Precision-IQ display",
    ],
  },
  "ptx-farmengage": {
    detailedFeatures: [
      "Field Manager for building and editing boundaries, guidance lines, landmarks, management zones, crop zones, and rate-zone prescriptions from a desktop map",
      "AutoSync wirelessly syncs fields, boundaries, vehicles, implements, materials, and as-applied task data with connected GFX/XCN displays (Precision-IQ 6.0+, 6.2+ for full vehicle/implement/material sync)",
      "Connectivity Center links AGCO machines (Fendt, Massey Ferguson, Valtra) and third-party platforms like John Deere Operations Center for cross-brand fleet data routing",
      "Work Orders sync automatically to Precision-IQ displays when display-compatible, tracking status from Planned through Done",
      "Crop Zone Activities track Profitability, Seeding, Fertility, Crop Protection, Harvest, and Irrigation history per crop zone",
      "Resource exports support PTx Trimble AgData, AgGPS, ISOXML, CNH, Ag Leader, John Deere, and Loup RDS formats, sent directly to a vehicle or downloaded",
      "Cross-organization Data Inbox sharing lets one operation send fields, boundaries, and materials to another with preview/accept/reject control",
    ],
    benefits: [
      "One login (AGCO ID) covers FarmENGAGE, FendtONE offboard, and NEXT Farming Live",
      "Runs mixed-brand fleets from a single platform instead of juggling separate manufacturer software",
      "Wireless AutoSync and Connectivity Center remove most manual file transfers between the field and the office",
    ],
  },
  "ptx-field-iq-isobus-liquid": {
    detailedFeatures: [
      "Configures ISOBUS implements with switch details and an implement summary specific to ISOBUS application control",
      "Runs on the same Precision-IQ Run screen as Field-IQ and Serial VR/TUVR controllers, with Section Master status and rate/section widgets",
      "Coverage layer logging and editing for as-applied liquid records",
    ],
    benefits: [
      "Standardized ISOBUS control means the same GFX display can run ISOBUS-certified implements from multiple manufacturers",
    ],
  },
};

for (const [slug, data] of Object.entries(PRODUCT_ENRICHMENT)) {
  const p = productsAfterDedupe.find((x) => x.slug === slug);
  if (!p) {
    console.log(`SKIP enrichment for missing product: ${slug}`);
    continue;
  }
  p.detailedFeatures = data.detailedFeatures;
  p.benefits = data.benefits;
  p.contentEnriched = true;
  p.lastContentUpdate = new Date().toISOString();
}

// ---------------------------------------------------------------------------
// 3. Real manual summaries for resources.json
// ---------------------------------------------------------------------------
const MANUAL_CONTENT = {
  "gfx-series-display-user-guide": {
    keyPoints: [
      "Built-in Wi-Fi and Bluetooth on every GFX display, with App Central for browsing licensed apps and installing over-the-air firmware updates",
      "Precision-IQ's Home and Run screens unify guidance, resource management, and application control in one interface",
      "AutoSync wirelessly transfers fields, boundaries, guidance lines, and as-applied data to and from FarmENGAGE, cutting out manual USB transfers",
      "Aux-N auxiliary input passthrough and external camera support add cab visibility and third-party sensor input",
      "A dedicated Ethernet/power port connects to and powers a NAV-family GNSS guidance controller",
    ],
    bodyHtml:
      "<p>This is the full operator's guide covering every display in the GFX Series (GFX-350, GFX-750, GFX-1060, and GFX-1260), all built to work in rugged farm environments with sizes starting at 7 inches and built-in Wi-Fi and Bluetooth support.</p>" +
      "<p>The guide walks through App Central &mdash; the on-display marketplace for browsing and installing licensed third-party apps, checking system information, managing active licenses, and installing over-the-air firmware updates &mdash; before moving into Precision-IQ itself: the Home and Run screen layouts, common icons, resource profiles, operator login and permissions, and system settings.</p>" +
      "<p>A large section covers Data Transfer, including AutoSync (wireless syncing between the display and FarmENGAGE), manual USB transfer, transferring data between two Precision-IQ displays, and which resource types each transfer method supports. The guide closes with Aux-N auxiliary passthrough setup and auxiliary attachments like external cameras.</p>",
  },
  "track-guide-iii-display-system-installation-and-operating-instructions": {
    keyPoints: [
      "TRACK-Guide III is Trimble's earlier-generation parallel-guidance display, predating the GFX/Precision-IQ lineup",
      "Covers cab mounting, GPS receiver connection and driver configuration, and micro-SD/USB memory device use",
      "Supports ISOBUS implement operation and basic task management directly from the display",
    ],
    bodyHtml:
      "<p>Installation and operating instructions for the TRACK-Guide III display &mdash; an earlier-generation Trimble parallel-guidance display that predates the current GFX/Precision-IQ lineup but remains supported and in service on many operations.</p>" +
      "<p>Topics include mounting the display in the vehicle cab, inserting a micro-SD card, connecting and configuring the driver for a GPS receiver, using the display for parallel driving, operating an ISOBUS implement, and basic task management. The guide also covers display screen layout, opening and arranging applications, and using SD/USB memory devices to move data on and off the display.</p>",
  },
  "track-leader-operating-instructions": {
    keyPoints: [
      "TRACK-Leader is the parallel guidance and navigation software that pairs with TRACK-Guide III displays",
      "Covers field boundary recording (drive-around or import) and reference point setup",
      "Supports multiple guidance line types: straight, curved, compass-based, combined, automatically generated, adaptive, and circular",
    ],
    bodyHtml:
      "<p>Operating instructions for TRACK-Leader, the parallel guidance and navigation software companion to Trimble's TRACK-Guide III display line.</p>" +
      "<p>The guide covers initial start-up and navigation (with and without ISOBUS-TC shape files), detecting direction, setting a reference point, checking GPS signal quality, and recording field boundaries by driving around a field or importing one. A large section is dedicated to parallel guidance: straight guidance lines, curves, compass-based lines, combined lines, automatically created lines, adaptive guidance, and circular guidance, along with moving and deleting guidance lines.</p>",
  },
  "precision-iq-managing-fields-and-guidance-patterns": {
    keyPoints: [
      "Field Manager and the Run Screen handle creating, importing, and editing fields and boundaries directly on a GFX display",
      "Guidance pattern types include AB Line, A+ Line, Curves, and FreeForm guidance with auto U-turn detection and Swath Swapper",
      "Headlands, infill guidance, and dedicated pivot tools (remark, shift, resize) support center-pivot fields",
      "Landmarks (points, lines, areas), Guide-to-Line, access paths, and tramlines are supported, including compatibility with John Deere runlines",
    ],
    bodyHtml:
      "<p>This Precision-IQ user guide covers every field and guidance element available on GFX displays: creating and managing fields from the Home Screen and Field Manager, and building guidance patterns from the Run Screen.</p>" +
      "<p>Guidance pattern coverage includes basic AB Line, A+ Line, and Curve patterns plus FreeForm guidance (AB Line, Curve, automatic U-turn detection, and the Swath Swapper tool), along with pausing guidance mid-pass. Boundary tools cover simple boundary recording from the Run Screen and full boundary editing in Field Manager, plus generating and applying headlands, infill guidance, and pivot-specific tools for remarking, shifting, and resizing pivot patterns.</p>" +
      "<p>The guide also covers landmarks (customizable points, lines, and areas with assignable Run Screen buttons), Guide-to-Line navigation, and access paths and tramlines &mdash; including support for John Deere runlines on mixed-fleet operations.</p>",
  },
  "precision-iq-managing-implements-user-guide": {
    keyPoints: [
      "Covers configuring pull-type, mounted, and self-propelled implements, with or without application control",
      "Full application-control setup paths for ISOBUS, Serial VR/TUVR, Virtual, and Field-IQ implements, including switches and rate/section detail",
      "Field-IQ channel calibration and module unlock/upgrade procedures",
      "Coverage layer logging, Master Switch Box and 12-section switch box support, and multichannel fence-row handling",
    ],
    bodyHtml:
      "<p>The most detailed of the Precision-IQ guides, covering everything involved in adding and configuring an implement on a GFX display &mdash; from a basic pull-type or self-propelled implement with no application control, up through full multi-channel rate and section control.</p>" +
      "<p>For implements with application control, the guide walks through every supported control type: ISOBUS (implement switches and summary), Serial VR/TUVR, Virtual implements, and Field-IQ (sensors, implement switches, and signal input module configuration). It covers Field-IQ channel calibration, unlocking or upgrading a Field-IQ module, and reading the Run Screen during application &mdash; Section Master status, rate details, section details, and section control widgets.</p>" +
      "<p>Later sections cover coverage layers and logging (including automatic logging tied to Engage), Master Switch Box and 12-section switch box support with multichannel fence-row examples, and how to edit an implement or its application control setup after the fact.</p>",
  },
  "remote-output-user-guide": {
    keyPoints: [
      "Remote Output triggers a 12V analog signal for third-party equipment based on a grid pattern or field feature",
      "Requires a GFX-1060 or GFX-1260 display running Precision-IQ v13 or later",
      "Needs a NAV-900 receiver on RTK-class correction (CenterPoint RTX/VRS or xFill Premium) plus a Field-IQ Rate and Section Control module with a Remote Output license",
      "Vehicle antenna/hitch measurements and implement offsets must be validated before setup for accurate placement",
    ],
    bodyHtml:
      "<p>Remote Output allows precision activation of third-party equipment &mdash; anything wired to accept a simple analog trigger &mdash; based on a grid pattern or field feature. When enabled, Precision-IQ automatically outputs a 12V (1 amp) signal based on user-defined conditions.</p>" +
      "<p>It requires a GFX-1060 or GFX-1260 display on Precision-IQ v13 or later, a NAV-900 GNSS receiver paired with a supported guidance system (roll-corrected manual guidance, Autopilot motor drive/CAN/VDM-912/NavController III, or EZ-Pilot Pro), RTK-class correction (CenterPoint RTX, CenterPoint RTX Fast, CenterPoint VRS, or xFill Premium &mdash; RangePoint, SBAS, and autonomous positions are not supported), and a Field-IQ Rate and Section Control module with an active Remote Output license.</p>" +
      "<p>Before configuring Remote Output, the guide requires validating vehicle antenna measurements (height, left/right offset, rear-axle offset), hitch measurements, and implement hitch-to-application-point offsets, since accurate placement depends entirely on those numbers being correct.</p>",
  },
  "gfx-displays-eu-declaration-of-conformity": {
    keyPoints: [
      "Official EU Declaration of Conformity certificate covering the GFX display line",
    ],
    bodyHtml:
      "<p>The official EU Declaration of Conformity for the GFX display series, confirming the product line's compliance documentation for sale and use within the European Union. This is a regulatory certificate rather than a technical or feature document &mdash; see the GFX Series Display User Guide for setup and operation.</p>",
  },
  "nav-960-eu-declaration-of-conformity": {
    keyPoints: [
      "Official EU Declaration of Conformity certificate covering the NAV-960 GNSS guidance controller",
    ],
    bodyHtml:
      "<p>The official EU Declaration of Conformity for the NAV-960 GNSS guidance controller, confirming its compliance documentation for sale and use within the European Union. This is a regulatory certificate rather than a technical or feature document.</p>",
  },
  "farmengage-agco-id": {
    keyPoints: [
      "AGCO ID is a single sign-on shared across FarmENGAGE, FendtONE offboard, and NEXT Farming Live",
      "New users can create an AGCO ID directly from the platform through a guided setup, or merge it with existing accounts on those platforms",
      "Covers account creation, account merging, standard login, and password reset",
    ],
    bodyHtml:
      "<p>AGCO ID is the single email-and-password login customers and dealers use to access FarmENGAGE, FendtONE offboard (where available), and NEXT Farming Live (where available). This guide walks through creating a new AGCO ID from the PTx landing page, merging it with accounts you already have on those other platforms, logging in to FarmENGAGE with an existing AGCO ID, and resetting a forgotten password &mdash; all through a guided, verification-code-based setup flow.</p>",
  },
  "farmengage-analytics": {
    keyPoints: [
      "Reports are generated from Analytics > Reports using the report builder",
      "Reports are based on Crop Zone Activities data only",
    ],
    bodyHtml:
      "<p>A short guide to FarmENGAGE's Analytics module: navigate to Analytics &gt; Reports, choose a report type from the report builder, and click Generate Report. Reports pull exclusively from Crop Zone Activities data, so activity records need to be logged in FarmENGAGE before a report will reflect them.</p>",
  },
  "farmengage-autosync": {
    keyPoints: [
      "Requires a GFX or XCN display, an active Display Connection license, and Precision-IQ v6.0+ (v6.2+ syncs vehicles, implements, and materials)",
      "AutoSync must be enabled on both the FarmENGAGE web side (Data Transfer > Settings) and the Precision-IQ display's Syncing Features settings",
      "Automatically syncs fields, boundaries, guidance lines, clients, farms, vehicles, implements, profiles, materials, operators, work orders, and task coverage",
      "Sync status can be monitored from FarmENGAGE, from Precision-IQ's Pulse diagnostics icon, or from the on-display AutoSync Service App",
    ],
    bodyHtml:
      "<p>Step-by-step setup for AutoSync, which wirelessly moves data between a Precision-IQ display and FarmENGAGE without manual file transfers. Setup covers assigning a licensed device to a vehicle in FarmENGAGE, enabling AutoSync under Data Transfer &gt; Settings, and choosing which processing options (auto-creating operators, vehicles, and fields from display data) stay enabled.</p>" +
      "<p>On the display side, AutoSync is enabled from the Syncing Features tab in Precision-IQ settings, which launches a setup wizard showing a sync preview and estimated sync time before starting. Requirements are a GFX or XCN display, an active Display Connection license, and Precision-IQ v6.0 or later &mdash; v6.2+ is needed to sync vehicles, implements, and materials in addition to fields and task data. Sync status can be checked from FarmENGAGE's Sync Activity tab, the Pulse diagnostics icon in Precision-IQ, or the dedicated AutoSync Service App on the display.</p>",
  },
  "farmengage-crop-rotation-planning": {
    keyPoints: [
      "Sequentially ordered plans track multiple crops harvested in sequence on the same ground in one season",
      "Split plans track multiple crops planted in different areas of the same field at once",
      "Crop zones can be split by rectangle, circle, polygon, or line directly from the crop rotation workflow",
      "Plans lock automatically once a planting or seeding activity is logged against them",
    ],
    bodyHtml:
      "<p>Covers building out a Crop Rotation Plan under Plan &gt; Crop Rotation Plan for each field and crop season. Two plan types are supported: sequentially ordered plans (for double-cropping, where crop sequence is set to 1, then 2) and split plans (for multiple crops in different parts of the same field in the same season, all set to sequence 1).</p>" +
      "<p>The guide also covers splitting an existing crop zone into multiple pieces using rectangle, circle, polygon, or line drawing tools, multi-selecting plans for bulk edit/remove/CSV export, filtering and searching the plan list, and how locked plans work &mdash; a plan locks once a planting or seeding activity has been recorded against it, and can only be unlocked by deleting that activity record.</p>",
  },
  "farmengage-crop-zone-activities": {
    keyPoints: [
      "Each crop zone has six activity tabs: Profitability, Seeding, Fertility, Crop Protection, Harvest, and Irrigation",
      "Profitability shows overall net income per crop zone; the other tabs show the underlying activity history",
    ],
    bodyHtml:
      "<p>A quick-reference guide to the six tabs available for any crop zone, all accessed by selecting a year and crop zone at the top of the page: Profitability (overall net income for the crop zone), Seeding history, Fertility (fertilizer use history), Crop Protection (chemical application history), Harvest history, and Irrigation history.</p>",
  },
  "farmengage-crops-and-crop-seasons": {
    keyPoints: [
      "Crops are added from a master list under Setup > Crops, with editable pricing and deletion support",
      "Crop aliases help the system recognize unfamiliar crop names on file import",
      "Crop seasons define the harvest year, activity date range, and optional subcrop for a given crop",
    ],
    bodyHtml:
      "<p>Covers setting up the crop list that feeds every other part of FarmENGAGE: adding crops from the master list under Setup &gt; Crops, updating crop price, deleting crops, and creating crop aliases so imported files with non-standard crop names still match correctly.</p>" +
      "<p>The second half covers Crop Seasons &mdash; adding a season with its harvest year, crop, activity start/end dates, and optional subcrop, plus editing and deleting seasons (a season with crop zones attached can't be deleted until those crop zones are removed).</p>",
  },
  "farmengage-direct-send-and-exporting-resources": {
    keyPoints: [
      "Resource exports can include all organization data or a customized selection of fields, boundaries, guidance lines, landmarks, equipment, materials, operators, and crops",
      "Supported export formats include PTx Trimble AgData, AgGPS, ISOXML, CNH .cn1, Ag Leader Integra, Ag Leader InCommand, John Deere, and Loup RDS",
      "Files can be sent directly to a connected AGCO machine via the TaskDoc API, or to a PTx Trimble display",
      "Remote Output shapefiles (.shp/.shx/.dbf) can be direct-sent to displays outside the normal resource export flow",
    ],
    bodyHtml:
      "<p>Covers building a resource export file (Data Transfer &gt; Resource Exports), choosing between exporting everything or customizing which fields, boundaries, guidance lines, landmarks, equipment, and materials are included, and picking a file format &mdash; the customization options change depending on which format is selected.</p>" +
      "<p>Supported formats include PTx Trimble AgData, AgGPS, ISOXML, CNH .cn1, Ag Leader Integra, Ag Leader InCommand, John Deere, and Loup RDS, each supporting a different subset of data types. Files can be downloaded directly, sent to a connected AGCO machine over the TaskDoc API, or sent straight to a PTx Trimble display &mdash; with send history tracked and resendable from the resource export detail view. A separate workflow covers direct-sending Remote Output shapefiles (.shp, .shx, .dbf together) to a display.</p>",
  },
  "farmengage-data-inbox": {
    keyPoints: [
      "Cross-organization task sharing lets one organization send field boundaries, crop zone boundaries, and materials to another by email address",
      "Incoming tasks can be previewed, edited to resolve naming conflicts, then accepted or rejected",
      "Auto-accept can be enabled per organization to skip manual review of incoming shares",
    ],
    bodyHtml:
      "<p>Covers the Data Inbox, which handles task data shared between organizations in FarmENGAGE. A sender selects one or more tasks, shares them to a recipient's email address, and the recipient sees the shared file appear in their Data Inbox across every organization tied to that email.</p>" +
      "<p>Recipients can preview an incoming task before accepting &mdash; editing field/crop zone or material details where there's no existing match in their organization &mdash; then accept (adding the data as shown) or reject it (adding nothing). Auto-accept can be turned on to skip manual review, with specific behavior when a user belongs to multiple organizations. The Data Inbox list can also be filtered by date range, source organization, or field, and searched by task name.</p>",
  },
  "farmengage-equipment-activity-and-crop-zone-activity": {
    keyPoints: [
      "Equipment Activity tasks are imported under Data Transfer > Manage Files > Upload, then viewed with sensor-layer maps and inputs",
      "The Report Builder generates printable reports with selectable sensor map pages",
      "Tasks can be exported to Shapefile or ISOXML, merged, reassigned, and shared cross-organization",
      "Crop Zone Activities can be created, managed, and split directly from this same activity view",
    ],
    bodyHtml:
      "<p>Covers importing as-applied task files (Data Transfer &gt; Manage Files &gt; Upload), viewing a task's sensor layers on the map (elevation, applied rate, speed, etc.), reviewing task inputs, and generating a Report Builder report with selectable sensor map pages for printing.</p>" +
      "<p>Also covers downloading the original task source file, editing and verifying task data, reassigning tasks, filtering and searching the task list, merging tasks (manually or automatically), exporting to industry-standard Shapefile or ISOXML formats, and cross-organization task sharing with send-history tracking. The Crop Zone Activities section covers creating and managing a crop zone activity, navigating back to Field Manager, and splitting a crop zone directly from the activity view.</p>",
  },
  "farmengage-equipment": {
    keyPoints: [
      "Vehicles require a licensed device (Display Connection license) before they can be assigned in FarmENGAGE",
      "Vehicle and implement profiles are created on the Precision-IQ display and sync back to FarmENGAGE automatically",
      "Vehicles and implements can be merged, retired/unretired, and grouped for fleet organization",
      "AgData vehicle and implement profiles can be imported directly from a zipped file"
    ],
    bodyHtml:
      "<p>Covers setting up the equipment that everything else in FarmENGAGE hangs off of. For vehicles: adding a device and Display Connection license, adding a vehicle and assigning a device to it, editing, retiring/unretiring, searching, merging duplicate vehicle records, and importing a zipped Precision-IQ AgData vehicle profile.</p>" +
      "<p>The guide explains the vehicle/profile relationship directly: a vehicle is created in FarmENGAGE and a display is assigned to it, then vehicle profiles are created in Precision-IQ and automatically linked back to that vehicle online. The Implements section mirrors this for implements and implement profiles &mdash; with one difference from vehicles: implement profiles are visible and usable on every AutoSync display in the organization, not just the one that created them. Equipment groups let vehicles or implements be grouped (e.g. all tractors, or everything stored at one location) for fleet organization.</p>",
  },
  "farmengage-farm-map": {
    keyPoints: [
      "The Map is FarmENGAGE's home page: a real-time view of fields, crop zones, fleet locations, and job progress",
      "Serves as the central navigation hub into Field Manager, Crop Zone Activities, and Fleet",
      "Work Orders require a FarmENGAGE-Operations license; display-compatible ones sync automatically over AutoSync",
      "Fleet tracking includes fuel level and engine hours when synced via CAN bus from a PTx Trimble display",
    ],
    bodyHtml:
      "<p>The Farm Map is the first page you see after signing in to FarmENGAGE, giving a real-time visual overview of an entire operation: fields and crop zones, vehicle locations, and job progress, with direct links into Field Manager, Crop Zone Activities, and Fleet.</p>" +
      "<p>The guide covers adding, downloading, retiring, and deleting fields and crop zones directly from the map; switching between field and crop zone boundary views; hover interactions showing client/farm/boundary details and fleet status; adding and managing tasks with report generation and Shapefile/ISOXML export; Work Orders (which require a FarmENGAGE-Operations license, and can be emailed, marked done, or reset); and Fleet, which shows vehicle status, fuel level, and engine hours when synced over CAN bus from a connected PTx Trimble display, plus historical location path viewing. A dedicated Print section covers building printable field and crop zone maps.</p>",
  },
  "farmengage-field-manager": {
    keyPoints: [
      "The most detailed field-editing tool: boundaries, guidance lines, landmarks, management zones, crop zones, and prescriptions all live here",
      "Guidance lines can be created, imported, edited, sorted, and downloaded as Shapefile or .kmz",
      "Management zones support Permanent Zone and Nutrient Zone flags",
      "Prescriptions can be created zone-by-zone or imported from a shapefile, then sent directly to a vehicle",
    ],
    bodyHtml:
      "<p>Field Manager is FarmENGAGE's most detailed field-editing tool, reached from any field in Setup &gt; Fields. It covers importing clients/farms/fields from shapefiles, creating a field by drawing on the map, editing, merging, retiring, and deleting fields.</p>" +
      "<p>Boundaries, guidance lines, and landmarks can each be created by hand, drawn or driven, or imported from shapefiles &mdash; guidance lines specifically can be sorted alphabetically or by date, downloaded as Shapefile or .kmz, and converted to a landmark line. Management zones support Permanent Zone and Nutrient Zone designations, with duplicate and print-report tools. Crop Zones can be created, downloaded, replaced with the field's full extent, split with map tools, duplicated, or copied. The Prescriptions section covers building a rate-zone prescription by hand or importing one from a shapefile, then sending it directly to a vehicle and tracking send history. A View Layers tool lets any imported layer be toggled on or off over the map.</p>",
  },
  "farmengage-initial-organization-creation-and-management": {
    keyPoints: [
      "First-time sign-in prompts for organization name, country, time zone, units of measure, and currency",
      "Unit settings exist at both the organization level (backend processing/exports) and the user level (interface display)",
      "A Display Link license bundles a 1-year FarmENGAGE-Data license with a 1-year Display Connection license on new GFX display purchases",
      "Five user licenses are included with every organization-level license",
    ],
    bodyHtml:
      "<p>Covers the initial setup every new FarmENGAGE organization goes through &mdash; naming the organization and setting country, time zone, units of measure, and currency &mdash; along with updating those organization settings later, and the separate personal User Settings menu.</p>" +
      "<p>An important distinction the guide draws out: organization-level units control backend processing and unattended exports, while user-level units control what's displayed in that person's interface only. It also covers managing multiple organizations and switching between them, and licensing: Farm Subscriptions (organization, user, and Display Connection licenses purchased through a PTx Trimble dealer), the Display Link license bundle that comes free with new GFX display purchases (1 year of FarmENGAGE-Data plus 1 year of Display Connection), and enabling the optional Scouting module for field scouting records and reports.</p>",
  },
  "farmengage-materials": {
    keyPoints: [
      "Six material types are supported: crop protection products, fertilizers, lime, seed, water, and tank mixes",
      "Materials used with a connected PTx Trimble display need Controller Details (rate range) added for rate control to work",
      "Bulk material import via task upload supports nine file formats including Ag Leader AGDATA",
      "Duplicate materials can be merged, and unused materials retired without losing history",
    ],
    bodyHtml:
      "<p>Covers building out the Materials list in FarmENGAGE: creating crop protection products, fertilizers, lime, seed, and water records (most searchable against a built-in product database, with manual entry as a fallback), plus building tank mixes by rate or by quantity with a defined tank size.</p>" +
      "<p>For any material used with a connected PTx Trimble display, the guide flags that Controller Details (Rate 1, Rate 2, rate increment, minimum and maximum rate) need to be filled in for rate control to work &mdash; materials missing this show a red warning icon that links directly to the fix. Materials can be edited, merged, retired, and unretired, and bulk-imported via task upload from nine supported file formats: AgGPS, Precision-IQ AgData, CNH Voyager 2, ISO TaskData, John Deere GS3/GS4, Ag Leader AGDATA, Raven Binary/FMIS Job Data, and Loup RDS.</p>",
  },
  "farmengage-mobile": {
    keyPoints: [
      "The mobile app supports adding clients, farms, and fields, plus driving or drawing field/crop zone boundaries in-field",
      "Map layers can be switched to show alternate boundaries or as-applied coverage maps",
      "Get Directions routes to any crop zone using the phone's default navigation app",
    ],
    bodyHtml:
      "<p>Covers the core field workflows available on the FarmENGAGE mobile app, signed in with the same AGCO ID used on the web. Clients, farms, and fields can be added directly from the mobile home screen, with field boundaries either driven (drive the perimeter, tap Start/Done) or drawn on the map point-by-point.</p>" +
      "<p>Also covers switching map layers to view alternate boundaries or as-applied coverage maps for any crop zone, getting turn-by-turn directions to a crop zone through the phone's default navigation app (requires cellular connectivity), and creating new crop zones in the field the same driven-or-drawn way as field boundaries.</p>",
  },
  "farmengage-oem-apis": {
    keyPoints: [
      "One-click API connections link FarmENGAGE to agrirouter, Raven Slingshot, AGCO Variodoc, John Deere Operations Center, Case IH, New Holland, and Steyr",
      "Connections are made under Data Transfer > Connect Apps > API Connections and authenticate through the third party's own login page",
    ],
    bodyHtml:
      "<p>A short guide to importing data through OEM API connections: navigate to Data Transfer &gt; Connect Apps &gt; API Connections, add an account, and choose from agrirouter, Raven Slingshot, AGCO Variodoc, John Deere Operations Center, Case IH, New Holland, or Steyr. Each opens the third party's own login page for authentication; once linked, that account's vehicles and data become visible inside FarmENGAGE.</p>",
  },
  "farmengage-people": {
    keyPoints: [
      "Contacts can be granted system access (login), equipment operator access, or both",
      "Operator permission levels control what an operator can see and do in Precision-IQ once display sign-in is required",
      "Partnerships let another organization (such as a dealer) be granted managed access to your account",
    ],
    bodyHtml:
      "<p>Covers everything under Setup &gt; People. Contacts can be created with optional system access (counted against the five included user licenses, and grantable only by an Organization Admin) and optional Equipment Operator access, which controls whether that person can operate licensed equipment and at what permission level.</p>" +
      "<p>Operator Sign In can be toggled on to require a 4-digit PIN before a display can be used, unlocking granular Operator Permission Levels for what that operator can see and do in Precision-IQ. The Partnerships section covers adding, editing, and deleting a partnership &mdash; typically used to give a dealer or other organization managed access to your FarmENGAGE account.</p>",
  },
  "farmengage-prescriptions": {
    keyPoints: [
      "Prescriptions can be imported from a zipped shapefile or built directly from a management zone and material",
      "Prescriptions can be sent to a single vehicle or in bulk, with full send history and resend support",
      "This guide covers the organization-wide Plan > Prescriptions view; prescriptions can also be managed at the field level in Field Manager",
    ],
    bodyHtml:
      "<p>Covers managing prescriptions from the organization-wide Plan &gt; Prescriptions page (the same functionality is also available at the field level inside Field Manager). Prescriptions can be imported from a zipped shapefile, mapping the rate column, material, and unit of measure on the way in, or created from scratch by selecting a field, material, and management zone and entering a rate for each zone.</p>" +
      "<p>Once built, prescriptions can be sent to a single vehicle or in bulk to multiple vehicles, with full send history and one-click resend. The guide also covers deleting single or bulk prescriptions, downloading them individually or in bulk, and searching/filtering the prescriptions list.</p>",
  },
  "farmengage-work-orders": {
    keyPoints: [
      "Display-compatible work orders sync automatically to Precision-IQ over AutoSync when the criteria are met (single material, valid vehicle/implement selection)",
      "Non-display-compatible operations like irrigation or mechanical work can still be tracked in FarmENGAGE even though they aren't run through a tractor",
      "Work orders move through Planned, In Progress, and Done status, and can be reset back to Planned",
    ],
    bodyHtml:
      "<p>Covers creating, editing, copying, and deleting Work Orders under Plan &gt; Work Orders. A work order syncs automatically to a connected Precision-IQ display over AutoSync when it uses a display-compatible operation type, has no more than one material selected, and has either a vehicle with at least one profile or no vehicle selected at all. Non-display-compatible operations like irrigation or mechanical work can still be created and tracked, just not run through a tractor's display.</p>" +
      "<p>On the display, operators select the work order from a list and tap the run icon to start; stopping the run screen prompts marking the work order Complete or Paused, which updates its status back in FarmENGAGE automatically. Completed or in-progress work orders can be reset back to Planned status, which deletes all related tasks. Work order reports can be emailed or viewed, and the guide notes a 50-work-order limit per single report.</p>",
  },
  "farmengage-connectivity-center": {
    keyPoints: [
      "Connectivity Center links AGCO machines (Fendt, Massey Ferguson, Valtra) and third-party platforms to FarmENGAGE from one place",
      "Machines are added by VIN, then verified with a PIN or QR code sent to the in-cab terminal",
      "Requires specific hardware (NT0x/DCU with an active SIM data plan) and terminal software unlocks per brand",
      "Includes a dedicated workflow for routing AGCO machine data to and from John Deere Operations Center",
    ],
    bodyHtml:
      "<p>Connectivity Center, found under the Data Transfer dropdown, is the hub for connecting AGCO machines and third-party platforms to FarmENGAGE and managing how data routes between them.</p>" +
      "<p>Adding a machine requires the VIN, followed by verifying a PIN or scanning a QR code sent to the in-cab terminal; a successful connection auto-creates a vehicle in FarmENGAGE. Hardware requirements are an NT0x or DCU unit with an active-data-plan SIM card, plus the relevant terminal software unlock (Fendt's Agronomy Basic Package, or TaskDoc Pro for Massey Ferguson and Valtra) &mdash; notably, no Task Management subscription is required to use Connectivity Center itself. The guide also covers managing machine-to-machine and machine-to-platform data routing, the activity log, and a dedicated end-to-end workflow for routing AGCO machine data through John Deere Operations Center, including sending prescriptions and receiving completed tasks back.</p>",
  },
  "farmengage-agco-equipment-operations-activation": {
    keyPoints: [
      "Covers activating a bundled FarmENGAGE license included with new Fendt, Massey Ferguson, or Valtra equipment purchases (region-dependent)",
      "Activation happens through Connectivity Center by adding the machine and completing a data-access verification process",
    ],
    bodyHtml:
      "<p>In regions where FarmENGAGE is bundled with new Fendt, Massey Ferguson, or Valtra equipment, this guide covers unlocking that included license. The user creates a FarmENGAGE account, adds the new machine in Connectivity Center by VIN, and completes the machine data access verification process &mdash; if the machine qualifies for the bundle, the license is applied automatically without a separate purchase step.</p>",
  },
};

let manualsUpdated = 0;
for (const r of resources) {
  if (r.category !== "manual") continue;
  const content = MANUAL_CONTENT[r.slug];
  if (!content) {
    console.log(`NO CONTENT WRITTEN for manual: ${r.slug}`);
    continue;
  }
  r.keyPoints = content.keyPoints;
  const downloadLink = `<p><a href="${r.pdfUrl}" target="_blank" rel="noopener noreferrer">Download the full PDF</a></p>`;
  r.bodyHtml = content.bodyHtml + downloadLink;
  manualsUpdated++;
}
console.log(`Manual resources updated: ${manualsUpdated}/29`);

// ---------------------------------------------------------------------------
// 4. Fix relatedProductSlugs after dedupe
// ---------------------------------------------------------------------------
let relatedFixed = 0;
for (const r of resources) {
  if (!Array.isArray(r.relatedProductSlugs) || r.relatedProductSlugs.length === 0) continue;
  const remapped = r.relatedProductSlugs.map((s) => slugRemap.get(s) || s);
  const deduped = [...new Set(remapped)];
  if (JSON.stringify(deduped) !== JSON.stringify(r.relatedProductSlugs)) {
    r.relatedProductSlugs = deduped;
    relatedFixed++;
  }
}
console.log(`Resources with relatedProductSlugs fixed: ${relatedFixed}`);

fs.writeFileSync(productsPath, JSON.stringify(productsAfterDedupe, null, 2));
fs.writeFileSync(resourcesPath, JSON.stringify(resources, null, 2));
console.log("Wrote products.json and resources.json");
