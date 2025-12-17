import fs from 'fs';
import path from 'path';

interface LocationEnrichment {
  placeType: 'state' | 'county' | 'city';
  state: string;
  placeName: string;
  countyName?: string;
  primaryCrops: string[];
  constraints: string[];
  angle: string;
  module: {
    heading: string;
    intro: string;
    bullets: string[];
    bridge: string;
    todayTieIn: string;
    recommendedSolutions: { type: string; label: string; href: string }[];
    citations: { label: string; url: string }[];
    cta: { headline: string; body: string; href: string; buttonText: string };
  };
  faq: { question: string; answer: string }[];
  version: string;
  lastUpdated: string;
}

const enrichmentCache: Map<string, LocationEnrichment> = new Map();

function loadEnrichmentFiles(): void {
  const enrichmentBase = path.join(process.cwd(), 'content/enrichment');
  const states = ['alabama', 'mississippi', 'florida', 'tennessee'];
  
  for (const state of states) {
    const stateDir = path.join(enrichmentBase, state);
    if (fs.existsSync(stateDir)) {
      try {
        const files = fs.readdirSync(stateDir).filter(f => f.endsWith('.json'));
        for (const file of files) {
          const filePath = path.join(stateDir, file);
          try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as LocationEnrichment;
            const slug = file.replace('.json', '');
            const key = `${state}/${slug}`;
            enrichmentCache.set(key, content);
          } catch (error) {
            console.error(`Error loading enrichment file ${filePath}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error reading enrichment directory ${stateDir}:`, error);
      }
    }
  }
  
  console.log(`Loaded ${enrichmentCache.size} enrichment files`);
}

loadEnrichmentFiles();

export function getEnrichmentContent(state: string, slug: string): LocationEnrichment | null {
  const key = `${state.toLowerCase()}/${slug.toLowerCase()}`;
  return enrichmentCache.get(key) || null;
}

export function getAllEnrichmentKeys(): string[] {
  return Array.from(enrichmentCache.keys());
}
