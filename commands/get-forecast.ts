import ms from "ms";

import { memo } from "@/lib/cache";
import { getGeolocation } from "@/lib/geolocation";
import { forecast, formatForecast } from "@/lib/weather";

const geolocation = await getGeolocation();

export const getForecastCommand = memo(
	async function getForecastCommand(): Promise<string> {
		let out = "";

		const data = await forecast({
			geolocation,
		});

		out = formatForecast(data);

		return out;
	},
	ms("12h"),
);
