import { Tractor, Leaf, Microscope, Satellite, GraduationCap, Handshake } from "lucide-react";

export default function ServicesSection() {
  const services = [
    {
      icon: Tractor,
      title: "Equipment Solutions",
      description: "State-of-the-art farming equipment for efficient field operations, from planting to harvesting.",
    },
    {
      icon: Leaf,
      title: "Crop Management",
      description: "Expert guidance on crop rotation, pest control, and yield optimization strategies.",
    },
    {
      icon: Microscope,
      title: "Soil Analysis",
      description: "Comprehensive soil testing and analysis to optimize nutrient management and crop health.",
    },
    {
      icon: Satellite,
      title: "Precision Agriculture",
      description: "GPS-guided farming solutions and drone technology for precise field monitoring.",
    },
    {
      icon: GraduationCap,
      title: "Training & Education",
      description: "Professional development programs for modern farming techniques and best practices.",
    },
    {
      icon: Handshake,
      title: "Consulting Services",
      description: "Expert agricultural consultancy for farm planning, sustainability, and business growth.",
    },
  ];

  return (
    <section id="services" className="py-20 bg-agri-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-agri-primary mb-4">
            Our Agricultural Services
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Comprehensive solutions designed to meet every aspect of modern farming needs, from soil preparation to harvest optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                data-testid={`service-card-${index}`}
              >
                <div className="text-agri-accent text-4xl mb-4">
                  <IconComponent size={48} />
                </div>
                <h3 className="text-xl font-semibold text-agri-primary mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button className="text-agri-secondary font-medium hover:text-agri-primary transition-colors">
                  Learn More →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
