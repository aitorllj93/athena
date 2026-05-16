import { getTranslations } from "../i18n";
import { WEATHER_ICONS } from "./constants";
import type { Forecast } from "./types";

const { t } = await getTranslations("weather");

export function formatForecast({ daily, daily_units }: Forecast) {
	const { temperature_2m_mean, weather_code } = daily;

	const temperature = `${temperature_2m_mean}${daily_units.temperature_2m_mean}`;

	const description = t(`codes.${weather_code[0]}.day`);

	const emoji =
		WEATHER_ICONS[weather_code[0] as keyof typeof WEATHER_ICONS]?.day.emoji;

	return `${emoji} ${description} (${temperature})`;
}
