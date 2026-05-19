import type { Plugin } from "@/lib/plugins/registry";
import enLocales from "./locales/en.json" with { type: "json" };
import esLocales from "./locales/es.json" with { type: "json" };
import pkg from "./package.json" with { type: "json" };
import { getForecastQuery } from "./queries/get-forecast";
import router from "./router";

export default {
	name: "weather",
	pkgName: pkg.name,
	version: pkg.version,
	router,
	commands: {
		getForecast: getForecastQuery,
	},
	locales: {
		es: esLocales,
		en: enLocales,
	},
} satisfies Plugin;
