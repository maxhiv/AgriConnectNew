import { useParams, Link, useLocation } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { FieldDemoCTA } from "@/components/FieldDemoCTA";
import LocalAgContext from "@/components/LocalAgContext";
import { useSEO, generateServiceSchema, generateBreadcrumbSchema, generateLocalBusinessSchema, JsonLd } from "@/lib/seo";
import targetLocations from "@shared/targetLocations.json";
import { MapPin, ChevronRight, CheckCircle2, AlertTriangle, Tractor, Compass, Wrench, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const problemsSolved = [
  { problem: "Overlap & Skips", description: "Eliminate costly double-application and missed strips with sub-inch RTK guidance" },
  { problem: "Downforce Variability", description: "Automatic downforce control maintains consistent seed depth across changing conditions" },
  { problem: "Rate Instability", description: "Precise section control and variable rate application put the right amount where it's needed" },
  { problem: "Poor Mapping Visibility", description: "Real-time yield maps and as-applied data for better decision making" },
  { problem: "Steering Fatigue", description: "Automated steering reduces operator fatigue during long days" },
  { problem: "Equipment Integration", description: "Connect displays, guidance, and implements across equipment brands" }
];

const topProducts = [
  { name: "20|20 Display", description: "Complete planting monitoring and control", link: "/product/2020" },
  { name: "DeltaForce", description: "Automatic downforce control for consistent depth", link: "/product/deltaforce" },
  { name: "vDrive", description: "Electric seed drive for variable rate planting", link: "/product/vdrive" },
  { name: "CleanSweep", description: "Precision residue management", link: "/product/cleansweep" }
];

const topServices = [
  { name: "RTK/GNSS Setup", slug: "rtk-gnss-setup", icon: Compass },
  { name: "Installation & Calibration", slug: "installation-calibration", icon: Wrench },
  { name: "On-Farm Training", slug: "on-farm-training", icon: Tractor }
];

export default function LocationPage() {
  const params = useParams();
  const [location] = useLocation();
  const locationSlug = params.location;
  
  // Extract state from the current wouter path since routes use literal state names
  // Path format: /alabama/houston-county/precision-agriculture
  const pathParts = location.split('/').filter(Boolean);
  const stateSlug = pathParts[0] || '';
  
  const territory = targetLocations.territories.find(t => t.id === stateSlug);
  
  // First try to find as county
  let county = territory?.tier1Counties.find(c => c.slug === locationSlug);
  let city = null;
  let isCity = false;
  
  // If not a county, try to find as city
  if (!county && territory) {
    for (const c of territory.tier1Counties) {
      const foundCity = c.cities.find(ci => ci.slug === locationSlug);
      if (foundCity) {
        county = c;
        city = foundCity;
        isCity = true;
        break;
      }
    }
  }
  
  if (!territory || !county) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Location Not Found</h1>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const path = `/${stateSlug}/${locationSlug}/precision-agriculture`;
  useSEO({ path });

  const locationName = isCity ? city!.name : `${county.county} County`;
  
  const schemas = [
    generateLocalBusinessSchema({
      name: `Vantage South - ${locationName}`,
      areaServed: [`${locationName}, ${territory.name}`]
    }),
    generateServiceSchema({
      name: `Precision Agriculture Services in ${locationName}, ${territory.name}`,
      description: `RTK guidance, planter technology, and steering systems for ${locationName} farmers`,
      url: path,
      areaServed: [`${locationName}, ${territory.name}`]
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: territory.hubTitle, url: `/${territory.slug}` },
      ...(isCity ? [
        { name: `${county.county} County`, url: `/${territory.id}/${county.slug}/precision-agriculture` },
        { name: city!.name, url: path }
      ] : [
        { name: `${county.county} County`, url: path }
      ])
    ])
  ];

  const relatedServices = targetLocations.services.slice(0, 3);
  const relatedCrops = targetLocations.crops.filter(crop =>
    county.primaryCrops.includes(crop.id)
  ).slice(0, 2);

  // Alabama and Mississippi have localized service+location landing pages;
  // other territories fall back to the general service overview page.
  const hasLocalizedServicePages = stateSlug === "alabama" || stateSlug === "mississippi";
  const serviceHref = (slug: string) =>
    hasLocalizedServicePages ? `/${stateSlug}/${locationSlug}/services/${slug}` : `/services/${slug}`;

  // City page - simpler version
  if (isCity) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        <JsonLd data={schemas} />
        
        <main className="flex-1">
          <section className="bg-gradient-to-br from-green-800 to-green-900 text-white py-12">
            <div className="container mx-auto px-4">
              <nav className="flex flex-wrap items-center gap-2 text-green-200 text-sm mb-6" data-testid="breadcrumb-city">
                <Link href="/" className="hover:text-white">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/${territory.slug}`} className="hover:text-white">{territory.name}</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href={`/${territory.id}/${county.slug}/precision-agriculture`} className="hover:text-white">{county.county} County</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-white">{city!.name}</span>
              </nav>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-8 w-8 text-green-300" />
                <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-city-title">{city!.name} Precision Agriculture</h1>
              </div>
              <p className="text-lg text-green-100 max-w-3xl">
                Precision agriculture solutions for farmers near {city!.name}, {territory.name}. 
                We help local {county.primaryCrops.slice(0, 2).join(" and ")} operations achieve better results with 
                RTK guidance, planter technology, and responsive local support.
              </p>
            </div>
          </section>

          <section className="py-8">
            <div className="container mx-auto px-4">
              <FieldDemoCTA variant="compact" location={city!.name} />
            </div>
          </section>

          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">Top Products for {city!.name} Area Farmers</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topProducts.map((product) => (
                  <Link key={product.name} href={product.link}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer rounded-none" data-testid={`card-product-${product.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 text-sm">{product.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/products">
                  <Button className="bg-green-600 hover:bg-green-700 rounded-none" data-testid="button-view-all-products">
                    View All Products
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">Services Available Near {city!.name}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {topServices.map((service) => (
                  <Link key={service.slug} href={serviceHref(service.slug)}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer rounded-none" data-testid={`card-service-${service.slug}`}>
                      <CardContent className="p-6 text-center">
                        <service.icon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap gap-6 justify-center items-center">
                <div>
                  <h3 className="font-semibold mb-3 text-center">Explore {county.county} County</h3>
                  <Link href={`/${territory.id}/${county.slug}/precision-agriculture`}>
                    <Button variant="outline" className="rounded-none border-green-600 text-green-600 hover:bg-green-600 hover:text-white" data-testid="button-back-to-county">
                      <MapPin className="h-4 w-4 mr-2" />
                      {county.county} County Page
                    </Button>
                  </Link>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-center">Crop Solutions</h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedCrops.map(crop => (
                      <Link key={crop.id} href={`/crops/${crop.slug}`}>
                        <Button variant="outline" size="sm" className="rounded-none" data-testid={`link-crop-${crop.slug}`}>
                          {crop.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container mx-auto px-4">
              <FieldDemoCTA variant="default" location={city!.name} />
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    );
  }

  // County page - full version
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <JsonLd data={schemas} />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-green-800 to-green-900 text-white py-12">
          <div className="container mx-auto px-4">
            <nav className="flex flex-wrap items-center gap-2 text-green-200 text-sm mb-6" data-testid="breadcrumb-county">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/${territory.slug}`} className="hover:text-white">{territory.hubTitle}</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{county.county} County</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-8 w-8 text-green-300" />
              <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-county-title">{county.county} County Precision Agriculture</h1>
            </div>
            <p className="text-lg text-green-100 max-w-3xl mb-4">
              {county.emphasis}. We serve farmers throughout {county.county} County with RTK guidance, planter technology, 
              and hands-on support for {county.primaryCrops.join(", ")} production.
            </p>
            <div className="flex flex-wrap gap-2">
              {county.primaryCrops.map(crop => (
                <span key={crop} className="bg-green-700/50 px-3 py-1 rounded-full text-sm capitalize">
                  {crop}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Cities Served in {county.county} County</h2>
            <div className="flex flex-wrap gap-3">
              {county.cities.map(c => (
                <Link 
                  key={c.slug}
                  href={`/${territory.id}/${c.slug}/precision-agriculture`}
                >
                  <Button variant="outline" className="rounded-none border-green-600 text-green-600 hover:bg-green-600 hover:text-white" data-testid={`button-city-${c.slug}`}>
                    <MapPin className="h-4 w-4 mr-2" />
                    {c.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              Problems We Solve for {county.county} County Farmers
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {problemsSolved.map((item, index) => (
                <Card key={index} className="rounded-none border-l-4 border-l-green-600">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.problem}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Solutions for {county.county} County</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="rounded-none">
                <CardHeader>
                  <Compass className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>RTK/GNSS Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Sub-inch accuracy for planting, tillage, and application. Reduce overlap and eliminate skips on every pass.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>RTK correction setup</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Guidance line creation</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Field boundary mapping</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="rounded-none">
                <CardHeader>
                  <Tractor className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>Planter Technology</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Upgrade your planter with precision seed placement, downforce control, and real-time monitoring.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Electric drives (vDrive)</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Downforce control (DeltaForce)</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Seed monitoring (20|20)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Local Proof: Field Demo Available</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="rounded-none bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <Tractor className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Field Demos</h3>
                  <p className="text-gray-600 text-sm">See technology working on your equipment in {county.county} County</p>
                </CardContent>
              </Card>
              <Card className="rounded-none bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <Wrench className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Professional Install</h3>
                  <p className="text-gray-600 text-sm">Expert installation and calibration for lasting results</p>
                </CardContent>
              </Card>
              <Card className="rounded-none bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <HeadphonesIcon className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Seasonal Support</h3>
                  <p className="text-gray-600 text-sm">Responsive help during critical planting and application windows</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <LocalAgContext 
              state={stateSlug} 
              slug={locationSlug || ''} 
              className="mb-8"
            />
          </div>
        </section>

        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-6 justify-center">
              <div>
                <h3 className="font-semibold mb-3">Related Services</h3>
                <div className="flex flex-wrap gap-2">
                  {relatedServices.map(service => (
                    <Link key={service.id} href={serviceHref(service.slug)}>
                      <Button variant="outline" size="sm" className="rounded-none" data-testid={`link-service-${service.slug}`}>
                        {service.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Crop Solutions</h3>
                <div className="flex flex-wrap gap-2">
                  {relatedCrops.map(crop => (
                    <Link key={crop.id} href={`/crops/${crop.slug}`}>
                      <Button variant="outline" size="sm" className="rounded-none" data-testid={`link-crop-${crop.slug}`}>
                        {crop.name} Precision Ag
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <FieldDemoCTA variant="full" location={`${county.county} County`} />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
