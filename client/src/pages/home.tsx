import { useEffect } from "react";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ServicesSection from "@/components/services-section";
import NewsSection from "@/components/news-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 64;
      const top = element.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return (
    <div className="font-lato bg-white">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
