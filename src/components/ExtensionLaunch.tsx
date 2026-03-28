import { Button } from "@/components/ui/button";
import { Github, Globe, Shield, Sparkles, Zap } from "lucide-react";

const extensionHighlights = [
  "Turns simple prompts into structured, high-performing prompts",
  "Works across ChatGPT, Claude, Gemini, DeepSeek, and Grok",
  "Supports OpenAI, Gemini, Claude, OpenRouter, and Ollama",
  "Auto mode intelligently routes local to cloud when needed",
];

const whyItMatters = [
  "Most weak AI output starts with weak prompts, not weak models.",
  "Zeus gives users a one-click path to better clarity, structure, and results.",
  "Local Ollama support keeps privacy-first workflows available by default.",
];

export const ExtensionLaunch = () => {
  return (
    <section id="chrome-extension" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-gold/10 p-8 md:p-12 shadow-strong">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            Introducing Zeus - AI Prompt Enhancer
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                Powerful AI starts with
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {" "}
                  better prompts
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Zeus is an open-source Chrome extension that upgrades prompts
                instantly, so users can get stronger answers from every major
                LLM with one click.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button size="lg" asChild>
                  <a
                    href="https://lnkd.in/dspWKsAi"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github className="h-5 w-5" />
                    View GitHub Repository
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a
                    href="https://lnkd.in/efA29y5h"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Globe className="h-5 w-5" />
                    Install from Chrome Store
                  </a>
                </Button>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Privacy-first with Ollama
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-gold" />
                  One-click enhancement
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">What Zeus Does</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {extensionHighlights.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Why This Matters</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {whyItMatters.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-gold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};