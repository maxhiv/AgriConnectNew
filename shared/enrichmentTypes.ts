export type PlaceType = "state" | "county" | "city";
export type StateCode = "AL" | "MS" | "FL" | "TN";
export type ContentAngle = 
  | "crop-evolution"
  | "soils-water"
  | "infrastructure"
  | "technology-adoption"
  | "resilience-weather"
  | "economics-operations";

export interface RecommendedSolution {
  type: "service" | "category" | "product" | "crop";
  label: string;
  href: string;
}

export interface Citation {
  label: string;
  url: string;
}

export interface EnrichmentCTA {
  headline: string;
  body: string;
  href: string;
  buttonText: string;
}

export interface EnrichmentModule {
  heading: string;
  intro: string;
  bullets: string[];
  bridge: string;
  todayTieIn: string;
  recommendedSolutions: RecommendedSolution[];
  citations: Citation[];
  cta: EnrichmentCTA;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LocationEnrichment {
  placeType: PlaceType;
  state: StateCode;
  placeName: string;
  countyName?: string;
  primaryCrops: string[];
  constraints: string[];
  angle: ContentAngle;
  module: EnrichmentModule;
  faq: FAQItem[];
  version: string;
  lastUpdated: string;
}

export interface LocationSeed {
  route: string;
  placeType: PlaceType;
  state: StateCode;
  placeName: string;
  countyName?: string;
  cities?: string[];
  primaryCrops: string[];
  constraints: string[];
  angle: ContentAngle;
  watershed?: string;
  soilType?: string;
}

export interface SeedFile {
  locations: LocationSeed[];
  angles: ContentAngle[];
  citations: Record<StateCode, Citation[]>;
}
