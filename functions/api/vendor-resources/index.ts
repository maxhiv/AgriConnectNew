import vendorResources from "../../_data/vendor-resources.json";

// Serves the full vendor resource library: every product found during the
// vendor-site research sweep (Nov 2025 client vendor list), grouped by
// vendor, including brochure/spec-sheet links. Flagship products among
// these also exist as full catalog entries in /api/products (cross-linked
// here via each product's `catalogSlug`).
export const onRequestGet: PagesFunction = async () => {
  return Response.json(vendorResources);
};
