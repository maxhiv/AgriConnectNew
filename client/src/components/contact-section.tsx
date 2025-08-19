import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export default function ContactSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest('POST', '/api/contact', data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you soon.",
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <section id="contact" className="section-solid--primary py-20 bg-ptx-dark-green text-ptx-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-2 text-3xl md:text-4xl font-pilat font-bold mb-4">
            Get In Touch
          </h2>
          <p className="text-ptx-neutral-green text-lg max-w-3xl mx-auto font-lato">
            Have questions about our precision agriculture solutions? Our team is here to help. Fill out the form or use our direct contact information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card-ptx rounded-lg p-8 text-ptx-dark-green">
            <h3 className="heading-3 text-2xl font-bold text-ptx-dark-green mb-6 font-pilat">Send us a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-ptx-dark-green mb-2 font-pilat">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    required
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-ptx-dark-green mb-2 font-pilat">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    required
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ptx-dark-green mb-2 font-pilat">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john.doe@example.com"
                  required
                  data-testid="input-email"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-ptx-dark-green mb-2 font-pilat">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  data-testid="input-phone"
                />
              </div>
              
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-ptx-dark-green mb-2 font-pilat">
                  Service Interest
                </label>
                <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
                  <SelectTrigger data-testid="select-service">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equipment">Equipment Solutions</SelectItem>
                    <SelectItem value="crop-management">Crop Management</SelectItem>
                    <SelectItem value="soil-analysis">Soil Analysis</SelectItem>
                    <SelectItem value="precision-agriculture">Precision Agriculture</SelectItem>
                    <SelectItem value="training">Training & Education</SelectItem>
                    <SelectItem value="consulting">Consulting Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-ptx-dark-green mb-2 font-pilat">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us about your agricultural needs..."
                  rows={4}
                  required
                  data-testid="textarea-message"
                />
              </div>
              
              <Button 
                type="submit" 
                className="btn-ptx-primary w-full hover:bg-ptx-medium-green text-ptx-white"
                disabled={contactMutation.isPending}
                data-testid="button-send-message"
              >
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="heading-3 text-2xl font-bold mb-6 font-pilat">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="text-ptx-bright-green text-xl mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Our Locations</h4>
                    <div className="text-ptx-neutral-green font-lato space-y-3">
                      <div>
                        <p className="font-semibold">Samson, AL</p>
                        <p>4824 County Road 460<br />Samson, AL 36477</p>
                      </div>
                      <div>
                        <p className="font-semibold">Daphne, AL</p>
                        <p>24001 State Highway 181<br />Daphne, AL 36526</p>
                      </div>
                      <div>
                        <p className="font-semibold">Atmore, AL</p>
                        <p>1910 E. Nashville Avenue<br />Atmore, AL 36502</p>
                      </div>
                      <div>
                        <p className="font-semibold">Clarksdale, MS</p>
                        <p>1315 Industrial Park Dr.<br />Clarksdale, MS 38614</p>
                      </div>
                      <div>
                        <p className="font-semibold">Rolling Fork, MS</p>
                        <p>20790 Highway 61<br />Rolling Fork, MS 39159</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="text-ptx-bright-green text-xl mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-ptx-neutral-green font-lato">(888) 982-1997</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="text-ptx-bright-green text-xl mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-ptx-neutral-green font-lato">info@vantage-south.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="text-ptx-bright-green text-xl mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Hours</h4>
                    <p className="text-ptx-neutral-green font-lato">
                      Monday - Friday: 8:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-pilat">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors" data-testid="link-facebook">
                  <Facebook className="text-2xl" />
                </a>
                <a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors" data-testid="link-twitter">
                  <Twitter className="text-2xl" />
                </a>
                <a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors" data-testid="link-instagram">
                  <Instagram className="text-2xl" />
                </a>
                <a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors" data-testid="link-linkedin">
                  <Linkedin className="text-2xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
