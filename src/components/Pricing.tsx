import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Zap, Crown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Basic",
    price: "Free",
    period: "",
    icon: Sparkles,
    idealFor: "Individuals exploring Zeus",
    features: [
      "Access to grammar & spelling correction",
      "1 saved document",
      "Basic writing suggestions",
      "Limited AI processing speed",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$10",
    period: "/ month",
    icon: Zap,
    idealFor: "Professionals & content creators",
    features: [
      "Everything in Basic",
      "Advanced grammar, tone, and style suggestions",
      "Unlimited document saves",
      "Export to .docx & .pdf",
      "Real-time feedback",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Premium",
    price: "$20",
    period: "/ month",
    icon: Crown,
    idealFor: "Teams & advanced writers",
    features: [
      "Everything in Pro",
      "Team collaboration tools",
      "Priority AI model (faster processing)",
      "Custom tone & brand style detection",
      "Dedicated support & analytics dashboard",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade as you grow. All plans include our powerful
            AI writing assistant.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`relative transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? "border-electric shadow-glow scale-105 md:scale-110"
                    : "border-border/40"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary px-4 py-1 rounded-full text-xs font-semibold text-white shadow-lg">
                    Most Popular
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-sm mb-4">
                    {plan.idealFor}
                  </CardDescription>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground text-sm">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-electric shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/90">
                        {feature}
                      </span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter>
                  <Link to="/editor" className="w-full">
                    <Button
                      className={`w-full ${plan.popular ? "shadow-glow" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          All plans include 14-day money-back guarantee. No credit card required
          for Basic plan.
        </p>
      </div>
    </section>
  );
};
