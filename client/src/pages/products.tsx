import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Search } from "lucide-react";
import type { Product } from "@shared/schema";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Get unique equipment and category values for filters
  const equipmentTypes = Array.from(new Set(products.map(p => p.equipment)));
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEquipment = equipmentFilter === "all" || product.equipment === equipmentFilter;
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    
    return matchesSearch && matchesEquipment && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-green-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Precision Agriculture Solutions
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Upgrade your equipment with retrofit solutions designed to improve performance and productivity.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-product-search"
              />
            </div>
            
            <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
              <SelectTrigger className="w-[200px]" data-testid="select-equipment-filter">
                <SelectValue placeholder="Equipment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                {equipmentTypes.map(equipment => (
                  <SelectItem key={equipment} value={equipment}>{equipment}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]" data-testid="select-category-filter">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
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
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow" data-testid={`card-product-${product.slug}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary">{product.equipment}</Badge>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      {product.logoDarkGreen && (
                        <div className="my-4 flex justify-center">
                          <img 
                            src={product.logoDarkGreen.replace('/src', '')} 
                            alt={`${product.name} logo`}
                            className="h-16 w-auto object-contain"
                            data-testid={`img-product-logo-${product.slug}`}
                          />
                        </div>
                      )}
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <CardDescription>{product.tagline}</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Key Features:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {product.highlights.map((highlight, index) => (
                              <li key={index}>• {highlight}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {product.worksWith.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Works With:</h4>
                            <div className="flex flex-wrap gap-1">
                              {product.worksWith.map((compatible, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {compatible}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex gap-2">
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
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}