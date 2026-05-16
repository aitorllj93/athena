import type { Place } from "./types";

export function formatPlaceAddressShort(place: Place) {
  return place.address.town ?? place.address.province;
}