
#!/usr/bin/env python3

import os
import shutil
import json
import requests
import re
from pathlib import Path

def normalize_product_name(name):
    """Normalize product name for matching"""
    # Remove special characters and convert to lowercase
    normalized = re.sub(r'[^a-z0-9\s]', '', name.lower())
    # Replace spaces with nothing for matching
    normalized = re.sub(r'\s+', '', normalized)
    return normalized

def create_product_mappings():
    """Create mappings between image folders and product slugs"""
    return {
        # Direct mappings
        'bullseye': 'bullseye',
        'cleansweep': 'cleansweep',
        'conceal': 'conceal',
        'deltaforce': 'deltaforce',
        'durawear': 'durawear',
        'durwearparallelarms': 'durawear',
        'emflowsense': 'flowsense',
        'furrowforce': 'furrowforce',
        'furrowjet': 'furrowjet',
        'keetonseedfirmer': 'keeton-seed-firmer',
        'keetonlowstick': 'keeton-seed-firmer',
        'precisionmeter': 'precisionmeter',
        'precisionfingermeter': 'precisionmeter',
        'pumpstack': 'pumpstack',
        'ratecontroller': 'ratecontroller',
        'readyrowunit': 'ready-row-unit',
        'reveal': 'reveal',
        'rowflowhydraulicmotor': 'rowflow',
        'rowflow': 'rowflow',
        'wavevision': 'wavevision',
        'yieldsense': 'yieldsense',
        'eflow': 'eflow',
        'esetproseries': 'eset',
        'mset': 'mset',
        'vsetselect': 'vset-select',
        'vset': 'vset',
        'vset2': 'vset',
        'vsetlargepeanut': 'vset',
        'vsetlargesugarbeet': 'vset',
        'vsetsoybeancotton': 'vset',
        
        # Additional mappings for various image folders
        'dryset': 'dryset',
        'drysetmicro': 'dryset',
        'drysetmicrofront': 'dryset',
        'drysetmicroleft': 'dryset',
        'horschmaestro': 'ready-row-unit',
        'kinze3000rowunit': 'ready-row-unit',
        'kinze3000': 'ready-row-unit',
        'monosemngplus4': 'ready-row-unit',
        'metermaxultra': 'metermax',
        'pogo': 'ready-row-unit',
        'reclaimswitch': 'reclaim',
        'eflowgraphitepowder': 'eflow',
        
        # LoadPin variations - map to deltaforce or appropriate product
        'loadpin': 'deltaforce',
        'loadpinjohndeere': 'deltaforce',
        'loadpinkinze': 'deltaforce',
        'loadpinme5': 'deltaforce',
        'loadpinmonosem': 'deltaforce',
        'loadpinwhite': 'deltaforce',
    }

def copy_product_images():
    """Copy product images to client public assets folder"""
    
    source_dir = Path('attached_assets/ProductImages')
    target_dir = Path('client/public/assets/images/products')
    
    if not source_dir.exists():
        print("❌ Source ProductImages directory not found!")
        return {}
    
    # Create target directory
    target_dir.mkdir(parents=True, exist_ok=True)
    
    copied_images = {}
    mappings = create_product_mappings()
    
    print("📁 Copying product images...")
    
    for folder in source_dir.iterdir():
        if folder.is_dir():
            folder_name = folder.name
            folder_normalized = normalize_product_name(folder_name)
            
            # Check if we have a mapping for this folder
            product_slug = None
            if folder_normalized in mappings:
                product_slug = mappings[folder_normalized]
            else:
                # Try partial matches
                for key, value in mappings.items():
                    if key in folder_normalized or folder_normalized in key:
                        product_slug = value
                        break
            
            if product_slug:
                # Create product-specific directory
                product_dir = target_dir / product_slug
                product_dir.mkdir(exist_ok=True)
                
                # Copy all image files
                images = []
                for img_file in folder.iterdir():
                    if img_file.is_file() and img_file.suffix.lower() in ['.png', '.jpg', '.jpeg', '.svg']:
                        target_file = product_dir / img_file.name
                        shutil.copy2(img_file, target_file)
                        
                        # Create relative path for web access
                        image_path = f"/assets/images/products/{product_slug}/{img_file.name}"
                        images.append({
                            'filename': img_file.name,
                            'path': image_path,
                            'type': 'product_image',
                            'alt': f"{product_slug} - {img_file.name}"
                        })
                
                if images:
                    if product_slug not in copied_images:
                        copied_images[product_slug] = []
                    copied_images[product_slug].extend(images)
                    print(f"✓ Copied {len(images)} images for {product_slug} from {folder_name}")
                else:
                    print(f"⚠ No images found in {folder_name}")
            else:
                print(f"✗ No mapping found for folder: {folder_name}")
    
    return copied_images

def get_existing_products():
    """Fetch existing products from the API"""
    try:
        response = requests.get('http://localhost:5000/api/products')
        if response.status_code == 200:
            return response.json()
        else:
            print(f"❌ Failed to fetch products: {response.status_code}")
            return []
    except Exception as e:
        print(f"❌ Error fetching products: {e}")
        return []

def update_products_with_images(copied_images, products):
    """Update products in database with image information"""
    updated_count = 0
    failed_count = 0
    
    print("\n💾 Updating products with images...")
    
    # Create a mapping of slug to product
    product_map = {product['slug']: product for product in products}
    
    for product_slug, images in copied_images.items():
        if product_slug in product_map:
            product = product_map[product_slug]
            
            try:
                # Prepare update data
                update_data = {
                    'primaryImage': images[0]['path'] if images else None,
                    'images': images
                }
                
                # Update product
                response = requests.patch(
                    f'http://localhost:5000/api/products/{product_slug}',
                    json=update_data,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code == 200:
                    print(f"✓ Updated {product['name']} with {len(images)} images")
                    updated_count += 1
                else:
                    print(f"✗ Failed to update {product_slug}: {response.status_code}")
                    print(f"  Response: {response.text}")
                    failed_count += 1
                    
            except Exception as e:
                print(f"✗ Error updating {product_slug}: {e}")
                failed_count += 1
        else:
            print(f"⚠ Product not found for slug: {product_slug}")
            failed_count += 1
    
    return updated_count, failed_count

def main():
    print("🚀 Starting product image processing...")
    
    # Step 1: Copy images to public directory
    copied_images = copy_product_images()
    
    if not copied_images:
        print("❌ No images were copied. Exiting.")
        return
    
    print(f"\n📊 Image Copy Summary:")
    print(f"Products with images: {len(copied_images)}")
    total_images = sum(len(images) for images in copied_images.values())
    print(f"Total images copied: {total_images}")
    
    # Step 2: Get existing products
    print("\n📦 Fetching existing products...")
    products = get_existing_products()
    
    if not products:
        print("❌ No products found. Cannot update.")
        return
    
    print(f"Found {len(products)} existing products")
    
    # Step 3: Update products with images
    updated_count, failed_count = update_products_with_images(copied_images, products)
    
    print(f"\n🎉 Final Summary:")
    print(f"Products updated: {updated_count}")
    print(f"Update failures: {failed_count}")
    print(f"Total images processed: {total_images}")
    
    # Save mapping for reference
    mapping_file = 'product_images_mapping.json'
    with open(mapping_file, 'w') as f:
        json.dump(copied_images, f, indent=2)
    print(f"Image mappings saved to: {mapping_file}")
    
    if updated_count > 0:
        print("\n✅ Product images have been successfully processed and applied!")
    else:
        print("\n❌ No products were updated with images.")

if __name__ == "__main__":
    main()
