import enLocales from "./locales/en.json" with { type: "json" };
import esLocales from "./locales/es.json" with { type: "json" };
import pkg from "./package.json" with { type: "json" };
import { listUnreadMailMessagesQuery } from "./queries";
import router from "./router";

export default {
	name: "mail",
	pkgName: pkg.name,
	version: pkg.version,
	router,
	commands: {
		listUnreadMails: listUnreadMailMessagesQuery,
	},
	locales: {
		es: esLocales,
		en: enLocales,
	},
};
