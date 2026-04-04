"use client";

import { Button } from "@/components/ui/button";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const zeusLogo = "/assets/zeus-logo.png";

export const Header = () => {
  const { isLoaded, userId } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image
            src={zeusLogo}
            alt="Zeus"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Zeus
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/#chrome-extension"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Extension
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="hidden lg:inline-flex">
            <a
              href="https://lnkd.in/efA29y5h"
              target="_blank"
              rel="noreferrer"
            >
              Get Extension
            </a>
          </Button>
          <ThemeToggle />
          {isLoaded && userId ? (
            <>
              <Link href="/editor">
                <Button size="sm" className="shadow-glow">
                  <Zap className="h-4 w-4 mr-2" />
                  Editor
                </Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="shadow-glow">
                  <Zap className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
