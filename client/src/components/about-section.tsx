import { CheckCircle } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-ptx-neutral-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="heading-2 text-3xl md:text-4xl font-pilat font-bold text-ptx-dark-green mb-6">
              Leading Precision Agriculture in the South
            </h2>
            <p className="text-ptx-dark-green text-lg mb-6 font-lato">
              At Vantage South, precision agriculture isn't just a department—it's our passion and our purpose. Established in September 2016 through the unification of two industry leaders, Ag Management Solutions of Alabama and Smith Tech of Mississippi, we've become the premier precision agriculture company serving the Southeastern United States.
            </p>
            <p className="text-ptx-dark-green text-lg mb-6 font-lato">
              Unlike many businesses that treat precision ag as a side offering, at Vantage South, it's at the very heart of what we do. Our mission is straightforward yet powerful: to empower our customers to achieve more with less by providing the tools, insights, and data necessary to make informed decisions.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="text-ptx-bright-green text-xl mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-ptx-dark-green font-pilat">Quality</h4>
                  <p className="text-ptx-dark-green font-lato">We are committed to providing the highest quality products, services, and support to ensure our customers' success.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-ptx-bright-green text-xl mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-ptx-dark-green font-pilat">Partnership</h4>
                  <p className="text-ptx-dark-green font-lato">We believe in building long-term relationships with our customers, working together as partners in their success.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-ptx-bright-green text-xl mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-ptx-dark-green font-pilat">Sustainability</h4>
                  <p className="text-ptx-dark-green font-lato">We are dedicated to promoting sustainable farming practices that conserve resources for future generations.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            {/* Statistics */}
            <div className="text-center">
              <div className="bg-ptx-white rounded-lg shadow-lg p-8">
                <div className="text-6xl font-pilat font-bold text-ptx-bright-orange mb-2">20+</div>
                <div className="text-lg font-pilat text-ptx-dark-green font-semibold">Years of Excellence</div>
              </div>
            </div>
            
            {/* Mission Statement */}
            <div className="card-ptx p-6">
              <h3 className="eyebrow text-xl font-pilat-wide font-bold text-ptx-medium-green mb-3">OUR MISSION</h3>
              <p className="text-ptx-dark-green font-lato">
                To empower farmers with innovative precision agriculture solutions that increase productivity, profitability, and sustainability.
              </p>
            </div>
            
            {/* Images */}
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Precision agriculture technology" 
                className="rounded-lg shadow-lg w-full h-32 object-cover"
                data-testid="img-precision-agriculture"
              />
              <img 
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Modern farm technology" 
                className="rounded-lg shadow-lg w-full h-32 object-cover"
                data-testid="img-modern-farm-tech"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
