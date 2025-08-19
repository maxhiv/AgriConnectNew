
#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'server'))

from content_enhancer import ContentEnhancer
import json

def test_product_enrichment():
    """Test enriching a single product"""
    
    # Sample product data
    test_product = {
        "name": "20|20 SeedSense",
        "slug": "2020-seedsense", 
        "tagline": "Monitor and control individual row units",
        "oem_url": "https://www.precisionplanting.com/products/planters/rowunit/2020seedsense",
        "highlights": [
            "Individual row monitoring",
            "Population control",
            "Real-time alerts"
        ]
    }
    
    print("Testing product enrichment...")
    print(f"Original product: {test_product['name']}")
    
    enhancer = ContentEnhancer()
    enhanced = enhancer.enhance_product(test_product)
    
    print("\n=== ENRICHMENT RESULTS ===")
    
    if enhanced.get('enriched_description'):
        print(f"Enhanced Description: {enhanced['enriched_description'][:200]}...")
    
    if enhanced.get('scraped_features'):
        print(f"Scraped Features ({len(enhanced['scraped_features'])}): {enhanced['scraped_features'][:3]}")
        
    if enhanced.get('extended_description'):
        print(f"Extended Description: {enhanced['extended_description'][:200]}...")
        
    if enhanced.get('technical_specs'):
        print(f"Technical Specs: {enhanced['technical_specs'][:3]}")
        
    print(f"\nLast scraped: {enhanced.get('last_scraped')}")
    print(f"Source URL: {enhanced.get('source_url')}")
    
    # Save results
    with open('enhanced_test_result.json', 'w') as f:
        json.dump(enhanced, f, indent=2)
    
    print("\nFull results saved to enhanced_test_result.json")

if __name__ == "__main__":
    test_product_enrichment()
