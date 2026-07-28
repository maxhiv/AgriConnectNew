import news from "../../_data/news.json";

export const onRequestGet: PagesFunction = async ({ params }) => {
  const slug = params.slug as string;
  const article = (news as any[]).find((a) => a.slug === slug);

  if (!article) {
    return Response.json({ error: "Article not found" }, { status: 404 });
  }

  return Response.json(article);
};
