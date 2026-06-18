const COMMON_PASSWORDS = new Set([
  "password", "123456", "password1", "12345678", "qwerty", "abc123",
  "monkey", "1234567", "letmein", "trustno1", "dragon", "baseball",
  "iloveyou", "master", "sunshine", "ashley", "bailey", "passw0rd",
  "shadow", "123123", "654321", "superman", "qazwsx", "michael",
  "football", "password2", "welcome", "charlie", "donald", "password123",
  "admin", "login", "hello", "qwerty123", "1q2w3e4r", "zxcvbn",
  "test", "pass", "passw", "root", "access", "internet",
]);

const SEQUENTIAL_PATTERNS = [
  "0123456789", "abcdefghijklmnopqrstuvwxyz", "qwertyuiop", "asdfghjkl", "zxcvbnm",
];

function calculateEntropy(password: string): number {
  const charsetSize = getCharsetSize(password);
  if (charsetSize === 0) return 0;
  return Math.log2(Math.pow(charsetSize, password.length));
}

function getCharsetSize(password: string): number {
  let size = 0;
  if (/[a-z]/.test(password)) size += 26;
  if (/[A-Z]/.test(password)) size += 26;
  if (/[0-9]/.test(password)) size += 10;
  if (/[^a-zA-Z0-9]/.test(password)) size += 32;
  return size;
}

function estimateCrackTime(entropy: number): string {
  const guessesPerSecond = 1e10;
  const possibleCombinations = Math.pow(2, entropy);
  const averageGuesses = possibleCombinations / 2;
  const secondsTocrack = averageGuesses / guessesPerSecond;

  if (secondsTocrack < 1) return "instantly";
  if (secondsTocrack < 60) return `${Math.round(secondsTocrack)} seconds`;
  if (secondsTocrack < 3600) return `${Math.round(secondsTocrack / 60)} minutes`;
  if (secondsTocrack < 86400) return `${Math.round(secondsTocrack / 3600)} hours`;
  if (secondsTocrack < 2592000) return `${Math.round(secondsTocrack / 86400)} days`;
  if (secondsTocrack < 31536000) return `${Math.round(secondsTocrack / 2592000)} months`;
  if (secondsTocrack < 3153600000) return `${Math.round(secondsTocrack / 31536000)} years`;
  if (secondsTocrack < 315360000000) return `${Math.round(secondsTocrack / 3153600000)} centuries`;
  return "centuries";
}

function hasRepeatedChars(password: string): boolean {
  for (let i = 0; i < password.length - 2; i++) {
    if (password[i] === password[i + 1] && password[i + 1] === password[i + 2]) return true;
  }
  return false;
}

function hasSequentialChars(password: string): boolean {
  const lower = password.toLowerCase();
  for (const seq of SEQUENTIAL_PATTERNS) {
    for (let i = 0; i < lower.length - 2; i++) {
      const sub = lower.slice(i, i + 3);
      if (seq.includes(sub)) return true;
      const reversed = sub.split("").reverse().join("");
      if (seq.includes(reversed)) return true;
    }
  }
  return false;
}

function hasCommonPattern(password: string): boolean {
  const lower = password.toLowerCase();
  const patterns = [
    /^[a-zA-Z]+[0-9]+$/, // letters then numbers
    /^[0-9]+[a-zA-Z]+$/, // numbers then letters
    /(.)\1{2,}/,          // repeated character 3+ times
    /^[a-zA-Z]+!$|^[a-zA-Z]+\d+!?$/, // word + numbers + optional !
    /^(.)(.)\1\2\1\2/,   // abab pattern
  ];
  return patterns.some(p => p.test(lower));
}

function isDictionaryWord(password: string): boolean {
  const lower = password.toLowerCase();
  const stripped = lower.replace(/[^a-z]/g, "");
  return COMMON_PASSWORDS.has(stripped) || COMMON_PASSWORDS.has(lower);
}

export interface PasswordAnalysis {
  score: number;
  strengthLabel: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong" | "Very Strong";
  strengthLevel: number;
  entropy: number;
  charCount: number;
  uppercaseCount: number;
  lowercaseCount: number;
  digitCount: number;
  symbolCount: number;
  crackTime: string;
  suggestions: string[];
  breakdown: {
    lengthScore: number;
    varietyScore: number;
    patternScore: number;
    entropyScore: number;
  };
  hasCommonPattern: boolean;
  hasRepeatedChars: boolean;
  hasSequentialChars: boolean;
  isDictionaryWord: boolean;
}

