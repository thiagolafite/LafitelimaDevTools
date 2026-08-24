// Pure client-side Web Crypto and MD5 implementation

export type HashAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export interface HashResults {
  md5: string;
  sha1: string;
  sha256: string;
  sha384: string;
  sha512: string;
}

// Fast pure JS MD5 implementation (Zero dependency, client-side)
function md5Cycle(x: number[], k: number[]): void {
  let a = x[0], b = x[1], c = x[2], d = x[3];

  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return ((a + ((b & c) | (~b & d)) + x + t) | 0);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return ((a + ((b & d) | (c & ~d)) + x + t) | 0);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return ((a + (b ^ c ^ d) + x + t) | 0);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return ((a + (c ^ (b | ~d)) + x + t) | 0);
  }

  function rol(v: number, s: number) {
    return (v << s) | (v >>> (32 - s));
  }

  // Round 1
  a = rol(ff(a, b, c, d, k[0], 7, -680876936), 7) + b;
  d = rol(ff(d, a, b, c, k[1], 12, -389564586), 12) + a;
  c = rol(ff(c, d, a, b, k[2], 17, 606105819), 17) + d;
  b = rol(ff(b, c, d, a, k[3], 22, -1044525330), 22) + c;
  a = rol(ff(a, b, c, d, k[4], 7, -176418897), 7) + b;
  d = rol(ff(d, a, b, c, k[5], 12, 1200080426), 12) + a;
  c = rol(ff(c, d, a, b, k[6], 17, -1473231341), 17) + d;
  b = rol(ff(b, c, d, a, k[7], 22, -45705983), 22) + c;
  a = rol(ff(a, b, c, d, k[8], 7, 1770035416), 7) + b;
  d = rol(ff(d, a, b, c, k[9], 12, -1958414417), 12) + a;
  c = rol(ff(c, d, a, b, k[10], 17, -42063), 17) + d;
  b = rol(ff(b, c, d, a, k[11], 22, -1990404162), 22) + c;
  a = rol(ff(a, b, c, d, k[12], 7, 1804603682), 7) + b;
  d = rol(ff(d, a, b, c, k[13], 12, -40341101), 12) + a;
  c = rol(ff(c, d, a, b, k[14], 17, -1502002290), 17) + d;
  b = rol(ff(b, c, d, a, k[15], 22, 1236535329), 22) + c;

  // Round 2
  a = rol(gg(a, b, c, d, k[1], 5, -165796510), 5) + b;
  d = rol(gg(d, a, b, c, k[6], 9, -1069501632), 9) + a;
  c = rol(gg(c, d, a, b, k[11], 14, 643717713), 14) + d;
  b = rol(gg(b, c, d, a, k[0], 20, -373897302), 20) + c;
  a = rol(gg(a, b, c, d, k[5], 5, -701558691), 5) + b;
  d = rol(gg(d, a, b, c, k[10], 9, 38016083), 9) + a;
  c = rol(gg(c, d, a, b, k[15], 14, -660478335), 14) + d;
  b = rol(gg(b, c, d, a, k[4], 20, -405537848), 20) + c;
  a = rol(gg(a, b, c, d, k[9], 5, 568446438), 5) + b;
  d = rol(gg(d, a, b, c, k[14], 9, -1019803690), 9) + a;
  c = rol(gg(c, d, a, b, k[3], 14, -187363961), 14) + d;
  b = rol(gg(b, c, d, a, k[8], 20, 1163531501), 20) + c;
  a = rol(gg(a, b, c, d, k[13], 5, -1444681467), 5) + b;
  d = rol(gg(d, a, b, c, k[2], 9, -51403784), 9) + a;
  c = rol(gg(c, d, a, b, k[7], 14, 1735328473), 14) + d;
  b = rol(gg(b, c, d, a, k[12], 20, -1926607734), 20) + c;

  // Round 3
  a = rol(hh(a, b, c, d, k[5], 4, -378558), 4) + b;
  d = rol(hh(d, a, b, c, k[8], 11, -2022574463), 11) + a;
  c = rol(hh(c, d, a, b, k[11], 16, 1839030562), 16) + d;
  b = rol(hh(b, c, d, a, k[14], 23, -35309556), 23) + c;
  a = rol(hh(a, b, c, d, k[1], 4, -1530992060), 4) + b;
  d = rol(hh(d, a, b, c, k[4], 11, 1272893353), 11) + a;
  c = rol(hh(c, d, a, b, k[7], 16, -155497632), 16) + d;
  b = rol(hh(b, c, d, a, k[10], 23, -1094730640), 23) + c;
  a = rol(hh(a, b, c, d, k[13], 4, 681279174), 4) + b;
  d = rol(hh(d, a, b, c, k[0], 11, -358537222), 11) + a;
  c = rol(hh(c, d, a, b, k[3], 16, -722521979), 16) + d;
  b = rol(hh(b, c, d, a, k[6], 23, 76029189), 23) + c;
  a = rol(hh(a, b, c, d, k[9], 4, -640364487), 4) + b;
  d = rol(hh(d, a, b, c, k[12], 11, -421815835), 11) + a;
  c = rol(hh(c, d, a, b, k[15], 16, 530742520), 16) + d;
  b = rol(hh(b, c, d, a, k[2], 23, -995338651), 23) + c;

  // Round 4
  a = rol(ii(a, b, c, d, k[0], 6, -198630844), 6) + b;
  d = rol(ii(d, a, b, c, k[7], 10, 1126891415), 10) + a;
  c = rol(ii(c, d, a, b, k[14], 15, -1416354905), 15) + d;
  b = rol(ii(b, c, d, a, k[5], 21, -57434055), 21) + c;
  a = rol(ii(a, b, c, d, k[12], 6, 1700485571), 6) + b;
  d = rol(ii(d, a, b, c, k[3], 10, -1894986606), 10) + a;
  c = rol(ii(c, d, a, b, k[10], 15, -1051523), 15) + d;
  b = rol(ii(b, c, d, a, k[1], 21, -2054922799), 21) + c;
  a = rol(ii(a, b, c, d, k[8], 6, 1873313359), 6) + b;
  d = rol(ii(d, a, b, c, k[15], 10, -30611744), 10) + a;
  c = rol(ii(c, d, a, b, k[6], 15, -1560198380), 15) + d;
  b = rol(ii(b, c, d, a, k[13], 21, 1309151649), 21) + c;
  a = rol(ii(a, b, c, d, k[4], 6, -145523070), 6) + b;
  d = rol(ii(d, a, b, c, k[11], 10, -1120210379), 10) + a;
  c = rol(ii(c, d, a, b, k[2], 15, 718787259), 15) + d;
  b = rol(ii(b, c, d, a, k[9], 21, -343485551), 21) + c;

  x[0] = (x[0] + a) | 0;
  x[1] = (x[1] + b) | 0;
  x[2] = (x[2] + c) | 0;
  x[3] = (x[3] + d) | 0;
}

