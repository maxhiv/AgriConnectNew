
#!/usr/bin/env python3

import json
import requests
import sys
from pathlib import Path

def update_products_with_images():
    """Update products in database with image information"""
    
    # Load image mappings
    mappings_file = 'product_images_mapping.json'
    if not Path(mappings_file).exists():
        print(f"Image mappings file not found: {mappings_file}")
        print("Please run process-product-images.py first")
        return
    
    with open(mappings_file, 'r') as f:
        image_mappings = json.load(f)
    
    # Update each product via API
    updated_count = 0
    failed_count = 0
    
    for product_slug, mapping in image_mappings.items():
        try:
            # Get current product data
            response = requests.get(f'http://localhost:5000/api/products/{product_slug}')
            if response.status_code != 200:
                print(f"✗ Failed to get product {product_slug}: {response.status_code}")
                failed_count += 1
                continue
            
            product = response.json()
            
            # Add image data to product
            product_update = {
                'name': product['name'],
                'equipment': product['equipment'],
                'category': product['category'],
                'tagline': product['tagline'],
                'oemUrl': product.get('oemUrl', ''),
                'highlights': product.get('highlights', []),
                'worksWith': product.get('worksWith', []),
                'slug': product['slug'],
                'primaryImage': mapping['primary_image'],
                'images': mapping['images']
            }
            
            # Update product
            update_response = requests.put(
                f'http://localhost:5000/api/products/{product_slug}',
                json=product_update,
                headers={'Content-Type': 'application/json'}
            )
            
            if update_response.status_code == 200:
                print(f"✓ Updated {mapping['product_name']} with {len(mapping['images'])} images")
                updated_count += 1
            else:
                print(f"✗ Failed to update {product_slug}: {update_response.status_code}")
                print(f"  Response: {update_response.text}")
                failed_count += 1
                
        except Exception as e:
            print(f"✗ Error updating {product_slug}: {e}")
            failed_count += 1
    
    print(f"\n📊 Update Summary:")
    print(f"Products updated: {updated_count}")
    print(f"Updates failed: {failed_count}")

if __name__ == "__main__":
    update_products_with_images()
