import fs from 'fs';

// Read the generated logo paths
const logoPathsData = fs.readFileSync('logo-paths.json', 'utf8');
const logoPaths = JSON.parse(logoPathsData);

console.log('Starting database update with logo paths...');

async function updateProductLogos() {
  let updatedCount = 0;
  let notFoundCount = 0;
  
  for (const [productName, logos] of Object.entries(logoPaths)) {
    try {
      // First, find the product by name
      const findResponse = await fetch(`http://localhost:5000/api/products?search=${encodeURIComponent(productName)}`);
      const products = await findResponse.json();
      
      let targetProduct = null;
      
      // Find exact match by name
      if (Array.isArray(products)) {
        targetProduct = products.find(p => p.name === productName);
      }
      
      if (targetProduct) {
        // Update the product with logo paths
        const updateData = {
          name: targetProduct.name,
          equipment: targetProduct.equipment,
          category: targetProduct.category,
          tagline: targetProduct.tagline,
          oemUrl: targetProduct.oemUrl,
          highlights: targetProduct.highlights,
          worksWith: targetProduct.worksWith,
          slug: targetProduct.slug,
          logoBlack: logos.logoBlack || null,
          logoDarkGreen: logos.logoDarkGreen || null,
          logoWhite: logos.logoWhite || null
        };
        
        // Use the import endpoint to update (it will skip existing products)
        // Let's use SQL update instead
        console.log(`Updating ${productName}...`);
        
        // Make a direct API call to update
        const updateResponse = await fetch(`http://localhost:5000/api/products/${targetProduct.slug}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });
        
        if (updateResponse.ok || updateResponse.status === 404) {
          // If 404, let's try to insert with logos
          if (updateResponse.status === 404) {
            const insertResponse = await fetch(`http://localhost:5000/api/products`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updateData)
            });
            
            if (insertResponse.ok) {
              console.log(`  ✓ Created ${productName} with logos`);
              updatedCount++;
            }
          } else {
            console.log(`  ✓ Updated ${productName} with logos`);
            updatedCount++;
          }
        } else {
          console.log(`  ✗ Failed to update ${productName}: ${updateResponse.status}`);
        }
      } else {
        console.log(`  ✗ Product not found: ${productName}`);
        notFoundCount++;
      }
    } catch (error) {
      console.log(`  ✗ Error updating ${productName}:`, error.message);
    }
  }
  
  console.log(`\nUpdate completed:`);
  console.log(`Successfully updated: ${updatedCount} products`);
  console.log(`Not found: ${notFoundCount} products`);
}

updateProductLogos();