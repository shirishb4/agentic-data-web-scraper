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

// Normalize a key for fuzzy matching: lowercase, strip non-alphanumerics
const normKey = (k: string): string => k.toLowerCase().replace(/[^a-z0-9]/g, "");

// Field aliases — every variant we want to recognize for each output column.
// Add new aliases here to extend auto-mapping.
const FIELD_ALIASES: Record<keyof VideoRow, string[]> = {
  videoTitle: [
    "videoTitle", "title", "video_title", "videoName", "video_name", "name",
    "headline", "videoHeadline",
  ],
  link: [
    "link", "url", "videoUrl", "video_url", "videoLink", "video_link",
    "watchUrl", "watch_url", "href", "permalink", "shareUrl", "share_url",
  ],
  views: [
    "views", "viewCount", "view_count", "viewsCount", "views_count",
    "totalViews", "total_views", "playCount", "play_count", "plays",
  ],
  likes: [
    "likes", "likeCount", "like_count", "likesCount", "likes_count",
    "totalLikes", "total_likes", "thumbsUp", "thumbs_up", "reactions",
  ],
  comments: [
    "comments", "commentCount", "commentsCount", "comment_count", "comments_count",
    "totalComments", "total_comments", "numComments", "num_comments", "replies",
  ],
  channelName: [
    "channelName", "channel", "channel_name", "channelTitle", "channel_title",
    "author", "authorName", "author_name", "creator", "uploader", "uploaderName",
    "ownerName", "owner",
  ],
  channelUrl: [
    "channelUrl", "channel_url", "channelLink", "channel_link", "channelHref",
    "authorUrl", "author_url", "authorLink", "author_link", "creatorUrl",
    "uploaderUrl", "ownerUrl",
  ],
  subscribers: [
    "subscribers", "subscriberCount", "subscriber_count", "subscribersCount",
    "subscribers_count", "subs", "subCount", "sub_count", "followerCount",
    "followers", "channelSubscribers",
  ],
};

// Build a flat lookup of normalized keys → value, walking nested objects.
// Nested keys are also exposed under their leaf name so `channel.name` matches `channelName`.
const flattenKeys = (
  obj: unknown,
  out: Record<string, unknown> = {},
  prefix = "",
  depth = 0,
): Record<string, unknown> => {
  if (depth > 4 || !obj || typeof obj !== "object" || Array.isArray(obj)) return out;
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    const leafNorm = normKey(k);
    const fullNorm = normKey(fullKey);
    if (v !== null && typeof v !== "object") {
      if (!(leafNorm in out)) out[leafNorm] = v;
      out[fullNorm] = v;
    } else if (v && typeof v === "object" && !Array.isArray(v)) {
      flattenKeys(v, out, fullKey, depth + 1);
    }
  }
  return out;
};

const pickField = (flat: Record<string, unknown>, aliases: string[]): unknown => {
  for (const alias of aliases) {
    const n = normKey(alias);
    if (n in flat) {
      const v = flat[n];
      if (v !== undefined && v !== null && v !== "") return v;
    }
  }
  return undefined;
};

const toRow = (item: unknown): VideoRow | null => {
  if (!item || typeof item !== "object" || Array.isArray(item)) return null;
  const flat = flattenKeys(item);
  const row: VideoRow = {
    videoTitle: pickField(flat, FIELD_ALIASES.videoTitle) as string | undefined,
    link: pickField(flat, FIELD_ALIASES.link) as string | undefined,
    views: pickField(flat, FIELD_ALIASES.views) as string | number | undefined,
    likes: pickField(flat, FIELD_ALIASES.likes) as string | number | undefined,
    comments: pickField(flat, FIELD_ALIASES.comments) as string | number | undefined,
    channelName: pickField(flat, FIELD_ALIASES.channelName) as string | undefined,
    channelUrl: pickField(flat, FIELD_ALIASES.channelUrl) as string | undefined,
    subscribers: pickField(flat, FIELD_ALIASES.subscribers) as string | number | undefined,
  };
  const hasAny = Object.values(row).some((v) => v !== undefined && v !== null && v !== "");
  return hasAny ? row : null;
};

