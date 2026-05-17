
export type Address = {
  amenity: string;
  house_number: string;
  road: string;
  neighbourhood: string;
  quarter: string;
  suburb: string;
  town: string;
  province: string;
  "ISO3166-2-lvl6": string;
  postcode: string;
  "ISO3166-2-lvl4": string;
  country: string;
  country_code: string;
}

export type Place = {
  place_id: number;
  license: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: Address;
  boundingbox: string[];
}