import { useParams, Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { FieldDemoCTA } from "@/components/FieldDemoCTA";
import { useSEO, generateServiceSchema, generateBreadcrumbSchema, JsonLd } from "@/lib/seo";
import targetLocations from "@shared/targetLocations.json";
import { serviceContent } from "@/lib/serviceContent";
import { ChevronRight, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ServicePage() {
  const params = useParams();
  const serviceSlug = params.slug;
  
  const service = targetLocations.services.find(s => s.slug === serviceSlug);
  const content = serviceSlug ? serviceContent[serviceSlug] : null;
  
  if (!service || !content) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const path = `/services/${serviceSlug}`;
  useSEO({ path });

  const schemas = [
    generateServiceSchema({
      name: content.title,
      description: content.description,
      url: path
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
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
            <nav className="flex items-center gap-2 text-green-200 text-sm mb-6" data-testid="breadcrumb-service">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{content.title}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-service-title">{content.title}</h1>
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
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">What's Included</h2>
                <ul className="space-y-3">
                  {content.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-6">Benefits</h2>
                <ul className="space-y-3">
                  {content.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Our Process</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {content.process.map((step, index) => (
                <Card key={index} className="rounded-none relative">
                  <div className="absolute -top-3 left-4 bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <CardHeader className="pt-8">
                    <CardTitle className="text-lg">{step.step}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Areas We Serve</h2>
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

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">{content.title} By County</h2>
            {targetLocations.territories
              .filter(t => t.id === "alabama" || t.id === "mississippi")
              .map(territory => (
                <div key={territory.id} className="mb-6 last:mb-0">
                  <h3 className="font-semibold text-gray-700 mb-3">{territory.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {territory.tier1Counties.map(county => (
                      <Link key={county.slug} href={`/${territory.id}/${county.slug}/services/${serviceSlug}`}>
                        <Button variant="outline" size="sm" className="rounded-none" data-testid={`link-service-county-${county.slug}`}>
                          {county.county} County
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
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
