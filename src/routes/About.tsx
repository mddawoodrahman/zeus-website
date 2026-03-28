"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Target,
  Heart,
  Users,
  Award,
  TrendingUp,
  Shield,
  Lightbulb,
  Globe,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const lightningIcon = "/assets/lightning-icon.png";

const values = [
  {
    icon: Zap,
    title: "Innovation First",
    description:
      "We constantly push the boundaries of AI technology to deliver cutting-edge writing solutions that stay ahead of the curve.",
  },
  {
    icon: Heart,
    title: "User-Centric Design",
    description:
      "Every feature we build starts with understanding our users' needs. Your success is our success.",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description:
      "Your data is yours. We implement industry-leading security measures to protect your content and personal information.",
  },
  {
    icon: Target,
    title: "Excellence in Everything",
    description:
      "From our AI algorithms to customer support, we're committed to delivering exceptional quality in every interaction.",
  },
];

const stats = [
  { number: "10M+", label: "Words Enhanced" },
  { number: "50K+", label: "Active Users" },
  { number: "99.9%", label: "Accuracy Rate" },
  { number: "150+", label: "Countries Served" },
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Founder",
    bio: "Former AI researcher at Stanford. Passionate about democratizing writing excellence.",
    image: "👩‍💼",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO",
    bio: "Ex-Google engineer with 15 years in NLP and machine learning systems.",
    image: "👨‍💻",
  },
  {
    name: "Aisha Patel",
    role: "Head of Product",
    bio: "Product leader who shipped features at Microsoft and Grammarly.",
    image: "👩‍🔬",
  },
  {
    name: "James Wilson",
    role: "Lead AI Scientist",
    bio: "PhD in Computational Linguistics. Published 20+ papers on language models.",
    image: "👨‍🔬",
  },
];

const milestones = [
  {
    year: "2023",
    title: "The Beginning",
    description:
      "Zeus was founded with a mission to make professional writing accessible to everyone.",
  },
  {
    year: "2024",
    title: "Rapid Growth",
    description:
      "Reached 50,000+ users and launched our Pro subscription tier.",
  },
  {
    year: "2025",
    title: "Global Expansion",
    description:
      "Expanded to 150+ countries and introduced multilingual support.",
  },
  {
    year: "Future",
    title: "What's Next",
    description:
      "AI-powered content generation, team collaboration, and mobile apps.",
  },
];

const achievements = [
  { icon: Award, text: "Winner of TechCrunch Disrupt 2024" },
  { icon: TrendingUp, text: "Fastest Growing Writing Tool 2024" },
  { icon: Users, text: "Featured in Forbes 30 Under 30" },
  { icon: Globe, text: "Available in 15+ Languages" },
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
          <img
            src={lightningIcon}
            alt=""
            className="absolute top-20 right-[10%] w-16 h-16 opacity-20 animate-pulse"
            style={{ animationDuration: "3s" }}
          />
          <img
            src={lightningIcon}
            alt=""
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
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.number}
                </p>
                <p className="text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
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
                Transforming the way people write, one word at a time
              </p>
            </div>

            <Card className="p-8 md:p-12 border-primary/20 shadow-strong">
              <div className="flex items-start gap-4 mb-6">
                <div className="h-14 w-14 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <Target className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    Making Professional Writing Accessible to Everyone
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    We believe that great writing shouldn't be a privilege
                    reserved for those with expensive editors or extensive
                    training. Zeus democratizes access to professional-quality
                    writing assistance through the power of AI.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Whether you're a student working on an essay, a professional
                    crafting an important email, or a writer polishing your
                    manuscript, Zeus helps you communicate with clarity,
                    confidence, and impact.
                  </p>
                </div>
              </div>
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
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
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

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Meet the{" "}
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                Team
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The brilliant minds behind Zeus
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-strong hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {member.image}
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <Badge variant="secondary" className="mb-3">
                  {member.role}
                </Badge>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From a small idea to a global writing revolution
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <Card
                  key={index}
                  className="p-6 md:p-8 hover:shadow-strong hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 rounded-xl bg-gradient-primary flex items-center justify-center">
                        <span className="text-xl font-bold text-primary-foreground">
                          {milestone.year}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Recognition &{" "}
                <span className="bg-gradient-gold bg-clip-text text-transparent">
                  Awards
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-strong hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <p className="font-semibold">{achievement.text}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8 md:p-12 bg-gradient-to-br from-primary/10 to-gold/10 border-primary/20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-primary mb-6">
                <Lightbulb className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Writing?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of writers who trust Zeus to help them
                communicate better. Start writing with confidence today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="shadow-glow" asChild>
                  <Link href="/signup">
                    <Zap className="h-5 w-5 mr-2" />
                    Get Started Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">
                    Contact Sales
                  </Link>
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
