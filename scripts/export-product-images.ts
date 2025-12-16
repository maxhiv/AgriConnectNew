import { db } from "../server/db";
import { products } from "../shared/schema";
import { isNotNull, or } from "drizzle-orm";
import fs from "fs";

async function exportProductImages() {
  const productsWithImages = await db
    .select({
      slug: products.slug,
      primaryImage: products.primaryImage,
      logoDarkGreen: products.logoDarkGreen,
      logoBlack: products.logoBlack,
      logoWhite: products.logoWhite,
      images: products.images,
    })
    .from(products)
    .where(
      or(
        isNotNull(products.primaryImage),
        isNotNull(products.logoDarkGreen),
        isNotNull(products.logoBlack),
        isNotNull(products.logoWhite)
      )
    );

  const imageMap: Record<string, any> = {};
  for (const p of productsWithImages) {
    imageMap[p.slug] = {
      primaryImage: p.primaryImage || undefined,
      logoDarkGreen: p.logoDarkGreen || undefined,
      logoBlack: p.logoBlack || undefined,
      logoWhite: p.logoWhite || undefined,
      images: p.images && p.images.length > 0 ? p.images : undefined,
    };
  }

  fs.writeFileSync(
    "product_images_export.json",
    JSON.stringify(imageMap, null, 2)
  );
  console.log(`Exported image data for ${Object.keys(imageMap).length} products`);
  process.exit(0);
}

exportProductImages().catch(console.error);
