import { useWordPressPosts, formatWordPressDate, getExcerpt } from "@/hooks/useWordPress";
import { Link } from "wouter";

export default function NewsSection() {
  const { data: wordpressData, isLoading: wordpressLoading } = useWordPressPosts(3);
  
  const fallbackArticles = [
    {
      image: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      date: "March 15, 2024",
      title: "Precision Agriculture: The Future of Farming",
      excerpt: "Discover how drone technology and GPS-guided systems are revolutionizing modern agriculture...",
      isWordPress: false,
      slug: "",
      link: "",
    },
    {
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      date: "March 12, 2024",
      title: "Sustainable Farming Practices for 2024",
      excerpt: "Learn about the latest sustainable farming techniques that benefit both farmers and the environment...",
      isWordPress: false,
      slug: "",
      link: "",
    },
    {
      image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      date: "March 10, 2024",
      title: "Record Harvest Yields This Season",
      excerpt: "Local farmers report exceptional yields thanks to improved farming techniques and favorable weather...",
      isWordPress: false,
      slug: "",
      link: "",
    },
  ];

  // Combine WordPress posts with fallback articles
  const wordPressPosts = wordpressData?.data || [];
  const articles = [
    ...wordPressPosts.map(post => ({
      image: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400", // Default image for WordPress posts
      date: formatWordPressDate(post.date),
      title: post.title.rendered,
      excerpt: post.excerpt.rendered ? getExcerpt(post.excerpt.rendered, 120) : getExcerpt(post.content.rendered, 120),
      isWordPress: true,
      slug: post.slug,
      link: post.link,
    })),
    ...fallbackArticles,
  ].slice(0, 3); // Limit to 3 articles total

  return (
    <section id="news" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-2 text-3xl md:text-4xl font-pilat font-bold text-ptx-dark-green mb-4">
            Latest Agricultural News
          </h2>
          <p className="text-ptx-dark-green text-lg max-w-3xl mx-auto font-lato">
            Stay updated with the latest developments in agricultural technology, farming practices, and industry insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article 
              key={index}
              className="card-ptx  overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1"
              data-testid={`news-article-${index}`}
            >
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="eyebrow text-sm text-ptx-medium-green">{article.date}</div>
                  {article.isWordPress && (
                    <span className="px-2 py-1 bg-ptx-bright-blue text-white text-xs rounded font-medium">
                      WordPress
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-ptx-dark-green mb-3 font-pilat">{article.title}</h3>
                <p className="text-ptx-dark-green mb-4 font-lato">{article.excerpt}</p>
                {article.isWordPress ? (
                  <div className="flex gap-2">
                    <Link href={`/wordpress/post/${article.slug}`}>
                      <button className="text-ptx-bright-blue font-medium hover:text-ptx-medium-green transition-colors font-pilat">
                        Read More →
                      </button>
                    </Link>
                    <a 
                      href={article.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-ptx-medium-green font-medium hover:text-ptx-bright-blue transition-colors font-pilat ml-4"
                    >
                      Original ↗
                    </a>
                  </div>
                ) : (
                  <button className="text-ptx-bright-blue font-medium hover:text-ptx-medium-green transition-colors font-pilat">
                    Read More →
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/wordpress/posts">
              <button className="btn-ptx-secondary hover:bg-ptx-dark-green text-ptx-white px-8 py-3 font-semibold transition-all duration-300 hover:transform hover:-translate-y-1" data-testid="button-view-wordpress-posts">
                View WordPress Posts
              </button>
            </Link>
            <button className="btn-ptx-secondary hover:bg-ptx-dark-green text-ptx-white px-8 py-3 font-semibold transition-all duration-300 hover:transform hover:-translate-y-1" data-testid="button-view-all-news">
              View All News
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
