import type { Place } from "./types";

const REVERSE_LOCATION_API_ENDPOINT = "https://nominatim.openstreetmap.org/reverse";
const REVERSE_LOCATION_API_FORMAT = "jsonv2";

type ReverseLocationParams = {
  lat: number;
  lng: number;
};
export async function reverseLocation({
  lat,
  lng,
}: ReverseLocationParams): Promise<Place> {
  const url = new URL(REVERSE_LOCATION_API_ENDPOINT);
  url.searchParams.append("format", REVERSE_LOCATION_API_FORMAT);
  url.searchParams.append("lat", lat.toString());
  url.searchParams.append("lon", lng.toString());

  const res = await fetch(url);

  const data = (await res.json()) as Place;

  return data;
}
