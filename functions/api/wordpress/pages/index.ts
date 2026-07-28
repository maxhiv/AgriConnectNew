const WORDPRESS_BASE_URL = "https://max6075b20c2f26-ilcsj.wpcomstaging.com/wp-json/wp/v2";

export const onRequestGet: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10) || 10;

  try {
    const res = await fetch(`${WORDPRESS_BASE_URL}/pages?per_page=${limit}&_embed`);
    if (!res.ok) {
      throw new Error(`Failed to fetch pages: ${res.statusText}`);
    }
    const pages = await res.json();
    return Response.json({ success: true, data: pages });
  } catch (error) {
    console.error("Error fetching WordPress pages:", error);
    return Response.json(
      { success: false, message: "Failed to fetch pages from WordPress" },
      { status: 500 }
    );
  }
};
