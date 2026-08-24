export interface SubnetResult {
  ip: string;
  cidr: number;
  netmask: string;
  wildcard: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableIp: string;
  lastUsableIp: string;
  totalHosts: number;
  usableHosts: number;
  ipClass: string;
  ipType: string;
  binaryIp: string;
  binaryMask: string;
  binaryNetwork: string;
  binaryBroadcast: string;
  shortNotation: string;
}

export function ipToInt(ip: string): number {
  return (
    ip
      .split(".")
      .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
  );
}

export function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ].join(".");
}

export function cidrToMask(cidr: number): string {
  if (cidr === 0) return "0.0.0.0";
  const mask = ((0xffffffff << (32 - cidr)) & 0xffffffff) >>> 0;
  return intToIp(mask);
}

export function maskToWildcard(maskIp: string): string {
  const maskInt = ipToInt(maskIp);
  const wildcardInt = (~maskInt) >>> 0;
  return intToIp(wildcardInt);
}

export function toBinaryString(ip: string): string {
  return ip
    .split(".")
    .map((octet) => parseInt(octet, 10).toString(2).padStart(8, "0"))
    .join(".");
}

export function getIpClass(firstOctet: number): string {
  if (firstOctet >= 1 && firstOctet <= 126) return "Class A";
  if (firstOctet === 127) return "Loopback";
  if (firstOctet >= 128 && firstOctet <= 191) return "Class B";
  if (firstOctet >= 192 && firstOctet <= 223) return "Class C";
  if (firstOctet >= 224 && firstOctet <= 239) return "Class D (Multicast)";
  if (firstOctet >= 240 && firstOctet <= 255) return "Class E (Experimental)";
  return "Unknown";
}

export function getIpType(ip: string): string {
  const octets = ip.split(".").map(Number);
  const [o1, o2] = octets;

  if (o1 === 10) return "Private (RFC 1918)";
  if (o1 === 172 && o2 >= 16 && o2 <= 31) return "Private (RFC 1918)";
  if (o1 === 192 && o2 === 168) return "Private (RFC 1918)";
  if (o1 === 127) return "Loopback (127.0.0.0/8)";
  if (o1 === 169 && o2 === 254) return "Link-Local / APIPA (169.254.0.0/16)";
  if (o1 >= 224 && o1 <= 239) return "Multicast";
  if (o1 >= 240) return "Reserved";
  return "Public Internet";
}

export function validateIpv4(ip: string): boolean {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    if (!/^\d+$/.test(part)) return false;
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255 && part === num.toString();
  });
}

export function calculateSubnet(ipInput: string, cidrInput: number): SubnetResult | null {
  const cleanIp = ipInput.trim();
  if (!validateIpv4(cleanIp) || cidrInput < 0 || cidrInput > 32) {
    return null;
  }

  const ipInt = ipToInt(cleanIp);
  const maskInt = cidrInput === 0 ? 0 : ((0xffffffff << (32 - cidrInput)) & 0xffffffff) >>> 0;
  const netmask = intToIp(maskInt);
  const wildcard = maskToWildcard(netmask);

  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;

  const networkAddress = intToIp(networkInt);
  const broadcastAddress = intToIp(broadcastInt);

  let totalHosts = Math.pow(2, 32 - cidrInput);
  let usableHosts = 0;
  let firstUsableIp = "";
  let lastUsableIp = "";

  if (cidrInput === 32) {
    usableHosts = 1;
    firstUsableIp = networkAddress;
    lastUsableIp = networkAddress;
  } else if (cidrInput === 31) {
    usableHosts = 2; // RFC 3021 Point-to-Point
    firstUsableIp = networkAddress;
    lastUsableIp = broadcastAddress;
  } else if (cidrInput === 0) {
    usableHosts = totalHosts - 2;
    firstUsableIp = "0.0.0.1";
    lastUsableIp = "255.255.255.254";
  } else {
    usableHosts = totalHosts - 2;
    firstUsableIp = intToIp(networkInt + 1);
    lastUsableIp = intToIp(broadcastInt - 1);
  }

  const firstOctet = parseInt(cleanIp.split(".")[0], 10);

  return {
    ip: cleanIp,
    cidr: cidrInput,
    netmask,
    wildcard,
    networkAddress,
    broadcastAddress,
    firstUsableIp,
    lastUsableIp,
    totalHosts,
    usableHosts,
    ipClass: getIpClass(firstOctet),
    ipType: getIpType(cleanIp),
    binaryIp: toBinaryString(cleanIp),
    binaryMask: toBinaryString(netmask),
    binaryNetwork: toBinaryString(networkAddress),
    binaryBroadcast: toBinaryString(broadcastAddress),
    shortNotation: `${networkAddress}/${cidrInput}`,
  };
}
