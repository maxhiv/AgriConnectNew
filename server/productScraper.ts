import { storage } from './storage';

interface ScrapedMetadata {
  ogImage: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  metaDescription: string | null;
  twitterImage: string | null;
  canonicalUrl: string | null;
  additionalImages: string[];
}

interface EnrichmentResult {
  success: boolean;
  productId: string;
  productName: string;
  metadata?: ScrapedMetadata;
  error?: string;
}

async function fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

function extractMetaContent(html: string, property: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`, 'i'),
    new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${property}["']`, 'i'),
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

function extractAllImages(html: string, baseUrl: string): string[] {
  const images: string[] = [];
  const imgPattern = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let match;
  
  while ((match = imgPattern.exec(html)) !== null) {
    let src = match[1];
    if (src.startsWith('//')) {
      src = 'https:' + src;
    } else if (src.startsWith('/')) {
      const url = new URL(baseUrl);
      src = url.origin + src;
    } else if (!src.startsWith('http')) {
      continue;
    }
    
    if (src.includes('.svg') || src.includes('logo') || src.includes('icon') || 
        src.includes('tracking') || src.includes('pixel') || src.includes('analytics')) {
      continue;
    }
    
    if (!images.includes(src) && images.length < 10) {
      images.push(src);
    }
  }
  
  return images;
}

function extractCanonicalUrl(html: string): string | null {
  const pattern = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i;
  const match = html.match(pattern);
  return match ? match[1] : null;
}

export async function scrapeProductMetadata(url: string): Promise<ScrapedMetadata> {
  try {
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      console.log(`Failed to fetch ${url}: ${response.status}`);
      return {
        ogImage: null,
        ogTitle: null,
        ogDescription: null,
        metaDescription: null,
        twitterImage: null,
        canonicalUrl: null,
        additionalImages: []
      };
    }
    
    const html = await response.text();
    
    const ogImage = extractMetaContent(html, 'og:image');
    const ogTitle = extractMetaContent(html, 'og:title');
    const ogDescription = extractMetaContent(html, 'og:description');
    const metaDescription = extractMetaContent(html, 'description');
    const twitterImage = extractMetaContent(html, 'twitter:image');
    const canonicalUrl = extractCanonicalUrl(html);
    const additionalImages = extractAllImages(html, url);
    
    return {
      ogImage,
      ogTitle,
      ogDescription,
      metaDescription,
      twitterImage,
      canonicalUrl,
      additionalImages
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return {
      ogImage: null,
      ogTitle: null,
      ogDescription: null,
      metaDescription: null,
      twitterImage: null,
      canonicalUrl: null,
      additionalImages: []
    };
  }
}

export async function enrichProduct(productId: string): Promise<EnrichmentResult> {
  try {
    const product = await storage.getProduct(productId);
    
    if (!product) {
      return { success: false, productId, productName: 'Unknown', error: 'Product not found' };
    }
    
    if (!product.oemUrl) {
      return { success: false, productId, productName: product.name, error: 'No OEM URL available' };
    }
    
    console.log(`Enriching product: ${product.name} from ${product.oemUrl}`);
    const metadata = await scrapeProductMetadata(product.oemUrl);
    
    const updates: Partial<typeof product> = {};
    
    if (metadata.ogImage || metadata.twitterImage) {
      updates.primaryImage = metadata.ogImage || metadata.twitterImage;
    }
    
    if (metadata.ogDescription || metadata.metaDescription) {
      if (!product.enrichedDescription) {
        updates.enrichedDescription = metadata.ogDescription || metadata.metaDescription;
      }
    }
    
    if (metadata.additionalImages.length > 0) {
      updates.images = metadata.additionalImages.slice(0, 5);
    }
    
    updates.contentEnriched = true;
    updates.lastContentUpdate = new Date();
    
    if (Object.keys(updates).length > 0) {
      await storage.updateProduct(productId, updates);
      console.log(`Updated product ${product.name} with scraped data`);
    }
    
    return { 
      success: true, 
      productId, 
      productName: product.name,
      metadata 
    };
  } catch (error) {
    console.error(`Error enriching product ${productId}:`, error);
    return { 
      success: false, 
      productId, 
      productName: 'Unknown',
      error: String(error) 
    };
  }
}

export async function enrichAllProducts(): Promise<{
  total: number;
  successful: number;
  failed: number;
  results: EnrichmentResult[];
}> {
  const products = await storage.getProducts();
  const results: EnrichmentResult[] = [];
  let successful = 0;
  let failed = 0;
  
  for (const product of products) {
    if (product.contentEnriched && product.primaryImage) {
      console.log(`Skipping ${product.name} - already enriched`);
      continue;
    }
    
    const result = await enrichProduct(product.id);
    results.push(result);
    
    if (result.success) {
      successful++;
    } else {
      failed++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return {
    total: products.length,
    successful,
    failed,
    results
  };
}
