import { listUnreadMailsCommand } from "./commands/list-unread-mails";
import enLocales from "./locales/en.json" with { type: "json" };
import esLocales from "./locales/es.json" with { type: "json" };
import pkg from "./package.json" with { type: "json" };
import router from "./router";

export default {
	name: "mail",
	pkgName: pkg.name,
	version: pkg.version,
	router,
	commands: {
		listUnreadMails: listUnreadMailsCommand,
	},
	locales: {
		es: esLocales,
		en: enLocales,
	},
};
