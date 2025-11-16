import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Shield, Lightbulb, Globe, Layers } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Grammar Perfection",
    description:
      "Catch every grammatical error with AI-powered detection that understands context and nuance.",
  },
  {
    icon: Zap,
    title: "Real-Time Corrections",
    description:
      "Get instant suggestions as you type. No waiting, no delays—just lightning-fast improvements.",
  },
  {
    icon: Lightbulb,
    title: "Style Enhancement",
    description:
      "Elevate your writing style with intelligent suggestions for clarity, conciseness, and impact.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your documents stay private. We use end-to-end encryption and never store your content.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description:
      "Web app, Chrome extension, and integrations across all your favorite writing platforms.",
  },
  {
    icon: Layers,
    title: "Tone Detector",
    description:
      "Ensure your message hits the right tone—professional, friendly, formal, or casual.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Features That{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Supercharge
            </span>{" "}
            Your Writing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to write with confidence, clarity, and power.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-strong hover:border-primary/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
