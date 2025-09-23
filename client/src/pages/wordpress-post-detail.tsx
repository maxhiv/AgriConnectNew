import { useParams } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWordPressPost, formatWordPressDate } from "@/hooks/useWordPress";
import { ArrowLeft, Calendar, ExternalLink, Home } from "lucide-react";
import { Link } from "wouter";

export default function WordPressPostDetail() {
  const { slug } = useParams();
  const { data, isLoading, error } = useWordPressPost(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-muted-foreground">Loading WordPress post...</p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <h1 className="text-3xl font-bold">Post Not Found</h1>
              <p className="text-muted-foreground">
                The WordPress post you're looking for could not be found.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/wordpress/posts">View All Posts</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Return to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const post = data.data;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumb */}
      <section className="py-6 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <span>/</span>
            <Link href="/wordpress/posts" className="hover:text-primary">
              WordPress Posts
            </Link>
            <span>/</span>
            <span className="text-foreground">{post.title.rendered}</span>
          </div>
        </div>
      </section>

      {/* Post Content */}
      <article className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Post Header */}
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" asChild data-testid="button-back-to-posts">
                  <Link href="/wordpress/posts" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Posts
                  </Link>
                </Button>
                <Button variant="outline" asChild data-testid="button-view-original">
                  <a 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Original
                  </a>
                </Button>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatWordPressDate(post.date)}</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">WordPress</Badge>
                  {post.sticky && <Badge variant="default">Featured</Badge>}
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="post-title">
                {post.title.rendered}
              </h1>

              {post.excerpt.rendered && (
                <div className="text-xl text-muted-foreground leading-relaxed" data-testid="post-excerpt">
                  <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                </div>
              )}
            </header>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none" data-testid="post-content">
              <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
            </div>

            {/* Post Footer */}
            <footer className="mt-12 pt-8 border-t">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Published on {formatWordPressDate(post.date)}
                  {post.date !== post.modified && (
                    <span> • Updated on {formatWordPressDate(post.modified)}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/wordpress/posts">More Posts</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}