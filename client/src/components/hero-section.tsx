import { Link } from "wouter";
import planterImage from "@assets/MF23PV001DS-8S-with-MFVF-16-30-Planter-PLNT0281.jpg";

export default function HeroSection() {

  return (
    <section id="home" className="relative h-screen flex items-center justify-center">
      {/* Background Image */}
      <img 
        src={planterImage}
        alt="Precision Agriculture Equipment"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <img 
            src="/assets/images/vantage-south-logo.png" 
            alt="Vantage South" 
            className="h-16 md:h-20 w-auto mx-auto mb-6 filter brightness-0 invert"
          />
        </div>
        <h1 className="heading-1 text-4xl md:text-6xl font-pilat font-bold mb-6 text-ptx-white">
          Premier Agricultural Solutions
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-ptx-white font-lato">
          Leading technology and expertise for modern farming operations
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/products"
            className="btn-ptx-primary px-8 py-3 font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 inline-block text-center"
            data-testid="button-explore-products"
          >
            Explore Products
          </Link>
          <a 
            href="#contact"
            className="btn-ptx-outline border-2 border-ptx-white text-ptx-white hover:bg-ptx-white hover:text-ptx-dark-green px-8 py-3 font-semibold transition-all duration-300 inline-block text-center"
            data-testid="button-request-quote"
          >
            Request a Quote
          </a>
        </div>
      </div>
    </section>
  );
}