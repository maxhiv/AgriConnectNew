import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { FieldDemoCTA } from "@/components/FieldDemoCTA";
import { useSEO, generateOrganizationSchema, generateLocalBusinessSchema, generateFAQSchema, generateBreadcrumbSchema, JsonLd } from "@/lib/seo";
import targetLocations from "@shared/targetLocations.json";
import { MapPin, Tractor, Compass, Wrench, GraduationCap, PhoneCall, ChevronRight, CheckCircle2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const territoryFAQs: Record<string, Array<{question: string; answer: string}>> = {
  alabama: [
    { question: "What precision agriculture services does Vantage South offer in Alabama?", answer: "We provide RTK/GNSS guidance setup, planter technology installation, steering system calibration, display configuration, and in-season support across Alabama's agricultural regions including the Wiregrass, Tennessee Valley, and Gulf Coast." },
    { question: "How can precision ag technology help Alabama cotton and peanut farmers?", answer: "Precision agriculture reduces overlap and skips during planting and application, improves seed placement accuracy, enables variable rate seeding and fertilizer application, and provides sub-inch guidance for strip-till and bedding operations." },
    { question: "Does Vantage South offer field demonstrations in Alabama?", answer: "Yes, we offer free on-farm field demonstrations throughout Alabama. You can see RTK guidance, planter technology, and steering systems working on your equipment before making a purchase decision." },
    { question: "What brands of precision ag equipment do you support in Alabama?", answer: "We work with leading brands including Precision Planting, PTx Trimble, Ag Leader, and other major manufacturers. We can integrate technology across different equipment makes and models." }
  ],
  mississippi: [
    { question: "What precision agriculture services does Vantage South offer in the Mississippi Delta?", answer: "We provide RTK/GNSS guidance setup, steering automation, display installation, application control, and comprehensive in-season support tailored to Delta cotton, soybean, corn, and rice production." },
    { question: "How does precision ag improve efficiency on large Delta farms?", answer: "Sub-inch RTK guidance eliminates overlap and reduces input waste on every pass. Section control prevents double-application. Yield mapping and prescription management optimize inputs across variable Delta soils." },
    { question: "Can you help with existing precision ag equipment in Mississippi?", answer: "Yes, we troubleshoot, repair, calibrate, and upgrade existing precision agriculture systems. We also help integrate new technology with your current equipment setup." },
    { question: "What is the typical ROI for precision ag in Delta row crops?", answer: "Most Delta farmers see payback within 1-2 seasons through reduced seed, fertilizer, and chemical costs. Overlap reduction alone typically saves 3-8% on inputs, plus labor savings from automated steering." }
  ],
  florida: [
    { question: "What precision agriculture services does Vantage South offer in Northwest Florida?", answer: "We serve the Panhandle with RTK/GNSS guidance, planter technology, steering systems, application control, and local support for peanut, cotton, and corn operations in Jackson, Calhoun, Holmes, and Washington counties." },
    { question: "How does precision ag help Florida peanut farmers specifically?", answer: "Precision planting improves seed placement and spacing consistency. RTK guidance enables precise bed formation and cultivation. Section control reduces seed and chemical waste, especially on irregular field boundaries." },
    { question: "Do you provide training on precision ag equipment in Florida?", answer: "Yes, we offer on-farm training for operators in Northwest Florida. Training covers display operation, guidance setup, planter calibration, data management, and troubleshooting common issues." },
    { question: "What support is available during planting season in the Panhandle?", answer: "We provide responsive in-season support including phone assistance, remote diagnostics, and on-site visits when needed. Our goal is to keep your equipment running during critical planting and application windows." }
  ],
  tennessee: [
    { question: "What precision agriculture services does Vantage South offer in Central Tennessee?", answer: "We provide RTK/GNSS guidance, steering systems, planter technology, application control, and technical support for corn, soybean, wheat, and hay production across Giles, Lincoln, Bedford, Maury, Coffee, Franklin, and Marshall counties." },
    { question: "How does precision ag work on Tennessee's varied terrain?", answer: "RTK guidance with terrain compensation maintains accuracy on rolling ground. Variable rate technology adapts inputs to different soil zones. Section control works effectively on irregularly shaped fields common in Middle Tennessee." },
    { question: "Can precision ag technology help with double-cropping in Tennessee?", answer: "Yes, autosteer saves time between crops and reduces operator fatigue. Quick-switch guidance between tillage, planting, and application operations keeps you moving efficiently during tight weather windows." },
    { question: "What equipment brands do you support in Central Tennessee?", answer: "We work with Precision Planting, PTx Trimble, Ag Leader, and other major brands. We can integrate multiple manufacturers' equipment and help you choose the right technology for your operation." }
  ]
};

const topSolutions = [
  { name: "RTK/GNSS Guidance", description: "Sub-inch accuracy for planting, tillage, and application", icon: Compass, link: "/services/rtk-gnss-setup" },
  { name: "Planter Upgrades", description: "Variable rate, downforce control, and seed monitoring", icon: Tractor, link: "/products?category=Planting+Technology" },
  { name: "Steering Systems", description: "Hands-free operation for reduced fatigue and improved accuracy", icon: Compass, link: "/products?category=Steering+Systems" },
  { name: "Application Control", description: "Section control and variable rate for fertilizer and chemicals", icon: Tractor, link: "/products?category=Application+Control" }
];

const topServices = [
  { name: "Installation & Calibration", description: "Professional setup of all precision ag equipment", icon: Wrench, link: "/services/installation-calibration" },
  { name: "RTK/GNSS Setup", description: "Correction source configuration and network access", icon: Compass, link: "/services/rtk-gnss-setup" },
  { name: "On-Farm Training", description: "Hands-on training for your team", icon: GraduationCap, link: "/services/on-farm-training" },
  { name: "In-Season Support", description: "Responsive help when you need it most", icon: PhoneCall, link: "/services/in-season-support" }
];

export default function TerritoryHub() {
  // Get the current path and extract territory slug from it
  const currentPath = typeof window !== 'undefined' ? window.location.pathname.slice(1) : '';
  
  const territory = targetLocations.territories.find(t => t.slug === currentPath);
  
  if (!territory) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Territory Not Found</h1>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const seoPath = `/${territory.slug}`;
  useSEO({ path: seoPath });

  const faqs = territoryFAQs[territory.id] || [];
  const schemas = [
    generateOrganizationSchema(),
    generateLocalBusinessSchema({
      name: `Vantage South - ${territory.name}`,
      areaServed: [territory.name]
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: territory.hubTitle, url: seoPath }
    ]),
    ...(faqs.length > 0 ? [generateFAQSchema(faqs)] : [])
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <JsonLd data={schemas} />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-green-800 to-green-900 text-white py-16">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-green-200 text-sm mb-6" data-testid="breadcrumb-territory">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{territory.hubTitle}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-territory-title">{territory.hubTitle}</h1>
            <p className="text-xl text-green-100 max-w-3xl">
              {territory.description}. We serve farmers across {territory.tier1Counties.length} counties with RTK guidance, 
              planter technology, steering systems, and responsive local support.
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              {territory.primaryCrops.map(crop => (
                <span key={crop} className="bg-green-700/50 px-3 py-1 rounded-full text-sm capitalize">
                  {crop}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Counties We Serve</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {territory.tier1Counties.map((county) => (
                <Link 
                  key={county.slug} 
                  href={`/${territory.id}/${county.slug}/precision-agriculture`}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer rounded-none border-2 hover:border-green-600" data-testid={`card-county-${county.slug}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">{county.county} County</span>
                      </div>
                      <p className="text-sm text-gray-600">{county.emphasis}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {county.primaryCrops.slice(0, 2).map(crop => (
                          <span key={crop} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded capitalize">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Top Solutions for {territory.name} Farmers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topSolutions.map((solution) => (
                <Link key={solution.name} href={solution.link}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer rounded-none" data-testid={`card-solution-${solution.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardHeader>
                      <solution.icon className="h-10 w-10 text-green-600 mb-2" />
                      <CardTitle className="text-lg">{solution.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{solution.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Services We Provide</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topServices.map((service) => (
                <Link key={service.name} href={service.link}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer rounded-none" data-testid={`card-service-${service.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardHeader>
                      <service.icon className="h-10 w-10 text-green-600 mb-2" />
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{service.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Cities We Serve in {territory.name}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {territory.tier1Counties.flatMap(county => 
                county.cities.map(city => (
                  <Link 
                    key={`${county.slug}-${city.slug}`}
                    href={`/${territory.id}/${city.slug}/precision-agriculture`}
                  >
                    <div className="p-3 bg-white border border-gray-200 hover:border-green-600 hover:bg-green-50 transition-colors text-center rounded-none cursor-pointer" data-testid={`link-city-${city.slug}`}>
                      <span className="text-sm font-medium">{city.name}</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
              <HelpCircle className="h-8 w-8 text-green-600" />
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border-b">
                    <AccordionTrigger className="text-left hover:text-green-600" data-testid={`faq-question-${index}`}>
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600" data-testid={`faq-answer-${index}`}>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <FieldDemoCTA variant="full" location={territory.name} />
          </div>
        </section>

        <section className="py-12 bg-green-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Explore Our Crop-Specific Solutions</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {targetLocations.crops.map(crop => (
                <Link key={crop.id} href={`/crops/${crop.slug}`}>
                  <Button variant="outline" className="rounded-none border-green-600 text-green-600 hover:bg-green-600 hover:text-white" data-testid={`button-crop-${crop.slug}`}>
                    {crop.name} Precision Ag
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
