import ms from "ms";

import { memo } from "@/lib/cache";
import { getGeolocation } from "@/lib/geolocation";
import { formatPlaceAddressShort, reverseLocation } from "../lib";

const CACHE_TTL = ms("7d");
const CACHE_KEY = "getAddressQuery";

export const getAddressQuery = memo(
	async function getAddressQuery(): Promise<string> {
		let out = "";

		const { lat, lng } = await getGeolocation();

		if (!lat || !lng) {
			throw new Error("Unable to get geolocation. Reason: Missing coordinates");
		}

		const data = await reverseLocation({
			lat,
			lng,
		});

		out = formatPlaceAddressShort(data);

		return out;
	},
	CACHE_TTL,
	CACHE_KEY
);
