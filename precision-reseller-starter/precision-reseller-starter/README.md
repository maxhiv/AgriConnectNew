# Precision Reseller Starter (Static Site)

A lightweight, brandable site you can drop into Replit or any static host. It provides a homepage, product directory with filters, product detail pages, basic locations page, resources hub, and a copy-to-clipboard quote form.

## Quick Start (Replit)
1) Create a new **Static HTML/CSS/JS** Repl.
2) Upload the contents of this folder.
3) Click **Run** to start the web server and preview.

## Theming
Edit `assets/style.css` and change CSS variables under `:root`:
- `--brand-bg`, `--brand-accent`, etc.
Replace `assets/logo.svg` with your dealer logo.

## Products
Edit `data/products.json`. Each product has:
```json
{
  "name": "DeltaForce",
  "equipment": "Planters",
  "category": "Downforce Control",
  "tagline": "Hydraulic downforce control per row.",
  "oem_url": "https://www.precisionplanting.com/products/planters/deltaforce",
  "highlights": ["Per-row automation", "Real-time response", "Improves emergence"],
  "works_with": ["20|20"]
}
```

## Routing
- `products.html` renders the full list from `data/products.json`
- `product.html?slug=deltaforce` renders a product detail
- Add/edit pages like `service.html` as needed

## Lead Form
The contact form copies the lead text to clipboard. Swap the form handler to your CRM/post endpoint when ready.

## Legal
This kit avoids copying proprietary text or imagery. Product names and links are used for identification. Follow your dealer agreement for brand assets and usage.