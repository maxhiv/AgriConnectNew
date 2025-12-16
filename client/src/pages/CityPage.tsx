import { useParams, Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { FieldDemoCTA } from "@/components/FieldDemoCTA";
import { useSEO, generateServiceSchema, generateBreadcrumbSchema, JsonLd } from "@/lib/seo";
import targetLocations from "@shared/targetLocations.json";
import { MapPin, ChevronRight, Tractor, Compass, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function CityPage() {
  const params = useParams();
  const stateSlug = params.state;
  const citySlug = params.city;
  
  const territory = targetLocations.territories.find(t => t.id === stateSlug);
  
  let county = null;
  let city = null;
  
  if (territory) {
    for (const c of territory.tier1Counties) {
      const foundCity = c.cities.find(ci => ci.slug === citySlug);
      if (foundCity) {
        county = c;
        city = foundCity;
        break;
      }
    }
  }
  
  if (!territory || !county || !city) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">City Not Found</h1>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const path = `/${stateSlug}/${citySlug}/precision-agriculture`;
  useSEO({ path });

  const schemas = [
    generateServiceSchema({
      name: `Precision Agriculture Services in ${city.name}, ${territory.name}`,
      description: `RTK guidance, planter technology, and farming solutions for ${city.name} area farmers`,
      url: path,
      areaServed: [`${city.name}, ${territory.name}`]
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: territory.hubTitle, url: `/${territory.slug}` },
      { name: `${county.county} County`, url: `/${territory.id}/${county.slug}/precision-agriculture` },
      { name: city.name, url: path }
    ])
  ];

  const relatedCrops = targetLocations.crops.filter(crop => 
    county.primaryCrops.includes(crop.id)
  ).slice(0, 2);

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
              <span className="text-white">{city.name}</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-8 w-8 text-green-300" />
              <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-city-title">{city.name} Precision Agriculture</h1>
            </div>
            <p className="text-lg text-green-100 max-w-3xl">
              Precision agriculture solutions for farmers near {city.name}, {territory.name}. 
              We help local {county.primaryCrops.slice(0, 2).join(" and ")} operations achieve better results with 
              RTK guidance, planter technology, and responsive local support.
            </p>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <FieldDemoCTA variant="compact" location={city.name} />
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Top Products for {city.name} Area Farmers</h2>
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
            <h2 className="text-2xl font-bold mb-6">Services Available Near {city.name}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {topServices.map((service) => (
                <Link key={service.slug} href={`/services/${service.slug}`}>
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
            <FieldDemoCTA variant="default" location={city.name} />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
