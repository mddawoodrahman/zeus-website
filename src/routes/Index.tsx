import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ExtensionLaunch } from "@/components/ExtensionLaunch";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ExtensionLaunch />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
