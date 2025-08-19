import { useParams, Link } from "wouter";
import { useEffect, useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2,
  MessageSquare,
  Phone,
  ChevronRight
} from "lucide-react";

interface ResourceData {
  id: string;
  type: string;
  title: string;
  url: string;
  slug: string;
  description: string;
  topicTags: string[];
  keyPoints: string[];
  localContext: string;
  offer: string;
  ctaTarget: string;
  metaDescription: string;
  implementationSteps: string[];
  faqs: Array<{ question: string; answer: string }>;
}

// Resource data transformed for SEO and local perspective
const resourcesData: Record<string, ResourceData> = {
  "display-monitors": {
    id: "display-monitors",
    type: "Topic",
    title: "Display Monitors",
    url: "https://www.precisionplanting.com/resources?topic=display-monitors",
    slug: "display-monitors",
    description: "Advanced monitoring and control systems for precision agriculture operations",
    topicTags: ["Display Monitors", "Data Management", "Precision Agriculture"],
    keyPoints: [
      "Real-time field monitoring improves planting accuracy by 15-20%",
      "Integrated displays reduce operator fatigue and decision-making errors",
      "Advanced sensors provide immediate feedback on seed placement and soil conditions",
      "Data logging capabilities enable season-long performance analysis",
      "Connectivity features allow remote monitoring and fleet management"
    ],
    localContext: "In our region's diverse soil conditions from sandy loam to heavy clay, display monitors are essential for adapting to changing field conditions mid-pass.",
    offer: "20|20 Display Systems, FieldView Integration, and Custom Dashboard Setup",
    ctaTarget: "/contact",
    metaDescription: "Learn how display monitor systems optimize planting accuracy in varying soil conditions. Get expert installation and setup from our precision ag specialists.",
    implementationSteps: [
      "Field assessment and current equipment audit",
      "Display system selection based on tractor compatibility",
      "Professional installation and wiring integration",
      "Sensor calibration for local soil conditions",
      "Operator training and custom dashboard setup",
      "Field validation runs with performance monitoring",
      "Ongoing support and data analysis"
    ],
    faqs: [
      {
        question: "Will this work with my older planter?",
        answer: "Most display systems can be retrofitted to planters 10+ years old with proper sensor integration."
      },
      {
        question: "How long does installation take?",
        answer: "Typically 1-2 days depending on planter complexity and desired features."
      },
      {
        question: "What's the ROI on display monitors?",
        answer: "Most customers see 3-5 bushel yield improvements, paying for the system in 1-2 seasons."
      }
    ]
  },
  "downforce-control": {
    id: "downforce-control",
    type: "Topic", 
    title: "Downforce Control",
    url: "https://www.precisionplanting.com/resources?topic=downforce-control",
    slug: "downforce-control",
    description: "Optimize planting pressure for consistent depth and emergence across varying field conditions",
    topicTags: ["Downforce Control", "Depth Control", "Row Units"],
    keyPoints: [
      "Consistent seed depth improves emergence uniformity by up to 30%",
      "Automated downforce adjustment reduces operator workload",
      "Real-time pressure monitoring prevents seed placement errors",
      "Row-by-row control adapts to field variability",
      "Proper downforce reduces soil compaction and sidewall smearing"
    ],
    localContext: "With our region's variable field conditions and residue management challenges, automated downforce control is critical for maintaining consistent planting depth.",
    offer: "DeltaForce Hydraulic Systems, SmartDepth Control, and Professional Calibration",
    ctaTarget: "/contact",
    metaDescription: "Achieve consistent seed depth with automated downforce control systems. Expert installation and calibration services for optimal emergence uniformity.",
    implementationSteps: [
      "Current planter downforce assessment",
      "Hydraulic system design and component selection",
      "Professional installation with proper plumbing",
      "Load cell calibration for accurate pressure readings",
      "Field testing across different soil conditions",
      "Operator training on system optimization",
      "Season-long support and fine-tuning"
    ],
    faqs: [
      {
        question: "Can I retrofit my existing planter?",
        answer: "Yes, most planters can be upgraded with hydraulic downforce systems regardless of age."
      },
      {
        question: "How much downforce do I need?",
        answer: "Varies by soil type, but typically 150-300 lbs per row unit depending on conditions."
      },
      {
        question: "Does this work in no-till conditions?",
        answer: "Especially beneficial in no-till where residue and soil compaction vary significantly."
      }
    ]
  },
  "planter-maintenance-guide": {
    id: "planter-maintenance-guide",
    type: "Guide",
    title: "Planter Maintenance Guide",
    url: "https://www.precisionplanting.com/resources/guides/your-planter-maintenance-guide",
    slug: "planter-maintenance-guide", 
    description: "Essential maintenance procedures to keep your planter running smoothly and maximize longevity",
    topicTags: ["Planter Maintenance", "Equipment Care", "Preventive Maintenance"],
    keyPoints: [
      "Pre-season maintenance prevents 80% of field breakdowns",
      "Proper lubrication extends component life by 2-3 years",
      "Annual wear part replacement costs less than emergency repairs",
      "Calibration verification ensures accurate seed placement",
      "Storage preparation prevents corrosion and component damage"
    ],
    localContext: "Our humid climate requires extra attention to corrosion prevention and moisture management during storage seasons.",
    offer: "Complete Maintenance Service, Parts Supply, and Training Programs",
    ctaTarget: "/contact", 
    metaDescription: "Comprehensive planter maintenance guide for maximizing equipment life. Professional service and genuine parts from certified technicians.",
    implementationSteps: [
      "Pre-season comprehensive inspection",
      "Lubrication system service and grease replacement",
      "Wear part assessment and replacement",
      "Calibration verification and adjustment",
      "Hydraulic system inspection and fluid change",
      "Post-season cleaning and storage prep",
      "Annual training updates on new procedures"
    ],
    faqs: [
      {
        question: "How often should I service my planter?",
        answer: "Major service annually, with daily checks during planting season and mid-season inspections."
      },
      {
        question: "What are the most critical wear items?",
        answer: "Seed discs, closing wheels, depth gauge wheels, and drive chains see the most wear."
      },
      {
        question: "Can I do maintenance myself?",
        answer: "Basic maintenance yes, but complex calibrations and hydraulic work should be done by certified techs."
      }
    ]
  },
  "fertilizer-application": {
    id: "fertilizer-application",
    type: "Topic",
    title: "Fertilizer Application",
    url: "https://www.precisionplanting.com/resources?topic=fertilizer-application",
    slug: "fertilizer-application",
    description: "Precision nutrient placement systems and strategies for optimal crop nutrition",
    topicTags: ["Fertilizer Application", "Nutrient Management", "Variable Rate"],
    keyPoints: [
      "Precise nutrient placement increases fertilizer efficiency by 20-25%",
      "Variable rate application reduces input costs while maintaining yields",
      "2x2 placement provides early season nutrition when plants need it most",
      "Liquid fertilizer systems offer more precise application control",
      "GPS-guided application prevents overlap and reduces waste"
    ],
    localContext: "Our region's soil variability requires variable rate fertilizer application, with particular attention to phosphorus placement in our heavier clay soils.",
    offer: "vApplyHD Systems, FurrowJet Application, and Nutrient Management Planning",
    ctaTarget: "/contact",
    metaDescription: "Optimize fertilizer efficiency with precision application systems. Expert installation and nutrient management planning for maximum ROI.",
    implementationSteps: [
      "Soil sampling and nutrient mapping analysis",
      "Application system design and tank selection",
      "Professional plumbing and electrical installation",
      "Rate controller calibration and GPS integration",
      "Field testing and application rate verification",
      "Operator training on system operation",
      "Season-long monitoring and adjustment support"
    ],
    faqs: [
      {
        question: "What's the ROI on precision fertilizer application?",
        answer: "Most growers see 15-20% input savings with maintained or increased yields, typically paying for equipment in 2-3 seasons."
      },
      {
        question: "Can I retrofit my existing planter?",
        answer: "Yes, most planters can be upgraded with liquid fertilizer systems regardless of make or age."
      },
      {
        question: "What type of fertilizer works best?",
        answer: "Liquid fertilizers provide the most precise application, but dry systems can also be used effectively."
      }
    ]
  },
  "insidepti-season-1": {
    id: "insidepti-season-1",
    type: "Video",
    title: "InsidePTI — Season 1",
    url: "https://www.precisionplanting.com/resources/videos/insidepti-season-1",
    slug: "insidepti-season-1",
    description: "Behind-the-scenes look at Precision Technology Institute research and development",
    topicTags: ["Research", "Technology Development", "Field Testing"],
    keyPoints: [
      "Real-world field testing validates theoretical research findings",
      "Multi-location trials ensure technology works across diverse conditions",
      "Continuous improvement based on farmer feedback and field performance",
      "Data-driven development process leads to practical solutions",
      "Collaboration between engineers and agronomists drives innovation"
    ],
    localContext: "The research methodologies shown in this series directly apply to our local testing and validation processes for new technology implementations.",
    offer: "Research-Based Equipment Recommendations and Field Testing Services",
    ctaTarget: "/contact",
    metaDescription: "Learn from Precision Technology Institute research. Get science-backed equipment recommendations and field testing services.",
    implementationSteps: [
      "Initial consultation on research-backed solutions",
      "Field evaluation and baseline data collection",
      "Technology selection based on PTI research",
      "Pilot implementation on limited acres",
      "Performance monitoring and data analysis",
      "Full-scale deployment based on results",
      "Ongoing optimization using research principles"
    ],
    faqs: [
      {
        question: "How does PTI research apply to my farm?",
        answer: "PTI tests across multiple environments similar to ours, ensuring recommendations are proven in real-world conditions."
      },
      {
        question: "Can I participate in field trials?",
        answer: "Yes, we work with select growers on pilot programs and field testing new technologies."
      },
      {
        question: "What's the value of research-based decisions?",
        answer: "Data-driven equipment choices reduce risk and improve ROI by 25-40% compared to trial-and-error approaches."
      }
    ]
  },
  "high-speed-hank": {
    id: "high-speed-hank",
    type: "Article",
    title: "High Speed Hank | Planter Upgrade Story",
    url: "https://www.precisionplanting.com/resources/articles/hank",
    slug: "high-speed-hank",
    description: "How high-speed planting technology transformed one farm's operation and productivity",
    topicTags: ["High Speed Planting", "Farm Efficiency", "Technology Upgrade"],
    keyPoints: [
      "High-speed planting reduces labor requirements by 40-50%",
      "Maintained seed singulation at speeds up to 10 mph",
      "Increased planting capacity from 30 to 50 acres per day",
      "Improved timing flexibility during critical planting windows",
      "ROI achieved in first season through efficiency gains"
    ],
    localContext: "With our region's narrow planting windows due to weather variability, high-speed planting capability is crucial for getting crops in the ground on time.",
    offer: "High-Speed Planting Upgrades, vSet Systems, and SpeedTube Technology",
    ctaTarget: "/contact",
    metaDescription: "Transform your operation with high-speed planting technology. See how local farmers increased efficiency and maintained quality at higher speeds.",
    implementationSteps: [
      "Current planting speed and capacity assessment",
      "High-speed compatible equipment selection",
      "Seed meter and delivery system upgrades",
      "Ground contact component optimization",
      "Field testing at various speeds and conditions",
      "Operator training on high-speed techniques",
      "Performance monitoring and fine-tuning"
    ],
    faqs: [
      {
        question: "What's the maximum safe planting speed?",
        answer: "With proper equipment, 8-10 mph is achievable while maintaining singulation and placement accuracy."
      },
      {
        question: "Does high-speed planting affect emergence?",
        answer: "When properly implemented, emergence uniformity is maintained or improved due to consistent seed placement."
      },
      {
        question: "What upgrades are needed for high-speed planting?",
        answer: "Typically requires upgraded seed meters, delivery systems, and sometimes closing wheels or down-pressure systems."
      }
    ]
  },
  "closing-systems": {
    id: "closing-systems",
    type: "Topic",
    title: "Closing Systems",
    url: "https://www.precisionplanting.com/resources?topic=closing-systems",
    slug: "closing-systems",
    description: "Advanced seed trench closing for improved emergence and soil contact",
    topicTags: ["Closing Systems", "Emergence", "Soil Contact"],
    keyPoints: [
      "Proper closing eliminates air pockets that delay emergence",
      "Adjustable closing pressure adapts to soil conditions",
      "Spike closing wheels work better in wet conditions",
      "Rubber wheels excel in dry, loose soils",
      "Correct closing wheel spacing prevents sidewall compaction"
    ],
    localContext: "Our region's variable moisture conditions require adaptive closing systems that work in both wet spring conditions and dry summer plantings.",
    offer: "FurrowForce Closing Systems, Spike Closing Wheels, and Custom Configurations",
    ctaTarget: "/contact",
    metaDescription: "Optimize seed trench closing for consistent emergence. Professional installation and setup of closing systems for your soil conditions.",
    implementationSteps: [
      "Soil condition assessment and closing wheel evaluation",
      "Closing system selection based on primary soil types",
      "Professional installation and adjustment",
      "Closing pressure calibration for optimal performance",
      "Field testing across different moisture conditions",
      "Fine-tuning based on emergence results",
      "Seasonal adjustment training and support"
    ],
    faqs: [
      {
        question: "Spike wheels vs rubber wheels - which is better?",
        answer: "Spike wheels work better in wet, sticky conditions while rubber wheels excel in dry, loose soils. Many growers use both."
      },
      {
        question: "How do I know if my closing is working?",
        answer: "Check for air pockets, proper soil-to-seed contact, and uniform emergence patterns across the field."
      },
      {
        question: "Can I adjust closing pressure on the go?",
        answer: "Yes, with FurrowForce systems you can adjust closing pressure from the cab based on changing conditions."
      }
    ]
  },
  "data-management": {
    id: "data-management",
    type: "Topic",
    title: "Data Management",
    url: "https://www.precisionplanting.com/resources?topic=data-management",
    slug: "data-management",
    description: "Field data collection, analysis, and reporting tools for precision agriculture",
    topicTags: ["Data Management", "Analytics", "Field Records"],
    keyPoints: [
      "Automated data collection reduces human error",
      "Real-time monitoring enables immediate corrections",
      "Historical data analysis reveals field patterns",
      "Cloud storage ensures data accessibility and backup",
      "Integrated reporting supports agronomic decisions"
    ],
    localContext: "Managing data across diverse field conditions helps optimize practices for our region's variable soils and weather patterns.",
    offer: "FieldView Integration, Data Analytics Services, and Custom Reporting",
    ctaTarget: "/contact",
    metaDescription: "Transform field data into actionable insights. Professional data management setup and analytics services for precision agriculture.",
    implementationSteps: [
      "Current data collection system assessment",
      "Platform selection and integration planning",
      "Hardware installation and connectivity setup",
      "Data flow configuration and testing",
      "Custom dashboard and report creation",
      "User training on data interpretation",
      "Ongoing analytics support and optimization"
    ],
    faqs: [
      {
        question: "What data should I be collecting?",
        answer: "Key metrics include planting population, depth, singulation, emergence, and yield data for each field zone."
      },
      {
        question: "How secure is my farm data?",
        answer: "All data is encrypted and stored securely with strict privacy controls. You maintain full ownership of your information."
      },
      {
        question: "Can I share data with my agronomist?",
        answer: "Yes, controlled sharing features allow you to provide access to trusted advisors while maintaining data control."
      }
    ]
  },
  "seed-meters-drive-systems": {
    id: "seed-meters-drive-systems",
    type: "Topic",
    title: "Seed Meters & Drive Systems",
    url: "https://www.precisionplanting.com/resources?topic=seed-meters-and-drive-systems",
    slug: "seed-meters-drive-systems",
    description: "Precision seed singulation and placement technology for optimal stand establishment",
    topicTags: ["Seed Meters", "Drive Systems", "Singulation"],
    keyPoints: [
      "Vacuum meters provide superior singulation across seed sizes",
      "Electric drive systems eliminate chain wear and maintenance",
      "Variable population capability optimizes plant spacing",
      "Consistent seed delivery improves emergence timing",
      "Real-time monitoring alerts to singulation issues"
    ],
    localContext: "With our diverse crop rotation and varying seed sizes, precision metering systems ensure optimal plant populations for each crop.",
    offer: "vSet Meters, vDrive Systems, and Population Control Technology",
    ctaTarget: "/contact",
    metaDescription: "Achieve precise seed placement with advanced metering systems. Professional installation and calibration for optimal singulation.",
    implementationSteps: [
      "Current metering system evaluation",
      "Meter and drive system selection",
      "Professional installation and integration",
      "Calibration for specific seed types",
      "Population mapping and variable rate setup",
      "Field validation and performance verification",
      "Ongoing calibration support and maintenance"
    ],
    faqs: [
      {
        question: "What's the advantage of vacuum meters?",
        answer: "Vacuum meters provide consistent singulation across different seed sizes and shapes with less mechanical wear."
      },
      {
        question: "Can I plant different populations across a field?",
        answer: "Yes, with variable rate systems you can adjust population based on soil productivity zones."
      },
      {
        question: "How often do meters need calibration?",
        answer: "Initial calibration for each seed lot, with periodic checks during the season and adjustments as needed."
      }
    ]
  }
};

