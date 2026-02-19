import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import ArchitecturePreview from "@/components/landing/ArchitecturePreview";
import PricingPreview from "@/components/landing/PricingPreview";
import EnterpriseSection from "@/components/landing/EnterpriseSection";
import FinalCTA from "@/components/landing/FinalCTA";

const Index = () => (
  <>
    <SEOHead
      title="AI Web Scraping with Autonomous AI Agents | Intelligent Data Extraction Platform"
      description="Enterprise-ready AI web scraping platform using autonomous AI agents for scalable, compliant, and intelligent data extraction from dynamic websites."
    />
    <Navbar />
    <main>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <UseCasesSection />
      <ArchitecturePreview />
      <PricingPreview />
      <EnterpriseSection />
      <FinalCTA />
    </main>
    <Footer />
  </>
);

export default Index;
