import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, Wrench, HeadphonesIcon } from "lucide-react";

interface FieldDemoCTAProps {
  variant?: "default" | "compact" | "full";
  location?: string;
}

export function FieldDemoCTA({ variant = "default", location }: FieldDemoCTAProps) {
  const locationText = location ? ` in ${location}` : "";

  if (variant === "compact") {
    return (
      <div className="bg-green-50 border border-green-200 p-4 rounded-none" data-testid="cta-field-demo-compact">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-900">See precision ag in action{locationText}</span>
          </div>
          <Link href="/schedule-field-demo">
            <Button className="bg-green-600 hover:bg-green-700 rounded-none" data-testid="button-schedule-demo-compact">
              Schedule Field Demo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className="bg-gradient-to-r from-green-800 to-green-700 text-white p-8 rounded-none" data-testid="cta-field-demo-full">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Ready to See Results{locationText}?</h3>
          <p className="text-green-100 mb-6 text-lg">
            Schedule a free field demonstration and see how precision agriculture technology can reduce input costs, 
            eliminate overlaps, and improve your bottom line.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/schedule-field-demo">
              <Button size="lg" className="w-full bg-white text-green-800 hover:bg-green-50 rounded-none" data-testid="button-schedule-demo-full">
                <Calendar className="mr-2 h-5 w-5" />
                Field Demo
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-green-600 rounded-none" data-testid="button-call-cta">
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </Button>
            <Link href="/services/installation-calibration">
              <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-green-600 rounded-none" data-testid="button-install-quote">
                <Wrench className="mr-2 h-5 w-5" />
                Install Quote
              </Button>
            </Link>
            <Link href="/services/in-season-support">
              <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-green-600 rounded-none" data-testid="button-seasonal-support">
                <HeadphonesIcon className="mr-2 h-5 w-5" />
                Seasonal Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-green-600 p-6 rounded-none shadow-sm" data-testid="cta-field-demo-default">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xl font-bold text-green-900 mb-2">Schedule a Field Demo{locationText}</h4>
          <p className="text-gray-600">
            See RTK guidance, planter technology, and steering systems working on your farm before you buy.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/schedule-field-demo">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 rounded-none" data-testid="button-schedule-demo-default">
              <Calendar className="mr-2 h-5 w-5" />
              Schedule Demo
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 rounded-none" data-testid="button-rtk-consult">
            RTK Consult
          </Button>
        </div>
      </div>
    </div>
  );
}
