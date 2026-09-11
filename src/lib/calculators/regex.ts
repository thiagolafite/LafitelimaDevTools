export interface RegexMatch {
  index: number;
  length: number;
  text: string;
  groups: { index: number; name?: string; value: string }[];
  line: number;
  column: number;
}

export interface RegexHighlightSegment {
  text: string;
  isMatch: boolean;
  matchIndex?: number;
}

export interface RegexPreset {
  name: { en: string; pt: string };
  pattern: string;
  flags: string;
  description: { en: string; pt: string };
  sampleText: string;
}

export const REGEX_PRESETS: RegexPreset[] = [
  {
    name: { en: "Email Address", pt: "Endereço de E-mail" },
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
    flags: "g",
    description: {
      en: "Matches standard RFC-compliant email addresses",
      pt: "Valida e extrai e-mails comuns no formato nome@dominio.com",
    },
    sampleText: "Contact support@lafitelima.com.br or developer.team@company.org for assistance.",
  },
  {
    name: { en: "URL / Web Link", pt: "URL / Link Web" },
    pattern: "https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)",
    flags: "g",
    description: {
      en: "Matches HTTP and HTTPS URLs with paths, queries and hashes",
      pt: "Captura links completos HTTP e HTTPS com parâmetros e rotas",
    },
    sampleText: "Visit https://devtools.lafitelima.com.br/pt or https://github.com/thiagolafite today.",
  },
  {
    name: { en: "Brazilian Phone (Telefone BR)", pt: "Telefone do Brasil (DDD + Número)" },
    pattern: "(?:\\+55\\s?)?(?:\\(?\\d{2}\\)?[\\s-]?)?(?:9?\\d{4})[\\s-]?\\d{4}",
    flags: "g",
    description: {
      en: "Matches Brazilian landline and mobile phone numbers with optional DDD",
      pt: "Reconhece telefones fixos e celulares brasileiros com ou sem DDD (ex: (11) 98765-4321)",
    },
    sampleText: "Ligue para (11) 98765-4321 ou (21) 3456-7890 para falar com a equipe.",
  },
  {
    name: { en: "Brazilian CPF", pt: "CPF Brasileiro" },
    pattern: "\\b\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}\\b",
    flags: "g",
    description: {
      en: "Matches formatted or unformatted 11-digit Brazilian CPF numbers",
      pt: "Localiza números de CPF com ou sem pontuação (000.000.000-00 ou 00000000000)",
    },
    sampleText: "Documentos: 123.456.789-00 e 98765432100 para validação cadastral.",
  },
  {
    name: { en: "IPv4 Address", pt: "Endereço IPv4" },
    pattern: "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b",
    flags: "g",
    description: {
      en: "Matches valid IPv4 addresses in dotted-decimal format (0-255)",
      pt: "Valida endereços IP versão 4 nos limites de 0.0.0.0 a 255.255.255.255",
    },
    sampleText: "Server bound to 127.0.0.1, gateway at 192.168.1.1, external DNS 8.8.8.8.",
  },
  {
    name: { en: "Date (DD/MM/YYYY or YYYY-MM-DD)", pt: "Data (DD/MM/AAAA ou AAAA-MM-DD)" },
    pattern: "\\b(?:(?:0[1-9]|[12][0-9]|3[01])\\/(?:0[1-9]|1[0-2])\\/\\d{4}|\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01]))\\b",
    flags: "g",
    description: {
      en: "Matches calendar dates in Brazilian (DD/MM/YYYY) or ISO (YYYY-MM-DD) formats",
      pt: "Captura datas no padrão nacional DD/MM/AAAA e formato ISO YYYY-MM-DD",
    },
    sampleText: "Eventos marcados para 25/12/2026 e 2026-09-10 no sistema.",
  },
  {
    name: { en: "Hex Color Code", pt: "Código de Cor Hexadecimal" },
    pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b",
    flags: "gi",
    description: {
      en: "Matches 3-digit and 6-digit HTML hex color codes",
      pt: "Localiza códigos hexadecimais de cor (#FFF, #3b82f6, #10b981)",
    },
    sampleText: "Primary brand colors are #3b82f6, #10b981 and background #FFFFFF.",
  },
  {
    name: { en: "UUID / GUID", pt: "Identificador UUID / GUID" },
    pattern: "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}",
    flags: "gi",
    description: {
      en: "Matches RFC 4122 compliant UUID v1, v4 and v5 strings",
      pt: "Identifica chaves UUID/GUID de 128 bits no formato 8-4-4-4-12",
    },
    sampleText: "User session: 57b6a3c6-582b-4bc3-bee6-c65cfe491b94 in database.",
  },
];

