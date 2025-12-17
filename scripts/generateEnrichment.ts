import fs from 'fs';
import path from 'path';
import type { 
  LocationSeed, 
  LocationEnrichment, 
  EnrichmentModule, 
  FAQItem,
  RecommendedSolution,
  Citation,
  ContentAngle,
  StateCode,
  SeedFile
} from '../shared/enrichmentTypes';

const seedPath = path.join(process.cwd(), 'content/locations.seed.json');
const outputBase = path.join(process.cwd(), 'content/enrichment');

const stateNames: Record<StateCode, string> = {
  AL: 'Alabama',
  MS: 'Mississippi',
  FL: 'Florida',
  TN: 'Tennessee'
};

const cropLinks: Record<string, string> = {
  cotton: '/crops/cotton',
  peanuts: '/crops/peanuts',
  corn: '/crops/corn',
  soybeans: '/crops/soybeans',
  rice: '/crops/rice'
};

const serviceLinks = [
  { label: 'RTK Correction Services', href: '/services/rtk-correction-services' },
  { label: 'Guidance & Steering Installation', href: '/services/guidance-steering-installation' },
  { label: 'Planter Technology Upgrades', href: '/services/planter-technology' },
  { label: 'Application Control Systems', href: '/services/application-control' },
  { label: 'Training & Support', href: '/services/training-support' }
];

const categoryLinks = [
  { label: 'Guidance Displays', href: '/products?category=guidance-displays' },
  { label: 'Steering Systems', href: '/products?category=steering-systems' },
  { label: 'Planting Technology', href: '/products?category=planting' },
  { label: 'Application Control', href: '/products?category=application-control' }
];

function getAngleHeading(angle: ContentAngle, placeName: string): string {
  const templates: Record<ContentAngle, string> = {
    'crop-evolution': `How ${placeName} Agriculture Has Evolved`,
    'soils-water': `Understanding ${placeName}'s Soil and Water Challenges`,
    'infrastructure': `Agricultural Infrastructure in ${placeName}`,
    'technology-adoption': `Precision Agriculture Adoption in ${placeName}`,
    'resilience-weather': `Weather Resilience in ${placeName} Farming`,
    'economics-operations': `Farm Economics and Operations in ${placeName}`
  };
  return templates[angle];
}

