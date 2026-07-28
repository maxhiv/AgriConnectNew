import vendorResources from "../../_data/vendor-resources.json";

export const onRequestGet: PagesFunction = async ({ params }) => {
  const slug = params.slug as string;
  const vendor = (vendorResources as any[]).find((v) => v.slug === slug);

  if (!vendor) {
    return Response.json({ error: "Vendor not found" }, { status: 404 });
  }

  return Response.json(vendor);
};