export function analyzePassword(password: string): PasswordAnalysis {
  if (!password) {
    return {
      score: 0,
      strengthLabel: "Very Weak",
      strengthLevel: 0,
      entropy: 0,
      charCount: 0,
      uppercaseCount: 0,
      lowercaseCount: 0,
      digitCount: 0,
      symbolCount: 0,
      crackTime: "instantly",
      suggestions: ["Enter a password to analyze"],
      breakdown: { lengthScore: 0, varietyScore: 0, patternScore: 0, entropyScore: 0 },
      hasCommonPattern: false,
      hasRepeatedChars: false,
      hasSequentialChars: false,
      isDictionaryWord: false,
    };
  }

  const charCount = password.length;
  const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
  const lowercaseCount = (password.match(/[a-z]/g) || []).length;
  const digitCount = (password.match(/[0-9]/g) || []).length;
  const symbolCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;

  const repeated = hasRepeatedChars(password);
  const sequential = hasSequentialChars(password);
  const commonPattern = hasCommonPattern(password);
  const dictWord = isDictionaryWord(password);

  // Length score (0-30)
  let lengthScore = 0;
  if (charCount >= 8) lengthScore = 10;
  if (charCount >= 12) lengthScore = 20;
  if (charCount >= 16) lengthScore = 25;
  if (charCount >= 20) lengthScore = 30;

  // Variety score (0-30)
  let varietyScore = 0;
  const hasLower = lowercaseCount > 0;
  const hasUpper = uppercaseCount > 0;
  const hasDigit = digitCount > 0;
  const hasSymbol = symbolCount > 0;
  const typeCount = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
  varietyScore = typeCount * 7;
  if (typeCount === 4) varietyScore = 30;

  // Pattern score (0-20) — penalize bad patterns
  let patternScore = 20;
  if (commonPattern) patternScore -= 8;
  if (repeated) patternScore -= 5;
  if (sequential) patternScore -= 5;
  if (dictWord) patternScore -= 15;
  patternScore = Math.max(0, patternScore);

  // Entropy score (0-20)
  const entropy = calculateEntropy(password);
  let entropyScore = 0;
  if (entropy >= 30) entropyScore = 5;
  if (entropy >= 40) entropyScore = 10;
  if (entropy >= 50) entropyScore = 15;
  if (entropy >= 60) entropyScore = 20;

  let score = Math.min(100, lengthScore + varietyScore + patternScore + entropyScore);

  // Hard cap if dictionary word
  if (dictWord) score = Math.min(score, 20);

  // Strength label
  let strengthLabel: PasswordAnalysis["strengthLabel"];
  let strengthLevel: number;
  if (score < 15) { strengthLabel = "Very Weak"; strengthLevel = 0; }
  else if (score < 35) { strengthLabel = "Weak"; strengthLevel = 1; }
  else if (score < 55) { strengthLabel = "Fair"; strengthLevel = 2; }
  else if (score < 70) { strengthLabel = "Good"; strengthLevel = 3; }
  else if (score < 85) { strengthLabel = "Strong"; strengthLevel = 4; }
  else { strengthLabel = "Very Strong"; strengthLevel = 5; }

  // Suggestions
  const suggestions: string[] = [];
  if (charCount < 12) suggestions.push("Increase password length to at least 12 characters");
  if (charCount < 16) suggestions.push("Use 16+ characters for maximum security");
  if (!hasUpper) suggestions.push("Add uppercase letters (A-Z)");
  if (!hasLower) suggestions.push("Add lowercase letters (a-z)");
  if (!hasDigit) suggestions.push("Add numbers (0-9)");
  if (!hasSymbol) suggestions.push("Add special characters (!, @, #, $, %, etc.)");
  if (repeated) suggestions.push("Avoid repeating the same character 3+ times");
  if (sequential) suggestions.push("Avoid sequential patterns like 'abc' or '123'");
  if (commonPattern) suggestions.push("Avoid predictable patterns like 'word123'");
  if (dictWord) suggestions.push("Avoid using common dictionary words");
  if (suggestions.length === 0) suggestions.push("Great password! Consider using a password manager to remember it.");

  const crackTime = estimateCrackTime(entropy);

  return {
    score,
    strengthLabel,
    strengthLevel,
    entropy: Math.round(entropy * 10) / 10,
    charCount,
    uppercaseCount,
    lowercaseCount,
    digitCount,
    symbolCount,
    crackTime,
    suggestions,
    breakdown: { lengthScore, varietyScore, patternScore, entropyScore },
    hasCommonPattern: commonPattern,
    hasRepeatedChars: repeated,
    hasSequentialChars: sequential,
    isDictionaryWord: dictWord,
  };
}
