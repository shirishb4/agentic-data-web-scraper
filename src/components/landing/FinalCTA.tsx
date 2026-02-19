import { motion } from "framer-motion";

const FinalCTA = () => (
  <section id="demo" className="py-32">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
          Turn the Web into an{" "}
          <span className="text-gradient-brown">Intelligent Data Source</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
          Start extracting structured, actionable data from any website — powered by autonomous AI agents.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="mailto:sales@agentscrape.ai"
            className="rounded-lg bg-primary px-8 py-3.5 font-heading text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 glow-brown"
          >
            Contact Sales
          </a>
          <a
            href="mailto:beta@agentscrape.ai"
            className="rounded-lg border border-border bg-secondary px-8 py-3.5 font-heading text-sm font-semibold text-secondary-foreground transition-all hover:bg-muted"
          >
            Join Beta
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
