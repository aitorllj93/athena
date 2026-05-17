import { getForecastCommand } from "./commands/get-forecast";
import enLocales from "./locales/en.json" with { type: "json" };
import esLocales from "./locales/es.json" with { type: "json" };
import router from "./router";

export default {
	name: "weather",
	router,
	commands: {
		getForecast: getForecastCommand,
	},
	locales: {
		es: esLocales,
		en: enLocales,
	},
};
