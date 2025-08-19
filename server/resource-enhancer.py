
import requests
from bs4 import BeautifulSoup
import json
import sys
import time
from urllib.parse import urljoin, urlparse
import re

class ResourceEnhancer:
    def __init__(self):
        self.base_url = "https://www.precisionplanting.com"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    def extract_resource_topics(self):
        """
        Extract all available resource topics from Precision Planting
        """
        try:
            resources_url = f"{self.base_url}/resources"
            response = requests.get(resources_url, headers=self.headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            topics = []
            
            # Look for topic filters or categories
            topic_selectors = [
                '.filter-topics a',
                '.topic-filter a', 
                '.resource-categories a',
                '.topics-list a',
                'a[href*="topic="]'
            ]
            
            for selector in topic_selectors:
                topic_elements = soup.select(selector)
                for elem in topic_elements:
                    topic_text = elem.get_text().strip()
                    topic_url = elem.get('href')
                    
                    if topic_url and topic_text:
                        if topic_url.startswith('/'):
                            topic_url = urljoin(self.base_url, topic_url)
                        
                        topics.append({
                            'name': topic_text,
                            'url': topic_url,
                            'slug': self._generate_slug(topic_text)
                        })
            
            return topics
            
        except Exception as e:
            print(f"Error extracting topics: {e}")
            return []
    
    def extract_resource_content(self, resource_url):
        """
        Extract detailed content from a specific resource page
        """
        try:
            response = requests.get(resource_url, headers=self.headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Extract title
            title = None
            title_selectors = ['h1', '.page-title', '.resource-title', 'title']
            for selector in title_selectors:
                title_elem = soup.select_one(selector)
                if title_elem:
                    title = title_elem.get_text().strip()
                    break
            
            # Extract description/summary
            description = None
            desc_selectors = [
                '.resource-summary',
                '.page-description', 
                '.intro',
                '.lead',
                'meta[name="description"]'
            ]
            
            for selector in desc_selectors:
                if selector.startswith('meta'):
                    desc_elem = soup.select_one(selector)
                    if desc_elem:
                        description = desc_elem.get('content', '').strip()
                        break
                else:
                    desc_elem = soup.select_one(selector)
                    if desc_elem:
                        description = desc_elem.get_text().strip()
                        break
            
            # Extract key points/highlights
            key_points = []
            point_selectors = [
                '.key-points li',
                '.highlights li',
                '.benefits li',
                '.takeaways li',
                'ul li'
            ]
            
            for selector in point_selectors:
                point_elements = soup.select(selector)
                if point_elements and len(point_elements) <= 10:  # Reasonable number
                    key_points = [elem.get_text().strip() for elem in point_elements[:5]]
                    break
            
            # Extract related products mentioned
            product_mentions = []
            content_text = soup.get_text().lower()
            
            # Common Precision Planting product names to look for
            products_to_find = [
                'deltaforce', 'vset', 'vdrive', 'smartfirmer', 'reveal', 
                'furrowforce', 'vapplyhd', 'clarity', '20/20', 'speedtube'
            ]
            
            for product in products_to_find:
                if product in content_text:
                    product_mentions.append(product)
            
            # Extract implementation steps if available
            implementation_steps = []
            step_selectors = [
                '.steps li',
                '.implementation li',
                '.process li',
                'ol li'
            ]
            
            for selector in step_selectors:
                step_elements = soup.select(selector)
                if step_elements and len(step_elements) <= 15:  # Reasonable number
                    implementation_steps = [elem.get_text().strip() for elem in step_elements[:7]]
                    break
            
            return {
                'title': title,
                'description': description,
                'key_points': key_points,
                'product_mentions': product_mentions,
                'implementation_steps': implementation_steps,
                'scraped_at': time.time(),
                'source_url': resource_url
            }
            
        except Exception as e:
            print(f"Error extracting resource content from {resource_url}: {e}")
            return None
    
    def _generate_slug(self, text):
        """Generate URL-friendly slug from text"""
        return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

def main():
    if len(sys.argv) < 2:
        print("Usage: python resource-enhancer.py <action> [url]")
        print("Actions: topics, content")
        sys.exit(1)
    
    action = sys.argv[1]
    enhancer = ResourceEnhancer()
    
    if action == 'topics':
        topics = enhancer.extract_resource_topics()
        print(json.dumps(topics, indent=2))
    elif action == 'content' and len(sys.argv) > 2:
        url = sys.argv[2]
        content = enhancer.extract_resource_content(url)
        print(json.dumps(content, indent=2))
    else:
        print("Invalid action or missing URL")

if __name__ == "__main__":
    main()
