import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Activity, TerminalSquare, Key, Heart, Github, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { label: "Home", href: "/", icon: TerminalSquare },
    { label: "Docs", href: "/docs", icon: Activity },
    { label: "API Key", href: "/apikey", icon: Key },
    { label: "Donasi", href: "/donasi", icon: Heart },
    { label: "Sosmed", href: "/sosmed", icon: Github },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-[100dvh] flex flex-col relative bg-background selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-mono font-bold">
              H
            </div>
            <span className="font-bold hidden sm:inline-block">
              Habibi API
            </span>
          </Link>

          <nav className="flex-1 flex items-center justify-between">
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors hover:text-primary flex items-center gap-1.5 ${
                    location === item.href ? "text-primary" : "text-foreground/60"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-4 ml-auto">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-background border-t">
          <div className="flex flex-col space-y-4 p-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium p-2 rounded-md flex items-center gap-3 ${
                  location === item.href ? "bg-primary/10 text-primary" : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t py-8 mt-12 bg-muted/20">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 text-center md:flex-row md:justify-between md:px-8 text-sm text-muted-foreground">
          <p>
            Built with dedication by <span className="font-medium text-foreground">HabibiTzy</span>. 
          </p>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link>
            <Link href="/apikey" className="hover:text-primary transition-colors">Get API Key</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