export interface RegexExecutionResult {
  isValid: boolean;
  error?: string;
  matches: RegexMatch[];
  matchCount: number;
  highlightSegments: RegexHighlightSegment[];
  replacedText?: string;
  executionTimeMs: number;
}

export function executeRegex(
  pattern: string,
  flags: string,
  testText: string,
  replacement?: string
): RegexExecutionResult {
  const startTime = performance.now();

  if (!pattern) {
    return {
      isValid: true,
      matches: [],
      matchCount: 0,
      highlightSegments: [{ text: testText, isMatch: false }],
      replacedText: testText,
      executionTimeMs: 0,
    };
  }

  try {
    // Sanitize and ensure valid flags
    const validFlags = Array.from(new Set(flags.split(""))).filter((f) =>
      ["g", "i", "m", "s", "u", "y"].includes(f)
    ).join("");

    const regex = new RegExp(pattern, validFlags);
    const matches: RegexMatch[] = [];

    // If global flag is not present, exec only once
    if (!validFlags.includes("g")) {
      const match = regex.exec(testText);
      if (match && match[0].length > 0) {
        const textBefore = testText.substring(0, match.index);
        const lines = textBefore.split("\n");
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;

        const groups = match.slice(1).map((val, idx) => ({
          index: idx + 1,
          value: val || "",
        }));

        matches.push({
          index: match.index,
          length: match[0].length,
          text: match[0],
          groups,
          line,
          column,
        });
      }
    } else {
      let match: RegExpExecArray | null;
      let loopGuard = 0;
      const maxMatches = 2000; // Prevent UI freeze on high volume

      while ((match = regex.exec(testText)) !== null && loopGuard < maxMatches) {
        loopGuard++;
        const textBefore = testText.substring(0, match.index);
        const lines = textBefore.split("\n");
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;

        const groups = match.slice(1).map((val, idx) => ({
          index: idx + 1,
          value: val || "",
        }));

        matches.push({
          index: match.index,
          length: match[0].length,
          text: match[0],
          groups,
          line,
          column,
        });

        // Avoid infinite loop with zero-length matches (e.g. ^ or $)
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
      }
    }

    // Build highlight segments
    const segments: RegexHighlightSegment[] = [];
    let lastIndex = 0;

    for (let i = 0; i < matches.length; i++) {
      const m = matches[i];
      if (m.index > lastIndex) {
        segments.push({
          text: testText.substring(lastIndex, m.index),
          isMatch: false,
        });
      }
      segments.push({
        text: m.text,
        isMatch: true,
        matchIndex: i + 1,
      });
      lastIndex = m.index + m.length;
    }

    if (lastIndex < testText.length) {
      segments.push({
        text: testText.substring(lastIndex),
        isMatch: false,
      });
    }

    let replacedText: string | undefined = undefined;
    if (replacement !== undefined) {
      try {
        replacedText = testText.replace(regex, replacement);
      } catch {
        replacedText = testText;
      }
    }

    const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

    return {
      isValid: true,
      matches,
      matchCount: matches.length,
      highlightSegments: segments.length > 0 ? segments : [{ text: testText, isMatch: false }],
      replacedText,
      executionTimeMs,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Expressão regular inválida";
    return {
      isValid: false,
      error: errorMsg,
      matches: [],
      matchCount: 0,
      highlightSegments: [{ text: testText, isMatch: false }],
      executionTimeMs: 0,
    };
  }
}
