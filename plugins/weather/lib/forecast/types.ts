
type DailyForecast = {
	time: string[];
	temperature_2m_max: number[];
	temperature_2m_min: number[];
	weather_code: number[];
	temperature_2m_mean: number[];
};

type HourlyForecast = {
	time: string[];
	temperature_2m: number;
	weather_code: number[];
};

type Units<TForecast> = Record<keyof TForecast, string>;

export type Forecast = {
	latitude: number;
	longitude: number;
	generationtime_ms: number;
	utc_offset_seconds: number;
	timezone: string;
	timezone_abbreviation: string;
	elevation: number;
  daily: DailyForecast;
  daily_units: Units<DailyForecast>;
	hourly: HourlyForecast;
  hourly_units: Units<HourlyForecast>;
};