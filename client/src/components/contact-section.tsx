import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { ZohoFormIntegration } from "./zoho-form-integration";

export default function ContactSection() {

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
          {/* Zoho Contact Form */}
          <div className="card-ptx rounded-lg p-8 text-ptx-dark-green">
            <h3 className="heading-3 text-2xl font-bold text-ptx-dark-green mb-6 font-pilat">Send us a Message</h3>
            <ZohoFormIntegration className="w-full" />
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
