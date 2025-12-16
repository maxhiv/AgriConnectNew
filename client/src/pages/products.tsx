import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { queryClient } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Search, Filter, Grid3X3, List } from "lucide-react";
import type { Product } from "@shared/schema";

interface CatalogMeta {
  brands: string[];
  categories: string[];
  totalProducts: number;
}

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: products = [], isLoading, refetch } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: catalogMeta } = useQuery<CatalogMeta>({
    queryKey: ['/api/catalog/meta'],
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['/api/products'] });
  }, []);

  const brands = catalogMeta?.brands || [];
  const categories = catalogMeta?.categories || [];

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = brandFilter === "all" || product.brand === brandFilter;
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    
    return matchesSearch && matchesBrand && matchesCategory;
  });

  const groupedByBrand = filteredProducts.reduce((acc, product) => {
    const brand = product.brand || 'Other';
    if (!acc[brand]) {
      acc[brand] = [];
    }
    acc[brand].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="bg-green-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Precision Agriculture Solutions
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Complete catalog of precision agriculture equipment from leading manufacturers
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {brands.slice(0, 6).map(brand => (
                <Badge 
                  key={brand} 
                  variant="secondary" 
                  className="bg-white/20 text-white border-white/30 cursor-pointer hover:bg-white/30"
                  onClick={() => setBrandFilter(brand)}
                  data-testid={`badge-brand-${brand.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {brand}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products, brands, categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-product-search"
              />
            </div>
            
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger className="w-[200px]" data-testid="select-brand-filter">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]" data-testid="select-category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                data-testid="button-view-grid"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                data-testid="button-view-list"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">
                  {filteredProducts.length} Products Found
                </h2>
                {(brandFilter !== "all" || categoryFilter !== "all" || searchTerm) && (
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setBrandFilter("all");
                      setCategoryFilter("all");
                      setSearchTerm("");
                    }}
                    data-testid="button-clear-filters"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
              
              {brandFilter === "all" && !searchTerm ? (
                Object.entries(groupedByBrand).map(([brand, brandProducts]) => (
                  <div key={brand} className="mb-12">
                    <div className="flex items-center gap-4 mb-6">
                      <h3 className="text-2xl font-bold text-green-800">{brand}</h3>
                      <Badge variant="outline">{brandProducts.length} products</Badge>
                    </div>
                    <div className={viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                    }>
                      {brandProducts.map(product => (
                        <ProductCard key={product.id} product={product} viewMode={viewMode} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
                }>
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))}
                </div>
              )}

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setBrandFilter("all");
                      setCategoryFilter("all");
                      setSearchTerm("");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

function ProductCard({ product, viewMode }: { product: Product; viewMode: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow" data-testid={`card-product-${product.slug}`}>
        <div className="flex flex-col md:flex-row">
          <CardHeader className="flex-1">
            <div className="flex gap-2 mb-2">
              <Badge variant="secondary">{product.brand}</Badge>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            <CardTitle className="text-xl">{product.name}</CardTitle>
            <CardDescription>{product.shortDescription || product.tagline}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2 pt-6 md:pt-0">
            <Button asChild data-testid={`button-view-details-${product.slug}`}>
              <Link href={`/product/${product.slug}`}>View Details</Link>
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              asChild
              data-testid={`button-external-link-${product.slug}`}
            >
              <a 
                href={product.oemUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="View on manufacturer website"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col" data-testid={`card-product-${product.slug}`}>
      <CardHeader className="flex-1">
        <div className="flex justify-between items-start">
          <Badge variant="secondary">{product.brand}</Badge>
          <Badge variant="outline">{product.category}</Badge>
        </div>
        {product.logoDarkGreen && (
          <div className="my-4 flex justify-center">
            <img 
              src={product.logoDarkGreen} 
              alt={`${product.name} logo`}
              className="h-16 w-auto object-contain"
              data-testid={`img-product-logo-${product.slug}`}
            />
          </div>
        )}
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription>{product.shortDescription || product.tagline}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {product.highlights && product.highlights.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Key Features:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {product.highlights.slice(0, 3).map((highlight, index) => (
                  <li key={index}>• {highlight}</li>
                ))}
              </ul>
            </div>
          )}
          
          {product.specs && product.specs.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Specifications:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {product.specs.slice(0, 2).map((spec, index) => (
                  <li key={index} className="text-xs">• {spec}</li>
                ))}
              </ul>
            </div>
          )}
          
          {product.worksWith && product.worksWith.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Works With:</h4>
              <div className="flex flex-wrap gap-1">
                {product.worksWith.slice(0, 3).map((compatible, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {compatible}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 mt-auto">
        <Button asChild className="flex-1" data-testid={`button-view-details-${product.slug}`}>
          <Link href={`/product/${product.slug}`}>
            View Details
          </Link>
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          asChild
          data-testid={`button-external-link-${product.slug}`}
        >
          <a 
            href={product.oemUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="View on manufacturer website"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}