import { motion } from "framer-motion";
import { AlertTriangle, Code2, Shield, Wrench } from "lucide-react";

const problems = [
  {
    icon: Wrench,
    title: "Fragile Rule-Based Scrapers",
    desc: "Traditional scrapers break with every minor website update, requiring constant maintenance and manual fixes.",
  },
  {
    icon: Code2,
    title: "Dynamic JavaScript-Heavy Sites",
    desc: "Single-page applications and client-rendered content make conventional scraping tools ineffective.",
  },
  {
    icon: Shield,
    title: "Advanced Anti-Bot Defenses",
    desc: "CAPTCHAs, rate limiting, and fingerprinting defeat static crawlers and cost engineering hours.",
  },
  {
    icon: AlertTriangle,
    title: "Unsustainable Maintenance Costs",
    desc: "Teams spend more time fixing scrapers than analyzing data. The ROI diminishes at scale.",
  },
];

const ProblemSection = () => (
  <section className="relative py-24 bg-radial-brown">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Why Traditional Web Scraping <span className="text-gradient-brown">Breaks at Scale</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Rule-based scrapers were built for a static web. Today's dynamic, defended websites demand an intelligent approach.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {problems.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
          >
            <p.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
