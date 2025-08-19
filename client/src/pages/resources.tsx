import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Video, 
  BookOpen, 
  ExternalLink, 
  Calendar,
  Users,
  Settings,
  TrendingUp,
  HelpCircle,
  Clock,
  Wrench,
  BarChart3,
  MessageSquare,
  Newspaper,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

// Helper function to generate resource slugs
const getResourceSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper function to check if item has a local guide
const hasLocalGuide = (item: { url: string }) => {
  return item.url.startsWith('/resources/');
};

// Helper function to check if external URL
const isExternalUrl = (url: string) => {
  return url.startsWith('http');
};


const resourceCategories = [
  {
    id: "topics",
    title: "Technical Topics",
    description: "Comprehensive guides organized by equipment category and application",
    icon: Settings,
    color: "bg-green-600",
    items: [
      {
        title: "Display Monitors",
        description: "Advanced monitoring and control systems for precision agriculture",
        url: "https://www.precisionplanting.com/resources?topic=display-monitors"
      },
      {
        title: "Downforce Control", 
        description: "Optimize planting pressure for consistent depth and emergence",
        url: "https://www.precisionplanting.com/resources?topic=downforce-control"
      },
      {
        title: "Fertilizer Application",
        description: "Precision nutrient placement systems and strategies",
        url: "https://www.precisionplanting.com/resources?topic=fertilizer-application"
      },
      {
        title: "Closing Systems",
        description: "Advanced seed trench closing for improved emergence",
        url: "https://www.precisionplanting.com/resources?topic=closing-systems"
      },
      {
        title: "Data Management",
        description: "Field data collection, analysis, and reporting tools",
        url: "https://www.precisionplanting.com/resources?topic=data-management"
      },
      {
        title: "Seed Meters & Drive Systems",
        description: "Precision seed singulation and placement technology",
        url: "https://www.precisionplanting.com/resources?topic=seed-meters-and-drive-systems"
      },
      {
        title: "Row Cleaners",
        description: "Residue management for optimal seedbed preparation",
        url: "https://www.precisionplanting.com/resources?topic=row-cleaners"
      },
      {
        title: "Seed Firmers",
        description: "Consistent seed-to-soil contact for uniform emergence",
        url: "https://www.precisionplanting.com/resources?topic=seed-firmers"
      }
    ]
  },
  {
    id: "guides",
    title: "Equipment Guides",
    description: "Detailed maintenance and upgrade guides for your equipment",
    icon: BookOpen,
    color: "bg-blue-600",
    items: [
      {
        title: "Planter Maintenance Guide",
        description: "Essential maintenance procedures to keep your planter running smoothly",
        url: "https://www.precisionplanting.com/resources/guides/your-planter-maintenance-guide"
      },
      {
        title: "Seeder Maintenance Guide", 
        description: "Comprehensive maintenance guide for air seeder systems",
        url: "https://www.precisionplanting.com/resources/guides/your-seeder-maintenance-guide"
      },
      {
        title: "Crop Stand Evaluation Guide",
        description: "Assess and optimize crop emergence and stand establishment",
        url: "https://www.precisionplanting.com/resources/guides/crop-stand-evaluation-guide"
      },
      {
        title: "White VE Series Planter Upgrade Guide",
        description: "Transform your White VE series planter with precision upgrades",
        url: "https://www.precisionplanting.com/resources/guides/white-ve-series-planter-upgrade-guide"
      },
      {
        title: "John Deere ExactEmerge Planter Upgrade Guide",
        description: "Enhance your John Deere ExactEmerge planter performance",
        url: "https://www.precisionplanting.com/resources/guides/john-deere-exactemerge-planter-upgrade-guide"
      }
    ]
  },
  {
    id: "videos",
    title: "Video Library",
    description: "Educational videos, conference presentations, and training content",
    icon: Video,
    color: "bg-red-600",
    items: [
      {
        title: "Inside PTI ‣ Season 1",
        description: "Behind-the-scenes look at Precision Technology Institute research",
        url: "https://www.precisionplanting.com/resources/videos/insidepti-season-1"
      },
      {
        title: "Inside PTI ‣ Season 3",
        description: "Advanced research insights from the Precision Technology Institute",
        url: "https://www.precisionplanting.com/resources/videos/insidepti-season-3"
      },
      {
        title: "Inside PTI ‣ Season 4",
        description: "Latest research findings and technology developments",
        url: "https://www.precisionplanting.com/resources/videos/insidepti-season-4"
      },
      {
        title: "Winter Conference 2025 ‣ Priorities of the Planter Pass",
        description: "Essential planting priorities for maximum productivity",
        url: "https://www.precisionplanting.com/resources/videos/winter-conference-2025-priorities-of-the-planter-pass"
      },
      {
        title: "Winter Conference 2025 ‣ Next Level Spraying",
        description: "Advanced spraying techniques and technology",
        url: "https://www.precisionplanting.com/resources/videos/winter-conference-2025-next-level-spraying"
      },
      {
        title: "Winter Conference 2023 ‣ Why Adjust Nutrition",
        description: "The importance of variable rate nutrition management",
        url: "https://www.precisionplanting.com/resources/videos/winter-conference-2023-why-adjust-nutrition"
      }
    ]
  },
  {
    id: "articles",
    title: "Articles & Case Studies",
    description: "Technical articles and real-world implementation stories",
    icon: FileText,
    color: "bg-purple-600",
    items: [
      {
        title: "From Cleaning to Closing: The Three C's of Emergence",
        description: "Understanding the critical factors for successful crop emergence",
        url: "https://www.precisionplanting.com/resources/articles/from-cleaning-to-closing-the-three-cs-of-emergence"
      },
      {
        title: "High Speed Hank | Planter Upgrade Story",
        description: "How high-speed planting technology transformed one farm's operation",
        url: "https://www.precisionplanting.com/resources/articles/hank"
      },
      {
        title: "Buy New Bill | Planter Upgrade Story",
        description: "The economics of upgrading vs. buying new equipment",
        url: "https://www.precisionplanting.com/resources/articles/bill"
      },
      {
        title: "Downforce Dan | Planter Upgrade Story",
        description: "Achieving consistent emergence with precision downforce control",
        url: "https://www.precisionplanting.com/resources/articles/dan"
      }
    ]
  },
  {
    id: "research",
    title: "Research Studies",
    description: "Data-driven research on precision agriculture technologies",
    icon: BarChart3,
    color: "bg-orange-600",
    items: [
      {
        title: "Multi-Year High Management Corn Study",
        description: "Long-term analysis of high management corn production systems",
        url: "https://www.precisionplanting.com/resources/research/high-management-corn-study"
      },
      {
        title: "Planter \"All Wrong\" Study – Corn",
        description: "Impact of planter setup on corn yield and profitability",
        url: "https://www.precisionplanting.com/resources/research/planter-all-wrong-corn-study"
      },
      {
        title: "High Speed Planting Corn Study",
        description: "Performance analysis of high-speed planting systems",
        url: "https://www.precisionplanting.com/resources/research/high-speed-planting-corn-study"
      },
      {
        title: "Emergence Matters (Multi‑year Study)",
        description: "Comprehensive research on the importance of uniform emergence",
        url: "https://www.precisionplanting.com/resources/emergencematters"
      }
    ]
  },
  {
    id: "farmer-stories",
    title: "Farmer Success Stories",
    description: "Real experiences from farmers using precision planting technology",
    icon: Users,
    color: "bg-emerald-600",
    items: [
      {
        title: "We Saved Our Farm $200K by Making an Old Planter New Again",
        description: "How retrofit upgrades delivered massive savings and improved performance",
        url: "https://www.precisionplanting.com/resources/farmer-story/we-saved-our-farm-200k-by-making-an-old-planter-new-again-with-precision-planting"
      },
      {
        title: "\"In one big day, I was able to get 400 acres planted\"",
        description: "Achieving efficiency gains through precision planting technology",
        url: "https://www.precisionplanting.com/resources/farmer-story/in-one-big-day-i-was-able-to-get-400-acres-planted"
      }
    ]
  },
  {
    id: "news",
    title: "Industry News",
    description: "Latest announcements and developments in precision agriculture",
    icon: Newspaper,
    color: "bg-indigo-600",
    items: [
      {
        title: "The Journey To Autonomy In Agriculture",
        description: "Exploring the path toward autonomous farming systems and their impact on modern agriculture",
        url: "/resources/the-journey-to-autonomy-in-agriculture"
      },
      {
        title: "New Era For Ptx Trimble",
        description: "Strategic developments and innovations in PTx Trimble's precision agriculture platform",
        url: "/resources/new-era-for-ptx-trimble"
      },
      {
        title: "Maximize Uptime With Correction Services",
        description: "How precision correction services improve operational efficiency and reduce downtime",
        url: "/resources/maximize-uptime-with-correction-services"
      },
      {
        title: "Future Of Crop Protection AI Plant Level Spraying",
        description: "Advanced AI-driven crop protection with plant-level precision spraying technology",
        url: "/resources/future-of-crop-protection-ai-plant-level-spraying"
      },
      {
        title: "How AI Is Sowing Seeds Of Revolution",
        description: "Artificial intelligence transforming agricultural practices and farming operations",
        url: "/resources/how-ai-is-sowing-seeds-of-revolution"
      },
      {
        title: "Precision Agriculture Trends 2025",
        description: "Key trends and innovations shaping the future of precision agriculture",
        url: "/resources/precision-agriculture-trends-2025"
      },
      {
        title: "Elevating Operational Efficiency With Connected Technology",
        description: "How connected farm technology enhances productivity and operational performance",
        url: "/resources/elevating-operational-efficiency-with-connected-technology"
      },
      {
        title: "Reality Check Busting The Enduring Myths About Precision Agriculture",
        description: "Separating fact from fiction in precision agriculture technology adoption",
        url: "/resources/reality-check-busting-the-enduring-myths-about-precision-agriculture"
      },
      {
        title: "Precision Planting Launches New Planting System (CornerStone)",
        description: "Revolutionary new planting system technology introduction",
        url: "https://www.precisionplanting.com/resources/news/precision-planting-launches-new-planting-system"
      },
      {
        title: "The Launch of PTx",
        description: "Introduction of the next generation Precision Technology platform",
        url: "https://www.precisionplanting.com/resources/news/the-launch-of-ptx"
      }
    ]
  }
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-green-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Precision Planting Resources
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Comprehensive guides, research, and educational materials to help you maximize
              the potential of your precision agriculture equipment and practices.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Technical Guides
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Video Training
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Research Studies
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Success Stories
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {resourceCategories.map((category) => (
              <div key={category.id} className="space-y-8">
                {/* Category Header */}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${category.color} text-white mb-4`}>
                    <category.icon className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4" data-testid={`heading-${category.id}`}>
                    {category.title}
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {category.description}
                  </p>
                </div>

                {/* Category Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((item, index) => {
                    const uniqueKey = `${category.id}-${getResourceSlug(item.title)}`;
                    return (
                      <Card key={uniqueKey} className="hover:shadow-lg transition-shadow duration-300" data-testid={`card-${category.id}-${index}`}>
                        <CardHeader>
                          <CardTitle className="text-lg line-clamp-2" data-testid={`title-${category.id}-${index}`}>
                            {item.title}
                          </CardTitle>
                          <CardDescription className="text-sm line-clamp-3">
                            {item.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div className="flex gap-2">
                            {hasLocalGuide(item) ? (
                              <>
                                <Button 
                                  asChild 
                                  className="flex-1"
                                  data-testid={`button-local-${category.id}-${index}`}
                                >
                                  <Link 
                                    href={`/resources/${getResourceSlug(item.title)}`}
                                    className="flex items-center justify-center gap-2"
                                  >
                                    <ArrowRight className="h-4 w-4" />
                                    View Local Guide
                                  </Link>
                                </Button>
                                {isExternalUrl(item.url) && (
                                  <Button 
                                    variant="outline"
                                    asChild 
                                    className="flex-1"
                                    data-testid={`button-original-${category.id}-${index}`}
                                  >
                                    <a 
                                      href={item.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-center gap-2"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      Original
                                    </a>
                                  </Button>
                                )}
                              </>
                            ) : (
                              <Button 
                                variant="default"
                                asChild 
                                className="w-full"
                                data-testid={`button-external-${category.id}-${index}`}
                              >
                                <a 
                                  href={item.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-2"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                  View Resource
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              Need Additional Support?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our team of precision agriculture experts is ready to help you implement
              and optimize your precision planting systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild data-testid="button-contact-support">
                <a href="/contact" className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Support
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild data-testid="button-dealer-network">
                <a href="/dealers" className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Find a Dealer
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}