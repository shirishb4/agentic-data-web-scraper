import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-background py-16">
    <div className="container mx-auto px-6">
      <div className="grid gap-12 md:grid-cols-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground">
            <span className="text-gradient-brown">Agent</span>Scrape
          </h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Enterprise-ready AI web scraping platform using autonomous AI agents.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold text-foreground mb-4">Product</h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/architecture" className="text-sm text-muted-foreground hover:text-primary transition-colors">Architecture</Link>
            <Link to="/api-docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">API Docs</Link>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold text-foreground mb-4">Company</h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/legal" className="text-sm text-muted-foreground hover:text-primary transition-colors">Legal & Compliance</Link>
            <a href="mailto:contact@agentscrape.ai" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm font-semibold text-foreground mb-4">Get Started</h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/#demo" className="text-sm text-muted-foreground hover:text-primary transition-colors">Request Demo</Link>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">View Plans</Link>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-border pt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AgentScrape. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
