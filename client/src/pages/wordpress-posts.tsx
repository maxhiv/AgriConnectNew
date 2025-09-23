import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWordPressPosts, formatWordPressDate, getExcerpt } from "@/hooks/useWordPress";
import { ArrowRight, Calendar, ExternalLink, Home } from "lucide-react";
import { Link } from "wouter";

export default function WordPressPosts() {
  const { data, isLoading, error } = useWordPressPosts(10);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-green-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              WordPress Posts
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Latest content from our WordPress content management system
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Live Content
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                WordPress CMS
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Agricultural News
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">WordPress Posts</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-8">
              <div className="text-center">
                <p className="text-lg text-muted-foreground">Loading WordPress posts...</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-full"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold text-yellow-800 mb-2">
                  WordPress Content Temporarily Unavailable
                </h2>
                <p className="text-yellow-700">
                  We're experiencing issues connecting to our WordPress backend. 
                  Please check back later or contact support if this persists.
                </p>
                <div className="mt-4">
                  <Button asChild>
                    <Link href="/">Return to Home</Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Posts Grid */}
              {data?.data && data.data.length > 0 ? (
                <>
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4" data-testid="heading-all-wordpress-posts">
                      All WordPress Posts
                    </h2>
                    <p className="text-muted-foreground">
                      Showing {data.data.length} posts from our WordPress content management system
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.data.map((post) => (
                      <Card 
                        key={post.id} 
                        className="hover:shadow-lg transition-shadow duration-300"
                        data-testid={`wordpress-post-full-${post.id}`}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{formatWordPressDate(post.date)}</span>
                            </div>
                            <div className="flex gap-1">
                              <Badge variant="secondary">WordPress</Badge>
                              {post.sticky && <Badge variant="default">Featured</Badge>}
                            </div>
                          </div>
                          <CardTitle className="text-lg line-clamp-2" data-testid={`post-title-full-${post.id}`}>
                            {post.title.rendered}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {post.excerpt.rendered 
                              ? getExcerpt(post.excerpt.rendered, 150)
                              : getExcerpt(post.content.rendered, 150)
                            }
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1"
                              asChild
                              data-testid={`button-view-post-full-${post.id}`}
                            >
                              <Link href={`/wordpress/post/${post.slug}`} className="flex items-center justify-center gap-2">
                                <ArrowRight className="h-4 w-4" />
                                Read Full Post
                              </Link>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              asChild
                              data-testid={`button-external-post-full-${post.id}`}
                            >
                              <a 
                                href={post.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="h-4 w-4" />
                                Original
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold">No WordPress Posts Available</h2>
                  <p className="text-muted-foreground">
                    No posts are currently available from the WordPress backend.
                  </p>
                  <Button asChild>
                    <Link href="/">Return to Home</Link>
                  </Button>
                </div>
              )}

              {/* Call to Action */}
              <section className="bg-muted rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">
                  Want to contribute content?
                </h3>
                <p className="text-muted-foreground mb-6">
                  These posts are managed through our WordPress content management system.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/resources">Browse Resources</Link>
                  </Button>
                </div>
              </section>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}