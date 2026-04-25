import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Youtube, Search, MapPin, Zap, Shield, BarChart3, Play, Loader2, X, Download } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    inputLabel: "YouTube video URL or channel",
    inputPlaceholder: "https://youtube.com/watch?v=...",
    inputField: "url",
    samplePayload: { extract: ["metadata", "comments"] },
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
    inputLabel: "Search query",
    inputPlaceholder: "ai web scraping tools",
    inputField: "query",
    samplePayload: { region: "us", device: "desktop" },
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
    inputLabel: "TripAdvisor listing URL",
    inputPlaceholder: "https://tripadvisor.com/Hotel-...",
    inputField: "url",
    samplePayload: { extract: ["reviews", "pricing"] },
  },
];

type ResponseState = {
  agent: string;
  loading: boolean;
  data: unknown | null;
  error: string | null;
};

type VideoRow = {
  videoTitle?: string;
  link?: string;
  views?: string | number;
  likes?: string | number;
  comments?: string | number;
  channelName?: string;
  channelUrl?: string;
  subscribers?: string | number;
};

const pick = (obj: Record<string, unknown>, keys: string[]): unknown => {
  for (const k of keys) {
    const lk = k.toLowerCase();
    for (const objKey of Object.keys(obj)) {
      if (objKey.toLowerCase().replace(/[\s_-]/g, "") === lk.replace(/[\s_-]/g, "")) {
        return obj[objKey];
      }
    }
  }
  return undefined;
};

const toRow = (item: unknown): VideoRow | null => {
  if (!item || typeof item !== "object") return null;
  const o = item as Record<string, unknown>;
  const row: VideoRow = {
    videoTitle: pick(o, ["videoTitle", "title", "video_title", "name"]) as string | undefined,
    link: pick(o, ["link", "url", "videoUrl", "video_url", "videoLink"]) as string | undefined,
    views: pick(o, ["views", "viewCount", "view_count"]) as string | number | undefined,
    likes: pick(o, ["likes", "likeCount", "like_count"]) as string | number | undefined,
    comments: pick(o, ["comments", "commentCount", "commentsCount", "comment_count"]) as
      | string
      | number
      | undefined,
    channelName: pick(o, ["channelName", "channel", "channel_name", "author"]) as string | undefined,
    channelUrl: pick(o, ["channelUrl", "channel_url", "channelLink", "authorUrl"]) as
      | string
      | undefined,
    subscribers: pick(o, ["subscribers", "subscriberCount", "subscriber_count", "subs"]) as
      | string
      | number
      | undefined,
  };
  const hasAny = Object.values(row).some((v) => v !== undefined && v !== null && v !== "");
  return hasAny ? row : null;
};

const extractRows = (data: unknown): VideoRow[] => {
  if (data === null || data === undefined) return [];

  // String — try JSON parse, else try to find JSON inside markdown/code fences
  if (typeof data === "string") {
    const trimmed = data.trim();
    try {
      return extractRows(JSON.parse(trimmed));
    } catch {
      // try to extract a JSON block
      const match = trimmed.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (match) {
        try {
          return extractRows(JSON.parse(match[0]));
        } catch {
          /* fall through */
        }
      }
      return [];
    }
  }

  if (Array.isArray(data)) {
    const rows = data.map(toRow).filter(Boolean) as VideoRow[];
    if (rows.length) return rows;
    // maybe array of wrapped items
    return data.flatMap(extractRows);
  }

  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    // common n8n chat output shapes
    if ("output" in o) return extractRows(o.output);
    if ("data" in o) return extractRows(o.data);
    if ("results" in o) return extractRows(o.results);
    if ("videos" in o) return extractRows(o.videos);
    if ("items" in o) return extractRows(o.items);
    const single = toRow(o);
    return single ? [single] : [];
  }

  return [];
};

const formatNum = (v: unknown): string => {
  if (v === undefined || v === null || v === "") return "—";
  if (typeof v === "number") return v.toLocaleString();
  const s = String(v).trim();
  const n = Number(s.replace(/,/g, ""));
  return Number.isFinite(n) && /^[\d,.]+$/.test(s) ? n.toLocaleString() : s;
};

