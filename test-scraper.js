
const fetch = require('node-fetch');

async function testScraping() {
  try {
    // Test scraping endpoint
    const testUrl = 'https://www.precisionplanting.com/products/planters/deltaforce';
    
    console.log(`Testing scraper with URL: ${testUrl}`);
    
    const response = await fetch('http://localhost:5000/api/scrape-product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        manufacturerUrl: testUrl
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('\n✅ Scraping successful!');
      console.log('\nScraped Data:');
      console.log('Title:', result.data.title);
      console.log('Description:', result.data.description);
      console.log('Extended Description:', result.data.extended_description);
      console.log('Features:', result.data.features);
      console.log('Scraped at:', new Date(result.data.scraped_at * 1000).toISOString());
    } else {
      console.log('❌ Scraping failed:', result.message);
    }
    
  } catch (error) {
    console.error('Error testing scraper:', error.message);
  }
}

// Test with DeltaForce product
testScraping();
