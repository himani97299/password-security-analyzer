import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Eye, EyeOff, Copy, RefreshCw, AlertTriangle, CheckCircle2, Info, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAnalyzePassword } from "@workspace/api-client-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";

export default function Checker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const debouncedPassword = useDebounce(password, 300);
  const { toast } = useToast();
  
  const analyzeMutation = useAnalyzePassword();

  useEffect(() => {
    // Check URL query params for initial password
    const urlParams = new URLSearchParams(window.location.search);
    const initialPassword = urlParams.get('p');
    if (initialPassword && !password) {
      setPassword(initialPassword);
      window.history.replaceState({}, '', '/checker'); // Clean URL
    }
  }, []);

  useEffect(() => {
    if (debouncedPassword) {
      analyzeMutation.mutate({ data: { password: debouncedPassword } });
    }
  }, [debouncedPassword]);

  const analysis = analyzeMutation.data;
  const isPending = analyzeMutation.isPending;

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied to clipboard",
      description: "Password has been copied to your clipboard.",
    });
  };

  const getStrengthColor = (score: number) => {
    if (score < 20) return "bg-red-500";
    if (score < 40) return "bg-orange-500";
    if (score < 60) return "bg-yellow-500";
    if (score < 80) return "bg-green-500";
    return "bg-emerald-500";
  };

  const getTextColor = (score: number) => {
    if (score < 20) return "text-red-500";
    if (score < 40) return "text-orange-500";
    if (score < 60) return "text-yellow-500";
    if (score < 80) return "text-green-500";
    return "text-emerald-500";
  };

  return (
    <div className="flex-1 py-10">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Password Analyzer</h1>
          <p className="text-muted-foreground">
            Test the strength of your password against modern brute-force and dictionary attacks.
          </p>
        </div>

        <Card className="mb-8 border-primary/20 shadow-lg">
          <CardContent className="pt-6">
            <div className="relative mb-6">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password to analyze..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-16 text-xl px-4 bg-background pr-24 font-mono"
                autoFocus
              />
              <div className="absolute right-2 top-3 flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 text-muted-foreground"
                  onClick={copyToClipboard}
                  disabled={!password}
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {password && (
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {isPending && !analysis ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                      Analyzing...
                    </div>
                  ) : analysis ? (
                    <>
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                        <div>
                          <div className="text-sm text-muted-foreground font-medium mb-1">Overall Strength</div>
                          <div className={`text-3xl font-bold ${getTextColor(analysis.score)}`}>
                            {analysis.strengthLabel}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold tracking-tighter">
                            {analysis.score}<span className="text-xl text-muted-foreground font-normal">/100</span>
                          </div>
                        </div>
                      </div>
                      
                      <Progress 
                        value={analysis.score} 
                        className="h-3"
                        indicatorClassName={getStrengthColor(analysis.score)}
                      />

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Crack Time
                          </div>
                          <div className="font-semibold">{analysis.crackTime}</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Shield className="h-3 w-3" /> Entropy
                          </div>
                          <div className="font-semibold">{analysis.entropy.toFixed(1)} bits</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">Length</div>
                          <div className="font-semibold">{analysis.charCount} chars</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="text-xs text-muted-foreground mb-1">Character Types</div>
                          <div className="font-semibold flex gap-2">
                            {analysis.uppercaseCount > 0 && <Badge variant="outline" className="px-1 py-0 h-5">A</Badge>}
                            {analysis.lowercaseCount > 0 && <Badge variant="outline" className="px-1 py-0 h-5">a</Badge>}
                            {analysis.digitCount > 0 && <Badge variant="outline" className="px-1 py-0 h-5">1</Badge>}
                            {analysis.symbolCount > 0 && <Badge variant="outline" className="px-1 py-0 h-5">#</Badge>}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            )}
          </CardContent>
        </Card>

        {password && analysis && (
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Vulnerabilities & Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.suggestions.length > 0 ? (
                    <ul className="space-y-3">
                      {analysis.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex gap-2 text-sm">
                          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center py-6 text-muted-foreground">
                      <CheckCircle2 className="h-10 w-10 text-green-500 mb-2" />
                      <p>No major vulnerabilities found.<br/>This is a strong password.</p>
                    </div>
                  )}

                  {(analysis.hasCommonPattern || analysis.hasRepeatedChars || analysis.hasSequentialChars || analysis.isDictionaryWord) && (
                    <div className="mt-6 space-y-2">
                      <h4 className="text-sm font-semibold mb-2">Detected Patterns:</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.isDictionaryWord && <Badge variant="destructive">Dictionary Word</Badge>}
                        {analysis.hasCommonPattern && <Badge variant="destructive">Common Pattern</Badge>}
                        {analysis.hasRepeatedChars && <Badge variant="secondary">Repeated Characters</Badge>}
                        {analysis.hasSequentialChars && <Badge variant="secondary">Sequential Characters</Badge>}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Score Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Length ({analysis.breakdown.lengthScore}/40)</span>
                    </div>
                    <Progress value={(analysis.breakdown.lengthScore / 40) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Variety ({analysis.breakdown.varietyScore}/30)</span>
                    </div>
                    <Progress value={(analysis.breakdown.varietyScore / 30) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Unpredictability ({analysis.breakdown.patternScore}/10)</span>
                    </div>
                    <Progress value={(analysis.breakdown.patternScore / 10) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Entropy Bonus ({Math.min(analysis.breakdown.entropyScore, 20)}/20)</span>
                    </div>
                    <Progress value={(Math.min(analysis.breakdown.entropyScore, 20) / 20) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
