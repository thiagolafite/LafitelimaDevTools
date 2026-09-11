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
  componentKey:
    | "json-formatter"
    | "subnet-calculator"
    | "password-generator"
    | "base64-tool"
    | "hash-generator"
    | "cron-parser"
    | "regex-tester"
    | "timestamp-converter"
    | "curl-converter"
    | "markdown-preview";
  category: "developer" | "network" | "security" | "converters";
  iconName:
    | "FileJson"
    | "Network"
    | "KeyRound"
    | "Binary"
    | "Hash"
    | "Clock"
    | "Code2"
    | "Terminal"
    | "FileText"
    | "Sliders";
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
  {
    id: "cron-parser",
    componentKey: "cron-parser",
    category: "developer",
    iconName: "Clock",
    isFeatured: true,
    slugs: {
      en: "cron",
      pt: "cron",
    },
    locales: {
      en: {
        name: "Cron Expression Parser & Generator",
        shortDescription: "Parse, describe in plain text, calculate next execution times, and visually build cron expressions.",
        metaTitle: "Cron Expression Parser & Visual Generator — 100% Private & Fast",
        metaDescription:
          "Free online Cron Expression Parser and Generator. Translate cron expressions to human-readable schedules, inspect upcoming execution times, and visually build crons.",
        keywords: [
          "cron parser",
          "cron expression generator",
          "crontab guru",
          "cron schedule",
          "cron job builder",
          "next cron executions",
        ],
        howItWorks: {
          title: "How the Cron Parser Works",
          paragraphs: [
            "Cron expressions are standard 5-part strings (Minute, Hour, Day of Month, Month, Day of Week) used to schedule recurring tasks in Unix systems, cloud crons, and task runners.",
            "This tool decodes each field into natural plain English and calculates the next exact 5 execution dates and times directly in your browser without contacting any server.",
          ],
          steps: [
            {
              title: "1. Input Expression or Use Builder",
              desc: "Type any 5-field cron string or use the interactive visual generator tabs.",
            },
            {
              title: "2. Read Human Translation",
              desc: "Instantly see the exact human-readable description of when your task will run.",
            },
            {
              title: "3. Check Next Runs & Copy",
              desc: "Inspect the next 5 execution timestamps and copy the expression with 1 click.",
            },
          ],
        },
        faqs: [
          {
            question: "What do the 5 cron fields represent?",
            answer:
              "From left to right: Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12 or JAN-DEC), and Day of Week (0-7 or SUN-SAT, where both 0 and 7 are Sunday).",
          },
          {
            question: "How do step values (e.g. */15) work?",
            answer:
              "An asterisk followed by a slash and number (e.g. */15 in the minute field) indicates execution every 15 units starting at 0 (dispatches at :00, :15, :30, :45).",
          },
        ],
      },
      pt: {
        name: "Analisador e Gerador de Cron (Cron Parser)",
        shortDescription: "Traduza expressões cron em português claro, visualize os próximos horários de execução e monte crons visualmente.",
        metaTitle: "Analisador e Gerador de Expressões Cron Online — Rápido e Privado",
        metaDescription:
          "Ferramenta gratuita para analisar, traduzir e gerar expressões cron. Descubra os próximos disparos exatos e monte agendamentos visualmente no navegador.",
        keywords: [
          "analisador cron",
          "gerador cron",
          "cron expression parser",
          "crontab brasil",
          "agendamento cron",
          "proximos disparos cron",
        ],
        howItWorks: {
          title: "Como Funciona o Analisador de Expressões Cron",
          paragraphs: [
            "Expressões Cron são sequências padronizadas de 5 campos (Minuto, Hora, Dia do Mês, Mês e Dia da Semana) utilizadas para agendar tarefas recorrentes em servidores Linux, rotinas em nuvem e filas de processamento.",
            "Nossa ferramenta decompõe cada segmento, traduz o cron para português legível em tempo real e calcula os próximos 5 horários exatos de disparo.",
          ],
          steps: [
            {
              title: "1. Digite a Expressão ou Monte Visualmente",
              desc: "Insira uma expressão cron de 5 campos ou escolha os parâmetros no Construtor Visual.",
            },
            {
              title: "2. Veja o Significado em Português",
              desc: "Acompanhe a tradução instantânea em texto claro de quando o seu job será executado.",
            },
            {
              title: "3. Visualize os Próximos Disparos",
              desc: "Confira a tabela com as 5 próximas datas/horas exatas de execução.",
            },
          ],
        },
        faqs: [
          {
            question: "O que significa cada um dos 5 campos do Cron?",
            answer:
              "Da esquerda para a direita: 1º Minuto (0-59), 2º Hora (0-23), 3º Dia do Mês (1-31), 4º Mês (1-12 ou JAN-DEZ) e 5º Dia da Semana (0-7 ou DOM-SÁB, onde 0 e 7 representam Domingo).",
          },
          {
            question: "Como funciona a sintaxe de passo (ex: */5)?",
            answer:
              "A barra representa um intervalo ou passo de repetição. Por exemplo, '*/5' no campo de minutos significa 'a cada 5 minutos' (minutos 0, 5, 10, 15, 20...).",
          },
        ],
      },
    },
  },
  {
    id: "regex-tester",
    componentKey: "regex-tester",
    category: "developer",
    iconName: "Code2",
    isFeatured: true,
    slugs: {
      en: "regex",
      pt: "regex",
    },
    locales: {
      en: {
        name: "Regex Tester & Visualizer",
        shortDescription: "Test, validate, and debug Regular Expressions with real-time match highlighting, group inspector, and replace mode.",
        metaTitle: "Regex Tester & Visualizer Online — 100% Private & Fast",
        metaDescription:
          "Free online Regular Expression Tester with live match highlighting, capture group inspector, regex presets, and instant replacement preview.",
        keywords: [
          "regex tester",
          "regex visualizer",
          "regular expression online",
          "regex debugger",
          "test regex",
          "regex replace",
        ],
        howItWorks: {
          title: "How the Regex Tester Works",
          paragraphs: [
            "Regular Expressions (RegEx) are powerful patterns used for text search, validation, and string manipulation. This tool executes native JavaScript RegExp algorithms directly in your browser with zero latency.",
            "It automatically segments the test string, color-highlights matching ranges, extracts capture groups ($1, $2), and allows live replacement testing without sending any payload to remote servers.",
          ],
          steps: [
            {
              title: "1. Enter Pattern & Flags",
              desc: "Type your regular expression and toggle flags (g, i, m, s, u).",
            },
            {
              title: "2. Input Test Text",
              desc: "Paste your sample string to see matching segments highlighted in real-time.",
            },
            {
              title: "3. Inspect Groups & Replace",
              desc: "View match positions, capture groups, and test string replacements with 1 click.",
            },
          ],
        },
        faqs: [
          {
            question: "What are the common regex flags?",
            answer:
              "'g' enables global search for all matches; 'i' makes search case-insensitive; 'm' enables multiline mode (^ and $ match line starts/ends); 's' lets dot (.) match newlines.",
          },
          {
            question: "Is my text data safe?",
            answer:
              "Yes. All regex evaluations and string processing occur 100% in your browser's local memory. No text or regex is transmitted across the network.",
          },
        ],
      },
      pt: {
        name: "Testador e Depurador de Regex (Regex Tester)",
        shortDescription: "Teste, valide e depure Expressões Regulares com destaque visual em tempo real, inspetor de grupos e substituição.",
        metaTitle: "Testador de Expressões Regulares (Regex) Online — Rápido e Privado",
        metaDescription:
          "Ferramenta gratuita para testar expressões regulares em tempo real com destaque de matches, inspetor de grupos de captura, substituição e presets prontos.",
        keywords: [
          "testador de regex",
          "regex tester",
          "expressoes regulares online",
          "depurador regex",
          "validar regex",
          "regex highlight",
        ],
        howItWorks: {
          title: "Como Funciona o Testador de Expressões Regulares",
          paragraphs: [
            "Expressões Regulares (Regex) são padrões avançados de busca, validação e manipulação de texto. Esta ferramenta utiliza o motor nativo de RegExp do navegador para processamento instantâneo em microssegundos.",
            "Ela segmenta o texto de entrada, aplica realce visual colorido nas ocorrências, lista os grupos de captura ($1, $2) e permite testar substituições em tempo real.",
          ],
          steps: [
            {
              title: "1. Digite a Expressão e Flags",
              desc: "Insira o padrão regex e selecione as flags desejadas (g, i, m, s, u).",
            },
            {
              title: "2. Insira o Texto de Teste",
              desc: "Cole o texto para visualizar todos os matches destacados em tempo real.",
            },
            {
              title: "3. Inspecione Grupos e Substituições",
              desc: "Veja posições, linhas, colunas, grupos capturados e teste substituições.",
            },
          ],
        },
        faqs: [
          {
            question: "O que significam as flags (g, i, m, s, u)?",
            answer:
              "'g' (global) localiza todas as ocorrências; 'i' ignora maiúsculas/minúsculas; 'm' (multilinha) faz ^ e $ casarem com início e fim de cada linha; 's' (dotAll) permite que o ponto (.) case com quebras de linha.",
          },
          {
            question: "Os dados digitados são enviados para a internet?",
            answer:
              "Não. A execução ocorre 100% no cliente (client-side) na memória RAM do seu navegador. Zero dados são enviados a servidores.",
          },
        ],
      },
    },
  },
  {
    id: "timestamp-converter",
    componentKey: "timestamp-converter",
    category: "converters",
    iconName: "Clock",
    isFeatured: true,
    slugs: {
      en: "timestamp",
      pt: "timestamp",
    },
    locales: {
      en: {
        name: "Unix Timestamp & Timezone Converter",
        shortDescription: "Convert Unix Epoch timestamps to human dates, compare world timezones, and convert calendar dates to epoch.",
        metaTitle: "Unix Timestamp & World Timezone Converter — 100% Private & Fast",
        metaDescription:
          "Free online Unix Timestamp and Timezone Converter. Convert seconds and milliseconds to ISO 8601, RFC 2822, Brasília, UTC, New York, Tokyo and London times.",
        keywords: [
          "unix timestamp converter",
          "epoch converter",
          "timestamp to date",
          "date to timestamp",
          "utc converter",
          "timezone comparison",
        ],
        howItWorks: {
          title: "How the Unix Timestamp Converter Works",
          paragraphs: [
            "Unix Time (Epoch) is the number of seconds that have elapsed since midnight UTC on January 1, 1970. It is the universal standard for logging, database timestamps, and distributed system synchronization.",
            "This tool provides real-time ticking epoch clocks, converts between seconds/milliseconds and human dates, and renders a side-by-side comparison across major global timezones.",
          ],
          steps: [
            {
              title: "1. Enter Timestamp or Date",
              desc: "Paste an epoch timestamp or pick a date/time using the interactive selectors.",
            },
            {
              title: "2. View Formatted Outputs",
              desc: "Inspect ISO 8601, RFC 2822, local date, and relative time representations.",
            },
            {
              title: "3. Compare Timezones & Copy",
              desc: "Check local times in Brasília, UTC, New York, Tokyo, and London.",
            },
          ],
        },
        faqs: [
          {
            question: "What is the difference between 10-digit and 13-digit timestamps?",
            answer:
              "10-digit timestamps represent seconds since Unix epoch (standard in Unix/C/PHP). 13-digit timestamps represent milliseconds (standard in JavaScript/Java). This tool supports both automatically.",
          },
          {
            question: "What is the Year 2038 Problem (Y2K38)?",
            answer:
              "On January 19, 2038, 32-bit signed Unix timestamps will overflow. Modern 64-bit systems handle timestamps safely for billions of years.",
          },
        ],
      },
      pt: {
        name: "Conversor de Unix Timestamp e Fusos Horários",
        shortDescription: "Converta timestamps Unix em datas legíveis, compare fusos horários globais e gere epochs a partir de datas.",
        metaTitle: "Conversor de Unix Timestamp e Fusos Horários Online — Rápido e Privado",
        metaDescription:
          "Ferramenta gratuita para converter Unix Timestamp (segundos e ms) em datas legíveis (ISO 8601, Horário de Brasília, UTC, Nova York, Londres, Tóquio).",
        keywords: [
          "conversor timestamp",
          "unix epoch converter",
          "timestamp para data",
          "data para timestamp",
          "horario de brasilia timestamp",
          "conversor de fuso horario",
        ],
        howItWorks: {
          title: "Como Funciona o Conversor de Timestamp Unix",
          paragraphs: [
            "O Unix Timestamp (Tempo Epoch) representa a quantidade de segundos decorridos desde 1º de janeiro de 1970 às 00:00:00 UTC. É o formato padrão universal para bancos de dados, APIs e logs de sistemas.",
            "Esta ferramenta converte instantaneamente timestamps de 10 dígitos (segundos) e 13 dígitos (milissegundos) em datas formatadas em múltiplos fusos horários de referência mundial.",
          ],
          steps: [
            {
              title: "1. Insira o Timestamp ou Data",
              desc: "Cole um timestamp numérico ou defina ano, mês, dia e hora nos campos de entrada.",
            },
            {
              title: "2. Veja os Formatos Padronizados",
              desc: "Acompanhe formatos ISO 8601, RFC 2822, data local e tempo relativo.",
            },
            {
              title: "3. Compare Fusos Horários",
              desc: "Veja a equivalência de horário em Brasília (BRT), UTC, Nova York, Londres e Tóquio.",
            },
          ],
        },
        faqs: [
          {
            question: "Qual a diferença entre timestamp em segundos e em milissegundos?",
            answer:
              "Timestamps com 10 dígitos estão em segundos (usados em Linux, Python, PHP, C). Timestamps com 13 dígitos estão em milissegundos (usados nativamente em JavaScript com Date.now() e Java).",
          },
          {
            question: "O que é o Horário de Brasília (BRT)?",
            answer:
              "O Horário Oficial de Brasília é definido pelo fuso UTC-3 (America/Sao_Paulo).",
          },
        ],
      },
    },
  },
  {
    id: "curl-converter",
    componentKey: "curl-converter",
    category: "converters",
    iconName: "Terminal",
    isFeatured: true,
    slugs: {
      en: "curl-converter",
      pt: "conversor-curl",
    },
    locales: {
      en: {
        name: "cURL to Code Converter",
        shortDescription: "Convert cURL commands to JavaScript Fetch, Axios, Python Requests, Go, PHP, C# and Rust code snippets.",
        metaTitle: "cURL to Code Converter Online — Fetch, Axios, Python, Go — 100% Private",
        metaDescription:
          "Free online cURL to Code Converter. Convert curl terminal commands into clean, idiomatic JavaScript (fetch & axios), Python (requests), Go, PHP, Node.js, and C#.",
        keywords: [
          "curl converter",
          "curl to fetch",
          "curl to python",
          "curl to axios",
          "curl to go",
          "curl parser online",
        ],
        howItWorks: {
          title: "How the cURL Converter Works",
          paragraphs: [
            "cURL is the universal command-line utility for making HTTP network requests. When testing APIs, copying curl commands from browser DevTools is common practice.",
            "This tool parses flags (-X, -H, -d, -u, -b, --data-raw), extracts URLs, headers, and request bodies, and automatically generates production-ready code snippets in your favorite programming languages.",
          ],
          steps: [
            {
              title: "1. Paste cURL Command",
              desc: "Paste your raw multi-line or single-line curl terminal command.",
            },
            {
              title: "2. Choose Target Language",
              desc: "Select between Fetch, Axios, Python Requests, Go net/http, PHP, C#, and Rust.",
            },
            {
              title: "3. Copy Code Snippet",
              desc: "Copy clean, formatted code with 1 click to use in your application.",
            },
          ],
        },
        faqs: [
          {
            question: "How do I get a cURL command from Chrome or Firefox?",
            answer:
              "Open Developer Tools (F12) -> Network tab -> Right-click any HTTP request -> Copy -> Copy as cURL (bash). Then paste it into this tool.",
          },
          {
            question: "Does this tool support JSON and Basic Auth?",
            answer:
              "Yes. It automatically formats JSON payloads with proper indentation and converts Basic Auth (-u username:password) into standard Authorization headers.",
          },
        ],
      },
      pt: {
        name: "Conversor de cURL para Código (cURL Converter)",
        shortDescription: "Converta comandos cURL para código em JavaScript (Fetch e Axios), Python (requests), Go, PHP, C# e Rust.",
        metaTitle: "Conversor de cURL para Código Online — Fetch, Axios, Python, Go — Rápido e Privado",
        metaDescription:
          "Ferramenta gratuita para converter comandos curl em código limpo para JavaScript/TypeScript (Fetch, Axios), Python (requests), Go (net/http), PHP, C# e Rust.",
        keywords: [
          "conversor curl",
          "curl para fetch",
          "curl para python",
          "curl para axios",
          "curl para go",
          "converter comando curl",
        ],
        howItWorks: {
          title: "Como Funciona o Conversor de cURL para Código",
          paragraphs: [
            "cURL é a ferramenta de linha de comando mais popular para executar requisições HTTP. No dia a dia de desenvolvimento de APIs e integrações, é comum copiar comandos cURL da aba Network do navegador.",
            "Nossa ferramenta faz a análise sintática de parâmetros (-X, -H, -d, -u, -b), extrai método, headers e payloads e gera snippets idiomáticos prontos para uso em diversas linguagens.",
          ],
          steps: [
            {
              title: "1. Cole o Comando cURL",
              desc: "Cole o comando completo obtido no terminal ou na aba Network do navegador.",
            },
            {
              title: "2. Selecione a Linguagem Desejada",
              desc: "Alterne entre abas como Fetch, Axios, Python Requests, Go, PHP, C# ou Rust.",
            },
            {
              title: "3. Copie o Código Gerado",
              desc: "Copie o snippet funcional com 1 clique para colar direto no seu projeto.",
            },
          ],
        },
        faqs: [
          {
            question: "Como copiar um cURL do navegador?",
            answer:
              "Abra o DevTools (F12) -> Aba Rede (Network) -> Clique com o botão direito na requisição desejada -> Copiar -> Copiar como cURL (bash). Cole aqui e o código é gerado na hora.",
          },
          {
            question: "Suporta requisições com autenticação e JSON?",
            answer:
              "Sim. O parser detecta automaticamente autenticação Basic/Bearer (-u, -H Authorization) e formata payloads JSON com indentação limpa.",
          },
        ],
      },
    },
  },
  {
    id: "markdown-preview",
    componentKey: "markdown-preview",
    category: "developer",
    iconName: "FileText",
    isFeatured: true,
    slugs: {
      en: "markdown-preview",
      pt: "visualizador-markdown",
    },
    locales: {
      en: {
        name: "Markdown & HTML Live Previewer",
        shortDescription: "Split-view real-time Markdown editor with live HTML rendering, formatting toolbar, stats, and export.",
        metaTitle: "Markdown & HTML Live Previewer Online — 100% Private & Fast",
        metaDescription:
          "Free online Markdown Live Editor and Previewer. Real-time split view, GitHub-flavored markdown (GFM) support, tables, task lists, HTML export, and word counter.",
        keywords: [
          "markdown previewer",
          "markdown editor online",
          "markdown to html",
          "live markdown preview",
          "github markdown editor",
          "markdown table generator",
        ],
        howItWorks: {
          title: "How the Markdown Previewer Works",
          paragraphs: [
            "Markdown is the lightweight markup language used across GitHub, technical documentation, and static site generators.",
            "This tool provides a split-view live editor that compiles Markdown into semantic, sanitized HTML in real-time as you type, with support for tables, task lists, code blocks, and statistics.",
          ],
          steps: [
            {
              title: "1. Write or Paste Markdown",
              desc: "Type directly or use the quick formatting toolbar for bold, headers, tables, and lists.",
            },
            {
              title: "2. View Live Rendered HTML",
              desc: "See immediate visual feedback with GitHub-style typography and dark mode.",
            },
            {
              title: "3. Export or Download",
              desc: "Copy raw HTML or download your document as .md or .html with 1 click.",
            },
          ],
        },
        faqs: [
          {
            question: "Which Markdown features are supported?",
            answer:
              "Full GitHub-Flavored Markdown (GFM): Headings (# to ######), bold, italic, strikethrough, blockquotes, code blocks with syntax styling, task lists ([ ] / [x]), tables, and links.",
          },
          {
            question: "Can I download my file as HTML?",
            answer:
              "Yes. You can export both the raw Markdown (.md) or the compiled clean HTML (.html) file directly to your computer.",
          },
        ],
      },
      pt: {
        name: "Editor e Visualizador Markdown em Tempo Real",
        shortDescription: "Editor Markdown com preview HTML ao vivo lado a lado, barra de formatação, estatísticas de texto e exportação.",
        metaTitle: "Editor e Visualizador Markdown Online — Split View — Rápido e Privado",
        metaDescription:
          "Ferramenta gratuita para escrever e visualizar Markdown em tempo real. Suporte a tabelas, listas de tarefas, blocos de código, exportação para HTML e contador de palavras.",
        keywords: [
          "editor markdown",
          "visualizador markdown",
          "markdown para html",
          "preview markdown online",
          "github markdown brasil",
          "contador de palavras markdown",
        ],
        howItWorks: {
          title: "Como Funciona o Visualizador de Markdown",
          paragraphs: [
            "Markdown é a linguagem de marcação simples mais utilizada no mundo para documentação de software, repositórios GitHub, blogs e READMEs.",
            "Nossa ferramenta oferece um editor em tela dividida (Split View) com compilação instantânea para HTML semântico, suporte a tabelas, caixas de tarefas, estatísticas de leitura e botões de exportação.",
          ],
          steps: [
            {
              title: "1. Escreva no Editor",
              desc: "Digite seu texto ou use a barra de atalhos rápidos para inserir negrito, títulos, tabelas e links.",
            },
            {
              title: "2. Acompanhe o Preview ao Vivo",
              desc: "Veja a renderização visual em tempo real estilizada no padrão moderno.",
            },
            {
              title: "3. Exporte como MD ou HTML",
              desc: "Copie o HTML gerado ou baixe os arquivos .md e .html diretamente.",
            },
          ],
        },
        faqs: [
          {
            question: "Quais elementos do Markdown são suportados?",
            answer:
              "Títulos (# a ######), negrito, itálico, tachado, citações (>), blocos de código com destaque, listas ordenadas, listas com caixas de seleção (- [ ] / - [x]), tabelas e imagens.",
          },
          {
            question: "Posso exportar o resultado para HTML?",
            answer:
              "Sim. Você pode copiar o código HTML renderizado para a área de transferência ou baixar o arquivo .html completo com 1 clique.",
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
