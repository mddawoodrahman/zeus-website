import { Github, Globe, Mail } from "lucide-react";
import Link from "next/link";

const zeusLogo = "/assets/zeus-logo.png";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-muted/40 via-muted/30 to-background text-muted-foreground">
      <div className="container mx-auto px-6 py-14">
        {/* Top Section */}
        <div className="grid gap-10 md:grid-cols-5">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
                <img src={zeusLogo} alt="Zeus Logo" className="h-9 w-9" />
              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Zeus
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Open-source AI prompt enhancement for faster, higher-quality LLM
              outcomes across local and cloud providers.
            </p>

            <div className="flex items-center gap-4 mt-6">
              {[
                { icon: Github, href: "https://lnkd.in/dspWKsAi" },
                { icon: Globe, href: "https://lnkd.in/efA29y5h" },
              ].map(({ icon: Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border border-border hover:bg-foreground hover:text-background transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#features"
                  className="hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="hover:text-foreground transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#chrome-extension"
                  className="hover:text-foreground transition-colors"
                >
                  Chrome Extension
                </Link>
              </li>
              <li>
                <a
                  href="https://lnkd.in/dspWKsAi"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="https://lnkd.in/efA29y5h"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Chrome Web Store
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Stay Updated</h3>
            <p className="text-sm mb-3">
              Join our newsletter for product updates, AI tips, and exclusive
              beta access.
            </p>
            <form className="flex items-center border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary/40 transition">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition"
              >
                <Mail className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2026 Zeus. All rights reserved.</p>
          <div className="text-xs flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
