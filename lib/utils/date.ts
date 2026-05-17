import { format, formatDistanceToNow } from "date-fns";
import { enUS, es, type Locale } from "date-fns/locale";

import { getLanguage } from "@/lib/i18n";

const locales = new Map<string, Locale>([
  ["en", enUS],
  ["es", es],
]);

const language = getLanguage();

const rtfFormatter = new Intl.RelativeTimeFormat(language, {
	numeric: "auto",
});
const weekdayFormatter = new Intl.DateTimeFormat(language, {
	weekday: "long",
});

const dateFormatter = new Intl.DateTimeFormat(language, {
	day: "numeric",
	month: "long",
});

const fullDateFormat = new Intl.DateTimeFormat(language, {
	day: "numeric",
	month: "long",
  year: "numeric"
});

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function diffDays(a: Date, b: Date) {
	const MS_PER_DAY = 1000 * 60 * 60 * 24;

	const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
	const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

	return Math.round((utc1 - utc2) / MS_PER_DAY);
}

export function today() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today;
}

/**
 * Returns distance from now
 * examples: 
 * - hace 12 horas
 * - hace 1 día
 */
export function formatDistance(date?: Date | number | string, lang = language) {
  if (!date) {
    return "";
  }

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: locales.get(lang)
  });

}

/**
 * Returns formatted time
 * examples: 
 * - 09:00
 * - 12:30
 */
export function formatTime(date: Date | number | string) {
  return format(new Date(date), "HH:mm");
}

/**
 * Returns relative date
 * examples: 
 * - Hoy
 * - Mañana
 * - Miércoles
 * - 23 de mayo
 */
export function formatRelative(date: Date) {
  const now = new Date();
  const diff = diffDays(date, now);

  if (diff >= -1 && diff <= 1) {
    return capitalize(rtfFormatter.format(diff, "day"));
  }

  const nowWeekday = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - nowWeekday);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  if (date >= startOfWeek && date < endOfWeek) {
    return capitalize(weekdayFormatter.format(date));
  }

  return capitalize(dateFormatter.format(date));
}


/**
 * Returns full date
 * examples: 
 * - 23 de mayo de 2026
 */
export function formatFullDate(date: Date | number | string) {
  return capitalize(fullDateFormat.format(new Date(date)));
}

/**
 * Returns humanized minutes
 */
export function formatMinutes(minutes?: number) {
  if (!minutes || minutes <= 0) return '—';

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  // Usa Intl.NumberFormat para plurales localizados (ej: "1 hora" vs "2 horas")
  const fmt = (value: number, unit: 'minute' | 'hour') =>
    new Intl.NumberFormat(language, {
      style: 'unit',
      unit,
      unitDisplay: 'narrow',
    }).format(value);

  if (h === 0) return fmt(m, 'minute');
  if (m === 0) return fmt(h, 'hour');
  return `${fmt(h, 'hour')} ${fmt(m, 'minute')}`;
}