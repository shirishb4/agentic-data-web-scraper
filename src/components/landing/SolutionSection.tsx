import { motion } from "framer-motion";
import { Brain, Eye, Navigation, Settings2 } from "lucide-react";

const points = [
  { icon: Eye, title: "Understands Page Structure", desc: "AI agents interpret DOM, layout, and content semantics — no brittle selectors required." },
  { icon: Navigation, title: "Self-Adapting Navigation", desc: "Agents autonomously navigate pagination, modals, infinite scroll, and multi-step flows." },
  { icon: Brain, title: "Context-Aware Extraction", desc: "Leverages NLP to extract, classify, and validate data with human-level understanding." },
  { icon: Settings2, title: "Minimal Manual Intervention", desc: "Set your scraping goals. The agent handles execution, retries, and edge cases automatically." },
];

const SolutionSection = () => (
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
          Autonomous AI Web Scraping — <span className="text-gradient-brown">Built for the Modern Web</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Our AI agents don't just follow rules — they understand, adapt, and extract with intelligence.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {points.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex gap-5 rounded-xl border border-border bg-card p-6"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <p.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionSection;
