import { useParams, Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { FieldDemoCTA } from "@/components/FieldDemoCTA";
import { useSEO, generateServiceSchema, generateBreadcrumbSchema, JsonLd } from "@/lib/seo";
import targetLocations from "@shared/targetLocations.json";
import { ChevronRight, CheckCircle2, MapPin, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cropContent: Record<string, {
  title: string;
  tagline: string;
  description: string;
  challenges: { challenge: string; solution: string }[];
  technologies: { name: string; description: string; link: string }[];
  benefits: string[];
}> = {
  "cotton-precision-ag": {
    title: "Cotton Precision Agriculture",
    tagline: "Technology solutions for profitable cotton production",
    description: "Precision agriculture technology delivers measurable improvements in cotton production. From sub-inch guidance for strip-till and bed preparation to variable rate seeding and automated steering, we help cotton farmers reduce inputs and improve yields.",
    challenges: [
      { challenge: "Inconsistent plant stand", solution: "Precision seed placement with electric drives and downforce control ensures uniform emergence" },
      { challenge: "Overlap on inputs", solution: "RTK guidance eliminates overlap during planting, sidedress, and defoliation" },
      { challenge: "Variable soil conditions", solution: "Automatic downforce adjusts to changing conditions for consistent depth" },
      { challenge: "Strip-till accuracy", solution: "Sub-inch repeatable guidance enables precise strip-till operations year after year" }
    ],
    technologies: [
      { name: "vDrive", description: "Electric seed drives for variable rate and singulation", link: "/product/vdrive" },
      { name: "DeltaForce", description: "Automatic downforce for consistent seed depth", link: "/product/deltaforce" },
      { name: "20|20", description: "Complete planting monitor and control", link: "/product/2020" },
      { name: "RTK Guidance", description: "Sub-inch accuracy for all operations", link: "/services/rtk-gnss-setup" }
    ],
    benefits: [
      "Reduce seed costs with variable rate population",
      "Eliminate overlap on fertilizer and chemicals",
      "Improve stand uniformity for better yields",
      "Enable strip-till with year-over-year repeatability",
      "Reduce operator fatigue with automated steering"
    ]
  },
  "peanut-precision-ag": {
    title: "Peanut Precision Agriculture",
    tagline: "Precision technology for peanut farming success",
    description: "Peanut production benefits from precision agriculture at every step. RTK guidance enables accurate bed preparation, precision planting improves stand establishment, and section control reduces chemical and fungicide waste.",
    challenges: [
      { challenge: "Bed formation accuracy", solution: "RTK guidance ensures consistent bed formation for uniform planting" },
      { challenge: "Seed spacing variability", solution: "Electric drives maintain precise seed spacing at all speeds" },
      { challenge: "Fungicide overlap", solution: "Section control prevents double-application and reduces costs" },
      { challenge: "Harvest efficiency", solution: "Guidance improves digger alignment and reduces field losses" }
    ],
    technologies: [
      { name: "SpeedTube", description: "High-speed singulation for peanut planters", link: "/product/speedtube" },
      { name: "DeltaForce", description: "Consistent depth across variable soils", link: "/product/deltaforce" },
      { name: "SmartFirmer", description: "Real-time soil sensing for seeding adjustments", link: "/product/smartfirmer" },
      { name: "Section Control", description: "Eliminate overlap on multi-row equipment", link: "/products?category=Application+Control" }
    ],
    benefits: [
      "Improve plant stand uniformity",
      "Reduce seed waste from doubles and skips",
      "Cut fungicide costs with section control",
      "Enable precise bed formation",
      "Improve harvest efficiency with guidance"
    ]
  },
  "corn-precision-ag": {
    title: "Corn Precision Agriculture",
    tagline: "Maximize corn yields with precision technology",
    description: "Corn production reaches its full potential with precision agriculture. Variable rate seeding optimizes population by zone, RTK guidance eliminates overlap, and planter technology ensures every seed is placed for success.",
    challenges: [
      { challenge: "Variable field conditions", solution: "Prescription-based variable rate planting optimizes population by zone" },
      { challenge: "Downforce management", solution: "Automatic row-by-row downforce adapts to changing conditions" },
      { challenge: "Starter fertilizer placement", solution: "In-furrow application control delivers precise starter rates" },
      { challenge: "Sidedress accuracy", solution: "RTK guidance enables precise Y-drop and sidedress application" }
    ],
    technologies: [
      { name: "vDrive", description: "Variable rate electric seed drives", link: "/product/vdrive" },
      { name: "DeltaForce", description: "Row-by-row downforce control", link: "/product/deltaforce" },
      { name: "FurrowForce", description: "Precision closing for better emergence", link: "/product/furrowforce" },
      { name: "20|20", description: "Real-time planting analytics", link: "/product/2020" }
    ],
    benefits: [
      "Optimize population by management zone",
      "Improve emergence with consistent depth",
      "Reduce seed costs with variable rate",
      "Enable precise sidedress application",
      "Better data for agronomic decisions"
    ]
  },
  "soybean-precision-ag": {
    title: "Soybean Precision Agriculture",
    tagline: "Precision solutions for profitable soybeans",
    description: "Soybean production benefits from precision agriculture through reduced input costs and improved stand establishment. Section control, variable rate seeding, and RTK guidance help maximize profitability per acre.",
    challenges: [
      { challenge: "Seeding rate optimization", solution: "Variable rate prescriptions match population to yield potential" },
      { challenge: "Overlap on field edges", solution: "Section control and RTK guidance minimize overlap" },
      { challenge: "Double-cropping timing", solution: "Automated steering speeds planting during tight windows" },
      { challenge: "Emergence variability", solution: "Consistent depth and furrow closing improve stands" }
    ],
    technologies: [
      { name: "vDrive", description: "Electric drives for precise spacing", link: "/product/vdrive" },
      { name: "SpeedTube", description: "Maintain singulation at higher speeds", link: "/product/speedtube" },
      { name: "FurrowForce", description: "Consistent furrow closing", link: "/product/furrowforce" },
      { name: "CleanSweep", description: "Residue management for better seed placement", link: "/product/cleansweep" }
    ],
    benefits: [
      "Reduce seed costs with variable rate",
      "Minimize overlap on headlands",
      "Speed planting during tight windows",
      "Improve stand uniformity",
      "Better emergence through closing consistency"
    ]
  },
  "row-crops-precision-ag": {
    title: "Row Crop Precision Agriculture",
    tagline: "Flexible technology for multi-crop operations",
    description: "Diverse row crop operations need technology that works across multiple crops. Our precision agriculture solutions integrate seamlessly whether you're planting cotton, corn, soybeans, peanuts, or other row crops.",
    challenges: [
      { challenge: "Multi-crop flexibility", solution: "Equipment that adapts to different crop requirements" },
      { challenge: "Data integration", solution: "Unified data platform across all crops and operations" },
      { challenge: "Equipment utilization", solution: "Technology that works on multiple planters and applicators" },
      { challenge: "Operator training", solution: "Consistent interfaces reduce learning curve" }
    ],
    technologies: [
      { name: "20|20", description: "Universal planting monitor and control", link: "/product/2020" },
      { name: "vDrive", description: "Multi-crop variable rate capability", link: "/product/vdrive" },
      { name: "DeltaForce", description: "Automatic downforce for any crop", link: "/product/deltaforce" },
      { name: "RTK Guidance", description: "Precision guidance across all operations", link: "/services/rtk-gnss-setup" }
    ],
    benefits: [
      "One platform across all crops",
      "Consistent accuracy for every operation",
      "Simplified operator training",
      "Integrated data management",
      "Flexible technology investments"
    ]
  }
};

export default function CropPage() {
  const params = useParams();
  const cropSlug = params.slug;
  
  const crop = targetLocations.crops.find(c => c.slug === cropSlug);
  const content = cropSlug ? cropContent[cropSlug] : null;
  
  if (!crop || !content) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Crop Page Not Found</h1>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const path = `/crops/${cropSlug}`;
  useSEO({ path });

  const schemas = [
    generateServiceSchema({
      name: content.title,
      description: content.description,
      url: path
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Crops", url: "/crops" },
      { name: content.title, url: path }
    ])
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <JsonLd data={schemas} />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-green-800 to-green-900 text-white py-16">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-green-200 text-sm mb-6" data-testid="breadcrumb-crop">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{content.title}</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <Sprout className="h-10 w-10 text-green-300" />
              <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-crop-title">{content.title}</h1>
            </div>
            <p className="text-xl text-green-100">{content.tagline}</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <p className="text-lg text-gray-700 leading-relaxed">{content.description}</p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Challenges & Solutions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {content.challenges.map((item, index) => (
                <Card key={index} className="rounded-none border-l-4 border-l-green-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-red-700">{item.challenge}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.solution}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Recommended Technology</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.technologies.map((tech) => (
                <Link key={tech.name} href={tech.link}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer rounded-none" data-testid={`card-tech-${tech.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardHeader>
                      <CardTitle className="text-lg text-green-700">{tech.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm">{tech.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Benefits</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-none border">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Where We Grow</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {targetLocations.territories.map(territory => (
                <Link key={territory.id} href={`/${territory.slug}`}>
                  <Button variant="outline" className="rounded-none border-green-600 text-green-600 hover:bg-green-600 hover:text-white" data-testid={`button-territory-${territory.id}`}>
                    <MapPin className="h-4 w-4 mr-2" />
                    {territory.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <FieldDemoCTA variant="full" />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
