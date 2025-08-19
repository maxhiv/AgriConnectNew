import { useState } from "react";
import { Menu, X, Sprout } from "lucide-react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-ptx-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-pilat font-bold text-ptx-dark-green flex items-center">
                <Sprout className="mr-2 text-ptx-bright-green" />
                Vantage South
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-ptx-dark-green hover:text-ptx-medium-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="nav-home"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-ptx-dark-green hover:text-ptx-medium-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="nav-about"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="text-ptx-dark-green hover:text-ptx-medium-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="nav-services"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('products')}
                className="text-ptx-dark-green hover:text-ptx-medium-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="nav-products"
              >
                Products
              </button>
              <button 
                onClick={() => scrollToSection('news')}
                className="text-ptx-dark-green hover:text-ptx-medium-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="nav-news"
              >
                News
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-ptx-dark-green hover:text-ptx-medium-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
                data-testid="nav-contact"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="bg-ptx-medium-green text-ptx-white p-2 rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-button"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-ptx-white border-t border-ptx-neutral-green">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-ptx-dark-green block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              data-testid="mobile-nav-home"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-ptx-dark-green block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              data-testid="mobile-nav-about"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-ptx-dark-green block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              data-testid="mobile-nav-services"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('products')}
              className="text-ptx-dark-green block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              data-testid="mobile-nav-products"
            >
              Products
            </button>
            <button 
              onClick={() => scrollToSection('news')}
              className="text-ptx-dark-green block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              data-testid="mobile-nav-news"
            >
              News
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-ptx-dark-green block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              data-testid="mobile-nav-contact"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
