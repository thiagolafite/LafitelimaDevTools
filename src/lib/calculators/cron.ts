export interface CronFieldDetail {
  name: string;
  namePt: string;
  value: string;
  allowedRange: string;
  description: string;
  descriptionPt: string;
}

export interface CronParseResult {
  isValid: boolean;
  error?: string;
  expression: string;
  humanReadable: {
    en: string;
    pt: string;
  };
  fields: CronFieldDetail[];
  nextExecutions: Date[];
}

export interface CronPreset {
  name: { en: string; pt: string };
  expression: string;
  description: { en: string; pt: string };
}

export const CRON_PRESETS: CronPreset[] = [
  {
    name: { en: "Every minute", pt: "A cada minuto" },
    expression: "* * * * *",
    description: { en: "Runs every single minute", pt: "Executa a cada minuto continuamente" },
  },
  {
    name: { en: "Every 5 minutes", pt: "A cada 5 minutos" },
    expression: "*/5 * * * *",
    description: { en: "Runs at minute 0, 5, 10, 15...", pt: "Dispara nos minutos 0, 5, 10, 15, 20..." },
  },
  {
    name: { en: "Every 15 minutes", pt: "A cada 15 minutos" },
    expression: "*/15 * * * *",
    description: { en: "Runs at :00, :15, :30, and :45", pt: "Dispara aos 0, 15, 30 e 45 minutos" },
  },
  {
    name: { en: "Every hour (at minute 0)", pt: "A cada hora (no minuto 0)" },
    expression: "0 * * * *",
    description: { en: "Runs at the start of every hour", pt: "Executa no início de cada hora (:00)" },
  },
  {
    name: { en: "Every day at midnight", pt: "Todo dia à meia-noite" },
    expression: "0 0 * * *",
    description: { en: "Runs daily at 00:00:00", pt: "Executa diariamente às 00:00:00" },
  },
  {
    name: { en: "Weekdays at 9:00 AM", pt: "Segunda a sexta às 09:00" },
    expression: "0 9 * * 1-5",
    description: { en: "Runs Mon-Fri at 09:00 AM", pt: "Executa de segunda a sexta-feira às 09:00" },
  },
  {
    name: { en: "Every Sunday at midnight", pt: "Todo domingo à meia-noite" },
    expression: "0 0 * * 0",
    description: { en: "Runs once a week on Sunday at 00:00", pt: "Dispara uma vez por semana aos domingos às 00:00" },
  },
  {
    name: { en: "1st day of every month at 00:00", pt: "Dia 1 de cada mês às 00:00" },
    expression: "0 0 1 * *",
    description: { en: "Runs monthly on the first day", pt: "Executa mensalmente no primeiro dia do mês" },
  },
  {
    name: { en: "Twice a day (12:00 and 00:00)", pt: "Duas vezes ao dia (12:00 e 00:00)" },
    expression: "0 0,12 * * *",
    description: { en: "Runs at noon and midnight", pt: "Executa ao meio-dia e à meia-noite" },
  },
];

const MONTH_NAMES = [
  { en: "January", pt: "Janeiro" },
  { en: "February", pt: "Fevereiro" },
  { en: "March", pt: "Março" },
  { en: "April", pt: "Abril" },
  { en: "May", pt: "Maio" },
  { en: "June", pt: "Junho" },
  { en: "July", pt: "Julho" },
  { en: "August", pt: "Agosto" },
  { en: "September", pt: "Setembro" },
  { en: "October", pt: "Outubro" },
  { en: "November", pt: "Novembro" },
  { en: "December", pt: "Dezembro" },
];

const DAY_NAMES = [
  { en: "Sunday", pt: "Domingo" },
  { en: "Monday", pt: "Segunda-feira" },
  { en: "Tuesday", pt: "Terça-feira" },
  { en: "Wednesday", pt: "Quarta-feira" },
  { en: "Thursday", pt: "Quinta-feira" },
  { en: "Friday", pt: "Sexta-feira" },
  { en: "Saturday", pt: "Sábado" },
];

function describeMinute(min: string): { en: string; pt: string } {
  if (min === "*") return { en: "every minute", pt: "a cada minuto" };
  if (min.startsWith("*/")) {
    const step = min.replace("*/", "");
    return { en: `every ${step} minutes`, pt: `a cada ${step} minutos` };
  }
  if (min.includes("-")) {
    const [start, end] = min.split("-");
    return { en: `every minute from ${start} through ${end}`, pt: `a cada minuto entre os minutos ${start} e ${end}` };
  }
  if (min.includes(",")) {
    return { en: `at minutes ${min}`, pt: `nos minutos ${min}` };
  }
  return { en: `at minute ${min}`, pt: `no minuto ${min}` };
}

