import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Authentication",
    desc: "All API requests require an API key passed in the Authorization header. Keys can be generated from the dashboard.",
    code: `Authorization: Bearer YOUR_API_KEY`,
  },
  {
    title: "Define Scraping Goals",
    desc: "Create a scraping task by defining the target URL, data schema, and extraction rules. The AI agent interprets your intent.",
    code: `POST /api/v1/tasks
{
  "url": "https://example.com/products",
  "goal": "Extract product names, prices, and availability",
  "output_format": "json",
  "schedule": "daily"
}`,
  },
  {
    title: "Launch AI Agent Jobs",
    desc: "Start an agent job for a defined task. The agent autonomously navigates, extracts, and validates data.",
    code: `POST /api/v1/jobs
{
  "task_id": "task_abc123",
  "agent_config": {
    "max_pages": 100,
    "timeout_minutes": 30
  }
}`,
  },
  {
    title: "Monitor Job Status",
    desc: "Track real-time progress of running jobs including pages scraped, errors encountered, and estimated completion.",
    code: `GET /api/v1/jobs/job_xyz789/status

Response:
{
  "status": "running",
  "pages_scraped": 47,
  "errors": 0,
  "estimated_completion": "2026-02-19T15:30:00Z"
}`,
  },
  {
    title: "Retrieve Structured Data",
    desc: "Download extracted data in your preferred format. Supports JSON, CSV, and direct webhook delivery.",
    code: `GET /api/v1/jobs/job_xyz789/results?format=json

Response:
{
  "results": [
    { "name": "Product A", "price": 29.99, "in_stock": true },
    { "name": "Product B", "price": 49.99, "in_stock": false }
  ],
  "total_records": 156
}`,
  },
  {
    title: "Error Handling & Rate Limits",
    desc: "API responses use standard HTTP status codes. Rate limits are applied per API key tier. Retry-After headers are included.",
    code: `Rate Limits:
  Starter:       100 requests/min
  Professional:  500 requests/min
  Enterprise:    Custom

Error Response:
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests",
  "retry_after": 30
}`,
  },
];

const ApiDocs = () => (
  <>
    <SEOHead
      title="AI Web Scraping API Documentation | Agent-Based Data Extraction"
      description="API documentation for AI-powered web scraping using autonomous agents. Extract structured web data at scale."
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
            API <span className="text-gradient-brown">Documentation</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Integrate AI-powered web scraping into your applications with our RESTful API.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-3xl space-y-8">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="rounded-xl border border-border bg-card p-8"
            >
              <h2 className="font-heading text-xl font-semibold text-foreground">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <pre className="mt-4 overflow-x-auto rounded-lg border border-border bg-background p-4 text-xs leading-relaxed text-secondary-foreground font-mono">
                {s.code}
              </pre>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default ApiDocs;
