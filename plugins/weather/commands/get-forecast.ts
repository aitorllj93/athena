import ms from "ms";

import { memo } from "@/lib/cache";
import { getGeolocation } from "@/lib/geolocation";
import { forecast, formatForecast } from "../lib";

const CACHE_TTL = ms("12h");
const CACHE_KEY = "getForecastCommand";

export const getForecastCommand = memo(
	async function getForecastCommand(): Promise<string> {
		let out = "";

		const geolocation = await getGeolocation();

		const data = await forecast({
			geolocation,
		});

		out = await formatForecast(data);

		return out;
	},
	CACHE_TTL,
	CACHE_KEY,
);
