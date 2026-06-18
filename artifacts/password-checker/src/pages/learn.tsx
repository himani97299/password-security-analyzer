import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Shield, Key, AlertTriangle, Fingerprint, Network } from "lucide-react";
import { motion } from "framer-motion";

export default function Learn() {
  const concepts = [
    {
      title: "Entropy",
      icon: <Network className="h-6 w-6 text-primary" />,
      description: "Password entropy is a measure of how unpredictable a password is. It's calculated in 'bits'. A password with 100 bits of entropy would take billions of years to crack, while a 30-bit password could be cracked in seconds.",
    },
    {
      title: "Dictionary Attacks",
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      description: "Attackers use massive lists of common words, leaked passwords, and predictable substitutions (like replacing 'a' with '@'). This is why 'P@ssw0rd1' is extremely weak despite having symbols and numbers.",
    },
    {
      title: "Credential Stuffing",
      icon: <AlertTriangle className="h-6 w-6 text-primary" />,
      description: "When a website is breached, attackers take those usernames and passwords and try them on thousands of other sites automatically. Never reuse passwords across important accounts.",
    },
    {
      title: "Password Managers",
      icon: <Key className="h-6 w-6 text-primary" />,
      description: "The best way to manage passwords is to not know them. Use a password manager to generate and store unique, long, random passwords for every single service. You only need to remember one strong master password.",
    },
    {
      title: "Multi-Factor Authentication",
      icon: <Shield className="h-6 w-6 text-primary" />,
      description: "MFA (or 2FA) adds a second layer of defense. Even if an attacker steals your perfect password, they still can't access your account without your physical device or authentication app.",
    },
    {
      title: "Passphrases",
      icon: <Fingerprint className="h-6 w-6 text-primary" />,
      description: "For passwords you must remember (like your computer login or master password), use a passphrase: 4-6 random words strung together. Example: 'correct horse battery staple'. They are long (high entropy) but easy for humans to remember.",
    }
  ];

  return (
    <div className="flex-1 py-10">
      <div className="container px-4 mx-auto max-w-5xl">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Security Knowledge Base</h1>
          <p className="text-lg text-muted-foreground">
            Understanding how authentication systems are attacked is the first step in defending them.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {concepts.map((concept, index) => (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-muted-foreground/20 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="mb-4 bg-muted/50 w-12 h-12 rounded-lg flex items-center justify-center">
                    {concept.icon}
                  </div>
                  <CardTitle className="text-xl">{concept.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {concept.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-card border rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">Common Weak Patterns</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center font-mono">
              Keyboard Walks
              <div className="text-sm opacity-80 mt-1">qwertyuiop, asdfghjkl</div>
            </div>
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center font-mono">
              Dates & Years
              <div className="text-sm opacity-80 mt-1">Summer2023!, John1990</div>
            </div>
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center font-mono">
              Simple Appends
              <div className="text-sm opacity-80 mt-1">Password123, Netflix!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