function describeHour(hour: string): { en: string; pt: string } {
  if (hour === "*") return { en: "every hour", pt: "a cada hora" };
  if (hour.startsWith("*/")) {
    const step = hour.replace("*/", "");
    return { en: `every ${step} hours`, pt: `a cada ${step} horas` };
  }
  if (hour.includes("-")) {
    const [start, end] = hour.split("-");
    return { en: `past every hour from ${start}:00 through ${end}:00`, pt: `entre ${start}:00 e ${end}:00` };
  }
  if (hour.includes(",")) {
    return { en: `at hours ${hour}`, pt: `às horas ${hour}` };
  }
  return { en: `past hour ${hour.padStart(2, "0")}:00`, pt: `às ${hour.padStart(2, "0")}h` };
}

function describeDayOfMonth(dom: string): { en: string; pt: string } {
  if (dom === "*") return { en: "every day", pt: "todos os dias" };
  if (dom.startsWith("*/")) {
    const step = dom.replace("*/", "");
    return { en: `every ${step} days`, pt: `a cada ${step} dias` };
  }
  if (dom.includes(",")) {
    return { en: `on day ${dom} of the month`, pt: `nos dias ${dom} do mês` };
  }
  return { en: `on day ${dom} of the month`, pt: `no dia ${dom} do mês` };
}

function describeMonth(mon: string): { en: string; pt: string } {
  if (mon === "*") return { en: "every month", pt: "em todos os meses" };
  if (mon.startsWith("*/")) {
    const step = mon.replace("*/", "");
    return { en: `every ${step} months`, pt: `a cada ${step} meses` };
  }
  const monNum = parseInt(mon, 10);
  if (!isNaN(monNum) && monNum >= 1 && monNum <= 12) {
    return {
      en: `only in ${MONTH_NAMES[monNum - 1].en}`,
      pt: `apenas em ${MONTH_NAMES[monNum - 1].pt}`,
    };
  }
  return { en: `in month ${mon}`, pt: `no mês ${mon}` };
}

function describeDayOfWeek(dow: string): { en: string; pt: string } {
  if (dow === "*" || dow === "?") return { en: "every day of the week", pt: "todos os dias da semana" };
  if (dow === "1-5") return { en: "Monday through Friday", pt: "de segunda a sexta-feira" };
  if (dow === "0,6" || dow === "6,0" || dow === "7,6") return { en: "on weekends", pt: "aos finais de semana" };
  
  const days = dow.split(",").map((d) => {
    const num = parseInt(d, 10);
    if (!isNaN(num) && num >= 0 && num <= 7) {
      const idx = num === 7 ? 0 : num;
      return DAY_NAMES[idx];
    }
    return { en: d, pt: d };
  });

  return {
    en: `on ${days.map((d) => d.en).join(", ")}`,
    pt: `em ${days.map((d) => d.pt).join(", ")}`,
  };
}

function parseCronPart(part: string, minVal: number, maxVal: number): number[] {
  const result: number[] = [];
  if (part === "*" || part === "?") {
    for (let i = minVal; i <= maxVal; i++) result.push(i);
    return result;
  }

  const subparts = part.split(",");
  for (const sp of subparts) {
    if (sp.includes("/")) {
      const [range, stepStr] = sp.split("/");
      const step = parseInt(stepStr, 10);
      let start = minVal;
      let end = maxVal;
      if (range !== "*") {
        if (range.includes("-")) {
          const [rStart, rEnd] = range.split("-").map((v) => parseInt(v, 10));
          start = rStart;
          end = rEnd;
        } else {
          start = parseInt(range, 10);
        }
      }
      for (let i = start; i <= end; i += step) {
        result.push(i);
      }
    } else if (sp.includes("-")) {
      const [start, end] = sp.split("-").map((v) => parseInt(v, 10));
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
    } else {
      const val = parseInt(sp, 10);
      if (!isNaN(val)) result.push(val);
    }
  }

  return Array.from(new Set(result)).sort((a, b) => a - b);
}

