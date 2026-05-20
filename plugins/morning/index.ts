import enLocales from "./locales/en.json" with { type: "json" };
import esLocales from "./locales/es.json" with { type: "json" };
import pkg from "./package.json" with { type: "json" };
import { morningBriefQuery } from "./queries/morning-brief";
import router from "./router";

export default {
	name: "morning",
	pkgName: pkg.name,
	version: pkg.version,
	router,
	commands: {
		brief: morningBriefQuery,
	},
	locales: {
		es: esLocales,
		en: enLocales,
	},
};
