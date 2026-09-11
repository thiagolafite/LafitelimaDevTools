export interface ParsedCurl {
  raw: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  data?: string;
  jsonData?: Record<string, unknown> | unknown[];
  auth?: { username: string; password?: string };
  cookies: Record<string, string>;
  insecure: boolean;
}

export interface GeneratedCodeSnippets {
  jsFetch: string;
  jsAxios: string;
  pythonRequests: string;
  goNetHttp: string;
  phpCurl: string;
  nodeHttps: string;
  csharpHttpClient: string;
  rustReqwest: string;
}

export function parseCurlCommand(rawCommand: string): ParsedCurl {
  const cleanCmd = rawCommand
    .replace(/\\\r?\n/g, " ") // join line continuation backslashes
    .trim();

  // Basic regex tokenization that preserves quotes
  const args: string[] = [];
  const regex = /(?:[^\s"']+|"[^"]*"|'[^']*')+/g;
  let match;

  while ((match = regex.exec(cleanCmd)) !== null) {
    let arg = match[0];
    if (
      (arg.startsWith('"') && arg.endsWith('"')) ||
      (arg.startsWith("'") && arg.endsWith("'"))
    ) {
      arg = arg.slice(1, -1);
    }
    args.push(arg);
  }

  let url = "";
  let method = "GET";
  const headers: Record<string, string> = {};
  const cookies: Record<string, string> = {};
  let data: string | undefined = undefined;
  let auth: { username: string; password?: string } | undefined = undefined;
  let insecure = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "curl") continue;

    // Method flag
    if (arg === "-X" || arg === "--request") {
      if (i + 1 < args.length) {
        method = args[++i].toUpperCase();
      }
    }
    // Header flag
    else if (arg === "-H" || arg === "--header") {
      if (i + 1 < args.length) {
        const headerStr = args[++i];
        const colonIdx = headerStr.indexOf(":");
        if (colonIdx !== -1) {
          const key = headerStr.substring(0, colonIdx).trim();
          const val = headerStr.substring(colonIdx + 1).trim();
          headers[key] = val;
        }
      }
    }
    // Data flag
    else if (
      arg === "-d" ||
      arg === "--data" ||
      arg === "--data-raw" ||
      arg === "--data-binary" ||
      arg === "--data-ascii"
    ) {
      if (i + 1 < args.length) {
        data = args[++i];
        if (method === "GET") method = "POST";
      }
    }
    // Auth flag
    else if (arg === "-u" || arg === "--user") {
      if (i + 1 < args.length) {
        const authStr = args[++i];
        const [username, password] = authStr.split(":");
        auth = { username, password };
      }
    }
    // Cookie flag
    else if (arg === "-b" || arg === "--cookie") {
      if (i + 1 < args.length) {
        const cookieStr = args[++i];
        cookieStr.split(";").forEach((pair) => {
          const [k, v] = pair.split("=");
          if (k) cookies[k.trim()] = v ? v.trim() : "";
        });
      }
    }
    // Insecure flag
    else if (arg === "-k" || arg === "--insecure") {
      insecure = true;
    }
    // URL without flag (or with --url)
    else if (arg === "--url") {
      if (i + 1 < args.length) {
        url = args[++i];
      }
    } else if (
      !arg.startsWith("-") &&
      (arg.startsWith("http://") ||
        arg.startsWith("https://") ||
        arg.includes(".") ||
        arg.startsWith("localhost"))
    ) {
      if (!url) url = arg;
    }
  }

  // Fallback url
  if (!url) url = "https://api.example.com/v1/resource";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  let jsonData: Record<string, unknown> | unknown[] | undefined = undefined;
  if (data) {
    try {
      jsonData = JSON.parse(data);
    } catch {
      jsonData = undefined;
    }
  }

  return {
    raw: rawCommand,
    url,
    method,
    headers,
    data,
    jsonData,
    auth,
    cookies,
    insecure,
  };
}

