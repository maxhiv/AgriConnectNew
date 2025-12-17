import fs from 'fs';
import path from 'path';
import type { LocationEnrichment, StateCode } from '../shared/enrichmentTypes';

const enrichmentBase = path.join(process.cwd(), 'content/enrichment');

interface ValidationResult {
  file: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
  wordCount: number;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function getModuleWordCount(enrichment: LocationEnrichment): number {
  const { module } = enrichment;
  let totalWords = 0;
  
  totalWords += countWords(module.heading);
  totalWords += countWords(module.intro);
  totalWords += module.bullets.reduce((sum, b) => sum + countWords(b), 0);
  totalWords += countWords(module.bridge);
  totalWords += countWords(module.todayTieIn);
  
  return totalWords;
}

function calculateShingleSimilarity(text1: string, text2: string, shingleSize: number = 3): number {
  const getShingles = (text: string): Set<string> => {
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    const shingles = new Set<string>();
    for (let i = 0; i <= words.length - shingleSize; i++) {
      shingles.add(words.slice(i, i + shingleSize).join(' '));
    }
    return shingles;
  };
  
  const shingles1 = getShingles(text1);
  const shingles2 = getShingles(text2);
  
  if (shingles1.size === 0 || shingles2.size === 0) return 0;
  
  let intersection = 0;
  shingles1.forEach(s => {
    if (shingles2.has(s)) intersection++;
  });
  
  const union = shingles1.size + shingles2.size - intersection;
  return intersection / union;
}

function getFullModuleText(enrichment: LocationEnrichment): string {
  const { module } = enrichment;
  return [
    module.heading,
    module.intro,
    ...module.bullets,
    module.bridge,
    module.todayTieIn
  ].join(' ');
}

function validateEnrichment(enrichment: LocationEnrichment, filePath: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const wordCount = getModuleWordCount(enrichment);
  if (wordCount < 200) {
    errors.push(`Word count too low: ${wordCount} (minimum 200)`);
  } else if (wordCount > 350) {
    warnings.push(`Word count high: ${wordCount} (recommended max 350)`);
  }
  
  if (!enrichment.module.bridge || enrichment.module.bridge.length < 50) {
    errors.push('Missing or too short bridge section');
  }
  
  if (!enrichment.module.todayTieIn || enrichment.module.todayTieIn.length < 50) {
    errors.push('Missing or too short todayTieIn section');
  }
  
  if (!enrichment.module.recommendedSolutions || enrichment.module.recommendedSolutions.length < 2) {
    errors.push(`Insufficient recommended solutions: ${enrichment.module.recommendedSolutions?.length || 0} (minimum 2)`);
  }
  
  if (!enrichment.module.citations || enrichment.module.citations.length < 1) {
    errors.push('Missing citations (minimum 1)');
  }
  
  if (!enrichment.module.bullets || enrichment.module.bullets.length !== 3) {
    errors.push(`Invalid bullet count: ${enrichment.module.bullets?.length || 0} (expected 3)`);
  }
  
  const fullText = getFullModuleText(enrichment).toLowerCase();
  const placeNameLower = enrichment.placeName.toLowerCase();
  const mentionCount = (fullText.match(new RegExp(placeNameLower, 'g')) || []).length;
  
  if (mentionCount === 0) {
    warnings.push('Place name not mentioned in content');
  } else if (mentionCount > 3) {
    warnings.push(`Place name mentioned ${mentionCount} times (may be over-optimized)`);
  }
  
  if (!enrichment.faq || enrichment.faq.length < 3) {
    warnings.push(`FAQ items: ${enrichment.faq?.length || 0} (recommended 3)`);
  }
  
  return {
    file: filePath,
    valid: errors.length === 0,
    errors,
    warnings,
    wordCount
  };
}

function checkUniqueness(enrichments: { path: string; enrichment: LocationEnrichment }[], state: StateCode): string[] {
  const warnings: string[] = [];
  const threshold = 0.4;
  
  const stateEnrichments = enrichments.filter(e => e.enrichment.state === state);
  
  for (let i = 0; i < stateEnrichments.length; i++) {
    for (let j = i + 1; j < stateEnrichments.length; j++) {
      const text1 = getFullModuleText(stateEnrichments[i].enrichment);
      const text2 = getFullModuleText(stateEnrichments[j].enrichment);
      const similarity = calculateShingleSimilarity(text1, text2);
      
      if (similarity > threshold) {
        warnings.push(
          `High similarity (${(similarity * 100).toFixed(1)}%) between:\n` +
          `  - ${stateEnrichments[i].path}\n` +
          `  - ${stateEnrichments[j].path}`
        );
      }
    }
  }
  
  return warnings;
}

function getAllEnrichmentFiles(): string[] {
  const files: string[] = [];
  const states = ['alabama', 'mississippi', 'florida', 'tennessee'];
  
  for (const state of states) {
    const stateDir = path.join(enrichmentBase, state);
    if (fs.existsSync(stateDir)) {
      const stateFiles = fs.readdirSync(stateDir)
        .filter(f => f.endsWith('.json'))
        .map(f => path.join(stateDir, f));
      files.push(...stateFiles);
    }
  }
  
  return files;
}

async function main() {
  console.log('Validating enrichment content...\n');
  
  const files = getAllEnrichmentFiles();
  console.log(`Found ${files.length} enrichment files\n`);
  
  if (files.length === 0) {
    console.log('No enrichment files found. Run generate:enrichment first.');
    process.exit(1);
  }
  
  const results: ValidationResult[] = [];
  const enrichments: { path: string; enrichment: LocationEnrichment }[] = [];
  
  for (const file of files) {
    try {
      const content = JSON.parse(fs.readFileSync(file, 'utf-8')) as LocationEnrichment;
      enrichments.push({ path: file, enrichment: content });
      const result = validateEnrichment(content, file);
      results.push(result);
    } catch (error) {
      results.push({
        file,
        valid: false,
        errors: [`Failed to parse: ${error}`],
        warnings: [],
        wordCount: 0
      });
    }
  }
  
  console.log('=== Validation Results ===\n');
  
  let validCount = 0;
  let errorCount = 0;
  let warningCount = 0;
  
  for (const result of results) {
    const status = result.valid ? '✓' : '✗';
    console.log(`${status} ${result.file}`);
    console.log(`  Word count: ${result.wordCount}`);
    
    if (result.errors.length > 0) {
      console.log('  Errors:');
      result.errors.forEach(e => console.log(`    - ${e}`));
      errorCount += result.errors.length;
    }
    
    if (result.warnings.length > 0) {
      console.log('  Warnings:');
      result.warnings.forEach(w => console.log(`    - ${w}`));
      warningCount += result.warnings.length;
    }
    
    if (result.valid) validCount++;
    console.log('');
  }
  
  console.log('=== Uniqueness Check ===\n');
  
  const states: StateCode[] = ['AL', 'MS', 'FL', 'TN'];
  for (const state of states) {
    const stateWarnings = checkUniqueness(enrichments, state);
    if (stateWarnings.length > 0) {
      console.log(`${state} uniqueness issues:`);
      stateWarnings.forEach(w => console.log(`  ${w}`));
      warningCount += stateWarnings.length;
    }
  }
  
  console.log('\n=== Summary ===');
  console.log(`Total files: ${results.length}`);
  console.log(`Valid: ${validCount}`);
  console.log(`Invalid: ${results.length - validCount}`);
  console.log(`Total errors: ${errorCount}`);
  console.log(`Total warnings: ${warningCount}`);
  
  process.exit(results.length - validCount > 0 ? 1 : 0);
}

main().catch(console.error);