export function computeMd5(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const n = bytes.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];

  const blocksCount = ((n + 8) >> 6) + 1;
  const blocks = new Array(blocksCount * 16).fill(0);

  for (let i = 0; i < n; i++) {
    blocks[i >> 2] |= bytes[i] << ((i % 4) * 8);
  }
  blocks[n >> 2] |= 0x80 << ((n % 4) * 8);
  blocks[blocksCount * 16 - 2] = n * 8;

  for (let i = 0; i < blocks.length; i += 16) {
    const chunk = blocks.slice(i, i + 16);
    md5Cycle(state, chunk);
  }

  let hex = "";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const byte = (state[i] >> (j * 8)) & 0xff;
      hex += byte.toString(16).padStart(2, "0");
    }
  }

  return hex;
}

export async function computeWebCryptoHash(
  algorithm: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512",
  text: string
): Promise<string> {
  const msgUint8 = new TextEncoder().encode(text);
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return "";
}

export async function computeAllHashes(text: string): Promise<HashResults> {
  if (!text) {
    return {
      md5: "",
      sha1: "",
      sha256: "",
      sha384: "",
      sha512: "",
    };
  }

  const md5 = computeMd5(text);
  const [sha1, sha256, sha384, sha512] = await Promise.all([
    computeWebCryptoHash("SHA-1", text),
    computeWebCryptoHash("SHA-256", text),
    computeWebCryptoHash("SHA-384", text),
    computeWebCryptoHash("SHA-512", text),
  ]);

  return {
    md5,
    sha1,
    sha256,
    sha384,
    sha512,
  };
}
