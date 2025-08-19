
const fs = require('fs');
const path = require('path');

// Function to convert title to slug format
function getResourceSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Function to parse CSV
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());
    
    const obj = {};
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index] || '';
    });
    
    return obj;
  });
}

// Function to generate article descriptions
function generateDescription(title) {
  const descriptions = {
    'autonomy': 'Exploring the path toward autonomous farming systems and their impact on modern agriculture',
    'ptx': 'Strategic developments and innovations in PTx Trimble\'s precision agriculture platform',
    'uptime': 'How precision correction services improve operational efficiency and reduce downtime',
    'ai': 'Artificial intelligence transforming agricultural practices and farming operations',
    'crop protection': 'Advanced AI-driven crop protection with plant-level precision spraying technology',
    'trends': 'Key trends and innovations shaping the future of precision agriculture',
    'connected': 'How connected farm technology enhances productivity and operational performance',
    'myths': 'Separating fact from fiction in precision agriculture technology adoption',
    'scintillation': 'Advanced positioning technology to mitigate GPS signal interference',
    'water': 'Optimizing irrigation and water management systems for sustainable farming',
    'ionoguard': 'Enhanced GPS positioning technology for reliable agricultural guidance',
    'trimble': 'Latest developments in Trimble\'s precision agriculture solutions',
    'digital': 'Digital transformation strategies for modern agricultural operations',
    'yield': 'Maximizing crop yields through precision agriculture techniques',
    'monitoring': 'Advanced monitoring systems for real-time farm management',
    'sustainability': 'Sustainable farming practices using precision agriculture technology'
  };
  
  // Find matching keywords and return appropriate description
  const lowerTitle = title.toLowerCase();
  for (const [keyword, description] of Object.entries(descriptions)) {
    if (lowerTitle.includes(keyword)) {
      return description;
    }
  }
  
  // Default description
  return `Comprehensive insights on ${title.toLowerCase()} in precision agriculture`;
}

// Main function to update resources
function updateResources() {
  try {
    // Read the CSV file
    const csvPath = path.join(__dirname, '../ptxtrimble_rewritten_articles_seo_aeo.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV data
    const articles = parseCSV(csvContent);
    
    // Generate news items from CSV
    const newsItems = articles.map(article => ({
      title: article.title || article.Title || '',
      description: generateDescription(article.title || article.Title || ''),
      url: `/resources/${getResourceSlug(article.title || article.Title || '')}`
    }));
    
    // Read the current resources.tsx file
    const resourcesPath = path.join(__dirname, '../client/src/pages/resources.tsx');
    let resourcesContent = fs.readFileSync(resourcesPath, 'utf-8');
    
    // Find the Industry News section and replace the items
    const newsStartPattern = /(\s+color: "bg-indigo-600",\s+items: \[)/;
    const newsEndPattern = /(\s+\]\s+\})/;
    
    // Build the new items array string
    const newItemsString = newsItems.map(item => 
      `      {
        title: "${item.title}",
        description: "${item.description}",
        url: "${item.url}"
      }`
    ).join(',\n');
    
    // Replace the items in the Industry News section
    const updatedContent = resourcesContent.replace(
      /(color: "bg-indigo-600",\s+items: \[)[^}]+(\]\s+\})/s,
      `color: "bg-indigo-600",
    items: [
${newItemsString}
    ]
  }`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(resourcesPath, updatedContent, 'utf-8');
    
    console.log(`✅ Successfully updated resources.tsx with ${newsItems.length} articles from CSV`);
    console.log('📄 Articles added:');
    newsItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.title}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating resources:', error.message);
    process.exit(1);
  }
}

// Run the update
updateResources();
