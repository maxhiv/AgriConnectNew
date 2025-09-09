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
    <section id="services" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-2 text-3xl md:text-4xl font-pilat font-bold text-ptx-dark-green mb-4">
            Our Agricultural Services
          </h2>
          <p className="text-ptx-dark-green text-lg max-w-3xl mx-auto font-lato">
            Comprehensive solutions designed to meet every aspect of modern farming needs, from soil preparation to harvest optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index}
                className="card-ptx rounded-lg p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1"
                data-testid={`service-card-${index}`}
              >
                <div className="text-ptx-bright-orange text-4xl mb-4">
                  <IconComponent size={48} />
                </div>
                <h3 className="text-xl font-semibold text-ptx-dark-green mb-3 font-pilat">{service.title}</h3>
                <p className="text-ptx-dark-green mb-4 font-lato">{service.description}</p>
                <button className="text-ptx-bright-blue font-medium hover:text-ptx-medium-green transition-colors font-pilat">
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
