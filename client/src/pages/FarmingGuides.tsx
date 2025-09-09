import { Sprout, Book, Target, Leaf, Droplets, Bug, Thermometer, Calendar } from "lucide-react";

export default function FarmingGuides() {
  const guides = [
    {
      title: "Soil Preparation & Management",
      icon: Sprout,
      description: "Essential techniques for soil health, testing, and preparation for optimal crop growth.",
      topics: [
        "Soil pH testing and adjustment",
        "Organic matter incorporation",
        "Drainage and irrigation planning",
        "Soil fertility management"
      ]
    },
    {
      title: "Crop Planning & Rotation",
      icon: Calendar,
      description: "Strategic planning for sustainable crop rotation and seasonal planting schedules.",
      topics: [
        "Seasonal planting calendars",
        "Crop rotation strategies",
        "Companion planting techniques",
        "Cover crop selection"
      ]
    },
    {
      title: "Precision Agriculture",
      icon: Target,
      description: "Modern farming techniques using GPS, sensors, and data analytics for efficiency.",
      topics: [
        "GPS-guided equipment operation",
        "Variable rate application",
        "Yield mapping and analysis",
        "Drone monitoring techniques"
      ]
    },
    {
      title: "Integrated Pest Management",
      icon: Bug,
      description: "Sustainable pest control strategies that minimize chemical use while protecting crops.",
      topics: [
        "Beneficial insect identification",
        "Natural pest deterrents",
        "Monitoring and threshold levels",
        "Biological control methods"
      ]
    },
    {
      title: "Water Management",
      icon: Droplets,
      description: "Efficient irrigation systems and water conservation practices for sustainable farming.",
      topics: [
        "Drip irrigation installation",
        "Soil moisture monitoring",
        "Water-efficient crop varieties",
        "Rainwater harvesting"
      ]
    },
    {
      title: "Climate Adaptation",
      icon: Thermometer,
      description: "Strategies for adapting farming practices to changing climate conditions.",
      topics: [
        "Heat-resistant varieties",
        "Drought management strategies",
        "Season extension techniques",
        "Weather prediction tools"
      ]
    }
  ];

  const downloadableResources = [
    {
      title: "Planting Calendar Template",
      description: "Customizable calendar for planning your crop rotations",
      format: "PDF"
    },
    {
      title: "Soil Test Result Interpreter",
      description: "Guide to understanding and acting on soil test results",
      format: "PDF"
    },
    {
      title: "Pest Identification Guide",
      description: "Visual guide to common agricultural pests and beneficial insects",
      format: "PDF"
    },
    {
      title: "Equipment Maintenance Checklist",
      description: "Seasonal maintenance schedules for farm equipment",
      format: "PDF"
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-1 text-4xl md:text-5xl font-pilat font-bold text-ptx-dark-green mb-4">
            Farming Guides & Resources
          </h1>
          <p className="text-ptx-dark-green text-lg max-w-3xl mx-auto font-lato">
            Comprehensive guides and best practices for modern agricultural operations. 
            Learn from experts and implement proven strategies for your farm.
          </p>
        </div>

        {/* Featured Guides */}
        <div className="mb-16">
          <h2 className="heading-2 text-3xl font-pilat font-bold text-ptx-dark-green mb-8 text-center">
            Essential Farming Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide, index) => {
              const IconComponent = guide.icon;
              return (
                <div key={index} className="card-ptx p-6 hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1">
                  <div className="text-ptx-bright-green text-4xl mb-4">
                    <IconComponent size={48} />
                  </div>
                  <h3 className="text-xl font-semibold text-ptx-dark-green mb-3 font-pilat">{guide.title}</h3>
                  <p className="text-ptx-dark-green mb-4 font-lato">{guide.description}</p>
                  <ul className="space-y-2 mb-4">
                    {guide.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="text-sm text-ptx-dark-green flex items-start font-lato">
                        <span className="text-ptx-bright-green mr-2">•</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <button className="btn-ptx-outline text-sm px-4 py-2">
                    Read Full Guide
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Downloadable Resources */}
        <div className="mb-16">
          <h2 className="heading-2 text-3xl font-pilat font-bold text-ptx-dark-green mb-8 text-center">
            Downloadable Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {downloadableResources.map((resource, index) => (
              <div key={index} className="card-ptx p-6 flex items-center justify-between">
                <div className="flex items-start">
                  <Book className="text-ptx-bright-orange text-2xl mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-ptx-dark-green font-pilat mb-1">{resource.title}</h4>
                    <p className="text-ptx-dark-green text-sm font-lato">{resource.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-xs bg-ptx-neutral-green text-ptx-dark-green px-2 py-1  mr-3">
                    {resource.format}
                  </span>
                  <button className="btn-ptx-primary text-sm px-4 py-2">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact for Custom Guides */}
        <div className="card-ptx p-8 text-center">
          <h3 className="heading-3 text-2xl font-pilat font-bold text-ptx-dark-green mb-4">
            Need Custom Guidance?
          </h3>
          <p className="text-ptx-dark-green mb-6 font-lato">
            Our agricultural experts can provide personalized recommendations for your specific farming operation.
          </p>
          <button className="btn-ptx-primary px-8 py-3">
            Contact Our Experts
          </button>
        </div>
      </div>
    </div>
  );
}