import resources from "../../_data/resources.json";

export const onRequestGet: PagesFunction = async ({ params }) => {
  const slug = params.slug as string;
  const resource = (resources as any[]).find((r) => r.slug === slug);

  if (!resource) {
    return Response.json({ error: "Resource not found" }, { status: 404 });
  }

  return Response.json(resource);
};
