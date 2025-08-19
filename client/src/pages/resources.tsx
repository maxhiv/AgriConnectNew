import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Video, 
  BookOpen, 
  Download, 
  ExternalLink, 
  Calendar,
  Users,
  Settings,
  TrendingUp,
  HelpCircle,
  Clock
} from "lucide-react";

const resourceCategories = [
  {
    id: "documentation",
    title: "Documentation & Manuals",
    description: "Installation guides, operation manuals, and technical documentation",
    icon: FileText,
    color: "bg-blue-500",
    items: [
      {
        title: "Installation Guide - DeltaForce System",
        type: "PDF",
        size: "2.4 MB",
        description: "Complete installation procedures for DeltaForce hydraulic downforce control",
        downloadUrl: "#"
      },
      {
        title: "20|20 Operation Manual",
        type: "PDF", 
        size: "5.1 MB",
        description: "Comprehensive guide to 20|20 monitor operation and troubleshooting",
        downloadUrl: "#"
      },
      {
        title: "SmartFirmer Calibration Procedures",
        type: "PDF",
        size: "1.8 MB", 
        description: "Step-by-step calibration and maintenance procedures",
        downloadUrl: "#"
      }
    ]
  },
  {
    id: "training",
    title: "Training Resources",
    description: "Video tutorials, training modules, and certification programs",
    icon: Video,
    color: "bg-green-500",
    items: [
      {
        title: "Getting Started with Precision Planting",
        type: "Video Series",
        duration: "45 min",
        description: "Introduction to precision agriculture technology and benefits",
        viewUrl: "#"
      },
      {
        title: "Advanced 20|20 Features",
        type: "Interactive Course",
        duration: "2 hours",
        description: "Deep dive into advanced monitoring and control features",
        viewUrl: "#"
      },
      {
        title: "Troubleshooting Common Issues",
        type: "Video Tutorial",
        duration: "30 min",
        description: "Common problems and their solutions for field operations",
        viewUrl: "#"
      }
    ]
  },
  {
    id: "technical",
    title: "Technical Support",
    description: "Troubleshooting guides, diagnostic tools, and technical bulletins",
    icon: Settings,
    color: "bg-orange-500",
    items: [
      {
        title: "Diagnostic Error Codes Reference",
        type: "Quick Reference",
        pages: "8 pages",
        description: "Complete list of system error codes and resolution steps",
        downloadUrl: "#"
      },
      {
        title: "Software Update Procedures",
        type: "Tech Bulletin",
        date: "Latest",
        description: "How to update firmware and software on your systems",
        downloadUrl: "#"
      },
      {
        title: "Compatibility Matrix",
        type: "Reference Chart", 
        date: "2024",
        description: "Product compatibility across different equipment brands",
        downloadUrl: "#"
      }
    ]
  },
  {
    id: "agronomic",
    title: "Agronomic Resources",
    description: "Research data, case studies, and best practices for precision agriculture",
    icon: TrendingUp,
    color: "bg-purple-500",
    items: [
      {
        title: "ROI Calculator - Precision Planting",
        type: "Interactive Tool",
        description: "Calculate return on investment for precision planting technology",
        viewUrl: "#"
      },
      {
        title: "Case Study: 15% Yield Increase",
        type: "Research Paper",
        pages: "12 pages",
        description: "Iowa farm achieves 15% corn yield increase with precision technology",
        downloadUrl: "#"
      },
      {
        title: "Best Practices Guide",
        type: "eBook",
        pages: "24 pages",
        description: "Optimize your planting operations for maximum performance",
        downloadUrl: "#"
      }
    ]
  }
];

const upcomingEvents = [
  {
    title: "Precision Agriculture Technology Day",
    date: "March 15, 2024",
    time: "9:00 AM - 4:00 PM",
    location: "Premier Ag Solutions - Main Location",
    description: "Hands-on demonstrations of the latest precision agriculture technology"
  },
  {
    title: "20|20 Advanced Training Workshop",
    date: "April 8, 2024", 
    time: "1:00 PM - 5:00 PM",
    location: "Online Webinar",
    description: "Deep dive into advanced features and optimization techniques"
  },
  {
    title: "Spring Equipment Prep Clinic",
    date: "April 22, 2024",
    time: "8:00 AM - 12:00 PM", 
    location: "Premier Ag Solutions - Service Center",
    description: "Get your precision equipment ready for the planting season"
  }
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-green-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Resources & Support
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Everything you need to maximize your precision agriculture investment
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                24/7 Support Available
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 border-white text-white">
                Free Training Included
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2" data-testid="button-emergency-support">
              <HelpCircle className="h-6 w-6" />
              <span>Emergency Support</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" data-testid="button-software-updates">
              <Download className="h-6 w-6" />
              <span>Software Updates</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" data-testid="button-parts-ordering">
              <Settings className="h-6 w-6" />
              <span>Parts Ordering</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" data-testid="button-training-schedule">
              <Calendar className="h-6 w-6" />
              <span>Training Schedule</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Resource Library</h2>
          
          <div className="space-y-12">
            {resourceCategories.map(category => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${category.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{category.title}</h3>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map((item, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-resource-${category.id}-${index}`}>
                        <CardHeader>
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary">{item.type}</Badge>
                            {'size' in item && <span className="text-xs text-muted-foreground">{item.size}</span>}
                            {'duration' in item && <span className="text-xs text-muted-foreground">{item.duration}</span>}
                            {'pages' in item && <span className="text-xs text-muted-foreground">{item.pages}</span>}
                            {'date' in item && <span className="text-xs text-muted-foreground">{item.date}</span>}
                          </div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex space-x-2">
                            {'downloadUrl' in item && (
                              <Button size="sm" data-testid={`button-download-${category.id}-${index}`}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </Button>
                            )}
                            {'viewUrl' in item && (
                              <Button size="sm" variant="outline" data-testid={`button-view-${category.id}-${index}`}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upcoming Training & Events</h2>
            <p className="text-xl text-muted-foreground">
              Stay up to date with training opportunities and technology demonstrations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-event-${index}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="mb-2">
                      <Calendar className="mr-1 h-3 w-3" />
                      {event.date}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Button className="w-full" data-testid={`button-register-event-${index}`}>
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Contact */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Need Additional Support?</CardTitle>
              <CardDescription>
                Our technical support team is here to help with any questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Can't find what you're looking for? Contact our support team for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" data-testid="button-contact-support">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
                <Button variant="outline" size="lg" data-testid="button-schedule-training">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Training
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}