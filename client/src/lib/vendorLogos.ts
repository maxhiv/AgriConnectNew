// Fallback vendor/brand logos, shown in place of a product photo whenever a
// catalog product or vendor-resource item has no image of its own. Keyed by
// the exact brand string used in products.json / vendor-resources.json.
export const vendorLogos: Record<string, string> = {
  "PTx Trimble": "/assets/vendor-logos/ptx-trimble-logo.png",
  "Ag Leader": "/assets/vendor-logos/ag-leader-logo.png",
  "SurePoint Ag": "/assets/vendor-logos/surepoint-ag-logo.png",
  Salford: "/assets/vendor-logos/salford-logo.png",
  AMAZONE: "/assets/vendor-logos/amazone-logo.png",
  "360 Yield Center": "/assets/vendor-logos/360-yield-center-logo.png",
  XAG: "/assets/vendor-logos/xag-logo.png",
  CapstanAg: "/assets/vendor-logos/capstanag-logo.png",
  "Harvest International": "/assets/vendor-logos/harvest-international-logo.png",
};

export function getVendorLogo(brand: string | undefined | null): string | null {
  if (!brand) return null;
  return vendorLogos[brand] || null;
}
