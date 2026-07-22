import ms from "ms";

import { memo } from "@/lib/cache";
import { getGeolocation } from "@/lib/geolocation";
import type { Format } from "@/lib/utils/render";
import { formatForecast, getForecast } from "../lib";

const CACHE_TTL = ms("12h");
const CACHE_KEY = "getForecastQuery";

type GetForecastQueryArgs = {
	format?: Format;
};
export const getForecastQuery = memo(
	async function getForecastQuery({
		format = "md",
	}: GetForecastQueryArgs): Promise<string> {
		let out = "";

		const geolocation = await getGeolocation();

		const data = await getForecast({
			geolocation,
		});

		if (format === "json") {
			return JSON.stringify({ data });
		}

		out = await formatForecast(data);

		return out;
	},
	CACHE_TTL,
	CACHE_KEY,
);
