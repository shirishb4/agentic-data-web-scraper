import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const layers = [
  { label: "Input Layer", desc: "UI / API" },
  { label: "AI Agent Orchestration", desc: "Task planning & execution" },
  { label: "Web Interaction", desc: "Headless browsers & proxies" },
  { label: "Intelligence Layer", desc: "ML, NLP, validation" },
  { label: "Data Output", desc: "CSV, JSON, API" },
  { label: "Compliance & Control", desc: "Logging & audits" },
];

const ArchitecturePreview = () => (
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
          <span className="text-gradient-brown">Architecture</span> Overview
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          A six-layer architecture designed for reliability, intelligence, and compliance.
        </p>
      </motion.div>

      <div className="mx-auto mt-16 max-w-2xl space-y-3">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-6 py-4"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 font-heading text-sm font-bold text-primary">
                {i + 1}
              </span>
              <span className="font-heading font-semibold text-foreground">{layer.label}</span>
            </div>
            <span className="text-sm text-muted-foreground">{layer.desc}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/architecture"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          Explore Full Architecture <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default ArchitecturePreview;
