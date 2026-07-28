import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, MapPin } from "lucide-react";

const territories = [
  { name: "Alabama", slug: "alabama-precision-agriculture" },
  { name: "Mississippi", slug: "mississippi-precision-agriculture" },
  { name: "NW Florida", slug: "northwest-florida-precision-agriculture" },
  { name: "Central Tennessee", slug: "central-tennessee-precision-agriculture" }
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    return false;
  };

  const isLocationActive = () => {
    return territories.some(t => location.includes(t.slug)) || 
           location.includes('/precision-agriculture');
  };

  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50" style={{
      background: 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(15px)',
      WebkitBackdropFilter: 'blur(15px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <img 
                  src="/assets/images/vantage-south-logo.png" 
                  alt="Vantage South" 
                  className="h-10 w-auto hover:opacity-80 transition-opacity"
                />
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                href="/"
                className={`px-3 py-2  text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-ptx-medium-green bg-ptx-bright-green/10' 
                    : 'text-ptx-dark-green hover:text-ptx-medium-green'
                }`}
                data-testid="nav-home"
              >
                Home
              </Link>
              <Link 
                href="/products"
                className={`px-3 py-2  text-sm font-medium transition-colors ${
                  isActive('/products') 
                    ? 'text-ptx-medium-green bg-ptx-bright-green/10' 
                    : 'text-ptx-dark-green hover:text-ptx-medium-green'
                }`}
                data-testid="nav-products"
              >
                Products
              </Link>
              
              {/* Locations Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsLocationsOpen(true)}
                onMouseLeave={() => setIsLocationsOpen(false)}
              >
                <button
                  className={`px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                    isLocationActive() 
                      ? 'text-ptx-medium-green bg-ptx-bright-green/10' 
                      : 'text-ptx-dark-green hover:text-ptx-medium-green'
                  }`}
                  data-testid="nav-locations"
                >
                  Locations
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {isLocationsOpen && (
                  <div 
                    className="absolute left-0 mt-0 w-56 bg-white shadow-lg border border-gray-100"
                    style={{ top: '100%' }}
                  >
                    <div className="py-2">
                      {territories.map((territory) => (
                        <Link
                          key={territory.slug}
                          href={`/${territory.slug}`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                          data-testid={`nav-location-${territory.slug}`}
                        >
                          <MapPin className="h-4 w-4" />
                          {territory.name}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <Link
                          href="/schedule-field-demo"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-green-700 font-medium hover:bg-green-50"
                          data-testid="nav-field-demo"
                        >
                          Schedule Field Demo
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Link
                href="/resources"
                className={`px-3 py-2  text-sm font-medium transition-colors ${
                  isActive('/resources')
                    ? 'text-ptx-medium-green bg-ptx-bright-green/10'
                    : 'text-ptx-dark-green hover:text-ptx-medium-green'
                }`}
                data-testid="nav-resources"
              >
                Resources
              </Link>
              <Link
                href="/vendor-resources"
                className={`px-3 py-2  text-sm font-medium transition-colors ${
                  isActive('/vendor-resources')
                    ? 'text-ptx-medium-green bg-ptx-bright-green/10'
                    : 'text-ptx-dark-green hover:text-ptx-medium-green'
                }`}
                data-testid="nav-vendor-resources"
              >
                Vendors
              </Link>
              <a
                href="#contact"
                className="bg-ptx-bright-green text-ptx-white px-4 py-2  text-sm font-medium hover:bg-ptx-medium-green transition-colors"
                data-testid="nav-contact"
              >
                Get Quote
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="bg-ptx-medium-green text-ptx-white p-2 "
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
        <div className="md:hidden border-t" style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          borderColor: 'rgba(255, 255, 255, 0.3)'
        }}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/"
              onClick={handleMobileMenuClick}
              className={`block px-3 py-2  text-base font-medium ${
                isActive('/') 
                  ? 'text-ptx-medium-green bg-ptx-bright-green/10' 
                  : 'text-ptx-dark-green hover:text-ptx-medium-green'
              }`}
              data-testid="mobile-nav-home"
            >
              Home
            </Link>
            <Link 
              href="/products"
              onClick={handleMobileMenuClick}
              className={`block px-3 py-2  text-base font-medium ${
                isActive('/products') 
                  ? 'text-ptx-medium-green bg-ptx-bright-green/10' 
                  : 'text-ptx-dark-green hover:text-ptx-medium-green'
              }`}
              data-testid="mobile-nav-products"
            >
              Products
            </Link>
            
            {/* Mobile Locations */}
            <div className="px-3 py-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Locations</span>
            </div>
            {territories.map((territory) => (
              <Link 
                key={territory.slug}
                href={`/${territory.slug}`}
                onClick={handleMobileMenuClick}
                className="block px-6 py-2 text-base font-medium text-ptx-dark-green hover:text-ptx-medium-green"
                data-testid={`mobile-nav-location-${territory.slug}`}
              >
                {territory.name}
              </Link>
            ))}
            <Link 
              href="/schedule-field-demo"
              onClick={handleMobileMenuClick}
              className="block px-6 py-2 text-base font-medium text-green-700"
              data-testid="mobile-nav-field-demo"
            >
              Schedule Field Demo
            </Link>
            
            <Link 
              href="/resources"
              onClick={handleMobileMenuClick}
              className={`block px-3 py-2  text-base font-medium ${
                isActive('/resources') 
                  ? 'text-ptx-medium-green bg-ptx-bright-green/10' 
                  : 'text-ptx-dark-green hover:text-ptx-medium-green'
              }`}
              data-testid="mobile-nav-resources"
            >
              Resources
            </Link>
            <Link
              href="/vendor-resources"
              onClick={handleMobileMenuClick}
              className={`block px-3 py-2  text-base font-medium ${
                isActive('/vendor-resources')
                  ? 'text-ptx-medium-green bg-ptx-bright-green/10'
                  : 'text-ptx-dark-green hover:text-ptx-medium-green'
              }`}
              data-testid="mobile-nav-vendor-resources"
            >
              Vendors
            </Link>
            <a
              href="#contact"
              onClick={handleMobileMenuClick}
              className="block px-3 py-2  text-base font-medium bg-ptx-bright-green text-ptx-white hover:bg-ptx-medium-green transition-colors"
              data-testid="mobile-nav-contact"
            >
              Get Quote
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
