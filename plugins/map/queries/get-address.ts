import ms from "ms";

import { memo } from "@/lib/cache";
import { getGeolocation } from "@/lib/geolocation";
import type { Format } from "@/lib/utils/render";
import { formatPlaceAddressShort, reverseLocation } from "../lib";

const CACHE_TTL = ms("7d");
const CACHE_KEY = "getAddressQuery";

type GetAddressQueryArgs = {
	format?: Format;
};
export const getAddressQuery = memo(
	async function getAddressQuery({
		format = "md",
	}: GetAddressQueryArgs): Promise<string> {
		let out = "";

		const { lat, lng } = await getGeolocation();

		if (!lat || !lng) {
			throw new Error("Unable to get geolocation. Reason: Missing coordinates");
		}

		const data = await reverseLocation({
			lat,
			lng,
		});

		if (format === "json") {
			return JSON.stringify({ data });
		}

		out = formatPlaceAddressShort(data);

		return out;
	},
	CACHE_TTL,
	CACHE_KEY,
);
