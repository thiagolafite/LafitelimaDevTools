import { SupportedLanguage } from "./site";

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolLocaleData {
  name: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  howItWorks: {
    title: string;
    paragraphs: string[];
    steps?: { title: string; desc: string }[];
  };
  faqs: ToolFaqItem[];
}

export interface ToolDefinition {
  id: string;
  componentKey: "json-formatter" | "subnet-calculator" | "password-generator" | "base64-tool" | "hash-generator";
  category: "developer" | "network" | "security" | "converters";
  iconName: "FileJson" | "Network" | "KeyRound" | "Binary" | "Hash";
  isFeatured?: boolean;
  slugs: {
    en: string;
    pt: string;
  };
  locales: {
    en: ToolLocaleData;
    pt: ToolLocaleData;
  };
}

export const toolsRegistry: ToolDefinition[] = [
  {
    id: "json-formatter",
    componentKey: "json-formatter",
    category: "developer",
    iconName: "FileJson",
    isFeatured: true,
    slugs: {
      en: "json-formatter",
      pt: "formatador-json",
    },
    locales: {
      en: {
        name: "JSON Formatter & Validator",
        shortDescription: "Beautify, validate, minify, and inspect JSON payloads with real-time syntax error detection.",
        metaTitle: "JSON Formatter & Validator Online — 100% Private & Fast",
        metaDescription:
          "Free online JSON Formatter, Validator, and Minifier. Format JSON with 2 or 4 spaces, detect syntax errors with line numbers, and compute payload stats entirely in your browser.",
        keywords: [
          "json formatter",
          "json validator",
          "json beautifier",
          "minify json",
          "format json online",
          "json syntax checker",
          "private json parser",
        ],
        howItWorks: {
          title: "How the JSON Formatter Works",
          paragraphs: [
            "This tool utilizes the browser's native ECMAScript JSON engine combined with custom error parsing algorithms. When you paste or type your raw JSON payload, the parser validates the syntax in real-time without sending any byte to an external server.",
            "If an error is detected, the validator calculates the exact line and character column where the syntax broke (such as trailing commas, missing quotes, or mismatched brackets) so you can fix it immediately.",
          ],
          steps: [
            {
              title: "1. Input JSON",
              desc: "Paste your raw JSON text into the editor or type directly.",
            },
            {
              title: "2. Choose Indentation",
              desc: "Select 2 spaces, 4 spaces, Tab, or Minify mode according to your needs.",
            },
            {
              title: "3. Copy or Export",
              desc: "Instantly copy formatted output or inspect node count and payload byte size.",
            },
          ],
        },
        faqs: [
          {
            question: "Is my JSON data safe and private?",
            answer:
              "Yes, 100%. The formatting and validation happen entirely inside your browser using client-side JavaScript. No data is ever transmitted to or stored on any server.",
          },
          {
            question: "Can this tool handle large JSON files?",
            answer:
              "Yes. Because it uses the native browser JSON engine with zero network latency, it can format and inspect multi-megabyte payloads in milliseconds.",
          },
          {
            question: "Why did my JSON fail validation?",
            answer:
              "Common issues include trailing commas after the last item in arrays or objects, unquoted keys, single quotes instead of double quotes, or unescaped control characters.",
          },
        ],
      },
      pt: {
        name: "Formatador e Validador JSON",
        shortDescription: "Formate, valide, minifique e inspecione payloads JSON com destaque visual de erros em tempo real.",
        metaTitle: "Formatador e Validador JSON Online — 100% Privado e Rápido",
        metaDescription:
          "Formatador, Validador e Minificador de JSON gratuito e online. Indente com 2 ou 4 espaços, identifique linha de erros de sintaxe e analise o tamanho do arquivo direto no navegador.",
        keywords: [
          "formatador json",
          "validador json",
          "organizar json",
          "minificar json",
          "identar json",
          "verificar erro json",
          "json parser seguro",
        ],
        howItWorks: {
          title: "Como Funciona o Formatador JSON",
          paragraphs: [
            "Esta ferramenta utiliza o motor nativo de JSON do navegador acoplado a algoritmos dedicados de rastreamento de erros. Ao colar o seu código JSON, a validação é executada em tempo real na memória do seu dispositivo.",
            "Caso exista alguma inconformidade (como vírgula sobrando, aspas simples ou chaves não fechadas), a ferramenta aponta a linha e a coluna exata do erro para correção rápida.",
          ],
          steps: [
            {
              title: "1. Insira o JSON",
              desc: "Cole o texto JSON desordenado ou carregue o seu arquivo.",
            },
            {
              title: "2. Selecione a Indentação",
              desc: "Escolha 2 espaços, 4 espaços, Tab ou Minificar.",
            },
            {
              title: "3. Copie o Resultado",
              desc: "Copie com 1 clique o código formatado e veja estatísticas de tamanho.",
            },
          ],
        },
        faqs: [
          {
            question: "Meus dados JSON são enviados para algum servidor?",
            answer:
              "Não. Toda a validação e formatação ocorrem 100% no seu navegador (Client-Side). Nenhum caractere é transmitido para a nuvem.",
          },
          {
            question: "Quais os erros mais comuns no JSON?",
            answer:
              "Os erros mais frequentes são: vírgula no último item de uma lista/objeto (trailing comma), uso de aspas simples em vez de aspas duplas, e esquecimento de fechamento de colchetes ou chaves.",
          },
          {
            question: "Suporta arquivos grandes?",
            answer:
              "Sim. Como o processamento é executado localmente pelo motor V8/JavaScript do seu navegador, documentos de vários megabytes são processados quase instantaneamente.",
          },
        ],
      },
    },
  },
  {
    id: "subnet-calculator",
    componentKey: "subnet-calculator",
    category: "network",
    iconName: "Network",
    isFeatured: true,
    slugs: {
      en: "subnet-calculator",
      pt: "calculadora-subnet",
    },
    locales: {
      en: {
        name: "IPv4 CIDR Subnet Calculator",
        shortDescription: "Calculate network address, broadcast, usable IP range, netmask, and wildcard mask with binary breakdown.",
        metaTitle: "CIDR Subnet Calculator Online — IPv4 Network & Mask Tool",
        metaDescription:
          "Free online IPv4 CIDR Subnet Calculator. Calculate Network ID, Broadcast IP, usable host range, subnet mask, wildcard mask, and binary representation instantly.",
        keywords: [
          "subnet calculator",
          "cidr calculator",
          "ipv4 subnetting",
          "network address calculator",
          "broadcast ip finder",
          "wildcard mask calculator",
          "ip usable range",
        ],
        howItWorks: {
          title: "Understanding IPv4 CIDR & Subnet Calculations",
          paragraphs: [
            "CIDR (Classless Inter-Domain Routing) notation uses a prefix (like /24) to denote how many bits of a 32-bit IPv4 address represent the network identifier, leaving the remaining bits for host addresses.",
            "Our subnet calculator applies bitwise operations on the 32-bit integer representation of the IP address against the subnet mask to determine the Network ID (Bitwise AND), Broadcast ID (Bitwise OR with inverted mask), and all assignable host IPs.",
          ],
          steps: [
            {
              title: "1. Enter IPv4 & Prefix",
              desc: "Type an IP like 192.168.1.10 and choose a CIDR prefix (e.g. /24).",
            },
            {
              title: "2. Instant Bitwise Calculation",
              desc: "View network ID, broadcast address, netmask, wildcard, and usable range.",
            },
            {
              title: "3. Inspect Binary Breakdown",
              desc: "Compare octets in binary format to visualize subnet boundaries.",
            },
          ],
        },
        faqs: [
          {
            question: "What is the difference between Network Address and Broadcast Address?",
            answer:
              "The Network Address (first IP in the block) identifies the subnet itself. The Broadcast Address (last IP in the block) is used to send packets to all hosts on the subnet. Neither can be assigned to individual devices.",
          },
          {
            question: "How are usable hosts calculated?",
            answer:
              "For standard subnets (/1 to /30), usable hosts = (2^(32 - CIDR)) - 2. The -2 accounts for the reserved network and broadcast addresses. /31 (RFC 3021) has 2 usable point-to-point hosts, and /32 is a single host route.",
          },
          {
            question: "What is a Wildcard Mask?",
            answer:
              "A Wildcard Mask is the bitwise inverse of the Subnet Mask (e.g. Subnet Mask 255.255.255.0 has a Wildcard of 0.0.0.255), commonly used in Cisco ACLs and OSPF configurations.",
          },
        ],
      },
      pt: {
        name: "Calculadora de Sub-rede CIDR IPv4",
        shortDescription: "Calcule endereço de rede, broadcast, faixa de IPs utilizáveis, máscara e wildcard com visualização binária.",
        metaTitle: "Calculadora de Subnet CIDR Online — Máscara de Rede IPv4",
        metaDescription:
          "Calculadora de Sub-rede CIDR IPv4 gratuita. Descubra Endereço de Rede, Broadcast, faixa de IPs para hosts, máscara de sub-rede, wildcard e octetos em binário.",
        keywords: [
          "calculadora subnet",
          "calculadora cidr",
          "calcular mascara de rede",
          "calcular broadcast",
          "faixa de ips uteis",
          "mascara wildcard",
          "divisao em subredes",
        ],
        howItWorks: {
          title: "Como Funciona o Cálculo de Sub-redes CIDR",
          paragraphs: [
            "A notação CIDR (Classless Inter-Domain Routing) define quantos bits de um endereço IPv4 de 32 bits pertencem à identificação da rede (ex: /24 indica 24 bits de rede e 8 bits para hosts).",
            "Nossa calculadora realiza operações bit a bit (Bitwise AND/OR) diretamente na memória do navegador para determinar o endereço de rede exato, o broadcast e a quantidade de hosts disponíveis.",
          ],
          steps: [
            {
              title: "1. Informe o IP e Máscara",
              desc: "Digite o IP (ex: 192.168.0.1) e selecione o prefixo CIDR (ex: /24).",
            },
            {
              title: "2. Visualização dos Resultados",
              desc: "Veja instantaneamente Endereço de Rede, Broadcast, Máscara e Total de Hosts.",
            },
            {
              title: "3. Tabela e Binário",
              desc: "Inspecione os 4 octetos em formato binário para entender a divisão de rede.",
            },
          ],
        },
        faqs: [
          {
            question: "Por que subtrair 2 no cálculo de hosts utilizáveis?",
            answer:
              "Em uma sub-rede tradicional, o primeiro endereço é reservado para identificar a própria rede (Network ID) e o último endereço é reservado para comunicação em massa (Broadcast). Portanto, hosts utilizáveis = Total - 2.",
          },
          {
            question: "O que é a máscara Wildcard (Cisco)?",
            answer:
              "A máscara Wildcard é o inverso binário da máscara de sub-rede. Por exemplo, para a máscara 255.255.255.0, a máscara Wildcard correspondente é 0.0.0.255.",
          },
          {
            question: "Para que serve a sub-rede /31?",
            answer:
              "A sub-rede /31 é definida pela RFC 3021 para conexões ponto a ponto (links dedicados entre roteadores), permitindo usar ambos os 2 IPs sem desperdiçar endereços de rede e broadcast.",
          },
        ],
      },
    },
  },
  {
    id: "password-generator",
    componentKey: "password-generator",
    category: "security",
    iconName: "KeyRound",
    isFeatured: true,
    slugs: {
      en: "password-generator",
      pt: "gerador-de-senhas",
    },
    locales: {
      en: {
        name: "Cryptographic Password Generator",
        shortDescription: "Generate unbreakable, cryptographically secure passwords with entropy measurement and crack-time estimation.",
        metaTitle: "Strong Password Generator Online — Cryptographically Secure",
        metaDescription:
          "Generate high-entropy, strong passwords with window.crypto.getRandomValues(). Custom length, character sets, entropy calculation, and offline crack time estimation.",
        keywords: [
          "password generator",
          "secure password generator",
          "cryptographic random password",
          "password entropy calculator",
          "random string generator",
          "strong password tool",
        ],
        howItWorks: {
          title: "Cryptographic Randomness & Entropy",
          paragraphs: [
            "Unlike standard random generators that use predictable pseudorandom algorithms (like Math.random), this tool relies on the browser's native CSPRNG (Cryptographically Secure Pseudorandom Number Generator) via `window.crypto.getRandomValues()`.",
            "It computes the true Shannon Entropy ($E = L \\times \\log_2(N)$) in bits, reflecting the mathematical resistance of your password against offline brute-force attacks across high-speed GPU clusters.",
          ],
          steps: [
            {
              title: "1. Choose Length & Sets",
              desc: "Adjust the length slider (8 to 64 chars) and toggle character categories.",
            },
            {
              title: "2. Check Entropy & Strength",
              desc: "Inspect real-time entropy bits and estimated brute-force crack time.",
            },
            {
              title: "3. Secure Copy",
              desc: "Copy the password directly to your clipboard with one click.",
            },
          ],
        },
        faqs: [
          {
            question: "Why is window.crypto safer than Math.random()?",
            answer:
              "Math.random() is a deterministic pseudo-random algorithm whose internal state can be deduced from previous outputs. `window.crypto.getRandomValues()` is seeded with high-entropy OS-level hardware noise, making it cryptographically unpredictable.",
          },
          {
            question: "What is considered a strong entropy score?",
            answer:
              "An entropy score of 60 bits is generally secure for everyday online accounts, while 80+ bits is recommended for critical infrastructure, database master keys, and password managers.",
          },
          {
            question: "Are generated passwords saved anywhere?",
            answer:
              "No. Passwords exist solely in your browser's temporary execution memory while the tab is open. They are never sent across the network or stored in persistent server databases.",
          },
        ],
      },
      pt: {
        name: "Gerador de Senhas Criptográficas",
        shortDescription: "Gere senhas ultrasseguras com números aleatórios criptográficos, medição de entropia e estimativa de quebra.",
        metaTitle: "Gerador de Senhas Fortes Online — Criptografia Segura",
        metaDescription:
          "Gerador de senhas fortes baseado em window.crypto.getRandomValues(). Personalize tamanho, caracteres, calcule a entropia e veja a estimativa de tempo para quebra por força bruta.",
        keywords: [
          "gerador de senhas",
          "gerador de senhas seguras",
          "gerador de senhas aleatorias",
          "calcular entropia de senha",
          "senha forte online",
          "criptografia de senha",
        ],
        howItWorks: {
          title: "Como Funciona a Geração Criptográfica de Senhas",
          paragraphs: [
            "Diferente de geradores comuns que usam funções previsíveis (como Math.random), nosso gerador utiliza o CSPRNG nativo do sistema operacional através da API `window.crypto.getRandomValues()`.",
            "A ferramenta calcula a entropia real em bits ($E = L \\times \\log_2(N)$), avaliando o grau de resistência matemática da senha contra ataques de força bruta com clusters de placas de vídeo (GPUs).",
          ],
          steps: [
            {
              title: "1. Defina o Comprimento",
              desc: "Ajuste o controle deslizante de 8 a 64 caracteres e selecione os conjuntos de caracteres.",
            },
            {
              title: "2. Analise a Força",
              desc: "Veja a pontuação de entropia e o tempo estimado para quebra em tempo real.",
            },
            {
              title: "3. Copie com Segurança",
              desc: "Copie para a área de transferência sem que nenhum dado saia do seu navegador.",
            },
          ],
        },
        faqs: [
          {
            question: "Por que window.crypto é superior ao Math.random()?",
            answer:
              "O Math.random() utiliza algoritmos previsíveis. Já o `window.crypto.getRandomValues()` coleta entropia de hardware do sistema operacional, tornando as sequências matematicamente imprevisíveis.",
          },
          {
            question: "O que significa o valor de entropia em bits?",
            answer:
              "A entropia mede a incerteza matemática da senha. Uma senha com mais de 60 bits é considerada forte, e acima de 80 bits é praticamente inviolável por ataques de força bruta modernos.",
          },
          {
            question: "As senhas geradas ficam salvas em algum lugar?",
            answer:
              "Absolutamente não. As senhas são geradas na memória volátil do seu próprio navegador e jamais trafegam pela rede.",
          },
        ],
      },
    },
  },
  {
    id: "base64-tool",
    componentKey: "base64-tool",
    category: "converters",
    iconName: "Binary",
    isFeatured: false,
    slugs: {
      en: "base64-tool",
      pt: "codificador-base64",
    },
    locales: {
      en: {
        name: "Base64 Encoder & Decoder",
        shortDescription: "Encode and decode strings, tokens, and files to/from Base64 with full UTF-8 and URL-Safe support.",
        metaTitle: "Base64 Encoder & Decoder Online — UTF-8 & URL Safe",
        metaDescription:
          "Free online Base64 Encoder and Decoder. Convert text, Unicode, emojis and tokens to standard or URL-safe Base64 with instant client-side decoding.",
        keywords: [
          "base64 encoder",
          "base64 decoder",
          "base64 url safe",
          "encode base64 online",
          "decode base64 text",
          "base64 utf8 converter",
        ],
        howItWorks: {
          title: "Base64 Encoding & Unicode UTF-8 Handling",
          paragraphs: [
            "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format by translating it into a radix-64 representation.",
            "Standard JavaScript `btoa()` and `atob()` functions fail with non-Latin1 characters (like emojis or accented letters). Our tool uses `TextEncoder` and `TextDecoder` to safely serialize multi-byte UTF-8 sequences before Base64 conversion.",
          ],
          steps: [
            {
              title: "1. Paste Text or Tokens",
              desc: "Enter plain text or a Base64 encoded payload.",
            },
            {
              title: "2. Toggle Modes",
              desc: "Switch between Encode and Decode, or activate URL-Safe Base64.",
            },
            {
              title: "3. Copy Result",
              desc: "Copy output directly with zero server roundtrips.",
            },
          ],
        },
        faqs: [
          {
            question: "What is URL-Safe Base64?",
            answer:
              "URL-Safe Base64 replaces the standard '+' and '/' characters with '-' and '_' to prevent URL parameter corruption, and optionally strips '=' padding.",
          },
          {
            question: "Why do some Base64 tools fail on emojis and accents?",
            answer:
              "Classic JavaScript `btoa()` only accepts characters in the Latin1 range (0-255). We resolve this by encoding strings into UTF-8 byte arrays first.",
          },
        ],
      },
      pt: {
        name: "Codificador e Decodificador Base64",
        shortDescription: "Codifique e decodifique textos, tokens e payloads em Base64 com suporte a UTF-8 e URL-Safe.",
        metaTitle: "Codificador e Decodificador Base64 Online — UTF-8 e URL-Safe",
        metaDescription:
          "Codificador e Decodificador Base64 online e gratuito. Suporta caracteres especiais, acentos, emojis e formato seguro para URLs (URL-Safe) sem envio a servidores.",
        keywords: [
          "codificador base64",
          "decodificador base64",
          "base64 online",
          "converter base64",
          "base64 url safe",
          "converter texto para base64",
        ],
        howItWorks: {
          title: "Como Funciona a Codificação Base64",
          paragraphs: [
            "O Base64 é um método de codificação que transforma dados binários em uma sequência de caracteres ASCII legíveis, dividindo os bytes em blocos de 6 bits.",
            "Nossa ferramenta implementa suporte completo a UTF-8 através da API `TextEncoder`, permitindo converter textos com acentuação, caracteres especiais e emojis sem corrupção de dados.",
          ],
          steps: [
            {
              title: "1. Digite ou Cole o Texto",
              desc: "Insira o texto original ou a sequência codificada em Base64.",
            },
            {
              title: "2. Escolha o Modo",
              desc: "Selecione Codificar ou Decodificar e ative o modo URL-Safe se necessário.",
            },
            {
              title: "3. Obtenha o Resultado",
              desc: "Copie o resultado formatado instantaneamente.",
            },
          ],
        },
        faqs: [
          {
            question: "O que é Base64 URL-Safe?",
            answer:
              "O formato URL-Safe substitui os caracteres '+' e '/' por '-' e '_' para permitir o uso seguro de tokens em links e cabeçalhos HTTP sem necessidade de percent-encoding.",
          },
          {
            question: "Base64 é uma forma de criptografia?",
            answer:
              "Não. Base64 é apenas uma codificação de representação de dados, não oferecendo nenhuma confidencialidade ou proteção criptográfica.",
          },
        ],
      },
    },
  },
  {
    id: "hash-generator",
    componentKey: "hash-generator",
    category: "security",
    iconName: "Hash",
    isFeatured: true,
    slugs: {
      en: "hash-generator",
      pt: "gerador-de-hash",
    },
    locales: {
      en: {
        name: "Cryptographic Hash Generator",
        shortDescription: "Generate real-time cryptographic hashes (SHA-256, SHA-512, SHA-384, SHA-1, MD5) directly in your browser.",
        metaTitle: "Online Hash Generator — SHA-256, SHA-512, MD5, SHA-1",
        metaDescription:
          "Generate instant cryptographic hashes using Web Crypto API. Calculate SHA-256, SHA-512, SHA-384, SHA-1 and MD5 checksums 100% client-side with zero data leakage.",
        keywords: [
          "hash generator",
          "sha256 generator",
          "sha512 online",
          "md5 hash generator",
          "sha1 calculator",
          "cryptographic checksum",
          "text hash online",
        ],
        howItWorks: {
          title: "Cryptographic Hashing Mechanisms",
          paragraphs: [
            "A cryptographic hash function is a one-way mathematical algorithm that maps arbitrary-length data to a fixed-size bit string. Even the slightest alteration in the input produces a completely unpredictable output hash (the avalanche effect).",
            "This tool calculates SHA-256, SHA-512, SHA-384 and SHA-1 using the hardware-accelerated native Web Crypto API (`crypto.subtle.digest`), alongside an optimized pure-JS MD5 algorithm.",
          ],
          steps: [
            {
              title: "1. Type Input Text",
              desc: "Type or paste any text or string to be hashed.",
            },
            {
              title: "2. Real-Time Calculation",
              desc: "All hashes (MD5, SHA-1, SHA-256, SHA-512) update simultaneously.",
            },
            {
              title: "3. Copy Checksum",
              desc: "Copy any specific algorithm hash with a single click.",
            },
          ],
        },
        faqs: [
          {
            question: "Can cryptographic hashes be reversed to find the original text?",
            answer:
              "No. Cryptographic hashes are mathematically one-way functions. The only way to find an input for a hash is via exhaustive search (brute-force or rainbow tables).",
          },
          {
            question: "Which hash algorithm should I use for security?",
            answer:
              "SHA-256 and SHA-512 are industry standards for secure integrity checks and digital signatures. MD5 and SHA-1 have known collision vulnerabilities and should only be used for non-security checksums.",
          },
        ],
      },
      pt: {
        name: "Gerador de Hash Criptográfico",
        shortDescription: "Gere hashes criptográficos em tempo real (SHA-256, SHA-512, SHA-384, SHA-1, MD5) direto no navegador.",
        metaTitle: "Gerador de Hash Online — SHA-256, SHA-512, MD5, SHA-1",
        metaDescription:
          "Gere hashes criptográficos instantaneamente com Web Crypto API. Calcule SHA-256, SHA-512, SHA-384, SHA-1 e MD5 100% no navegador com total privacidade.",
        keywords: [
          "gerador de hash",
          "gerador sha256",
          "gerador sha512",
          "calcular md5",
          "sha1 online",
          "hash criptografico",
          "checksum de texto",
        ],
        howItWorks: {
          title: "Como Funcionam as Funções de Hash Criptográficas",
          paragraphs: [
            "Uma função de hash criptográfica é um algoritmo matemático unidirecional que converte dados de qualquer tamanho em uma sequência de caracteres de tamanho fixo. Qualquer mínima alteração no texto de entrada altera totalmente o hash resultante (efeito avalanche).",
            "Nossa ferramenta calcula SHA-256, SHA-512, SHA-384 e SHA-1 utilizando aceleração por hardware da Web Crypto API do navegador, além de um motor otimizado de MD5.",
          ],
          steps: [
            {
              title: "1. Insira o Texto",
              desc: "Digite ou cole qualquer string ou texto a ser processado.",
            },
            {
              title: "2. Cálculo em Tempo Real",
              desc: "Todos os hashes são computados simultaneamente enquanto você digita.",
            },
            {
              title: "3. Copie o Hash",
              desc: "Copie o checksum desejado com 1 clique.",
            },
          ],
        },
        faqs: [
          {
            question: "É possível reverter um hash para descobrir o texto original?",
            answer:
              "Não. Hashes criptográficos são funções matemáticas estritamente unidirecionais. A única forma de descobrir o texto original é por força bruta ou dicionários de pesquisa (rainbow tables).",
          },
          {
            question: "Qual algoritmo é o mais recomendado?",
            answer:
              "Para segurança, utilize SHA-256 ou SHA-512. O MD5 e o SHA-1 devem ser utilizados apenas para verificação rápida de integridade de arquivos não críticos.",
          },
        ],
      },
    },
  },
];

// Helper functions
export function getAllTools(): ToolDefinition[] {
  return toolsRegistry;
}

export function getToolById(id: string): ToolDefinition | undefined {
  return toolsRegistry.find((tool) => tool.id === id);
}

export function getToolBySlug(slug: string, lang?: SupportedLanguage): { tool: ToolDefinition; lang: SupportedLanguage } | undefined {
  for (const tool of toolsRegistry) {
    if (lang) {
      if (tool.slugs[lang] === slug) {
        return { tool, lang };
      }
    } else {
      if (tool.slugs.en === slug) return { tool, lang: "en" };
      if (tool.slugs.pt === slug) return { tool, lang: "pt" };
    }
  }
  return undefined;
}

export function getAlternateToolSlug(tool: ToolDefinition, targetLang: SupportedLanguage): string {
  return tool.slugs[targetLang];
}

export function getToolsByCategory(categoryId: string): ToolDefinition[] {
  return toolsRegistry.filter((tool) => tool.category === categoryId);
}

export function getFeaturedTools(): ToolDefinition[] {
  return toolsRegistry.filter((tool) => tool.isFeatured);
}