function getAngleIntro(seed: LocationSeed): string {
  const { angle, placeName, primaryCrops, watershed, soilType, state } = seed;
  const cropList = primaryCrops.slice(0, 2).join(' and ');
  const stateName = stateNames[state];
  
  const intros: Record<ContentAngle, string[]> = {
    'crop-evolution': [
      `Farming in ${placeName} has deep roots in the region's agricultural heritage, with ${cropList} remaining central to local operations. For generations, families across this part of ${stateName} have built their livelihoods around these crops, developing practices refined through seasons of trial and adaptation. Today's operations carry forward that legacy while embracing new tools that help maximize every acre's potential.`,
      `The agricultural landscape of ${placeName} reflects generations of adaptation, where producers have refined their approach to growing ${cropList}. What began as subsistence farming evolved into commercial operations that now feed global markets. Understanding this history helps explain why modern precision approaches resonate so strongly with local growers who value both tradition and progress.`
    ],
    'soils-water': [
      `Managing soil variability and water resources has long shaped how farmers in ${placeName} approach ${cropList} production. The ${soilType || 'diverse soil'} conditions found across this region create distinct management zones within individual fields, where uniform applications often leave yield potential unrealized. Successful growers here have learned that treating each acre differently is key to consistent results.`,
      `The ${soilType || 'diverse soil'} conditions across ${placeName} present both challenges and opportunities for ${cropList} growers. ${watershed ? `Situated within the ${watershed}, farms here` : 'Farms in this region'} must balance moisture management with nutrient retention, a balance that shifts with each growing season. This complexity makes site-specific management not just beneficial but essential for sustainable profitability.`
    ],
    'infrastructure': [
      `${placeName}'s position within the regional agricultural economy has shaped how local farms handle ${cropList} production and distribution. Access to processing facilities, equipment dealers, and agricultural services enables operations to focus on what they do best—growing high-quality crops. This support network has expanded over the years to include precision agriculture specialists who help farmers implement the latest technology.`,
      `Transportation networks and agricultural services in ${placeName} support a robust ${cropList} production system that connects local farms to broader markets. From grain elevators to input suppliers, the infrastructure surrounding agriculture here reflects decades of investment in the region's farming future. Modern additions to this infrastructure include RTK signal networks and data connectivity that enable precision farming at scale.`
    ],
    'technology-adoption': [
      `Farmers across ${placeName} have increasingly turned to precision technology to optimize ${cropList} yields and reduce input costs. What started with basic GPS guidance has evolved into integrated systems that control planting populations, fertilizer rates, and application timing—all based on field-specific data. This adoption reflects a practical approach to farming where measurable results justify every technology investment.`,
      `Technology adoption in ${placeName} reflects a practical approach to improving ${cropList} production efficiency. Local growers evaluate equipment and practices based on real-world performance, not marketing promises. This discerning approach has led to steady uptake of proven precision tools that deliver documented savings on inputs while maintaining or improving yields.`
    ],
    'resilience-weather': [
      `Weather variability in ${placeName} has driven farmers to adopt practices that protect ${cropList} yields across unpredictable seasons. From excessive spring moisture that delays planting to summer droughts that stress crops, producers here face challenges that demand both preparation and adaptability. Building operational resilience through better equipment and management practices helps farms weather whatever conditions each year brings.`,
      `Building resilience against weather extremes remains a priority for ${placeName} producers growing ${cropList}. The region's history includes seasons lost to drought, flood, and storm—lessons that inform today's approach to farm management. Precision technology plays a growing role in this resilience, helping farmers make the most of favorable conditions while minimizing losses when weather turns unfavorable.`
    ],
    'economics-operations': [
      `Farm economics in ${placeName} center on maximizing returns from ${cropList} while managing rising input costs. With seed, fertilizer, and chemical expenses climbing, every bushel or pound of yield matters more than ever. Growers here increasingly rely on data-driven decisions to allocate resources where they generate the best returns, treating precision technology as an investment in long-term profitability.`,
      `Operational efficiency drives decision-making for ${placeName} farms focused on ${cropList} production. Labor constraints, equipment costs, and market volatility all factor into how operations plan their seasons. Precision tools that reduce overlap, optimize inputs, and improve timeliness directly address these challenges by putting more control in the farmer's hands.`
    ]
  };
  
  const options = intros[angle];
  return options[Math.floor(Math.random() * options.length)];
}

function getAngleBullets(seed: LocationSeed): string[] {
  const { angle, primaryCrops, constraints, watershed, soilType } = seed;
  const mainCrop = primaryCrops[0];
  const secondCrop = primaryCrops[1] || primaryCrops[0];
  
  const bulletSets: Record<ContentAngle, string[][]> = {
    'crop-evolution': [
      [
        `Historically, farms in this area have relied on ${mainCrop} as a primary cash crop, with rotations including ${secondCrop}`,
        `Local producers have adapted planting practices over decades to work with regional growing conditions`,
        `Modern operations commonly combine traditional knowledge with data-driven decision tools`
      ],
      [
        `The shift toward ${mainCrop} intensification has driven demand for more precise planting and application`,
        `Crop rotations between ${mainCrop} and ${secondCrop} remain common for soil health management`,
        `Yields have improved as growers adopt variety-specific management practices`
      ]
    ],
    'soils-water': [
      [
        `${soilType ? `${soilType.charAt(0).toUpperCase() + soilType.slice(1)} soils` : 'Variable soil conditions'} require careful management of inputs across fields`,
        `${watershed ? `The ${watershed} influences` : 'Regional watersheds influence'} drainage patterns and irrigation decisions`,
        `Soil sampling and zone mapping help identify areas needing targeted treatment`
      ],
      [
        `Water management remains critical for both irrigation scheduling and drainage control`,
        `Soil variability within fields often exceeds variability between farms`,
        `Precision soil sensing enables variable-rate applications matched to field conditions`
      ]
    ],
    'infrastructure': [
      [
        `Proximity to grain elevators and processing facilities supports efficient harvest logistics`,
        `Local equipment dealers and service providers enable rapid support during critical seasons`,
        `Transportation networks connect farms to regional and export markets`
      ],
      [
        `Agricultural service infrastructure has grown alongside farm technology needs`,
        `GPS and cellular coverage enables real-time data transfer from field equipment`,
        `Access to RTK correction networks provides centimeter-level guidance accuracy`
      ]
    ],
    'technology-adoption': [
      [
        `Guidance systems have become standard equipment for row crop operations`,
        `Variable-rate seeding and fertilizer application continue to gain adoption`,
        `Yield monitoring provides field-level data for continuous improvement`
      ],
      [
        `Autosteer adoption has reduced operator fatigue during long planting and harvest days`,
        `Section control on planters and sprayers minimizes overlap and saves inputs`,
        `Cloud-based data platforms enable better agronomic decision-making`
      ]
    ],
    'resilience-weather': [
      [
        `Variable rainfall patterns require flexible irrigation and drainage strategies`,
        `Timely planting windows demand reliable equipment and efficient field operations`,
        `Heat stress management influences variety selection and planting dates`
      ],
      [
        `Season-long weather monitoring informs spray timing and harvest decisions`,
        `Drainage improvements help manage excess moisture during wet periods`,
        `Crop insurance and risk management tools complement precision farming practices`
      ]
    ],
    'economics-operations': [
      [
        `Input costs for seed, fertilizer, and chemicals represent major expense categories`,
        `Reducing overlap and optimizing rates directly impacts per-acre profitability`,
        `Labor efficiency gains from automation help address workforce constraints`
      ],
      [
        `Data-driven decisions enable better allocation of limited operating budgets`,
        `Equipment utilization and timeliness affect both yield potential and costs`,
        `Documentation and record-keeping support lending and compliance requirements`
      ]
    ]
  };
  
  const options = bulletSets[angle];
  return options[Math.floor(Math.random() * options.length)];
}

