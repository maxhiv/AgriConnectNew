
#!/usr/bin/env python3

import os
import json
import sys
import re
import requests
from pathlib import Path

def normalize_product_name(name):
    """Normalize product name for matching"""
    # Remove special characters and convert to lowercase
    normalized = re.sub(r'[^a-z0-9\s]', '', name.lower())
    # Replace spaces with nothing for matching
    normalized = re.sub(r'\s+', '', normalized)
    return normalized

def create_slug_from_folder(folder_name):
    """Create a URL-friendly slug from folder name"""
    slug = folder_name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    return slug.strip('-')

def find_matching_product(folder_name, products):
    """Find matching product for image folder"""
    normalized_folder = normalize_product_name(folder_name)
    
    # Direct matches
    direct_matches = {
        'bullseye': 'bullseye',
        'cleansweep': 'cleansweep', 
        'conceal': 'conceal',
        'deltaforce': 'deltaforce',
        'durwear parallel arms': 'durawear',
        'em flowsense': 'flowsense',
        'furrowforce': 'furrowforce',
        'furrowjet': 'furrowjet',
        'keeton seed firmer': 'keeton-seed-firmer',
        'keeton low stick': 'keeton-seed-firmer',
        'precision finger meter': 'precisionmeter',
        'pumpstack': 'pumpstack',
        'ratecontroller': 'ratecontroller',
        'ready row unit': 'ready-row-unit',
        'reveal': 'reveal',
        'rowflow hydraulicmotor': 'rowflow',
        'wavevision': 'wavevision',
        'yieldsense': 'yieldsense',
        'eflow': 'eflow',
        'eset pro series': 'eset',
        'mset': 'mset',
        'vset select': 'vset-select',
        'vset2': 'vset',
        'vset large peanut': 'vset',
        'vset large sugarbeet': 'vset',
        'vset soybean cotton': 'vset'
    }
    
    folder_normalized = normalize_product_name(folder_name)
    
    # Check direct matches first
    if folder_normalized in direct_matches:
        target_slug = direct_matches[folder_normalized]
        for product in products:
            if product['slug'] == target_slug:
                return product
    
    # Try fuzzy matching on product names
    for product in products:
        product_normalized = normalize_product_name(product['name'])
        if product_normalized in folder_normalized or folder_normalized in product_normalized:
            return product
    
    return None

def process_product_images():
    """Process all product images and create mappings"""
    images_dir = Path('attached_assets/ProductImages')
    
    if not images_dir.exists():
        print("ProductImages directory not found!")
        return
    
    # Get current products from API
    try:
        response = requests.get('http://localhost:5000/api/products')
        if response.status_code == 200:
            products = response.json()
        else:
            print("Failed to fetch products from API")
            return
    except Exception as e:
        print(f"Error fetching products: {e}")
        return
    
    image_mappings = {}
    processed_count = 0
    matched_count = 0
    
    # Process each product folder
    for folder in images_dir.iterdir():
        if folder.is_dir():
            folder_name = folder.name
            print(f"Processing folder: {folder_name}")
            
            # Find matching product
            matching_product = find_matching_product(folder_name, products)
            
            if matching_product:
                product_slug = matching_product['slug']
                print(f"  ✓ Matched to product: {matching_product['name']} ({product_slug})")
                
                # Collect all images in this folder
                images = []
                for img_file in folder.iterdir():
                    if img_file.is_file() and img_file.suffix.lower() in ['.png', '.jpg', '.jpeg', '.svg']:
                        # Create relative path for web access
                        image_path = f"/assets/images/products/{folder_name}/{img_file.name}"
                        images.append({
                            'filename': img_file.name,
                            'path': image_path,
                            'type': 'product_image'
                        })
                
                if images:
                    image_mappings[product_slug] = {
                        'product_id': matching_product.get('id'),
                        'product_name': matching_product['name'],
                        'folder_name': folder_name,
                        'images': images,
                        'primary_image': images[0]['path']  # Use first image as primary
                    }
                    matched_count += 1
                    print(f"    Found {len(images)} images")
                else:
                    print(f"    No valid images found in folder")
            else:
                print(f"  ✗ No matching product found for: {folder_name}")
            
            processed_count += 1
    
    # Save image mappings to JSON file
    output_file = 'product_images_mapping.json'
    with open(output_file, 'w') as f:
        json.dump(image_mappings, f, indent=2)
    
    print(f"\n📊 Processing Summary:")
    print(f"Folders processed: {processed_count}")
    print(f"Products matched: {matched_count}")
    print(f"Mappings saved to: {output_file}")
    
    # Display some examples
    if image_mappings:
        print(f"\n📋 Sample mappings:")
        for slug, mapping in list(image_mappings.items())[:3]:
            print(f"  {mapping['product_name']}: {len(mapping['images'])} images")
    
    return image_mappings

if __name__ == "__main__":
    process_product_images()
