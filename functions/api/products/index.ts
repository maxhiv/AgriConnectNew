import products from "../../_data/products.json";

export const onRequestGet: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  const equipment = url.searchParams.get("equipment");
  const category = url.searchParams.get("category");
  const brand = url.searchParams.get("brand");

  let result = products as any[];

  if (brand) {
    result = result.filter((p) => p.brand === brand);
  } else if (equipment) {
    result = result.filter((p) => p.equipment === equipment);
  } else if (category) {
    result = result.filter((p) => p.category === category);
  }

  return Response.json(result);
};
