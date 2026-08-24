export interface JsonValidationResult {
  isValid: boolean;
  formatted?: string;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
  stats?: {
    sizeBytes: number;
    linesCount: number;
    keysCount: number;
    depth: number;
  };
}

export function validateAndFormatJson(
  input: string,
  indentation: "2" | "4" | "tab" | "minify" = "2"
): JsonValidationResult {
  if (!input.trim()) {
    return {
      isValid: true,
      formatted: "",
      stats: {
        sizeBytes: 0,
        linesCount: 0,
        keysCount: 0,
        depth: 0,
      },
    };
  }

  try {
    const parsed = JSON.parse(input);
    let space: string | number = 2;
    if (indentation === "4") space = 4;
    if (indentation === "tab") space = "\t";
    if (indentation === "minify") space = 0;

    const formatted = JSON.stringify(parsed, null, space);
    const stats = calculateJsonStats(parsed, formatted);

    return {
      isValid: true,
      formatted,
      stats,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const { line, column } = extractErrorPosition(errorMessage, input);

    return {
      isValid: false,
      error: errorMessage,
      errorLine: line,
      errorColumn: column,
    };
  }
}

function extractErrorPosition(
  errorMessage: string,
  input: string
): { line?: number; column?: number } {
  // Try to match "position X" in error message
  const positionMatch = errorMessage.match(/position (\d+)/i);
  if (positionMatch) {
    const position = parseInt(positionMatch[1], 10);
    const lines = input.slice(0, position).split("\n");
    const line = lines.length;
    const column = lines[lines.length - 1].length + 1;
    return { line, column };
  }

  // Try to match "line X column Y"
  const lineColMatch = errorMessage.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    return {
      line: parseInt(lineColMatch[1], 10),
      column: parseInt(lineColMatch[2], 10),
    };
  }

  return {};
}

function calculateJsonStats(
  obj: unknown,
  formattedString: string
): { sizeBytes: number; linesCount: number; keysCount: number; depth: number } {
  let keysCount = 0;
  let maxDepth = 0;

  function traverse(item: unknown, currentDepth: number) {
    if (currentDepth > maxDepth) maxDepth = currentDepth;

    if (item && typeof item === "object") {
      if (Array.isArray(item)) {
        for (const element of item) {
          traverse(element, currentDepth + 1);
        }
      } else {
        const keys = Object.keys(item);
        keysCount += keys.length;
        for (const key of keys) {
          traverse((item as Record<string, unknown>)[key], currentDepth + 1);
        }
      }
    }
  }

  traverse(obj, 1);

  return {
    sizeBytes: new Blob([formattedString]).size,
    linesCount: formattedString.split("\n").length,
    keysCount,
    depth: maxDepth,
  };
}
