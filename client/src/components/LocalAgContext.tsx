import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { ChevronDown, ChevronUp, ExternalLink, MapPin, Leaf, Wrench } from 'lucide-react';

interface RecommendedSolution {
  type: 'service' | 'category' | 'product' | 'crop';
  label: string;
  href: string;
}

interface Citation {
  label: string;
  url: string;
}

interface EnrichmentCTA {
  headline: string;
  body: string;
  href: string;
  buttonText: string;
}

interface EnrichmentModule {
  heading: string;
  intro: string;
  bullets: string[];
  bridge: string;
  todayTieIn: string;
  recommendedSolutions: RecommendedSolution[];
  citations: Citation[];
  cta: EnrichmentCTA;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface LocationEnrichment {
  placeType: 'state' | 'county' | 'city';
  state: string;
  placeName: string;
  countyName?: string;
  primaryCrops: string[];
  constraints: string[];
  angle: string;
  module: EnrichmentModule;
  faq: FAQItem[];
  version: string;
  lastUpdated: string;
}

interface LocalAgContextProps {
  state: string;
  slug: string;
  className?: string;
}

function FAQSection({ faq, placeName }: { faq: FAQItem[]; placeName: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-8" data-testid="faq-section">
      <h3 className="text-xl font-semibold text-ptx-dark-green mb-4 font-pilat">
        Frequently Asked Questions
      </h3>
      <div className="space-y-3">
        {faq.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
            data-testid={`faq-item-${index}`}
          >
            <button
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              data-testid={`faq-toggle-${index}`}
            >
              <span className="font-medium text-ptx-dark-green">{item.question}</span>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-ptx-medium-green flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-ptx-medium-green flex-shrink-0" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-ptx-dark-green/80">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function getSolutionIcon(type: RecommendedSolution['type']) {
  switch (type) {
    case 'crop':
      return <Leaf className="w-4 h-4" />;
    case 'service':
      return <Wrench className="w-4 h-4" />;
    default:
      return <MapPin className="w-4 h-4" />;
  }
}

export default function LocalAgContext({ state, slug, className = '' }: LocalAgContextProps) {
  const [enrichment, setEnrichment] = useState<LocationEnrichment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEnrichment() {
      try {
        setLoading(true);
        const stateFolder = state.toLowerCase();
        const response = await fetch(`/api/enrichment/${stateFolder}/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setEnrichment(null);
            return;
          }
          throw new Error('Failed to load enrichment content');
        }
        
        const data = await response.json();
        setEnrichment(data);
      } catch (err) {
        console.error('Error loading enrichment:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    if (state && slug) {
      loadEnrichment();
    }
  }, [state, slug]);

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  if (error || !enrichment) {
    return null;
  }

  const { module, faq, placeName } = enrichment;

  return (
    <section className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 ${className}`} data-testid="local-ag-context">
      <h2 className="text-2xl md:text-3xl font-bold text-ptx-dark-green mb-4 font-pilat">
        {module.heading}
      </h2>

      <p className="text-ptx-dark-green/90 text-lg mb-6 leading-relaxed font-lato">
        {module.intro}
      </p>

      <ul className="space-y-3 mb-6">
        {module.bullets.map((bullet, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="w-2 h-2 bg-ptx-medium-green rounded-full mt-2 flex-shrink-0"></span>
            <span className="text-ptx-dark-green/80 font-lato">{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="bg-ptx-light-green/10 rounded-lg p-5 mb-6">
        <h3 className="text-lg font-semibold text-ptx-dark-green mb-2 font-pilat">
          How This Shapes Precision Decisions Today
        </h3>
        <p className="text-ptx-dark-green/80 mb-3 font-lato">{module.bridge}</p>
        <p className="text-ptx-dark-green/80 font-lato">{module.todayTieIn}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-ptx-dark-green mb-3 font-pilat">
          Recommended Next Steps
        </h3>
        <div className="flex flex-wrap gap-3">
          {module.recommendedSolutions.map((solution, index) => (
            <Link key={index} href={solution.href}>
              <span 
                className="inline-flex items-center gap-2 px-4 py-2 bg-ptx-light-green/20 text-ptx-dark-green rounded-lg hover:bg-ptx-light-green/30 transition-colors cursor-pointer font-lato"
                data-testid={`solution-link-${index}`}
              >
                {getSolutionIcon(solution.type)}
                {solution.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {module.citations.length > 0 && (
        <div className="mb-6 text-sm">
          <h4 className="text-ptx-dark-green/60 mb-2 font-medium">Sources</h4>
          <div className="flex flex-wrap gap-4">
            {module.citations.map((citation, index) => (
              <a
                key={index}
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-ptx-bright-blue hover:underline"
                data-testid={`citation-link-${index}`}
              >
                {citation.label}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-ptx-dark-green to-ptx-medium-green rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-2 font-pilat">{module.cta.headline}</h3>
        <p className="text-white/90 mb-4 font-lato">{module.cta.body}</p>
        <Link href={module.cta.href}>
          <button 
            className="bg-white text-ptx-dark-green px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            data-testid="cta-button"
          >
            {module.cta.buttonText}
          </button>
        </Link>
      </div>

      {faq.length > 0 && <FAQSection faq={faq} placeName={placeName} />}
    </section>
  );
}