const csvEscape = (v: unknown): string => {
  if (v === undefined || v === null) return "";
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const downloadCsv = (agent: string, rows: VideoRow[]) => {
  const headers = [
    "Video Title",
    "Link",
    "Views",
    "Likes",
    "Comments",
    "Channel Name",
    "Channel URL",
    "Subscribers",
  ];
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.videoTitle,
        r.link,
        r.views,
        r.likes,
        r.comments,
        r.channelName,
        r.channelUrl,
        r.subscribers,
      ]
        .map(csvEscape)
        .join(","),
    );
  }
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  a.download = `${agent}-scrape-${ts}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const CaseStudies = () => {
  const [responses, setResponses] = useState<Record<string, ResponseState>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});

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

      // The edge function always returns 200; check the body for an n8n-side error.
      if (data && typeof data === "object" && "error" in (data as Record<string, unknown>)) {
        const d = data as { error?: string; hint?: string; n8nResponse?: unknown };
        const msg = [d.error, d.hint].filter(Boolean).join(" — ");
        setResponses((prev) => ({
          ...prev,
          [agent]: { agent, loading: false, data: d.n8nResponse ?? null, error: msg || "Webhook error" },
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
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                      Webhook agent:{" "}
                      <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-primary">
                        {c.webhookAgent}
                      </code>
                      <span className="text-muted-foreground/50">— ready for n8n integration</span>
                    </div>
                    <div>
                      <label
                        htmlFor={`input-${c.webhookAgent}`}
                        className="block text-xs font-medium text-foreground"
                      >
                        {c.inputLabel}
                      </label>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Enter a value below — it will be sent to the n8n webhook as{" "}
                        <code className="rounded bg-secondary px-1 font-mono text-primary">
                          {c.inputField}
                        </code>
                        .
                      </p>
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                        <Input
                          id={`input-${c.webhookAgent}`}
                          value={inputs[c.webhookAgent] ?? ""}
                          onChange={(e) =>
                            setInputs((prev) => ({ ...prev, [c.webhookAgent]: e.target.value }))
                          }
                          placeholder={c.inputPlaceholder}
                          className="flex-1"
                        />
                        <button
                          onClick={() => {
                            const value = (inputs[c.webhookAgent] ?? "").trim();
                            if (!value) return;
                            triggerWebhook(c.webhookAgent, {
                              ...c.samplePayload,
                              [c.inputField]: value,
                              chatInput: value,
                              message: value,
                            });
                          }}
                          disabled={res?.loading || !(inputs[c.webhookAgent] ?? "").trim()}
                          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
                        >
                          {res?.loading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Play className="h-3.5 w-3.5" />
                          )}
                          {res?.loading ? "Running…" : "Try it"}
                        </button>
                      </div>
                    </div>
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
                          {res.error ? (
                            <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-all leading-relaxed">
                              {res.error}
                            </pre>
                          ) : (() => {
                            const rows = extractRows(res.data);
                            if (!rows.length) {
                              return (
                                <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-all leading-relaxed">
                                  {JSON.stringify(res.data, null, 2)}
                                </pre>
                              );
                            }
                            return (
                              <div className="max-h-96 overflow-auto rounded-md border border-border">
                                <div className="flex items-center justify-between gap-2 border-b border-border bg-secondary/40 px-3 py-2">
                                  <span className="font-sans text-[11px] text-muted-foreground">
                                    {rows.length} {rows.length === 1 ? "row" : "rows"}
                                  </span>
                                  <button
                                    onClick={() => downloadCsv(c.webhookAgent, rows)}
                                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 font-sans text-[11px] font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                                  >
                                    <Download className="h-3 w-3" />
                                    Export CSV
                                  </button>
                                </div>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Video Title</TableHead>
                                      <TableHead>Link</TableHead>
                                      <TableHead className="text-right">Views</TableHead>
                                      <TableHead className="text-right">Likes</TableHead>
                                      <TableHead className="text-right">Comments</TableHead>
                                      <TableHead>Channel Name</TableHead>
                                      <TableHead>Channel URL</TableHead>
                                      <TableHead className="text-right">Subscribers</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {rows.map((r, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell className="max-w-[260px] truncate font-sans">
                                          {r.videoTitle ?? "—"}
                                        </TableCell>
                                        <TableCell className="font-sans">
                                          {r.link ? (
                                            <a
                                              href={r.link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-primary hover:underline"
                                            >
                                              Open
                                            </a>
                                          ) : (
                                            "—"
                                          )}
                                        </TableCell>
                                        <TableCell className="text-right font-sans">{formatNum(r.views)}</TableCell>
                                        <TableCell className="text-right font-sans">{formatNum(r.likes)}</TableCell>
                                        <TableCell className="text-right font-sans">{formatNum(r.comments)}</TableCell>
                                        <TableCell className="font-sans">{r.channelName ?? "—"}</TableCell>
                                        <TableCell className="font-sans">
                                          {r.channelUrl ? (
                                            <a
                                              href={r.channelUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-primary hover:underline"
                                            >
                                              Channel
                                            </a>
                                          ) : (
                                            "—"
                                          )}
                                        </TableCell>
                                        <TableCell className="text-right font-sans">{formatNum(r.subscribers)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            );
                          })()}
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