const extractRows = (data: unknown): VideoRow[] => {
  if (data === null || data === undefined) return [];

  // String — try JSON parse, else try to find JSON / markdown table inside text
  if (typeof data === "string") {
    let trimmed = data.trim();
    // Strip ```json ... ``` or ``` ... ``` code fences
    const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) trimmed = fence[1].trim();

    // 1) Direct JSON parse
    try {
      return extractRows(JSON.parse(trimmed));
    } catch {
      /* fall through */
    }

    // 2) Find the largest JSON array first (most n8n agents return arrays)
    const arrayMatch = trimmed.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        return extractRows(JSON.parse(arrayMatch[0]));
      } catch {
        /* fall through */
      }
    }

    // 3) Multiple JSON objects concatenated / NDJSON
    const objectMatches = trimmed.match(/\{[\s\S]*?\}(?=\s*[\{,\n]|\s*$)/g);
    if (objectMatches && objectMatches.length > 1) {
      const rows: VideoRow[] = [];
      for (const m of objectMatches) {
        try {
          const parsed = JSON.parse(m);
          rows.push(...extractRows(parsed));
        } catch {
          /* skip bad chunk */
        }
      }
      if (rows.length) return rows;
    }

    // 4) Single JSON object fallback
    const objectMatch = trimmed.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return extractRows(JSON.parse(objectMatch[0]));
      } catch {
        /* fall through */
      }
    }

    // 5) Markdown table parser — | col1 | col2 | ...
    const lines = trimmed.split(/\r?\n/).filter((l) => l.trim().startsWith("|"));
    if (lines.length >= 2) {
      const split = (l: string) =>
        l
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((c) => c.trim());
      const headers = split(lines[0]).map((h) => h.toLowerCase());
      // skip separator row (---)
      const bodyStart = lines[1] && /^[\s|:-]+$/.test(lines[1]) ? 2 : 1;
      const rows: VideoRow[] = [];
      for (let i = bodyStart; i < lines.length; i++) {
        const cells = split(lines[i]);
        if (cells.every((c) => /^[-:\s]*$/.test(c))) continue;
        const obj: Record<string, unknown> = {};
        headers.forEach((h, idx) => {
          obj[h] = cells[idx] ?? "";
        });
        const r = toRow(obj);
        if (r) rows.push(r);
      }
      if (rows.length) return rows;
    }

    return [];
  }

  if (Array.isArray(data)) {
    const rows = data.map(toRow).filter(Boolean) as VideoRow[];
    if (rows.length) return rows;
    // maybe array of wrapped items
    return data.flatMap(extractRows);
  }

  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    // common n8n chat output shapes — try unwrapping and aggregating
    const wrappers = ["output", "data", "results", "videos", "items", "rows", "response", "result", "message", "text"];
    const collected: VideoRow[] = [];
    for (const w of wrappers) {
      if (w in o) collected.push(...extractRows(o[w]));
    }
    if (collected.length) return collected;
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

          <div className="mx-auto mt-16 max-w-5xl">
            <Tabs defaultValue={cases[0].webhookAgent} className="w-full">
              <TabsList className="grid w-full grid-cols-1 gap-2 bg-transparent p-0 sm:grid-cols-3">
                {cases.map((c) => (
                  <TabsTrigger
                    key={c.webhookAgent}
                    value={c.webhookAgent}
                    className="flex h-auto items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-muted-foreground transition-all data-[state=active]:border-primary/40 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none"
                  >
                    <c.icon className="h-4 w-4" />
                    {c.title.replace(" Agent", "")}
                  </TabsTrigger>
                ))}
              </TabsList>
              {cases.map((c) => {
                const res = responses[c.webhookAgent];
                return (
                  <TabsContent key={c.webhookAgent} value={c.webhookAgent} className="mt-6">
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
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
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CaseStudies;
