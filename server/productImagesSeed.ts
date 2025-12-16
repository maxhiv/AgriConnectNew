// Product image data exported from development database
// This data is merged during the product sync to ensure images are preserved

import fs from 'fs';
import path from 'path';

interface ProductImageData {
  primaryImage?: string;
  logoDarkGreen?: string;
  logoBlack?: string;
  logoWhite?: string;
  images?: string[];
}

let productImagesCache: Record<string, ProductImageData> | null = null;

export function getProductImages(): Record<string, ProductImageData> {
  if (productImagesCache) {
    return productImagesCache;
  }
  
  try {
    const filePath = path.join(process.cwd(), 'product_images_export.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    productImagesCache = JSON.parse(data);
    return productImagesCache || {};
  } catch (error) {
    console.error('Error loading product images:', error);
    return {};
  }
}

export function getProductImageData(slug: string): ProductImageData | undefined {
  const images = getProductImages();
  return images[slug];
}
