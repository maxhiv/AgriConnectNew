export default function ProductsSection() {
  const equipment = [
    {
      image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      title: "Premium Combine Harvester",
      description: "High-efficiency harvesting with advanced grain cleaning and precision controls.",
    },
    {
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      title: "Heavy-Duty Tractor",
      description: "Powerful and reliable tractors for all your field cultivation needs.",
    },
    {
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      title: "Smart Irrigation System",
      description: "Automated water management for optimal crop hydration and resource efficiency.",
    },
  ];

  const produce = [
    {
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      title: "Organic Tomatoes",
      description: "Farm-fresh, vine-ripened",
    },
    {
      image: "https://images.unsplash.com/photo-1549068106-b024baf5062d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      title: "Leafy Greens",
      description: "Nutrient-rich vegetables",
    },
    {
      image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      title: "Fresh Carrots",
      description: "Sweet and crunchy",
    },
    {
      image: "https://images.unsplash.com/photo-1447175008436-054170c2e979?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
      title: "Bell Peppers",
      description: "Crisp and colorful",
    },
  ];

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-agri-primary mb-4">
            Featured Products & Equipment
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Discover our range of premium agricultural products and equipment designed to enhance your farming operations.
          </p>
        </div>

        {/* Equipment Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-agri-primary mb-8 text-center">Farm Equipment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {equipment.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                data-testid={`equipment-card-${index}`}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-agri-primary mb-2">{item.title}</h4>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <button className="text-agri-secondary font-medium hover:text-agri-primary transition-colors">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fresh Produce Section */}
        <div>
          <h3 className="text-2xl font-bold text-agri-primary mb-8 text-center">Fresh Produce</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {produce.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                data-testid={`produce-card-${index}`}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-agri-primary mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
