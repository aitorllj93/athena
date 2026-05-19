import type { Plugin } from "@/lib/plugins/registry";
import enLocales from "./locales/en.json" with { type: "json" };
import esLocales from "./locales/es.json" with { type: "json" };
import pkg from "./package.json" with { type: "json" };
import { getAddressQuery } from "./queries";
import router from "./router";

export default {
	name: "map",
	pkgName: pkg.name,
	version: pkg.version,
	router,
	commands: {
		getAddress: getAddressQuery,
	},
	locales: {
		en: enLocales,
		es: esLocales,
	},
} satisfies Plugin;
