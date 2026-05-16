import { formatDistanceToNow } from "date-fns";
import { enUS, es, type Locale } from "date-fns/locale";

import { getLanguage } from "@/lib/i18n";

const locales = new Map<string, Locale>([
  ["en", enUS],
  ["es", es],
]);

export function human(date?: Date | number | string, lang = getLanguage()) {
  if (!date) {
    return "";
  }

  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: locales.get(lang)
  });

}