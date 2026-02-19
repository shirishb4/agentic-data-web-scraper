import { motion } from "framer-motion";
import { Building2, Rocket, ShieldCheck, Zap, TrendingUp, Target, BarChart3, Layers } from "lucide-react";

const enterprisePoints = [
  { icon: Zap, text: "Reduced scraping maintenance by 90%" },
  { icon: TrendingUp, text: "Faster time-to-insight from web data" },
  { icon: ShieldCheck, text: "Secure & compliance-first architecture" },
  { icon: Layers, text: "API-first integration with existing stacks" },
];

const investorPoints = [
  { icon: BarChart3, text: "Large and growing data intelligence market" },
  { icon: Target, text: "Strong differentiation via agentic AI" },
  { icon: Building2, text: "High enterprise adoption potential" },
  { icon: Rocket, text: "Scalable SaaS economics" },
];

const EnterpriseSection = () => (
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
          Built for Enterprises. Designed for Scale.{" "}
          <span className="text-gradient-brown">Ready for Investment.</span>
        </h2>
      </motion.div>

      <div className="mx-auto mt-16 grid max-w-4xl gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-heading text-xl font-semibold text-foreground">Enterprise Value</h3>
          <ul className="mt-6 space-y-4">
            {enterprisePoints.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm text-secondary-foreground">
                <p.icon className="h-5 w-5 shrink-0 text-primary" />
                {p.text}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-heading text-xl font-semibold text-foreground">Investor Value</h3>
          <ul className="mt-6 space-y-4">
            {investorPoints.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm text-secondary-foreground">
                <p.icon className="h-5 w-5 shrink-0 text-primary" />
                {p.text}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

export default EnterpriseSection;
