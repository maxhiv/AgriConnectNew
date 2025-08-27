
#!/usr/bin/env python3
import requests
import json
import os
from pathlib import Path

def update_wavevision_with_images():
    """Update WaveVision product with its images"""
    
    # Check if images exist
    image_dir = Path('client/public/assets/images/products/WaveVision')
    if not image_dir.exists():
        print("❌ WaveVision image directory not found")
        return
    
    # Find all image files
    image_files = []
    for file in image_dir.iterdir():
        if file.is_file() and file.suffix.lower() in ['.png', '.jpg', '.jpeg', '.svg']:
            image_files.append({
                'filename': file.name,
                'path': f'/assets/images/products/WaveVision/{file.name}',
                'url': f'/assets/images/products/WaveVision/{file.name}'
            })
    
    if not image_files:
        print("❌ No image files found for WaveVision")
        return
    
    print(f"Found {len(image_files)} images for WaveVision:")
    for img in image_files:
        print(f"  - {img['filename']}")
    
    # Get current WaveVision product
    try:
        response = requests.get('http://0.0.0.0:5000/api/products/wavevision')
        if response.status_code != 200:
            print(f"❌ Failed to get WaveVision product: {response.status_code}")
            return
        
        product = response.json()
        print(f"✓ Found WaveVision product: {product['name']}")
        
        # Prepare update data
        update_data = {
            'images': image_files,
            'primaryImage': image_files[0]['url'] if image_files else None
        }
        
        # Update the product
        response = requests.patch('http://0.0.0.0:5000/api/products/wavevision', json=update_data)
        if response.status_code == 200:
            print(f"✅ Successfully updated WaveVision with {len(image_files)} images")
            print(f"Primary image set to: {update_data['primaryImage']}")
        else:
            print(f"❌ Failed to update WaveVision: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error updating WaveVision: {e}")

if __name__ == "__main__":
    update_wavevision_with_images()
