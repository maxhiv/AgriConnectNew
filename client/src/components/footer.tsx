import { Phone, Mail } from "lucide-react";
import { Link } from "wouter";

const serviceLinks = [
  { slug: "precision-ag-consulting", label: "Precision Ag Consulting" },
  { slug: "installation-calibration", label: "Installation & Calibration" },
  { slug: "rtk-gnss-setup", label: "RTK/GNSS Setup" },
  { slug: "in-season-support", label: "In-Season Support" },
  { slug: "on-farm-training", label: "On-Farm Training" },
];

export default function Footer() {
  const year = new Date().getFullYear();

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
            <div className="space-y-2">
              <a
                href="tel:+18889821997"
                className="flex items-center gap-2 text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato"
                data-testid="footer-phone"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                (888) 982-1997
              </a>
              <a
                href="mailto:info@vantage-south.com"
                className="flex items-center gap-2 text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato"
                data-testid="footer-email"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                info@vantage-south.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-pilat">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato" data-testid="footer-link-home">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#about" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato" data-testid="footer-link-about">
                  About Us
                </a>
              </li>
              <li>
                <Link href="/products" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato" data-testid="footer-link-products">
                  Products
                </Link>
              </li>
              <li>
                <a href="/#services" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato" data-testid="footer-link-services">
                  Services
                </a>
              </li>
              <li>
                <a href="/#news" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato" data-testid="footer-link-news">
                  News
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato" data-testid="footer-link-contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-pilat">Services</h4>
            <ul className="space-y-2">
              {serviceLinks.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato"
                    data-testid={`footer-service-${service.slug}`}
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 font-pilat">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/resources" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato" data-testid="footer-link-resources">Resource Hub</Link></li>
              <li><Link href="/vendor-resources" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato" data-testid="footer-link-vendor-resources">Vendor Resources</Link></li>
              <li><Link href="/farming-guides" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato" data-testid="footer-link-farming-guides">Farming Guides</Link></li>
              <li><Link href="/weather-updates" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato" data-testid="footer-link-weather-updates">Weather Updates</Link></li>
              <li><Link href="/dealers" className="text-ptx-neutral-green hover:text-ptx-bright-green transition-colors font-lato" data-testid="footer-link-locations">Our Locations</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ptx-medium-green mt-8 pt-8 text-center">
          <p className="text-ptx-neutral-green font-lato">
            © {year} Vantage South. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
