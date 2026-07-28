const WORDPRESS_BASE_URL = "https://max6075b20c2f26-ilcsj.wpcomstaging.com/wp-json/wp/v2";

export const onRequestGet: PagesFunction = async ({ params }) => {
  const slug = params.slug as string;

  try {
    const res = await fetch(`${WORDPRESS_BASE_URL}/pages?slug=${slug}&_embed`);
    if (!res.ok) {
      throw new Error(`Failed to fetch page: ${res.statusText}`);
    }
    const pages = await res.json();
    const page = Array.isArray(pages) && pages.length > 0 ? pages[0] : null;

    if (!page) {
      return Response.json({ success: false, message: "Page not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: page });
  } catch (error) {
    console.error("Error fetching WordPress page:", error);
    return Response.json(
      { success: false, message: "Failed to fetch page from WordPress" },
      { status: 500 }
    );
  }
};
