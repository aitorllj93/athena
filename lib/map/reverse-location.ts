import type { Place } from "./types";

type ReverseLocationParams = {
	lat: number;
	lng: number;
};
export async function reverseLocation({
	lat,
	lng,
}: ReverseLocationParams): Promise<Place> {
	const url = new URL("https://nominatim.openstreetmap.org/reverse");
	url.searchParams.append("format", "jsonv2");
	url.searchParams.append("lat", lat.toString());
	url.searchParams.append("lon", lng.toString());

	const res = await fetch(url);

	const data = (await res.json()) as Place;

	return data;
}
