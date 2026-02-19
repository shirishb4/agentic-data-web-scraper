import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$49",
    period: "/mo",
    desc: "For prototypes and small-scale data extraction projects.",
    features: [
      "Up to 3 AI agents",
      "Static & basic dynamic site support",
      "CSV / JSON export",
      "10,000 pages/month",
      "Community support",
      "Basic scheduling",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Professional",
    price: "$199",
    period: "/mo",
    desc: "For teams scaling their web data operations.",
    features: [
      "Up to 15 AI agents",
      "Full dynamic website scraping",
      "Scheduling & API access",
      "100,000 pages/month",
      "Priority support",
      "Webhooks & integrations",
      "Data validation rules",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large-scale, compliance-first deployments.",
    features: [
      "Unlimited AI agents",
      "Custom compliance rules",
      "SLA & uptime guarantees",
      "Private deployment options",
      "Dedicated account manager",
      "SSO & audit logs",
      "Custom data pipelines",
      "On-premise available",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

const Pricing = () => (
  <>
    <SEOHead
      title="AI Web Scraping Pricing | Scalable Plans for Teams & Enterprises"
      description="Flexible pricing for AI-powered web scraping with autonomous agents. From prototypes to enterprise-scale data extraction."
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
          <h1 className="font-heading text-4xl font-bold text-foreground sm:text-5xl">
            Scalable <span className="text-gradient-brown">Pricing</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Choose the plan that fits your data extraction needs. Scale up as you grow.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-xl border p-8 ${
                tier.featured ? "border-primary/50 bg-card glow-brown" : "border-border bg-card"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <h2 className="font-heading text-xl font-bold text-foreground">{tier.name}</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-foreground">{tier.price}</span>
                <span className="text-sm text-muted-foreground">{tier.period}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{tier.desc}</p>
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-secondary-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold transition-all ${
                  tier.featured
                    ? "bg-primary text-primary-foreground hover:brightness-110"
                    : "border border-border bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Pricing;
