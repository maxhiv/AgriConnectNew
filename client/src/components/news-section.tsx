import { Link } from "wouter";

export default function NewsSection() {
  const articles = [
    {
      image: "https://images.ctfassets.net/npb3dl1oqqgh/59KsrYggIdJXOLeK6jy6k/db6bbb9544272a3f254e27fca6ee3a6b/nav-960-1200x630.jpg",
      date: "December 10, 2024",
      title: "PTx Trimble NAV-960 Delivers Sub-Inch Accuracy for Alabama Cotton Farmers",
      excerpt: "Vantage South customers in Houston County report 15% input savings after upgrading to the NAV-960 guidance controller with RTK correction services.",
      slug: "ptx-trimble-nav-960-alabama-cotton-farmers",
    },
    {
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      date: "November 28, 2024",
      title: "Variable Rate Technology Transforms Peanut Production in the Wiregrass",
      excerpt: "Southeast Alabama growers using Ag Leader OptiRx sensors see improved plant health monitoring and optimized fertilizer applications across their fields.",
      slug: "variable-rate-technology-peanut-production-wiregrass",
    },
    {
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      date: "November 15, 2024",
      title: "Vantage South Expands Service Coverage to Central Tennessee",
      excerpt: "Our newest territory brings precision agriculture solutions to corn and soybean producers in Robertson, Montgomery, and Sumner counties.",
      slug: "vantage-south-expands-central-tennessee",
    },
    {
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      date: "October 30, 2024",
      title: "Raven Autonomy: The Future of Hands-Free Farming Arrives in Mississippi",
      excerpt: "Delta region farmers experience the benefits of autonomous tillage and planting operations with Raven's DOT autonomous platform technology.",
      slug: "raven-autonomy-mississippi-delta",
    },
    {
      image: "https://images.ctfassets.net/npb3dl1oqqgh/75aGHURWPb9YxRpqW4xAnL/960bf6be8dabd26b7bd63620360d85e0/agriculture-gfx-1260-display-Aug23-1200x627.png",
      date: "October 18, 2024",
      title: "GFX-1260 Display: Streamlining Farm Operations Across the Southeast",
      excerpt: "The Android-based 12.1-inch touchscreen simplifies precision agriculture workflows for operators running multiple implements and guidance systems.",
      slug: "gfx-1260-display-southeast-operations",
    },
    {
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      date: "October 5, 2024",
      title: "Schedule Your Field Demo: See Precision Ag Technology in Action",
      excerpt: "Vantage South offers complimentary on-farm demonstrations of guidance systems, variable rate controllers, and yield monitoring equipment throughout our service area.",
      slug: "schedule-field-demo-precision-ag-technology",
    },
  ];

  return (
    <section id="news" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-2 text-3xl md:text-4xl font-pilat font-bold text-ptx-dark-green mb-4">
            Latest From Vantage South
          </h2>
          <p className="text-ptx-dark-green text-lg max-w-3xl mx-auto font-lato">
            Stay updated with the latest developments in precision agriculture technology, product innovations, and success stories from our Southeast farming community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <article 
              key={index}
              className="card-ptx overflow-hidden hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1"
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
                </div>
                <h3 className="text-xl font-semibold text-ptx-dark-green mb-3 font-pilat">{article.title}</h3>
                <p className="text-ptx-dark-green mb-4 font-lato">{article.excerpt}</p>
                <Link href={`/news/${article.slug}`}>
                  <span className="text-ptx-bright-blue font-medium hover:text-ptx-medium-green transition-colors font-pilat cursor-pointer">
                    Read More →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/schedule-field-demo">
            <button className="btn-ptx-primary px-8 py-3 font-semibold transition-all duration-300 hover:transform hover:-translate-y-1" data-testid="button-schedule-demo">
              Schedule a Field Demo
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
