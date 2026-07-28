import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Package } from "lucide-react";
import { getVendorLogo } from "@/lib/vendorLogos";

interface VendorGroup {
  vendor: string;
  slug: string;
  productCount: number;
  brochureCount: number;
}

export default function VendorResources() {
  const { data: vendors = [], isLoading } = useQuery<VendorGroup[]>({
    queryKey: ["/api/vendor-resources"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-green-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Vendor Resource Library</h1>
            <p className="text-xl mb-8 opacity-90">
              Product information, spec sheets, and brochures from the manufacturers we
              represent across our precision agriculture lineup.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendors.map((v) => (
                <Card key={v.slug} className="hover:shadow-lg transition-shadow duration-300" data-testid={`card-vendor-${v.slug}`}>
                  <CardHeader>
                    {getVendorLogo(v.vendor) && (
                      <div className="h-16 flex items-center mb-2">
                        <img
                          src={getVendorLogo(v.vendor)!}
                          alt={`${v.vendor} logo`}
                          className="max-h-16 max-w-[180px] object-contain"
                        />
                      </div>
                    )}
                    <CardTitle className="text-xl" data-testid={`title-vendor-${v.slug}`}>
                      {v.vendor}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {v.productCount} products
                        </Badge>
                        {v.brochureCount > 0 && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {v.brochureCount} brochures
                          </Badge>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full" data-testid={`button-view-vendor-${v.slug}`}>
                      <Link href={`/vendor-resources/${v.slug}`} className="flex items-center justify-center gap-2">
                        View {v.vendor} Lineup
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
