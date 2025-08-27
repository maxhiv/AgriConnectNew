
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
#!/usr/bin/env python3
import os
import json
import requests
import re
from pathlib import Path

# Product image directory
IMAGE_DIR = "attached_assets/ProductImages"
API_BASE = "http://localhost:5000/api"

def normalize_name(name):
    """Normalize product names for matching"""
    # Remove special characters, convert to lowercase
    normalized = re.sub(r'[^a-zA-Z0-9\s]', '', name.lower())
    normalized = re.sub(r'\s+', '', normalized)  # Remove all spaces
    return normalized

def find_product_images():
    """Find all product images and organize by product name"""
    product_images = {}
    
    if not os.path.exists(IMAGE_DIR):
        print(f"Image directory {IMAGE_DIR} not found")
        return product_images
    
    for item in os.listdir(IMAGE_DIR):
        item_path = os.path.join(IMAGE_DIR, item)
        if os.path.isdir(item_path):
            # This is a product folder
            product_name = item
            images = []
            
            # Find all image files in this folder
            for file in os.listdir(item_path):
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg')):
                    images.append({
                        'filename': file,
                        'path': os.path.join(item_path, file),
                        'relative_path': f"attached_assets/ProductImages/{item}/{file}"
                    })
            
            if images:
                product_images[product_name] = images
                print(f"Found {len(images)} images for {product_name}")
    
    return product_images

def get_existing_products():
    """Fetch existing products from the API"""
    try:
        response = requests.get(f"{API_BASE}/products")
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to fetch products: {response.status_code}")
            return []
    except Exception as e:
        print(f"Error fetching products: {e}")
        return []

def match_images_to_products(product_images, existing_products):
    """Match image folders to existing products"""
    matches = {}
    unmatched_images = []
    
    for image_folder, images in product_images.items():
        matched = False
        normalized_folder = normalize_name(image_folder)
        
        for product in existing_products:
            # Try multiple matching strategies
            product_names_to_check = [
                product.get('name', ''),
                product.get('slug', ''),
                product.get('category', ''),
                product.get('subcategory', '')
            ]
            
            for name_to_check in product_names_to_check:
                if name_to_check and normalized_folder in normalize_name(name_to_check):
                    matches[product['id']] = {
                        'product': product,
                        'images': images,
                        'folder_name': image_folder
                    }
                    matched = True
                    print(f"✓ Matched '{image_folder}' to product '{product['name']}'")
                    break
            
            if matched:
                break
        
        if not matched:
            unmatched_images.append({
                'folder': image_folder,
                'images': images
            })
            print(f"✗ No match found for '{image_folder}'")
    
    return matches, unmatched_images

def copy_images_to_public(matches):
    """Copy matched images to public directory"""
    public_dir = "client/public/assets/products"
    os.makedirs(public_dir, exist_ok=True)
    
    copied_images = {}
    
    for product_id, match_data in matches.items():
        product = match_data['product']
        images = match_data['images']
        
        # Create product-specific directory
        product_slug = product.get('slug', product['name'].lower().replace(' ', '-'))
        product_dir = os.path.join(public_dir, product_slug)
        os.makedirs(product_dir, exist_ok=True)
        
        product_images = []
        
        for image in images:
            try:
                # Copy image to public directory
                import shutil
                dest_path = os.path.join(product_dir, image['filename'])
                shutil.copy2(image['path'], dest_path)
                
                # Store relative path for the API
                relative_path = f"/assets/products/{product_slug}/{image['filename']}"
                product_images.append({
                    'filename': image['filename'],
                    'url': relative_path,
                    'alt': f"{product['name']} - {image['filename']}"
                })
                
                print(f"Copied {image['filename']} to {relative_path}")
                
            except Exception as e:
                print(f"Error copying {image['filename']}: {e}")
        
        if product_images:
            copied_images[product_id] = product_images
    
    return copied_images

def update_products_with_images(copied_images):
    """Update products in the database with image information"""
    for product_id, images in copied_images.items():
        try:
            # Update product with images
            update_data = {
                'images': images,
                'featured_image': images[0]['url'] if images else None
            }
            
            response = requests.patch(f"{API_BASE}/products/{product_id}", json=update_data)
            if response.status_code == 200:
                print(f"✓ Updated product {product_id} with {len(images)} images")
            else:
                print(f"✗ Failed to update product {product_id}: {response.status_code}")
                
        except Exception as e:
            print(f"Error updating product {product_id}: {e}")

def main():
    print("🔍 Analyzing product images...")
    
    # Find all product images
    product_images = find_product_images()
    if not product_images:
        print("No product images found")
        return
    
    print(f"Found images for {len(product_images)} products")
    
    # Get existing products
    print("\n📦 Fetching existing products...")
    existing_products = get_existing_products()
    if not existing_products:
        print("No existing products found")
        return
    
    print(f"Found {len(existing_products)} existing products")
    
    # Match images to products
    print("\n🔗 Matching images to products...")
    matches, unmatched = match_images_to_products(product_images, existing_products)
    
    if matches:
        print(f"\n📋 Summary:")
        print(f"  ✓ Matched: {len(matches)} products")
        print(f"  ✗ Unmatched: {len(unmatched)} image folders")
        
        if unmatched:
            print("\nUnmatched image folders:")
            for item in unmatched:
                print(f"  - {item['folder']} ({len(item['images'])} images)")
        
        # Copy images to public directory
        print("\n📁 Copying images to public directory...")
        copied_images = copy_images_to_public(matches)
        
        # Update products in database
        print("\n💾 Updating products with image information...")
        update_products_with_images(copied_images)
        
        print(f"\n✅ Successfully processed {len(copied_images)} products with images")
    else:
        print("No matches found between images and products")

if __name__ == "__main__":
    main()
