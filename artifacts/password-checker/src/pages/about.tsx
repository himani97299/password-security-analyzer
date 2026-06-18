import { Shield, Lock, Server, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="flex-1 py-10">
      <div className="container px-4 mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Fortify</h1>
          <p className="text-lg text-muted-foreground">
            A professional security tool built to educate and protect.
          </p>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Shield className="text-primary h-6 w-6" /> 
              Privacy First
            </h2>
            <Card>
              <CardContent className="p-6">
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  When dealing with passwords, privacy isn't just a feature—it's the entire product. 
                  Fortify is built with a strict zero-knowledge architecture regarding your credentials.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Server className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-foreground">No Persistent Storage</strong>
                      <span className="text-sm text-muted-foreground">Passwords are analyzed in memory on the server and immediately discarded. Nothing touches a database.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-foreground">Secure Transmission</strong>
                      <span className="text-sm text-muted-foreground">All data is transmitted via TLS/SSL encrypted channels.</span>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How the Analyzer Works</h2>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
              <p>
                The Fortify analyzer doesn't just count characters. It uses advanced algorithms to determine 
                the true entropy and resilience of a password:
              </p>
              <ul>
                <li><strong>Dictionary Checks:</strong> Scans against thousands of common English words and known leaked passwords.</li>
                <li><strong>Pattern Detection:</strong> Identifies predictable sequences (1234, qwerty), repeated characters, and keyboard walks.</li>
                <li><strong>Entropy Calculation:</strong> Calculates the mathematical bits of entropy based on the length and the variety of the character space utilized.</li>
                <li><strong>Crack Time Estimation:</strong> Computes the approximate time it would take a modern offline hashing rig to brute-force the credential.</li>
              </ul>
            </div>
          </section>

          <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Version 1.0.0 • Built with React & TypeScript
            </div>
            <Button variant="outline" className="gap-2">
              <Github className="h-4 w-4" />
              View Source
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
