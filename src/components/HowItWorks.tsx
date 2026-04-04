import { Card } from "@/components/ui/card";
import {
  FileText,
  Sparkles,
  CheckCircle,
  Download,
  Settings2,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Write a Prompt in a Supported Chat App",
    description:
      "Open ChatGPT, Claude, Gemini, DeepSeek, or Grok and draft a simple prompt in the message box.",
  },
  {
    icon: Sparkles,
    title: "Click the Zeus Enhance Button",
    description:
      "Zeus adds a lightweight overlay button directly beside eligible input fields, so you can improve prompts without leaving the page.",
  },
  {
    icon: Settings2,
    title: "Choose a Provider or Use Auto Mode",
    description:
      "Select OpenAI, Gemini, Claude, OpenRouter, or Ollama in the popup, or let Auto mode route your prompt with fallback handling.",
  },
  {
    icon: CheckCircle,
    title: "Send the Improved Prompt and Iterate",
    description:
      "Zeus rewrites your prompt for clarity and structure, then returns it to the input field so you can send it and refine faster.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How Zeus Works in <span className="bg-gradient-gold bg-clip-text text-transparent">4 Steps</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From a rough idea to a stronger prompt, directly inside your favorite AI chat app.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={index}
                  className="p-8 relative overflow-hidden hover:shadow-strong transition-all duration-300 group"
                >
                  

                  <div className="relative">
                    <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-7 w-7 text-primary-foreground" />
                    </div>

                    <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="mt-10 p-8 border-dashed">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Built for clean integration and reliable results</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Zeus keeps provider logic, settings, and site-specific behavior separated under the hood, with retry and fallback support to help keep your workflow moving.
                </p>
              </div>
              <div className="md:ml-auto">
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
