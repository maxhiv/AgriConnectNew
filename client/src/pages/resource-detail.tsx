import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle2, MessageSquare, Phone, FileDown } from "lucide-react";

interface Resource {
  id: string;
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  keyPoints: string[];
  bodyHtml: string;
  pdfUrl?: string;
  tags: string[];
  relatedProductSlugs: string[];
  featuredImage: string | null;
  sourceUrl: string;
}

interface ProductSummary {
  slug: string;
  name: string;
  primaryImage: string | null;
  tagline: string;
}

export default function ResourceDetail() {
  const params = useParams();
  const slug = params.id;

  const { data: resource, isLoading, error } = useQuery<Resource>({
    queryKey: ["/api/resources", slug],
    queryFn: () => fetch(`/api/resources/${slug}`).then((res) => res.json()),
    enabled: !!slug,
  });

  const { data: relatedProducts } = useQuery<ProductSummary[]>({
    queryKey: ["/api/products", "byResource", slug],
    queryFn: async () => {
      if (!resource || resource.relatedProductSlugs.length === 0) return [];
      const all = await Promise.all(
        resource.relatedProductSlugs.map((s) => fetch(`/api/products/${s}`).then((r) => r.json()))
      );
      return all.filter((p) => !p.error);
    },
    enabled: !!resource,
  });

  useEffect(() => {
    if (!resource) return;
    document.title = `${resource.title} | Vantage South`;
  }, [resource]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !resource || (resource as any).error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Resource Not Found</h1>
          <Button asChild>
            <Link href="/resources">Back to Resources</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type":
      resource.category === "research"
        ? "ScholarlyArticle"
        : resource.category === "manual"
          ? "TechArticle"
          : "Article",
    headline: resource.title,
    description: resource.description,
    image: resource.featuredImage || undefined,
    publisher: { "@type": "Organization", name: "Vantage South" },
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navigation />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/resources" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Resources
          </Link>
        </Button>

        <article>
          <header className="mb-8">
            <Badge className="mb-4">{resource.categoryLabel}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{resource.title}</h1>
            <p className="text-xl text-muted-foreground">{resource.description}</p>
          </header>

          {resource.featuredImage && (
            <img
              src={resource.featuredImage}
              alt={resource.title}
              className="w-full rounded-lg mb-8 object-cover max-h-[420px]"
            />
          )}

          {resource.keyPoints.length > 0 && (
            <Card className="mb-8 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-xl">Key Points</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {resource.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: point }} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {resource.category === "manual" && resource.pdfUrl ? (
            <Card className="mb-10 bg-slate-50 border-slate-200">
              <CardContent className="pt-6 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <FileDown className="h-8 w-8 text-slate-600 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Official PTx Trimble Documentation</div>
                    <div className="text-sm text-muted-foreground">PDF download</div>
                  </div>
                </div>
                <Button asChild size="lg">
                  <a href={resource.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <FileDown className="h-4 w-4" />
                    Download PDF
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div
              className="prose prose-lg max-w-none mb-10 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 [&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mt-6 [&_h4]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_a]:text-primary [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: resource.bodyHtml }}
            />
          )}

          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          )}

          {relatedProducts && relatedProducts.length > 0 && (
            <section className="mb-10">
              <Card>
                <CardHeader>
                  <CardTitle>Related Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedProducts.map((product) => (
                      <Button key={product.slug} variant="outline" asChild className="h-auto p-4 justify-between">
                        <Link href={`/product/${product.slug}`} className="flex items-center justify-between w-full">
                          <div className="text-left">
                            <div className="font-medium">{product.name}</div>
                            {product.tagline && (
                              <div className="text-xs text-muted-foreground">{product.tagline}</div>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 flex-shrink-0" />
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          <section className="mb-10">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Talk to a Precision Ag Specialist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 mb-6">
                  Have questions about how this applies to your operation? We can help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg">
                    <Link href="/contact" className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Contact Us
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/schedule-field-demo" className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Request Field Demo
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <footer className="border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Source:{" "}
              <a
                href={resource.sourceUrl}
                target="_blank"
                rel="noopener nofollow"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                {resource.tags.includes("PTx Trimble") ? "PTx Trimble" : "Precision Planting"}
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </footer>
        </article>
      </div>

      <Footer />
    </div>
  );
}
