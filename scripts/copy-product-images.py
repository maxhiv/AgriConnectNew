
#!/usr/bin/env python3

import os
import shutil
import json
from pathlib import Path

def copy_product_images():
    """Copy product images to client public assets folder"""
    
    source_dir = Path('attached_assets/ProductImages')
    target_dir = Path('client/public/assets/images/products')
    
    if not source_dir.exists():
        print("Source ProductImages directory not found!")
        return
    
    # Create target directory
    target_dir.mkdir(parents=True, exist_ok=True)
    
    copied_count = 0
    folder_count = 0
    
    # Copy each product folder
    for folder in source_dir.iterdir():
        if folder.is_dir():
            folder_name = folder.name
            target_folder = target_dir / folder_name
            
            # Create target folder
            target_folder.mkdir(exist_ok=True)
            
            # Copy all image files
            images_copied = 0
            for img_file in folder.iterdir():
                if img_file.is_file() and img_file.suffix.lower() in ['.png', '.jpg', '.jpeg', '.svg']:
                    target_file = target_folder / img_file.name
                    shutil.copy2(img_file, target_file)
                    images_copied += 1
                    copied_count += 1
            
            if images_copied > 0:
                print(f"✓ Copied {images_copied} images from {folder_name}")
                folder_count += 1
            else:
                print(f"⚠ No images found in {folder_name}")
    
    print(f"\n📊 Copy Summary:")
    print(f"Folders processed: {folder_count}")
    print(f"Images copied: {copied_count}")
    print(f"Target directory: {target_dir}")

if __name__ == "__main__":
    copy_product_images()
