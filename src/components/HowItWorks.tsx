import { Card } from "@/components/ui/card";
import { FileText, Sparkles, CheckCircle, Download } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Draft Any Prompt",
    description:
      "Write a simple prompt inside ChatGPT, Claude, Gemini, DeepSeek, or Grok.",
    number: "",
  },
  {
    icon: Sparkles,
    title: "Click Enhance Prompt",
    description:
      "Use the Zeus button to instantly rewrite your prompt into a structured, high-performing version.",
    number: "",
  },
  {
    icon: CheckCircle,
    title: "Choose Your Provider",
    description:
      "Run with OpenAI, Gemini, Claude, OpenRouter, Ollama, or Auto mode with local-first fallback.",
    number: "",
  },
  {
    icon: Download,
    title: "Use and Iterate",
    description:
      "Send the upgraded prompt and iterate faster with better quality answers from any model.",
    number: "",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Prompt Excellence in{" "}
            <span className="bg-gradient-gold bg-clip-text text-transparent">
              4 Simple Steps
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From raw idea to high-performance prompt in seconds.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={index}
                  className="p-8 relative overflow-hidden hover:shadow-strong transition-all duration-300 group"
                >
                  <div className="absolute top-4 right-4 text-6xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                    {step.number}
                  </div>
                  <div className="relative">
                    <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
