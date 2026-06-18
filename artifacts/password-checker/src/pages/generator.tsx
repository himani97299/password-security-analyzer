import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield, Copy, RefreshCw, SlidersHorizontal, Settings2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGeneratePassword } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function Generator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [length, setLength] = useState([16]);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  
  const generateMutation = useGeneratePassword();

  const handleGenerate = () => {
    // Ensure at least one character type is selected
    if (!useUppercase && !useLowercase && !useDigits && !useSymbols) {
      setUseLowercase(true);
      toast({
        title: "Configuration adjusted",
        description: "At least one character type must be selected.",
        variant: "destructive"
      });
      return;
    }

    generateMutation.mutate({
      data: {
        length: length[0],
        useUppercase,
        useLowercase,
        useDigits,
        useSymbols,
        excludeSimilar
      }
    });
  };

  // Initial generation
  useEffect(() => {
    handleGenerate();
  }, []);

  const result = generateMutation.data;
  const isPending = generateMutation.isPending;

  const copyToClipboard = () => {
    if (!result?.password) return;
    navigator.clipboard.writeText(result.password);
    toast({
      title: "Password copied",
      description: "Secure password has been copied to your clipboard.",
    });
  };

  return (
    <div className="flex-1 py-10">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Secure Password Generator</h1>
          <p className="text-muted-foreground">
            Create cryptographically strong passwords tailored to your requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_350px] gap-8">
          <div className="space-y-6">
            <Card className="border-primary/20 shadow-lg overflow-hidden relative">
              {isPending && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              <CardContent className="pt-6">
                <div className="relative mb-4">
                  <Input
                    type="text"
                    value={result?.password || ""}
                    readOnly
                    className="h-20 text-2xl md:text-3xl px-4 bg-muted/30 pr-32 font-mono text-center tracking-wider"
                  />
                  <div className="absolute right-2 top-4 flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-12 w-12"
                      onClick={handleGenerate}
                      disabled={isPending}
                    >
                      <RefreshCw className={`h-5 w-5 ${isPending ? "animate-spin" : ""}`} />
                    </Button>
                    <Button 
                      variant="default" 
                      size="icon" 
                      className="h-12 w-12"
                      onClick={copyToClipboard}
                      disabled={!result?.password}
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {result?.analysis && (
                  <div className="flex items-center justify-between border-t pt-4 mt-2">
                    <div className="flex items-center gap-3">
                      <Shield className={`h-5 w-5 ${
                        result.analysis.score > 80 ? "text-emerald-500" :
                        result.analysis.score > 60 ? "text-green-500" :
                        result.analysis.score > 40 ? "text-yellow-500" : "text-orange-500"
                      }`} />
                      <span className="font-medium text-sm">
                        {result.analysis.strengthLabel} ({result.analysis.entropy.toFixed(0)} bits)
                      </span>
                    </div>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="h-auto p-0 text-muted-foreground flex items-center gap-1"
                      onClick={() => setLocation(`/checker?p=${encodeURIComponent(result.password)}`)}
                    >
                      Analyze <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base">Password Length</Label>
                    <span className="text-2xl font-bold text-primary">{length[0]}</span>
                  </div>
                  <Slider
                    value={length}
                    onValueChange={setLength}
                    onPointerUp={handleGenerate}
                    max={128}
                    min={8}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>8 (Min)</span>
                    <span>128 (Max)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  Character Sets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="uppercase" className="text-base cursor-pointer">Uppercase</Label>
                    <p className="text-xs text-muted-foreground">A-Z</p>
                  </div>
                  <Switch 
                    id="uppercase" 
                    checked={useUppercase} 
                    onCheckedChange={(v) => { setUseUppercase(v); setTimeout(handleGenerate, 0); }} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="lowercase" className="text-base cursor-pointer">Lowercase</Label>
                    <p className="text-xs text-muted-foreground">a-z</p>
                  </div>
                  <Switch 
                    id="lowercase" 
                    checked={useLowercase} 
                    onCheckedChange={(v) => { setUseLowercase(v); setTimeout(handleGenerate, 0); }} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="digits" className="text-base cursor-pointer">Numbers</Label>
                    <p className="text-xs text-muted-foreground">0-9</p>
                  </div>
                  <Switch 
                    id="digits" 
                    checked={useDigits} 
                    onCheckedChange={(v) => { setUseDigits(v); setTimeout(handleGenerate, 0); }} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="symbols" className="text-base cursor-pointer">Symbols</Label>
                    <p className="text-xs text-muted-foreground">!@#$%^&*</p>
                  </div>
                  <Switch 
                    id="symbols" 
                    checked={useSymbols} 
                    onCheckedChange={(v) => { setUseSymbols(v); setTimeout(handleGenerate, 0); }} 
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="exclude" className="text-base cursor-pointer">Exclude Similar</Label>
                      <p className="text-xs text-muted-foreground">Removes 1, l, I, 0, O, etc.</p>
                    </div>
                    <Switch 
                      id="exclude" 
                      checked={excludeSimilar} 
                      onCheckedChange={(v) => { setExcludeSimilar(v); setTimeout(handleGenerate, 0); }} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
