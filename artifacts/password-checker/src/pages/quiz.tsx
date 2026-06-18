import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const QUIZ_QUESTIONS = [
  {
    question: "Which of the following makes a password most resilient to brute-force attacks?",
    options: [
      "Including at least one symbol (!@#)",
      "Changing it every 30 days",
      "Increasing its length",
      "Using a mix of upper and lowercase letters"
    ],
    correctAnswer: 2,
    explanation: "Length is the most significant factor in password entropy. Adding a single character to an already long password increases its strength exponentially more than adding a symbol to a short password."
  },
  {
    question: "What is 'Credential Stuffing'?",
    options: [
      "Storing passwords in plain text",
      "Using passwords stolen from one site to log into other sites",
      "A database overflow attack",
      "Trying millions of random passwords automatically"
    ],
    correctAnswer: 1,
    explanation: "Credential stuffing occurs when attackers take a database of usernames and passwords breached from one service, and programmatically try them on thousands of other services hoping users reused their passwords."
  },
  {
    question: "Which password is the strongest?",
    options: [
      "P@ssw0rd2024!",
      "MyDogFluffy123",
      "correct horse battery staple",
      "A$b#9zQp"
    ],
    correctAnswer: 2,
    explanation: "A randomly generated passphrase of common words ('correct horse battery staple') is extremely long and thus has high entropy against computers, while remaining relatively easy for humans to remember."
  },
  {
    question: "What is the primary purpose of a 'Salt' in password hashing?",
    options: [
      "To make the password taste better",
      "To prevent attackers from using pre-computed rainbow tables",
      "To encrypt the password so it can be decrypted later",
      "To force users to use complex characters"
    ],
    correctAnswer: 1,
    explanation: "A salt is random data added to a password before hashing. It ensures that two users with the exact same password will have completely different hashes, neutralizing pre-computed dictionary attacks (rainbow tables)."
  },
  {
    question: "How often should you ideally change your passwords?",
    options: [
      "Every 30 days",
      "Every 90 days",
      "Once a year",
      "Only if there is a known breach or suspected compromise"
    ],
    correctAnswer: 3,
    explanation: "NIST guidelines now state that forcing arbitrary password changes causes users to create weaker passwords (like Password123 -> Password124). Passwords should only be changed if there is evidence of compromise."
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswered(true);
    if (selectedAnswer === QUIZ_QUESTIONS[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  const q = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + (showResults ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="flex-1 py-10 flex items-center justify-center">
      <div className="container px-4 mx-auto max-w-2xl">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Security Quiz</h1>
          <Progress value={progress} className="h-2 mb-2" />
          <div className="text-sm text-muted-foreground text-right">
            Question {showResults ? QUIZ_QUESTIONS.length : currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl leading-relaxed">
                    {q.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {q.options.map((option, index) => {
                    let btnVariant: "outline" | "default" | "destructive" | "secondary" = "outline";
                    let showIcon = null;

                    if (isAnswered) {
                      if (index === q.correctAnswer) {
                        btnVariant = "default";
                        showIcon = <CheckCircle2 className="h-5 w-5 ml-auto text-green-300" />;
                      } else if (index === selectedAnswer) {
                        btnVariant = "destructive";
                        showIcon = <XCircle className="h-5 w-5 ml-auto text-white" />;
                      } else {
                        btnVariant = "secondary";
                      }
                    } else if (selectedAnswer === index) {
                      btnVariant = "default";
                    }

                    return (
                      <Button
                        key={index}
                        variant={btnVariant}
                        className={`w-full justify-start h-auto py-4 px-6 text-left whitespace-normal ${
                          isAnswered && index === q.correctAnswer ? 'bg-green-600 hover:bg-green-700 text-white' : ''
                        }`}
                        onClick={() => handleSelect(index)}
                        disabled={isAnswered}
                      >
                        <span className="mr-4 text-muted-foreground font-mono">{String.fromCharCode(65 + index)}.</span>
                        <span>{option}</span>
                        {showIcon}
                      </Button>
                    );
                  })}

                  {isAnswered && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6 p-4 bg-muted/50 rounded-lg text-sm border border-primary/20"
                    >
                      <span className="font-bold text-primary mr-2">Explanation:</span>
                      {q.explanation}
                    </motion.div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end pt-4 border-t">
                  {!isAnswered ? (
                    <Button onClick={handleSubmit} disabled={selectedAnswer === null} size="lg">
                      Submit Answer
                    </Button>
                  ) : (
                    <Button onClick={handleNext} size="lg" className="gap-2">
                      {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="text-center py-10">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-6xl font-bold mb-4">
                    {score}<span className="text-3xl text-muted-foreground font-normal">/{QUIZ_QUESTIONS.length}</span>
                  </div>
                  <p className="text-lg text-muted-foreground mb-8">
                    {score === QUIZ_QUESTIONS.length ? "Perfect score! You're a security expert." : 
                     score >= QUIZ_QUESTIONS.length / 2 ? "Good job! You know your basics." : 
                     "Keep learning! Review the Learn section to improve your security knowledge."}
                  </p>
                  <Button size="lg" onClick={handleRetake} variant="outline" className="gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    Retake Quiz
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
