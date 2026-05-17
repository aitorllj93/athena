import { getTranslations } from "@/lib/i18n";
import { WEATHER_ICONS } from "./constants";
import type { Forecast } from "./types";

// biome-ignore lint/suspicious/noExplicitAny: i18n translation function
let translator: any = null;
async function getT() {
  if (translator) return translator;
  const { t } = await getTranslations("weather");
  translator = t;
  return t;
}

export async function formatForecast({ daily, daily_units }: Forecast) {
  const t = await getT();
	const { temperature_2m_mean, weather_code } = daily;

	const temperature = `${temperature_2m_mean}${daily_units.temperature_2m_mean}`;

	const description = t(`codes.${weather_code[0]}.day`);

	const emoji =
		WEATHER_ICONS[weather_code[0] as keyof typeof WEATHER_ICONS]?.day.emoji;

	return `${emoji} ${description} (${temperature})`;
}
