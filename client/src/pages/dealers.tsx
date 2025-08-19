
import { Navigation } from "../components/navigation";
import { Footer } from "../components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

const dealerLocations = [
  {
    id: "samson-al",
    name: "Samson, AL",
    address: "4824 County Road 460, Samson, AL 36477",
    phone: "(888) 982-1997",
    email: "info@vantage-south.com",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM",
    established: "2015",
    manager: "Local Team",
    services: ["Installation", "Service", "Parts", "Support"],
    specialties: ["Precision Planting", "Equipment Upgrades", "Technical Support"]
  },
  {
    id: "daphne-al", 
    name: "Daphne, AL",
    address: "24001 State Highway 181, Daphne, AL 36526",
    phone: "(888) 982-1997",
    email: "info@vantage-south.com",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM",
    established: "2018",
    manager: "Local Team",
    services: ["Installation", "Service", "Parts", "Support"],
    specialties: ["Precision Planting", "Equipment Upgrades", "Technical Support"]
  },
  {
    id: "atmore-al",
    name: "Atmore, AL", 
    address: "1910 E. Nashville Avenue, Atmore, AL 36502",
    phone: "(888) 982-1997",
    email: "info@vantage-south.com",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM",
    established: "2019",
    manager: "Local Team",
    services: ["Installation", "Service", "Parts", "Support"],
    specialties: ["Precision Planting", "Equipment Upgrades", "Technical Support"]
  },
  {
    id: "clarksdale-ms",
    name: "Clarksdale, MS",
    address: "1315 Industrial Park Dr., Clarksdale, MS 38614", 
    phone: "(888) 982-1997",
    email: "info@vantage-south.com",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM",
    established: "2020",
    manager: "Local Team",
    services: ["Installation", "Service", "Parts", "Support"],
    specialties: ["Precision Planting", "Equipment Upgrades", "Technical Support"]
  },
  {
    id: "rolling-fork-ms",
    name: "Rolling Fork, MS",
    address: "20790 Highway 61, Rolling Fork, MS 39159",
    phone: "(888) 982-1997", 
    email: "info@vantage-south.com",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM",
    established: "2021",
    manager: "Local Team",
    services: ["Installation", "Service", "Parts", "Support"],
    specialties: ["Precision Planting", "Equipment Upgrades", "Technical Support"]
  }
];

export function Dealers() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-ptx-bright-green to-ptx-medium-green text-white">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-pilat">
            Our Locations
          </h1>
          <p className="text-xl md:text-2xl text-ptx-light-green max-w-3xl mx-auto font-lato">
            Professional precision agriculture support across Alabama and Mississippi
          </p>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {dealerLocations.map(location => (
              <Card key={location.id} className="hover:shadow-lg transition-shadow" data-testid={`card-dealer-${location.id}`}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">Est. {location.established}</Badge>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <CardTitle className="text-xl">{location.name}</CardTitle>
                  <CardDescription className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{location.address}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`tel:${location.phone}`}
                        className="hover:text-primary transition-colors"
                        data-testid={`link-phone-${location.id}`}
                      >
                        {location.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`mailto:${location.email}`}
                        className="hover:text-primary transition-colors"
                        data-testid={`link-email-${location.id}`}
                      >
                        {location.email}
                      </a>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm text-muted-foreground">{location.hours}</span>
                    </div>
                  </div>

                  {/* Manager */}
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Location Manager:</span>
                      <div className="font-medium">{location.manager}</div>
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Services Offered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {location.services.map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {location.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Service Areas</h2>
            <p className="text-xl text-muted-foreground">
              We provide installation and support throughout Alabama and Mississippi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">South Alabama</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mobile, Baldwin, Escambia, Monroe Counties
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">Central Alabama</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Geneva, Coffee, Covington, Crenshaw Counties
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">Mississippi Delta</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Coahoma, Sharkey, Issaquena, Washington Counties
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Need Service Outside Our Areas?</CardTitle>
              <CardDescription>
                We can help connect you with authorized dealers in your region
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Contact our main office and we'll help you find the nearest authorized service provider.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" data-testid="button-call-main">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Main Office
                </Button>
                <Button variant="outline" size="lg" data-testid="button-find-dealers">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Find Other Dealers
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
