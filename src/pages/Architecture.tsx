import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const layers = [
  {
    num: 1,
    title: "Input Layer",
    subtitle: "UI / API",
    desc: "Users define scraping goals through a visual dashboard or programmatic API. Tasks are queued, validated, and dispatched to the orchestration layer.",
  },
  {
    num: 2,
    title: "AI Agent Orchestration Layer",
    subtitle: "Task Planning & Execution",
    desc: "Autonomous agents decompose scraping goals into subtasks, plan navigation strategies, and coordinate execution across multiple browser sessions.",
  },
  {
    num: 3,
    title: "Web Interaction Layer",
    subtitle: "Headless Browsers & Proxies",
    desc: "Managed headless browser pools render JavaScript-heavy pages. Rotating proxies and session management ensure reliable access at scale.",
  },
  {
    num: 4,
    title: "Intelligence Layer",
    subtitle: "ML, NLP & Validation",
    desc: "Machine learning models classify content, extract structured data, and validate output quality. NLP pipelines handle entity recognition and sentiment analysis.",
  },
  {
    num: 5,
    title: "Data Output Layer",
    subtitle: "CSV, JSON, API & Webhooks",
    desc: "Structured data is delivered in your preferred format. Real-time webhooks, scheduled exports, and direct API access ensure seamless integration.",
  },
  {
    num: 6,
    title: "Compliance & Control Layer",
    subtitle: "Logging, Audits & Rate Control",
    desc: "Every action is logged and auditable. Built-in rate limiting, robots.txt compliance, and ethical crawling policies ensure responsible operation.",
  },
];

const Architecture = () => (
  <>
    <SEOHead
      title="AI Agent Web Scraping Architecture | Scalable & Compliant Design"
      description="Explore the technical architecture behind autonomous AI agents for web scraping, data intelligence, and compliance."
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
            Technical <span className="text-gradient-brown">Architecture</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A six-layer architecture engineered for reliability, intelligence, and enterprise-grade compliance.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-3xl space-y-6">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.num}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-xl border border-border bg-card p-8"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 font-heading text-lg font-bold text-primary">
                  {layer.num}
                </span>
                <div>
                  <h2 className="font-heading text-xl font-semibold text-foreground">{layer.title}</h2>
                  <p className="text-sm text-primary">{layer.subtitle}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{layer.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Architecture;
