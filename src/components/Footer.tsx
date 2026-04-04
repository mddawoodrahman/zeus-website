import { Github, Globe, Zap, Code2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const zeusLogo = "/assets/zeus-logo.png";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-gradient-to-b from-muted/40 via-muted/30 to-background text-muted-foreground">
      <div className="container mx-auto px-6 py-14">
        {/* Top Section */}
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src={zeusLogo}
                alt="Zeus Logo"
                width={36}
                height={36}
                className="h-9 w-9"
              />
              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Zeus
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-md">
              Open-source prompt enhancement for modern AI workflows. Improve clarity, structure, and output quality across ChatGPT, Claude, Gemini, and more.
            </p>

            {/* Quick CTA */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://chromewebstore.google.com/detail/zeus/nejhojapbopmedoagaimcdmgekjnkoal"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
              >
                <Zap className="h-4 w-4" /> Install Extension
              </a>
              <a
                href="https://github.com/mddawoodrahman/zeus"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-muted transition"
              >
                <Code2 className="h-4 w-4" /> View Source
              </a>
            </div>

            <div className="flex items-center gap-4 mt-6">
              {[
                { icon: Github, href: "https://github.com/mddawoodrahman/zeus" },
                { icon: Globe, href: "https://chromewebstore.google.com/detail/zeus/nejhojapbopmedoagaimcdmgekjnkoal" },
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
                <Link href="/#features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#chrome-extension" className="hover:text-foreground transition-colors">
                  Chrome Extension
                </Link>
              </li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Developers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://github.com/mddawoodrahman/zeus" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="https://github.com/mddawoodrahman/zeus/issues" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                  Report Issue
                </a>
              </li>
              <li>
                <a href="https://github.com/mddawoodrahman/zeus" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                  Contribute
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© {year} Zeus. Open-source under ISC license.</p>
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