function getBridge(seed: LocationSeed): string {
  const { angle, placeName, constraints, primaryCrops } = seed;
  const constraint = constraints[0];
  const mainCrop = primaryCrops[0];
  
  const bridges: Record<ContentAngle, string[]> = {
    'crop-evolution': [
      `This agricultural heritage directly influences today's precision farming decisions, as modern growers build on proven local practices while integrating new technology. The experience accumulated over decades of ${mainCrop} production provides a foundation that precision tools can enhance—not replace. Farmers here know their land; technology helps them act on that knowledge more precisely.`,
      `Understanding how farming has evolved in ${placeName} helps explain why certain precision approaches resonate with local producers. The transition from conventional to precision methods isn't about abandoning what works—it's about doing the same things more accurately and efficiently. Local growers recognize that guidance systems and variable-rate equipment are natural extensions of practices they've always valued.`
    ],
    'soils-water': [
      `These soil and water characteristics make precision management particularly valuable, as one-size-fits-all approaches often underperform in variable conditions. When fields contain multiple soil types with different yield potentials, applying uniform rates means either under-applying where it's needed or wasting inputs where they can't be used effectively. Precision tools solve this by matching applications to actual field conditions.`,
      `Addressing ${constraint} through precision tools allows growers to work with their land's natural variability rather than against it. Zone-based management, informed by soil sampling and yield data, enables producers to treat different parts of their fields according to their actual potential. This approach both improves results and reduces the cost of inputs that would otherwise be wasted.`
    ],
    'infrastructure': [
      `Strong local infrastructure enables farmers to focus on production while relying on nearby support for equipment, inputs, and technology services. When a guidance system needs calibration or a planter upgrade requires fine-tuning, having accessible expertise matters. Vantage South's presence in the region means local growers have a partner who understands their equipment, their crops, and their specific challenges.`,
      `Access to professional installation and ongoing support makes precision technology adoption more practical for operations of all sizes. Rather than figuring out complex systems alone, farmers can rely on trained technicians who ensure equipment works correctly from day one. This support extends through the season, with troubleshooting and adjustments available when needed most.`
    ],
    'technology-adoption': [
      `Early adopters in the area have demonstrated measurable benefits, encouraging neighboring operations to explore similar precision approaches. When farmers see actual yield maps and input savings from operations they know and trust, the decision to invest becomes easier. Word-of-mouth recommendations carry weight in agricultural communities where reputation matters and results speak louder than advertising.`,
      `The return on investment from precision tools becomes clearer as more local farms document their results. Guidance systems that eliminate skip and overlap, section control that cuts input waste, variable-rate seeding that optimizes populations—these tools deliver savings that compound season after season. The question shifts from whether precision pays to how quickly it can be implemented.`
    ],
    'resilience-weather': [
      `Weather uncertainty reinforces the value of precision tools that help farmers make the most of favorable conditions and minimize losses during challenging periods. When planting windows shrink due to wet conditions, autosteer enables longer operating hours with less fatigue. When drought stresses crops, variable-rate applications ensure that limited resources go where they'll do the most good.`,
      `Building operational resilience through technology helps farms maintain profitability across variable growing seasons. Precision equipment that increases planting speed, improves application accuracy, and provides real-time field data gives operators more control over outcomes. While no technology can control the weather, the right tools help farmers respond more effectively to whatever conditions develop.`
    ],
    'economics-operations': [
      `These economic pressures make precision agriculture tools particularly relevant, as documenting input savings and yield improvements directly affects the bottom line. When margins are tight, eliminating overlap on a single pass can save more than the cost of the guidance system that enables it. Precision isn't just about technology—it's about treating farming as a business where every input dollar should generate returns.`,
      `Managing ${constraint} effectively through precision approaches can shift narrow margins toward sustainable profitability. The data captured by modern equipment supports better decisions, from where to apply more fertilizer to where reducing rates won't hurt yields. Over time, this information builds a picture of each field's true potential and how to achieve it efficiently.`
    ]
  };
  
  const options = bridges[angle];
  return options[Math.floor(Math.random() * options.length)];
}

