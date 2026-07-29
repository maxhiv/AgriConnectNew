import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useSEO } from "@/lib/seo";

const EFFECTIVE_DATE = "July 29, 2026";

export default function TermsOfService() {
  useSEO({
    path: "/terms-of-service",
    customTitle: "Terms of Service | Vantage South",
    customDescription: "Terms and conditions governing your use of the Vantage South website.",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-green-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-green-100">Effective {EFFECTIVE_DATE}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-1 [&_a]:text-primary [&_a]:underline">
            <p>
              These Terms of Service ("Terms") govern your use of vantage-south.com (the "Site"),
              operated by Vantage South. By using the Site, you agree to these Terms. If you do not
              agree, please do not use the Site.
            </p>

            <h2>Use of the Site</h2>
            <p>
              The Site is provided to help you learn about Vantage South's precision agriculture
              equipment, services, and locations, and to request quotes, service, or field demos.
              You agree to use the Site only for lawful purposes and not to interfere with its
              operation or attempt to access it through unauthorized means.
            </p>

            <h2>Product and Pricing Information</h2>
            <p>
              Product descriptions, specifications, and images on the Site — including those for
              equipment from Precision Planting, PTx Trimble, Ag Leader, and other manufacturers we
              represent — are provided for informational purposes and are subject to change without
              notice. We make reasonable efforts to keep this information accurate but do not
              guarantee that all specifications, availability, or details are current or error-free.
              The Site does not display final pricing; pricing is provided upon request through our
              quote process and is subject to confirmation by a Vantage South representative.
            </p>

            <h2>Quote and Contact Requests</h2>
            <p>
              Submitting a quote, contact, or field demo request through the Site does not create a
              binding agreement between you and Vantage South. Any sale, service agreement, or
              other transaction is subject to separate terms agreed to directly with a Vantage South
              representative.
            </p>

            <h2>Third-Party Links and Content</h2>
            <p>
              The Site links to and references content from equipment manufacturers and other
              third parties, including product manuals, research, and marketing materials. We do
              not control and are not responsible for the content, accuracy, or availability of
              third-party websites or materials. Trademarks, logos, and product names belonging to
              Precision Planting, PTx Trimble, Ag Leader, and other manufacturers are the property
              of their respective owners.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              The Site's original content, layout, and design are owned by Vantage South and
              protected by applicable intellectual property laws. You may not reproduce,
              distribute, or create derivative works from the Site's original content without our
              permission.
            </p>

            <h2>Disclaimer of Warranties</h2>
            <p>
              The Site is provided "as is" without warranties of any kind, express or implied. We do
              not warrant that the Site will be uninterrupted, error-free, or secure. Nothing on
              this Site constitutes agronomic, engineering, or professional advice specific to your
              operation.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Vantage South is not liable for any indirect,
              incidental, or consequential damages arising from your use of, or inability to use,
              the Site.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Alabama, without regard to its
              conflict of law principles.
            </p>

            <h2>Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Changes will be posted on this page with
              an updated effective date. Continued use of the Site after changes are posted
              constitutes acceptance of the updated Terms.
            </p>

            <h2>Contact Us</h2>
            <p>
              Questions about these Terms? Contact us at{" "}
              <a href="mailto:info@vantage-south.com">info@vantage-south.com</a> or{" "}
              <a href="tel:+18889821997">(888) 982-1997</a>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
