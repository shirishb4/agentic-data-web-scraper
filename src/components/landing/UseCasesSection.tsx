import { motion } from "framer-motion";
import { TrendingUp, Search, DollarSign, Users, FileText } from "lucide-react";

const useCases = [
  { icon: TrendingUp, title: "Competitive Intelligence", desc: "Monitor competitor pricing, product launches, and market positioning in real time." },
  { icon: Search, title: "Market & Trend Research", desc: "Track emerging trends, sentiment shifts, and industry movements across the web." },
  { icon: DollarSign, title: "Pricing & Product Monitoring", desc: "Automated price tracking and product catalog monitoring across marketplaces." },
  { icon: Users, title: "Business & Lead Data Extraction", desc: "Enrich CRM pipelines with verified business data from public web sources." },
  { icon: FileText, title: "Content & Website Change Tracking", desc: "Detect website changes, content updates, and regulatory shifts instantly." },
];

const UseCasesSection = () => (
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
          Use <span className="text-gradient-brown">Cases</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          From competitive intelligence to compliance monitoring — AI agents deliver actionable web data.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map((uc, i) => (
          <motion.div
            key={uc.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="flex gap-4 rounded-xl border border-border bg-card p-6"
          >
            <uc.icon className="h-6 w-6 shrink-0 text-primary mt-0.5" />
            <div>
              <h3 className="font-heading font-semibold text-foreground">{uc.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{uc.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default UseCasesSection;
