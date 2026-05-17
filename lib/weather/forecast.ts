import { FORECAST_URL } from "./constants";
import type { Forecast } from "./types";

type ForecastParams = {
	geolocation?: {
		tzid?: string;
		lat?: number;
		lng?: number;
	};
};
export async function forecast(params: ForecastParams): Promise<Forecast> {
	if (
		!params.geolocation?.lat ||
		!params.geolocation?.lng ||
		!params.geolocation.tzid
	) {
		throw new Error("Geolocation is required to fetch forecast");
	}

	const { lat, lng } = params.geolocation;

	const url = new URL(FORECAST_URL);
	url.searchParams.append("latitude", lat.toString());
	url.searchParams.append("longitude", lng.toString());
	url.searchParams.append(
		"daily",
		"temperature_2m_max,temperature_2m_min,weather_code,temperature_2m_mean",
	);
	url.searchParams.append("timezone", params.geolocation.tzid);
	url.searchParams.append("forecast_days", "1");

	const res = await fetch(url);

	if (!res.ok) {
		throw new Error(res.statusText);
	}

	const data = (await res.json()) as Forecast;

	return data;
}
