import type { Plugin } from "@/lib/plugins/registry";
import { getForecastCommand } from "./commands/get-forecast";
import enLocales from "./locales/en.json" with { type: "json" };
import esLocales from "./locales/es.json" with { type: "json" };
import pkg from "./package.json" with { type: "json" };
import router from "./router";

export default {
	name: "weather",
	pkgName: pkg.name,
	version: pkg.version,
	router,
	commands: {
		getForecast: getForecastCommand,
	},
	locales: {
		es: esLocales,
		en: enLocales,
	},
} satisfies Plugin;
