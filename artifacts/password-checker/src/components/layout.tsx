import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Lock, Key, BookOpen, Info, Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { CyberBackground } from "@/components/cyber-background";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { href: "/", label: "Home", icon: Shield },
    { href: "/checker", label: "Analyzer", icon: Key },
    { href: "/generator", label: "Generator", icon: Lock },
    { href: "/learn", label: "Learn", icon: BookOpen },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col w-full relative">
      <CyberBackground />

      <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/70 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Shield className="h-6 w-6 text-primary group-hover:text-primary/80 transition-colors drop-shadow-[0_0_8px_rgba(0,240,200,0.8)]" />
            <span className="font-bold text-lg tracking-tight text-foreground drop-shadow-[0_0_6px_rgba(0,220,180,0.5)]">Fortify</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-all hover:text-primary ${
                    isActive
                      ? "text-primary drop-shadow-[0_0_6px_rgba(0,220,200,0.7)]"
                      : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mr-2"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-primary/20 bg-background/90 backdrop-blur-md">
            <nav className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 text-sm font-medium p-2 rounded-md transition-colors hover:bg-muted ${
                      isActive ? "bg-muted text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col relative z-10">
        {children}
      </main>

      <footer className="relative z-10 border-t border-primary/20 py-6 bg-background/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="drop-shadow-[0_0_4px_rgba(0,200,160,0.3)]">
            Fortify Password Analyzer — Built for security awareness.
          </p>
        </div>
      </footer>
    </div>
  );
}
