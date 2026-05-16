const TZID = process.env.TZID;
const COORDS = process.env.COORDS;

export type Geolocation = {
	tzid?: string;
	lat?: number;
	lng?: number;
};
export async function getGeolocation(): Promise<Geolocation> {
	const [lat, lng] = COORDS
		? COORDS.split(",").map((val) => Number.parseFloat(val))
		: [];

	return {
		tzid: TZID,
		lat,
		lng,
	};
}
