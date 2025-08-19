const fs = require('fs');
const path = require('path');

// Read and parse the products JSON file
const jsonPath = path.join(__dirname, 'precision-reseller-starter/precision-reseller-starter/data/products.json');
const jsonData = fs.readFileSync(jsonPath, 'utf8');
const productsData = JSON.parse(jsonData);

console.log(`Found ${productsData.length} products to import`);

// Function to make API request
async function importProducts() {
  let importedCount = 0;
  let failedCount = 0;
  
  for (const productData of productsData) {
    try {
      // Transform data to match our schema
      const transformedData = {
        name: productData.name,
        equipment: productData.equipment,
        category: productData.category,
        tagline: productData.tagline,
        oemUrl: productData.oem_url,
        highlights: productData.highlights || [],
        worksWith: productData.works_with || [],
        slug: productData.slug
      };
      
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData)
      });
      
      if (response.ok) {
        importedCount++;
        console.log(`✓ Imported: ${productData.name}`);
      } else {
        failedCount++;
        const errorText = await response.text();
        console.log(`✗ Failed: ${productData.name} - ${errorText}`);
      }
    } catch (error) {
      failedCount++;
      console.log(`✗ Error importing ${productData.name}:`, error.message);
    }
  }
  
  console.log(`\nImport completed:`);
  console.log(`Successfully imported: ${importedCount} products`);
  console.log(`Failed to import: ${failedCount} products`);
}

importProducts();