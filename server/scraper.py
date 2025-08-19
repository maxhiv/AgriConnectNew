
import requests
from bs4 import BeautifulSoup
import json
import sys
import time
from urllib.parse import urljoin, urlparse
import re

def scrape_product_data(manufacturer_url):
    """
    Scrape product data from manufacturer's website
    """
    try:
        # Add headers to mimic a real browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(manufacturer_url, headers=headers, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract product data
        product_data = {}
        
        # Try to get title from h1, title tag, or meta property
        title = None
        h1_tag = soup.find('h1')
        if h1_tag:
            title = h1_tag.get_text().strip()
        elif soup.title:
            title = soup.title.get_text().strip()
        
        # Get meta description
        description = None
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if meta_desc:
            description = meta_desc.get('content', '').strip()
        
        # Try to extract product specifications or features
        features = []
        technical_specs = []
        benefits = []
        applications = []
        
        # Look for common feature list patterns
        feature_selectors = [
            'ul.features li',
            'ul.specs li', 
            '.features ul li',
            '.specifications ul li',
            '.product-features li',
            '.benefits li',
            '.key-features li',
            '.product-highlights li'
        ]
        
        # Look for technical specifications
        spec_selectors = [
            '.specifications table tr',
            '.specs table tr',
            '.technical-specs li',
            '.product-specs li'
        ]
        
        # Look for benefits/advantages
        benefit_selectors = [
            '.benefits li',
            '.advantages li',
            '.why-choose li',
            '.product-benefits li'
        ]
        
        # Look for applications/use cases
        application_selectors = [
            '.applications li',
            '.use-cases li',
            '.ideal-for li',
            '.compatible-with li'
        ]
        
        for selector in feature_selectors:
            feature_elements = soup.select(selector)
            if feature_elements:
                features.extend([elem.get_text().strip() for elem in feature_elements[:8]])  # Increased limit
                break
                
        for selector in spec_selectors:
            spec_elements = soup.select(selector)
            if spec_elements:
                for elem in spec_elements[:5]:
                    spec_text = elem.get_text().strip()
                    if ':' in spec_text:  # Likely a spec with name:value format
                        technical_specs.append(spec_text)
                break
                
        for selector in benefit_selectors:
            benefit_elements = soup.select(selector)
            if benefit_elements:
                benefits.extend([elem.get_text().strip() for elem in benefit_elements[:5]])
                break
                
        for selector in application_selectors:
            app_elements = soup.select(selector)
            if app_elements:
                applications.extend([elem.get_text().strip() for elem in app_elements[:5]])
                break
        
        # Try to extract additional description from product content
        extended_description = None
        content_selectors = [
            '.product-description p',
            '.product-content p',
            '.description p',
            'article p'
        ]
        
        for selector in content_selectors:
            content_elements = soup.select(selector)
            if content_elements:
                paragraphs = [p.get_text().strip() for p in content_elements[:2] if p.get_text().strip()]
                if paragraphs:
                    extended_description = ' '.join(paragraphs)
                    break
        
        # Extract image URLs
        image_urls = []
        img_selectors = [
            '.product-image img',
            '.hero-image img',
            '.product-gallery img',
            'img[alt*="product"]'
        ]
        
        for selector in img_selectors:
            img_elements = soup.select(selector)
            for img in img_elements[:3]:  # Limit to 3 images
                src = img.get('src') or img.get('data-src')
                if src:
                    if src.startswith('/'):
                        src = urljoin(manufacturer_url, src)
                    image_urls.append(src)
        
        # Extract compatibility information
        compatibility = []
        compat_selectors = [
            '.compatibility li',
            '.works-with li',
            '.compatible li',
            '.integrates-with li'
        ]
        
        for selector in compat_selectors:
            compat_elements = soup.select(selector)
            if compat_elements:
                compatibility.extend([elem.get_text().strip() for elem in compat_elements[:5]])
                break
        
        product_data = {
            'title': title,
            'description': description,
            'extended_description': extended_description,
            'features': features,
            'technical_specs': technical_specs,
            'benefits': benefits,
            'applications': applications,
            'compatibility': compatibility,
            'image_urls': image_urls,
            'scraped_at': time.time(),
            'source_url': manufacturer_url
        }
        
        return product_data
        
    except Exception as e:
        print(f"Error scraping data from {manufacturer_url}: {e}")
        return None

def main():
    """
    Main function for command line usage
    """
    if len(sys.argv) < 2:
        print("Usage: python scraper.py <manufacturer_url>")
        sys.exit(1)
    
    url = sys.argv[1]
    result = scrape_product_data(url)
    
    if result:
        print(json.dumps(result, indent=2))
    else:
        print(json.dumps({"error": "Failed to scrape data"}))

if __name__ == "__main__":
    main()
