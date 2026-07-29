import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useSEO } from "@/lib/seo";

const EFFECTIVE_DATE = "July 29, 2026";

export default function PrivacyPolicy() {
  useSEO({
    path: "/privacy-policy",
    customTitle: "Privacy Policy | Vantage South",
    customDescription: "Vantage South's privacy policy: what information we collect, how we use it, and your rights regarding your personal data.",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-green-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-green-100">Effective {EFFECTIVE_DATE}</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-1 [&_a]:text-primary [&_a]:underline">
            <p>
              Vantage South ("Vantage South," "we," "us," or "our") respects your privacy. This
              policy explains what information we collect through vantage-south.com (the "Site"),
              how we use it, and the choices you have.
            </p>

            <h2>Information We Collect</h2>
            <h3>Information you provide directly</h3>
            <p>
              When you submit a quote request, contact form, or field demo request, we collect the
              information you provide, which may include your name, email address, phone number,
              farm or business name, and details about the equipment or service you're interested
              in. These forms are processed through Zoho Forms/CRM, a third-party service provider
              we use to manage customer inquiries.
            </p>
            <h3>Information collected automatically</h3>
            <p>
              Like most websites, we use Google Analytics to understand how visitors use the Site —
              pages viewed, time on site, general location (city/region level), and referring
              source. Google Analytics uses cookies and similar technologies to collect this
              information. We do not use this data to identify you personally.
            </p>

            <h2>How We Use Your Information</h2>
            <ul>
              <li>To respond to quote requests, service inquiries, and field demo scheduling</li>
              <li>To connect you with the appropriate Vantage South location or team member</li>
              <li>To send you information you've requested about products, services, or promotions</li>
              <li>To understand and improve how visitors use our Site</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p>We do not sell your personal information.</p>

            <h2>How We Share Information</h2>
            <p>We share information only in the following circumstances:</p>
            <ul>
              <li>
                <strong>Service providers</strong> who help us operate the Site and process
                inquiries, including Zoho (form/CRM processing), Google Analytics (site analytics),
                and Cloudflare (hosting and content delivery)
              </li>
              <li>
                <strong>Equipment manufacturers and vendors</strong> (such as Precision Planting,
                PTx Trimble, and Ag Leader) when necessary to fulfill a quote request, warranty
                matter, or product-specific inquiry you've submitted
              </li>
              <li><strong>Legal requirements</strong>, if required to comply with law, legal process, or to protect our rights</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              We use cookies placed by Google Analytics to understand Site traffic. You can control
              or disable cookies through your browser settings. Disabling cookies may affect some
              Site functionality but will not prevent you from browsing our products and resources
              or submitting a quote request.
            </p>

            <h2>Data Retention</h2>
            <p>
              We retain contact and inquiry information for as long as needed to respond to your
              request and maintain our business relationship with you, or as required by law.
            </p>

            <h2>Your Rights and Choices</h2>
            <p>
              You may ask us to access, correct, or delete the personal information we hold about
              you by contacting us using the information below. Depending on your state of
              residence, you may have additional rights under applicable state privacy law.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              The Site is intended for business use by adults in the agricultural industry and is
              not directed to children under 13. We do not knowingly collect information from
              children.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Changes will be posted on this page with
              an updated effective date.
            </p>

            <h2>Contact Us</h2>
            <p>
              Questions about this policy or your information? Contact us at{" "}
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