export function generateCodeSnippets(parsed: ParsedCurl): GeneratedCodeSnippets {
  const { url, method, headers, data, jsonData, auth } = parsed;

  const headerKeys = Object.keys(headers);
  const hasHeaders = headerKeys.length > 0;
  const hasData = Boolean(data);

  // 1. JavaScript / TypeScript (fetch)
  let jsFetch = `async function request() {\n`;
  jsFetch += `  const url = "${url}";\n`;
  jsFetch += `  const options: RequestInit = {\n`;
  jsFetch += `    method: "${method}",\n`;

  if (hasHeaders || auth) {
    jsFetch += `    headers: {\n`;
    for (const [k, v] of Object.entries(headers)) {
      jsFetch += `      "${k}": "${v.replace(/"/g, '\\"')}",\n`;
    }
    if (auth) {
      const token = btoa(`${auth.username}:${auth.password || ""}`);
      jsFetch += `      "Authorization": "Basic ${token}",\n`;
    }
    jsFetch += `    },\n`;
  }

  if (hasData) {
    if (jsonData) {
      jsFetch += `    body: JSON.stringify(${JSON.stringify(jsonData, null, 6).trim()}),\n`;
    } else {
      jsFetch += `    body: "${(data || "").replace(/"/g, '\\"')}",\n`;
    }
  }

  jsFetch += `  };\n\n`;
  jsFetch += `  try {\n`;
  jsFetch += `    const response = await fetch(url, options);\n`;
  jsFetch += `    const result = await response.json();\n`;
  jsFetch += `    console.log(result);\n`;
  jsFetch += `    return result;\n`;
  jsFetch += `  } catch (error) {\n`;
  jsFetch += `    console.error("Fetch error:", error);\n`;
  jsFetch += `  }\n`;
  jsFetch += `}\n\nrequest();`;

  // 2. JavaScript / TypeScript (axios)
  let jsAxios = `import axios from "axios";\n\n`;
  jsAxios += `async function makeRequest() {\n`;
  jsAxios += `  try {\n`;
  jsAxios += `    const response = await axios({\n`;
  jsAxios += `      method: "${method.toLowerCase()}",\n`;
  jsAxios += `      url: "${url}",\n`;

  if (hasHeaders) {
    jsAxios += `      headers: {\n`;
    for (const [k, v] of Object.entries(headers)) {
      jsAxios += `        "${k}": "${v.replace(/"/g, '\\"')}",\n`;
    }
    jsAxios += `      },\n`;
  }

  if (auth) {
    jsAxios += `      auth: {\n`;
    jsAxios += `        username: "${auth.username}",\n`;
    jsAxios += `        password: "${auth.password || ""}",\n`;
    jsAxios += `      },\n`;
  }

  if (hasData) {
    if (jsonData) {
      jsAxios += `      data: ${JSON.stringify(jsonData, null, 8).trim()},\n`;
    } else {
      jsAxios += `      data: "${(data || "").replace(/"/g, '\\"')}",\n`;
    }
  }

  jsAxios += `    });\n\n`;
  jsAxios += `    console.log(response.data);\n`;
  jsAxios += `    return response.data;\n`;
  jsAxios += `  } catch (error) {\n`;
  jsAxios += `    console.error("Axios error:", error);\n`;
  jsAxios += `  }\n`;
  jsAxios += `}\n\nmakeRequest();`;

  // 3. Python (requests)
  let pythonRequests = `import requests\nimport json\n\n`;
  pythonRequests += `url = "${url}"\n\n`;

  if (hasHeaders) {
    pythonRequests += `headers = {\n`;
    for (const [k, v] of Object.entries(headers)) {
      pythonRequests += `    "${k}": "${v.replace(/"/g, '\\"')}",\n`;
    }
    pythonRequests += `}\n\n`;
  }

  if (hasData) {
    if (jsonData) {
      pythonRequests += `payload = ${JSON.stringify(jsonData, null, 4)}\n\n`;
    } else {
      pythonRequests += `payload = """${data}"""\n\n`;
    }
  }

  pythonRequests += `response = requests.request(\n`;
  pythonRequests += `    method="${method}",\n`;
  pythonRequests += `    url=url,\n`;
  if (hasHeaders) pythonRequests += `    headers=headers,\n`;
  if (hasData) {
    if (jsonData) pythonRequests += `    json=payload,\n`;
    else pythonRequests += `    data=payload,\n`;
  }
  if (auth) {
    pythonRequests += `    auth=("${auth.username}", "${auth.password || ""}"),\n`;
  }
  pythonRequests += `)\n\n`;
  pythonRequests += `print(response.status_code)\n`;
  pythonRequests += `print(response.text)\n`;

  // 4. Go (net/http)
  let goNetHttp = `package main\n\n`;
  goNetHttp += `import (\n`;
  goNetHttp += `\t"fmt"\n`;
  goNetHttp += `\t"io"\n`;
  goNetHttp += `\t"net/http"\n`;
  if (hasData) goNetHttp += `\t"strings"\n`;
  goNetHttp += `)\n\n`;
  goNetHttp += `func main() {\n`;
  goNetHttp += `\turl := "${url}"\n`;

  if (hasData) {
    goNetHttp += `\tpayload := strings.NewReader(\`${(data || "").replace(/`/g, "")}\`)\n`;
    goNetHttp += `\treq, err := http.NewRequest("${method}", url, payload)\n`;
  } else {
    goNetHttp += `\treq, err := http.NewRequest("${method}", url, nil)\n`;
  }

  goNetHttp += `\tif err != nil {\n\t\tpanic(err)\n\t}\n\n`;

  for (const [k, v] of Object.entries(headers)) {
    goNetHttp += `\treq.Header.Add("${k}", "${v.replace(/"/g, '\\"')}")\n`;
  }

  if (auth) {
    goNetHttp += `\treq.SetBasicAuth("${auth.username}", "${auth.password || ""}")\n`;
  }

  goNetHttp += `\n\tres, err := http.DefaultClient.Do(req)\n`;
  goNetHttp += `\tif err != nil {\n\t\tpanic(err)\n\t}\n`;
  goNetHttp += `\tdefer res.Body.Close()\n\n`;
  goNetHttp += `\tbody, _ := io.ReadAll(res.Body)\n`;
  goNetHttp += `\tfmt.Println(res.StatusCode)\n`;
  goNetHttp += `\tfmt.Println(string(body))\n`;
  goNetHttp += `}\n`;

  // 5. PHP (cURL)
  let phpCurl = `<?php\n\n`;
  phpCurl += `$curl = curl_init();\n\n`;
  phpCurl += `curl_setopt_array($curl, array(\n`;
  phpCurl += `  CURLOPT_URL => '${url}',\n`;
  phpCurl += `  CURLOPT_RETURNTRANSFER => true,\n`;
  phpCurl += `  CURLOPT_CUSTOMREQUEST => '${method}',\n`;

  if (hasData) {
    phpCurl += `  CURLOPT_POSTFIELDS => '${(data || "").replace(/'/g, "\\'")}',\n`;
  }

  if (hasHeaders) {
    phpCurl += `  CURLOPT_HTTPHEADER => array(\n`;
    for (const [k, v] of Object.entries(headers)) {
      phpCurl += `    '${k}: ${v.replace(/'/g, "\\'")}',\n`;
    }
    phpCurl += `  ),\n`;
  }

  phpCurl += `));\n\n`;
  phpCurl += `$response = curl_exec($curl);\n`;
  phpCurl += `curl_close($curl);\n\n`;
  phpCurl += `echo $response;\n`;

  // 6. Node.js (https)
  let nodeHttps = `const https = require('https');\n\n`;
  nodeHttps += `const data = JSON.stringify(${JSON.stringify(jsonData || data || {}, null, 2)});\n\n`;
  nodeHttps += `const options = {\n`;
  nodeHttps += `  method: '${method}',\n`;
  nodeHttps += `  headers: {\n`;
  for (const [k, v] of Object.entries(headers)) {
    nodeHttps += `    '${k}': '${v.replace(/'/g, "\\'")}',\n`;
  }
  if (hasData) {
    nodeHttps += `    'Content-Length': Buffer.byteLength(data),\n`;
  }
  nodeHttps += `  }\n`;
  nodeHttps += `};\n\n`;
  nodeHttps += `const req = https.request('${url}', options, (res) => {\n`;
  nodeHttps += `  let responseData = '';\n`;
  nodeHttps += `  res.on('data', (chunk) => { responseData += chunk; });\n`;
  nodeHttps += `  res.on('end', () => { console.log(responseData); });\n`;
  nodeHttps += `});\n\n`;
  nodeHttps += `req.on('error', (e) => { console.error(e); });\n`;
  if (hasData) nodeHttps += `req.write(data);\n`;
  nodeHttps += `req.end();\n`;

  // 7. C# (.NET HttpClient)
  let csharpHttpClient = `using System;\nusing System.Net.Http;\nusing System.Text;\nusing System.Threading.Tasks;\n\n`;
  csharpHttpClient += `class Program\n{\n`;
  csharpHttpClient += `    static async Task Main()\n    {\n`;
  csharpHttpClient += `        using var client = new HttpClient();\n`;
  csharpHttpClient += `        using var request = new HttpRequestMessage(HttpMethod.${method.charAt(0).toUpperCase() + method.slice(1).toLowerCase()}, "${url}");\n\n`;

  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() !== "content-type") {
      csharpHttpClient += `        request.Headers.TryAddWithoutValidation("${k}", "${v.replace(/"/g, '\\"')}");\n`;
    }
  }

  if (hasData) {
    const contentType = headers["Content-Type"] || headers["content-type"] || "application/json";
    csharpHttpClient += `\n        request.Content = new StringContent(@"${(data || "").replace(/"/g, '""')}", Encoding.UTF8, "${contentType}");\n`;
  }

  csharpHttpClient += `\n        var response = await client.SendAsync(request);\n`;
  csharpHttpClient += `        var responseBody = await response.Content.ReadAsStringAsync();\n`;
  csharpHttpClient += `        Console.WriteLine(responseBody);\n`;
  csharpHttpClient += `    }\n}\n`;

  // 8. Rust (reqwest)
  let rustReqwest = `use reqwest::Client;\nuse std::error::Error;\n\n`;
  rustReqwest += `#[tokio::main]\nasync fn main() -> Result<(), Box<dyn Error>> {\n`;
  rustReqwest += `    let client = Client::new();\n`;
  rustReqwest += `    let res = client.${method.toLowerCase()}("${url}")\n`;

  for (const [k, v] of Object.entries(headers)) {
    rustReqwest += `        .header("${k}", "${v.replace(/"/g, '\\"')}")\n`;
  }

  if (hasData) {
    if (jsonData) {
      rustReqwest += `        .json(&serde_json::json!(${JSON.stringify(jsonData)}))\n`;
    } else {
      rustReqwest += `        .body("${(data || "").replace(/"/g, '\\"')}")\n`;
    }
  }

  rustReqwest += `        .send()\n`;
  rustReqwest += `        .await?;\n\n`;
  rustReqwest += `    let body = res.text().await?;\n`;
  rustReqwest += `    println!("{}", body);\n`;
  rustReqwest += `    Ok(())\n}\n`;

  return {
    jsFetch,
    jsAxios,
    pythonRequests,
    goNetHttp,
    phpCurl,
    nodeHttps,
    csharpHttpClient,
    rustReqwest,
  };
}
