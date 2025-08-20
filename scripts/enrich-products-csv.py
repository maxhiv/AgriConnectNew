
#!/usr/bin/env python3

import csv
import json
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'server'))

def parse_csv_features(features_str):
    """Parse semicolon-separated features into a list"""
    if not features_str:
        return []
    return [f.strip() for f in features_str.split(';') if f.strip()]

def parse_csv_compatibility(works_with_str):
    """Parse comma-separated compatibility into a list"""
    if not works_with_str:
        return []
    return [w.strip() for w in works_with_str.split(',') if w.strip()]

def create_slug(product_name):
    """Create a URL-friendly slug from product name"""
    import re
    slug = product_name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    return slug.strip('-')

def enrich_products_from_csv():
    """Enrich product data using the CSV file"""
    
    csv_file = 'attached_assets/precisionplanting_products_1755640332361.csv'
    
    if not os.path.exists(csv_file):
        print(f"CSV file not found: {csv_file}")
        return
    
    enriched_products = []
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            # Parse the CSV data
            product = {
                'name': row['product'].strip(),
                'slug': create_slug(row['product'].strip()),
                'category': row['category'].strip(),
                'subcategory': row['subcategory'].strip() if row['subcategory'] else None,
                'tagline': row['tagline'].strip(),
                'description': row['description'].strip(),
                'key_features': parse_csv_features(row['key_features']),
                'equipped_for': parse_csv_compatibility(row['equipped_for']),
                'works_with': parse_csv_compatibility(row['works_with']),
                'oem_url': row['url'].strip(),
                
                # Additional enriched fields
                'enriched_from_csv': True,
                'csv_import_date': '2025-01-20',
                
                # Map categories to equipment types
                'equipment': 'Planters' if 'Planters' in row['category'] else 
                           'Air Seeders & Drills' if 'Air Seeders' in row['category'] else
                           'Sprayers' if 'Sprayers' in row['category'] else
                           'Combines' if 'Combines' in row['category'] else
                           'Data Management' if 'Data Management' in row['category'] else
                           'Dry Fertilizer Applicators',
                
                # Use key_features as highlights for compatibility
                'highlights': parse_csv_features(row['key_features'])[:5]  # Limit to 5 highlights
            }
            
            enriched_products.append(product)
            print(f"✓ Processed: {product['name']}")
    
    # Save enriched data
    output_file = 'enriched_products_from_csv.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(enriched_products, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Successfully enriched {len(enriched_products)} products")
    print(f"📁 Saved to: {output_file}")
    
    # Display sample enriched product
    if enriched_products:
        sample = enriched_products[0]
        print(f"\n📋 Sample enriched product:")
        print(f"Name: {sample['name']}")
        print(f"Category: {sample['category']} > {sample['subcategory']}")
        print(f"Description: {sample['description'][:100]}...")
        print(f"Key Features: {sample['key_features'][:3]}")
        print(f"Works With: {sample['works_with']}")
    
    return enriched_products

if __name__ == "__main__":
    enrich_products_from_csv()
