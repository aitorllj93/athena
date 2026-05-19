import enLocales from "./locales/en.json" with { type: "json" };
import esLocales from "./locales/es.json" with { type: "json" };
import pkg from "./package.json" with { type: "json" };
import { listUpcomingEventsQuery } from "./queries";
import router from "./router";

export default {
	name: "calendar",
	pkgName: pkg.name,
	version: pkg.version,
	router,
	commands: {
		listUpcomingEvents: listUpcomingEventsQuery,
	},
	locales: {
		es: esLocales,
		en: enLocales,
	},
};
