import products from "../../_data/products.json";

export const onRequestGet: PagesFunction = async ({ params }) => {
  const slug = params.slug as string;
  const product = (products as any[]).find((p) => p.slug === slug);

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  // Note: the original app could optionally live-scrape the OEM page when
  // ?enrich=true was passed (via a Python subprocess). That's not available
  // in the Cloudflare Pages edge runtime, and it always fell back to the
  // plain product record on any failure anyway, so we just return the
  // stored record directly here.
  return Response.json(product);
};
