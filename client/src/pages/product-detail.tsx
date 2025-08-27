import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Phone, Mail, CheckCircle2, MessageSquare } from "lucide-react";
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
    staleTime: 0, // Always fetch fresh data for product details
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
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            {product.primaryImage && (
              <div className="relative aspect-video bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden">
                <img 
                  src={product.primaryImage} 
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(
                      `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                        <rect width="400" height="300" fill="#f1f5f9"/>
                        <text x="200" y="150" text-anchor="middle" fill="#64748b" font-size="16">${product.name}</text>
                      </svg>`
                    )}`;
                  }}
                />
              </div>
            )}

            {/* Additional Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images.slice(1, 4).map((image, index) => (
                  <div key={index} className="aspect-square bg-slate-50 rounded-lg overflow-hidden">
                    <img 
                      src={image.path} 
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Description */}
            {product.enrichedDescription && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.enrichedDescription}
                </p>
              </div>
            )}

            {/* Detailed Features */}
            {product.detailedFeatures && product.detailedFeatures.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Key Features & Capabilities</h2>
                <ul className="space-y-3">
                  {product.detailedFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Key Features</h2>
                <ul className="space-y-2">
                  {product.highlights.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Benefits</h2>
                <ul className="space-y-3">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Research Findings */}
            {product.researchFindings && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Research & Performance Data</h2>
                <div className="border rounded-lg p-4 bg-slate-50">
                  {typeof product.researchFindings === 'string' ? (
                    <p className="text-muted-foreground leading-relaxed">
                      {product.researchFindings}
                    </p>
                  ) : Array.isArray(product.researchFindings) ? (
                    <ul className="space-y-2">
                      {product.researchFindings.map((finding: string, index: number) => (
                        <li key={index} className="text-muted-foreground leading-relaxed">
                          • {finding}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            )}

            {/* Compatibility */}
            {product.worksWith.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Works With</h2>
                <div className="flex flex-wrap gap-2">
                  {product.worksWith.map((compatible, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {compatible}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Compatibility Details */}
            {product.compatibilityDetails && Object.keys(product.compatibilityDetails).length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Compatibility Details</h2>
                <div className="bg-slate-50 rounded-lg p-4">
                  {product.compatibilityDetails.details && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.compatibilityDetails.details}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Contact for Quote
                </Button>

                {product.oemUrl && (
                  <Button variant="outline" size="lg" asChild className="flex-1">
                    <a 
                      href={product.oemUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      Learn More
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
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