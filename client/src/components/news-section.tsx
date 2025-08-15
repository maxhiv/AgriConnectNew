export default function NewsSection() {
  const articles = [
    {
      image: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      date: "March 15, 2024",
      title: "Precision Agriculture: The Future of Farming",
      excerpt: "Discover how drone technology and GPS-guided systems are revolutionizing modern agriculture...",
    },
    {
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      date: "March 12, 2024",
      title: "Sustainable Farming Practices for 2024",
      excerpt: "Learn about the latest sustainable farming techniques that benefit both farmers and the environment...",
    },
    {
      image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      date: "March 10, 2024",
      title: "Record Harvest Yields This Season",
      excerpt: "Local farmers report exceptional yields thanks to improved farming techniques and favorable weather...",
    },
  ];

  return (
    <section id="news" className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-agri-primary mb-4">
            Latest Agricultural News
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Stay updated with the latest developments in agricultural technology, farming practices, and industry insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article 
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              data-testid={`news-article-${index}`}
            >
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="text-sm text-agri-secondary mb-2">{article.date}</div>
                <h3 className="text-xl font-semibold text-agri-primary mb-3">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <button className="text-agri-secondary font-medium hover:text-agri-primary transition-colors">
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-agri-secondary hover:bg-agri-primary text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300" data-testid="button-view-all-news">
            View All News
          </button>
        </div>
      </div>
    </section>
  );
}
