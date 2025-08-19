import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Phone, Mail } from "lucide-react";
import type { Product } from "@shared/schema";

// Helper function to get related resources based on product
const getRelatedResources = (productSlug: string): Array<{slug: string, title: string}> => {
  const resourceMappings: Record<string, Array<{slug: string, title: string}>> = {
    "20-20": [
      { slug: "display-monitors", title: "Display Monitors" },
      { slug: "data-management", title: "Data Management" }
    ],
    "deltaforce": [
      { slug: "downforce-control", title: "Downforce Control" },
      { slug: "downforce-dan-planter-upgrade-story", title: "Downforce Dan Success Story" }
    ],
    "vset": [
      { slug: "seed-meters-drive-systems", title: "Seed Meters & Drive Systems" },
      { slug: "high-speed-hank", title: "High Speed Planting" }
    ],
    "smartfirmer": [
      { slug: "seed-firmers", title: "Seed Firmers" },
      { slug: "from-cleaning-to-closing-the-three-cs-of-emergence", title: "Three C's of Emergence" }
    ],
    "reveal": [
      { slug: "row-cleaners", title: "Row Cleaners" },
      { slug: "from-cleaning-to-closing-the-three-cs-of-emergence", title: "Three C's of Emergence" }
    ],
    "furrowforce": [
      { slug: "closing-systems", title: "Closing Systems" },
      { slug: "from-cleaning-to-closing-the-three-cs-of-emergence", title: "Three C's of Emergence" }
    ],
    "vapplyhd": [
      { slug: "fertilizer-application", title: "Fertilizer Application" }
    ],
    "clarity": [
      { slug: "fertilizer-application", title: "Fertilizer Application" }
    ]
  };
  return resourceMappings[productSlug] || [];
};

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug;

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['/api/products', slug],
    queryFn: () => fetch(`/api/products/${slug}?enrich=true`).then(res => res.json()),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-6 bg-muted rounded w-3/4 mb-8"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
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
          <Button variant="ghost" asChild data-testid="button-back-to-products">
            <Link href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>

        {/* Product Header */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {product.equipment}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {product.category}
            </Badge>
          </div>

          {product.logoDarkGreen && (
            <div className="mb-8 flex justify-center lg:justify-start">
              <img 
                src={product.logoDarkGreen} 
                alt={`${product.name} logo`}
                className="h-24 w-auto object-contain"
                data-testid="img-product-logo-detail"
              />
            </div>
          )}

          <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="text-product-name">
            {product.enrichedTitle || product.name}
          </h1>

          <p className="text-xl text-muted-foreground mb-8" data-testid="text-product-tagline">
            {product.enrichedDescription || product.tagline}
          </p>

          {product.extendedDescription && (
            <div className="mb-8 p-4 bg-muted rounded-lg">
              <p className="text-lg">{product.extendedDescription}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild data-testid="button-get-quote">
              <Link href="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Get Quote
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild data-testid="button-manufacturer-info">
              <a href={product.oemUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Manufacturer Info
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle>Key Features & Benefits</CardTitle>
                <CardDescription>
                  What makes this product stand out in precision agriculture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {product.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-lg">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Scraped Features from Manufacturer */}
            {product.scrapedFeatures && product.scrapedFeatures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Manufacturer Features</CardTitle>
                  <CardDescription>
                    Additional features from the manufacturer's website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {product.scrapedFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {product.lastScraped && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Last updated: {new Date(product.lastScraped * 1000).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Compatibility */}
            {product.worksWith.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Compatible Systems</CardTitle>
                  <CardDescription>
                    This product integrates seamlessly with these systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {product.worksWith.map((compatible, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg text-center">
                        <span className="font-medium">{compatible}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Ready to Upgrade?</CardTitle>
                <CardDescription>
                  Get a customized quote for your operation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg" asChild data-testid="button-request-quote">
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Request Quote
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" size="lg" asChild data-testid="button-call-us">
                  <a href="tel:+1-555-0123">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Us
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Related Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Related Resources</CardTitle>
                <CardDescription>
                  Learn more about implementing this technology
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {getRelatedResources(product.slug).map((resource, index) => (
                  <Button key={index} variant="ghost" asChild className="w-full justify-start">
                    <Link href={`/resources/${resource.slug}`}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {resource.title}
                    </Link>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Product Info */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Equipment Type:</span>
                    <span className="font-medium">{product.equipment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Product ID:</span>
                    <span className="font-medium text-xs">{product.slug}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}