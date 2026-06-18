import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Shield, ArrowRight, Lock, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAnalyzePassword } from "@workspace/api-client-react";
import { useDebounce } from "@/hooks/use-debounce";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const debouncedPassword = useDebounce(password, 300);
  
  const analyzeMutation = useAnalyzePassword();

  useEffect(() => {
    if (debouncedPassword) {
      analyzeMutation.mutate({ data: { password: debouncedPassword } });
    }
  }, [debouncedPassword]);

  const analysis = analyzeMutation.data;

  const getStrengthColor = (score: number) => {
    if (score < 20) return "bg-red-500";
    if (score < 40) return "bg-orange-500";
    if (score < 60) return "bg-yellow-500";
    if (score < 80) return "bg-green-500";
    return "bg-emerald-500";
  };

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium">
                <Shield className="h-4 w-4" />
                Professional Security Tool
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                Test your password against modern threats.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Advanced entropy analysis, pattern detection, and real-time feedback to help you create uncrackable credentials.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card border rounded-2xl p-6 md:p-8 shadow-xl max-w-xl mx-auto"
            >
              <div className="relative mb-6">
                <Input
                  type="password"
                  placeholder="Enter a password to test..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 text-lg px-4 bg-background pr-12"
                />
                <Lock className="absolute right-4 top-4 h-6 w-6 text-muted-foreground" />
              </div>

              {password && analysis && (
                <div className="mb-6 space-y-2 text-left">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Strength</span>
                    <span className={analysis.score > 60 ? "text-green-500" : "text-primary"}>
                      {analysis.strengthLabel}
                    </span>
                  </div>
                  <Progress 
                    value={analysis.score} 
                    className="h-2"
                    indicatorClassName={getStrengthColor(analysis.score)}
                  />
                </div>
              )}

              <Button 
                size="lg" 
                className="w-full h-14 text-lg"
                onClick={() => setLocation(password ? `/checker?p=${encodeURIComponent(password)}` : "/checker")}
              >
                Go to Full Analyzer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-card border"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Analysis</h3>
              <p className="text-muted-foreground">
                Get instant feedback on entropy, pattern vulnerabilities, and estimated crack times as you type.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-card border"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Generator</h3>
              <p className="text-muted-foreground">
                Create cryptographically secure passwords and passphrases with fine-grained control over character sets.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-card border"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Privacy First</h3>
              <p className="text-muted-foreground">
                All analysis happens securely. We never store or log the passwords you test or generate.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
