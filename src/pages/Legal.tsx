import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "Respect for robots.txt",
    content: "Our AI agents honor robots.txt directives by default. Websites that restrict crawling are respected. Administrators can configure override policies for authorized scraping under contract.",
  },
  {
    title: "Rate Limiting & Ethical Crawling",
    content: "All scraping operations enforce configurable rate limits to avoid overloading target servers. Our agents distribute requests intelligently and throttle activity when server stress is detected.",
  },
  {
    title: "Data Usage Responsibility",
    content: "Users are responsible for ensuring their use of extracted data complies with applicable laws and regulations. We provide tools and documentation to support responsible data handling.",
  },
  {
    title: "Compliance with Website Terms",
    content: "Our platform provides tooling to help users audit whether their scraping activities align with website terms of service. Enterprise customers receive dedicated compliance review support.",
  },
  {
    title: "No Personal or Restricted Data Scraping",
    content: "Our platform does not target personally identifiable information (PII) or restricted data categories by default. Enterprise policies can be configured to enforce stricter data handling rules.",
  },
  {
    title: "Transparency & Audit Logs",
    content: "Every scraping operation is logged with full traceability — including URLs accessed, data extracted, and timestamps. Audit logs are available for compliance review and regulatory inquiries.",
  },
];

const Legal = () => (
  <>
    <SEOHead
      title="Legal & Compliance | Responsible AI Web Scraping Platform"
      description="Understand our ethical, legal, and compliance-first approach to AI-powered web scraping."
    />
    <Navbar />
    <main className="pt-24 pb-16">
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Responsible & Compliant{" "}
            <span className="text-gradient-brown">AI Web Scraping</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            We take a compliance-first approach to web data extraction, ensuring ethical, transparent, and regulation-aware operations.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-3xl space-y-6">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-xl border border-border bg-card p-8"
            >
              <h2 className="font-heading text-lg font-semibold text-foreground">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.content}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Legal;
