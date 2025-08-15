export default function HeroSection() {
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
    <section id="home" className="relative h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Cultivating Tomorrow's
          <span className="text-agri-accent"> Harvest</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Leading agricultural solutions provider dedicated to sustainable farming, innovative technology, and exceptional crop yields.
        </p>
        <div className="space-x-4">
          <button 
            className="bg-agri-accent hover:bg-agri-secondary text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
            onClick={() => scrollToSection('about')}
            data-testid="button-learn-more"
          >
            Learn More
          </button>
          <button 
            className="border-2 border-white text-white hover:bg-white hover:text-agri-primary px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
            onClick={() => scrollToSection('contact')}
            data-testid="button-get-quote"
          >
            Get Quote
          </button>
        </div>
      </div>
    </section>
  );
}
