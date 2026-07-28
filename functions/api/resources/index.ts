import resources from "../../_data/resources.json";

export const onRequestGet: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const productSlug = url.searchParams.get("productSlug");

  let result = resources as any[];

  if (category) {
    result = result.filter((r) => r.category === category);
  }
  if (productSlug) {
    result = result.filter((r) => r.relatedProductSlugs.includes(productSlug));
  }

  return Response.json(result);
};