function getTodayTieIn(seed: LocationSeed): string {
  const { primaryCrops, constraints, placeName } = seed;
  const mainCrop = primaryCrops[0];
  const constraint = constraints[0];
  const secondConstraint = constraints[1] || constraints[0];
  
  const tieIns = [
    `For ${mainCrop} operations dealing with ${constraint}, precision guidance and variable-rate technology offer practical solutions that translate regional knowledge into field-level decisions. GPS-guided equipment ensures accurate placement of seeds and inputs, while zone mapping enables tailored management across diverse field conditions. These tools help ${placeName} farmers do what they've always done—grow quality crops—with greater accuracy and less waste.`,
    `Addressing ${constraint} in ${mainCrop} production benefits from GPS-guided equipment, zone-based management, and real-time monitoring—tools that help farms operate more efficiently. Autosteer reduces operator fatigue during critical planting windows, section control eliminates costly overlap, and yield monitors document results for continuous improvement. Together, these technologies support the decision-making that drives profitability.`,
    `Modern precision systems help ${mainCrop} growers tackle ${constraint} by enabling site-specific management that respects field variability while reducing unnecessary inputs. From sub-inch guidance accuracy to variable-rate prescriptions, today's equipment gives farmers unprecedented control over their operations. The result is better resource utilization, improved yields, and documented performance that supports both operational decisions and business planning.`
  ];
  
  return tieIns[Math.floor(Math.random() * tieIns.length)];
}

function getRecommendedSolutions(seed: LocationSeed): RecommendedSolution[] {
  const solutions: RecommendedSolution[] = [];
  
  if (seed.primaryCrops[0] && cropLinks[seed.primaryCrops[0]]) {
    solutions.push({
      type: 'crop',
      label: `${seed.primaryCrops[0].charAt(0).toUpperCase() + seed.primaryCrops[0].slice(1)} Production Solutions`,
      href: cropLinks[seed.primaryCrops[0]]
    });
  }
  
  const service = serviceLinks[Math.floor(Math.random() * serviceLinks.length)];
  solutions.push({ type: 'service', ...service });
  
  const category = categoryLinks[Math.floor(Math.random() * categoryLinks.length)];
  solutions.push({ type: 'category', ...category });
  
  return solutions;
}

function getCitations(state: StateCode, seedFile: SeedFile): Citation[] {
  const stateCitations = seedFile.citations[state] || [];
  const selected = stateCitations.slice(0, 2);
  return selected;
}

function getCTA(seed: LocationSeed): { headline: string; body: string; href: string; buttonText: string } {
  return {
    headline: `Ready to Explore Precision Solutions for Your ${seed.placeName} Operation?`,
    body: `Schedule a field demonstration to see how guidance, steering, and variable-rate technology can work on your farm.`,
    href: '/schedule-field-demo',
    buttonText: 'Schedule a Demo'
  };
}