export function calculateNextExecutions(cronExpr: string, count = 5): Date[] {
  const parts = cronExpr.trim().split(/\s+/);
  if (parts.length < 5) return [];

  const [minStr, hourStr, domStr, monStr, dowStr] = parts;

  const validMinutes = parseCronPart(minStr, 0, 59);
  const validHours = parseCronPart(hourStr, 0, 23);
  const validDaysOfMonth = parseCronPart(domStr, 1, 31);
  const validMonths = parseCronPart(monStr, 1, 12);
  const validDaysOfWeek = parseCronPart(dowStr, 0, 7).map((d) => (d === 7 ? 0 : d));

  const results: Date[] = [];
  const current = new Date();
  current.setSeconds(0, 0);
  current.setMinutes(current.getMinutes() + 1);

  // Safety limit: max 365 days of iteration
  const maxIterations = 525600; // minutes in a year
  let iterations = 0;

  while (results.length < count && iterations < maxIterations) {
    iterations++;
    const month = current.getMonth() + 1;
    const dom = current.getDate();
    const dow = current.getDay();
    const hour = current.getHours();
    const min = current.getMinutes();

    if (!validMonths.includes(month)) {
      current.setMonth(current.getMonth() + 1, 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }

    const domMatch = domStr === "*" || validDaysOfMonth.includes(dom);
    const dowMatch = dowStr === "*" || dowStr === "?" || validDaysOfWeek.includes(dow);

    const isDayValid = domStr !== "*" && (dowStr !== "*" && dowStr !== "?")
      ? domMatch || dowMatch
      : domMatch && dowMatch;

    if (!isDayValid) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }

    if (!validHours.includes(hour)) {
      current.setHours(current.getHours() + 1, 0, 0, 0);
      continue;
    }

    if (!validMinutes.includes(min)) {
      current.setMinutes(current.getMinutes() + 1);
      continue;
    }

    results.push(new Date(current));
    current.setMinutes(current.getMinutes() + 1);
  }

  return results;
}

export function parseCronExpression(expression: string): CronParseResult {
  const cleanExpr = expression.trim();
  const parts = cleanExpr.split(/\s+/);

  if (parts.length < 5) {
    return {
      isValid: false,
      error: "Expressão cron incompleta (esperado mínimo de 5 campos: minuto, hora, dia do mês, mês, dia da semana).",
      expression: cleanExpr,
      humanReadable: {
        en: "Invalid cron expression",
        pt: "Expressão cron inválida",
      },
      fields: [],
      nextExecutions: [],
    };
  }

  const [min, hour, dom, mon, dow] = parts;

  const descMin = describeMinute(min);
  const descHour = describeHour(hour);
  const descDom = describeDayOfMonth(dom);
  const descMon = describeMonth(mon);
  const descDow = describeDayOfWeek(dow);

  const humanEn = `${descMin.en.charAt(0).toUpperCase() + descMin.en.slice(1)}, ${descHour.en}, ${descDom.en}, ${descMon.en}, ${descDow.en}.`;
  const humanPt = `${descMin.pt.charAt(0).toUpperCase() + descMin.pt.slice(1)}, ${descHour.pt}, ${descDom.pt}, ${descMon.pt}, ${descDow.pt}.`;

  const fields: CronFieldDetail[] = [
    {
      name: "Minute",
      namePt: "Minuto",
      value: min,
      allowedRange: "0-59",
      description: descMin.en,
      descriptionPt: descMin.pt,
    },
    {
      name: "Hour",
      namePt: "Hora",
      value: hour,
      allowedRange: "0-23",
      description: descHour.en,
      descriptionPt: descHour.pt,
    },
    {
      name: "Day of Month",
      namePt: "Dia do Mês",
      value: dom,
      allowedRange: "1-31",
      description: descDom.en,
      descriptionPt: descDom.pt,
    },
    {
      name: "Month",
      namePt: "Mês",
      value: mon,
      allowedRange: "1-12 or JAN-DEC",
      description: descMon.en,
      descriptionPt: descMon.pt,
    },
    {
      name: "Day of Week",
      namePt: "Dia da Semana",
      value: dow,
      allowedRange: "0-7 or SUN-SAT (0/7 = Sunday)",
      description: descDow.en,
      descriptionPt: descDow.pt,
    },
  ];

  let nextExecs: Date[] = [];
  try {
    nextExecs = calculateNextExecutions(cleanExpr, 5);
  } catch {
    nextExecs = [];
  }

  return {
    isValid: true,
    expression: cleanExpr,
    humanReadable: {
      en: humanEn,
      pt: humanPt,
    },
    fields,
    nextExecutions: nextExecs,
  };
}
