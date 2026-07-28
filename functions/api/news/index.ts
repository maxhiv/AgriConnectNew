import news from "../../_data/news.json";

export const onRequestGet: PagesFunction = async () => {
  return Response.json(news);
};
