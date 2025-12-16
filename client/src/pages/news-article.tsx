import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useEffect } from "react";
import type { NewsArticle } from "@shared/schema";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

export default function NewsArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: article, isLoading, error } = useQuery<NewsArticle>({
    queryKey: ["/api/news", slug],
    enabled: !!slug,
  });

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Vantage South News`;
    }
  }, [article]);

  if (isLoading) {
    return (
      <div className="font-lato bg-white min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="font-lato bg-white min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-ptx-dark-green mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link href="/#news">
            <button className="btn-ptx-primary px-6 py-3">Back to News</button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-lato bg-white min-h-screen">
      <Navigation />
      
      <article className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Link href="/#news">
          <span className="inline-flex items-center gap-2 text-ptx-bright-blue hover:text-ptx-medium-green mb-8 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </span>
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-pilat font-bold text-ptx-dark-green mb-6">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{article.date}</span>
            </div>
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
            )}
            {article.category && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>{article.category}</span>
              </div>
            )}
          </div>

          <p className="text-xl text-gray-700 leading-relaxed">
            {article.excerpt}
          </p>
        </header>

        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
        />

        <div 
          className="prose prose-lg max-w-none prose-headings:font-pilat prose-headings:text-ptx-dark-green prose-p:text-gray-700 prose-strong:text-ptx-dark-green prose-li:text-gray-700"
          dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
        />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-pilat font-semibold text-ptx-dark-green mb-4">
            Ready to Learn More?
          </h3>
          <p className="text-gray-600 mb-6">
            Contact Vantage South to discuss how precision agriculture technology can benefit your operation.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/schedule-field-demo">
              <button className="btn-ptx-primary px-6 py-3" data-testid="button-schedule-demo">
                Schedule a Field Demo
              </button>
            </Link>
            <Link href="/products">
              <button className="btn-ptx-secondary px-6 py-3" data-testid="button-view-products">
                View Products
              </button>
            </Link>
          </div>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            image: article.image,
            datePublished: article.date,
            author: {
              "@type": "Organization",
              name: article.author || "Vantage South",
            },
            publisher: {
              "@type": "Organization",
              name: "Vantage South",
              logo: {
                "@type": "ImageObject",
                url: "https://vantagesouth.com/assets/images/vantage-south-logo.png",
              },
            },
          }),
        }}
      />

      <Footer />
    </div>
  );
}

function formatContent(content: string): string {
  return content
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hup])/gm, '<p>')
    .replace(/(?<![>])$/gm, '</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[hul])/g, '$1')
    .replace(/(<\/[hul][^>]*>)<\/p>/g, '$1');
}
