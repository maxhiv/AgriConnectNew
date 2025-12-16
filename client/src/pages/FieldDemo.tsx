import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useSEO, generateServiceSchema, generateBreadcrumbSchema, JsonLd } from "@/lib/seo";
import targetLocations from "@shared/targetLocations.json";
import { Calendar, MapPin, Tractor, CheckCircle2, ChevronRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const fieldDemoSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  farmName: z.string().optional(),
  county: z.string().min(1, "Please select your county"),
  state: z.string().min(1, "Please select your state"),
  crops: z.string().min(1, "Please select your primary crops"),
  interests: z.string().min(1, "Please select your interests"),
  equipmentBrand: z.string().optional(),
  message: z.string().optional(),
  preferredTiming: z.string().optional()
});

type FieldDemoForm = z.infer<typeof fieldDemoSchema>;

const interests = [
  "RTK/GNSS Guidance",
  "Planter Technology (vDrive, DeltaForce)",
  "Steering Systems (Autosteer)",
  "Displays & Monitors",
  "Application Control",
  "Data Management",
  "Full System Integration"
];

const crops = ["Cotton", "Corn", "Soybeans", "Peanuts", "Wheat", "Rice", "Hay", "Multiple Crops"];

const states = [
  { value: "alabama", label: "Alabama" },
  { value: "mississippi", label: "Mississippi" },
  { value: "florida", label: "Northwest Florida" },
  { value: "tennessee", label: "Central Tennessee" }
];

export default function FieldDemo() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const path = "/schedule-field-demo";
  useSEO({ path });

  const schemas = [
    generateServiceSchema({
      name: "Schedule a Field Demo",
      description: "Schedule a free precision agriculture field demonstration. See RTK guidance, planter technology, and steering systems working on your farm.",
      url: path
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Schedule Field Demo", url: path }
    ])
  ];

  const form = useForm<FieldDemoForm>({
    resolver: zodResolver(fieldDemoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      farmName: "",
      county: "",
      state: "",
      crops: "",
      interests: "",
      equipmentBrand: "",
      message: "",
      preferredTiming: ""
    }
  });

  const selectedState = form.watch("state");
  const stateCounties = selectedState 
    ? targetLocations.territories.find(t => t.id === selectedState)?.tier1Counties.map(c => c.county) || []
    : [];

  const mutation = useMutation({
    mutationFn: async (data: FieldDemoForm) => {
      const response = await apiRequest("POST", "/api/contact", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.farmName || "",
        message: `FIELD DEMO REQUEST\n\nState: ${data.state}\nCounty: ${data.county}\nCrops: ${data.crops}\nInterests: ${data.interests}\nEquipment Brand: ${data.equipmentBrand || 'Not specified'}\nPreferred Timing: ${data.preferredTiming || 'Not specified'}\n\nAdditional Message:\n${data.message || 'None'}`
      });
      return response;
    },
    onSuccess: () => {
      setSubmitted(true);
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: 'field_demo_submission',
          form_type: 'field_demo'
        });
      }
      toast({
        title: "Demo Request Submitted",
        description: "We'll contact you within 1 business day to schedule your field demo."
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or call us directly.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: FieldDemoForm) => {
    mutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navigation />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center max-w-lg mx-auto px-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Demo Request Received!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in a field demonstration. One of our precision agriculture specialists 
              will contact you within 1 business day to schedule your demo.
            </p>
            <div className="space-y-4">
              <Link href="/products">
                <Button className="bg-green-600 hover:bg-green-700 rounded-none w-full" data-testid="button-browse-products">
                  Browse Products While You Wait
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="rounded-none w-full" data-testid="button-return-home">
                  Return Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />
      <JsonLd data={schemas} />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-green-800 to-green-900 text-white py-12">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-2 text-green-200 text-sm mb-6" data-testid="breadcrumb-demo">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">Schedule Field Demo</span>
            </nav>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-10 w-10 text-green-300" />
              <h1 className="text-4xl md:text-5xl font-bold" data-testid="text-demo-title">Schedule a Field Demo</h1>
            </div>
            <p className="text-xl text-green-100 max-w-2xl">
              See precision agriculture technology working on your equipment, in your fields, before you buy.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="rounded-none">
                  <CardHeader>
                    <CardTitle>Request Your Free Demo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Name *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="John Smith" className="rounded-none" data-testid="input-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="farmName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Farm Name</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Smith Farms" className="rounded-none" data-testid="input-farm-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" placeholder="john@smithfarms.com" className="rounded-none" data-testid="input-email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone *</FormLabel>
                                <FormControl>
                                  <Input {...field} type="tel" placeholder="(334) 555-1234" className="rounded-none" data-testid="input-phone" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-none" data-testid="select-state">
                                      <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {states.map(state => (
                                      <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="county"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>County *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedState}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-none" data-testid="select-county">
                                      <SelectValue placeholder={selectedState ? "Select county" : "Select state first"} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {stateCounties.map(county => (
                                      <SelectItem key={county} value={county}>{county}</SelectItem>
                                    ))}
                                    <SelectItem value="other">Other County</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="crops"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Crops *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-none" data-testid="select-crops">
                                      <SelectValue placeholder="Select crops" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {crops.map(crop => (
                                      <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="interests"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Interest *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-none" data-testid="select-interests">
                                      <SelectValue placeholder="What interests you most?" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {interests.map(interest => (
                                      <SelectItem key={interest} value={interest}>{interest}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="equipmentBrand"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Current Equipment Brand</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="John Deere, Case IH, etc." className="rounded-none" data-testid="input-equipment" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="preferredTiming"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Timing</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-none" data-testid="select-timing">
                                      <SelectValue placeholder="When works best?" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="asap">As soon as possible</SelectItem>
                                    <SelectItem value="pre-plant">Before planting season</SelectItem>
                                    <SelectItem value="off-season">During off-season</SelectItem>
                                    <SelectItem value="flexible">Flexible</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Information</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Tell us about your operation, current challenges, or specific questions..."
                                  className="rounded-none min-h-[100px]"
                                  data-testid="textarea-message"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button 
                          type="submit" 
                          size="lg"
                          className="w-full bg-green-600 hover:bg-green-700 rounded-none"
                          disabled={mutation.isPending}
                          data-testid="button-submit-demo"
                        >
                          {mutation.isPending ? "Submitting..." : "Request Field Demo"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="rounded-none bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tractor className="h-5 w-5 text-green-600" />
                      What to Expect
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-sm">See technology on your equipment</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-sm">No obligation demonstration</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-sm">Expert technician at your farm</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-sm">Hands-on experience</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-green-600" />
                      Prefer to Call?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Speak directly with a precision agriculture specialist about scheduling your demo.
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full rounded-none border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).dataLayer) {
                          (window as any).dataLayer.push({
                            event: 'call_click',
                            call_type: 'field_demo'
                          });
                        }
                      }}
                      data-testid="button-call-now"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </CardContent>
                </Card>

                <Card className="rounded-none">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Areas We Serve
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {targetLocations.territories.map(territory => (
                      <Link key={territory.id} href={`/${territory.slug}`}>
                        <div className="text-sm text-green-600 hover:text-green-800 cursor-pointer">
                          {territory.name}
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
