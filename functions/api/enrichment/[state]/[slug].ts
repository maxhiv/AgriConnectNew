import enrichmentAll from "../../../_data/enrichment-all.json";

export const onRequestGet: PagesFunction = async ({ params }) => {
  const state = params.state as string;
  const slug = params.slug as string;
  const key = `${state}/${slug}`;
  const content = (enrichmentAll as Record<string, unknown>)[key];

  if (!content) {
    return Response.json({ error: "Enrichment content not found" }, { status: 404 });
  }

  return Response.json(content);
};
