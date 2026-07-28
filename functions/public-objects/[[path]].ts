// The original app proxied private-object-storage files through a
// Replit-specific sidecar (GCS). That's not reachable from Cloudflare, and
// in practice was already broken on the live site (500s). No product/news
// content references this path anymore (the one real usage, the hero video,
// was switched to a bundled static asset). Kept as a clean 404 rather than
// a hard error for any stray legacy links.
export const onRequest: PagesFunction = async () => {
  return Response.json({ error: "File not found" }, { status: 404 });
};
