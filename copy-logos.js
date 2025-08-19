import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Product mapping: database name/slug -> logo folder name
const productLogoMapping = {
  // Exact matches
  'AirForce': 'AirForce product logo',
  'BullsEye': 'BullsEye product logo', 
  'Clarity': 'Clarity product logo',
  'CleanSweep': 'CleanSweep product logo',
  'Conceal': 'Conceal product logo',
  'CornerStone Planting System': 'CornerStone product logo',
  'DeltaForce': 'DeltaForce product logo',
  'DrySet': 'DrySet product logo',
  'DuraWear': 'DuraWear product logo',
  'EMHD': 'EMHD product logo',
  'FlowSense': 'FlowSense product logo',
  'FurrowForce': 'FurrowForce product logo',
  'FurrowJet': 'FurrowJet product logo',
  'Keeton Seed Firmer': 'Keeton product logo',
  'PrecisionMeter': 'PrecisionMeter product logo',
  'PumpStack': 'Pump Stack product logo',
  'RateController': 'RateContoller product logo', // Note: spelling difference in folder
  'Ready Row Unit': 'ReadyRowUnit product logo',
  'Reveal': 'Reveal product logo',
  'RowFlow': 'RowFlow product logo',
  'SmartDepth': 'SmartDepth product logo',
  'SmartFirmer': 'SmartFirmer product logo',
  'SpeedTube': 'SpeedTube product logo',
  'SwathModule': 'SwathModule product logo',
  'SymphonyNozzle': 'Symphony product logo',
  'WaveVision': 'WaveVision product logo',
  'eSet': 'eSet product logo',
  'mSet': 'mSet product logo',
  'vApplyHD': 'vApplyHD product logo',
  'vDrive': 'vDrive product logo',
  'vSet': 'vSet product logo',
  'vSet Select': 'vSetSelect product logo',
  
  // Special cases
  '20|20': '20 20 product logo',
};

const sourceDir = 'Precision Planting Resource Library-selected-assets';
const targetDir = 'client/src/assets/logos';

console.log('Starting logo copying process...');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const logoPaths = {};

// Copy logos for each mapped product
Object.entries(productLogoMapping).forEach(([productName, logoFolder]) => {
  const sourceFolderPath = path.join(sourceDir, logoFolder);
  
  if (fs.existsSync(sourceFolderPath)) {
    console.log(`Processing ${productName}...`);
    
    // Create product-specific directory
    const productSlug = productName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const productDir = path.join(targetDir, productSlug);
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }
    
    // Copy the three logo variations
    const logoVariations = [
      { suffix: 'black-rgb.svg', key: 'logoBlack' },
      { suffix: 'darkgreen-rgb.svg', key: 'logoDarkGreen' },
      { suffix: 'white-rgb.svg', key: 'logoWhite' }
    ];
    
    logoVariations.forEach(({ suffix, key }) => {
      // Try different naming patterns
      const possibleNames = [
        `${productName.replace(' ', '')}-${suffix}`,
        `${productName}-${suffix}`,
        `${logoFolder.replace(' product logo', '')}-${suffix}`,
      ];
      
      let sourceFile = null;
      for (const name of possibleNames) {
        const testPath = path.join(sourceFolderPath, name);
        if (fs.existsSync(testPath)) {
          sourceFile = testPath;
          break;
        }
      }
      
      // Special case for 20|20
      if (productName === '20|20') {
        sourceFile = path.join(sourceFolderPath, `2020-${suffix}`);
      }
      
      if (sourceFile && fs.existsSync(sourceFile)) {
        const targetFile = path.join(productDir, `${productSlug}-${suffix}`);
        fs.copyFileSync(sourceFile, targetFile);
        
        // Store the relative path for database update
        const relativePath = `/src/assets/logos/${productSlug}/${productSlug}-${suffix}`;
        if (!logoPaths[productName]) logoPaths[productName] = {};
        logoPaths[productName][key] = relativePath;
        
        console.log(`  ✓ Copied ${suffix}`);
      } else {
        console.log(`  ✗ Could not find ${suffix} for ${productName}`);
      }
    });
  } else {
    console.log(`✗ Folder not found: ${logoFolder}`);
  }
});

// Write the logo paths to a file for the database update
fs.writeFileSync('logo-paths.json', JSON.stringify(logoPaths, null, 2));

console.log('\nLogo copying completed!');
console.log(`Logo paths saved to logo-paths.json`);
console.log(`Total products processed: ${Object.keys(logoPaths).length}`);