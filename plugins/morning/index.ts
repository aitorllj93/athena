import { morningBriefCommand } from "./commands/morning-brief";
import enLocales from "./locales/en.json" with { type: "json" };
import esLocales from "./locales/es.json" with { type: "json" };
import pkg from "./package.json" with { type: "json" };
import router from "./router";

export default {
	name: "morning",
	pkgName: pkg.name,
	version: pkg.version,
	router,
	commands: {
		brief: morningBriefCommand,
	},
	locales: {
		es: esLocales,
		en: enLocales,
	},
};
