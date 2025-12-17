// Product image data exported from development database
// This data is merged during the product sync to ensure images are preserved

import productImagesData from '../product_images_export.json';

interface ProductImageData {
  primaryImage?: string;
  logoDarkGreen?: string;
  logoBlack?: string;
  logoWhite?: string;
  images?: string[];
}

const productImagesCache: Record<string, ProductImageData> = productImagesData as Record<string, ProductImageData>;

export function getProductImages(): Record<string, ProductImageData> {
  return productImagesCache;
}

export function getProductImageData(slug: string): ProductImageData | undefined {
  return productImagesCache[slug];
}
