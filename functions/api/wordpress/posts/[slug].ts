const WORDPRESS_BASE_URL = "https://max6075b20c2f26-ilcsj.wpcomstaging.com/wp-json/wp/v2";

export const onRequestGet: PagesFunction = async ({ params }) => {
  const slug = params.slug as string;

  try {
    const res = await fetch(`${WORDPRESS_BASE_URL}/posts?slug=${slug}&_embed`);
    if (!res.ok) {
      throw new Error(`Failed to fetch post: ${res.statusText}`);
    }
    const posts = await res.json();
    const post = Array.isArray(posts) && posts.length > 0 ? posts[0] : null;

    if (!post) {
      return Response.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    return Response.json({ success: true, data: post });
  } catch (error) {
    console.error("Error fetching WordPress post:", error);
    return Response.json(
      { success: false, message: "Failed to fetch post from WordPress" },
      { status: 500 }
    );
  }
};
