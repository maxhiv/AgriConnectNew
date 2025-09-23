import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWordPressPosts, formatWordPressDate, getExcerpt } from "@/hooks/useWordPress";
import { ArrowRight, Calendar, ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface WordPressPostsProps {
  limit?: number;
  showViewAll?: boolean;
  className?: string;
}

export default function WordPressPosts({ limit = 3, showViewAll = true, className = "" }: WordPressPostsProps) {
  const { data, isLoading, error } = useWordPressPosts(limit);

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Latest from WordPress</h2>
          <p className="text-muted-foreground">Loading posts...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
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
    );
  }

  if (error) {
    return (
      <div className={`text-center space-y-4 ${className}`}>
        <h2 className="text-3xl font-bold">Latest from WordPress</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Unable to load WordPress content. Using fallback content.
          </p>
        </div>
        {/* Fallback static content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                <span>March 15, 2024</span>
              </div>
              <CardTitle className="text-lg">
                Precision Agriculture: The Future of Farming
              </CardTitle>
              <CardDescription>
                Discover how drone technology and GPS-guided systems are revolutionizing modern agriculture...
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Badge variant="secondary" className="mb-3">Agriculture</Badge>
              <Button variant="outline" className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                Read More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const posts = data?.data || [];

  if (posts.length === 0) {
    return (
      <div className={`text-center space-y-4 ${className}`}>
        <h2 className="text-3xl font-bold">Latest from WordPress</h2>
        <p className="text-muted-foreground">No posts available at this time.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4" data-testid="heading-wordpress-posts">
          Latest from WordPress
        </h2>
        <p className="text-muted-foreground">
          Fresh content and updates from our WordPress backend
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card 
            key={post.id} 
            className="hover:shadow-lg transition-shadow duration-300"
            data-testid={`wordpress-post-${post.id}`}
          >
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                <span>{formatWordPressDate(post.date)}</span>
              </div>
              <CardTitle className="text-lg line-clamp-2" data-testid={`post-title-${post.id}`}>
                {post.title.rendered}
              </CardTitle>
              <CardDescription className="text-sm">
                {post.excerpt.rendered 
                  ? getExcerpt(post.excerpt.rendered, 120)
                  : getExcerpt(post.content.rendered, 120)
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">WordPress</Badge>
                {post.sticky && <Badge variant="default">Featured</Badge>}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  asChild
                  data-testid={`button-view-post-${post.id}`}
                >
                  <Link href={`/wordpress/post/${post.slug}`} className="flex items-center justify-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    View Post
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  asChild
                  data-testid={`button-external-post-${post.id}`}
                >
                  <a 
                    href={post.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showViewAll && posts.length >= limit && (
        <div className="text-center">
          <Button asChild variant="outline" data-testid="button-view-all-wordpress">
            <Link href="/wordpress/posts">
              View All WordPress Posts
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}