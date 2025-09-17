import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ServicesSection from "@/components/services-section";
import ProductsSection from "@/components/products-section";
import NewsSection from "@/components/news-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="font-lato bg-white">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProductsSection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
