export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  avoidAmbiguous: boolean;
}

export interface PasswordAnalysis {
  entropy: number;
  strength: "very_weak" | "weak" | "fair" | "strong" | "very_strong";
  score: number; // 0 to 100
  crackTime: string;
  crackTimePt: string;
}

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS = /[il1Lo0O]/g;

export function generatePassword(options: PasswordOptions): string {
  let charPool = "";
  if (options.includeLowercase) charPool += LOWERCASE;
  if (options.includeUppercase) charPool += UPPERCASE;
  if (options.includeNumbers) charPool += NUMBERS;
  if (options.includeSymbols) charPool += SYMBOLS;

  if (options.avoidAmbiguous) {
    charPool = charPool.replace(AMBIGUOUS, "");
  }

  if (!charPool || options.length <= 0) return "";

  const randomValues = new Uint32Array(options.length);
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(randomValues);
  } else {
    for (let i = 0; i < options.length; i++) {
      randomValues[i] = Math.floor(Math.random() * 0xffffffff);
    }
  }

  let result = "";
  for (let i = 0; i < options.length; i++) {
    result += charPool[randomValues[i] % charPool.length];
  }

  // Ensure at least one character from each selected set is present if length permits
  const requiredSets: string[] = [];
  if (options.includeLowercase) requiredSets.push(options.avoidAmbiguous ? LOWERCASE.replace(AMBIGUOUS, "") : LOWERCASE);
  if (options.includeUppercase) requiredSets.push(options.avoidAmbiguous ? UPPERCASE.replace(AMBIGUOUS, "") : UPPERCASE);
  if (options.includeNumbers) requiredSets.push(options.avoidAmbiguous ? NUMBERS.replace(AMBIGUOUS, "") : NUMBERS);
  if (options.includeSymbols) requiredSets.push(options.avoidAmbiguous ? SYMBOLS.replace(AMBIGUOUS, "") : SYMBOLS);

  if (options.length >= requiredSets.length && requiredSets.length > 1) {
    const chars = result.split("");
    for (let i = 0; i < requiredSets.length; i++) {
      const set = requiredSets[i];
      const hasChar = chars.some((c) => set.includes(c));
      if (!hasChar && set.length > 0) {
        const replaceIdx = randomValues[i] % chars.length;
        const randomChar = set[randomValues[i] % set.length];
        chars[replaceIdx] = randomChar;
      }
    }
    result = chars.join("");
  }

  return result;
}

export function analyzePassword(password: string): PasswordAnalysis {
  if (!password) {
    return {
      entropy: 0,
      strength: "very_weak",
      score: 0,
      crackTime: "Instant",
      crackTimePt: "Instantâneo",
    };
  }

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  if (poolSize === 0) poolSize = 1;

  // Shannon Entropy: L * log2(PoolSize)
  const entropy = Math.round(password.length * Math.log2(poolSize));

  let strength: PasswordAnalysis["strength"] = "very_weak";
  let score = Math.min(100, Math.round((entropy / 128) * 100));

  if (entropy < 28) {
    strength = "very_weak";
  } else if (entropy < 40) {
    strength = "weak";
  } else if (entropy < 60) {
    strength = "fair";
  } else if (entropy < 80) {
    strength = "strong";
  } else {
    strength = "very_strong";
  }

  // Estimate crack time based on 100 billion guesses/second (modern GPU cluster)
  const combinations = Math.pow(poolSize, password.length);
  const seconds = combinations / 1e11;

  const { en, pt } = formatCrackTime(seconds);

  return {
    entropy,
    strength,
    score,
    crackTime: en,
    crackTimePt: pt,
  };
}

function formatCrackTime(seconds: number): { en: string; pt: string } {
  if (seconds < 1) return { en: "Instant", pt: "Instantâneo" };
  if (seconds < 60) return { en: `${Math.round(seconds)} seconds`, pt: `${Math.round(seconds)} segundos` };
  if (seconds < 3600) return { en: `${Math.round(seconds / 60)} minutes`, pt: `${Math.round(seconds / 60)} minutos` };
  if (seconds < 86400) return { en: `${Math.round(seconds / 3600)} hours`, pt: `${Math.round(seconds / 3600)} horas` };
  if (seconds < 31536000) return { en: `${Math.round(seconds / 86400)} days`, pt: `${Math.round(seconds / 86400)} dias` };
  if (seconds < 31536000 * 100) return { en: `${Math.round(seconds / 31536000)} years`, pt: `${Math.round(seconds / 31536000)} anos` };
  if (seconds < 31536000 * 1000000) return { en: `${Math.round(seconds / (31536000 * 1000))}k years`, pt: `${Math.round(seconds / (31536000 * 1000))} mil anos` };
  return { en: "Centuries / Uncrackable", pt: "Séculos / Inviolável" };
}
