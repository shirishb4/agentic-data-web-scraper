import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$49",
    period: "/mo",
    desc: "For prototypes and small-scale projects.",
    features: ["Limited AI agents", "Static & basic dynamic sites", "CSV / JSON export", "Community support"],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Professional",
    price: "$199",
    period: "/mo",
    desc: "For teams scaling their data extraction.",
    features: ["Multiple AI agents", "Dynamic website scraping", "Scheduling & API access", "Priority support"],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large-scale, compliance-first deployments.",
    features: ["Unlimited agents", "Custom compliance rules", "SLA & private deployment", "Dedicated account manager"],
    cta: "Contact Sales",
    featured: false,
  },
];

const PricingPreview = () => (
  <section className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Simple, Scalable <span className="text-gradient-brown">Pricing</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          From prototypes to enterprise-scale data extraction.
        </p>
      </motion.div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-3">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`relative rounded-xl border p-8 ${
              tier.featured
                ? "border-primary/50 bg-card glow-brown"
                : "border-border bg-card"
            }`}
          >
            {tier.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
                Most Popular
              </div>
            )}
            <h3 className="font-heading text-xl font-bold text-foreground">{tier.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-heading text-4xl font-bold text-foreground">{tier.price}</span>
              <span className="text-sm text-muted-foreground">{tier.period}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{tier.desc}</p>
            <ul className="mt-6 space-y-3">
              {tier.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-secondary-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/pricing"
              className={`mt-8 block rounded-lg py-3 text-center text-sm font-semibold transition-all ${
                tier.featured
                  ? "bg-primary text-primary-foreground hover:brightness-110"
                  : "border border-border bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {tier.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingPreview;
