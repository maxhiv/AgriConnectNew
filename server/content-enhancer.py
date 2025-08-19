
import json
import requests
from scraper import scrape_product_data
import time
from typing import Dict, List, Optional

class ContentEnhancer:
    def __init__(self):
        self.cache = {}
        self.cache_duration = 24 * 60 * 60  # 24 hours
    
    def enhance_product(self, product: Dict) -> Dict:
        """
        Enhance a product with data from manufacturer website
        """
        if not product.get('oem_url'):
            return product
            
        # Check cache first
        cache_key = product['slug']
        if cache_key in self.cache:
            cached_data = self.cache[cache_key]
            if time.time() - cached_data['timestamp'] < self.cache_duration:
                return self._merge_product_data(product, cached_data['data'])
        
        # Scrape fresh data
        scraped_data = scrape_product_data(product['oem_url'])
        if scraped_data:
            # Cache the data
            self.cache[cache_key] = {
                'data': scraped_data,
                'timestamp': time.time()
            }
            return self._merge_product_data(product, scraped_data)
        
        return product
    
    def _merge_product_data(self, product: Dict, scraped_data: Dict) -> Dict:
        """
        Merge scraped data with existing product data
        """
        enhanced = product.copy()
        
        # Enhance title if manufacturer has more specific one
        if scraped_data.get('title') and len(scraped_data['title']) > len(product.get('name', '')):
            enhanced['enriched_title'] = scraped_data['title']
        
        # Enhance description
        if scraped_data.get('description'):
            enhanced['enriched_description'] = scraped_data['description']
        
        # Add extended description
        if scraped_data.get('extended_description'):
            enhanced['extended_description'] = scraped_data['extended_description']
        
        # Merge features with scraped features
        existing_highlights = set(product.get('highlights', []))
        scraped_features = scraped_data.get('features', [])
        
        # Add unique scraped features that aren't already in highlights
        enhanced['scraped_features'] = [
            feature for feature in scraped_features 
            if not any(highlight.lower() in feature.lower() or feature.lower() in highlight.lower() 
                      for highlight in existing_highlights)
        ]
        
        # Add new data fields
        if scraped_data.get('technical_specs'):
            enhanced['technical_specs'] = scraped_data['technical_specs']
        
        if scraped_data.get('benefits'):
            enhanced['benefits'] = scraped_data['benefits']
        
        if scraped_data.get('applications'):
            enhanced['applications'] = scraped_data['applications']
        
        # Enhance compatibility
        existing_works_with = set(product.get('works_with', []))
        scraped_compatibility = set(scraped_data.get('compatibility', []))
        enhanced_compatibility = list(existing_works_with.union(scraped_compatibility))
        if enhanced_compatibility:
            enhanced['enhanced_works_with'] = enhanced_compatibility
        
        # Add image URLs
        if scraped_data.get('image_urls'):
            enhanced['manufacturer_images'] = scraped_data['image_urls']
        
        # Add metadata
        enhanced['last_scraped'] = scraped_data.get('scraped_at')
        enhanced['source_url'] = scraped_data.get('source_url')
        
        return enhanced
    
    def enhance_all_products(self, products: List[Dict]) -> List[Dict]:
        """
        Enhance all products in a list
        """
        enhanced_products = []
        for product in products:
            try:
                enhanced = self.enhance_product(product)
                enhanced_products.append(enhanced)
                # Be respectful with requests
                time.sleep(1)
            except Exception as e:
                print(f"Error enhancing product {product.get('name', 'unknown')}: {e}")
                enhanced_products.append(product)
        
        return enhanced_products

def main():
    """
    CLI tool to enhance products from JSON file
    """
    import sys
    if len(sys.argv) < 2:
        print("Usage: python content-enhancer.py <products.json>")
        sys.exit(1)
    
    with open(sys.argv[1], 'r') as f:
        products = json.load(f)
    
    enhancer = ContentEnhancer()
    enhanced_products = enhancer.enhance_all_products(products)
    
    # Save enhanced products
    output_file = sys.argv[1].replace('.json', '_enhanced.json')
    with open(output_file, 'w') as f:
        json.dump(enhanced_products, f, indent=2)
    
    print(f"Enhanced {len(enhanced_products)} products and saved to {output_file}")

if __name__ == "__main__":
    main()
