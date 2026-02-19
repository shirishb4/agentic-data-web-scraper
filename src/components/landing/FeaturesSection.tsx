import { motion } from "framer-motion";
import { Bot, Globe, Database, Server, ShieldCheck } from "lucide-react";

const features = [
  { icon: Bot, title: "AI Agent-Based Web Scraping", desc: "Autonomous agents that learn, adapt, and scrape without hardcoded rules or selectors." },
  { icon: Globe, title: "Dynamic Website Scraping", desc: "Full support for JavaScript-rendered pages, SPAs, and complex client-side interactions." },
  { icon: Database, title: "Intelligent Data Extraction & Validation", desc: "Structured output with schema enforcement, deduplication, and quality scoring." },
  { icon: Server, title: "Scalable Crawling Infrastructure", desc: "Distributed architecture that scales from hundreds to millions of pages per day." },
  { icon: ShieldCheck, title: "Compliance-Aware Automation", desc: "Built-in respect for robots.txt, rate limits, and ethical crawling standards." },
];

const FeaturesSection = () => (
  <section className="py-24 bg-radial-brown">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Platform <span className="text-gradient-brown">Features</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Every component is purpose-built for intelligent, scalable web data extraction.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="group rounded-xl border border-border bg-card p-7 transition-all hover:border-primary/40 hover:glow-brown"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
