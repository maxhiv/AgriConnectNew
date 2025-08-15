import { Sprout, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

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
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Sprout className="mr-2 text-agri-accent" />
              GreenHarvest
            </h3>
            <p className="text-gray-400 mb-4">
              Leading agricultural solutions provider dedicated to sustainable farming and innovative technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-agri-accent transition-colors" data-testid="footer-facebook">
                <Facebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-agri-accent transition-colors" data-testid="footer-twitter">
                <Twitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-agri-accent transition-colors" data-testid="footer-instagram">
                <Instagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-agri-accent transition-colors" data-testid="footer-linkedin">
                <Linkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-gray-400 hover:text-agri-accent transition-colors text-left"
                  data-testid="footer-link-home"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-gray-400 hover:text-agri-accent transition-colors text-left"
                  data-testid="footer-link-about"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-400 hover:text-agri-accent transition-colors text-left"
                  data-testid="footer-link-services"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('products')}
                  className="text-gray-400 hover:text-agri-accent transition-colors text-left"
                  data-testid="footer-link-products"
                >
                  Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('news')}
                  className="text-gray-400 hover:text-agri-accent transition-colors text-left"
                  data-testid="footer-link-news"
                >
                  News
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-400 hover:text-agri-accent transition-colors text-left"
                  data-testid="footer-link-contact"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-agri-accent transition-colors">Equipment Solutions</a></li>
              <li><a href="#" className="text-gray-400 hover:text-agri-accent transition-colors">Crop Management</a></li>
              <li><a href="#" className="text-gray-400 hover:text-agri-accent transition-colors">Soil Analysis</a></li>
              <li><a href="#" className="text-gray-400 hover:text-agri-accent transition-colors">Precision Agriculture</a></li>
              <li><a href="#" className="text-gray-400 hover:text-agri-accent transition-colors">Training & Education</a></li>
              <li><a href="#" className="text-gray-400 hover:text-agri-accent transition-colors">Consulting Services</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-agri-accent transition-colors">Farming Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-agri-accent transition-colors">Weather Updates</a></li>
              <li><a href="#" className="text-gray-400 hover:text-agri-accent transition-colors">Market Prices</a></li>
              <li><a href="#" className="text-gray-400 hover:text-agri-accent transition-colors">Technical Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-agri-accent transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-agri-accent transition-colors">Download Center</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 GreenHarvest Agricultural Solutions. All rights reserved. | 
            <a href="#" className="hover:text-agri-accent transition-colors ml-1">Privacy Policy</a> | 
            <a href="#" className="hover:text-agri-accent transition-colors ml-1">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
