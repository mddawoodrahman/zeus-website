import { Card } from "@/components/ui/card";
import { Sparkles, Zap, Shield, Lightbulb, Globe, Layers } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Prompt Intelligence",
    description:
      "Turn rough ideas into structured prompts that produce clearer, more reliable model outputs.",
  },
  {
    icon: Zap,
    title: "One-Click Enhancement",
    description:
      "Inject Zeus directly into supported AI chat inputs and improve prompts instantly.",
  },
  {
    icon: Lightbulb,
    title: "Multi-Provider Support",
    description:
      "Use OpenAI, Gemini, Claude, OpenRouter, or Ollama through one consistent enhancement flow.",
  },
  {
    icon: Shield,
    title: "Privacy-First Local AI",
    description:
      "Run enhancements with Ollama locally when privacy is critical and keep cloud use optional.",
  },
  {
    icon: Globe,
    title: "Cross-Site Injection",
    description:
      "Works across ChatGPT, Claude, DeepSeek, Grok, and other supported AI workflows.",
  },
  {
    icon: Layers,
    title: "Auto Fallback Mode",
    description:
      "Auto mode prefers local Ollama first, then falls back to cloud providers when needed.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Features Built for{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Prompt Engineering
            </span>{" "}
            at Scale
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything needed to get stronger AI results from better prompts.
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
