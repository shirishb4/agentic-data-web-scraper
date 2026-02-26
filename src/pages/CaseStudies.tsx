import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Youtube, Search, MapPin, Zap, Shield, BarChart3, Play, Loader2, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const cases = [
  {
    icon: Youtube,
    title: "YouTube Scraper Agent",
    tag: "Video Intelligence",
    description:
      "Our AI agent autonomously navigates YouTube's dynamic interface to extract video metadata, engagement metrics, comment threads, and channel analytics — handling infinite scroll, consent modals, and anti-bot measures without manual configuration.",
    capabilities: [
      "Video title, description, view count, likes, and publish date",
      "Full comment thread extraction with nested replies",
      "Channel subscriber count and upload frequency analysis",
      "Playlist and recommendation graph mapping",
    ],
    stats: { pages: "50K+", accuracy: "99.2%", speed: "3K pages/hr" },
    webhookAgent: "youtube",
    samplePayload: { url: "https://youtube.com/watch?v=example", extract: ["metadata", "comments"] },
  },
  {
    icon: Search,
    title: "Google Scraper Agent",
    tag: "Search Analytics",
    description:
      "Purpose-built for SERP intelligence — our agent extracts organic results, featured snippets, knowledge panels, People Also Ask blocks, and ad placements across locales and device types.",
    capabilities: [
      "Organic & paid result extraction with position tracking",
      "Featured snippet and knowledge panel parsing",
      "Multi-region and multi-device SERP comparison",
      "Real-time rank tracking with historical trend data",
    ],
    stats: { pages: "120K+", accuracy: "99.5%", speed: "5K queries/hr" },
    webhookAgent: "google",
    samplePayload: { query: "ai web scraping tools", region: "us", device: "desktop" },
  },
  {
    icon: MapPin,
    title: "TripAdvisor Scraper Agent",
    tag: "Travel & Hospitality",
    description:
      "Extracts structured hospitality data from TripAdvisor's complex, review-heavy pages — including ratings, written reviews, pricing signals, and competitive benchmarking data for hotels, restaurants, and attractions.",
    capabilities: [
      "Review aggregation with sentiment scoring",
      "Pricing and availability monitoring across seasons",
      "Competitor benchmarking by region and category",
      "Photo metadata and traveler demographic analysis",
    ],
    stats: { pages: "80K+", accuracy: "98.8%", speed: "2K pages/hr" },
    webhookAgent: "tripadvisor",
    samplePayload: { url: "https://tripadvisor.com/Hotel-example", extract: ["reviews", "pricing"] },
  },
];

type ResponseState = {
  agent: string;
  loading: boolean;
  data: unknown | null;
  error: string | null;
};

const CaseStudies = () => {
  const [responses, setResponses] = useState<Record<string, ResponseState>>({});

  const triggerWebhook = async (agent: string, payload: Record<string, unknown>) => {
    setResponses((prev) => ({
      ...prev,
      [agent]: { agent, loading: true, data: null, error: null },
    }));

    try {
      const { data, error } = await supabase.functions.invoke("scraper-webhook", {
        body: { agent, payload },
      });

      if (error) {
        setResponses((prev) => ({
          ...prev,
          [agent]: { agent, loading: false, data: null, error: error.message },
        }));
        return;
      }

      setResponses((prev) => ({
        ...prev,
        [agent]: { agent, loading: false, data, error: null },
      }));
    } catch (err: unknown) {
      setResponses((prev) => ({
        ...prev,
        [agent]: {
          agent,
          loading: false,
          data: null,
          error: err instanceof Error ? err.message : "Unexpected error",
        },
      }));
    }
  };

  const clearResponse = (agent: string) => {
    setResponses((prev) => {
      const next = { ...prev };
      delete next[agent];
      return next;
    });
  };

  return (
    <>
      <SEOHead
        title="AI Web Scraping Case Studies | YouTube, Google, TripAdvisor"
        description="Explore real-world AI scraping case studies for YouTube, Google SERP, and TripAdvisor data extraction with autonomous agents."
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
              Case <span className="text-gradient-brown">Studies</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Production-grade scraping agents built for the most challenging dynamic platforms.
            </p>
          </motion.div>

          <div className="mx-auto mt-16 max-w-4xl space-y-12">
            {cases.map((c, i) => {
              const res = responses[c.webhookAgent];
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  className="rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:glow-brown"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <c.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-heading text-xl font-semibold text-foreground">{c.title}</h2>
                    </div>
                    <span className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                      {c.tag}
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{c.description}</p>

                  {/* Capabilities */}
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" /> Key Capabilities
                    </h3>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {c.capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Shield className="mt-0.5 h-3 w-3 shrink-0 text-primary/60" />
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 flex flex-wrap gap-6 rounded-lg border border-border bg-secondary/50 p-4">
                    {[
                      { label: "Pages Scraped", value: c.stats.pages, icon: BarChart3 },
                      { label: "Accuracy", value: c.stats.accuracy, icon: Shield },
                      { label: "Throughput", value: c.stats.speed, icon: Zap },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center gap-3">
                        <stat.icon className="h-4 w-4 text-primary/60" />
                        <div>
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                          <p className="font-heading text-sm font-semibold text-foreground">{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Webhook status + Try it */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                      Webhook agent:{" "}
                      <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-primary">
                        {c.webhookAgent}
                      </code>
                      <span className="text-muted-foreground/50">— ready for n8n integration</span>
                    </div>
                    <button
                      onClick={() => triggerWebhook(c.webhookAgent, c.samplePayload)}
                      disabled={res?.loading}
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
                    >
                      {res?.loading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                      {res?.loading ? "Running…" : "Try it"}
                    </button>
                  </div>

                  {/* Response preview */}
                  <AnimatePresence>
                    {res && !res.loading && (res.data || res.error) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 overflow-hidden"
                      >
                        <div
                          className={`relative rounded-lg border p-4 font-mono text-xs ${
                            res.error
                              ? "border-destructive/40 bg-destructive/5 text-destructive"
                              : "border-primary/20 bg-secondary/70 text-foreground"
                          }`}
                        >
                          <button
                            onClick={() => clearResponse(c.webhookAgent)}
                            className="absolute top-2 right-2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {res.error ? "Error" : "Response"}
                          </p>
                          <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-all leading-relaxed">
                            {res.error
                              ? res.error
                              : JSON.stringify(res.data, null, 2)}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CaseStudies;
