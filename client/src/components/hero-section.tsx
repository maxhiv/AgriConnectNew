import { Link } from "wouter";
import planterVideo from "@assets/Three Point Mounted Planters - Reel_1756908609049.mp4";

export default function HeroSection() {

  return (
    <section id="home" className="relative h-screen flex items-center justify-center">
      {/* Background Video */}
      <video 
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={planterVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <span className="inline-block bg-ptx-bright-green/20 text-ptx-bright-green px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide">
            Retrofit · Optimize · Support
          </span>
        </div>
        <h1 className="heading-1 text-4xl md:text-6xl font-pilat font-bold mb-6 text-ptx-white">
          Upgrade the equipment
          <span className="text-ptx-bright-green"> you already own</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-ptx-white font-lato">
          We design upgrade plans that improve singulation, depth, downforce, and application—installed and supported by local experts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/products"
            className="btn-ptx-primary px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 inline-block text-center"
            data-testid="button-explore-products"
          >
            Explore Products
          </Link>
          <a 
            href="#contact"
            className="btn-ptx-outline border-2 border-ptx-white text-ptx-white hover:bg-ptx-white hover:text-ptx-dark-green px-8 py-3 rounded-lg font-semibold transition-all duration-300 inline-block text-center"
            data-testid="button-request-quote"
          >
            Request a Quote
          </a>
        </div>
      </div>
    </section>
  );
}
