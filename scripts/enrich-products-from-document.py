
#!/usr/bin/env python3

import json
import re
import requests
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'server'))

def parse_product_content():
    """Parse the product content document and create enriched product data"""
    
    # Read the product content document
    content_file = 'attached_assets/Pasted-Here-is-a-compilation-of-all-product-related-content-from-the-provided-sources-formatted-for-direct-1756313684423_1756313684424.txt'
    
    if not os.path.exists(content_file):
        print(f"Content file not found: {content_file}")
        return {}
    
    with open(content_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split content into product sections
    product_sections = re.split(r'\n### ([^\n]+)', content)
    
    enriched_data = {}
    
    for i in range(1, len(product_sections), 2):
        if i + 1 < len(product_sections):
            product_name = product_sections[i].strip()
            product_content = product_sections[i + 1].strip()
            
            # Parse the product content
            parsed_data = parse_single_product(product_name, product_content)
            if parsed_data:
                enriched_data[product_name] = parsed_data
    
    return enriched_data

def parse_single_product(product_name, content):
    """Parse individual product content into structured data"""
    
    # Clean product name and create slug
    clean_name = product_name.replace('20/20 & 20/20 SeedSense', '20|20').replace('HeadSight - Corn Header Height Control', 'HeadSight').replace('HeadSight - Grain Header Height Control', 'HeadSight').replace('MeterMax Ultra (Calibration Service)', 'MeterMax Ultra').replace('Precision Planting Fertility System (General Product Overview)', 'Fertility System').replace('CornerStone', 'CornerStone Planting System')
    
    slug = create_slug(clean_name)
    
    # Extract description (first paragraph)
    description_match = re.search(r'^([^*\n]+?)(?:\n|$)', content)
    description = description_match.group(1).strip() if description_match else ""
    
    # Extract Key Features & Capabilities
    features = extract_section_list(content, r'\*\*Key Features & Capabilities:\*\*\s*\n(.*?)(?:\n\*\*|\n### |\Z)', is_bullet_list=True)
    
    # Extract Benefits
    benefits = extract_section_list(content, r'\*\*Benefits:\*\*\s*\n(.*?)(?:\n\*\*|\n### |\Z)', is_bullet_list=True)
    
    # Extract Research Findings
    research_findings = extract_research_findings(content)
    
    # Extract compatibility info
    compatibility = extract_compatibility(content)
    
    # Create enriched product data
    enriched_product = {
        'name': clean_name,
        'slug': slug,
        'enriched_description': description,
        'detailed_features': features,
        'benefits': benefits,
        'research_findings': research_findings,
        'compatibility_details': compatibility,
        'content_source': 'precision_planting_detailed_content',
        'last_enriched': '2025-01-20'
    }
    
    return enriched_product

def extract_section_list(content, pattern, is_bullet_list=False):
    """Extract list items from a section"""
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        return []
    
    section_content = match.group(1).strip()
    
    if is_bullet_list:
        # Extract bullet points
        bullet_items = re.findall(r'^\s*\*\s+\*\*([^*]+?)\*\*\s*(.*?)(?=^\s*\*\s+\*\*|\Z)', section_content, re.MULTILINE | re.DOTALL)
        items = []
        for title, description in bullet_items:
            title = title.strip().rstrip(':')
            desc = description.strip()
            if desc:
                items.append(f"{title}: {desc}")
            else:
                items.append(title)
        return items
    else:
        # Extract simple list items
        lines = section_content.split('\n')
        items = []
        for line in lines:
            line = line.strip()
            if line and not line.startswith('*'):
                items.append(line)
        return items

def extract_research_findings(content):
    """Extract research findings from content"""
    research_pattern = r'\*\*Research Findings[^*]*?\*\*\s*\n(.*?)(?:\n\*\*|\n### |\Z)'
    findings = []
    
    for match in re.finditer(research_pattern, content, re.DOTALL):
        finding_content = match.group(1).strip()
        
        # Extract individual studies
        study_pattern = r'\*\*([^*]+?)\*\*\s*(.*?)(?=\*\*|\Z)'
        for study_match in re.finditer(study_pattern, finding_content, re.DOTALL):
            study_name = study_match.group(1).strip().rstrip(':')
            study_details = study_match.group(2).strip()
            
            # Extract key metrics from study details
            metrics = extract_yield_metrics(study_details)
            
            findings.append({
                'study': study_name,
                'details': study_details,
                'key_metrics': metrics
            })
    
    return findings

def extract_yield_metrics(text):
    """Extract yield and economic metrics from research text"""
    metrics = []
    
    # Pattern for yield gains/losses
    yield_pattern = r'([+-]?\d+\.?\d*)\s*Bu/A'
    yield_matches = re.findall(yield_pattern, text)
    
    # Pattern for economic gains/losses
    economic_pattern = r'([+-]?\$\d+\.?\d*/A)'
    economic_matches = re.findall(economic_pattern, text)
    
    for yield_val in yield_matches:
        metrics.append(f"{yield_val} Bu/A")
    
    for econ_val in economic_matches:
        metrics.append(econ_val)
    
    return metrics

def extract_compatibility(content):
    """Extract compatibility information"""
    compatibility = {}
    
    # Look for compatibility section
    compat_match = re.search(r'\*\*Compatibility:\*\*\s*\n(.*?)(?:\n\*\*|\n### |\Z)', content, re.DOTALL)
    if compat_match:
        compat_content = compat_match.group(1).strip()
        compatibility['details'] = compat_content
    
    # Extract "works with" mentions
    works_with_pattern = r'works with[^.]*?([A-Z][^.]*?)(?:\.|$)'
    works_with_matches = re.findall(works_with_pattern, content, re.IGNORECASE)
    if works_with_matches:
        compatibility['works_with'] = works_with_matches
    
    return compatibility

def create_slug(name):
    """Create URL-friendly slug from product name"""
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    slug = slug.strip('-')
    
    # Handle special cases
    if '20-20' in slug:
        slug = '2020'
    elif 'vset-select' in slug:
        slug = 'vset-select'
    elif 'cornerstone' in slug:
        slug = 'cornerstone-planting-system'
    elif 'fertility-system' in slug:
        slug = 'fertility-system'
    
    return slug

def map_slug_to_existing_product(slug, enriched_name):
    """Map enriched product slug to existing product in database"""
    
    # Mapping for special cases
    slug_mapping = {
        '2020': '2020',
        'airforce': 'airforce',
        'clarity': 'clarity',
        'cleansweep': 'cleansweep',
        'conceal': 'conceal',
        'vset-seed-meters': 'vset',
        'deltaforce': 'deltaforce',
        'durawear-parallel-arms': 'durawear',
        'durawear-gauge-wheel-arms': 'durawear',
        'furrowforce': 'furrowforce',
        'furrowjet': 'furrowjet',
        'headsight': 'headsight',
        'metermax-ultra': 'metermax-ultra',
        'panorama': 'panorama',
        'reclaim': 'reclaim',
        'ready-row-unit': 'ready-row-unit',
        'reconblockage': 'reconblockage',
        'reconspreader': 'reconspreader',
        'reveal': 'reveal',
        'cornerstone-planting-system': 'cornerstone-planting-system',
        'fertility-system': 'fertility-system',
        'seederforce': 'seederforce',
        'smartdepth': 'smartdepth',
        'smartfirmer': 'smartfirmer',
        'speedtube': 'speedtube',
        'symphonynozzle': 'symphonynozzle',
        'symphonyvision': 'symphonyvision',
        'truesense': 'truesense',
        'truesight': 'truesight',
        'wavevision': 'wavevision',
        'yieldsense': 'yieldsense',
        'mset': 'mset',
        'vapplyhd': 'vapplyhd',
        'vdrive': 'vdrive',
        'vdrive-insecticide': 'vdrive-insecticide'
    }
    
    return slug_mapping.get(slug, slug)

def update_product_in_database(product_slug, enriched_data):
    """Update a single product in the database via API"""
    
    try:
        # Get current product
        response = requests.get(f'http://localhost:5000/api/products/{product_slug}')
        if response.status_code != 200:
            print(f"❌ Product not found: {product_slug}")
            return False
        
        current_product = response.json()
        
        # Merge enriched data with current product
        updated_product = {
            **current_product,
            'enriched_description': enriched_data.get('enriched_description', ''),
            'detailed_features': enriched_data.get('detailed_features', []),
            'benefits': enriched_data.get('benefits', []),
            'research_findings': enriched_data.get('research_findings', []),
            'compatibility_details': enriched_data.get('compatibility_details', {}),
            'content_enriched': True,
            'last_content_update': enriched_data.get('last_enriched', '2025-01-20')
        }
        
        # Update product via API
        update_response = requests.put(
            f'http://localhost:5000/api/products/{product_slug}', 
            json=updated_product,
            headers={'Content-Type': 'application/json'}
        )
        
        if update_response.status_code == 200:
            print(f"✅ Updated product: {enriched_data['name']} ({product_slug})")
            return True
        else:
            print(f"❌ Failed to update {product_slug}: {update_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error updating {product_slug}: {e}")
        return False

def main():
    """Main function to enrich all products"""
    
    print("🚀 Starting product enrichment from detailed content...")
    
    # Parse product content
    enriched_products = parse_product_content()
    
    if not enriched_products:
        print("❌ No product data found to process")
        return
    
    print(f"📋 Found {len(enriched_products)} products to enrich")
    
    # Save enriched data to file
    with open('enriched_products_detailed.json', 'w', encoding='utf-8') as f:
        json.dump(enriched_products, f, indent=2, ensure_ascii=False)
    
    print("💾 Saved enriched data to enriched_products_detailed.json")
    
    # Update products in database
    updated_count = 0
    failed_count = 0
    
    for product_name, enriched_data in enriched_products.items():
        # Map to existing product slug
        mapped_slug = map_slug_to_existing_product(enriched_data['slug'], enriched_data['name'])
        
        if update_product_in_database(mapped_slug, enriched_data):
            updated_count += 1
        else:
            failed_count += 1
    
    print(f"\n🎉 Product enrichment complete!")
    print(f"✅ Successfully updated: {updated_count} products")
    print(f"❌ Failed to update: {failed_count} products")
    
    # Display sample enriched product
    if enriched_products:
        sample_name = list(enriched_products.keys())[0]
        sample = enriched_products[sample_name]
        print(f"\n📋 Sample enriched product: {sample['name']}")
        print(f"Features: {len(sample['detailed_features'])} items")
        print(f"Benefits: {len(sample['benefits'])} items")
        print(f"Research findings: {len(sample['research_findings'])} studies")

if __name__ == "__main__":
    main()
