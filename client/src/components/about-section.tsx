import { CheckCircle } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-ptx-neutral-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="heading-2 text-3xl md:text-4xl font-pilat font-bold text-ptx-dark-green mb-6">
              Growing Excellence Since 1985
            </h2>
            <p className="text-ptx-dark-green text-lg mb-6 font-lato">
              For over three decades, GreenHarvest has been at the forefront of agricultural innovation, helping farmers maximize their yields while maintaining sustainable practices. Our commitment to excellence and environmental stewardship has made us a trusted partner for agricultural communities worldwide.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="text-ptx-bright-green text-xl mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-ptx-dark-green font-pilat">Sustainable Practices</h4>
                  <p className="text-ptx-dark-green font-lato">Environmentally responsible farming solutions that protect our planet for future generations.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-ptx-bright-green text-xl mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-ptx-dark-green font-pilat">Advanced Technology</h4>
                  <p className="text-ptx-dark-green font-lato">Cutting-edge equipment and precision agriculture techniques for optimal crop management.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-ptx-bright-green text-xl mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-ptx-dark-green font-pilat">Expert Support</h4>
                  <p className="text-ptx-dark-green font-lato">Dedicated agricultural specialists providing guidance and support throughout your farming journey.</p>
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
