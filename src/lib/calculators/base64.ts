export interface Base64Options {
  urlSafe?: boolean;
  noPadding?: boolean;
}

export function encodeBase64(input: string, options: Base64Options = {}): string {
  if (!input) return "";

  // Encode UTF-8 characters to bytes safely
  const utf8Bytes = new TextEncoder().encode(input);
  let binary = "";
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }

  let base64 = btoa(binary);

  if (options.urlSafe) {
    base64 = base64.replace(/\+/g, "-").replace(/\//g, "_");
  }

  if (options.noPadding) {
    base64 = base64.replace(/=+$/, "");
  }

  return base64;
}

export function decodeBase64(input: string, options: Base64Options = {}): string {
  if (!input.trim()) return "";

  let sanitized = input.trim();

  // Normalize URL-safe characters
  sanitized = sanitized.replace(/-/g, "+").replace(/_/g, "/");

  // Re-add padding if missing
  while (sanitized.length % 4 !== 0) {
    sanitized += "=";
  }

  const binary = atob(sanitized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new TextDecoder().decode(bytes);
}

export function isValidBase64(input: string): boolean {
  if (!input.trim()) return true;
  try {
    let sanitized = input.trim().replace(/-/g, "+").replace(/_/g, "/");
    while (sanitized.length % 4 !== 0) {
      sanitized += "=";
    }
    const binary = atob(sanitized);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    new TextDecoder().decode(bytes);
    return true;
  } catch {
    return false;
  }
}