function getFAQ(seed: LocationSeed): FAQItem[] {
  const { placeType, placeName, countyName, primaryCrops } = seed;
  const mainCrop = primaryCrops[0];
  
  const cityFAQ: FAQItem[] = [
    {
      question: `Do you service farms near ${placeName}?`,
      answer: `Yes, Vantage South provides equipment installation, RTK signal coverage, and ongoing support for farms in and around ${placeName}. Contact us to discuss your operation's needs.`
    },
    {
      question: `What precision agriculture solutions work best for ${mainCrop} in this area?`,
      answer: `For ${mainCrop} production near ${placeName}, we commonly recommend guidance systems, autosteer, and variable-rate planting or application technology. The best fit depends on your specific equipment and goals.`
    },
    {
      question: `How do I get started with precision farming technology?`,
      answer: `Start with a field demonstration where we'll show you how guidance and mapping tools work on your own fields. From there, we can recommend solutions that match your operation.`
    }
  ];
  
  const countyFAQ: FAQItem[] = [
    {
      question: `Do you offer installations across ${placeName}?`,
      answer: `Yes, we provide professional installation services throughout ${placeName}, including guidance system setup, autosteer calibration, and planter technology upgrades.`
    },
    {
      question: `What RTK coverage is available in ${placeName}?`,
      answer: `Vantage South operates RTK correction networks covering ${placeName}. We can verify signal strength at your location during a site visit or demonstration.`
    },
    {
      question: `Which products are most popular with ${placeName} farmers?`,
      answer: `${placeName} growers commonly choose guidance displays, autosteer systems, and section control for planters and sprayers. Variable-rate seeding is gaining adoption for ${mainCrop} operations.`
    }
  ];
  
  const stateFAQ: FAQItem[] = [
    {
      question: `Which counties does Vantage South prioritize in ${placeName}?`,
      answer: `We provide full service across our ${placeName} territory, with dedicated coverage in major agricultural counties. Contact us to confirm service availability for your specific location.`
    },
    {
      question: `What makes Vantage South different from other precision ag providers?`,
      answer: `We combine local agronomic knowledge with professional installation, ongoing support, and reliable RTK signal coverage. Our team understands ${placeName} farming conditions.`
    },
    {
      question: `Do you offer training for new precision farming equipment?`,
      answer: `Yes, training is included with every installation. We also provide seasonal refresher sessions and are available for support throughout the growing season.`
    }
  ];
  
  switch (placeType) {
    case 'city': return cityFAQ;
    case 'county': return countyFAQ;
    case 'state': return stateFAQ;
    default: return countyFAQ;
  }
}

function generateEnrichment(seed: LocationSeed, seedFile: SeedFile): LocationEnrichment {
  const module: EnrichmentModule = {
    heading: getAngleHeading(seed.angle, seed.placeName),
    intro: getAngleIntro(seed),
    bullets: getAngleBullets(seed),
    bridge: getBridge(seed),
    todayTieIn: getTodayTieIn(seed),
    recommendedSolutions: getRecommendedSolutions(seed),
    citations: getCitations(seed.state, seedFile),
    cta: getCTA(seed)
  };
  
  return {
    placeType: seed.placeType,
    state: seed.state,
    placeName: seed.placeName,
    countyName: seed.countyName,
    primaryCrops: seed.primaryCrops,
    constraints: seed.constraints,
    angle: seed.angle,
    module,
    faq: getFAQ(seed),
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  };
}

function getSlugFromRoute(route: string): string {
  const parts = route.split('/').filter(Boolean);
  if (parts.length >= 2) {
    return parts[1];
  }
  return parts[0] || 'unknown';
}

function getStateFolder(state: StateCode): string {
  const folders: Record<StateCode, string> = {
    AL: 'alabama',
    MS: 'mississippi',
    FL: 'florida',
    TN: 'tennessee'
  };
  return folders[state];
}

async function main() {
  console.log('Loading seed file...');
  const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8')) as SeedFile;
  
  console.log(`Found ${seedData.locations.length} locations to process`);
  
  for (const seed of seedData.locations) {
    const enrichment = generateEnrichment(seed, seedData);
    const stateFolder = getStateFolder(seed.state);
    const slug = getSlugFromRoute(seed.route);
    
    const outputDir = path.join(outputBase, stateFolder);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, `${slug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(enrichment, null, 2));
    console.log(`Generated: ${outputPath}`);
  }
  
  console.log('Enrichment generation complete!');
}

main().catch(console.error);
