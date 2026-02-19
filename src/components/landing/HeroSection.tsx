import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
    {/* Background image */}
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
    </div>

    <div className="container relative z-10 mx-auto px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="mx-auto mb-6 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
          Autonomous AI Agents for Web Data
        </div>
        <h1 className="mx-auto max-w-4xl font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          AI-Powered Web Scraping with{" "}
          <span className="text-gradient-brown">Autonomous AI Agents</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Extract, monitor, and transform web data using intelligent AI agents built for dynamic websites and enterprise scale.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#demo"
            className="rounded-lg bg-primary px-8 py-3.5 font-heading text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 glow-brown"
          >
            Request Demo
          </a>
          <Link
            to="/architecture"
            className="rounded-lg border border-border bg-secondary px-8 py-3.5 font-heading text-sm font-semibold text-secondary-foreground transition-all hover:bg-muted"
          >
            View Architecture
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
