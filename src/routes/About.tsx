"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Zap,
  Target,
  Heart,
  Shield,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const lightningIcon = "/assets/lightning-icon.png";

const values = [
  {
    icon: Zap,
    title: "Innovation First",
    description:
      "We push the boundaries of AI usability, not just AI capability.",
  },
  {
    icon: Heart,
    title: "User-Centric Design",
    description:
      "Every feature is built to reduce friction and improve real-world workflows.",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description:
      "Your data stays yours. Zeus follows a minimal-permission, secure-by-design approach.",
  },
  {
    icon: Target,
    title: "Reliability at Scale",
    description:
      "From fallback systems to testing pipelines, Zeus is built to work when you need it most.",
  },
];

const differentiators = [
  {
    title: "Intelligent Prompt Enhancement",
    description:
      "Zeus doesn't just rewrite text. It understands intent and restructures prompts for better AI responses while keeping your original meaning intact.",
  },
  {
    title: "Multi-Provider Flexibility",
    description:
      "Seamlessly connect with leading AI providers like OpenAI, Gemini, Claude, OpenRouter, or even local models via Ollama, all in one place.",
  },
  {
    title: "Auto Mode with Smart Routing",
    description:
      "Let Zeus automatically select the best model for your task, with built-in fallback systems to ensure reliability and uninterrupted performance.",
  },
  {
    title: "Built for Real Workflows",
    description:
      "Works directly inside popular AI platforms like ChatGPT and Claude with a non-intrusive interface, no context switching, no friction.",
  },
  {
    title: "Open-Source & Developer-First",
    description:
      "Designed with clean architecture, modular components, and strong testing foundations, making it easy to extend, customize, and contribute.",
  },
];

const audiences = [
  "Developers working with AI tools daily",
  "Students and researchers refining queries",
  "Content creators aiming for better outputs",
  "Professionals who rely on clear, impactful communication",
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

        {/* Animated Lightning Bolts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image
            src={lightningIcon}
            alt=""
            width={64}
            height={64}
            className="absolute top-20 right-[10%] w-16 h-16 opacity-20 animate-pulse"
            style={{ animationDuration: "3s" }}
          />
          <Image
            src={lightningIcon}
            alt=""
            width={48}
            height={48}
            className="absolute bottom-32 left-[15%] w-12 h-12 opacity-10 animate-pulse"
            style={{ animationDuration: "4s", animationDelay: "1s" }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Our Story
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Empowering Writers with{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                AI Magic
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              We're on a mission to help everyone write better. From students to
              professionals, Zeus makes professional-quality writing accessible
              to all.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="shadow-glow" asChild>
                <Link href="/editor">
                  <Zap className="h-5 w-5 mr-2" />
                  Try Zeus Free
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Our{" "}
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Mission
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Make high-quality AI interaction effortless for everyone
              </p>
            </div>

            <Card className="p-8 md:p-12 border-primary/20 shadow-strong">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <Target className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    We believe the true power of AI isn't just in the models -
                    it's in how you communicate with them. Most users don't get
                    optimal results simply because their prompts aren't
                    structured well.
                  </p>
                  <p className="text-lg font-semibold mb-4">Zeus bridges that gap.</p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    By transforming raw ideas into well-structured prompts,
                    Zeus ensures that anyone, from beginners to professionals,
                    can unlock the full potential of AI without needing expert
                    prompt engineering skills.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                What Makes{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Zeus Different
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {differentiators.map((item, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-strong hover:border-primary/50 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audience Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Who It's For
              </h2>
            </div>

            <Card className="p-8 md:p-10 border-primary/20 shadow-strong">
              <ul className="space-y-4 mb-8">
                {audiences.map((audience, index) => (
                  <li key={index} className="text-lg text-muted-foreground leading-relaxed">
                    {audience}
                  </li>
                ))}
              </ul>
              <p className="text-xl font-semibold text-center">
                If you use AI, Zeus makes it better.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Values
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="p-8 hover:shadow-strong hover:border-primary/50 transition-all duration-300"
                >
                  <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Movement Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-5xl mx-auto p-8 md:p-12 border-primary/20 shadow-strong">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Join the Movement
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Zeus is more than a tool - it's a growing open-source ecosystem.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're here to use it or build on it, you're part of
                shaping the future of AI interaction.
              </p>
            </div>

            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-3">Get Started Today</h3>
              <p className="text-lg text-muted-foreground mb-8">
                Enhance your prompts. Improve your results. Save time.
              </p>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a
                    href="https://chromewebstore.google.com/detail/zeus/nejhojapbopmedoagaimcdmgekjnkoal"
                    target="_blank"
                    rel="noreferrer"
                  >
                    -&gt; Install Zeus and experience smarter AI
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a
                    href="https://github.com/mddawoodrahman/zeus"
                    target="_blank"
                    rel="noreferrer"
                  >
                    -&gt; Explore the project and contribute on GitHub
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
