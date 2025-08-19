
#!/usr/bin/env python3

import json
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'server'))

from content_enhancer import ContentEnhancer
from resource_enhancer import ResourceEnhancer
import time

def update_all_content():
    """
    Update all product and resource content from Precision Planting
    """
    print("Starting content update process...")
    
    # Load existing products
    products_file = 'precision-reseller-starter/precision-reseller-starter/data/products.json'
    if os.path.exists(products_file):
        with open(products_file, 'r') as f:
            products = json.load(f)
        
        print(f"Enhancing {len(products)} products...")
        
        # Enhance products
        enhancer = ContentEnhancer()
        enhanced_products = enhancer.enhance_all_products(products)
        
        # Save enhanced products
        output_file = products_file.replace('.json', '_enhanced.json')
        with open(output_file, 'w') as f:
            json.dump(enhanced_products, f, indent=2)
        
        print(f"Enhanced products saved to {output_file}")
    
    # Update resource topics
    print("Updating resource topics...")
    resource_enhancer = ResourceEnhancer()
    topics = resource_enhancer.extract_resource_topics()
    
    if topics:
        with open('client/src/data/resource_topics.json', 'w') as f:
            json.dump(topics, f, indent=2)
        print(f"Extracted {len(topics)} resource topics")
    
    print("Content update completed!")

if __name__ == "__main__":
    update_all_content()