export default function ResourceDetail() {
  const params = useParams();
  const resourceId = params.id;
  const [resource, setResource] = useState<ResourceData | null>(null);

  useEffect(() => {
    if (resourceId && resourcesData[resourceId]) {
      setResource(resourcesData[resourceId]);
      
      // Update page title for SEO
      document.title = `${resourcesData[resourceId].title} — Local Take & How We Implement It | GreenHarvest`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', resourcesData[resourceId].metaDescription);
      }
    }
  }, [resourceId]);

  if (!resource) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Local Guide Coming Soon</h1>
            <p className="text-lg text-muted-foreground mb-6">
              We're currently developing a comprehensive local guide for this resource. 
              In the meantime, you can access the original resource or contact us directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg">
                <Link href="/contact" className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Talk to a Specialist
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/resources" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Resources
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Have questions about this resource? Our team of precision agriculture experts 
              is ready to provide personalized guidance for your operation.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Button variant="ghost" asChild data-testid="button-back-to-resources">
            <Link href="/resources">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Link>
          </Button>
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {resource.topicTags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            <h1 className="text-4xl font-bold mb-4" data-testid="text-resource-title">
              {resource.title} — Our Local Perspective
            </h1>
            <p className="text-lg text-muted-foreground">
              {resource.description}
            </p>
          </header>

          {/* Summary */}
          <section id="summary" className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Quick Take
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {resource.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ChevronRight className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground">
                  Based on insights from{' '}
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener nofollow"
                    className="text-primary hover:underline"
                  >
                    Precision Planting
                  </a>
                  . We've summarized and added our local perspective below.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Local Commentary */}
          <section id="local-commentary" className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle>What This Means For Farms in Our Region</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {resource.localContext} Our team has extensive experience helping local growers 
                  implement these solutions effectively, with over 200+ successful installations 
                  in the past three years. We understand the unique challenges of our area's 
                  farming conditions and can guide you through the entire process.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Implementation */}
          <section id="implementation" className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle>How We Implement This</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {resource.implementationSteps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <section id="cta" className="mb-12">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">
                  Get a Quote, Field Demo, or Upgrade Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 mb-6">
                  We install and support: {resource.offer}.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg">
                    <Link href={resource.ctaTarget} className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Talk to a Specialist
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/contact" className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Request Field Demo
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* FAQ */}
          <section id="faq" className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Questions We Get a Lot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {resource.faqs.map((faq, index) => (
                    <div key={index}>
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Footer */}
          <footer className="border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Original reference:{' '}
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener nofollow"
                className="text-primary hover:underline"
              >
                Precision Planting
              </a>
              . © 2024 GreenHarvest.
            </p>
          </footer>
        </article>
      </div>

      <Footer />
    </div>
  );
}