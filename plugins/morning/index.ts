import { morningBriefCommand } from "./commands/morning-brief";
import enLocales from "./locales/en.json" with { type: "json" };
import esLocales from "./locales/es.json" with { type: "json" };
import router from "./router";

export default {
	name: "morning",
	router,
	commands: {
		brief: morningBriefCommand,
	},
	locales: {
		es: esLocales,
		en: enLocales,
	},
};
