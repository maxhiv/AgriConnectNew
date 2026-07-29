import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, BookOpen, Users, ArrowRight, FileDown } from "lucide-react";

interface ResourceSummary {
  slug: string;
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  tags: string[];
}

const CATEGORY_META: Record<string, { title: string; description: string; icon: typeof BarChart3; color: string }> = {
  research: {
    title: "Research Studies",
    description: "Real field-trial data from Precision Planting's PTI test farm — yield studies, downforce trials, singulation, emergence, and fertilizer placement research.",
    icon: BarChart3,
    color: "bg-orange-600",
  },
  article: {
    title: "Articles & Guides",
    description: "Practical how-to content covering sprayer setup, emergence troubleshooting, weed control, and equipment optimization.",
    icon: FileText,
    color: "bg-purple-600",
  },
  guide: {
    title: "Maintenance & Upgrade Guides",
    description: "Step-by-step maintenance guides and OEM-specific planter upgrade guides.",
    icon: BookOpen,
    color: "bg-blue-600",
  },
  "farmer-story": {
    title: "Farmer Success Stories",
    description: "Real experiences from farmers who upgraded their equipment with Precision Planting technology.",
    icon: Users,
    color: "bg-emerald-600",
  },
  manual: {
    title: "Technical Manuals",
    description: "Official PTx Trimble product manuals and setup guides for displays, guidance systems, and FarmENGAGE software.",
    icon: FileDown,
    color: "bg-slate-600",
  },
};

const CATEGORY_ORDER = ["research", "article", "guide", "farmer-story", "manual"];

export default function Resources() {
  const { data: resources, isLoading } = useQuery<ResourceSummary[]>({
    queryKey: ["/api/resources"],
    queryFn: () => fetch("/api/resources").then((res) => res.json()),
  });

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const byCategory = CATEGORY_ORDER.map((category) => ({
    category,
    items: (resources || []).filter((r) => r.category === category),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-green-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Resources</h1>
            <p className="text-xl mb-8 opacity-90">
              Real research, guides, and farmer stories to help you get the most out of your
              precision agriculture equipment.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading && (
            <div className="text-center text-muted-foreground py-12">Loading resources...</div>
          )}

          <div className="space-y-16">
            {byCategory.map(({ category, items }) => {
              if (items.length === 0) return null;
              const meta = CATEGORY_META[category];
              const Icon = meta.icon;
              const isExpanded = expanded[category];
              const displayed = isExpanded ? items : items.slice(0, 6);

              return (
                <div key={category} className="space-y-8">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${meta.color} text-white mb-4`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{meta.title}</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">{meta.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayed.map((item) => (
                      <Card key={item.slug} className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                          <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                          <CardDescription className="text-sm line-clamp-3">{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button asChild className="w-full">
                            <Link href={`/resources/${item.slug}`} className="flex items-center justify-center gap-2">
                              Read More
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {items.length > 6 && (
                    <div className="text-center">
                      <Button variant="outline" onClick={() => setExpanded((e) => ({ ...e, [category]: !isExpanded }))}>
                        {isExpanded ? "Show Less" : `Show All ${items.length}`}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Need Additional Support?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our team of precision agriculture experts is ready to help you implement and
              optimize your precision planting systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/contact">Contact Support</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/dealers">Find a Dealer</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
