import meta from "../../_data/catalog-meta.json";

export const onRequestGet: PagesFunction = async () => {
  return Response.json(meta);
};
