import { useParams, Link, useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { FieldDemoCTA } from "@/components/FieldDemoCTA";
import {
  useSEO,
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateLocalBusinessSchema,
  JsonLd,
} from "@/lib/seo";
import targetLocations from "@shared/targetLocations.json";
import { serviceContent } from "@/lib/serviceContent";
import { ChevronRight, CheckCircle2, MapPin, Compass, Wrench, Tractor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Combined service + location landing page, e.g.
// /alabama/houston-county/services/rtk-gnss-setup
// /alabama/dothan/services/installation-calibration
// Reuses the location-lookup pattern from LocationPage.tsx (state pulled from
// the raw path, county lookup with a city fallback) and the service copy
// shared with ServicePage.tsx via lib/serviceContent.ts, so every combination
// gets a unique, locally-relevant title/description instead of duplicate
// boilerplate.
export default function ServiceLocationPage() {
  const params = useParams();
  const [location] = useLocation();
  const locationSlug = params.location;
  const serviceSlug = params.service;

  const pathParts = location.split("/").filter(Boolean);
  const stateSlug = pathParts[0] || "";

  const territory = targetLocations.territories.find((t) => t.id === stateSlug);
  const service = targetLocations.services.find((s) => s.slug === serviceSlug);
  const content = serviceSlug ? serviceContent[serviceSlug] : null;

  let county = territory?.tier1Counties.find((c) => c.slug === locationSlug);
  let city: { name: string; slug: string } | null = null;
  let isCity = false;

  if (!county && territory) {
    for (const c of territory.tier1Counties) {
      const foundCity = c.cities.find((ci) => ci.slug === locationSlug);
      if (foundCity) {
        county = c;
        city = foundCity;
        isCity = true;
        break;
      }
    }
  }

  if (!territory || !county || !service || !content) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const locationName = isCity ? city!.name : `${county.county} County`;
  const path = `/${stateSlug}/${locationSlug}/services/${serviceSlug}`;

  useSEO({
    path,
    customTitle: `${content.title} in ${locationName}, ${territory.name} | Vantage South`,
    customDescription: `${content.title} for ${locationName}, ${territory.name} farmers. ${content.tagline}. Serving ${county.primaryCrops.join(", ")} operations with hands-on local support.`,
  });

  const schemas = [
    generateLocalBusinessSchema({
      name: `Vantage South - ${content.title} in ${locationName}`,
      description: content.description,
      areaServed: [`${locationName}, ${territory.name}`],
    }),
    generateServiceSchema({
      name: `${content.title} in ${locationName}, ${territory.name}`,
      description: content.description,
      url: path,
      areaServed: [`${locationName}, ${territory.name}`],
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: territory.hubTitle, url: `/${territory.slug}` },
      ...(isCity
        ? [
            { name: `${county.county} County`, url: `/${territory.id}/${county.slug}/precision-agriculture` },
            { name: city!.name, url: `/${territory.id}/${locationSlug}/precision-agriculture` },
          ]
        : [{ name: `${county.county} County`, url: `/${territory.id}/${county.slug}/precision-agriculture` }]),
      { name: content.title, url: path },
    ]),
  ];

  const otherServices = targetLocations.services.filter((s) => s.slug !== serviceSlug);
  const relatedCrops = targetLocations.crops.filter((crop) => county!.primaryCrops.includes(crop.id)).slice(0, 3);

  const serviceIcons: Record<string, typeof Compass> = {
    "rtk-gnss-setup": Compass,
    "installation-calibration": Wrench,
    "on-farm-training": Tractor,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <JsonLd data={schemas} />

      <main className="flex-1">
        <section className="bg-gradient-to-br from-green-800 to-green-900 text-white py-14">
          <div className="container mx-auto px-4">
            <nav className="flex flex-wrap items-center gap-2 text-green-200 text-sm mb-6" data-testid="breadcrumb-service-location">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/${territory.slug}`} className="hover:text-white">{territory.name}</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/${territory.id}/${county.slug}/precision-agriculture`} className="hover:text-white">
                {county.county} County
              </Link>
              {isCity && (
                <>
                  <ChevronRight className="h-4 w-4" />
                  <Link href={`/${territory.id}/${locationSlug}/precision-agriculture`} className="hover:text-white">
                    {city!.name}
                  </Link>
                </>
              )}
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{content.title}</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-8 w-8 text-green-300" />
              <h1 className="text-3xl md:text-5xl font-bold" data-testid="text-service-location-title">
                {content.title} in {locationName}, {territory.name}
              </h1>
            </div>
            <p className="text-xl text-green-100 max-w-3xl">{content.tagline}</p>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <p className="text-lg text-gray-700 leading-relaxed">
                {content.description} We serve {locationName} farmers throughout {territory.name}, including{" "}
                {county.primaryCrops.join(", ")} operations{isCity ? ` near ${city!.name}` : ` across ${county.county} County`}.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <FieldDemoCTA variant="compact" location={locationName} />
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
                <h2 className="text-2xl font-bold mb-6">Benefits for {locationName} Farmers</h2>
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
            <h2 className="text-2xl font-bold mb-6">Other Services in {locationName}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {otherServices.map((s) => {
                const Icon = serviceIcons[s.slug] || Wrench;
                return (
                  <Link key={s.slug} href={`/${territory.id}/${locationSlug}/services/${s.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer rounded-none" data-testid={`card-other-service-${s.slug}`}>
                      <CardContent className="p-6 text-center">
                        <Icon className="h-10 w-10 text-green-600 mx-auto mb-3" />
                        <h3 className="font-semibold">{s.name}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-6 justify-center items-center">
              <div>
                <h3 className="font-semibold mb-3 text-center">
                  {isCity ? `Explore ${county.county} County` : `Explore ${locationName}`}
                </h3>
                <Link
                  href={
                    isCity
                      ? `/${territory.id}/${county.slug}/precision-agriculture`
                      : `/${territory.id}/${locationSlug}/precision-agriculture`
                  }
                >
                  <Button variant="outline" className="rounded-none border-green-600 text-green-600 hover:bg-green-600 hover:text-white" data-testid="button-back-to-location">
                    <MapPin className="h-4 w-4 mr-2" />
                    {isCity ? `${county.county} County Page` : `${locationName} Precision Ag Page`}
                  </Button>
                </Link>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-center">{content.title} Overview</h3>
                <Link href={`/services/${serviceSlug}`}>
                  <Button variant="outline" className="rounded-none border-green-600 text-green-600 hover:bg-green-600 hover:text-white" data-testid="button-back-to-service">
                    <ChevronRight className="h-4 w-4 mr-2" />
                    All {content.title} Locations
                  </Button>
                </Link>
              </div>
              {relatedCrops.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-center">Crop Solutions</h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedCrops.map((crop) => (
                      <Link key={crop.id} href={`/crops/${crop.slug}`}>
                        <Button variant="outline" size="sm" className="rounded-none" data-testid={`link-crop-${crop.slug}`}>
                          {crop.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <FieldDemoCTA variant="full" location={locationName} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
