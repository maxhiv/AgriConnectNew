import { Sprout, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 64;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="text-ptx-white py-12" style={{
      background: 'linear-gradient(135deg, rgba(1, 59, 39, 0.95), rgba(12, 159, 80, 0.9))',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img 
                src="/assets/images/vantage-south-logo.png" 
                alt="Vantage South" 
                className="h-8 w-auto filter brightness-0 invert"
              />
            </div>
            <p className="text-ptx-neutral-green mb-4 font-lato">
              Leading agricultural solutions provider dedicated to sustainable farming and innovative technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors" data-testid="footer-facebook">
                <Facebook />
              </a>
              <a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors" data-testid="footer-twitter">
                <Twitter />
              </a>
              <a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors" data-testid="footer-instagram">
                <Instagram />
              </a>
              <a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors" data-testid="footer-linkedin">
                <Linkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-pilat">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors text-left font-lato"
                  data-testid="footer-link-home"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors text-left font-lato"
                  data-testid="footer-link-about"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors text-left font-lato"
                  data-testid="footer-link-services"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('products')}
                  className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors text-left font-lato"
                  data-testid="footer-link-products"
                >
                  Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('news')}
                  className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors text-left font-lato"
                  data-testid="footer-link-news"
                >
                  News
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors text-left font-lato"
                  data-testid="footer-link-contact"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-pilat">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato">Equipment Solutions</a></li>
              <li><a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato">Crop Management</a></li>
              <li><a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato">Soil Analysis</a></li>
              <li><a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato">Precision Agriculture</a></li>
              <li><a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato">Training & Education</a></li>
              <li><a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato">Consulting Services</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-pilat">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/farming-guides" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato">Farming Guides</Link></li>
              <li><Link href="/weather-updates" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato">Weather Updates</Link></li>
              <li><a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato">Technical Support</a></li>
              <li><a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato">FAQ</a></li>
              <li><a href="#" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato">Download Center</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ptx-medium-green mt-8 pt-8 text-center">
          <p className="text-ptx-neutral-green font-lato">
            © 2024 Vantage South. All rights reserved. | 
            <a href="#" className="hover:text-ptx-bright-green transition-colors ml-1">Privacy Policy</a> | 
            <a href="#" className="hover:text-ptx-bright-green transition-colors ml-1">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}