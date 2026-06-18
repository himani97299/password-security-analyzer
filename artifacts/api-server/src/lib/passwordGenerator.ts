export interface GeneratorOptions {
  length: number;
  useUppercase: boolean;
  useLowercase: boolean;
  useDigits: boolean;
  useSymbols: boolean;
  excludeSimilar: boolean;
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const UPPERCASE_NO_SIMILAR = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const LOWERCASE_NO_SIMILAR = "abcdefghjkmnpqrstuvwxyz";
const DIGITS = "0123456789";
const DIGITS_NO_SIMILAR = "23456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

export function generatePassword(options: GeneratorOptions): string {
  const {
    length,
    useUppercase,
    useLowercase,
    useDigits,
    useSymbols,
    excludeSimilar,
  } = options;

  const charsets: string[] = [];
  const guaranteedChars: string[] = [];

  if (useUppercase) {
    const set = excludeSimilar ? UPPERCASE_NO_SIMILAR : UPPERCASE;
    charsets.push(set);
    guaranteedChars.push(set[Math.floor(Math.random() * set.length)]);
  }
  if (useLowercase) {
    const set = excludeSimilar ? LOWERCASE_NO_SIMILAR : LOWERCASE;
    charsets.push(set);
    guaranteedChars.push(set[Math.floor(Math.random() * set.length)]);
  }
  if (useDigits) {
    const set = excludeSimilar ? DIGITS_NO_SIMILAR : DIGITS;
    charsets.push(set);
    guaranteedChars.push(set[Math.floor(Math.random() * set.length)]);
  }
  if (useSymbols) {
    charsets.push(SYMBOLS);
    guaranteedChars.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
  }

  if (charsets.length === 0) {
    throw new Error("At least one character type must be selected");
  }

  const fullCharset = charsets.join("");
  const remaining = length - guaranteedChars.length;

  const randomChars: string[] = [];
  for (let i = 0; i < remaining; i++) {
    randomChars.push(fullCharset[Math.floor(Math.random() * fullCharset.length)]);
  }

  const allChars = [...guaranteedChars, ...randomChars];
  // Fisher-Yates shuffle
  for (let i = allChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allChars[i], allChars[j]] = [allChars[j], allChars[i]];
  }

  return allChars.join("");
}
