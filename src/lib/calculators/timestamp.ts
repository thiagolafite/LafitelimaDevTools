export interface TimezoneInfo {
  id: string;
  name: { en: string; pt: string };
  city: string;
  timezone: string;
  formattedDateTime: string;
  utcOffset: string;
}

export interface TimestampDetails {
  timestampSeconds: number;
  timestampMs: number;
  iso8601: string;
  utcString: string;
  localString: string;
  rfc2822: string;
  relativeTime: {
    en: string;
    pt: string;
  };
  timezones: TimezoneInfo[];
  isLeapYear: boolean;
  dayOfYear: number;
  weekNumber: number;
}

const WORLD_TIMEZONES = [
  { id: "local", name: { en: "Local Browser", pt: "Local do Navegador" }, city: "Your Location", timezone: "" },
  { id: "utc", name: { en: "Universal Time (UTC)", pt: "Tempo Universal (UTC / GMT)" }, city: "Greenwich", timezone: "UTC" },
  { id: "sao_paulo", name: { en: "Brasília Time (BRT)", pt: "Horário de Brasília (BRT / UTC-3)" }, city: "São Paulo / Brasília", timezone: "America/Sao_Paulo" },
  { id: "new_york", name: { en: "Eastern Time (EST/EDT)", pt: "Nova York (EST / EDT)" }, city: "New York", timezone: "America/New_York" },
  { id: "london", name: { en: "London Time (GMT/BST)", pt: "Londres (GMT / BST)" }, city: "London", timezone: "Europe/London" },
  { id: "tokyo", name: { en: "Japan Standard Time (JST)", pt: "Tóquio (JST / UTC+9)" }, city: "Tokyo", timezone: "Asia/Tokyo" },
  { id: "los_angeles", name: { en: "Pacific Time (PST/PDT)", pt: "Los Angeles (PST / PDT)" }, city: "Los Angeles", timezone: "America/Los_Angeles" },
];

function getRelativeTime(date: Date): { en: string; pt: string } {
  const now = Date.now();
  const diffSec = Math.round((date.getTime() - now) / 1000);
  const absSec = Math.abs(diffSec);

  const isPast = diffSec < 0;
  const prefixEn = isPast ? "" : "in ";
  const suffixEn = isPast ? " ago" : "";
  const prefixPt = isPast ? "há " : "em ";

  if (absSec < 5) return { en: "just now", pt: "agora mesmo" };
  if (absSec < 60) {
    return {
      en: `${prefixEn}${absSec} seconds${suffixEn}`,
      pt: `${prefixPt}${absSec} segundos`,
    };
  }
  const mins = Math.floor(absSec / 60);
  if (mins < 60) {
    return {
      en: `${prefixEn}${mins} minute${mins > 1 ? "s" : ""}${suffixEn}`,
      pt: `${prefixPt}${mins} minuto${mins > 1 ? "s" : ""}`,
    };
  }
  const hours = Math.floor(mins / 60);
  if (hours < 24) {
    return {
      en: `${prefixEn}${hours} hour${hours > 1 ? "s" : ""}${suffixEn}`,
      pt: `${prefixPt}${hours} hora${hours > 1 ? "s" : ""}`,
    };
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return {
      en: `${prefixEn}${days} day${days > 1 ? "s" : ""}${suffixEn}`,
      pt: `${prefixPt}${days} dia${days > 1 ? "s" : ""}`,
    };
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return {
      en: `${prefixEn}${months} month${months > 1 ? "s" : ""}${suffixEn}`,
      pt: `${prefixPt}${months} mês${months > 1 ? "es" : ""}`,
    };
  }
  const years = Math.floor(days / 365);
  return {
    en: `${prefixEn}${years} year${years > 1 ? "s" : ""}${suffixEn}`,
    pt: `${prefixPt}${years} ano${years > 1 ? "s" : ""}`,
  };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function parseTimestamp(input: number | string): TimestampDetails | null {
  let ms: number;

  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return null;
    const num = Number(trimmed);
    if (isNaN(num)) return null;
    // If input is less than 10000000000 (10 digits), treat as seconds
    ms = num < 10000000000 ? num * 1000 : num;
  } else {
    ms = input < 10000000000 ? input * 1000 : input;
  }

  const date = new Date(ms);
  if (isNaN(date.getTime())) return null;

  const seconds = Math.floor(ms / 1000);

  const timezones: TimezoneInfo[] = WORLD_TIMEZONES.map((tz) => {
    let formatted: string;
    let offset: string;

    try {
      if (tz.id === "local") {
        formatted = date.toLocaleString("pt-BR", {
          dateStyle: "full",
          timeStyle: "medium",
        });
        const offsetMins = -date.getTimezoneOffset();
        const sign = offsetMins >= 0 ? "+" : "-";
        const hours = String(Math.floor(Math.abs(offsetMins) / 60)).padStart(2, "0");
        const mins = String(Math.abs(offsetMins) % 60).padStart(2, "0");
        offset = `UTC${sign}${hours}:${mins}`;
      } else {
        formatted = new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "full",
          timeStyle: "medium",
          timeZone: tz.timezone,
        }).format(date);

        // Compute offset
        const str = new Intl.DateTimeFormat("en-US", {
          timeZone: tz.timezone,
          timeZoneName: "shortOffset",
        }).format(date);
        const match = str.match(/GMT([+-]\d+(:?\d+)?)/);
        offset = match ? `UTC${match[1]}` : "UTC";
      }
    } catch {
      formatted = date.toUTCString();
      offset = "UTC";
    }

    return {
      id: tz.id,
      name: tz.name,
      city: tz.city,
      timezone: tz.timezone || "Local",
      formattedDateTime: formatted,
      utcOffset: offset,
    };
  });

  return {
    timestampSeconds: seconds,
    timestampMs: ms,
    iso8601: date.toISOString(),
    utcString: date.toUTCString(),
    localString: date.toLocaleString(),
    rfc2822: date.toString(),
    relativeTime: getRelativeTime(date),
    timezones,
    isLeapYear: isLeapYear(date.getUTCFullYear()),
    dayOfYear: getDayOfYear(date),
    weekNumber: getWeekNumber(date),
  };
}

export function dateToTimestamp(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  timezone = "local"
): TimestampDetails | null {
  try {
    let date: Date;
    if (timezone === "utc") {
      date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    } else {
      date = new Date(year, month - 1, day, hour, minute, second);
    }
    return parseTimestamp(date.getTime());
  } catch {
    return null;
  }
}
