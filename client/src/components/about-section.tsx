import { CheckCircle } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-agri-primary mb-6">
              Growing Excellence Since 1985
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              For over three decades, GreenHarvest has been at the forefront of agricultural innovation, helping farmers maximize their yields while maintaining sustainable practices. Our commitment to excellence and environmental stewardship has made us a trusted partner for agricultural communities worldwide.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="text-agri-accent text-xl mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-agri-primary">Sustainable Practices</h4>
                  <p className="text-gray-600">Environmentally responsible farming solutions that protect our planet for future generations.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-agri-accent text-xl mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-agri-primary">Advanced Technology</h4>
                  <p className="text-gray-600">Cutting-edge equipment and precision agriculture techniques for optimal crop management.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-agri-accent text-xl mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-agri-primary">Expert Support</h4>
                  <p className="text-gray-600">Dedicated agricultural specialists providing guidance and support throughout your farming journey.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Farmer examining crops" 
              className="rounded-lg shadow-lg w-full h-48 object-cover"
              data-testid="img-farmer-examining"
            />
            <img 
              src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Modern farm tractor" 
              className="rounded-lg shadow-lg w-full h-48 object-cover mt-8"
              data-testid="img-modern-tractor"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
