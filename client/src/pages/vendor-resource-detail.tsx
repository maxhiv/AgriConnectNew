import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";
import { getVendorLogo } from "@/lib/vendorLogos";

interface VendorProduct {
  name: string;
  model: string | null;
  category: string | null;
  equipment: string | null;
  sourceUrl: string | null;
  tagline: string | null;
  description: string | null;
  specs: string[];
  images: string[];
  brochures: string[];
  priority: boolean;
  catalogSlug: string | null;
}

interface VendorGroup {
  vendor: string;
  slug: string;
  productCount: number;
  brochureCount: number;
  products: VendorProduct[];
}

export default function VendorResourceDetail() {
  const params = useParams();
  const slug = params.slug;

  const { data: vendor, isLoading, error } = useQuery<VendorGroup>({
    queryKey: ["/api/vendor-resources", slug],
    queryFn: () => fetch(`/api/vendor-resources/${slug}`).then((res) => res.json()),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="h-12 bg-muted rounded w-1/2" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !vendor || (vendor as any).error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
          <Button asChild>
            <Link href="/vendor-resources">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vendor Resources
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/vendor-resources">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vendor Resources
          </Link>
        </Button>

        <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-vendor-name">
          {vendor.vendor}
        </h1>
        <p className="text-muted-foreground mb-12">
          {vendor.productCount} products available in the resource library.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendor.products.map((p, i) => (
            <Card key={i} className="flex flex-col" data-testid={`card-product-${i}`}>
              {(p.images[0] || getVendorLogo(vendor.vendor)) && (
                <div className="aspect-video bg-slate-50 overflow-hidden">
                  <img
                    src={p.images[0] || getVendorLogo(vendor.vendor)!}
                    alt={p.images[0] ? p.name : `${vendor.vendor} logo`}
                    className={p.images[0] ? "w-full h-full object-contain p-4" : "w-full h-full object-contain p-8"}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
              <CardHeader className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  {p.priority && <Badge className="bg-green-700">Flagship</Badge>}
                  {p.category && <Badge variant="outline">{p.category}</Badge>}
                </div>
                <CardTitle className="text-lg" data-testid={`title-product-${i}`}>
                  {p.name}
                </CardTitle>
                {p.tagline && <CardDescription>{p.tagline}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-3">
                {p.specs.length > 0 && (
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    {p.specs.slice(0, 3).map((s, si) => (
                      <li key={si} className="line-clamp-1">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  {p.catalogSlug && (
                    <Button asChild size="sm">
                      <Link href={`/product/${p.catalogSlug}`}>View Product Page</Link>
                    </Button>
                  )}
                  {p.brochures.slice(0, 1).map((b, bi) => (
                    <Button key={bi} variant="outline" size="sm" asChild>
                      <a href={b} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        Brochure
                      </a>
                    </Button>
                  ))}
                  {p.sourceUrl && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Manufacturer
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
