import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Youtube, Search, MapPin, ArrowRight } from "lucide-react";

const studies = [
  {
    icon: Youtube,
    title: "YouTube Scraper",
    desc: "Extract video metadata, comments, and channel analytics at scale with AI-driven navigation.",
    tag: "Video Intelligence",
  },
  {
    icon: Search,
    title: "Google Scraper",
    desc: "Capture SERP results, knowledge panels, and ad placements across regions and devices.",
    tag: "Search Analytics",
  },
  {
    icon: MapPin,
    title: "TripAdvisor Scraper",
    desc: "Aggregate reviews, ratings, and pricing data from hospitality listings worldwide.",
    tag: "Travel & Hospitality",
  },
];

const CaseStudiesPreview = () => (
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
          Case <span className="text-gradient-brown">Studies</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Real-world scraping agents built for high-value, dynamic platforms.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studies.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group rounded-xl border border-border bg-card p-7 transition-all hover:border-primary/40 hover:glow-brown"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                {s.tag}
              </span>
            </div>
            <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-10 text-center"
      >
        <Link
          to="/case-studies"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          View all case studies <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default CaseStudiesPreview;
