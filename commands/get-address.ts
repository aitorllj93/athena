import ms from "ms";

import { memo } from "@/lib/cache";
import { getGeolocation } from "@/lib/geolocation";
import { formatPlaceAddressShort, reverseLocation } from "@/lib/map";

const { lat, lng } = await getGeolocation();

export const getAddressCommand = memo(
	async function getAddressCommand(): Promise<string> {
		let out = "";

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
	ms("7d"),
);
