import { Button } from "@/components/ui/button";
import { Zap, Sparkles, ArrowRight } from "lucide-react";
import lightningIcon from "@/assets/lightning-icon.png";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
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

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Powered by Advanced AI
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Write with the Power of{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Lightning
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Zeus enhances your writing with real-time grammar corrections, style
            improvements, and AI-powered suggestions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/editor">
              <Button
                size="lg"
                className="text-lg h-14 px-8 shadow-strong hover:shadow-glow transition-all"
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Writing Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg h-14 px-8">
              See How It Works
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-border/50">
            <div>
              <p className="text-3xl font-bold text-primary mb-1">10M+</p>
              <p className="text-sm text-muted-foreground">Words Enhanced</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold mb-1">99.9%</p>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary mb-1">24/7</p>
              <p className="text-sm text-muted-foreground">AI Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
